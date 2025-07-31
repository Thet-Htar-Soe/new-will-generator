type AssignedAsset = {
  id: string;
  amount: number;
};

type FamilyMember = {
  name: string;
  relationship?: string;
  assets: number;
  assignedAssets?: AssignedAsset[];
};

export function generateFamilyDataFromFlow(nodes: any[], edges: any[]): FamilyMember[] {
  const familyMap: { [key: string]: FamilyMember } = {};

  nodes.forEach((node) => {
    if (node.id.startsWith("beneficiary")) {
      familyMap[node.id] = {
        name: node.data.label.replace("Beneficiary: ", ""),
        relationship: "Beneficiary",
        assets: 0,
        assignedAssets: [],
      };
    }
  });

  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (sourceNode?.id.startsWith("property") && targetNode?.id.startsWith("beneficiary")) {
      const beneficiary = familyMap[targetNode.id];
      if (beneficiary) {
        const assetAmount = 100000;
        beneficiary.assets += assetAmount;
        beneficiary.assignedAssets?.push({
          id: sourceNode.data.label.replace("Property: ", ""),
          amount: assetAmount,
        });
      }
    }
  });

  return Object.values(familyMap);
}
