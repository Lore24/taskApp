import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      darkMode: true,
      sidebarOpen: true,
      activeView: 'kanban',
      selectedTaskId: null,
      taskPanelOpen: false,

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setActiveView: (view) => set({ activeView: view }),
      openTaskPanel: (taskId) => set({ selectedTaskId: taskId, taskPanelOpen: true }),
      closeTaskPanel: () => set({ selectedTaskId: null, taskPanelOpen: false }),
    }),
    { name: 'taskapp-ui' }
  )
);

export default useUIStore;
