<!-- src/components/HomeCalendar.vue -->
<template>
  <div :class="['home-calendar', `theme-${calendarColor}`, { 'dark-mode': isDarkMode }]">
    <h2>Home Calendar (All Events)</h2>

    <!-- VueCal to display all events from 'allEvents' in store -->
    <vue-cal
        :key="calendarColorKey"
        ref="calendarRef"
        :class="['vuecal--custom-theme', calendarThemeClass]"
        default-view="month"
        :disable-views-transition="true"
        :events="vueCalEvents"
        style="height: 600px;"
        @event-click="handleEventClick"
    />

    <!-- Button: Add Event (for personal calendars only) -->
    <button class="btn-add-event" @click="openAddEventModal">
      + Add Event
    </button>

    <!-- MODAL: ADD EVENT -->
    <div v-if="showAddEventModal" class="modal-backdrop add-event-modal" @click.self="closeAddEventModal">
      <div class="modal-content">
        <h3>Create New Event in Personal Calendar</h3>
        <form @submit.prevent="createEvent">
          <!-- Calendar Selection -->
          <div class="form-group">
            <label for="chooseCalendar">Select Personal Calendar:</label>
            <div class="dropdown-container">
              <select id="chooseCalendar" v-model="chosenCalendarId">
                <option
                    v-for="cal in personalCalendars"
                    :key="cal.calendarId"
                    :value="cal.calendarId"
                >
                  {{ cal.name }}
                </option>
              </select>
              <!-- Custom arrow icon -->
              <img
                  src="@/assets/icons/arrow-down-sign-to-navigate.png"
                  alt="dropdown arrow"
                  class="dropdown-arrow"
                  :class="{ rotated: dropdownOpen }"
              />
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label for="eventTitle">Title</label>
            <input id="eventTitle" v-model="newEventTitle" required />
          </div>

          <!-- Start Time -->
          <div class="form-group">
            <label for="startTime">Start Time</label>
            <input id="startTime" type="datetime-local" v-model="newEventStart" required />
          </div>

          <!-- End Time -->
          <div class="form-group">
            <label for="endTime">End Time</label>
            <input id="endTime" type="datetime-local" v-model="newEventEnd" required />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="newEventDescription" rows="3"></textarea>
          </div>

          <!-- Info message for group calendars -->
          <p class="info-text">
            To add events to group calendars, please open them separately from the sidebar.
          </p>

          <!-- Buttons -->
          <div class="modal-buttons">
            <button type="submit" class="btn-submit">Add Event</button>
            <button type="button" class="btn-cancel" @click="closeAddEventModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Conflict Modal -->
    <ConflictModal
        :visible="showConflictModal"
        :message="conflictMessage"
        @close="closeConflictModal"
    />

    <!-- MODAL: Event Info (read-only for now) -->
    <div v-if="showDetailModal && selectedEvent" class="modal-backdrop event-info-modal" @click.self="closeDetailModal">
      <div class="modal-content">
        <h3>Event Information</h3>
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p><strong>Description:</strong> {{ selectedEvent.description || '(No Description)' }}</p>

        <div class="modal-buttons">
          <button class="btn-cancel" @click="closeDetailModal">Close</button>
          <!-- Optionally add "Edit" or "Delete" if you want. -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { mapGetters, mapActions } from 'vuex';
import ConflictModal from "@/components/ConflictModal.vue";
import calendarService from '@/services/calendarService'; // Ensure correct import

