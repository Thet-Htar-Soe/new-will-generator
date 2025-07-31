import { create } from "zustand";

type SelectionState = {
  trustees: boolean[];
  beneficiaries: boolean[];
  properties: boolean[];
  setTrustees: (val: boolean[]) => void;
  setBeneficiaries: (val: boolean[]) => void;
  setProperties: (val: boolean[]) => void;
  toggle: (type: "trustees" | "beneficiaries" | "properties", index: number) => void;
  resetSelection: () => void;
};

export const useSelectionStore = create<SelectionState>((set) => ({
  trustees: [true],
  beneficiaries: [],
  properties: [],

  setTrustees: (val) => set({ trustees: val }),
  setBeneficiaries: (val) => set({ beneficiaries: val }),
  setProperties: (val) => set({ properties: val }),

  toggle: (type, index) =>
    set((state) => ({
      [type]: state[type].map((v, i) => (i === index ? !v : v)),
    })),

  resetSelection: () => set({ trustees: [true], beneficiaries: [], properties: [] }),
}));
