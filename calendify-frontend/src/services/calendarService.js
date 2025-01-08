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

const updateEvent = (calendarId, eventId, updateData, userId) => {
    return axios.put(
        `${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/update`,
        updateData,
        { data: { userId } }  // Ensure userId is sent if required
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


const deletePersonalCalendar = (calendarId, userId) => {
    return axios.post(`${BACKEND_ENDPOINT}/personal-calendar/${calendarId}/delete`, {
        userId,
    });
};

/**
 * Create a Group Calendar
 * POST /group-calendar/create
 * Body: { ownerId, name, members }
 */
const createGroupCalendar = (ownerId, name, members) => {
    return axios.post(`${BACKEND_ENDPOINT}/group-calendar/create`, {
        ownerId,
        name,
        members,  // Array of usernames
    });
};

/**
 * Add a User to a Group Calendar
 * POST /group-calendar/{calendar_id}/add-user
 * Body: { adminId, userId }
 */
const addUserToGroupCalendar = (calendarId, adminId, userId) => {
    return axios.post(`${BACKEND_ENDPOINT}/group-calendar/${calendarId}/add-user`, {
        adminId,
        userId,
    });
};

/**
 * Remove a User from a Group Calendar
 * POST /group-calendar/{calendar_id}/remove-user
 * Body: { adminId, userId }
 */
const removeUserFromGroupCalendar = (calendarId, adminId, userId) => {
    return axios.post(`${BACKEND_ENDPOINT}/group-calendar/${calendarId}/remove-user`, {
        adminId,
        userId,
    });
};

export default {
    getEvents,
    addEvent,
    deleteEvent,
    updateEvent,
    createPersonalCalendar,
    getUserCalendars,
    createGroupCalendar,               // Added
    addUserToGroupCalendar,            // Added
    removeUserFromGroupCalendar,       // Added
    deletePersonalCalendar,
};
