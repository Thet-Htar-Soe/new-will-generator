import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/store/useFormStore";
import { useNavigate } from "react-router-dom";
import SideBar from "./Sidebar";

const formSchema = z.object({
  trustatorName: z.string().nonempty("Trustator name is required"),
  trustatorNRIC: z.string().nonempty("Trustator NRIC is required"),
  trustatorAddress: z.string().nonempty("Trustator address is required"),

  trusteeName: z.string().nonempty("Trustee name is required"),
  trusteeNRIC: z.string().nonempty("Trustee NRIC is required"),
  trusteeAddress: z.string().nonempty("Trustee address is required"),

  alternateTrusteeName: z.string().optional(),
  alternateTrusteeAddress: z.string().optional(),
  alternateTrusteeNRIC: z.string().optional(),

  signingDay: z.string().nonempty(),
  signingMonth: z.string().nonempty(),
  // signingYear: z.string().nonempty(),
});

export default function ClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const setData = useFormStore((state) => state.setData);
  const beneficiaries = useFormStore((state) => state.beneficiaries);
  const properties = useFormStore((state) => state.properties);
  const addBeneficiary = useFormStore((state) => state.addBeneficiary);
  const addProperty = useFormStore((state) => state.addProperty);
  const updateBeneficiary = useFormStore((state) => state.updateBeneficiary);
  const updateProperty = useFormStore((state) => state.updateProperty);

  const [showAdditionalTrustee, setShowAdditionalTrustee] = useState(false);
  const navigation = useNavigate();
  const onSubmit = (data: any) => {
    const fullData = {
      ...data,
      beneficiaries,
      properties,
    };

    setData(fullData);
    console.log("submitted full data", fullData);
    navigation("/selection");
  };

  return (
    <div className="bg-black min-h-screen flex">
      <SideBar />
      <div className="py-6  max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white space-y-6 p-6 border rounded-md shadow-md">
          <h2 className="text-xl font-semibold">Trustator Information</h2>
          <Input {...register("trustatorName")} placeholder="Trustator Name" />
          <p className="text-red-500 text-sm">{errors.trustatorName?.message}</p>

          <Input {...register("trustatorNRIC")} placeholder="Trustator NRIC" />
          <p className="text-red-500 text-sm">{errors.trustatorNRIC?.message}</p>

          <Input {...register("trustatorAddress")} placeholder="Trustator Address" />
          <p className="text-red-500 text-sm">{errors.trustatorAddress?.message}</p>

          <h2 className="text-xl font-semibold">Trustee Information</h2>
          <Input {...register("trusteeName")} placeholder="Trustee Name" />
          <p className="text-red-500 text-sm">{errors.trusteeName?.message}</p>

          <Input {...register("trusteeNRIC")} placeholder="Trustee NRIC" />
          <p className="text-red-500 text-sm">{errors.trusteeNRIC?.message}</p>

          <Input {...register("trusteeAddress")} placeholder="Trustee Address" />
          <p className="text-red-500 text-sm">{errors.trusteeAddress?.message}</p>

          {!showAdditionalTrustee ? (
            <button
              type="button"
              className="text-blue-600 underline mt-2"
              onClick={() => setShowAdditionalTrustee(true)}
            >
              + Add Additional Trustee
            </button>
          ) : (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Additional Trustee</h3>
              <Input {...register("alternateTrusteeName")} placeholder="Alternate Trustee Name" />
              <Input {...register("alternateTrusteeNRIC")} placeholder="Alternate Trustee NRIC" />
              <Input {...register("alternateTrusteeAddress")} placeholder="Alternate Trustee Address" />
            </div>
          )}

          <h2 className="text-xl font-semibold">Property Details</h2>
          {properties.map((property, index) => (
            <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50">
              <Input
                placeholder="Property Description"
                value={property.description}
                onChange={(e) => updateProperty(index, "description", e.target.value)}
              />
              <Input
                placeholder="Postal Address"
                value={property.postalAddress}
                onChange={(e) => updateProperty(index, "postalAddress", e.target.value)}
              />
            </div>
          ))}
          {/* <button type="button" className="text-blue-600 underline" onClick={addProperty}>
            + Add Property
          </button> */}

          <h2 className="text-xl font-semibold">Beneficiaries</h2>
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="space-y-2 border p-4 rounded-md bg-gray-50">
              <Input
                placeholder="Beneficiary Name"
                value={beneficiary.name}
                onChange={(e) => updateBeneficiary(index, "name", e.target.value)}
              />
              <Input
                placeholder="Beneficiary NRIC"
                value={beneficiary.nric}
                onChange={(e) => updateBeneficiary(index, "nric", e.target.value)}
              />
              <Input
                placeholder="Beneficiary Address"
                value={beneficiary.address}
                onChange={(e) => updateBeneficiary(index, "address", e.target.value)}
              />
            </div>
          ))}
          {/* <button type="button" className="text-blue-600 underline" onClick={addBeneficiary}>
            + Add Beneficiary
          </button> */}

          <h2 className="text-xl font-semibold mt-6">Signing Date</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input {...register("signingDay")} placeholder="Day" />
            <Input {...register("signingMonth")} placeholder="Month" />
            {/* <Input {...register("signingYear")} placeholder="Year" /> */}
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
