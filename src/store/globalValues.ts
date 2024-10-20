import { NodeProps } from "@xyflow/react";
import Cookies from "js-cookie";

export const baseURL: string = import.meta.env.VITE_API_URL;

export function getJwtToken() {
    let cookie: any = Cookies.get("jwtToken");

    return cookie;
}

export interface editProperties {
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isUnique: boolean;
    isNullable: boolean;
}

export interface basicTableField {
    [key: number]: editProperties;
}

export interface errors {
    invalidEntityName: boolean;
    invalidKeyCombination: boolean;
}

export interface TableNodeProps extends NodeProps {
    setIsEditingNode2: React.Dispatch<React.SetStateAction<boolean>>;
    isEditingNode2: boolean;
}
