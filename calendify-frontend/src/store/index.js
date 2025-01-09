// store/index.js

import { createStore } from 'vuex';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import calendarService from '@/services/calendarService'; // Make sure the path is correct

const BACKEND_ENDPOINT = process.env.VUE_APP_BACKEND_ENDPOINT;

export default createStore({
    state: {
        userId: localStorage.getItem('userId') || '',
        defaultCalendarId: localStorage.getItem('defaultCalendarId') || '',
        notifications: [],
        calendars: [],    // all user calendars (personal + group)
        activeCalendarId: localStorage.getItem('activeCalendarId') || '',
        allEvents: [],    // all events (across all user calendars)
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
            state.calendars = [];
            state.allEvents = [];
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
        SET_ALL_EVENTS(state, events) {
            state.allEvents = events;
        },
    },
    actions: {
        async login({ commit, dispatch }, credentials) {
            try {
                const response = await axios.post(`${BACKEND_ENDPOINT}/login`, credentials);
                const { userId, default_calendar_id } = response.data;
                commit('SET_USER_ID', userId);
                commit('SET_DEFAULT_CALENDAR_ID', default_calendar_id);
                commit('SET_ACTIVE_CALENDAR_ID', default_calendar_id);
                localStorage.setItem('userId', userId);
                localStorage.setItem('defaultCalendarId', default_calendar_id);

                // After successful login, fetch calendars & events
                await dispatch('fetchCalendars');

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
                commit('SET_ACTIVE_CALENDAR_ID', homeCalendarId);
                localStorage.setItem('userId', userId);
                localStorage.setItem('defaultCalendarId', homeCalendarId);
                localStorage.setItem('activeCalendarId', homeCalendarId);

                // Fetch user calendars & events after registration
                await dispatch('fetchCalendars');

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

        notify({ commit }, { type, message, duration = 4000 }) {
            const id = uuidv4();
            commit('ADD_NOTIFICATION', { id, type, message });
            setTimeout(() => {
                commit('REMOVE_NOTIFICATION', id);
            }, duration);
        },

        async fetchCalendars({ commit, state, dispatch }) {
            try {
                // 1) get all calendars for this user
                const response = await calendarService.getUserCalendars(state.userId);
                const calendars = response.data.calendars || [];
                commit('SET_CALENDARS', calendars);

                // 2) then fetchAllEvents (which sets allEvents in state)
                await dispatch('fetchAllEvents');

                // If we don't already have an activeCalendarId set, pick one
                if (!state.activeCalendarId && calendars.length > 0) {
                    const defaultCal = calendars.find(cal => cal.calendarId === state.defaultCalendarId);
                    if (defaultCal) {
                        commit('SET_ACTIVE_CALENDAR_ID', defaultCal.calendarId);
                    } else {
                        commit('SET_ACTIVE_CALENDAR_ID', calendars[0].calendarId);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch calendars:', error);
                dispatch('notify', { type: 'error', message: 'Failed to fetch calendars.' });
            }
        },

        async fetchAllEvents({ commit, state, dispatch }) {
            try {
                // hits your new /user/{user_id}/events endpoint
                const response = await calendarService.getAllEvents(state.userId);
                const events = response.data.events || [];
                commit('SET_ALL_EVENTS', events);
            } catch (error) {
                console.error('Failed to fetch all events:', error);
                dispatch('notify', { type: 'error', message: 'Failed to fetch all events.' });
            }
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.userId,
        userId: (state) => state.userId,
        defaultCalendarId: (state) => state.defaultCalendarId,
        notifications: (state) => state.notifications,
        calendars: (state) => state.calendars,
        activeCalendarId: (state) => state.activeCalendarId,
        // If you want a dynamic "activeCalendar" getter:
        activeCalendar: (state) => {
            return state.calendars.find(cal => cal.calendarId === state.activeCalendarId) || null;
        },
        allEvents: (state) => state.allEvents,
    },
});
