import { useEngine } from './state/store'
import ProjectManager from './components/ProjectManager'
import Editor from './components/Editor/Editor'

export default function App() {
  const project = useEngine((s) => s.project)
  const toastMsg = useEngine((s) => s.toastMsg)

  return (
    <div className="w-full h-full flex flex-col">
      {project ? <Editor /> : <ProjectManager />}
      {toastMsg && (
        <div
          className="fixed z-50 text-xs panel border rounded px-3 py-2 shadow"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))', right: '1rem' }}
        >
          {toastMsg}
        </div>
      )}
    </div>
  )
}
