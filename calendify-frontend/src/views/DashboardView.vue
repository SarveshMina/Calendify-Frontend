<template>
  <div :class="['blue-container', activeCalendar?.color ? `theme-${activeCalendar.color}` : 'theme-blue']">
    <!-- Header -->
    <header class="blue-header">
      <div class="header-left">
        <h1>Welcome to Calendify</h1>
      </div>
      <div class="header-right">
        <span>User ID: {{ userId }}</span>
        <button @click="toggleDarkMode" class="toggle-container" aria-label="Toggle Dark Mode">
          <img :src="darkMode ? moonIcon : sunIcon" alt="Dark Mode Toggle" class="toggle-icon" />
        </button>
        <button @click="handleLogout">Logout</button>
      </div>
    </header>

    <!-- Sidebar -->
    <aside class="blue-sidebar">
      <h3>Your Calendars</h3>
      <ul>
        <li
            v-for="cal in userCalendars"
            :key="cal.calendarId"
            @click="setActiveCalendar(cal.calendarId)"
            :class="{ active: cal.calendarId === activeCalendarId }"
            :style="{ '--cal-indicator': calColor(cal.color) }"
        >
          {{ cal.name }}
        </li>
      </ul>

      <!-- Sidebar buttons -->
      <div class="sidebar-buttons">
        <button class="btn-create-calendar" @click="openCreateModal">
          + Create Personal Calendar
        </button>
        <button class="btn-create-calendar" @click="openCreateGroupModal">
          + Create Group Calendar
        </button>
        <button class="btn-view-details" @click="openDetailsModal" :disabled="!activeCalendar">
          View Calendar Details
        </button>
      </div>

      <!-- CREATE PERSONAL CALENDAR MODAL -->
      <div v-if="showCreateModal" class="modal-backdrop" @click.self="closeCreateModal">
        <div class="modal-content">
          <!-- Preview text color by mapping to actual hex -->
          <h3 :style="{ color: calColor(selectedColor) }">Create New Personal Calendar</h3>
          <form @submit.prevent="createNewCalendar">
            <div class="form-group">
              <label
                  for="calendarName"
                  :style="{ color: calColor(selectedColor) }"
              >
                Calendar Name:
              </label>
              <input
                  id="calendarName"
                  v-model="newCalendarName"
                  required
              />
            </div>

            <!-- Color Selection -->
            <div class="form-group">
              <label
                  for="calendarColor"
                  :style="{ color: calColor(selectedColor) }"
              >
                Choose a Color:
              </label>
              <div id="calendarColor" class="color-options">
                <label
                    v-for="color in availableColors"
                    :key="color.value"
                    :style="{ backgroundColor: calColor(color.value) }"
                    class="color-option"
                    :class="{ selected: color.value === selectedColor }"
                >
                  <input
                      type="radio"
                      name="calendarColor"
                      :value="color.value"
                      v-model="selectedColor"
                      required
                  />
                  <span class="color-circle"></span>
                </label>
              </div>
            </div>

            <!-- Submit button: also uses mapped color for background -->
            <button
                type="submit"
                class="btn-submit"
                :style="{ backgroundColor: calColor(selectedColor) }"
            >
              Create
            </button>
            <button type="button" class="btn-cancel" @click="closeCreateModal">Cancel</button>
          </form>
        </div>
      </div>

      <!-- CREATE GROUP CALENDAR MODAL -->
      <div v-if="showCreateGroupModal" class="modal-backdrop" @click.self="closeCreateGroupModal">
        <div class="modal-content">
          <!-- Preview text color by mapping to actual hex -->
          <h3 :style="{ color: calColor(groupSelectedColor) }">Create New Group Calendar</h3>
          <form @submit.prevent="createNewGroupCalendar">
            <!-- Group Calendar Name -->
            <div class="form-group">
              <label
                  for="groupCalName"
                  :style="{ color: calColor(groupSelectedColor) }"
              >
                Calendar Name:
              </label>
              <input id="groupCalName" v-model="groupCalendarName" required />
            </div>

            <!-- Group Calendar Color Selection -->
            <div class="form-group">
              <label
                  for="groupCalColor"
                  :style="{ color: calColor(groupSelectedColor) }"
              >
                Choose a Color:
              </label>
              <div id="groupCalColor" class="color-options">
                <label
                    v-for="color in availableColors"
                    :key="color.value"
                    :style="{ backgroundColor: calColor(color.value) }"
                    class="color-option"
                    :class="{ selected: groupSelectedColor === color.value }"
                >
                  <input
                      type="radio"
                      name="groupCalendarColor"
                      :value="color.value"
                      v-model="groupSelectedColor"
                      required
                  />
                  <span class="color-circle"></span>
                </label>
              </div>
            </div>

            <!-- Add Member Usernames -->
            <div class="form-group">
              <label
                  for="memberUsername"
                  :style="{ color: calColor(groupSelectedColor) }"
              >
                Add Members (Usernames):
              </label>
              <div class="member-chips">
                <div
                    v-for="(member, index) in groupMembers"
                    :key="index"
                    class="chip"
                    :style="{ backgroundColor: calColor(groupSelectedColor), color: '#fff' }"
                >
                  {{ member.username }}
                  <span class="chip-close" @click="removeMember(index)">×</span>
                </div>
              </div>
              <div class="member-input">
                <input
                    id="memberUsername"
                    v-model="memberUsername"
                    @keyup.enter.prevent="handleAddMember"
                    placeholder="Type username and press Enter"
                />
                <button
                    type="button"
                    class="btn-submit"
                    @click="handleAddMember"
                    :style="{ backgroundColor: calColor(groupSelectedColor) }"
                >
                  Add
                </button>
              </div>
              <p class="help-text">Max 4 additional members (5 total with you).</p>
            </div>

            <button
                type="submit"
                class="btn-submit"
                :style="{ backgroundColor: calColor(groupSelectedColor) }"
            >
              Create Group Calendar
            </button>
            <button type="button" class="btn-cancel" @click="closeCreateGroupModal">Cancel</button>
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
          <p>
            <strong>Members:</strong>
            <span v-if="activeCalendar.isGroup && activeCalendar.members.length">
              {{ activeCalendar.members.join(', ') }}
            </span>
            <span v-else>N/A</span>
          </p>
          <div class="modal-buttons">
            <button class="btn-edit" @click="openEditModal">Edit</button>
            <button class="btn-delete" @click="confirmDeleteCalendar">Delete Calendar</button>
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

      <!-- Confirmation Modal for Deletion -->
      <ConfirmationModal
          :visible="showConfirmDeleteModal"
          title="Confirm Deletion"
          message="Are you sure you want to delete this calendar? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          @confirm="deleteCalendar"
          @cancel="closeConfirmDeleteModal"
      />
    </aside>

    <!-- Main content: HomeCalendar or PersonalCalendar -->
    <main class="blue-main">
      <HomeCalendar
          v-if="activeCalendarId === defaultCalendarId"
          :userId="userId"
          :calendar-color="activeCalendarColor"
      />
      <PersonalCalendar
          v-else-if="activeCalendarId"
          :userId="userId"
          :calendarId="activeCalendarId"
          :calendar-color="activeCalendarColor"
          :calendar-name="activeCalendar?.name || 'My Calendar'"
      />
      <p v-else>
        Loading calendar... (activeCalendarId={{ activeCalendarId }}, defaultCalendarId={{ defaultCalendarId }})
      </p>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PersonalCalendar from '@/components/PersonalCalendar.vue';
