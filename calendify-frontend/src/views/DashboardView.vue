<template>
  <div class="blue-container">
    <!-- Outlook-Inspired Header -->
    <header class="blue-header">
      <div class="header-left">
        <h1>Welcome to Calendify</h1>
      </div>
      <div class="header-right">
        <span>User ID: {{ userId }}</span>
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
      <div
          v-if="showCreateModal"
          class="modal-backdrop"
          @click.self="closeCreateModal"
      >
        <div class="modal-content">
          <h3>Create New Personal Calendar</h3>
          <!-- Simple form -->
          <form @submit.prevent="createNewCalendar">
            <div class="form-group">
              <label for="calendarName">Calendar Name:</label>
              <input
                  id="calendarName"
                  v-model="newCalendarName"
                  required
              />
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
  },
};
</script>

<style scoped>
/*
   OUTLOOK-LIKE LAYOUT
   We use CSS Grid for a top header, left sidebar, and main content area.
*/
.blue-container {
  display: grid;
  grid-template-columns: 250px 1fr; /* sidebar: 250px, main: auto */
  grid-template-rows: 60px auto;    /* header: 60px, then main area */
  height: 100vh; /* full viewport height */
}

/* Top header spans all columns */
.blue-header {
  grid-column: 1 / span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0078d4; /* Outlook/Office blue */
  color: #fff;
  padding: 0 20px;
}

/* Header left side */
.header-left h1 {
  margin: 0;
  font-size: 1.4rem;
}

/* Header right side */
.header-right {
  display: flex;
  align-items: center;
}
.header-right span {
  margin-right: 1rem;
  font-weight: 500;
}
.header-right button {
  background-color: #fff;
  color: #0078d4;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.header-right button:hover {
  background-color: #ededed;
}

/* Sidebar */
.blue-sidebar {
  grid-row: 2;
  background-color: #f3f4f6; /* light grey */
  padding: 20px;
}

.blue-sidebar h3 {
  margin-top: 0;
}

.blue-sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.blue-sidebar li {
  padding: 8px;
  margin-bottom: 5px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.blue-sidebar li:hover {
  background-color: #e5e7eb;
}

.blue-sidebar li.active {
  border-left: 4px solid #0078d4;
  font-weight: 600;
  background-color: #dbeafe; /* a light blue highlight */
}

/* + CREATE CALENDAR button */
.btn-create-calendar {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #0078d4;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-create-calendar:hover {
  background-color: #005fa3;
}

/* Main content area (calendar) */
.blue-main {
  grid-row: 2;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
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
  width: 350px;
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

.btn-submit {
  margin-right: 10px;
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-submit:hover {
  background-color: #005fa3;
}

.btn-cancel {
  background-color: #ddd;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
