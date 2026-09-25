import Toolbar from './Toolbar'
import Hierarchy from './Hierarchy'
import Viewport from './Viewport'
import Inspector from './Inspector'

export default function Editor() {
  return (
    <div className="flex flex-col w-full h-full">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        <Hierarchy />
        <Viewport />
        <Inspector />
      </div>
    </div>
  )
}
