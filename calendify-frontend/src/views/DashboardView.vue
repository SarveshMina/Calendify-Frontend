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
        <!-- Dark Mode Toggle -->
        <button
            @click="toggleDarkMode"
            class="toggle-container"
            aria-label="Toggle Dark Mode"
        >
          <img :src="darkMode ? moonIcon : sunIcon" alt="Dark Mode Toggle" />
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

      <!-- + CREATE CALENDAR button -->
      <button class="btn-create-calendar" @click="openCreateModal">
        + Create Calendar
      </button>

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
    </aside>

    <!-- Main content: big calendar -->
    <main class="blue-main">
      <PersonalCalendar
          v-if="activeCalendarId"
          :userId="userId"
          :calendarId="activeCalendarId"
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
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      darkMode: false,
    };
  },
  computed: {
    ...mapGetters(['userId', 'defaultCalendarId']),
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
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    },
  },
};
</script>