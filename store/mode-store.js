import create from "zustand";

const useStatusStore = create((set, get) => ({
  selection: "bbox",
  setSelection: (e) => set({ selection: e }),
}));

export default useStatusStore;
