import { BACKEND_URL } from '../dbUrl';

const urlAuth = `${BACKEND_URL}/auth/`;

export const createUser = (data) => {
  const response = fetch(`${urlAuth}register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response;
};

export const authenticateUser = (data) => {
  const response = fetch(`${urlAuth}login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response;
};

export const verifyUser = () => {
  const response = fetch(`${urlAuth}refreshToken`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};

export const getUserDetails = (token) => {
  const response = fetch(`${urlAuth}me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
