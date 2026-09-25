export type ObjectType = 'cube' | 'sphere' | 'plane' | 'cylinder' | 'cone' | 'torus' | 'point' | 'sun'

export type Vec3 = [number, number, number]

export interface ObjectProps {
  color?: string
  metalness?: number
  roughness?: number
  intensity?: number
}

export interface SceneObjectData {
  id: string
  type: ObjectType
  name: string
  visible: boolean
  position: Vec3
  rotation: Vec3 // radians
  scale: Vec3
  props: ObjectProps
}

export interface ProjectData {
  objects: SceneObjectData[]
}

export interface ProjectMeta {
  id: string
  name: string
  data: ProjectData
  updatedAt: number
}

export const MESH_TYPES: ObjectType[] = ['cube', 'sphere', 'plane', 'cylinder', 'cone', 'torus']
export const LIGHT_TYPES: ObjectType[] = ['point', 'sun']
export const isMesh = (t: ObjectType) => MESH_TYPES.includes(t)
export const isLight = (t: ObjectType) => LIGHT_TYPES.includes(t)

export const TYPE_LABEL: Record<ObjectType, string> = {
  cube: 'Cube',
  sphere: 'Sphere',
  plane: 'Plane',
  cylinder: 'Cylinder',
  cone: 'Cone',
  torus: 'Torus',
  point: 'Point Light',
  sun: 'Sun',
}
