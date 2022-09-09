import create from "zustand";

const useStatusStore = create((set) => ({
  serverInit: false,
  setServerInit: (e) => set({ serverInit: e }),
  /* */
  loadingFileIndex: 0,
  setLoadingFileIndex: (e) => set({ loadingFileIndex: e }),
  /* */
  loadingMessage: null,
  setLoadingMessage: (e) => set({ loadingMessage: e }),
  /* Layers */
  layersData: {},
  setLayersData: (e) => set({ layersData: e }),
  /* Meta Data */
  metaData: {},
  setMetaData: (e) => set({ metaData: e }),
  /* */
  layerCurrentChange: null,
  setLayerCurrentChange: (e) => set({ layerCurrentChange: e }),
  /* */
  layersUpdated: false,
  setLayersUpdated: (e) => set({ layersUpdated: e }),
  /* */
  boundingBox: null /* {min: {x,y,z}, max: {x,y,z}, isBox3} */,
  setBoundingBox: (e) => set({ boundingBox: e }),
}));

export default useStatusStore;
