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
    BackgroundVariant,
} from '@xyflow/react';
import TableNode from './ERDNode';
import '@xyflow/react/dist/style.css';
import CustomEdge from './ERDEdge';
import { useDnD } from '../store/DnDContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import ContextMenu from './ContextMenu';

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
    const [menu, setMenu] = useState(null);


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
                    onAddField: (fieldName: string, fieldType: string, isPrimaryKey: boolean, isForeignKey: boolean, isUnique: boolean, isNullable: boolean) => handleAddField(`${nodeId}`, fieldName, fieldType, isPrimaryKey, isForeignKey, isUnique, isNullable),
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
                onAddField: (fieldName: string, fieldType: string, isPrimaryKey: boolean, isForeignKey: boolean, isUnique: boolean, isNullable: boolean) => handleAddField(`${nodeId}`, fieldName, fieldType, isPrimaryKey, isForeignKey, isUnique, isNullable),
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
    const handleAddField = (id: string, fieldName: string, fieldType: string, isPrimaryKey: boolean, isForeignKey: boolean, isUnique: boolean, isNullable: boolean) => {
        setNodes((prevNodes: Node[]) =>
            prevNodes.map((node: Node) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            fields: [...node.data.fields, { name: fieldName, type: fieldType, isPrimaryKey, isForeignKey, isUnique, isNullable }],
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

    const ref = useRef(null);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current.getBoundingClientRect();
            setMenu({
                id: node.id,
                top: event.clientY < pane.height - 200 && event.clientY - 65,
                left: event.clientX < pane.width - 200 && event.clientX,
                right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
                bottom:
                    event.clientY >= pane.height - 200 && pane.height - event.clientY,
            });
        },
        [setMenu],
    );

    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    return (
        <div style={{ width: '100%', height: '90vh' }}>
            <ReactFlow
                ref={ref}
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
                onNodeClick={onPaneClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
                onConnect={onConnect} // Handle edge creation
                onDoubleClick={handlePaneDoubleClick}
                zoomOnDoubleClick={false}
                edgeTypes={edgeTypes}
                selectionMode={SelectionMode.Partial}
                selectionOnDrag={isMultiSelect}
                panOnDrag={isSingleSelect || panOnDrag}
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} className="bg-[#040403]" color='#5B7553' gap={12} size={1} />
                {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
            </ReactFlow>
        </div>
    );
};

export default ERDComponent;
