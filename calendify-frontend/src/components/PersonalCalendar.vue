<template>
  <div class="personal-calendar">
    <h2>{{ calendarName }}</h2>

    <!-- VueCal Calendar -->
    <vue-cal
        ref="calendarRef"
        default-view="month"
        :disable-views-transition="true"
        :events="vueCalEvents"
        style="height: 600px;"
        class="vuecal--blue-theme"
        @view-change="handleViewChange"
        @event-click="handleEventClick"
        @cell-click="handleCellClick"
    />

    <!-- "Add Event" button -->
    <button class="btn-add-event" @click="openAddEventModal">
      + Add Event
    </button>

    <!-- MODAL: Create Event -->
    <div v-if="showAddEventModal" class="modal-backdrop" @click.self="closeAddEventModal">
      <div class="modal-content">
        <h3>Create New Event</h3>
        <form @submit.prevent="createEvent">
          <div class="form-group">
            <label for="eventTitle">Title</label>
            <input id="eventTitle" v-model="newEventTitle" required />
          </div>

          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input id="startTime" type="datetime-local" v-model="newEventStart" required />
          </div>

          <div class="form-group">
            <label for="endTime">End Time</label>
            <input id="endTime" type="datetime-local" v-model="newEventEnd" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newEventDescription" rows="3"></textarea>
          </div>

          <!-- Buttons section -->
          <div class="modal-buttons">
            <button type="submit" class="btn-submit">Add Event</button>
            <button type="button" class="btn-cancel" @click="closeAddEventModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Event Information -->
    <div v-if="showDetailModal && selectedEvent" class="modal-backdrop" @click.self="closeDetailModal">
      <div class="modal-content">
        <h3>Event Information</h3>
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p><strong>Description:</strong> {{ selectedEvent.description || '(No Description)' }}</p>

        <!-- Buttons section -->
        <div class="modal-buttons">
          <button class="btn-submit" @click="openEditModal">Edit</button>
          <button class="btn-delete" @click="confirmDeleteEvent">Delete</button>
          <button class="btn-cancel" @click="closeDetailModal">Close</button>
        </div>
      </div>
    </div>

    <!-- MODAL: Edit Event -->
    <div v-if="showEditModal && selectedEvent" class="modal-backdrop" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>Edit Event</h3>
        <form @submit.prevent="updateEvent">
          <div class="form-group">
            <label for="editTitle">Title</label>
            <input id="editTitle" v-model="editEventTitle" required />
          </div>

          <div class="form-group">
            <label for="editStart">Start Time</label>
            <input
                id="editStart"
                type="datetime-local"
                v-model="editEventStart"
                required
            />
          </div>

          <div class="form-group">
            <label for="editEnd">End Time</label>
            <input
                id="editEnd"
                type="datetime-local"
                v-model="editEventEnd"
                required
            />
          </div>

          <div class="form-group">
            <label for="editDescription">Description</label>
            <textarea
                id="editDescription"
                v-model="editEventDescription"
                rows="3"
            ></textarea>
          </div>

          <button type="submit" class="btn-submit">Save Changes</button>
          <button type="button" class="btn-cancel" @click="closeEditModal">
            Cancel
          </button>
        </form>
      </div>
    </div>

    <!-- Confirmation Modal for Deletion -->
    <ConfirmationModal
        :visible="showConfirmDeleteModal"
        title="Confirm Deletion"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        @confirm="deleteEvent"
        @cancel="closeConfirmDeleteModal"
    />

    <!-- Display any error messages -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
// Import necessary helpers and components
import { mapActions } from 'vuex'; // Added import for mapActions
import axios from 'axios';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import ConfirmationModal from '@/components/ConfirmationModal.vue'; // Ensure correct path
// If using NotificationPopUp instead, adjust the import accordingly
import '@/assets/styles/styles.css';

