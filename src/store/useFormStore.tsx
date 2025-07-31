import { create } from "zustand";

interface Beneficiary {
  name: string;
  nric: string;
  address: string;
}

interface Property {
  description: string;
  postalAddress: string;
}

interface FormState {
  data: any;
  setData: (data: any) => void;
  beneficiaries: Beneficiary[];
  properties: Property[];
  addBeneficiary: () => void;
  addProperty: () => void;
  updateBeneficiary: (index: number, key: keyof Beneficiary, value: string) => void;
  updateProperty: (index: number, key: keyof Property, value: string) => void;
}

export const useFormStore = create<FormState>((set) => ({
  data: {},
  setData: (data) => set({ data }),
  beneficiaries: [{ name: "", nric: "", address: "" }],
  properties: [{ description: "", postalAddress: "" }],
  addBeneficiary: () =>
    set((state) => ({
      beneficiaries: [...state.beneficiaries, { name: "", nric: "", address: "" }],
    })),
  addProperty: () =>
    set((state) => ({
      properties: [...state.properties, { description: "", postalAddress: "" }],
    })),
  updateBeneficiary: (index, key, value) =>
    set((state) => {
      const updated = [...state.beneficiaries];
      updated[index][key] = value;
      return { beneficiaries: updated };
    }),
  updateProperty: (index, key, value) =>
    set((state) => {
      const updated = [...state.properties];
      updated[index][key] = value;
      return { properties: updated };
    }),
}));
