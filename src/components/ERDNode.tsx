import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { RiInsertRowBottom } from 'react-icons/ri';
import { IoKey } from 'react-icons/io5';
import { TbHexagonLetterUFilled } from 'react-icons/tb';
import { GiHouseKeys } from 'react-icons/gi';
import NN from "../assets/NotNull.svg?react"
import "../styles/ERDNode.css"
import useOutsideClick from '../hooks/useOutsideClick';
import { basicTableField, editProperties, TableNodeProps } from '../store/globalValues';
import FieldInputRow from './ERDInputRow';
import { errors } from '../store/globalValues';

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


// Custom node component
const TableNode: React.FC<TableNodeProps> = ({ data, selected, isEditingNode2, setIsEditingNode2 }) => {

    const [editedFields, setEdititedFields] = useState<basicTableField>(data.fields)

    const fieldNameRef = useRef<HTMLInputElement>(null);

    const [errors, setErrrors] = useState<errors>({
        invalidEntityName: false,
        invalidKeyCombination: false
    })


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

    const [isEditingEntityName, setIsEditingEntityName] = useState(false)
    const [handleStyle, setHandleStyle] = useState('hidden w-0 h-0')

    const outRef = useOutsideClick(() => {
        setIsEditingEntityName(false)
        data.setIsEditingNode(false)
        setIsEditingNode2(false)
    })

    const backgroundGradientEffect = false


    const handleEditField = (e: React.FormEvent) => {
        e.preventDefault()

        if (Object.keys(editedFields).length) {

            data.onEditField(editedFields);

            fieldNameRef.current?.focus(); // Set focus back to the field name input
        }

        setIsEditingEntityName(false)
        data.setIsEditingNode(false)
        setIsEditingNode2(false)

    };

    function editFieldPrimaryKey(index: number): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    isPrimaryKey: !obj[index].isPrimaryKey,
                },
            };
        });
    }

    function editFieldForeignKey(index: number): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    isForeignKey: !obj[index].isForeignKey,
                },
            };
        });
    }

    function editFieldIsUnique(index: number): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    isUnique: !obj[index].isUnique,
                },
            };
        });
    }

    function editFieldIsNullable(index: number): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    isNullable: !obj[index].isNullable,
                },
            };
        });
    }
    function editFieldName(index: number, value: string): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    name: value || obj[index].name,
                },
            };
        });
    }

    function editFieldType(index: number, value: string): void {
        setEdititedFields((obj: basicTableField) => {
            return {
                ...obj,
                [index]: {
                    ...obj[index],
                    type: value || obj[index].type,
                },
            };
        });
    }   



    return (
        <NodeLabel ref={outRef} className={`text-palette-100 bg-palette-500 border border-palette-400 ${(selected && backgroundGradientEffect) ? "animated-shadow" : selected ? "border-yellow-100" : ""}`} onDoubleClick={handleDoubleClick} onMouseLeave={() => setHandleStyle('hidden w-0 h-0')} onMouseEnter={() => setHandleStyle('w-3 h-3 block bg-palette-100')}>
            {/* Table Name Input */}
            <input
                type="text"
                className={!isEditingEntityName && !isEditingNode2 && "bg-palette-500 placeholder:text-white text-center text-xl focus:outline-none cursor-grab rounded" || "focus:outline-none focus:ring-1 ring-palette-100 placeholder:text-palette-300 rounded text-center text-xl bg-palette-100 text-palette-500"}
                readOnly={!isEditingEntityName && !isEditingNode2}
                onDoubleClick={() => {
                    setIsEditingEntityName(true)
                    console.log("Double Clicked");

                }}
                onKeyDown={(e) => (e.key == "Enter" || e.key == "Tab") && setIsEditingEntityName(false)}
                value={data.label}
                onChange={(e) => data.onNameChange(e.target.value)}
                placeholder="Table Name"
            />
            {/* Fields Header */}
            <div>
                <hr className='my-4' />
            </div>
            {/* Render existing fields */}
            {!isEditingNode2 && data.fields.map((field: { name: string; type: string, isPrimaryKey: boolean, isForeignKey: boolean, isUnique: boolean, isNullable: boolean }, index: number) => (
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

            {/* Edit existing fields START */}

            {isEditingNode2 && <form className='w-fit' onSubmit={handleEditField}>
                {data.fields.map((field: editProperties, index: number) => (
                    <FieldInputRow
                        isEditingNode={isEditingNode2}
                        setErrors={setErrrors}
                        data={data}
                        field={field}
                        index={index}
                        handleStyle={handleStyle}
                        editFieldForeignKey={editFieldForeignKey}
                        editFieldIsNullable={editFieldIsNullable}
                        editFieldIsUnique={editFieldIsUnique}
                        editFieldName={editFieldName}
                        editFieldPrimaryKey={editFieldPrimaryKey}
                        editFieldType={editFieldType}

                    />
                ))}
                <button type='submit' className="bg-bg-pallete-500 text-white">Edit</button>
            </form>}

            {/* Edit existing fields END */}

            {/* New Field Inputs */}
            <FieldInputRow
                isEditingNode={isEditingNode2}
                setErrors={setErrrors}
                data={data}
                handleStyle={handleStyle}
                editFieldForeignKey={editFieldForeignKey}
                editFieldIsNullable={editFieldIsNullable}
                editFieldIsUnique={editFieldIsUnique}
                editFieldName={editFieldName}
                editFieldPrimaryKey={editFieldPrimaryKey}
                editFieldType={editFieldType}

            />


            {errors.invalidKeyCombination && <div className="bg-red-100 border border-red-200 text-red-700 px-1 py-3 rounded text-center" role="alert">
                <span className="block sm:inline">Incorrect key combination, </span>
                <strong>primary key and foreign key selected</strong>
            </div>}

        </NodeLabel>
    );
};

export default TableNode;