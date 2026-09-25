import { create } from 'zustand'
import type { ObjectType, ProjectMeta, SceneObjectData } from '../types'
import { isLight, TYPE_LABEL } from '../types'
import { demoScene, downloadFile, loadProjects, mkObj, saveProjects, uid } from '../utils/storage'

export type TransformMode = 'translate' | 'rotate' | 'scale'

interface EngineState {
  projects: Record<string, ProjectMeta>
  project: ProjectMeta | null
  selectedId: string | null
  mode: TransformMode
  snap: boolean
  toastMsg: string | null

  refreshProjects: () => void
  createProject: (name: string, template: 'demo' | 'empty') => void
  openProject: (id: string) => void
  backToProjects: () => void
  duplicateProject: (id: string) => void
  deleteProject: (id: string) => void
  importProjectJson: (json: string) => void
  exportProjectJson: (p: ProjectMeta) => void

  saveProject: () => void
  addObject: (type: ObjectType) => void
  updateObject: (id: string, patch: Partial<SceneObjectData>) => void
  updateProps: (id: string, patch: Partial<SceneObjectData['props']>) => void
  toggleVisible: (id: string) => void
  duplicateObject: (id: string) => void
  deleteObject: (id: string) => void
  select: (id: string | null) => void
  setMode: (m: TransformMode) => void
  toggleSnap: () => void
  toast: (msg: string) => void
}

export const useEngine = create<EngineState>((set, get) => ({
  projects: loadProjects(),
  project: null,
  selectedId: null,
  mode: 'translate',
  snap: false,
  toastMsg: null,

  refreshProjects: () => set({ projects: loadProjects() }),

  createProject: (name, template) => {
    const id = uid()
    const meta: ProjectMeta = {
      id,
      name: name.trim() || 'Untitled Project',
      data: template === 'demo' ? demoScene() : { objects: [] },
      updatedAt: Date.now(),
    }
    const projects = { ...get().projects, [id]: meta }
    saveProjects(projects)
    set({ projects, project: JSON.parse(JSON.stringify(meta)), selectedId: null })
  },

  openProject: (id) => {
    const meta = get().projects[id]
    if (!meta) return
    set({ project: JSON.parse(JSON.stringify(meta)), selectedId: null })
  },

  backToProjects: () => set({ project: null, selectedId: null, projects: loadProjects() }),

  duplicateProject: (id) => {
    const src = get().projects[id]
    if (!src) return
    const copy: ProjectMeta = { ...JSON.parse(JSON.stringify(src)), id: uid(), name: src.name + ' Copy', updatedAt: Date.now() }
    const projects = { ...get().projects, [copy.id]: copy }
    saveProjects(projects)
    set({ projects })
  },

  deleteProject: (id) => {
    const projects = { ...get().projects }
    delete projects[id]
    saveProjects(projects)
    set({ projects })
  },

  importProjectJson: (json) => {
    try {
      const parsed = JSON.parse(json)
      const id = uid()
      const meta: ProjectMeta = { id, name: parsed.name || 'Imported Project', data: parsed.data || { objects: [] }, updatedAt: Date.now() }
      const projects = { ...get().projects, [id]: meta }
      saveProjects(projects)
      set({ projects })
      get().toast('Imported "' + meta.name + '"')
    } catch {
      get().toast('Invalid project JSON')
    }
  },

  exportProjectJson: (p) => {
    downloadFile(
      p.name.replace(/[^a-z0-9-_]+/gi, '_') + '.json',
      JSON.stringify({ name: p.name, data: p.data }, null, 2),
      'application/json'
    )
  },

  saveProject: () => {
    const p = get().project
    if (!p) return
    const updated = { ...p, updatedAt: Date.now() }
    const projects = { ...get().projects, [p.id]: updated }
    saveProjects(projects)
    set({ projects, project: updated })
    get().toast('Project saved')
  },

  addObject: (type) => {
    const p = get().project
    if (!p) return
    const n = p.data.objects.length
    const count = p.data.objects.filter((o) => o.type === type).length + 1
    const x = ((n % 5) - 2) * 1.4
    const y = isLight(type) ? 2.2 : 0.5
    const props = isLight(type) ? { color: '#ffffff', intensity: 1.2 } : { color: '#c7ccd3', metalness: 0.1, roughness: 0.6 }
    const obj = mkObj(type, TYPE_LABEL[type] + ' ' + count, [x, y, 0], [0, 0, 0], [1, 1, 1], props)
    const next = { ...p, data: { objects: [...p.data.objects, obj] } }
    set({ project: next, selectedId: obj.id })
  },

  updateObject: (id, patch) => {
    const p = get().project
    if (!p) return
    const objects = p.data.objects.map((o) => (o.id === id ? { ...o, ...patch } : o))
    set({ project: { ...p, data: { objects } } })
  },

  updateProps: (id, patch) => {
    const p = get().project
    if (!p) return
    const objects = p.data.objects.map((o) => (o.id === id ? { ...o, props: { ...o.props, ...patch } } : o))
    set({ project: { ...p, data: { objects } } })
  },

  toggleVisible: (id) => {
    const p = get().project
    if (!p) return
    const objects = p.data.objects.map((o) => (o.id === id ? { ...o, visible: !o.visible } : o))
    set({ project: { ...p, data: { objects } } })
  },

  duplicateObject: (id) => {
    const p = get().project
    if (!p) return
    const src = p.data.objects.find((o) => o.id === id)
    if (!src) return
    const copy: SceneObjectData = { ...JSON.parse(JSON.stringify(src)), id: uid(), name: src.name + ' Copy' }
    copy.position = [src.position[0] + 0.6, src.position[1], src.position[2]]
    set({ project: { ...p, data: { objects: [...p.data.objects, copy] } }, selectedId: copy.id })
  },

  deleteObject: (id) => {
    const p = get().project
    if (!p) return
    const objects = p.data.objects.filter((o) => o.id !== id)
    set({ project: { ...p, data: { objects } }, selectedId: get().selectedId === id ? null : get().selectedId })
  },

  select: (id) => set({ selectedId: id }),
  setMode: (m) => set({ mode: m }),
  toggleSnap: () => set((s) => ({ snap: !s.snap })),
  toast: (msg) => {
    set({ toastMsg: msg })
    setTimeout(() => set((s) => (s.toastMsg === msg ? { toastMsg: null } : {})), 2200)
  },
}))
