import { useEffect, useRef, useState } from 'react'
import { useEngine } from '../../state/store'
import type { ObjectType } from '../../types'
import { downloadFile } from '../../utils/storage'
import { glRef } from './Viewport'

const GEOMETRY: ObjectType[] = ['cube', 'sphere', 'plane', 'cylinder', 'cone', 'torus']
const LIGHTS: ObjectType[] = ['point', 'sun']
const LABEL: Record<string, string> = {
  cube: 'Cube',
  sphere: 'Sphere',
  plane: 'Plane',
  cylinder: 'Cylinder',
  cone: 'Cone',
  torus: 'Torus',
  point: 'Point Light',
  sun: 'Sun',
}

export default function Toolbar({ isMobile }: { isMobile: boolean }) {
  const project = useEngine((s) => s.project)
  const mode = useEngine((s) => s.mode)
  const setMode = useEngine((s) => s.setMode)
  const snap = useEngine((s) => s.snap)
  const toggleSnap = useEngine((s) => s.toggleSnap)
  const addObject = useEngine((s) => s.addObject)
  const saveProject = useEngine((s) => s.saveProject)
  const backToProjects = useEngine((s) => s.backToProjects)
  const toast = useEngine((s) => s.toast)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const onSnapshot = () => {
    const gl = glRef.current
    if (!gl) return
    const dataUrl = gl.domElement.toDataURL('image/png')
    const filename = (project?.name.replace(/[^a-z0-9-_]+/gi, '_') || 'render') + '.png'
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
    toast('Snapshot saved')
  }

  if (!project) return null

  return (
    <div
      className="panel border-b flex items-center gap-2 px-2 overflow-x-auto"
      style={{ paddingTop: 'calc(6px + env(safe-area-inset-top, 0px))', paddingBottom: 6 }}
    >
      <button className="btn" onClick={backToProjects} title="Back to Projects">
        ☰ <span className="hidden sm:inline">Projects</span>
      </button>

      <div className="relative" ref={menuRef}>
        <button className="btn btn-active" onClick={() => setMenuOpen((v) => !v)}>
          + Add ▾
        </button>
        {menuOpen && (
          <div className="panel border rounded p-2 grid grid-cols-2 gap-1 absolute z-30" style={{ top: 36, left: 0, width: 220 }}>
            <div className="text-[10px] col-span-2" style={{ color: '#8b93a0' }}>
              GEOMETRY
            </div>
            {GEOMETRY.map((t) => (
              <button
                key={t}
                className="btn"
                onClick={() => {
                  addObject(t)
                  setMenuOpen(false)
                }}
              >
                {LABEL[t]}
              </button>
            ))}
            <div className="text-[10px] col-span-2 mt-1" style={{ color: '#8b93a0' }}>
              LIGHTS
            </div>
            {LIGHTS.map((t) => (
              <button
                key={t}
                className="btn"
                onClick={() => {
                  addObject(t)
                  setMenuOpen(false)
                }}
              >
                {LABEL[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-5 shrink-0" style={{ background: '#2b2f36' }} />
      <button className={'btn' + (mode === 'translate' ? ' btn-active' : '')} title="Move (W)" onClick={() => setMode('translate')}>
        {isMobile ? 'W' : 'Move'}
      </button>
      <button className={'btn' + (mode === 'rotate' ? ' btn-active' : '')} title="Rotate (E)" onClick={() => setMode('rotate')}>
        {isMobile ? 'E' : 'Rotate'}
      </button>
      <button className={'btn' + (mode === 'scale' ? ' btn-active' : '')} title="Scale (R)" onClick={() => setMode('scale')}>
        {isMobile ? 'R' : 'Scale'}
      </button>

      <div className="w-px h-5 shrink-0" style={{ background: '#2b2f36' }} />
      <button className={'btn' + (snap ? ' btn-active' : '')} onClick={toggleSnap} title="Toggle snapping">
        {isMobile ? '🧲' : `Snap: ${snap ? 'On' : 'Off'}`}
      </button>

      <div className="flex-1" />
      <span className="text-xs hidden md:inline" style={{ color: '#8b93a0' }}>
        {project.name}
      </span>
      <button className="btn" onClick={onSnapshot} title="Snapshot PNG">
        📷 <span className="hidden sm:inline">Snapshot PNG</span>
      </button>
      <button
        className="btn"
        title="Export project JSON"
        onClick={() =>
          downloadFile(
            project.name.replace(/[^a-z0-9-_]+/gi, '_') + '.json',
            JSON.stringify({ name: project.name, data: project.data }, null, 2),
            'application/json'
          )
        }
      >
        {isMobile ? '⇩' : 'Export JSON'}
      </button>
      <button className="btn btn-active" onClick={saveProject} title="Save (Ctrl/Cmd+S)">
        {isMobile ? '💾' : 'Save (⌘S)'}
      </button>
    </div>
  )
}
