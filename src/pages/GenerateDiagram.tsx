import { ReactFlow, addEdge, useNodesState, useEdgesState, Background, Controls, type Connection } from "@xyflow/react";
import { useFormStore } from "@/store/useFormStore";
import { useSelectionStore } from "@/store/useSelectionStore";
import { useEffect, useMemo } from "react";
import SideBar from "@/components/Sidebar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WillDocument from "./../components/UpdateWillDocument";
import { generateFamilyDataFromFlow } from "@/components/generateFamilyDataFlow";
import { PDFDocument } from "pdf-lib";
import download from "downloadjs";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const GenerateDiagram = () => {
  const formData = useFormStore((state) => state.data);

  const beneficiaries = useSelectionStore((s) => s.beneficiaries);
  const properties = useSelectionStore((s) => s.properties);

  const selectedBeneficiaries = useMemo(
    () => beneficiaries.map((val, index) => (val ? index : -1)).filter((i) => i !== -1),
    [beneficiaries]
  );

  const selectedProperties = useMemo(
    () => properties.map((val, index) => (val ? index : -1)).filter((i) => i !== -1),
    [properties]
  );

  console.log("Selected Beneficiaries", selectedBeneficiaries);
  console.log("Selected Properties", selectedProperties);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const isValidConnection = (connection: Connection) => {
    const { source, target } = connection;

    if (source === target) return false;

    const isTrustee = (id: string) => id.includes("trustee");
    const isBeneficiary = (id: string) => id.includes("beneficiary");

    if ((isTrustee(source!) && isBeneficiary(target!)) || (isBeneficiary(source!) && isTrustee(target!))) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    const newNodes = [];
    const newEdges = [];

    newNodes.push({
      id: "trustator",
      type: "default",
      position: { x: 300, y: 50 },
      data: { label: `Testator: ${formData.trustatorName}` },
    });

    newNodes.push({
      id: "trustee",
      type: "trustee",
      position: { x: 100, y: 100 },
      data: { label: `Trustee: ${formData.trusteeName}` },
    });

    if (formData.alternateTrusteeName) {
      newNodes.push({
        id: "alternate-trustee",
        type: "default",
        position: { x: 450, y: 150 },
        data: { label: `Alt. Trustee: ${formData.alternateTrusteeName}` },
      });

      // newEdges.push({
      //   id: "e-trustor-alt",
      //   source: "trustor",
      //   target: "alternate-trustee",
      // });
    }

    selectedBeneficiaries.forEach((index, i) => {
      const b = formData.beneficiaries[index];
      const id = `beneficiary-${i}`;
      newNodes.push({
        id,
        type: "default",
        position: { x: 100 + i * 200, y: 300 },
        data: { label: `Beneficiary: ${b.name}` },
      });
      // newEdges.push({ id: `e-trustee-${id}`, source: "trustee", target: id });
    });

    selectedProperties.forEach((index, i) => {
      const p = formData.properties[index];
      const id = `property-${i}`;
      newNodes.push({
        id,
        type: "default",
        position: { x: 100 + i * 200, y: 500 },
        data: { label: `Property: ${p.description}` },
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [formData, selectedBeneficiaries, selectedProperties]);

  const [uploadedPdf, setUploadedPdf] = useState<ArrayBuffer | null>(null);
  const [templatePdfBytes, setTemplatePdfBytes] = useState<ArrayBuffer | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const res = await fetch("/Latest-Will-Template-Malaysia.pdf");
      const arrayBuffer = await res.arrayBuffer();
      setTemplatePdfBytes(arrayBuffer);
    };

    fetchPdf();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      setUploadedPdf(arrayBuffer);
    }
  };

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);

  const fillAndDownloadPdf = async () => {
    // if (!uploadedPdf) return;
    if (!templatePdfBytes) return;

    // const pdfDoc = await PDFDocument.load(uploadedPdf);
    const pdfDoc = await PDFDocument.load(templatePdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fields.forEach((f) => {
      console.log(`Field: ${f.getName()}`);
    });
    console.log("these are formData", formData);

    form.getTextField("trustatorName").setText(formData.trustatorName);
    form.getTextField("trustatorNRIC").setText(formData.trustatorNRIC);
    form.getTextField("trustatorAddress").setText(formData.trustatorAddress);
    form.getTextField("trusteeName").setText(formData.trusteeName);
    form.getTextField("trusteeNRIC").setText(formData.trusteeNRIC);
    form.getTextField("trusteeAddress").setText(formData.trusteeAddress || "");
    form.getTextField("beneficiariesName").setText(formData.beneficiaries[0].name || "BeneficiaryName");
    form.getTextField("beneficiariesNRIC").setText(formData.beneficiaries[0].nric || "BeneficiaryNRIC");
    form.getTextField("propertyDetail").setText(formData.properties[0].description || "PropertyDetail");
    form.getTextField("propertyAddress").setText(formData.properties[0].postalAddress || "PropertyAddress");
    form.getTextField("alternateTrusteeName").setText(formData.alternateTrusteeName || "AlternateTrusteeName");
    form.getTextField("alternateTrusteeAddress").setText(formData.alternateTrusteeAddress || "AlternateTrusteeAddress");
    form.getTextField("day").setText(formData.signingDay || "");
    form.getTextField("month").setText(formData.signingMonth || "");

    const pdfBytes = await pdfDoc.save();
    // download(pdfBytes, "filled-will.pdf", "application/pdf");
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    setPdfPreviewUrl(url);
    setIsPreviewDialogOpen(true);
  };

  const family = generateFamilyDataFromFlow(nodes, edges);

  const pdfProps = {
    trustatorName: formData.trustatorName,
    trustatorNRIC: formData.trustatorNRIC,
    trustatorAddress: formData.trustatorAddress,
    trusteeName: formData.trusteeName,
    trusteeNRIC: formData.trusteeNRIC,
    trusteeAddress: formData.trusteeAddress,
    alternateTrusteeName: formData.alternateTrusteeName,
    alternateTrusteeAddress: formData.alternateTrusteeAddress,
    family,
  };

  return (
    <>
      <div className="flex bg-black">
        <SideBar />
        <div className="mt-6 w-xl mx-auto flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            {/* <input type="file" accept="application/pdf" onChange={handleUpload} className="text-white" />
          <button
            onClick={fillAndDownloadPdf}
            disabled={!uploadedPdf}
            className="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            Upload Will Template
          </button> */}
            <button
              onClick={fillAndDownloadPdf}
              className="bg-green-600 text-white rounded px-4 py-2 disabled:opacity-50"
            >
              Preview Will (Default Template)
            </button>
          </div>
          {/* {pdfPreviewUrl && (
          <div className="mt-4">
            <iframe src={pdfPreviewUrl} title="PDF Preview" width="100%" height="600px" className="border rounded" />
            <div className="mt-2">
              <a href={pdfPreviewUrl} download="filled-will.pdf" className="bg-blue-600 text-white px-4 py-2 rounded">
                Download PDF
              </a>
            </div>
          </div>
        )} */}

          <div className="flex gap-4 items-center">
            {nodes.length > 0 && (
              <PDFDownloadLink
                className=" bg-amber-500 rounded-md text-white px-4 py-2 text-center"
                document={<WillDocument {...pdfProps} />}
                fileName="will-document.pdf"
              >
                {({ loading }) => (loading ? "Preparing PDF..." : "Download Will (Hard-Coded)")}
              </PDFDownloadLink>
            )}
          </div>
          <div className="h-[600px] border">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={(params: Connection) =>
                setEdges((eds) => addEdge({ ...params, id: `${params.source}-${params.target}` }, eds))
              }
              isValidConnection={isValidConnection}
              className="border border-gray-400 rounded-md"
            >
              <Controls />
              <Background />
            </ReactFlow>
          </div>
        </div>
      </div>
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] flex flex-col bg-white">
          <DialogHeader>
            <DialogTitle>Preview Fillable Will Template</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {pdfPreviewUrl && (
              <iframe
                src={pdfPreviewUrl}
                // src={`${pdfPreviewUrl}#toolbar=1`}
                title="PDF Preview"
                width="100%"
                height="100%"
                className="w-full h-full border rounded"
              />
            )}
          </div>
          <DialogFooter className="mt-4">
            <a
              href={pdfPreviewUrl ?? "#"}
              download="filled-will.pdf"
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateDiagram;
