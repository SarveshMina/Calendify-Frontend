// src/services/calendarService.js
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { buildFunctionUrl } from './urlBuilder';

const calendarService = {
<<<<<<< HEAD
=======
    /**
     * Sends a chat message to a group calendar.
     */
    async sendGroupMessage(calendarId, userId, message) {
        const payload = {
            userId,
            message
        };
        return await axios.post(buildFunctionUrl(`/group-calendar/${calendarId}/send-message`), payload);
    },

    /**
     * Fetches the SignalR negotiation info.
     */
    async negotiate() {
        return await axios.post(buildFunctionUrl('/negotiate'));
    },

>>>>>>> a1bbbfd8b2650c5c7a120b3585b1f7c0c2550590
    /**
     * Creates a new personal calendar.
     */
    async createPersonalCalendar(userId, name, color) {
        const payload = { userId, name, color };
        return await axios.post(buildFunctionUrl('/personal-calendar/create'), payload);
    },

    /**
     * Deletes a personal calendar.
     */
    async deletePersonalCalendar(calendarId, userId) {
        return await axios.post(
            buildFunctionUrl(`/personal-calendar/${calendarId}/delete`),
<<<<<<< HEAD
            { userId }
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
=======
            {userId}
        );
    },

    deleteGroupCalendar(calendarId, adminId) {
        return axios.delete(`${BACKEND_ENDPOINT}/group-calendar/${calendarId}/delete`, {
            data: { adminId }
>>>>>>> a1bbbfd8b2650c5c7a120b3585b1f7c0c2550590
        });
    },

    /**
<<<<<<< HEAD
     * Updates an event in a specific calendar.
     */
    updateEvent(calendarId, eventId, updateData, userId) {
        return axios.put(buildFunctionUrl(`/calendar/${calendarId}/event/${eventId}/update`), updateData, {
            data: { userId },
        });
    },
=======
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
>>>>>>> a1bbbfd8b2650c5c7a120b3585b1f7c0c2550590
};

export default calendarService;
