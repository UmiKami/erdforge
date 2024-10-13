import React, { useCallback, useRef, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    Node,
    Edge,
    Connection,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    reconnectEdge,
    SelectionMode,
} from '@xyflow/react';
import TableNode from './ERDNode';
import '@xyflow/react/dist/style.css';
import CustomEdge from './ERDEdge';
import { useDnD } from '../store/DnDContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const edgeTypes = {
    'custom-edge': CustomEdge
}

const nodeTypes = { tableNode: TableNode };

const panOnDrag = [1, 2];

const ERDComponent: React.FC = () => {
    const edgeReconnectSuccessful = useRef(true);

    const isSingleSelect = useSelector((state: RootState) => state.erdTools.singleSelect)
    const isMultiSelect = useSelector((state: RootState) => state.erdTools.multiSelect)

    const [initialNodes, _setInitialNodes] = useState<Node[]>([]);
    const [initialEdges, _setInitialEdges] = useState<Edge[]>([]);
    const [nodeId, setNodeId] = useState(1);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const rflow = useReactFlow();

    const [type] = useDnD();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();

            console.log("Dropping 1, node ID: ", nodeId);


            // check if the dropped element is valid
            if (!type) {
                return;
            }

            console.log("Dropping 2");

            const position = rflow.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: `${nodeId}`,
                position,
                data: {
                    label: `Table ${nodeId}`,
                    fields: [],
                    onNameChange: (newName: string) => handleTableNameChange(`${nodeId}`, newName),
                    onAddField: (fieldName: string, fieldType: string) => handleAddField(`${nodeId}`, fieldName, fieldType),
                },
                type: 'tableNode',
            };
            console.log("Dropping 3");

            setNodes((prev) => [...prev, newNode]);
            console.log("Dropping 4");
            setNodeId((prev) => prev + 1);
            console.log("Dropping 5");
        },
        [rflow.screenToFlowPosition, type, nodeId],
    );

    // Handle pane double-click to add a node
    const handlePaneDoubleClick = (_: React.MouseEvent) => {


        const newNode: Node = {
            id: `${nodeId}`,
            position: {
                x: mousePosition.x,
                y: mousePosition.y,
            },
            data: {
                label: `Table ${nodeId}`,
                fields: [],
                onNameChange: (newName: string) => handleTableNameChange(`${nodeId}`, newName),
                onAddField: (fieldName: string, fieldType: string) => handleAddField(`${nodeId}`, fieldName, fieldType),
            },
            type: 'tableNode',
        };
        setNodes((prev) => [...prev, newNode]);
        setNodeId((prev) => prev + 1);
    };

    // Handle table name change
    const handleTableNameChange = (id: string, newName: string) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label: newName } } : node
            )
        );
    };

    // Handle adding a field to a node
    const handleAddField = (id: string, fieldName: string, fieldType: string) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            fields: [...node.data.fields, { name: fieldName, type: fieldType }],
                        },
                    }
                    : node
            )
        );
    };

    
    const onConnect = useCallback(
        (connection: Connection) => {
            const edge = { ...connection, type: 'custom-edge' };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges],
    );

    const onReconnectStart = useCallback(() => {
        console.log("Reconnect started");

        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        console.log("Reconnecting");

        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_, edge: Edge) => {
        console.log("Reconnecting ended");

        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeReconnectSuccessful.current = true;
    }, []);


    // Handle mouse position update
    const handlePaneMouseMove = (event: any) => {
        setMousePosition(rflow.screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    };

    return (
        <div style={{ width: '100%', height: '90vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onReconnect={onReconnect}
                onReconnectStart={onReconnectStart}
                onReconnectEnd={onReconnectEnd}
                onPaneMouseMove={handlePaneMouseMove}
                onConnect={onConnect} // Handle edge creation
                onDoubleClick={handlePaneDoubleClick}
                zoomOnDoubleClick={false}
                edgeTypes={edgeTypes}
                selectionMode={SelectionMode.Partial}
                selectionOnDrag={isMultiSelect}
                panOnDrag={isSingleSelect || panOnDrag}
            >
                <Controls />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
        </div>
    );
};

export default ERDComponent;