export default {
  name: 'HomeCalendar',
  components: { ConflictModal, VueCal },
  props: {
    userId: { type: String, required: true },
    calendarColor: { type: String, default: 'blue' },
  },
  data() {
    return {
      calendarColorKey: 0,
      showDetailModal: false,
      selectedEvent: null,
      dropdownOpen: false, // for calendar selection dropdown
      // "Add Event" modal
      showAddEventModal: false,
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',
      chosenCalendarId: '', // which personal calendar to add the event to
      showConflictModal: false,
      conflictMessage: '',
    };
  },
  watch: {
    chosenCalendarId() {
      this.dropdownOpen = false; // Close the arrow when selection changes
    },
  },
  computed: {
    ...mapGetters(['allEvents', 'calendars', 'defaultCalendarId']),
    vueCalEvents() {
      // Convert each allEvents entry to a VueCal-friendly object
      return this.allEvents.map((ev) => ({
        id: ev.eventId,
        title: ev.title,
        start: this.formatForVueCal(ev.startTime),
        end: this.formatForVueCal(ev.endTime),
        description: ev.description,
        calendarId: ev.calendarId,
      }));
    },
    // Filter out only group calendars (isGroup === true)
    groupCalendars() {
      if (!this.calendars) return [];
      return this.calendars.filter((c) => c.isGroup === true);
    },
    // Filter out only personal calendars (isGroup === false)
    personalCalendars() {
      if (!this.calendars) return [];
      return this.calendars.filter((c) => c.isGroup === false);
    },
    calendarThemeClass() {
      return `theme-${this.calendarColor}`;
    },
    isDarkMode() {
      // If you have a store or prop for dark mode, handle it. Otherwise, return false.
      return false;
    },
  },
  mounted() {
    // Initialize chosenCalendarId to first personal calendar
    if (this.personalCalendars.length > 0) {
      this.chosenCalendarId = this.personalCalendars[0].calendarId;
    }
  },
  methods: {
    ...mapActions(['notify', 'fetchAllEvents']), // fetchAllEvents reloads all user events

    // EVENT CLICK => show detail modal
    handleEventClick(evt) {
      console.log('Clicked event =>', evt);
      this.selectedEvent = { ...evt };
      this.showDetailModal = true;
    },
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEvent = null;
    },

    // "Add Event" modal
    openAddEventModal() {
      if (!this.chosenCalendarId) {
        this.notify({ type: 'error', message: 'No personal calendar selected.' });
        return;
      }
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

    // CREATE EVENT for chosenCalendarId
    async createEvent() {
      if (!this.chosenCalendarId) {
        this.notify({ type: 'error', message: 'Please select a personal calendar to add the event.' });
        return;
      }

      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart,
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        // Use calendarService.addEvent
        await calendarService.addEvent(this.chosenCalendarId, payload);

        // Refresh the store’s all events
        await this.fetchAllEvents();

        this.notify({ type: 'success', message: 'Event created successfully.' });
        this.closeAddEventModal();
      } catch (err) {
        if (err.response && err.response.status === 409) {
          // Conflict detected
          this.conflictMessage = err.response.data.error || 'There was a conflict while creating the event.';
          this.showConflictModal = true;
        } else {
          const errorMsg = err?.response?.data?.error || 'Failed to create event.';
          this.notify({
            type: 'error',
            message: `<strong>Error:</strong> ${errorMsg.replace(/\n/g, '<br>')}`
          });
        }
      }
    },
    closeConflictModal() {
      this.showConflictModal = false;
      this.conflictMessage = '';
    },
    // Format from ISO => "YYYY-MM-DD HH:mm" for VueCal
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

    // Convert JS Date => "YYYY-MM-DDTHH:mm"
    toLocalDateTime(dateObj) {
      if (!(dateObj instanceof Date)) return '';
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mm = String(dateObj.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d}T${hh}:${mm}`;
    },
  },
};
</script>

<style scoped>
/* Minimal local styles, or rely on global styles. */
/* Container for dropdown and arrow */
.dropdown-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* Dropdown styling */
.dropdown-container select {
  appearance: none; /* Removes default arrow */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #fff;
  font-size: 1rem;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  color: #333;
  outline: none;
  transition: border-color 0.2s ease;
  cursor: pointer;
}

/* Show a nice focus border */
.dropdown-container select:focus {
  border-color: var(--primary-color);
}

/* Hover effect for the dropdown */
.dropdown-container select:hover {
  border-color: #bbb;
  background-color: #fafafa;
}

/* Dropdown arrow styling */
.dropdown-arrow {
  position: absolute;
  top: 50%;
  right: 12px; /* Adjust based on padding of the dropdown */
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  transition: transform 0.3s ease; /* Smooth rotation */
  pointer-events: none; /* Make the arrow unclickable */
}

/* Rotate arrow when dropdown is open */
.dropdown-arrow.rotated {
  transform: translateY(-50%) rotate(180deg);
}


/* Example styling for the new "Add Event" button */
.btn-add-event {
  margin-top: 10px;
  background-color: var(--primary-color);
  color: #fff;
  font-size: 1rem;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-add-event:hover {
  background-color: var(--event-hover-color);
}

/* Info text styling */
.info-text {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background-color: #f5f6fa; /* a light gray/blue background */
  color: #444;
  border-left: 4px solid var(--primary-color);
  border-radius: 4px;
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Add Event modal specific z-index */
.modal-backdrop.add-event-modal {
  z-index: 1000; /* Lower than ConflictModal and Event Info Modal */
}

/* Event Info modal specific z-index */
.modal-backdrop.event-info-modal {
  z-index: 1500; /* Between Add Event and ConflictModal */
}
</style>
