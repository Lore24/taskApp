import { create } from 'zustand';
import * as projectAPI from '../api/projects';

const useProjectStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectAPI.fetchAll();
      set({ projects, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createProject: async (data) => {
    try {
      const project = await projectAPI.create(data);
      set({ projects: [...get().projects, project] });
      return project;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateProject: async (id, data) => {
    try {
      const updated = await projectAPI.update(id, data);
      set({ projects: get().projects.map((p) => (p.id === id ? updated : p)) });
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteProject: async (id) => {
    try {
      await projectAPI.remove(id);
      set({ projects: get().projects.filter((p) => p.id !== id) });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getProject: (id) => get().projects.find((p) => p.id === id),

  archiveProject: async (id) => {
    try {
      const updated = await projectAPI.update(id, { archived: true });
      set({ projects: get().projects.map((p) => (p.id === id ? updated : p)) });
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  restoreProject: async (id) => {
    try {
      const updated = await projectAPI.update(id, { archived: false });
      set({ projects: get().projects.map((p) => (p.id === id ? updated : p)) });
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },
}));

export default useProjectStore;
