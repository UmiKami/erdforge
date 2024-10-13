import { useDnD } from "../store/DnDContext"

const Toolbar = () => {
  const [_, setType] = useDnD()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className='w-screen bg-neutral-800 text-white px-40'>
      <ul className='list-none flex gap-6'>
        <li>Single Select</li>
        <li>Multi Select</li>
        <span>|</span>
        <li onDragStart={(event) => onDragStart(event, 'default')} draggable>Insert Table</li>
      </ul>
    </div>
  )
}

export default Toolbar