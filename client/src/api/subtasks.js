import { api } from './client';

export const fetchAll = (taskId) =>
  api.get(taskId ? `/subtasks?taskId=${taskId}` : '/subtasks');
export const fetchOne = (id) => api.get(`/subtasks/${id}`);
export const create = (data) => api.post('/subtasks', data);
export const update = (id, data) => api.put(`/subtasks/${id}`, data);
export const patch = (id, data) => api.patch(`/subtasks/${id}`, data);
export const remove = (id) => api.delete(`/subtasks/${id}`);