export default {
  name: 'PersonalCalendar',
  components: { VueCal, ConfirmationModal },
  props: {
    userId: { type: String, required: true },
    calendarId: { type: String, required: true },
    calendarName: { type: String, default: 'My Personal Calendar' },
  },
  data() {
    return {
      // VueCal events
      vueCalEvents: [],
      error: null,

      // "Add Event" modal
      showAddEventModal: false,
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',

      // Event Information modal
      showDetailModal: false,
      selectedEvent: null,

      // Edit Event modal
      showEditModal: false,
      editEventTitle: '',
      editEventStart: '',
      editEventEnd: '',
      editEventDescription: '',

      // Confirmation modal for event deletion
      showConfirmDeleteModal: false,
    };
  },
  mounted() {
    this.fetchEvents();
  },
  watch: {
    calendarId(newId, oldId) {
      if (newId !== oldId) {
        this.fetchEvents();
      }
    },
  },
  methods: {
    ...mapActions(['notify']), // Now mapActions is correctly imported

    // Load events from the backend
    async fetchEvents() {
      try {
        const res = await axios.get(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/events`,
            { params: { userId: this.userId } }
        );
        const events = res.data.events || [];
        // Format for VueCal
        this.vueCalEvents = events.map((ev) => ({
          id: ev.eventId,
          title: ev.title,
          start: this.formatForVueCal(ev.startTime),
          end: this.formatForVueCal(ev.endTime),
          description: ev.description,
        }));
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to load events.';
        this.notify({ type: 'error', message: this.error });
      }
    },

    // Convert ISO date to "YYYY-MM-DD HH:mm" for VueCal
    formatForVueCal(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '';
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}`;
    },

    // Convert Date obj to "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
    toLocalDateTime(dateObj) {
      if (!(dateObj instanceof Date)) return '';
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mm = String(dateObj.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d}T${hh}:${mm}`;
    },

    // Show the "Add Event" modal
    openAddEventModal() {
      this.showAddEventModal = true;
      this.newEventTitle = '';
      this.newEventDescription = '';
      // Pre-fill start/end times with next hour
      const now = new Date();
      this.newEventStart = this.toLocalDateTime(now);
      now.setHours(now.getHours() + 1);
      this.newEventEnd = this.toLocalDateTime(now);
    },
    closeAddEventModal() {
      this.showAddEventModal = false;
    },

    // Create event
    async createEvent() {
      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart,
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        await axios.post(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event`,
            payload
        );
        this.fetchEvents();
        this.closeAddEventModal();
        this.notify({ type: 'success', message: 'Event created successfully.' });
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to create event.';
        this.notify({ type: 'error', message: this.error });
      }
    },

    // Single-click an event => open the Event Information modal
    handleEventClick(eventObj) {
      console.log('Clicked event =>', eventObj);
      // Save selectedEvent
      this.selectedEvent = { ...eventObj };
      // Show detail modal
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEvent = null;
    },

    // Edit button => open the Edit Event modal
    openEditModal() {
      if (!this.selectedEvent) return;

      this.showDetailModal = false; // close the detail modal
      this.showEditModal = true;

      // Pre-fill edit form
      this.editEventTitle = this.selectedEvent.title;
      // Convert "YYYY-MM-DD HH:mm" => Date => local datetime
      const startDate = new Date(this.selectedEvent.start.replace(' ', 'T'));
      const endDate = new Date(this.selectedEvent.end.replace(' ', 'T'));
      this.editEventStart = this.toLocalDateTime(startDate);
      this.editEventEnd = this.toLocalDateTime(endDate);
      this.editEventDescription = this.selectedEvent.description || '';
    },
    closeEditModal() {
      this.showEditModal = false;
    },

    // Save changes (PUT update)
    async updateEvent() {
      if (!this.selectedEvent) return;

      try {
        const eventId = this.selectedEvent.id; // same as eventId
        const payload = {
          userId: this.userId,
          title: this.editEventTitle,
          startTime: this.editEventStart,
          endTime: this.editEventEnd,
          description: this.editEventDescription,
        };
        await axios.put(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event/${eventId}/update`,
            payload
        );
        this.fetchEvents();
        this.closeEditModal();
        this.notify({ type: 'success', message: 'Event updated successfully.' });
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to update event.';
        this.notify({ type: 'error', message: this.error });
      }
    },

    // Delete event
    confirmDeleteEvent() {
      this.showConfirmDeleteModal = true;
    },
    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    },
    async deleteEvent() {
      if (!this.selectedEvent) return;
      // Replace browser confirm with custom modal
      try {
        await axios.delete(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event/${this.selectedEvent.id}/delete`,
            { data: { userId: this.userId } }
        );
        this.fetchEvents();
        // Close detail modal if open
        this.closeDetailModal();
        // Close confirmation modal
        this.closeConfirmDeleteModal();
        this.notify({ type: 'success', message: 'Event deleted successfully.' });
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to delete event.';
        this.notify({ type: 'error', message: this.error });
      }
    },

    // If user switches the view (month/week/day)
    handleViewChange(newView) {
      if (newView?.view) {
        this.currentView = newView.view.toLowerCase();
      }
      // Optionally close modals
      this.closeAddEventModal();
      this.closeDetailModal();
      this.closeEditModal();
      this.closeConfirmDeleteModal();
    },

    // Clicking an empty cell => create new event modal
    handleCellClick(cellInfo) {
      this.openAddEventModal();
      // Pre-fill times
      const date = cellInfo?.date || cellInfo?.start;
      if (date instanceof Date) {
        this.newEventStart = this.toLocalDateTime(date);
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + 1);
        this.newEventEnd = this.toLocalDateTime(endDate);
      }
    },
  },
};
</script>

<style scoped>
/* No additional styles needed as we're using global styles */
</style>