import HomeCalendar from '@/components/HomeCalendar.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import calendarService from '@/services/calendarService';
import '@/assets/styles/styles.css';

export default {
  name: 'DashboardView',
  components: { PersonalCalendar, HomeCalendar, ConfirmationModal },
  data() {
    return {
      // Personal Calendar Modal
      showCreateModal: false,
      newCalendarName: '',
      selectedColor: '',
      // Group Calendar Modal
      showCreateGroupModal: false,
      groupCalendarName: '',
      groupSelectedColor: '',
      groupMembers: [],
      memberUsername: '',
      // For details
      showDetailsModal: false,
      // For editing calendar (placeholder)
      showEditModal: false,
      // For deletion
      showConfirmDeleteModal: false,

      availableColors: [
        { name: 'Pink', value: 'pink' },
        { name: 'Green', value: 'green' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Red', value: 'red' },
        { name: 'Purple', value: 'purple' },
        { name: 'Orange', value: 'orange' },
      ],

      // Dark mode
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      darkMode: false
    };
  },
  computed: {
    ...mapGetters([
      'userId',
      'defaultCalendarId',
      'calendars', // array of user calendars
      'activeCalendarId',
      'activeCalendar'
    ]),
    userCalendars() {
      return this.calendars;
    },
    activeCalendarColor() {
      return this.activeCalendar ? this.activeCalendar.color : 'blue';
    }
  },
  mounted() {
    // If user is already logged in, fetch calendars
    if (this.userId) {
      this.fetchCalendars();
    }
  },
  methods: {
    ...mapActions([
      'logout',
      'notify',
      'fetchCalendars',
      'fetchAllEvents'
    ]),

    // Maps color strings (like 'pink') to the actual hex code you want to display
    calColor(color) {
      if (color === 'pink') {
        return '#e91e63';
      } else if (color === 'green') {
        return '#4caf50';
      } else if (color === 'yellow') {
        return '#DFC140';
      } else if (color === 'red') {
        return '#f44336';
      } else if (color === 'purple') {
        return '#9c27b0';
      } else if (color === 'orange') {
        return '#ff9800';
      }
      // Default to blue if color value is not recognized
      return '#0078d4';
    },

    handleLogout() {
      this.logout();
      this.$router.push('/');
    },

    setActiveCalendar(calendarId) {
      this.$store.commit('SET_ACTIVE_CALENDAR_ID', calendarId);
      this.closeDetailsModal();
      this.closeEditModal();
      this.closeConfirmDeleteModal();
    },

    openCreateModal() {
      this.showCreateModal = true;
      this.newCalendarName = '';
      this.selectedColor = '';
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },
    async createNewCalendar() {
      try {
        // We send the raw 'pink' etc. to backend but show #e91e63 in UI
        await calendarService.createPersonalCalendar(
            this.userId,
            this.newCalendarName,
            this.selectedColor
        );
        this.closeCreateModal();
        await this.fetchCalendars();
        this.notify({ type: 'success', message: 'Personal calendar created successfully.' });
      } catch (err) {
        console.error('Error creating personal calendar:', err);
        this.notify({ type: 'error', message: 'Failed to create personal calendar.' });
      }
    },

    openCreateGroupModal() {
      this.showCreateGroupModal = true;
      this.groupCalendarName = '';
      this.groupSelectedColor = '';
      this.groupMembers = [];
      this.memberUsername = '';
    },
    closeCreateGroupModal() {
      this.showCreateGroupModal = false;
    },
    async handleAddMember() {
      const trimmed = this.memberUsername.trim();
      if (!trimmed) return;

      if (this.groupMembers.length >= 4) {
        this.notify({ type: 'error', message: 'Max 4 additional members allowed.' });
        return;
      }
      if (this.groupMembers.find(m => m.username.toLowerCase() === trimmed.toLowerCase())) {
        this.notify({ type: 'error', message: `User '${trimmed}' already added.` });
        return;
      }

      try {
        const resp = await calendarService.validateUsername(trimmed);
        const userId = resp.data.userId;
        if (userId) {
          this.groupMembers.push({ username: trimmed, userId });
          this.memberUsername = '';
          this.notify({ type: 'success', message: `User '${trimmed}' added.` });
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.notify({ type: 'error', message: `User '${trimmed}' does not exist.` });
        } else {
          console.error('Error validating username:', err);
          this.notify({ type: 'error', message: 'Failed to validate username. Please try again.' });
        }
      }
    },
    removeMember(index) {
      const removed = this.groupMembers.splice(index, 1)[0];
      this.notify({ type: 'info', message: `User '${removed.username}' removed.` });
    },
    async createNewGroupCalendar() {
      try {
        // Send the raw 'pink' etc. to backend but show #e91e63 in UI
        const ownerId = this.userId;
        const colorToUse = this.groupSelectedColor || 'pink';
        const memberUsernames = this.groupMembers.map(m => m.username);

        await calendarService.createGroupCalendar(
            ownerId,
            this.groupCalendarName,
            memberUsernames,
            colorToUse
        );
        this.notify({ type: 'success', message: 'Group calendar created successfully.' });
        this.closeCreateGroupModal();
        await this.fetchCalendars();
      } catch (err) {
        console.error('Error creating group calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to create group calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    openDetailsModal() {
      if (!this.activeCalendar) return;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },

    openEditModal() {
      this.showEditModal = true;
      this.showDetailsModal = false;
    },
    closeEditModal() {
      this.showEditModal = false;
    },

    confirmDeleteCalendar() {
      this.showConfirmDeleteModal = true;
    },
    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    },
    async deleteCalendar() {
      if (!this.activeCalendar) return;
      try {
        await calendarService.deletePersonalCalendar(
            this.activeCalendar.calendarId,
            this.userId
        );
        this.notify({ type: 'success', message: 'Calendar deleted successfully.' });
        await this.fetchCalendars();
        this.closeDetailsModal();
        this.closeConfirmDeleteModal();
      } catch (err) {
        console.error('Error deleting calendar:', err);
        this.notify({ type: 'error', message: 'Failed to delete calendar.' });
      }
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }
};
</script>

<style scoped>
/* No additional local styles needed if you rely on global styles */
</style>