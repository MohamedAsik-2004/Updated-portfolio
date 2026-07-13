import client from './client';

// Auth Calls
export const adminLogin = async (credentials) => {
  const { data } = await client.post('/admin/login', credentials);
  return data;
};

export const adminLogout = async () => {
  const { data } = await client.post('/admin/logout');
  return data;
};

export const checkAdminSession = async () => {
  const { data } = await client.get('/admin/me');
  return data;
};

// System Stats
export const getAdminStats = async () => {
  const { data } = await client.get('/admin/stats');
  return data;
};

// Projects CRUD
export const getAdminProjects = async () => {
  const { data } = await client.get('/admin/projects');
  return data;
};

export const createProject = async (formData) => {
  // Uses multipart/form-data for file uploads
  const { data } = await client.post('/admin/projects', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateProject = async ({ id, formData }) => {
  const { data } = await client.put(`/admin/projects/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await client.delete(`/admin/projects/${id}`);
  return data;
};

// Skills CRUD
export const getAdminSkills = async () => {
  const { data } = await client.get('/admin/skills');
  return data;
};

export const createSkill = async (skillData) => {
  const { data } = await client.post('/admin/skills', skillData);
  return data;
};

export const updateSkill = async ({ id, skillData }) => {
  const { data } = await client.put(`/admin/skills/${id}`, skillData);
  return data;
};

export const deleteSkill = async (id) => {
  const { data } = await client.delete(`/admin/skills/${id}`);
  return data;
};

// Messages Dashboard
export const getAdminMessages = async (limit = 0) => {
  const url = limit > 0 ? `/admin/messages?limit=${limit}` : '/admin/messages';
  const { data } = await client.get(url);
  return data;
};

export const markMessageRead = async ({ id, isRead }) => {
  const { data } = await client.patch(`/admin/messages/${id}`, { isRead });
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await client.delete(`/admin/messages/${id}`);
  return data;
};

// Profile Updator
export const updateProfile = async (formData) => {
  const { data } = await client.put('/admin/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Certifications CRUD
export const getAdminCertifications = async () => {
  const { data } = await client.get('/admin/certifications');
  return data;
};

export const createCertification = async (certData) => {
  const { data } = await client.post('/admin/certifications', certData);
  return data;
};

export const updateCertification = async ({ id, certData }) => {
  const { data } = await client.put(`/admin/certifications/${id}`, certData);
  return data;
};

export const deleteCertification = async (id) => {
  const { data } = await client.delete(`/admin/certifications/${id}`);
  return data;
};
