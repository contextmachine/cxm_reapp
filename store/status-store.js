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
  /* */
}));

export default useStatusStore;
