import create from "zustand";

const useLightingStore = create((set, get) => ({
  lights: {},
  setLights: (e) => set({ lights: e }),
}));

export default useLightingStore;
