import { FC, useEffect, useRef, useState } from "react";
import { GiHouseKeys } from "react-icons/gi";
import { IoKey } from "react-icons/io5";
import { RiInsertRowBottom } from "react-icons/ri";
import { TbHexagonLetterUFilled } from "react-icons/tb";
import styled from "styled-components";
import NN from "../assets/NotNull.svg?react"
import { editProperties, errors } from "../store/globalValues";
import { Handle, NodeProps, Position } from "@xyflow/react";


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


interface FieldInputRowProps {
    data: NodeProps<any>['data'];
    setErrors: React.Dispatch<React.SetStateAction<errors>>;
    isEditingNode: boolean;
    field?: editProperties;
    index?: number;
    handleStyle: string;
    editFieldName(index: number, value: string): void;
    editFieldType(index: number, value: string): void;
    editFieldPrimaryKey(index: number, value: boolean): void;
    editFieldForeignKey(index: number, value: boolean): void;
    editFieldIsUnique(index: number, value: boolean): void;
    editFieldIsNullable(index: number, value: boolean): void;
}

const FieldInputRow: FC<FieldInputRowProps> = ({
    setErrors,
    data,
    isEditingNode,
    field,
    index = 0,
    handleStyle,
    editFieldName,
    editFieldForeignKey,
    editFieldIsUnique,
    editFieldIsNullable,
    editFieldPrimaryKey,
    editFieldType

}: FieldInputRowProps) => {
    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [isPrimaryKey, setIsPrimaryKey] = useState(false)
    const [isForeignKey, setIsForeignKey] = useState(false)
    const [isUnique, setIsUnique] = useState(false)
    const [isNullable, setIsNullable] = useState(false)

    const fieldNameRef = useRef<HTMLInputElement>(null); // Create a reference for the field name input



    const handleFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldName(e.target.value);
    };

    const handleFieldTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldType(e.target.value);
    };

    const handleAddField = () => {
        if (isPrimaryKey && isForeignKey) {
            setErrors((state: errors) => {
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
        if (isEditingNode && field) {
            setFieldName(field.name || '');
            setFieldType(field.type || '');
            setIsPrimaryKey(field.isPrimaryKey || false);
            setIsForeignKey(field.isForeignKey || false);
            setIsUnique(field.isUnique || false);
            setIsNullable(field.isNullable || false);
        }
    }, [])

    useEffect(() => {
        if (isEditingNode && fieldName) {
            editFieldName(index, fieldName);
        }
    }, [fieldName]);

    useEffect(() => {
        if (isEditingNode && fieldType) {
            editFieldType(index, fieldType);
        }
    }, [fieldType]);

    useEffect(() => {
        if (isEditingNode) {
            editFieldPrimaryKey(index, isPrimaryKey);
        }
    }, [isPrimaryKey]);

    useEffect(() => {
        if (isEditingNode) {
            editFieldForeignKey(index, isForeignKey);
        }
    }, [isForeignKey]);

    useEffect(() => {
        if (isEditingNode) {
            editFieldIsUnique(index, isUnique);
        }
    }, [isUnique]);

    useEffect(() => {
        if (isEditingNode) {
            editFieldIsNullable(index, isNullable);
        }
    }, [isNullable]);

    return !isEditingNode && <FieldRow>
        <InputField
            ref={fieldNameRef} // Attach the ref to the first input field
            type="text"
            value={fieldName}
            onChange={handleFieldNameChange}
            placeholder="Column Name"
            className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500' />
        <InputField
            onKeyDown={(e) => (e.key === "Enter" || e.key === "Tab") && handleAddField()}
            type="text"
            value={fieldType}
            onChange={handleFieldTypeChange}
            placeholder="Data Type"
            className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500' />
        <button onClick={() => setIsPrimaryKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-yellow-400 hover:text-white border-yellow-400 mx-1 text-[#a6af2d] text-xl px-2 rounded ${isPrimaryKey && " text-white bg-yellow-400 hover:bg-transparent"}`}><IoKey /></button>
        <button onClick={() => setIsForeignKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-[#2d9baf] hover:text-white border-[#2d9baf] mx-1 text-[#2d9baf] text-xl px-2 rounded ${isForeignKey && " text-white bg-[#2a98ac] b hover:bg-transparent"}`}><GiHouseKeys /></button>
        <button onClick={() => setIsUnique(state => !state)} className={`bg-[#f0ffed] transition-all ease-in-out hover:bg-palette-400 hover:text-white border border-palette-400 mx-1 text-xl px-2 rounded ${isUnique && "text-white bg-palette-400 hover:bg-transparent" || "text-palette-400"}`}><TbHexagonLetterUFilled /></button>
        <button onClick={() => setIsNullable(state => !state)} className={`flex items-center justify-center transition-all ease-in-out hover:bg-[#6d5375] hover:text-white border border-[#6d5375] mx-1   px-2 rounded ${isNullable && " border-indigo-300 text-white bg-[#2c277a] hover:bg-transparent"}`}>{isNullable ? <span className='font-bold text-indigo-400 '>NULL</span> : <NN height="23" width="23" className="noCross" />}</button>
        <button onClick={handleAddField} className='ms-2 text-2xl'><RiInsertRowBottom /></button>
    </FieldRow> ||
        <div>
            <Handle className={handleStyle} id={index.toString()} type='source' position={Position.Left} style={{ top: 85 + 30 * index }} />
            <FieldRow>
                {/* Editable Field Name */}
                <InputField
                    type="text"
                    placeholder={field?.name || "Column Name"}
                    name="columName"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500'
                />
                {/* Editable Field Type */}
                <InputField
                    type="text"
                    name='dataType'
                    value={fieldType}
                    placeholder={field?.type || "Data Type"}
                    onChange={(e) => setFieldType(e.target.value)}
                    className='px-2 py-1 focus:outline-none focus:ring-1 ring-palette-100 bg-palette-100 text-palette-500 placeholder:text-palette-500'
                />
                {/* Toggleable Icons */}
                <div className="flex items-center text-xl justify-center gap-2">
                    {/* Toggle Primary Key */}
                    <button type="button" onClick={() => setIsPrimaryKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-yellow-400 hover:text-white border-yellow-400 mx-1 text-[#a6af2d] text-xl px-2 rounded ${isPrimaryKey && " text-white bg-yellow-400 hover:bg-transparent"}`}><IoKey /></button>
                    <button type="button" onClick={() => setIsForeignKey(state => !state)} className={`bg-[#f0ffed] border transition-all ease-in-out hover:bg-[#2d9baf] hover:text-white border-[#2d9baf] mx-1 text-[#2d9baf] text-xl px-2 rounded ${isForeignKey && " text-white bg-[#2a98ac] b hover:bg-transparent"}`}><GiHouseKeys /></button>
                    <button type="button" onClick={() => setIsUnique(state => !state)} className={`bg-[#f0ffed] transition-all ease-in-out hover:bg-palette-400 hover:text-white border border-palette-400 mx-1 text-xl px-2 rounded ${isUnique && "text-white bg-palette-400 hover:bg-transparent" || "text-palette-400"}`}><TbHexagonLetterUFilled /></button>
                    <button type="button" onClick={() => setIsNullable(state => !state)} className={`flex items-center justify-center transition-all ease-in-out hover:bg-[#6d5375] hover:text-white border border-[#6d5375] mx-1   px-2 rounded ${isNullable && " border-indigo-300 text-white bg-[#2c277a] hover:bg-transparent"}`}>{isNullable ? <span className='font-bold text-indigo-400 '>NULL</span> : <NN height="23" width="23" className="noCross" />}</button>
                </div>
            </FieldRow>
            <Handle className={handleStyle} id={(index * 2).toString()} type='target' position={Position.Right} style={{ top: 85 + 30 * index, backgroundColor: "#bde2e8" }} />
        </div>


}

export default FieldInputRow