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
