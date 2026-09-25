import { useRef } from 'react'
import type { Mesh, Object3D } from 'three'
import type { SceneObjectData } from '../../types'
import { isLight, isMesh } from '../../types'

interface Props {
  data: SceneObjectData
  onSelect: (id: string) => void
  onRef: (id: string, obj: Object3D | null) => void
}

function Geometry({ type }: { type: SceneObjectData['type'] }) {
  switch (type) {
    case 'cube':
      return <boxGeometry args={[1, 1, 1]} />
    case 'sphere':
      return <sphereGeometry args={[0.6, 32, 16]} />
    case 'plane':
      return <planeGeometry args={[1, 1]} />
    case 'cylinder':
      return <cylinderGeometry args={[0.5, 0.5, 1, 24]} />
    case 'cone':
      return <coneGeometry args={[0.5, 1, 24]} />
    case 'torus':
      return <torusGeometry args={[0.5, 0.2, 16, 48]} />
    default:
      return null
  }
}

export default function SceneObjectView({ data, onSelect, onRef }: Props) {
  const meshRef = useRef<Mesh>(null)

  if (!data.visible) return null

  if (isMesh(data.type)) {
    return (
      <mesh
        ref={(o) => {
          meshRef.current = o
          onRef(data.id, o)
        }}
        name={data.name}
        position={data.position}
        rotation={data.rotation}
        scale={data.scale}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          onSelect(data.id)
        }}
      >
        <Geometry type={data.type} />
        <meshStandardMaterial
          color={data.props.color ?? '#c7ccd3'}
          metalness={data.props.metalness ?? 0.1}
          roughness={data.props.roughness ?? 0.7}
        />
      </mesh>
    )
  }

  if (isLight(data.type)) {
    const color = data.props.color ?? '#ffffff'
    const intensity = data.props.intensity ?? 1
    return (
      <group
        ref={(o) => onRef(data.id, o)}
        name={data.name}
        position={data.position}
        rotation={data.rotation}
        scale={data.scale}
      >
        {data.type === 'point' && <pointLight color={color} intensity={intensity} castShadow shadow-mapSize={[1024, 1024]} />}
        {data.type === 'sun' && (
          <directionalLight
            color={color}
            intensity={intensity}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-near={0.5}
            shadow-camera-far={40}
          />
        )}
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            onSelect(data.id)
          }}
        >
          {data.type === 'point' ? <sphereGeometry args={[0.1, 12, 8]} /> : <coneGeometry args={[0.12, 0.3, 10]} />}
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    )
  }

  return null
}
