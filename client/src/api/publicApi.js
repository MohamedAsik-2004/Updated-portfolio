import client from './client';

export const getProfile = async () => {
  const { data } = await client.get('/profile');
  return data;
};

export const getProjects = async () => {
  const { data } = await client.get('/projects');
  return data;
};

export const getSkills = async () => {
  const { data } = await client.get('/skills');
  return data;
};

export const sendContactMessage = async (messageData) => {
  const { data } = await client.post('/contact', messageData);
  return data;
};

export const getCertifications = async () => {
  const { data } = await client.get('/certifications');
  return data;
};
