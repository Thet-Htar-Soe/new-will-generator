import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeProps,
} from "@xyflow/react";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import "@xyflow/react/dist/style.css";

import ClientForm, { type FormData } from "../components/ClientForm";
import CustomFamilyNode from "./CustomFamilyNode";

type AssignedAsset = {
  id: string;
  amount: number;
};

type FamilyNodeData = {
  name: string;
  relationship?: string;
  assets: number;
  assetId?: string;
  assignedAssets?: AssignedAsset[];
};

type CustomEdgeData = {
  amount: number | "";
};

const MainFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FamilyNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<CustomEdgeData>>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assetOptions, setAssetOptions] = useState<number[]>([]);
  const [familyOptions, setFamilyOptions] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);

  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setAssetOptions([data.asset_one, data.asset_two, data.asset_three]);
    setFamilyOptions(data.family_mem.map((m) => m.id));
    setIsSubmitted(true);
  };

  const handleCreateDiagram = () => {
    if (!formData) return;

    const newAssetNodes: Node<FamilyNodeData>[] = assetOptions.map((assetVal, index) => ({
      id: `asset_${index + 1}`,
      type: "customFamily",
      data: {
        name: `Asset ${index + 1}`,
        assets: assetVal,
        assetId: `asset_${index + 1}`,
      },
      position: { x: 250 * index, y: 0 },
    }));

    const familyNodes: Node<FamilyNodeData>[] = formData.family_mem
      .filter((member) => familyOptions.includes(member.id))
      .map((member, index) => ({
        id: `family_${member.id}`,
        type: "customFamily",
        data: {
          name: member.name,
          relationship: member.relationship,
          assets: 0,
        },
        position: { x: 150 * index, y: 250 },
      }));

    setNodes([...newAssetNodes, ...familyNodes]);
    setEdges([]);
  };

  const toggleAsset = (value: number) => {
    setAssetOptions((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const toggleFamily = (id: number) => {
    setFamilyOptions((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  useEffect(() => {
    setNodes((prevNodes): Node<FamilyNodeData>[] => {
      return prevNodes.map((node) => {
        if (node.id.startsWith("family_")) {
          const incomingEdges = edges.filter((e) => e.target === node.id);

          const assignedAssets = incomingEdges
            .map((edge) => {
              const assetNode = prevNodes.find((n) => n.id === edge.source);
              if (assetNode && assetNode.data.assetId) {
                return {
                  id: assetNode.data.assetId,
                  amount: typeof edge.data?.amount === "number" ? edge.data.amount : 0,
                };
              }
              return null;
            })
            .filter(Boolean) as AssignedAsset[];

          const totalAssets = assignedAssets.reduce((sum, a) => sum + a.amount, 0);

          return {
            ...node,
            data: {
              ...node.data,
              assets: totalAssets,
              assignedAssets,
            },
          };
        }
        return node;
      });
    });
  }, [edges]);

  const nodeTypes = useMemo(() => {
    return {
      customFamily: (nodeProps: NodeProps<FamilyNodeData>) => (
        <CustomFamilyNode {...nodeProps} setEditingNodeId={setEditingNodeId} setOpenDialog={setOpenDialog} />
      ),
    };
  }, [setEditingNodeId, setOpenDialog]);

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      {!isSubmitted && <ClientForm onSubmit={handleFormSubmit} />}
      {isSubmitted && nodes.length > 0 && (
        <>
          <div className="h-[700px] w-[1000px] border rounded-md">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params: Connection) => {
                setEdges((edges) => {
                  const newEdge: Edge<CustomEdgeData> = {
                    id: `${params.source}-${params.target}`,
                    ...params,
                    data: { amount: 0 },
                  };
                  return addEdge(newEdge, edges);
                });
              }}
              nodeTypes={nodeTypes}
            >
              <Controls />
              <Background />
            </ReactFlow>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent>
                <div className="bg-white p-4 rounded-md shadow">
                  <DialogHeader>
                    <DialogTitle>
                      Edit Asset Allocations for {nodes.find((n) => n.id === editingNodeId)?.data.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {edges
                      .filter((e) => e.target === editingNodeId)
                      .map((edge) => {
                        const assetNode = nodes.find((n) => n.id === edge.source);
                        return (
                          <div key={edge.id} className="flex items-center gap-2">
                            <span className="flex-1">{assetNode?.data.name}</span>
                            <input
                              type="number"
                              value={edge.data?.amount === "" ? "" : edge.data?.amount}
                              className="border p-1 w-24"
                              onChange={(e) => {
                                const val = e.target.value;
                                setEdges((prevEdges) =>
                                  prevEdges.map((ed) =>
                                    ed.id === edge.id
                                      ? {
                                          ...ed,
                                          data: {
                                            ...ed.data,
                                            amount: val === "" ? "" : Number(val),
                                          },
                                        }
                                      : ed
                                  )
                                );
                              }}
                            />
                          </div>
                        );
                      })}
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => setEditingNodeId(null)}
                      >
                        Done
                      </button>
                    </DialogClose>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}

      {isSubmitted && nodes.length === 0 && formData && (
        <>
          <div className="flex space-x-6 p-4 border rounded-md max-w-lg w-full">
            <div className="bg-white text-black p-8 rounded-md border flex flex-col gap-4">
              <p className="font-semibold">Select Assets</p>
              <label className="block">
                <input
                  type="checkbox"
                  checked={[formData.asset_one, formData.asset_two, formData.asset_three].every((a) =>
                    assetOptions.includes(a)
                  )}
                  onChange={() => {
                    const allAssets = [formData.asset_one, formData.asset_two, formData.asset_three];
                    if (allAssets.every((a) => assetOptions.includes(a))) {
                      setAssetOptions([]);
                    } else {
                      setAssetOptions(allAssets);
                    }
                  }}
                />
                Select All
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={assetOptions.includes(formData.asset_one)}
                  onChange={() => toggleAsset(formData.asset_one)}
                />
                Asset One: {formData.asset_one}
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={assetOptions.includes(formData.asset_two)}
                  onChange={() => toggleAsset(formData.asset_two)}
                />
                Asset Two: {formData.asset_two}
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  checked={assetOptions.includes(formData.asset_three)}
                  onChange={() => toggleAsset(formData.asset_three)}
                />
                Asset Three: {formData.asset_three}
              </label>
            </div>

            <div className="bg-white text-black p-8 rounded-md border flex flex-col gap-4">
              <p className="font-semibold">Select Family Members</p>
              <label className="block">
                <input
                  type="checkbox"
                  checked={formData.family_mem.every((m) => familyOptions.includes(m.id))}
                  onChange={() => {
                    if (formData.family_mem.every((m) => familyOptions.includes(m.id))) {
                      setFamilyOptions([]);
                    } else {
                      setFamilyOptions(formData.family_mem.map((m) => m.id));
                    }
                  }}
                />
                Select All
              </label>
              {formData.family_mem.map((member) => (
                <label key={member.id} className="block">
                  <input
                    type="checkbox"
                    checked={familyOptions.includes(member.id)}
                    onChange={() => toggleFamily(member.id)}
                  />
                  {member.name} ({member.relationship})
                </label>
              ))}
            </div>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreateDiagram}>
            Create
          </button>
        </>
      )}
    </div>
  );
};

const MainFlowPage = () => (
  <ReactFlowProvider>
    <MainFlow />
  </ReactFlowProvider>
);

export default MainFlowPage;
