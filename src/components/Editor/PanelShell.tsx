import { useRef } from 'react'

interface Props {
  side: 'left' | 'right'
  title: string
  width: number
  onWidthChange: (w: number) => void
  onClose: () => void
  children: React.ReactNode
  minWidth?: number
  maxWidth?: number
}

export default function PanelShell({ side, title, width, onWidthChange, onClose, children, minWidth = 160, maxWidth = 420 }: Props) {
  const startRef = useRef<{ x: number; w: number } | null>(null)

  const onDragStart = (e: React.PointerEvent) => {
    startRef.current = { x: e.clientX, w: width }
    const onMove = (ev: PointerEvent) => {
      if (!startRef.current) return
      const dx = ev.clientX - startRef.current.x
      const next = side === 'left' ? startRef.current.w + dx : startRef.current.w - dx
      onWidthChange(Math.min(maxWidth, Math.max(minWidth, next)))
    }
    const onUp = () => {
      startRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className={'panel relative flex flex-col ' + (side === 'left' ? 'border-r' : 'border-l')} style={{ width }}>
      <div className="flex items-center justify-between px-2 py-1.5 border-b" style={{ borderColor: '#2b2f36' }}>
        <span className="section-title" style={{ margin: 0 }}>
          {title}
        </span>
        <button className="text-[11px] btn" style={{ padding: '2px 6px' }} title={`Hide ${title}`} onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="flex-1 p-2 overflow-y-auto">{children}</div>
      <div
        onPointerDown={onDragStart}
        className="absolute top-0 bottom-0"
        style={{
          [side === 'left' ? 'right' : 'left']: -3,
          width: 6,
          cursor: 'col-resize',
          zIndex: 20,
        }}
      />
    </div>
  )
}
