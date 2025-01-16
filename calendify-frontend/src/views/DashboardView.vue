<!-- src/components/Dashboard.vue -->
<template>
  <div :class="['blue-container', activeCalendar?.color ? `theme-${activeCalendar.color}` : 'theme-blue']">
    <!-- Header -->
    <header class="blue-header">
      <div class="header-left">
        <router-link to="/dashboard" class="logo-link">
          <img
              :src="darkMode ? require('@/assets/icons/logo-dark.webp') : require('@/assets/icons/logo-light.webp')"
              alt="Calendify Logo"
              class="calendify-logo"
          />
          <h1>Welcome to Calendify</h1>
        </router-link>
      </div>
      <div class="header-right">
        <span>User ID: {{ userId }}</span>
        <!-- The user-icon button -->
        <div class="account-dropdown" ref="accountDropdown">
          <button class="user-icon-btn" @click="toggleAccountPanel" aria-label="Open Account Panel">
            <img
                :src="darkMode ? darkUserIcon : lightUserIcon"
                alt="User Icon"
                class="user-icon"
            />
          </button>

          <!-- Dropdown Panel with Transition -->
          <transition name="fade-slide">
            <div
                v-if="showAccountPanel"
                class="account-panel"
                @click.stop
            >
              <h2>Account Management</h2>

              <!-- Current details -->
              <div class="profile-details">
                <p><strong>Username:</strong> {{ currentapUsername }}</p>
                <button class="btn-edit-field" @click="openEditFieldModal('username')">Edit</button>

                <p><strong>Email:</strong> {{ currentapEmail }}</p>
                <button class="btn-edit-field" @click="openEditFieldModal('email')">Edit</button>

                <button class="btn-edit-field" @click="openEditFieldModal('password')">Change Password</button>
              </div>

              <hr />

              <!-- "My Calendars" section -->
              <div class="profile-calendars">
                <h3>Your Calendars</h3>
                <ul class="calendar-list">
                  <li
                      v-for="cal in userCalendars"
                      :key="cal.calendarId"
                      class="calendar-item"
                  >
                    <span>
                      <strong>{{ cal.name }}</strong>
                      <small>({{ cal.isGroup ? 'Group' : 'Personal' }})</small>
                    </span>
                    <button
                        class="btn-goto-calendar"
                        @click="accountPanelGotoCalendar(cal.calendarId)"
                    >
                      Open
                    </button>
                  </li>
                </ul>
              </div>

              <div class="modal-buttons">
                <button type="button" class="btn-cancel" @click="closeAccountPanel">Close</button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Dark Mode Toggle -->
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
      <div v-if="showCreateModal" class="modal-backdrop add-event-modal" @click.self="closeCreateModal">
        <div class="modal-content">
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

            <!-- Submit and Cancel buttons -->
            <div class="modal-buttons">
              <button
                  type="submit"
                  class="btn-submit"
                  :style="{ backgroundColor: calColor(selectedColor) }"
              >
                Create
              </button>
              <button type="button" class="btn-cancel" @click="closeCreateModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- CREATE GROUP CALENDAR MODAL -->
      <div v-if="showCreateGroupModal" class="modal-backdrop add-event-modal" @click.self="closeCreateGroupModal">
        <div class="modal-content">
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

            <!-- Submit and Cancel buttons -->
            <div class="modal-buttons">
              <button
                  type="submit"
                  class="btn-submit"
                  :style="{ backgroundColor: calColor(groupSelectedColor) }"
              >
                Create Group Calendar
              </button>
              <button type="button" class="btn-cancel" @click="closeCreateGroupModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- VIEW CALENDAR DETAILS MODAL -->
      <div v-if="showDetailsModal" class="modal-backdrop event-info-modal" @click.self="closeDetailsModal">
        <div class="modal-content">
          <h3>Calendar Details</h3>
          <p><strong>Name:</strong> {{ activeCalendar.name }}</p>
          <p><strong>Owner:</strong> {{ getUsername(activeCalendar.ownerId) }}</p>
          <p><strong>Is Group:</strong> {{ activeCalendar.isGroup ? 'Yes' : 'No' }}</p>

          <div v-if="activeCalendar.isGroup">
            <p><strong>Members:</strong></p>
            <div class="members-container">
              <div
                  v-for="(username, index) in activeCalendar.memberUsernames"
                  :key="index"
                  class="member-tile"
                  :style="{ backgroundColor: calColor(activeCalendar.color) }"
              >
                <span>{{ username }}</span>
                <button
                    v-if="isAdmin && username !== getUsername(userId)"
                    class="remove-user-btn"
                    @click="removeUser(username)"
                    aria-label="Remove User"
                >
                  ×
                </button>
              </div>
            </div>
            <button
                v-if="isAdmin"
                class="btn-add-user"
                @click="openAddUserModal"
            >
              + Add User
            </button>
            <button
                v-else
                class="btn-leave-calendar"
                @click="openLeaveCalendarModal"
            >
              Leave Group Calendar
            </button>
          </div>

          <div class="modal-buttons">
            <button class="btn-edit" @click="openEditCalendarModal" v-if="isAdmin">Edit</button>
            <button class="btn-delete" @click="confirmDeleteCalendar" v-if="isAdmin">Delete Calendar</button>
            <button class="btn-cancel" @click="closeDetailsModal">Close</button>
          </div>
        </div>
      </div>

      <!-- ADD USER MODAL -->
      <div v-if="showAddUserModal" class="modal-backdrop" @click.self="closeAddUserModal">
        <div class="modal-content">
          <h3>Add User to Calendar</h3>
          <form @submit.prevent="addUser">
            <div class="form-group">
              <label for="addUser">Username:</label>
              <input
                  id="addUser"
                  v-model="newUserToAdd"
                  required
                  placeholder="Enter username"
              />
            </div>
            <div class="modal-buttons">
              <button type="submit" class="btn-submit">Add</button>
              <button type="button" class="btn-cancel" @click="closeAddUserModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- EDIT CALENDAR MODAL -->
      <div v-if="showEditCalendarModal" class="modal-backdrop" @click.self="closeEditCalendarModal">
        <div class="modal-content">
          <h3>Edit Calendar</h3>
          <form @submit.prevent="editCalendar">
            <div class="form-group">
              <label for="editCalendarName">Name:</label>
              <input
                  id="editCalendarName"
                  v-model="editCalendarName"
                  required
              />
            </div>
            <div class="form-group">
              <label for="editCalendarColor">Color:</label>
              <div id="editCalendarColor" class="color-options">
                <label
                    v-for="color in availableColors"
                    :key="color.value"
                    :style="{ backgroundColor: calColor(color.value) }"
                    class="color-option"
                    :class="{ selected: editCalendarColor === color.value }"
                >
                  <input
                      type="radio"
                      name="editCalendarColor"
                      :value="color.value"
                      v-model="editCalendarColor"
                      required
                  />
                  <span class="color-circle"></span>
                </label>
              </div>
            </div>
            <div class="modal-buttons">
              <button type="submit" class="btn-submit">Save</button>
              <button type="button" class="btn-cancel" @click="closeEditCalendarModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- LEAVE CALENDAR CONFIRMATION MODAL -->
      <ConfirmationModal
          :visible="showLeaveCalendarModal"
          title="Leave Group Calendar"
          message="Are you sure you want to leave this group calendar? This action cannot be undone until an admin adds you back."
          confirmText="Leave"
          cancelText="Cancel"
          @confirm="leaveGroupCalendar"
          @cancel="closeLeaveCalendarModal"
      />

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

      <!-- Single-Field Edit Modal -->
      <div
          v-if="showEditFieldModal"
          class="modal-backdrop"
          @click.self="closeEditFieldModal"
      >
        <div class="modal-content">
          <h3>Edit {{ editFieldName }}</h3>
          <form @submit.prevent="submitFieldEdit">
            <div class="form-group">
              <label :for="`edit-${editFieldName}`">
                New {{ editFieldName }}
              </label>
              <input
                  v-if="editFieldName !== 'password'"
                  :id="`edit-${editFieldName}`"
                  type="text"
                  v-model="editFieldValue"
                  required
              />
              <input
                  v-else
                  :id="`edit-${editFieldName}`"
                  type="password"
                  v-model="editFieldValue"
                  required
              />
            </div>

            <div class="modal-buttons">
              <button type="submit" class="btn-submit">Save</button>
              <button type="button" class="btn-cancel" @click="closeEditFieldModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PersonalCalendar from '@/components/PersonalCalendar.vue';
