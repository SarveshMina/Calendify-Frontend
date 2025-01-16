// src/services/authService.js

import axios from 'axios';
import { buildFunctionUrl } from './urlBuilder';

export default {
    register(username, password, email) { // Added email parameter
        return axios.post(buildFunctionUrl('/register'), {
            username,
            password,
            email // Include email in registration
        });
    },

    login(username, password) {
        return axios.post(buildFunctionUrl('/login'), {
            username,
            password,
        });
    },

    forgotPassword(email) {
        return axios.post(buildFunctionUrl('/forgot-password'), {
            email
        });
    },

    resetPassword(email, otp, newPassword) {
        return axios.post(buildFunctionUrl('/reset-password'), {
            email,
            otp,
            newPassword
        });
    },
};
