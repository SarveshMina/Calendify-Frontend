<!-- src/components/Dashboard.vue -->
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
    </main>

    <!-- Add User Modal -->
    <!-- Already included above -->

    <!-- Edit Calendar Modal -->
    <!-- Already included above -->

    <!-- Leave Calendar Confirmation Modal -->
    <!-- Already included above -->

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
      const colorMap = {
        'pink': '#e91e63',
        'green': '#4caf50',
        'yellow': '#ffc107',
        'red': '#f44336',
        'purple': '#9c27b0',
        'orange': '#ff9800',
        'blue': '#0078d4'
      };
      return colorMap[color] || '#0078d4'; // Default to blue
    },

    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    },

    handleLogout() {
      this.logout();
      this.$router.push('/');
    },

    setActiveCalendar(calendarId) {
      this.$store.commit('SET_ACTIVE_CALENDAR_ID', calendarId);
      this.closeDetailsModal();
      this.closeEditCalendarModal();
      if (this.closeConfirmDeleteModal) {
        this.closeConfirmDeleteModal();
      }
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
        const errorMsg = err?.response?.data?.error || 'Failed to create personal calendar.';
        this.notify({ type: 'error', message: errorMsg });
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

    getUsername(userId) {
      // Assuming activeCalendar.members and activeCalendar.memberUsernames are aligned
      // If memberUsernames are included in the calendar data from the backend
      if (this.activeCalendar && this.activeCalendar.memberUsernames) {
        const index = this.activeCalendar.members.indexOf(userId);
        if (index !== -1 && this.activeCalendar.memberUsernames[index]) {
          return this.activeCalendar.memberUsernames[index];
        }
      }
      return userId; // Fallback to userId
    },

    async removeUser(username) {
      // Fetch userId based on username
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

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
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

/* Additional Styles for Confirmation Modal */
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
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
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
</style>
