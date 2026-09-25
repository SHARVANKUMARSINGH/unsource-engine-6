import { useRef, useState } from 'react'
import { useEngine } from '../state/store'

export default function ProjectManager() {
  const { projects, createProject, openProject, duplicateProject, deleteProject, importProjectJson, exportProjectJson, refreshProjects } =
    useEngine()
  const [name, setName] = useState('Untitled Project')
  const [template, setTemplate] = useState<'demo' | 'empty'>('demo')
  const fileRef = useRef<HTMLInputElement>(null)

  const list = Object.values(projects).sort((a, b) => b.updatedAt - a.updatedAt)

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      importProjectJson(String(r.result))
      refreshProjects()
    }
    r.readAsText(f)
    e.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: '#101215' }}>
      <div className="panel border rounded-lg w-full max-w-lg p-5" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <h1 className="text-lg font-semibold mb-1">Unsource Engine 6</h1>
        <p className="text-xs mb-4" style={{ color: '#8b93a0' }}>
          Browser-based 3D scene editor.
        </p>

        <div className="section-title" style={{ marginTop: 0 }}>
          New Project
        </div>
        <div className="flex gap-2 mb-2">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="flex-1" />
          <select value={template} onChange={(e) => setTemplate(e.target.value as 'demo' | 'empty')} className="btn" style={{ background: '#101215' }}>
            <option value="demo">Demo Scene</option>
            <option value="empty">Empty</option>
          </select>
        </div>
        <div className="flex gap-2 mb-5">
          <button className="btn btn-active" onClick={() => createProject(name, template)}>
            + Create Project
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Import Project JSON
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
        </div>

        <div className="section-title">Recent Projects</div>
        <div className="flex flex-col gap-1">
          {list.length === 0 && <div className="text-xs" style={{ color: '#5b6270' }}>No saved projects yet.</div>}
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-2 border rounded px-2 py-1.5" style={{ borderColor: '#2b2f36' }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate">{p.name}</div>
                <div className="text-[10px]" style={{ color: '#5b6270' }}>
                  {new Date(p.updatedAt).toLocaleString()}
                </div>
              </div>
              <button className="btn" onClick={() => openProject(p.id)}>
                Open
              </button>
              <button className="btn" onClick={() => duplicateProject(p.id)}>
                Duplicate
              </button>
              <button className="btn" onClick={() => exportProjectJson(p)}>
                Export
              </button>
              <button
                className="btn"
                onClick={() => {
                  if (confirm(`Delete "${p.name}"? This cannot be undone.`)) deleteProject(p.id)
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
