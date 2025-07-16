import React, { useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, Controls, MiniMap, Background } from "reactflow";
import "reactflow/dist/style.css";
import type { Person } from "../types";

interface Props {
  people: Person[];
}

export default function AdvisorDiagram({ people }: Props) {
  const assetsNode = {
    id: "assets",
    position: { x: 500, y: 50 },
    data: { label: "Assets\n($5000)" },
    type: "default",
  };

  const personNodes = people.map((p, idx) => ({
    id: p.id,
    position: { x: 200 * idx, y: 250 },
    data: { label: `${p.name}\n(${p.role})` },
    type: "default",
  }));

  const initialNodes = [assetsNode, ...personNodes];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const children = people.filter((p) => p.role === "child");
  const initialShare = Math.floor(5000 / children.length);

  const [shares, setShares] = useState<{ [childId: string]: number }>(() => {
    const initial: { [childId: string]: number } = {};
    children.forEach((child) => {
      initial[child.id] = initialShare;
    });
    return initial;
  });

  const edges = children.map((child) => ({
    id: `e-assets-${child.id}`,
    source: "assets",
    target: child.id,
    label: `$${shares[child.id]}`,
  }));

  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

  // Update edges whenever shares change
  React.useEffect(() => {
    const updatedEdges = children.map((child) => ({
      id: `e-assets-${child.id}`,
      source: "assets",
      target: child.id,
      label: `$${shares[child.id]}`,
    }));
    setEdges(updatedEdges);
  }, [shares, setEdges]);

  const handleShareChange = (childId: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setShares((prev) => ({
        ...prev,
        [childId]: num,
      }));
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ height: "600px", width: "1000px", border: "1px solid #ddd" }}>
        <ReactFlow nodes={nodes} edges={edgesState} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <div>
        <h3>Adjust Child Shares</h3>
        {children.map((child) => (
          <div key={child.id} style={{ marginBottom: "10px" }}>
            <label>
              {child.name}:{" "}
              <input
                type="number"
                value={shares[child.id]}
                onChange={(e) => handleShareChange(child.id, e.target.value)}
                style={{ width: "80px" }}
              />{" "}
              $
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
