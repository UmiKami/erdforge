import { useDispatch, useSelector } from "react-redux";
import { useDnD } from "../store/DnDContext"
import { AppDispatch, RootState } from "../store/store";
import { multiSelect, singleSelect } from "../store/erdTools/erdToolsSlice";
import { FaArrowPointer } from "react-icons/fa6";
import { PiSelectionBold } from "react-icons/pi";
import { TbTablePlus } from "react-icons/tb";

const Toolbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isSingleSelect = useSelector((state: RootState) => state.erdTools.singleSelect)
  const isMultiSelect = useSelector((state: RootState) => state.erdTools.multiSelect)

  const [_, setType] = useDnD()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className='w-screen bg-[#040403] text-white px-40 py-2'>
      <ul className='list-none flex gap-6 text-[#C3E8BD] items-center justify-center text-xl'>
        <li className={isSingleSelect ? "cursor-pointer text-[#a0e6eb] hover:animate-pulse active:scale-95" : "active:scale-95 hover:animate-pulse cursor-pointer hover:text-[#8EB897]"} onClick={() => dispatch(singleSelect())}><FaArrowPointer /></li>
        <li className={isMultiSelect ? "cursor-pointer text-[#a0e6eb] hover:animate-pulse active:scale-95" : "active:scale-95 hover:animate-pulse cursor-pointer hover:text-[#8EB897]"} onClick={() => dispatch(multiSelect())}><PiSelectionBold />
        </li>
        <span>|</span>
        <li className="cursor-grab active:cursor-grabbing hover:text-[#8EB897]" onDragStart={(event) => onDragStart(event, 'default')} draggable><TbTablePlus /></li>
      </ul>
    </div>
  )
}

export default Toolbar