// src/services/calendarService.js

import axios from 'axios';

const BACKEND_ENDPOINT = process.env.VUE_APP_BACKEND_ENDPOINT || 'http://localhost:7071';

const getEvents = (calendarId, userId) => {
    return axios.get(`${BACKEND_ENDPOINT}/calendar/${calendarId}/events`, {
        params: { userId },
    });
};

const addEvent = (calendarId, eventData) => {
    return axios.post(`${BACKEND_ENDPOINT}/calendar/${calendarId}/event`, eventData);
};

const deleteEvent = (calendarId, eventId, userId) => {
    return axios.delete(
        `${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/delete`,
        {
            data: { userId },
        }
    );
};

const updateEvent = (calendarId, eventId, updateData) => {
    return axios.put(
        `${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/update`,
        updateData
    );
};

const createPersonalCalendar = (userId, name) => {
    return axios.post(`${BACKEND_ENDPOINT}/personal-calendar/create`, {
        userId,
        name,
    });
};

const getUserCalendars = (userId) => {
    return axios.get(`${BACKEND_ENDPOINT}/user/${userId}/calendars`);
};

/**
 * Delete a personal calendar
 * POST /personal-calendar/{calendar_id}/delete
 * Body: { userId }
 */
const deletePersonalCalendar = (calendarId, userId) => {
    return axios.post(`${BACKEND_ENDPOINT}/personal-calendar/${calendarId}/delete`, {
        userId,
    });
};

export default {
    getEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    getUserCalendars,
    createPersonalCalendar,
    deletePersonalCalendar, // Added deletePersonalCalendar
};
