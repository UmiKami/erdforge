import { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

interface ContextMenuProps {
    id: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export default function ContextMenu({
    id,
    top,
    left,
    right,
    bottom,
    ...props
}: ContextMenuProps) {
    const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

    const duplicateNode = useCallback(() => {
        const node = getNode(id);
        const position = {
            x: node && node.position.x + 50 || 0,
            y: node && node.position.y + 200 || 0,
        };

        addNodes({
            ...(node || []),
            selected: false,
            dragging: false,
            id: `${node?.id}-copy`,
            position,
        });
    }, [id, getNode, addNodes]);

    const deleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const editNode = useCallback(() => {
        setNodes((nodes) => nodes.map((node) => {
            node.data.isEditingNode = true
            return node
        }));
    }, [setNodes]);

    return (
        <div
            style={{ top, left, right, bottom }}
            className="flex flex-col items-start justify-around px-5 py-2 bg-white border border-indigo-700  shadow-xl shadow-yellow-300 absolute z-10"
            {...props}
        >
            <p style={{ margin: '0.5em' }}>
                <small>node: {id}</small>
            </p>
            <button onClick={editNode} className='my-2 hover:bg-slate-400'>edit</button>
            <button onClick={duplicateNode} className='my-2 hover:bg-slate-400'>duplicate</button>
            <button onClick={deleteNode} className='my-2 hover:bg-slate-400'>delete</button>
        </div>
    );
}