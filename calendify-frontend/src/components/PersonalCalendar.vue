<template>
  <div class="personal-calendar">
    <h3>{{ calendarName }}</h3>

    <!-- VueCal component -->
    <vue-cal
        ref="calendarRef"
        default-view="month"
        :disable-views="['day']"
    style="height: 600px;"
    :events="vueCalEvents"
    @cell-click="handleCellClick"
    @event-click="handleEventClick"
    >
    </vue-cal>

    <div v-if="error" class="error">{{ error }}</div>

    <!-- ADD EVENT MODAL -->
    <div
        v-if="showAddEventForm"
        class="modal-backdrop"
        @click.self="cancelAddEvent"
    >
      <div class="modal-content">
        <h4>Add New Event</h4>
        <form @submit.prevent="handleAddEvent">
          <div class="form-group">
            <label>Title</label>
            <input v-model="newEventTitle" required />
          </div>

          <div class="form-group">
            <label>Start Time</label>
            <input type="datetime-local" v-model="newEventStart" required />
          </div>

          <div class="form-group">
            <label>End Time</label>
            <input type="datetime-local" v-model="newEventEnd" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newEventDescription"></textarea>
          </div>

          <button type="submit">Add Event</button>
          <button type="button" @click="cancelAddEvent">Cancel</button>
        </form>
      </div>
    </div>

    <!-- EVENT DETAIL MODAL -->
    <div
        v-if="showDetailModal && selectedEvent"
        class="modal-backdrop"
        @click.self="closeDetailModal"
    >
      <div class="modal-content">
        <h4>Event Detail</h4>
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p><strong>Description:</strong> {{ selectedEvent.description }}</p>

        <button @click="deleteEvent(selectedEvent.id)">Delete</button>
        <button @click="closeDetailModal">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import axios from 'axios'

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
      vueCalEvents: [],
      error: null,

      // Add-event form fields
      showAddEventForm: false,
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',

      // Detail modal
      showDetailModal: false,
      selectedEvent: null,
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      try {
        const res = await axios.get(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/events`,
            {
              params: { userId: this.userId }
            }
        );
        const events = res.data.events || [];

        // Convert to VueCal event format
        this.vueCalEvents = events.map(e => ({
          id: e.eventId,
          title: e.title,
          start: this.formatForVueCal(e.startTime),
          end: this.formatForVueCal(e.endTime),
          description: e.description,
        }));
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to load events.';
      }
    },

    // Convert an ISO string (e.g. "2025-01-06T10:00:00") -> "YYYY-MM-DD HH:mm" for vue-cal
    formatForVueCal(isoString) {
      if (!isoString) return '';
      const d = new Date(isoString);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${day} ${hh}:${mm}`;
    },

    // Called when user clicks an empty cell in VueCal
    handleCellClick({ date }) {
      // Check if currentView is 'week'
      const currentView = this.$refs.calendarRef.currentView;
      if (currentView !== 'week') {
        // In other views (month, year, years), do nothing or alert
        alert('You can only add events while in Week view!');
        return;
      }
      // In week view -> open the Add Event form
      this.showAddEventForm = true;
      this.newEventTitle = '';
      this.newEventDescription = '';
      // Convert date -> local string
      this.newEventStart = this.toLocalDateTime(date);
      this.newEventEnd   = this.toLocalDateTime(date);
    },

    // Called when user clicks an existing event
    handleEventClick({ event }) {
      // Show detail modal
      this.selectedEvent = { ...event };
      this.showDetailModal = true;
    },

    async handleAddEvent() {
      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart, // format: "2025-01-07T13:00"
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        await axios.post(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event`,
            payload
        );

        // Refresh
        this.fetchEvents();
        this.showAddEventForm = false;
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to add event.';
      }
    },

    async deleteEvent(eventId) {
      if (!confirm('Delete this event?')) return;

      try {
        await axios.delete(
            `${process.env.VUE_APP_BACKEND_ENDPOINT}/calendar/${this.calendarId}/event/${eventId}/delete`,
            {
              data: { userId: this.userId }
            }
        );
        this.fetchEvents();
        this.closeDetailModal();
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to delete event.';
      }
    },

    // Convert a Date -> "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
    toLocalDateTime(dateObj) {
      if (!(dateObj instanceof Date)) return '';
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mm = String(dateObj.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d}T${hh}:${mm}`;
    },

    // modal close
    cancelAddEvent() {
      this.showAddEventForm = false;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEvent = null;
    },
  },
};
</script>

<style scoped>
@import 'vue-cal/dist/vuecal.css';

.personal-calendar {
  position: relative;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
}

/* show any errors */
.error {
  color: red;
  margin: 10px 0;
}

/*
  Modal for adding events or showing details
*/
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  width: 400px;
}
.form-group {
  margin-bottom: 12px;
}
.form-group label {
  display: block;
  margin-bottom: 4px;
}
.modal-content button {
  margin-right: 6px;
  margin-top: 10px;
}
</style>
