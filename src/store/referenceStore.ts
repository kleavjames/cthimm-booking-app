import { generateReferenceNumber } from "@/utils/strings";
import { create } from "zustand";

type ReferenceState = {
  referenceNumber: string;
  generateNewReference: () => void;
};

const useReferenceStore = create<ReferenceState>()((set) => ({
  referenceNumber: "",
  generateNewReference: () =>
    set({ referenceNumber: generateReferenceNumber() }),
}));

export default useReferenceStore;
