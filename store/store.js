import create from "zustand";

const useStore = create((set) => ({
  infoSection: "racks",
  setInfoSection: (e) => set({ infoSection: e }),
  selectedLength: null,
  setSelectedLength: (e) => set({ selectedLength: e }),
  selectedAccess: null,
  setSelectedAccess: (e) => set({ selectedAccess: e }),
  showInfographics: false,
  setShowInfographics: (e) => set({ showInfographics: e }),
  sceneData: null,
  setSceneData: (e) => set({ sceneData: e }),
  ObjFile: null,
  setObjFile: (e) => set({ ObjFile: e }),
  exportDataUpdate: false,
  setExportDataUpdate: (e) => set({ exportDataUpdate: e }),
}));

export default useStore;
