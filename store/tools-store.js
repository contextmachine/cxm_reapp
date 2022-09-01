import create from "zustand";

const useToolsStore = create((set) => ({
  mouse: false,
  setMouse: (e) => set({ mouse: e }),
}));

export default useToolsStore;