import HomeCalendar from '@/components/HomeCalendar.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import calendarService from '@/services/calendarService';
import axios from 'axios';
import { buildFunctionUrl } from '@/services/urlBuilder';
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

      // Account Panel (dropdown)
      showAccountPanel: false,

      // Current user details
      currentUsername: '',  // Store the user’s current username
      currentEmail: '',     // Store the user’s current email

      // Single-field edit modal
      showEditFieldModal: false,
      editFieldName: '',    // "username" | "email" | "password"
      editFieldValue: '',   // New value typed by user

      // Group Calendar Modal
      showCreateGroupModal: false,
      groupCalendarName: '',
      groupSelectedColor: '',
      groupMembers: [],
      memberUsername: '',

      // For calendar details
      showDetailsModal: false,

      // For editing calendar
      showEditCalendarModal: false,
      editCalendarName: '',
      editCalendarColor: '',

      // For deletion
      showConfirmDeleteModal: false,

      // For adding users
      showAddUserModal: false,
      newUserToAdd: '',

      // For leaving calendar
      showLeaveCalendarModal: false,

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
      lightUserIcon: require('@/assets/icons/light-user-icon.svg'),
      darkUserIcon: require('@/assets/icons/dark-user-icon.svg'),
      darkMode: false
    };
  },
  computed: {
    ...mapGetters([
      'userId',
      'defaultCalendarId',
      'calendars', // Array of user calendars
      'activeCalendarId',
      'activeCalendar'
    ]),
    // Convenient getters for the username/email in the store
    currentapUsername() { return this.$store.getters.currentUsername; },
    currentapEmail() { return this.$store.getters.currentEmail; },

    // For simpler usage in template
    userCalendars() {
      return this.calendars;
    },
    activeCalendarColor() {
      return this.activeCalendar ? this.activeCalendar.color : 'blue';
    },
    isAdmin() {
      return this.activeCalendar && this.userId === this.activeCalendar.ownerId;
    }
  },
  mounted() {
    // If user is already logged in, fetch calendars
    if (this.userId) {
      this.fetchCalendars();
    }
    // Add event listener for clicks outside the account panel (dropdown)
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Clean up the event listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    ...mapActions([
      'logout',
      'notify',
      'fetchCalendars',
      'fetchAllEvents'
    ]),

    // Color helper
    calColor(color) {
      const colorMap = {
        'pink': '#e91e63',
        'green': '#4caf50',
        'yellow': '#ffc107',
        'red': '#f44336',
        'purple': '#9c27b0',
        'orange': '#ff9800',
        'blue': '#0078d4'
      };
      return colorMap[color] || '#0078d4';
    },

    // Toggle the dropdown account panel
    toggleAccountPanel() {
      this.showAccountPanel = !this.showAccountPanel;
    },
    // Force close of account panel
    closeAccountPanel() {
      this.showAccountPanel = false;
    },

    // If click outside the dropdown => close
    handleClickOutside(event) {
      const dropdown = this.$refs.accountDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.closeAccountPanel();
      }
    },

    accountPanelGotoCalendar(calId) {
      // Switch active calendar
      this.setActiveCalendar(calId);
      this.closeAccountPanel();
    },

    setActiveCalendar(calendarId) {
      this.$store.commit('SET_ACTIVE_CALENDAR_ID', calendarId);
      this.closeDetailsModal();
      this.closeEditCalendarModal();
      if (this.closeConfirmDeleteModal) {
        this.closeConfirmDeleteModal();
      }
    },

    handleLogout() {
      this.logout();
      this.$router.push('/');
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
    },

    // Single-field editing
    openEditFieldModal(field) {
      this.editFieldName = field;
      this.showEditFieldModal = true;
      if (field === 'username') {
        this.editFieldValue = this.currentapUsername;
      } else if (field === 'email') {
        this.editFieldValue = this.currentapEmail;
      } else {
        // field === 'password'
        this.editFieldValue = ''; // Empty, because we never store the current password
      }
    },
    closeEditFieldModal() {
      this.showEditFieldModal = false;
      this.editFieldName = '';
      this.editFieldValue = '';
    },
    async submitFieldEdit() {
      const updates = {};
      if (this.editFieldName === 'username') {
        updates.username = this.editFieldValue;
      } else if (this.editFieldName === 'email') {
        updates.email = this.editFieldValue;
      } else if (this.editFieldName === 'password') {
        updates.password = this.editFieldValue;
      }

      try {
        // Make sure to build the URL with your function's base:
        await axios.put(buildFunctionUrl(`/user/${this.userId}`), updates);

        // Re-fetch the user doc so the store is updated:
        await this.$store.dispatch('fetchUserDoc');
        this.notify({ type: 'success', message: 'Profile updated successfully.' });

        // Close the edit modal
        this.closeEditFieldModal();
      } catch (err) {
        console.error('Error updating field:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to update.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Create Personal Calendar
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
        const errorMsg = err?.response?.data?.error || 'Failed to create personal calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Create Group Calendar
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

    // Calendar Details Modal
    openDetailsModal() {
      if (!this.activeCalendar) return;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },

    // Add User Modal
    openAddUserModal() {
      this.showAddUserModal = true;
      this.newUserToAdd = '';
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
      this.newUserToAdd = '';
    },
    async addUser() {
      const username = this.newUserToAdd.trim();
      if (!username) {
        this.notify({ type: 'error', message: 'Please enter a username.' });
        return;
      }
      try {
        // Get userId from username
        const response = await calendarService.getUserId(username);
        const userId = response.data.userId;
        if (!userId) {
          this.notify({ type: 'error', message: `User '${username}' does not exist.` });
          return;
        }
        // Call backend to add user
        await calendarService.addUserToGroupCalendar(
            this.activeCalendar.calendarId,
            this.userId, // adminId
            userId
        );
        this.notify({ type: 'success', message: `User '${username}' added to calendar.` });
        this.closeAddUserModal();
        await this.fetchCalendars();
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error adding user:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to add user.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Get Username by userId
    getUsername(userId) {
      if (this.activeCalendar && this.activeCalendar.memberUsernames) {
        const index = this.activeCalendar.members.indexOf(userId);
        if (index !== -1 && this.activeCalendar.memberUsernames[index]) {
          return this.activeCalendar.memberUsernames[index];
        }
      }
      return userId; // Fallback to userId
    },
    async removeUser(username) {
      try {
        const userId = await this.fetchUserId(username);
        if (!userId) {
          this.notify({ type: 'error', message: `User '${username}' does not exist.` });
          return;
        }
        // Call the backend to remove user
        await calendarService.removeUserFromGroupCalendar(
            this.activeCalendar.calendarId,
            this.userId, // adminId
            userId
        );
        this.notify({ type: 'success', message: `User '${username}' removed from calendar.` });
        await this.fetchCalendars();
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error removing user:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to remove user.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },
    async fetchUserId(username) {
      try {
        const response = await calendarService.getUserId(username);
        return response.data.userId;
      } catch (err) {
        console.error('Error fetching userId:', err);
        return null;
      }
    },

    // Leave Group Calendar Modal
    openLeaveCalendarModal() {
      this.showLeaveCalendarModal = true;
    },
    closeLeaveCalendarModal() {
      this.showLeaveCalendarModal = false;
    },
    async leaveGroupCalendar() {
      try {
        await calendarService.leaveGroupCalendar(
            this.activeCalendar.calendarId,
            this.userId
        );
        this.notify({ type: 'success', message: 'You have left the group calendar.' });
        await this.fetchCalendars();
        this.closeLeaveCalendarModal();
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error leaving group calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to leave group calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Edit Calendar Modal
    openEditCalendarModal() {
      this.showEditCalendarModal = true;
      this.editCalendarName = this.activeCalendar.name;
      this.editCalendarColor = this.activeCalendar.color;
    },
    closeEditCalendarModal() {
      this.showEditCalendarModal = false;
      this.editCalendarName = '';
      this.editCalendarColor = '';
    },
    async editCalendar() {
      try {
        const updatedData = {
          name: this.editCalendarName,
          color: this.editCalendarColor
        };
        await calendarService.editGroupCalendar(
            this.activeCalendar.calendarId,
            this.userId, // adminId
            updatedData
        );
        this.notify({ type: 'success', message: 'Calendar updated successfully.' });
        this.closeEditCalendarModal();
        await this.fetchCalendars();
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error editing calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to edit calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Delete Calendar Confirmation
    confirmDeleteCalendar() {
      this.showConfirmDeleteModal = true;
    },
    async deleteCalendar() {
      if (!this.activeCalendar) return;
      try {
        if (this.activeCalendar.isGroup) {
          // Delete group calendar (admin only)
          await calendarService.deleteGroupCalendar(
              this.activeCalendar.calendarId,
              this.userId // adminId
          );
        } else {
          // Delete personal calendar
          await calendarService.deletePersonalCalendar(
              this.activeCalendar.calendarId,
              this.userId
          );
        }
        this.notify({ type: 'success', message: 'Calendar deleted successfully.' });
        await this.fetchCalendars();
        this.closeDetailsModal();
        this.closeConfirmDeleteModal();
      } catch (err) {
        console.error('Error deleting calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to delete calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },
    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    }
  }
};
</script>

<style scoped>
/* Add necessary styles for member tiles and buttons */

/* Members Container */
.members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

/* Member Tile */
.member-tile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 20px;
  color: #fff;
  min-width: 100px;
}

/* Remove User Button */
.remove-user-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  font-size: 1.2rem;
}

/* Add User Button */
.btn-add-user {
  margin-top: 15px;
  background-color: var(--primary-color);
  color: #fff;
  font-size: 1rem;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-add-user:hover {
  background-color: var(--event-hover-color);
}

/* Leave Calendar Button */
.btn-leave-calendar {
  margin-top: 15px;
  background-color: #dc3545; /* Red */
  color: #fff;
  font-size: 1rem;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-leave-calendar:hover {
  background-color: #c82333;
}

/* Color Options */
.color-options {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-option {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option.selected {
  border: 3px solid #000;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
}

/* Member Chips */
.member-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.chip {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 20px;
}

.chip-close {
  margin-left: 8px;
  cursor: pointer;
}

/* Member Input */
.member-input {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.member-input input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-submit {
  background-color: var(--primary-color);
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-submit:hover {
  background-color: var(--event-hover-color);
}

.btn-cancel {
  background-color: #6c757d; /* Gray */
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-cancel:hover {
  background-color: #5a6268;
}

/* Responsive Modals */
@media (max-width: 600px) {
  .modal-content {
    width: 90%;
  }
}

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500; /* Adjust as needed */
  /* Ensures the content doesn't scroll behind the modal */
  overflow: hidden;
}

/* Modal Content Container */
.modal-content {
  background-color: #fff;
  /* Control how wide the modal can go on large screens */
  width: 500px;
  max-width: 95%;  /* For smaller screens, let it scale down */
  max-height: 90vh; /* Keep the modal from growing taller than the viewport */
  overflow-y: auto; /* Scroll inside the modal if content is too tall */
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

/* If you want more consistent spacing inside form inputs: */
.modal-content form .form-group {
  margin-bottom: 16px;
}

.modal-content form .form-group label {
  font-weight: 600;
  margin-bottom: 4px;
  display: inline-block;
}

.modal-content form .form-group input,
.modal-content form .form-group select,
.modal-content form .form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

/* Larger screens can have a larger modal */
@media (min-width: 768px) {
  .modal-content {
    width: 600px;
  }
}

.members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.color-options {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.color-option {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-option.selected {
  border: 3px solid #000;
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
}


.account-panel-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 400px; /* or 300px, etc. */
  background-color: #f9f9f9;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  transition: transform 0.3s ease-out;
  /* Slide in from right */
  transform: translateX(0);
}

.account-panel-content {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}
/* Example: give the button similar styling as .toggle-container */
.user-icon-btn {
  background: transparent;
  border: none;
  outline: none;
  width: 40px;       /* same width/height as your toggle button */
  height: 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px; /* optional spacing between buttons */
}

/* The icon itself (the <img> tag) */
.user-icon {
  width: 24px;       /* same size as your toggle-icon if you like */
  height: 24px;
  object-fit: contain;
}
.btn-edit-field {
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 6px 10px;
  margin-left: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-edit-field:hover {
  background-color: #005c9c;
}


.profile-calendars {
  margin-top: 1.5rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.calendar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calendar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.btn-goto-calendar {
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-goto-calendar:hover {
  background-color: #005c9c;
}

/* Account Dropdown Container */
.account-dropdown {
  position: relative;
  display: inline-block;
}

/* Account Panel Dropdown */
.account-panel {
  position: absolute;
  top: 50px; /* Adjust based on header height */
  right: 0;
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 3000;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Mode Styles */
.dark-mode .account-panel {
  background-color: #2b2b2b;
  color: #f2f2f2;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

/* Transition Classes */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Profile Details */
.profile-details p {
  margin: 0.5rem 0;
}

.btn-edit-field {
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 4px 8px;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.btn-edit-field:hover {
  background-color: #005c9c;
}

/* Profile Calendars */
.profile-calendars {
  margin-top: 1rem;
}

.calendar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.calendar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.btn-goto-calendar {
  background-color: #0078d4;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.btn-goto-calendar:hover {
  background-color: #005c9c;
}

.dark-mode .btn-goto-calendar {
  background-color: #555;
}

.dark-mode .btn-goto-calendar:hover {
  background-color: #666;
}

/* Modal Buttons */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-submit {
  background-color: var(--primary-color);
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.btn-submit:hover {
  background-color: var(--event-hover-color);
}

.btn-cancel {
  background-color: #6c757d; /* Gray */
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .account-panel {
    width: 90%;
    top: 60px; /* Adjust based on header height */
  }
}

/* Additional Styles for Elements Inside Account Panel */

/* Profile Details */
.profile-details p {
  margin: 0.5rem 0;
}

.profile-details button {
  font-size: 0.75rem;
}

/* Profile Calendars */
.profile-calendars h3 {
  margin-bottom: 0.5rem;
}

/* Calendar Item Text */
.calendar-item span {
  display: flex;
  flex-direction: column;
}

/* Small Font Sizes */
.profile-details p, .profile-calendars h3, .calendar-item small {
  font-size: 0.875rem;
}

/* Hover Effects */
.account-panel button:hover {
  opacity: 0.9;
}


/* Calendify Logo Styles */
.calendify-logo {
  width: 75px; /* Adjust the size as needed */
  height: auto;
  margin-right: 10px; /* Space between logo and welcome text */
  object-fit: contain; /* Ensure the logo scales properly */
}

/* Adjust Header Left Alignment */
.header-left {
  display: flex;
  align-items: center;
}

/* Logo Link Styles */
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit; /* Inherit text color from parent */
}

.logo-link:hover {
  opacity: 0.8; /* Slight fade on hover */
}

/* Responsive Adjustments for Logo */
@media (max-width: 768px) {
  .calendify-logo {
    width: 50px; /* Smaller logo on smaller screens */
    margin-right: 8px;
  }

  .header-left h1 {
    font-size: 1.2rem; /* Adjust font size for smaller screens */
  }
}

/* Optional: Dark Mode Logo Hover Effect */
body.dark-mode .logo-link:hover {
  opacity: 0.9;
}
</style>
