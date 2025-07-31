import { useFormStore } from "@/store/useFormStore";
import { useEffect } from "react";
import { useSelectionStore } from "@/store/useSelectionStore";
import { useNavigate } from "react-router-dom";
import SideBar from "./Sidebar";

const Selection = () => {
  const formData = useFormStore((state) => state.data);

  const { trustees, beneficiaries, properties, setTrustees, setBeneficiaries, setProperties, toggle } =
    useSelectionStore();

  useEffect(() => {
    const trusteeCount = formData.alternateTrusteeName ? 2 : 1;
    setTrustees(
      Array(trusteeCount)
        .fill(false)
        .map((_, i) => i === 0)
    );
    setBeneficiaries(Array(formData.beneficiaries?.length || 0).fill(false));
    setProperties(Array(formData.properties?.length || 0).fill(false));
  }, [formData]);

  const navigation = useNavigate();

  const handleGenerate = () => {
    const selectedTrustees = trustees
      .map((checked, index) => {
        if (!checked) return null;
        if (index === 0) {
          return {
            name: formData.trusteeName,
            nric: formData.trusteeNRIC,
            address: formData.trusteeAddress,
          };
        } else {
          return {
            name: formData.alternateTrusteeName,
            nric: formData.alternateTrusteeNRIC,
            address: formData.alternateTrusteeAddress,
          };
        }
      })
      .filter(Boolean);

    const selectedBeneficiaries = (formData.beneficiaries || []).filter((_, i) => beneficiaries[i]);

    const selectedProperties = (formData.properties || []).filter((_, i) => properties[i]);

    const finalData = {
      testator: {
        name: formData.trustatorName,
        nric: formData.trustatorNRIC,
        address: formData.trustatorAddress,
      },
      trustees: selectedTrustees,
      beneficiaries: selectedBeneficiaries,
      properties: selectedProperties,
    };

    navigation("/diagram");
  };

  return (
    <div className="flex bg-black">
      <SideBar />

      <div className="w-xl mx-auto p-10 space-y-6 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Selection</h2>
          <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Generate
          </button>
        </div>

        {/* Testator */}
        <div className="border p-4 rounded bg-gray-100 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Testator Information</h3>
            <p>Name: {formData.trustatorName}</p>
            <p>NRIC: {formData.trustatorNRIC}</p>
            <p>Address: {formData.trustatorAddress}</p>
          </div>
          <p className="text-green-600 font-medium mt-2">Selected</p>
        </div>

        {/* Trustee */}
        <div className="border p-4 rounded flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Trustee Information</h3>
            <p>Name: {formData.trusteeName}</p>
            <p>NRIC: {formData.trusteeNRIC}</p>
            <p>Address: {formData.trusteeAddress}</p>
          </div>
          <p className="text-green-600 font-medium mt-2">Selected</p>
        </div>

        {/* Alternate Trustee */}
        {formData.alternateTrusteeName && (
          <div className="border p-4 rounded flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Alternate Trustee</h3>
              <p>Name: {formData.alternateTrusteeName}</p>
              <p>NRIC: {formData.alternateTrusteeNRIC}</p>
              <p>Address: {formData.alternateTrusteeAddress}</p>
            </div>
            <input
              type="checkbox"
              className="mt-2"
              checked={trustees[1] || false}
              onChange={() => toggle("trustees", 1)}
            />
          </div>
        )}

        {/* Beneficiaries */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Beneficiaries</h3>
          {(formData.beneficiaries || []).map((b, idx) => (
            <div key={idx} className="border p-4 rounded mb-3 flex items-start justify-between">
              <div>
                <p>Name: {b.name}</p>
                <p>NRIC: {b.nric}</p>
                <p>Address: {b.address}</p>
              </div>
              <input
                type="checkbox"
                className="mt-2"
                checked={beneficiaries[idx] || false}
                onChange={() => toggle("beneficiaries", idx)}
              />
            </div>
          ))}
        </div>

        {/* Properties */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Properties</h3>
          {(formData.properties || []).map((p, idx) => (
            <div key={idx} className="border p-4 rounded mb-3 flex items-start justify-between">
              <div>
                <p>Description: {p.description}</p>
                <p>Postal Address: {p.postalAddress}</p>
                {p.propertyLandTitleDescription && <p>Land Title: {p.propertyLandTitleDescription}</p>}
              </div>
              <input
                type="checkbox"
                className="mt-2"
                checked={properties[idx] || false}
                onChange={() => toggle("properties", idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Selection;
