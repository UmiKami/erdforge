import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { RiInsertRowBottom } from 'react-icons/ri';

const NodeLabel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #5B7553;
  border: 1px solid #8EB897;
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

// Custom node component
const TableNode: React.FC<NodeProps> = ({ data }) => {

    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const fieldNameRef = useRef<HTMLInputElement>(null); // Create a reference for the field name input

    const handleFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldName(e.target.value);
    };

    const handleFieldTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldType(e.target.value);
    };

    const handleAddField = () => {
        if (fieldName && fieldType) {
            data.onAddField(fieldName, fieldType);
            setFieldName(''); // Reset field name input
            setFieldType(''); // Reset field type input
            fieldNameRef.current?.focus(); // Set focus back to the field name input
        }
    };

    const handleDoubleClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent event from bubbling up to the parent
    };

    const [isEditing, setIsEditing] = useState(true)
    const [handleStyle, setHandleStyle] = useState('hidden w-0 h-0')


  
    return (
        <NodeLabel className='text-[#C3E8BD]' onDoubleClick={handleDoubleClick} onMouseLeave={() => setHandleStyle('hidden w-0 h-0')} onMouseEnter={() => setHandleStyle('w-3 h-3 block bg-[#C3E8BD]')}>
            {/* Table Name Input */}
            <input
                type="text"
                className={!isEditing && "bg-[#5B7553] placeholder:text-white text-center text-xl focus:outline-none cursor-grab rounded" || "placeholder:text-white rounded text-center text-xl bg-[#8EB897] text-white"}
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
            {data.fields.map((field: { name: string; type: string }, index: number) => (
                <div key={index}>
                    <Handle className={handleStyle} id={index.toString()} type='source' position={Position.Left} style={{ top: 85 + 30 * index }} />
                    <FieldRow key={index}>
                        <span>{field.name} ({field.type})</span>
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
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-[#C3E8BD] bg-[#8EB897] placeholder:text-white text-white'
                />
                <InputField
                    onKeyDown={(e) => (e.key === "Enter" || e.key === "Tab") && handleAddField()}
                    type="text"
                    value={fieldType}
                    onChange={handleFieldTypeChange}
                    placeholder="Data Type"
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-[#C3E8BD] placeholder:text-white text-white bg-[#8EB897]'
                />
                <button onClick={handleAddField} ><RiInsertRowBottom /></button>
            </FieldRow>
            

        </NodeLabel>
    );
};

export default TableNode;
