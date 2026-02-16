import { api } from './client';

export const fetchAll = (projectId) =>
  api.get(projectId ? `/tasks?projectId=${projectId}` : '/tasks');
export const fetchOne = (id) => api.get(`/tasks/${id}`);
export const create = (data) => api.post('/tasks', data);
export const update = (id, data) => api.put(`/tasks/${id}`, data);
export const patch = (id, data) => api.patch(`/tasks/${id}`, data);
export const batchReorder = (updates) => api.patch('/tasks/batch/reorder', updates);
export const remove = (id) => api.delete(`/tasks/${id}`);
