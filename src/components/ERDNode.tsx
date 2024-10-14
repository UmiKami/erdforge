import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { RiInsertRowBottom } from 'react-icons/ri';
import { IoKey } from 'react-icons/io5';
import { TbHexagonLetterUFilled } from 'react-icons/tb';
import { GiHouseKeys } from 'react-icons/gi';
import NN from "../assets/NotNull.svg?react"
import "../styles/ERDNode.css"

const NodeLabel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
`;

const FieldRow = styled.div`
  display: flex;
  margin-bottom: 5px;
  border-radius: 3px;
`;

const InputField = styled.input`
  margin-right: 5px;
  border-radius: 3px;
  flex: 1; /* Makes the inputs take up available space */
`;

interface errors {
    invalidEntityName: boolean;
    invalidKeyCombination: boolean;
}

// Custom node component
const TableNode: React.FC<NodeProps> = ({ data, selected }) => {


    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const fieldNameRef = useRef<HTMLInputElement>(null); // Create a reference for the field name input

    const [isPrimaryKey, setIsPrimaryKey] = useState(false)
    const [isForeignKey, setIsForeignKey] = useState(false)
    const [isUnique, setIsUnique] = useState(false)
    const [isNullable, setIsNullable] = useState(false)

    const [errors, setErrrors] = useState<errors>({
        invalidEntityName: false,
        invalidKeyCombination: false
    })

    const handleFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldName(e.target.value);
    };

    const handleFieldTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldType(e.target.value);
    };

    const handleAddField = () => {
        if (isPrimaryKey && isForeignKey) {
            setErrrors((state: errors) => {
                return {
                    ...state,
                    invalidKeyCombination: true
                }
            })

            return;
        }

        if (fieldName && fieldType) {
            data.onAddField(fieldName, fieldType, isPrimaryKey, isForeignKey, isUnique, isNullable);
            setFieldName(''); // Reset field name input
            setFieldType(''); // Reset field type input
            setIsPrimaryKey(false)
            setIsForeignKey(false)
            setIsUnique(false)
            setIsNullable(false)
            fieldNameRef.current?.focus(); // Set focus back to the field name input
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setErrrors({
                invalidEntityName: false,
                invalidKeyCombination: false
            })
        }, 5000)

        return () => clearTimeout(timeout)
    }, [errors])

    const handleDoubleClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent event from bubbling up to the parent
    };

    const [isEditing, setIsEditing] = useState(true)
    const [handleStyle, setHandleStyle] = useState('hidden w-0 h-0')

    const backgroundGradientEffect = false

    return (
        <NodeLabel className={`text-palette-100 bg-palette-500 border border-palette-400 ${(selected && backgroundGradientEffect) ? "animated-shadow" : selected ? "border-yellow-100" : ""}`} onDoubleClick={handleDoubleClick} onMouseLeave={() => setHandleStyle('hidden w-0 h-0')} onMouseEnter={() => setHandleStyle('w-3 h-3 block bg-palette-100')}>
            {/* Table Name Input */}
            <input
                type="text"
                className={!isEditing && "bg-palette-500 placeholder:text-white text-center text-xl focus:outline-none cursor-grab rounded" || "focus:outline-none focus:ring-1 ring-palette-100 placeholder:text-palette-300 rounded text-center text-xl bg-palette-100 text-palette-500"}
                readOnly={!isEditing}
                onDoubleClick={() => {
                    setIsEditing(true)
                    console.log("Double Clicked");

                }}
                onKeyDown={(e) => (e.key == "Enter" || e.key == "Tab") && setIsEditing(false)}
                value={data.label}
                onChange={(e) => data.onNameChange(e.target.value)}
                placeholder="Table Name"
            />
            {/* Fields Header */}
            <div>
                <hr className='my-4' />
            </div>
            {/* Render existing fields */}
            {data.fields.map((field: { name: string; type: string, isPrimaryKey: boolean, isForeignKey: boolean, isUnique: boolean, isNullable: boolean }, index: number) => (
                <div key={index}>
                    <Handle className={handleStyle} id={index.toString()} type='source' position={Position.Left} style={{ top: 85 + 30 * index }} />
                    <FieldRow key={index} className='justify-between'>
                        <span className='w-32'>{field.name}</span>

                        <span className='text-start'>{field.type}</span>

                        <div className="w-32 flex items-center text-xl justify-center gap-2">
                            {field.isPrimaryKey && <span ><IoKey className='w-6 flex justify-center text-yellow-300' /></span>}
                            {field.isForeignKey && <span className='w-6 flex justify-center text-palette-200' ><GiHouseKeys /></span>}
                            {field.isUnique && <span className='w-6 flex justify-center '><TbHexagonLetterUFilled /></span>}
                            {!field.isNullable && !field.isPrimaryKey && <NN className="noCross w-6 flex justify-center" height="23" width="23" />}
                        </div>
                    </FieldRow>
                    <Handle className={handleStyle} id={(index * 2).toString()} type='target' position={Position.Right} style={{ top: 85 + 30 * index, backgroundColor: "#bde2e8" }} />
                </div>
            ))}
            {/* New Field Inputs */}
            <FieldRow>
                <InputField
                    ref={fieldNameRef} // Attach the ref to the first input field
                    type="text"
                    value={fieldName}
                    onChange={handleFieldNameChange}
                    placeholder="Column Name"
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500'
                />
                <InputField
                    onKeyDown={(e) => (e.key === "Enter" || e.key === "Tab") && handleAddField()}
                    type="text"
                    value={fieldType}
                    onChange={handleFieldTypeChange}
                    placeholder="Data Type"
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500'
                />
                <button onClick={() => setIsPrimaryKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-yellow-400 hover:text-white border-yellow-400 mx-1 text-[#a6af2d] text-xl px-2 rounded ${isPrimaryKey && " text-white bg-yellow-400 hover:bg-transparent"}`}><IoKey /></button>
                <button onClick={() => setIsForeignKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-[#2d9baf] hover:text-white border-[#2d9baf] mx-1 text-[#2d9baf] text-xl px-2 rounded ${isForeignKey && " text-white bg-[#2a98ac] b hover:bg-transparent"}`}><GiHouseKeys /></button>
                <button onClick={() => setIsUnique(state => !state)} className={`bg-[#f0ffed] transition-all ease-in-out hover:bg-palette-400 hover:text-white border border-palette-400 mx-1 text-xl px-2 rounded ${isUnique && "text-white bg-palette-400 hover:bg-transparent" || "text-palette-400"}`}><TbHexagonLetterUFilled /></button>
                <button onClick={() => setIsNullable(state => !state)} className={`flex items-center justify-center transition-all ease-in-out hover:bg-[#6d5375] hover:text-white border border-[#6d5375] mx-1   px-2 rounded ${isNullable && " border-indigo-300 text-white bg-[#2c277a] hover:bg-transparent"}`}>{isNullable ? <span className='font-bold text-indigo-400 '>NULL</span> : <NN height="23" width="23" className="noCross" />}</button>
                <button onClick={handleAddField} className='ms-2 text-2xl' ><RiInsertRowBottom /></button>
            </FieldRow>
            
            {errors.invalidKeyCombination && <div className="bg-red-100 border border-red-200 text-red-700 px-1 py-3 rounded text-center" role="alert">
                <span className="block sm:inline">Incorrect key combination, </span>
                <strong>primary key and foreign key selected</strong>
            </div>}

        </NodeLabel>
    );
};

export default TableNode;
