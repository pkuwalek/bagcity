import { BACKEND_URL } from '../dbUrl';
const urlBags = `${BACKEND_URL}/bags/`;

export const getAllBags = () => {
    return fetch(urlBags, {
        method: 'GET'
    });
};
