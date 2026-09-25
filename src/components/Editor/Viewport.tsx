import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import type { Object3D } from 'three'
import { useEngine } from '../../state/store'
import SceneObjectView from './SceneObjectView'

// Exposed so the toolbar can grab a PNG snapshot of the live render.
export const glRef: { current: THREE.WebGLRenderer | null } = { current: null }

function CaptureGl() {
  const { gl } = useThree()
  useEffect(() => {
    glRef.current = gl
  }, [gl])
  return null
}

function SceneContent({ objectRefs }: { objectRefs: React.MutableRefObject<Map<string, Object3D>> }) {
  const project = useEngine((s) => s.project)
  const select = useEngine((s) => s.select)

  if (!project) return null
  return (
    <>
      {project.data.objects.map((d) => (
        <SceneObjectView
          key={d.id}
          data={d}
          onSelect={select}
          onRef={(id, obj) => {
            if (obj) objectRefs.current.set(id, obj)
            else objectRefs.current.delete(id)
          }}
        />
      ))}
    </>
  )
}

export default function Viewport() {
  const project = useEngine((s) => s.project)
  const selectedId = useEngine((s) => s.selectedId)
  const select = useEngine((s) => s.select)
  const mode = useEngine((s) => s.mode)
  const snap = useEngine((s) => s.snap)
  const setMode = useEngine((s) => s.setMode)
  const updateObject = useEngine((s) => s.updateObject)
  const deleteObject = useEngine((s) => s.deleteObject)
  const saveProject = useEngine((s) => s.saveProject)

  const objectRefs = useRef<Map<string, Object3D>>(new Map())
  const orbitRef = useRef<any>(null)
  const xformRef = useRef<any>(null)
  const [stats, setStats] = useState({ fps: 0, tris: 0, calls: 0 })

  const selectedObj = selectedId ? objectRefs.current.get(selectedId) ?? null : null

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName || ''
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        saveProject()
        return
      }
      if (e.key === 'w') setMode('translate')
      else if (e.key === 'e') setMode('rotate')
      else if (e.key === 'r') setMode('scale')
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault()
          deleteObject(selectedId)
        }
      } else if (e.key.toLowerCase() === 'f' && selectedObj && orbitRef.current) {
        orbitRef.current.target.copy(selectedObj.position)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, selectedObj, setMode, deleteObject, saveProject])

  // FPS counter
  useEffect(() => {
    let raf = 0
    let frames = 0
    let last = performance.now()
    const loop = () => {
      frames++
      const now = performance.now()
      if (now - last > 500) {
        const gl = glRef.current
        setStats({
          fps: Math.round((frames * 1000) / (now - last)),
          tris: gl ? gl.info.render.triangles : 0,
          calls: gl ? gl.info.render.calls : 0,
        })
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onObjectChange = () => {
    if (!selectedId || !selectedObj) return
    updateObject(selectedId, {
      position: selectedObj.position.toArray() as [number, number, number],
      rotation: [selectedObj.rotation.x, selectedObj.rotation.y, selectedObj.rotation.z],
      scale: selectedObj.scale.toArray() as [number, number, number],
    })
  }

  const snapT = snap ? 0.5 : undefined
  const snapR = snap ? THREE.MathUtils.degToRad(15) : undefined
  const snapS = snap ? 0.25 : undefined

  const objectCount = project?.data.objects.length ?? 0

  return (
    <div className="flex-1 relative min-w-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [4, 3.2, 6], fov: 50, near: 0.05, far: 500 }}
        onPointerMissed={() => select(null)}
      >
        <CaptureGl />
        <color attach="background" args={['#14161a']} />
        <hemisphereLight color={0x6b7280} groundColor={0x14161a} intensity={0.9} />
        <ambientLight intensity={0.25} />
        <gridHelper args={[20, 20, 0x3a3f47, 0x24272d]} />
        <axesHelper args={[1.2]} />

        <SceneContent objectRefs={objectRefs} />

        {selectedObj && (
          <TransformControls
            ref={xformRef}
            object={selectedObj}
            mode={mode}
            translationSnap={snapT}
            rotationSnap={snapR}
            scaleSnap={snapS}
            onObjectChange={onObjectChange}
            onMouseDown={() => {
              if (orbitRef.current) orbitRef.current.enabled = false
            }}
            onMouseUp={() => {
              if (orbitRef.current) orbitRef.current.enabled = true
            }}
          />
        )}

        <OrbitControls ref={orbitRef} makeDefault target={[0, 0.5, 0]} enableDamping dampingFactor={0.08} />
      </Canvas>

      <div className="absolute bottom-2 left-2 text-[10px] font-mono panel border rounded px-2 py-1" style={{ color: '#9aa1ab' }}>
        FPS {stats.fps} · Objects {objectCount} · Tris {stats.tris} · Calls {stats.calls}
      </div>
      {!selectedId && (
        <div className="absolute inset-0 flex items-center justify-center text-xs pointer-events-none" style={{ color: '#5b6270' }}>
          Select an object, or use + Add to create one
        </div>
      )}
    </div>
  )
}
