import * as THREE from 'three'
import { useEngine } from '../../state/store'
import { isLight, isMesh } from '../../types'

function NumRow({
  label,
  values,
  onChange,
  onCommit,
}: {
  label: string
  values: [number, number, number]
  onChange: (axis: 0 | 1 | 2, v: number) => void
  onCommit: () => void
}) {
  return (
    <div className="mb-2">
      <span className="lbl">{label}</span>
      <div className="grid grid-cols-3 gap-1">
        {values.map((v, i) => (
          <input
            key={i}
            type="number"
            step={0.05}
            value={Number(v.toFixed(3))}
            onFocus={onCommit}
            onChange={(e) => onChange(i as 0 | 1 | 2, parseFloat(e.target.value) || 0)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Inspector() {
  const project = useEngine((s) => s.project)
  const selectedId = useEngine((s) => s.selectedId)
  const updateObject = useEngine((s) => s.updateObject)
  const updateProps = useEngine((s) => s.updateProps)
  const commitHistory = useEngine((s) => s.commitHistory)

  const data = project?.data.objects.find((o) => o.id === selectedId)

  if (!data) {
    return (
      <div className="text-xs" style={{ color: '#8b93a0' }}>
        Nothing selected.
      </div>
    )
  }

  return (
    <div className="text-xs">
      <div className="mb-3">
        <span className="lbl">Name</span>
        <input type="text" value={data.name} onFocus={commitHistory} onChange={(e) => updateObject(data.id, { name: e.target.value })} />
      </div>

      <NumRow
        label="Position"
        values={data.position}
        onCommit={commitHistory}
        onChange={(ax, v) => {
          const p = [...data.position] as [number, number, number]
          p[ax] = v
          updateObject(data.id, { position: p })
        }}
      />
      <NumRow
        label="Rotation (deg)"
        values={data.rotation.map((r) => THREE.MathUtils.radToDeg(r)) as [number, number, number]}
        onCommit={commitHistory}
        onChange={(ax, v) => {
          const r = [...data.rotation] as [number, number, number]
          r[ax] = THREE.MathUtils.degToRad(v)
          updateObject(data.id, { rotation: r })
        }}
      />
      <NumRow
        label="Scale"
        values={data.scale}
        onCommit={commitHistory}
        onChange={(ax, v) => {
          const s = [...data.scale] as [number, number, number]
          s[ax] = v
          updateObject(data.id, { scale: s })
        }}
      />

      {isMesh(data.type) && (
        <>
          <div className="section-title">Material</div>
          <div className="mb-2">
            <span className="lbl">Color</span>
            <input
              type="color"
              value={data.props.color}
              onPointerDown={commitHistory}
              onChange={(e) => updateProps(data.id, { color: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <span className="lbl">Metalness {(data.props.metalness ?? 0).toFixed(2)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={data.props.metalness ?? 0}
              onPointerDown={commitHistory}
              onChange={(e) => updateProps(data.id, { metalness: parseFloat(e.target.value) })}
            />
          </div>
          <div className="mb-2">
            <span className="lbl">Roughness {(data.props.roughness ?? 0.7).toFixed(2)}</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={data.props.roughness ?? 0.7}
              onPointerDown={commitHistory}
              onChange={(e) => updateProps(data.id, { roughness: parseFloat(e.target.value) })}
            />
          </div>
        </>
      )}

      {isLight(data.type) && (
        <>
          <div className="section-title">Light</div>
          <div className="mb-2">
            <span className="lbl">Color</span>
            <input
              type="color"
              value={data.props.color}
              onPointerDown={commitHistory}
              onChange={(e) => updateProps(data.id, { color: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <span className="lbl">Intensity {(data.props.intensity ?? 1).toFixed(2)}</span>
            <input
              type="range"
              min={0}
              max={5}
              step={0.05}
              value={data.props.intensity ?? 1}
              onPointerDown={commitHistory}
              onChange={(e) => updateProps(data.id, { intensity: parseFloat(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  )
}
