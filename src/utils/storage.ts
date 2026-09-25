import type { ProjectData, ProjectMeta, SceneObjectData, ObjectType } from '../types'

const LS_KEY = 'use6_projects_v1'
let idCounter = 1
export const uid = () => 'o' + idCounter++ + '_' + Date.now().toString(36)

export function loadProjects(): Record<string, ProjectMeta> {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveProjects(projects: Record<string, ProjectMeta>) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects))
}

export function mkObj(
  type: ObjectType,
  name: string,
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number],
  props: SceneObjectData['props']
): SceneObjectData {
  return { id: uid(), type, name, visible: true, position, rotation, scale, props }
}

export function demoScene(): ProjectData {
  return {
    objects: [
      mkObj('plane', 'Ground', [0, 0, 0], [-Math.PI / 2, 0, 0], [12, 12, 1], { color: '#3a3d44', metalness: 0, roughness: 0.95 }),
      mkObj('cube', 'Cube', [-1.3, 0.5, 0], [0, 0.4, 0], [1, 1, 1], { color: '#c7ccd3', metalness: 0.9, roughness: 0.15 }),
      mkObj('sphere', 'Sphere', [1.3, 0.5, 0], [0, 0, 0], [1, 1, 1], { color: '#d1493f', metalness: 0, roughness: 0.85 }),
      mkObj('point', 'Point Light', [2.2, 2.4, 1.6], [0, 0, 0], [1, 1, 1], { color: '#ffffff', intensity: 1.4 }),
      mkObj('sun', 'Sun', [3, 5, 2], [0, 0, 0], [1, 1, 1], { color: '#fff2df', intensity: 1.6 }),
    ],
  }
}

export function downloadFile(filename: string, content: string | Blob, mime = 'application/octet-stream') {
  const blob = typeof content === 'string' ? new Blob([content], { type: mime }) : content
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
