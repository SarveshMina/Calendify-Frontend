// store/index.js

import { createStore } from 'vuex';
import axios from 'axios';

const BACKEND_ENDPOINT = 'http://localhost:7071'; // Update if your backend endpoint differs

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || '',
        defaultCalendarId: localStorage.getItem('defaultCalendarId') || '',
    },
    mutations: {
        SET_USER_ID(state, userId) {
            state.userId = userId;
        },
        SET_DEFAULT_CALENDAR_ID(state, calendarId) {
            state.defaultCalendarId = calendarId;
        },
        CLEAR_AUTH(state) {
            state.userId = '';
            state.defaultCalendarId = '';
        },
    },
    actions: {
        async login({ commit }, credentials) {
            const response = await axios.post(`${BACKEND_ENDPOINT}/login`, credentials);
            const { userId, default_calendar_id } = response.data;
            commit('SET_USER_ID', userId);
            commit('SET_DEFAULT_CALENDAR_ID', default_calendar_id);
            localStorage.setItem('userId', userId);
            localStorage.setItem('defaultCalendarId', default_calendar_id);
        },

        async register({ commit }, credentials) {
            const response = await axios.post(`${BACKEND_ENDPOINT}/register`, credentials);
            const { userId, homeCalendarId } = response.data;
            commit('SET_USER_ID', userId);
            commit('SET_DEFAULT_CALENDAR_ID', homeCalendarId);
            localStorage.setItem('userId', userId);
            localStorage.setItem('defaultCalendarId', homeCalendarId);
        },

        logout({ commit }) {
            commit('CLEAR_AUTH');
            localStorage.removeItem('userId');
            localStorage.removeItem('defaultCalendarId');
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.userId,
        userId: (state) => state.userId,
        defaultCalendarId: (state) => state.defaultCalendarId,
    },
});
