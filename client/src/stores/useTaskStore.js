import { create } from 'zustand';
import * as taskAPI from '../api/tasks';
import * as subtaskAPI from '../api/subtasks';

const useTaskStore = create((set, get) => ({
  tasks: [],
  subtasks: [],
  loading: false,
  error: null,

  // Tasks
  fetchTasks: async (projectId) => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskAPI.fetchAll(projectId);
      set({ tasks, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAllTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskAPI.fetchAll();
      set({ tasks, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createTask: async (data) => {
    try {
      const task = await taskAPI.create(data);
      set({ tasks: [...get().tasks, task] });
      return task;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      const updated = await taskAPI.update(id, data);
      set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) });
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  patchTask: async (id, data) => {
    // Optimistic update
    set({
      tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    });
    try {
      await taskAPI.patch(id, data);
    } catch (err) {
      // Revert on error
      const tasks = await taskAPI.fetchAll();
      set({ tasks, error: err.message });
    }
  },

  reorderTasks: (updates) => {
    // Optimistic update
    set({
      tasks: get().tasks.map((t) => {
        const update = updates.find((u) => u.id === t.id);
        return update ? { ...t, ...update } : t;
      }),
    });
    taskAPI.batchReorder(updates).catch(async () => {
      const tasks = await taskAPI.fetchAll();
      set({ tasks });
    });
  },

  deleteTask: async (id) => {
    try {
      await taskAPI.remove(id);
      set({
        tasks: get().tasks.filter((t) => t.id !== id),
        subtasks: get().subtasks.filter((s) => s.taskId !== id),
      });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getTask: (id) => get().tasks.find((t) => t.id === id),

  getTasksByProject: (projectId) =>
    get().tasks.filter((t) => t.projectId === projectId),

  getTasksByStatus: (projectId, status) =>
    get()
      .tasks.filter((t) => t.projectId === projectId && t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  // Subtasks
  fetchSubtasks: async (taskId) => {
    try {
      const subtasks = await subtaskAPI.fetchAll(taskId);
      // Merge with existing subtasks from other tasks
      const existingOther = get().subtasks.filter((s) => s.taskId !== taskId);
      set({ subtasks: [...existingOther, ...subtasks] });
    } catch (err) {
      set({ error: err.message });
    }
  },

  fetchAllSubtasks: async () => {
    try {
      const subtasks = await subtaskAPI.fetchAll();
      set({ subtasks });
    } catch (err) {
      set({ error: err.message });
    }
  },

  createSubtask: async (data) => {
    try {
      const subtask = await subtaskAPI.create(data);
      set({ subtasks: [...get().subtasks, subtask] });
      return subtask;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateSubtask: async (id, data) => {
    try {
      const updated = await subtaskAPI.update(id, data);
      set({ subtasks: get().subtasks.map((s) => (s.id === id ? updated : s)) });
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  patchSubtask: async (id, data) => {
    set({
      subtasks: get().subtasks.map((s) => (s.id === id ? { ...s, ...data } : s)),
    });
    try {
      await subtaskAPI.patch(id, data);
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteSubtask: async (id) => {
    try {
      await subtaskAPI.remove(id);
      set({ subtasks: get().subtasks.filter((s) => s.id !== id) });
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  getSubtasksByTask: (taskId) =>
    get()
      .subtasks.filter((s) => s.taskId === taskId)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),

  getSubtaskProgress: (taskId) => {
    const subs = get().subtasks.filter((s) => s.taskId === taskId);
    if (subs.length === 0) return null;
    const done = subs.filter((s) => s.status === 'done').length;
    return { done, total: subs.length };
  },
}));

export default useTaskStore;
