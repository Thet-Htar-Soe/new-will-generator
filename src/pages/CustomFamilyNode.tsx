import { Handle, type NodeProps } from "@xyflow/react";

type AssignedAsset = {
  id: string;
  amount: number;
};

type NodeData = {
  name: string;
  relationship?: string;
  assets: number;
  assignedAssets?: AssignedAsset[];
};

type CustomFamilyNodeProps = NodeProps<NodeData> & {
  setEditingNodeId: (id: string) => void;
  setOpenDialog: (open: boolean) => void;
};

const CustomFamilyNode = ({ id, data, setEditingNodeId, setOpenDialog }: CustomFamilyNodeProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md px-4 py-2 border border-gray-300 text-left text-black w-60 relative">
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">Name</span>
          <div className="font-semibold ml-1">{data.name}</div>
        </div>
        {data.relationship && (
          <div className="flex items-center">
            <span className="text-gray-500 text-sm">Relationship</span>
            <div className="ml-1">{data.relationship || "-"}</div>
          </div>
        )}

        <div className="flex items-center">
          <span className="text-gray-500 text-sm">Total Assets</span>
          <div className="font-medium ml-1">${data.assets}</div>
          <button
            onClick={() => {
              setEditingNodeId(id);
              setOpenDialog(true);
            }}
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Edit
          </button>
        </div>

        {data.assignedAssets && data.assignedAssets.length > 0 && (
          <div>
            <ul className="list-disc list-inside">
              {data.assignedAssets.map((a) => (
                <li key={a.id}>
                  {a.id}: ${a.amount}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Handle type="target" position="top" style={{ width: 15, height: 15, borderRadius: "50%", background: "#555" }} />
      <Handle
        type="source"
        position="bottom"
        style={{ width: 15, height: 15, borderRadius: "50%", background: "#555" }}
      />
    </div>
  );
};

export default CustomFamilyNode;
