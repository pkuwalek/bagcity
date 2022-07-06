import { BACKEND_URL } from '../dbUrl';
const urlAuth = `${BACKEND_URL}/auth/`;

export const createUser = (data) => {
    const response = fetch (`${urlAuth}register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    return response;
};

export const authenticateUser = (data) => {
    const response = fetch (`${urlAuth}login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    return response;
};