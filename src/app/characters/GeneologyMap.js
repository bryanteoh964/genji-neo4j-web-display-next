import React, { useCallback, useState } from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    MiniMap,
    Controls,
    Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
/**
 * @param {Array} l the array of edges
 */
export default function GeneologyMap({l}) {
    const [nodes, setNodes] =useState(l[0])
    console.log('express',l[0])
    const [edges, setEdges] = useState(l[1])
    console.log('express',l[1])
    const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);
    const onConnect = () => null
    const minimapStyle = {
        height: 120,
    };
    // const onChange = () => null
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );
    console.log('show', onNodesChange)
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onClick={(event) => console.log(event.target)}
            onConnect={onConnect}
            onInit={onInit}
            fitView
            attributionPosition="top-right"
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
            <div>display</div>
        </ReactFlow>
        )
}

