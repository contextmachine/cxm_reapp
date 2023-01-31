import create from "zustand";

const useModeStore = create((set, get) => ({
  selection: "bbox",
  setSelection: (e) => set({ selection: e }),
  setAutoSelection: () => {
    const state = get().selection;
    if (state === "bbox") {
      set({ selection: "object" });
    } else {
      set({ selection: "bbox" });
    }
  },
}));

export default useModeStore;
