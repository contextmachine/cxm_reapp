import create from "zustand";

const useClippingStore = create((set) => ({
  planes: [
    {
      name: "clippingPlane:1",
      position: [0, 0, 10],
      rotation: [0, 0, 0],
    },
  ],
  setPlanes: (e) => set({ planes: e }),
}));

export default useClippingStore;
