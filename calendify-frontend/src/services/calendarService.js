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

const updateEvent = (calendarId, eventId, updateData, userId)=> {
    return axios.put(
        `${BACKEND_ENDPOINT}/calendar/${calendarId}/event/${eventId}/update`,
        updateData,
        { data: { userId } }
    );
}

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

/**
 * Get all events for the user across all calendars.
 * GET /user/{user_id}/events
 * Returns { events: [...] }
 */
function getAllEvents(userId) {
    // GET /user/{userId}/events => returns { events: [...] }
    return axios.get(`${BACKEND_ENDPOINT}/user/${userId}/events`);
}

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
        const payload = { userId, name, color };
        return await axios.post(`${BACKEND_ENDPOINT}/personal-calendar/create`, payload);
    },

    /**
     * Deletes a personal calendar.
     * @param {String} calendarId - The ID of the calendar to delete.
     * @param {String} userId - The ID of the user requesting deletion.
     * @returns {Promise} Axios response promise.
     */
    async deletePersonalCalendar(calendarId, userId) {
        return await axios.delete(`${BACKEND_ENDPOINT}/personal-calendar/${calendarId}/delete`, {
            data: { userId },
        });
    },

    /**
     * Creates a new group calendar.
     * @param {String} ownerId - The ID of the user creating the group calendar.
     * @param {String} name - The name of the group calendar.
     * @param {Array} members - Array of member usernames.
     * @param {String} color - The color theme of the group calendar.
     * @returns {Promise} Axios response promise.
     */
    async createGroupCalendar(ownerId, name, members, color) {
        const payload = { ownerId, name, members, color };
        return await axios.post(`${BACKEND_ENDPOINT}/group-calendar/create`, payload);
    },

    /**
     * Retrieves all calendars for a user.
     * @param {String} userId - The ID of the user.
     * @returns {Promise} Axios response promise.
     */
    async getUserCalendars(userId) {
        return await axios.get(`${BACKEND_ENDPOINT}/user/${userId}/calendars`);
    },

    /**
     * Validates if a username exists and retrieves its userId.
     * @param {String} username - The username to validate.
     * @returns {Promise} Axios response promise.
     */
    validateUsername(username) {
        // GET /user/{username}/id => returns { userId } or 404
        return axios.get(`${BACKEND_ENDPOINT}/user/${username}/id`);
    },

    async getAllEvents(userId) {
        return await getAllEvents(userId);
    },
    addUserToGroupCalendar,            // Added
    removeUserFromGroupCalendar,       // Added
};
