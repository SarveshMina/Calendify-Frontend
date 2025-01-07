// src/services/calendarService.js

import axios from 'axios';

const BACKEND_ENDPOINT = process.env.VUE_APP_BACKEND_ENDPOINT || 'http://localhost:7071';

const getEvents = (calendarId, userId) => {
    return axios.get(`${BACKEND_ENDPOINT}/calendar/${calendarId}/events`, {
        params: { userId }
    });
};

const addEvent = (calendarId, eventData) => {
    return axios.post(`${BACKEND_ENDPOINT}/calendar/${calendarId}/event`, eventData);
};

const deleteEvent = (calendarId, eventId, userId) => {
    return axios.delete(`${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/delete`, {
        data: { userId }
    });
};

export default {
    getEvents,
    addEvent,
    deleteEvent
};
