<template>
  <div class="personal-calendar">
    <h2>{{ calendarName }}</h2>

    <!-- VueCal with "blue" theme -->
    <vue-cal
        ref="calendarRef"
        default-view="month"
        :events="vueCalEvents"
        style="height: 600px;"
        class="vuecal--blue-theme"
        @view-change="handleViewChange"
        @event-click="handleEventClick"
        @cell-click="handleCellClick"
    />

    <!-- "Add Event" Button -->
    <button class="btn-add-event" @click="openAddEventModal">
      + Add Event
    </button>

    <!-- Modal for Creating an Event -->
    <div v-if="showAddEventModal" class="modal-backdrop" @click.self="closeAddEventModal">
      <div class="modal-content">
        <h3>Create New Event</h3>
        <form @submit.prevent="createEvent">
          <div class="form-group">
            <label for="eventTitle">Title</label>
            <input
                id="eventTitle"
                v-model="newEventTitle"
                required
            />
          </div>
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input
                id="startTime"
                type="datetime-local"
                v-model="newEventStart"
                required
            />
          </div>
          <div class="form-group">
            <label for="endTime">End Time</label>
            <input
                id="endTime"
                type="datetime-local"
                v-model="newEventEnd"
                required
            />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
                id="description"
                v-model="newEventDescription"
                rows="3"
            ></textarea>
          </div>

          <button type="submit" class="btn-submit">Add Event</button>
          <button type="button" class="btn-cancel" @click="closeAddEventModal">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Event Detail Modal -->
    <div v-if="showDetailModal && selectedEvent" class="modal-backdrop" @click.self="closeDetailModal">
      <div class="modal-content">
        <h3>Event Detail</h3>
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p><strong>Description:</strong> {{ selectedEvent.description || '(No Description)' }}</p>

        <button @click="deleteEvent(selectedEvent.id)">Delete</button>
        <button @click="closeDetailModal">Close</button>
      </div>
    </div>

    <!-- Display any error messages -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';

export default {
  name: 'PersonalCalendar',
  components: { VueCal },
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

      // Add Event Modal
      showAddEventModal: false,
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',

      // Event Detail Modal
      showDetailModal: false,
      selectedEvent: null,

      // Current View
      currentView: 'month',
    };
  },
  mounted() {
    this.fetchEvents();
  },
  watch: {
    calendarId(newId, oldId) {
      // If the prop changes, re-fetch events
      if (newId !== oldId) {
        this.fetchEvents();
      }
    }
  },
  methods: {
    // Load events from your backend
    async fetchEvents() {
      try {
        const res = await axios.get(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/events`,
            {
              params: { userId: this.userId },
            }
        );
        const events = res.data.events || [];
        // Format events for VueCal
        this.vueCalEvents = events.map((ev) => ({
          id: ev.eventId,
          title: ev.title,
          start: this.formatForVueCal(ev.startTime),
          end: this.formatForVueCal(ev.endTime),
          description: ev.description,
        }));
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to load events.';
      }
    },

    // Converts ISO to "YYYY-MM-DD HH:mm" for VueCal
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

    // Converts a Date object to "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
    toLocalDateTime(dateObj) {
      if (!(dateObj instanceof Date)) return '';
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mm = String(dateObj.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d}T${hh}:${mm}`;
    },

    // Show the Add Event modal
    openAddEventModal() {
      this.showAddEventModal = true;
      // Reset the fields
      this.newEventTitle = '';
      this.newEventDescription = '';
      // Optionally, pre-fill the start/end times for the current day
      const now = new Date();
      this.newEventStart = this.toLocalDateTime(now);
      now.setHours(now.getHours() + 1);
      this.newEventEnd = this.toLocalDateTime(now);
    },

    closeAddEventModal() {
      this.showAddEventModal = false;
    },

    // Create the event
    async createEvent() {
      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart, // "YYYY-MM-DDTHH:mm"
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        await axios.post(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event`,
            payload
        );
        // Refresh events
        this.fetchEvents();
        this.closeAddEventModal();
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to create event.';
      }
    },

    // Event click => open detail modal
    handleEventClick({ event }) {
      if (!event) return;
      this.selectedEvent = { ...event };
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEvent = null;
    },

    // Delete event
    async deleteEvent(eventId) {
      if (!eventId) return;
      if (!confirm('Are you sure you want to delete this event?')) return;

      try {
        await axios.delete(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event/${eventId}/delete`,
            {
              data: { userId: this.userId },
            }
        );
        this.fetchEvents();
        this.closeDetailModal();
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to delete event.';
      }
    },

    // Track view changes
    handleViewChange(newView) {
      if (newView?.view) {
        this.currentView = newView.view.toLowerCase();
      }
      // Optionally close modals
      this.closeAddEventModal();
      this.closeDetailModal();
    },

    // Cell click => optionally open the Add Event modal with pre-filled date/time
    handleCellClick(cellInfo) {
      this.showAddEventModal = true;
      this.newEventTitle = '';
      this.newEventDescription = '';

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
@import 'vue-cal/dist/vuecal.css'; /* ensures base VueCal styles are loaded first */

/* Container styling */
.personal-calendar {
  background-color: #fff;
  border-radius: 6px;
  padding: 20px;
  position: relative;
}

.personal-calendar h2 {
  margin-top: 0;
}

/* "Add Event" button styling */
.btn-add-event {
  margin-top: 10px;
  background-color: #0078d4; /* Outlook Blue */
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-add-event:hover {
  background-color: #005fa3;
}

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

/* Modal Content */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: inline-block;
  margin-bottom: 6px;
  font-weight: 600;
}

/* Submit & Cancel in Modal */
.btn-submit {
  background-color: #0078d4;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}
.btn-submit:hover {
  background-color: #005fa3;
}
.btn-cancel {
  background-color: #ddd;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

/* Error message */
.error {
  color: red;
  margin-top: 10px;
}

/* ------------------------
   Custom "Blue" Theme for VueCal
   (we override some classes to mimic Outlook)
------------------------- */
.vuecal--blue-theme {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.vuecal--blue-theme .vuecal__header,
.vuecal--blue-theme .vuecal__navigation {
  background-color: #0078d4;
  color: #fff;
}

.vuecal--blue-theme .vuecal__weekdays {
  background-color: #f3f4f6;
  color: #333;
}

/* Today highlight */
.vuecal--blue-theme .vuecal__cell.vuecal__cell--today {
  background-color: rgba(0, 120, 212, 0.15);
}

/* Events */
.vuecal--blue-theme .vuecal__event {
  background-color: #0078d4 !important;
  border: 1px solid #005fa3 !important;
  color: #fff !important;
}
</style>
