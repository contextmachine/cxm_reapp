import create from "zustand";

const useStatusStore = create((set, get) => ({
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
  /* */
  hoverBox: null,
  setHoverBox: (e) => set({ hoverBox: e }),
  initialZoomId: null,
  setInitialZoomId: (e) => set({ initialZoomId: e }),
  /* */
  lighting: false,
  setLighting: (e) => set({ lighting: e }),
  /* */
  linksStructure: null,
  setLinksStructure: (e) => set({ linksStructure: e }),
  linksLogId: null,
  setLinksLogId: (e) => set({ sceneLogId: e }),
  /* */
  hiddenLayers: null,
  setHiddenLayers: (e) => set({ hiddenLayers: e }),
  /* */
  zoomSetting: null,
  setZoomSetting: (e) => set({ zoomSetting: e }),
  /* */
  needsRender: false,
  setNeedsRender: (e) => set({ needsRender: e }),
  /* */
  controlsInProccess: false,
  setControlsInProcess: (e) => set({ controlsInProccess: e }),
  /* */
  /* */
  /* Инфографика */
  userData: null,
  setUserData: (e) => set({ userData: e }),
  GUIData: null,
  setGUIData: (e) => set({ GUIData: e }),
  cameraData: null,
  setCameraData: (e) => set({ cameraData: e }),
  controlsData: null,
  setControlsData: (e) => set({ controlsData: e }),
  /* */
  keyFilter: null,
  setKeyFilter: (e) => set({ keyFilter: e }),
  /* */
  keyFetch: null,
  setKeyFetch: (e) => set({ keyFetch: e }),
  /* */
  loadingAuth: 0,
  setLoadingAuth: (e) => {
    set({ loadingAuth: e });
  },
  loadingFilesDownload: 0,
  setLoadingFilesDownload: (e) => {
    set({ loadingFilesDownload: e });
  },
  loadingFilesDownloadTotal: 0,
  setLoadingFilesDownloadTotal: (e) => {
    set({ loadingFilesDownloadTotal: e });
  },
  loadingFilesUnarchive: 0,
  setLoadingFilesUnarchive: (e) => {
    set({ loadingFilesUnarchive: e });
  },
  loadingMetadata: 0,
  setLoadingMetadata: (e) => {
    set({ loadingMetadata: e });
  },
  loadingThreeJS: 0,
  setLoadingThreeJS: (e) => {
    set({ loadingThreeJS: e });
  },
  loadingDataSceneSanity: 0,
  setLoadingDataSceneSanity: (e) => {
    set({ loadingDataSceneSanity: e });
  },
  loadingDataThumbnail: 0,
  setLoadingDataThumbnail: (e) => {
    set({ loadingDataThumbnail: e });
  },
  /* */
  queryModal: null,
  setQueryModal: (e) => set({ queryModal: e }),
}));

export default useStatusStore;
