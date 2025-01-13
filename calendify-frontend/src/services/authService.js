// src/services/authService.js

import axios from 'axios';
import { buildFunctionUrl } from './urlBuilder';

export default {
    register(username, password) {
        return axios.post(buildFunctionUrl('/register'), {
            username,
            password,
        });
    },

    login(username, password) {
        return axios.post(buildFunctionUrl('/login'), {
            username,
            password,
        });
    },
};