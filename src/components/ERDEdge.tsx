import { BaseEdge, getSmoothStepPath, GetStraightPathParams, Position } from '@xyflow/react';

interface baseProp extends GetStraightPathParams {
    id: string;
}

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }: baseProp) {
    const borderRadius = 5;  // Increase this for more rounded edges
    const offset = 20;  // Adjust this to change the distance of the turn from nodes

    const [edgePath] = getSmoothStepPath({
        sourceX: sourceX + 5,
        sourceY,
        targetX: targetX - 5,
        targetY,
        sourcePosition: sourceX <= targetX ? Position.Right : Position.Left,  // Assuming edge is leaving from the right side of the source node
        targetPosition: targetX <= sourceX ? Position.Right : Position.Left,  // Assuming edge is connecting to the left side of the target node
        borderRadius,  // Controls the roundness of the path corners
        offset: sourceX <= targetX ? 500 : offset,  // Controls how far the turn happens from the nodes
    });

    return (
        <>
            <BaseEdge label="Test" id={id} path={edgePath} />
        </>
    );
}
