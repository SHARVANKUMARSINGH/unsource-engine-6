import { useEngine } from '../../state/store'

export default function Hierarchy() {
  const project = useEngine((s) => s.project)
  const selectedId = useEngine((s) => s.selectedId)
  const select = useEngine((s) => s.select)
  const toggleVisible = useEngine((s) => s.toggleVisible)
  const duplicateObject = useEngine((s) => s.duplicateObject)
  const deleteObject = useEngine((s) => s.deleteObject)

  if (!project?.data.objects.length) {
    return <div className="text-xs" style={{ color: '#5b6270' }}>No objects yet — use + Add.</div>
  }

  return (
    <div className="flex flex-col gap-0.5 text-xs">
      {project.data.objects.map((d) => (
        <div key={d.id} className={'hier-item' + (d.id === selectedId ? ' sel' : '')} onClick={() => select(d.id)}>
          <span className="flex-1 truncate">{d.name}</span>
          <button
            className="text-[11px]"
            title="Toggle visibility"
            onClick={(e) => {
              e.stopPropagation()
              toggleVisible(d.id)
            }}
          >
            {d.visible ? '👁' : '🚫'}
          </button>
          <button
            className="text-[11px]"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation()
              duplicateObject(d.id)
            }}
          >
            ⧉
          </button>
          <button
            className="text-[11px]"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              deleteObject(d.id)
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
