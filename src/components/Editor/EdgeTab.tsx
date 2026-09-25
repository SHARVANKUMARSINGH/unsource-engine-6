interface Props {
  side: 'left' | 'right'
  label: string
  onClick: () => void
}

export default function EdgeTab({ side, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      title={`Show ${label}`}
      className="panel flex items-center justify-center text-[10px]"
      style={{
        width: 20,
        borderRight: side === 'left' ? '1px solid #2b2f36' : undefined,
        borderLeft: side === 'right' ? '1px solid #2b2f36' : undefined,
        writingMode: 'vertical-rl',
        color: '#8b93a0',
        letterSpacing: '0.04em',
      }}
    >
      {side === 'left' ? '▸' : '◂'} {label}
    </button>
  )
}
