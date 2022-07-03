import { BACKEND_URL } from '../dbUrl';
const urlAuth = `${BACKEND_URL}/auth/`;

export const createUser = (data) => {
    const response = fetch (`${urlAuth}register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
    });
    return response;
};
