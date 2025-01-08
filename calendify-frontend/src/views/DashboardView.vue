<template>
  <div class="blue-container">
    <!-- Outlook-Inspired Header -->
    <header class="blue-header">
      <div class="header-left">
        <h1>Welcome to Calendify</h1>
      </div>
      <div class="header-right">
        <span>User ID: {{ userId }}</span>
        <!-- Dark Mode Toggle Button -->
        <button
            @click="toggleDarkMode"
            class="toggle-container"
            aria-label="Toggle Dark Mode"
        >
          <img :src="darkMode ? moonIcon : sunIcon" alt="Dark Mode Toggle" class="toggle-icon" />
        </button>
        <button @click="handleLogout">Logout</button>
      </div>
    </header>

    <!-- Outlook-Like Sidebar -->
    <aside class="blue-sidebar">
      <h3>Your Calendars</h3>
      <ul>
        <li
            v-for="cal in userCalendars"
            :key="cal.calendarId"
            @click="setActiveCalendar(cal.calendarId)"
            :class="{ active: cal.calendarId === activeCalendarId }"
        >
          {{ cal.name }}
        </li>
      </ul>

      <!-- Buttons Section -->
      <div class="sidebar-buttons">
        <!-- + CREATE CALENDAR button -->
        <button class="btn-create-calendar" @click="openCreateModal">
          + Create Calendar
        </button>

        <!-- VIEW CALENDAR DETAILS button -->
        <button
            class="btn-view-details"
            @click="openDetailsModal"
            :disabled="!activeCalendar"
        >
          View Calendar Details
        </button>
      </div>

      <!-- CREATE CALENDAR MODAL -->
      <div v-if="showCreateModal" class="modal-backdrop" @click.self="closeCreateModal">
        <div class="modal-content">
          <h3>Create New Personal Calendar</h3>
          <form @submit.prevent="createNewCalendar">
            <div class="form-group">
              <label for="calendarName">Calendar Name:</label>
              <input id="calendarName" v-model="newCalendarName" required />
            </div>

            <button type="submit" class="btn-submit">Create</button>
            <button type="button" class="btn-cancel" @click="closeCreateModal">
              Cancel
            </button>
          </form>
        </div>
      </div>

      <!-- VIEW CALENDAR DETAILS MODAL -->
      <div v-if="showDetailsModal" class="modal-backdrop" @click.self="closeDetailsModal">
        <div class="modal-content">
          <h3>Calendar Details</h3>
          <p><strong>Name:</strong> {{ activeCalendar.name }}</p>
          <p><strong>Owner ID:</strong> {{ activeCalendar.ownerId }}</p>
          <p><strong>Is Group:</strong> {{ activeCalendar.isGroup ? 'Yes' : 'No' }}</p>
          <p><strong>Members:</strong>
            <span v-if="activeCalendar.isGroup && activeCalendar.members.length">
              {{ activeCalendar.members.join(', ') }}
            </span>
            <span v-else>
              N/A
            </span>
          </p>

          <!-- Buttons Section -->
          <div class="modal-buttons">
            <button class="btn-edit" @click="openEditModal">Edit</button>
            <button class="btn-delete" @click="deleteCalendar">Delete Calendar</button>
            <button class="btn-cancel" @click="closeDetailsModal">Close</button>
          </div>
        </div>
      </div>

      <!-- EDIT CALENDAR MODAL (Placeholder) -->
      <div v-if="showEditModal" class="modal-backdrop" @click.self="closeEditModal">
        <div class="modal-content">
          <h3>Edit Calendar</h3>
          <p>Edit functionality will be available soon.</p>
          <button class="btn-cancel" @click="closeEditModal">Close</button>
        </div>
      </div>
    </aside>

    <!-- Main content: big calendar -->
    <main class="blue-main">
      <PersonalCalendar
          v-if="activeCalendarId"
          :userId="userId"
          :calendarId="activeCalendarId"
          :calendar-name="activeCalendar.name"
      />
      <p v-else>Loading calendar...</p>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PersonalCalendar from '@/components/PersonalCalendar.vue';
import calendarService from '@/services/calendarService'; // importing service
import '@/assets/styles/styles.css'; // importing global styles

export default {
  name: 'DashboardView',
  components: { PersonalCalendar },
  data() {
    return {
      userCalendars: [],
      activeCalendarId: null,
      // For creating a new calendar
      showCreateModal: false,
      newCalendarName: '',
      // For viewing calendar details
      showDetailsModal: false,
      // For editing calendar (placeholder)
      showEditModal: false,
      // Icons for dark mode toggle
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      darkMode: false,
    };
  },
  computed: {
    ...mapGetters(['userId', 'defaultCalendarId']),
    activeCalendar() {
      return this.userCalendars.find(cal => cal.calendarId === this.activeCalendarId);
    },
  },
  mounted() {
    this.fetchUserCalendars();
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    },
    async fetchUserCalendars() {
      try {
        const response = await calendarService.getUserCalendars(this.userId);
        const data = response.data;
        if (data.calendars) {
          // Filter for personal only (isGroup === false), if desired
          this.userCalendars = data.calendars.filter((cal) => cal.isGroup === false);

          if (this.userCalendars.length > 0) {
            const defaultCal = this.userCalendars.find(
                (cal) => cal.calendarId === this.defaultCalendarId
            );
            if (defaultCal) {
              this.activeCalendarId = defaultCal.calendarId;
            } else {
              this.activeCalendarId = this.userCalendars[0].calendarId;
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch user calendars:', err);
      }
    },

    setActiveCalendar(calendarId) {
      this.activeCalendarId = calendarId;
      // Close any open modals when switching calendars
      this.closeDetailsModal();
      this.closeEditModal();
    },

    // CREATE CALENDAR FLOW
    openCreateModal() {
      this.showCreateModal = true;
      this.newCalendarName = '';
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    async createNewCalendar() {
      try {
        // Call the service to create a personal calendar
        await calendarService.createPersonalCalendar(this.userId, this.newCalendarName);

        // Close modal
        this.closeCreateModal();

        // Refresh the calendar list so the new one appears
        await this.fetchUserCalendars();
      } catch (err) {
        console.error('Error creating a personal calendar:', err);
      }
    },

    // VIEW CALENDAR DETAILS FLOW
    openDetailsModal() {
      if (!this.activeCalendar) return;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },

    // EDIT CALENDAR FLOW (Placeholder)
    openEditModal() {
      this.showEditModal = true;
      this.showDetailsModal = false;
    },
    closeEditModal() {
      this.showEditModal = false;
    },

    // DELETE CALENDAR FLOW
    async deleteCalendar() {
      if (!this.activeCalendar) return;
      if (!confirm(`Are you sure you want to delete the calendar "${this.activeCalendar.name}"? This action cannot be undone.`)) {
        return;
      }

      try {
        await calendarService.deletePersonalCalendar(this.activeCalendar.calendarId, this.userId);
        alert('Calendar deleted successfully.');
        // Refresh the calendar list
        await this.fetchUserCalendars();
        // Close the modal
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error deleting calendar:', err);
        alert('Failed to delete calendar. Please try again.');
      }
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    },
  },
};
</script>
