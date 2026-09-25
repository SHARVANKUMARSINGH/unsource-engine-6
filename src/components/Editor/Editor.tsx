import { useState } from 'react'
import useIsMobile from '../../hooks/useIsMobile'
import Toolbar from './Toolbar'
import Hierarchy from './Hierarchy'
import Viewport from './Viewport'
import Inspector from './Inspector'
import PanelShell from './PanelShell'
import EdgeTab from './EdgeTab'

export default function Editor() {
  const isMobile = useIsMobile()
  const [hierarchyOpen, setHierarchyOpen] = useState(true)
  const [inspectorOpen, setInspectorOpen] = useState(true)
  const [hierarchyWidth, setHierarchyWidth] = useState(200)
  const [inspectorWidth, setInspectorWidth] = useState(230)
  const [mobileSheet, setMobileSheet] = useState<'hierarchy' | 'inspector' | null>(null)

  if (isMobile) {
    return (
      <div className="flex flex-col w-full h-full">
        <Toolbar isMobile />
        <div className="flex-1 relative min-h-0">
          <Viewport />
        </div>
        <div
          className="panel border-t flex items-stretch"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <button className="btn flex-1 rounded-none py-2.5" onClick={() => setMobileSheet('hierarchy')}>
            🧭 Objects
          </button>
          <button className="btn flex-1 rounded-none py-2.5" onClick={() => setMobileSheet('inspector')}>
            🎛 Properties
          </button>
        </div>

        {mobileSheet && (
          <div
            className="fixed inset-x-0 bottom-0 z-40 panel border-t flex flex-col"
            style={{ height: '55vh', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: '#2b2f36' }}>
              <span className="section-title" style={{ margin: 0 }}>
                {mobileSheet === 'hierarchy' ? 'Hierarchy' : 'Inspector'}
              </span>
              <button className="btn" onClick={() => setMobileSheet(null)}>
                ✕ Close
              </button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">{mobileSheet === 'hierarchy' ? <Hierarchy /> : <Inspector />}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Toolbar isMobile={false} />
      <div className="flex flex-1 min-h-0">
        {hierarchyOpen ? (
          <PanelShell side="left" title="Hierarchy" width={hierarchyWidth} onWidthChange={setHierarchyWidth} onClose={() => setHierarchyOpen(false)}>
            <Hierarchy />
          </PanelShell>
        ) : (
          <EdgeTab side="left" label="Hierarchy" onClick={() => setHierarchyOpen(true)} />
        )}

        <Viewport />

        {inspectorOpen ? (
          <PanelShell side="right" title="Inspector" width={inspectorWidth} onWidthChange={setInspectorWidth} onClose={() => setInspectorOpen(false)}>
            <Inspector />
          </PanelShell>
        ) : (
          <EdgeTab side="right" label="Inspector" onClick={() => setInspectorOpen(true)} />
        )}
      </div>
    </div>
  )
}
