// src/services/authService.js

import axios from 'axios';

const BACKEND_ENDPOINT = process.env.VUE_APP_BACKEND_ENDPOINT || 'http://localhost:7071';

const register = (username, password) => {
    return axios.post(`${BACKEND_ENDPOINT}/register`, {
        username,
        password,
        // Include additional fields if necessary, e.g., email
    });
};

const login = (username, password) => {
    return axios.post(`${BACKEND_ENDPOINT}/login`, {
        username,
        password,
    });
};

export default {
    register,
    login,
};
