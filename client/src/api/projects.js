import { api } from './client';

export const fetchAll = () => api.get('/projects');
export const fetchOne = (id) => api.get(`/projects/${id}`);
export const create = (data) => api.post('/projects', data);
export const update = (id, data) => api.put(`/projects/${id}`, data);
export const remove = (id) => api.delete(`/projects/${id}`);
