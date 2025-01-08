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

    /**
     * Creates a new personal calendar.
     * @param {String} userId - The ID of the user creating the calendar.
     * @param {String} name - The name of the new calendar.
     * @param {String} color - The color theme of the calendar.
     * @returns {Promise} Axios response promise.
     */
    async createPersonalCalendar(userId, name, color) {
        const payload = {
            userId,
            name,
            color,
        };
        return await axios.post(`${BACKEND_ENDPOINT}/personal-calendar/create`, payload);
    },

    /**
     * Deletes a personal calendar.
     * @param {String} calendarId - The ID of the calendar to delete.
     * @param {String} userId - The ID of the user requesting deletion.
     * @returns {Promise} Axios response promise.
     */
    async deletePersonalCalendar(calendarId, userId) {
        const payload = { userId };
        return await axios.delete(`${BACKEND_ENDPOINT}/calendar/${calendarId}/delete_personal`, { data: payload });
    },

    /**
     * Retrieves all calendars for a user.
     * @param {String} userId - The ID of the user.
     * @returns {Promise} Axios response promise.
     */
    async getUserCalendars(userId) {
        return await axios.get(`${BACKEND_ENDPOINT}/user/${userId}/calendars`);
    },
    createGroupCalendar,               // Added
    addUserToGroupCalendar,            // Added
    removeUserFromGroupCalendar,       // Added
};
