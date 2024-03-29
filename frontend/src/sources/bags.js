import { BACKEND_URL } from '../dbUrl';

const urlBags = `${BACKEND_URL}/bags/`;

export const getAllBags = () => {
  return fetch(urlBags, {
    method: 'GET',
  });
};

export const getBagById = (id) => {
  return fetch(`${urlBags}${id}`, {
    method: 'GET',
  });
};

export const getColors = () => {
  return fetch(`${urlBags}colors`, {
    method: 'GET',
  });
};

export const getBrands = () => {
  return fetch(`${urlBags}brands`, {
    method: 'GET',
  });
};

export const getStyles = () => {
  return fetch(`${urlBags}types`, {
    method: 'GET',
  });
};

export const filteredBags = (data) => {
  return fetch(`${urlBags}filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
