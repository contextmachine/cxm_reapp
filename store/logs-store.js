import create from "zustand";

const useLogsStore = create((set, get) => ({
  logs: [],
  setLogs: (e) => {
    const logs = get().logs;

    return set({ logs: [...logs, ...e] });
  },
  setEmptyLogs: () => set({ logs: [] }),
}));

export default useLogsStore;
