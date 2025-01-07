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

/**
 * UPDATE an event
 * PUT /calendar/{calendarId}/event/{eventId}/update
 * Body: { userId, title, startTime, endTime, description }
 */
const updateEvent = (calendarId, eventId, updateData) => {
    return axios.put(
        `${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/update`,
        updateData
    );
};

/**
 * Create a personal calendar
 * POST /personal-calendar/create
 * Body: { userId, name }
 */
const createPersonalCalendar = (userId, name) => {
    return axios.post(`${BACKEND_ENDPOINT}/personal-calendar/create`, {
        userId,
        name,
    });
};

/**
 * Get all calendars for this user
 * GET /user/{userId}/calendars
 */
const getUserCalendars = (userId) => {
    return axios.get(`${BACKEND_ENDPOINT}/user/${userId}/calendars`);
};

export default {
    getEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    getUserCalendars,
    createPersonalCalendar,
};
