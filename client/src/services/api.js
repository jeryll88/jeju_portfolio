import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

const api = {
  auth: {
    login: (data) => axiosInstance.post('/auth/login', data),
    logout: () => axiosInstance.post('/auth/logout'),
    getMe: () => axiosInstance.get('/auth/me'),
  },
  profile: {
    get: () => axiosInstance.get('/profile'),
    update: (data) => axiosInstance.put('/profile', data),
    uploadResume: (formData) => axiosInstance.post('/profile/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteResume: () => axiosInstance.delete('/profile/resume'),
  },
  socialLinks: {
    getAll: () => axiosInstance.get('/social-links'),
    create: (data) => axiosInstance.post('/social-links', data),
    update: (id, data) => axiosInstance.put(`/social-links/${id}`, data),
    delete: (id) => axiosInstance.delete(`/social-links/${id}`),
  },
  about: {
    get: () => axiosInstance.get('/about'),
    update: (data) => axiosInstance.put('/about', data),
  },
  education: {
    getAll: () => axiosInstance.get('/education'),
    create: (data) => axiosInstance.post('/education', data),
    update: (id, data) => axiosInstance.put(`/education/${id}`, data),
    delete: (id) => axiosInstance.delete(`/education/${id}`),
  },
  skills: {
    getPublished: () => axiosInstance.get('/skills'),
    getAll: () => axiosInstance.get('/skills/all'),
    getCategories: () => axiosInstance.get('/skills/categories'),
    createCategory: (data) => axiosInstance.post('/skills/categories', data),
    updateCategory: (id, data) => axiosInstance.put(`/skills/categories/${id}`, data),
    deleteCategory: (id) => axiosInstance.delete(`/skills/categories/${id}`),
    create: (formData) => axiosInstance.post('/skills', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => axiosInstance.put(`/skills/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => axiosInstance.delete(`/skills/${id}`),
  },
  projects: {
    getPublished: (params) => axiosInstance.get('/projects', { params }),
    getAll: () => axiosInstance.get('/projects/all'),
    getOne: (id) => axiosInstance.get(`/projects/${id}`),
    create: (formData) => axiosInstance.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => axiosInstance.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => axiosInstance.delete(`/projects/${id}`),
    uploadImages: (id, formData) => axiosInstance.post(`/projects/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    deleteImage: (id, imageId) => axiosInstance.delete(`/projects/${id}/images/${imageId}`),
  },
  awards: {
    getPublished: () => axiosInstance.get('/awards'),
    getAll: () => axiosInstance.get('/awards/all'),
    create: (formData) => axiosInstance.post('/awards', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, formData) => axiosInstance.put(`/awards/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => axiosInstance.delete(`/awards/${id}`),
  },
  contact: {
    submit: (data) => axiosInstance.post('/contact', data),
    getAll: (params) => axiosInstance.get('/contact', { params }),
    getOne: (id) => axiosInstance.get(`/contact/${id}`),
    toggleRead: (id) => axiosInstance.patch(`/contact/${id}/read`),
    delete: (id) => axiosInstance.delete(`/contact/${id}`),
  },
  settings: {
    get: () => axiosInstance.get('/settings'),
    update: (data) => axiosInstance.put('/settings', data),
  },
  dashboard: {
    getStats: () => axiosInstance.get('/dashboard/stats'),
    getRecent: () => axiosInstance.get('/dashboard/recent'),
  },
};

export default api;
