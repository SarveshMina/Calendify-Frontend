import { createStore } from 'vuex';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for unique IDs

const BACKEND_ENDPOINT = process.env.VUE_APP_BACKEND_ENDPOINT;

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || '',
        defaultCalendarId: localStorage.getItem('defaultCalendarId') || '',
        notifications: [], // Adding notifications array to state
        calendars: [], // Adding calendars to state
        activeCalendarId: localStorage.getItem('activeCalendarId') || '', // Track active calendar
    },
    mutations: {
        SET_USER_ID(state, userId) {
            state.userId = userId;
        },
        SET_DEFAULT_CALENDAR_ID(state, calendarId) {
            state.defaultCalendarId = calendarId;
        },
        SET_ACTIVE_CALENDAR_ID(state, calendarId) {
            state.activeCalendarId = calendarId;
            localStorage.setItem('activeCalendarId', calendarId);
        },
        CLEAR_AUTH(state) {
            state.userId = '';
            state.defaultCalendarId = '';
            state.activeCalendarId = '';
            localStorage.removeItem('activeCalendarId');
        },
        ADD_NOTIFICATION(state, notification) {
            state.notifications.push(notification);
        },
        REMOVE_NOTIFICATION(state, notificationId) {
            state.notifications = state.notifications.filter(n => n.id !== notificationId);
        },
        SET_CALENDARS(state, calendars) {
            state.calendars = calendars;
        },
        ADD_CALENDAR(state, calendar) {
            state.calendars.push(calendar);
        },
        REMOVE_CALENDAR(state, calendarId) {
            state.calendars = state.calendars.filter(cal => cal.calendarId !== calendarId);
        },
        // Add other calendar mutations as needed...
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post(`${BACKEND_ENDPOINT}/login`, credentials);
                const { userId, default_calendar_id } = response.data;
                commit('SET_USER_ID', userId);
                commit('SET_DEFAULT_CALENDAR_ID', default_calendar_id);
                commit('SET_ACTIVE_CALENDAR_ID', default_calendar_id); // Set active calendar
                localStorage.setItem('userId', userId);
                localStorage.setItem('defaultCalendarId', default_calendar_id);
                dispatch('notify', { type: 'success', message: 'Logged in successfully.' });
            } catch (error) {
                dispatch('notify', { type: 'error', message: error?.response?.data?.error || 'Login failed.' });
                throw error;
            }
        },

        async register({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post(`${BACKEND_ENDPOINT}/register`, credentials);
                const { userId, homeCalendarId } = response.data;
                commit('SET_USER_ID', userId);
                commit('SET_DEFAULT_CALENDAR_ID', homeCalendarId);
                commit('SET_ACTIVE_CALENDAR_ID', homeCalendarId); // Set active calendar
                localStorage.setItem('userId', userId);
                localStorage.setItem('defaultCalendarId', homeCalendarId);
                localStorage.setItem('activeCalendarId', homeCalendarId);
                dispatch('notify', { type: 'success', message: 'Registered successfully.' });
            } catch (error) {
                dispatch('notify', { type: 'error', message: error?.response?.data?.error || 'Registration failed.' });
                throw error;
            }
        },

        logout({ commit, dispatch }) {
            commit('CLEAR_AUTH');
            localStorage.removeItem('userId');
            localStorage.removeItem('defaultCalendarId');
            dispatch('notify', { type: 'info', message: 'Logged out successfully.' });
        },

        notify({ commit }, { type, message, duration = 4000 }) { // Adjusted duration
            const id = uuidv4(); // Generate unique ID for each notification
            commit('ADD_NOTIFICATION', { id, type, message });
            // Automatically remove the notification after 'duration' milliseconds
            setTimeout(() => {
                commit('REMOVE_NOTIFICATION', id);
            }, duration);
        },

        async fetchCalendars({ commit, state, dispatch }) {
            try {
                const response = await axios.get(`${BACKEND_ENDPOINT}/calendar/user/${state.userId}/calendars`);
                const calendars = response.data.calendars || [];
                commit('SET_CALENDARS', calendars);
            } catch (error) {
                console.error('Failed to fetch calendars:', error);
                dispatch('notify', { type: 'error', message: 'Failed to fetch calendars.' });
            }
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.userId,
        userId: (state) => state.userId,
        defaultCalendarId: (state) => state.defaultCalendarId,
        notifications: (state) => state.notifications, // Getter for notifications
        calendars: (state) => state.calendars, // Getter for calendars
        activeCalendarId: (state) => state.activeCalendarId,
        activeCalendar: (state) => {
            return state.calendars.find(cal => cal.calendarId === state.activeCalendarId);
        },
        activeCalendarColor: (state, getters) => {
            const activeCal = getters.activeCalendar;
            return activeCal ? activeCal.color : 'blue';
        },
    },
});
