// src/services/calendarService.js

import axios from 'axios';
import { buildFunctionUrl } from './urlBuilder';

const calendarService = {
    /**
     * Creates a new personal calendar.
     */
    async createPersonalCalendar(userId, name, color) {
        const payload = { userId, name, color };
        return await axios.post(buildFunctionUrl('/personal-calendar/create'), payload);
    },

    /**
     * Imports an internet calendar from an iCal URL.
     * @param {String} userId - The ID of the user importing the calendar.
     * @param {String} iCalURL - The URL of the iCal feed to import.
     * @param {String} name - (Optional) Name for the imported calendar.
     * @param {String} color - (Optional) Color for the imported calendar.
     * @returns {Promise} - Axios response promise.
     */
    async importInternetCalendar(userId, iCalURL, name = '', color = 'blue') {
        const payload = { userId, iCalURL, name, color };
        return await axios.post(buildFunctionUrl('/calendar/import'), payload);
    },

    /**
     * Deletes a personal calendar.
     * @param {String} calendarId - The ID of the calendar to delete.
     * @param {String} userId - The ID of the user performing the deletion.
     * @returns {Promise} - Axios response promise.
     */
    async deletePersonalCalendar(calendarId, userId) {
        return await axios.post(
            buildFunctionUrl(`/personal-calendar/${calendarId}/delete`),
            { userId }
        );
    },

    /**
     * Deletes a group calendar.
     * @param {String} calendarId - The ID of the group calendar to delete.
     * @param {String} adminId - The ID of the admin performing the deletion.
     * @returns {Promise} - Axios response promise.
     */
    async deleteGroupCalendar(calendarId, adminId) {
        return await axios.post(
            buildFunctionUrl(`/group-calendar/${calendarId}/delete`),
            { adminId } // Changed from { userId } to { adminId }
        );
    },




    /**
     * Creates a new group calendar.
     */
    async createGroupCalendar(ownerId, name, members, color) {
        const payload = { ownerId, name, members, color };
        return await axios.post(buildFunctionUrl('/group-calendar/create'), payload);
    },

    // Edit group calendar (name and color)
    async editGroupCalendar(calendarId, adminId, updatedData) {
        return axios.put(buildFunctionUrl(`/group-calendar/${calendarId}/edit`), {
            adminId,
            ...updatedData,
        });
    },

    // src/services/calendarService.js
    async editPersonalCalendar(calendarId, userId, updatedData) {
        const payload = { ...updatedData }; // Exclude userId from the body
        return axios.put(buildFunctionUrl(`/personal-calendar/${calendarId}/edit`), payload, {
            headers: { 'user_id': userId } // Include userId in headers
        });
    },


    // Add user to group calendar
    async addUserToGroupCalendar(calendarId, adminId, userId) {
        return axios.post(buildFunctionUrl(`/group-calendar/${calendarId}/add-user`), {
            adminId,
            userId,
        });
    },

    // Remove user from group calendar
    async removeUserFromGroupCalendar(calendarId, adminId, userId) {
        return axios.post(buildFunctionUrl(`/group-calendar/${calendarId}/remove-user`), {
            adminId,
            userId,
        });
    },

    // Leave group calendar
    async leaveGroupCalendar(calendarId, userId) {
        return axios.post(buildFunctionUrl(`/group-calendar/${calendarId}/leave`), {
            userId,
        });
    },

    // Get userId from username
    async getUserId(username) {
        return axios.get(buildFunctionUrl(`/user/${username}/id`));
    },

    /**
     * Retrieves all calendars for a user.
     */
    async getUserCalendars(userId) {
        return await axios.get(buildFunctionUrl(`/user/${userId}/calendars`));
    },

    /**
     * Validates if a username exists and retrieves its userId.
     */
    validateUsername(username) {
        return axios.get(buildFunctionUrl(`/user/${username}/id`));
    },

    /**
     * Retrieves all events for a user across all calendars.
     */
    async getAllEvents(userId) {
        return await axios.get(buildFunctionUrl(`/user/${userId}/events`));
    },

    /**
     * Fetches all events for a specific calendar.
     */
    getEvents(calendarId, userId) {
        return axios.get(buildFunctionUrl(`/calendar/${calendarId}/events`), {
            params: { userId },
        });
    },

    /**
     * Adds an event to a specific calendar (with optional conflict override).
     */
    addEvent(calendarId, eventData, override = false) {
        const data = { ...eventData, override };
        return axios.post(buildFunctionUrl(`/calendar/${calendarId}/event`), data);
    },

    /**
     * Deletes an event from a specific calendar.
     */
    deleteEvent(calendarId, eventId, userId) {
        return axios.delete(buildFunctionUrl(`/calendar/${calendarId}/event/${eventId}/delete`), {
            data: { userId },
        });
    },

    /**
     * Updates an event in a specific calendar.
     */
    updateEvent(calendarId, eventId, updateData, userId) {
        return axios.put(buildFunctionUrl(`/calendar/${calendarId}/event/${eventId}/update`), updateData, {
            data: { userId },
        });
    },
};

export default calendarService;
