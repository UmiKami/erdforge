import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Handle, NodeProps, Position } from '@xyflow/react';

const NodeLabel = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const FieldRow = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  margin-right: 5px;
  flex: 1; /* Makes the inputs take up available space */
`;

// Custom node component
const TableNode: React.FC<NodeProps> = ({ data, isConnectable }) => {

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


    const handleStyle = 'w-5 h-5';
    const handleStyle2 = 'w-5 h-5 ms-7';


    return (
        <NodeLabel onDoubleClick={handleDoubleClick}>
            {/* Table Name Input */}
            <input
                type="text"
                className={!isEditing && "bg-gray-50 focus:outline-none cursor-grab" || ""}
                readOnly={!isEditing}
                onDoubleClick={() => {
                    setIsEditing(true)
                    console.log("Double Clicked");

                }}
                onKeyDown={(e) => e.key == "Enter" && setIsEditing(false)}
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
                <FieldRow key={index}>
                    <span>{field.name} ({field.type})</span>
                </FieldRow>
            ))}
            {/* New Field Inputs */}
            <FieldRow>
                <InputField
                    ref={fieldNameRef} // Attach the ref to the first input field
                    type="text"
                    value={fieldName}
                    onChange={handleFieldNameChange}
                    placeholder="Field Name"
                />
                <InputField
                    onKeyDown={(e) => (e.key === "Enter" || e.key === "Tab") && handleAddField()}
                    type="text"
                    value={fieldType}
                    onChange={handleFieldTypeChange}
                    placeholder="Field Type"
                />
                <button onClick={handleAddField}>Add Field</button>
            </FieldRow>

            {data?.handles?.map(h => h)}
        </NodeLabel>
    );
};

export default TableNode;
