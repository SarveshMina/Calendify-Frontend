<!-- src/views/DashboardView.vue -->
<template>
  <div :class="['dashboard-container', activeCalendar?.color ? `theme-${activeCalendar.color}` : 'theme-blue', { 'dark-mode': darkMode }]"  :style="{ '--accent-color': calColor(activeCalendarColor) }">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-left">
        <router-link to="/dashboard" class="logo-link">
          <img
            :src="darkMode ? require('@/assets/icons/logo-dark.png') : require('@/assets/icons/logo-light.png')"
            alt="Calendify Logo"
            class="calendify-logo"
          />
          <h1>Calendify</h1>
        </router-link>
      </div>
      
      <div class="header-right">
        <div class="search-container">
          <input type="text" placeholder="Search events..." class="search-input" />
          <i class="search-icon"></i>
        </div>

        <button
  class="icon-button burger"
  @click="toggleSidebar"
  aria-label="Toggle sidebar"
>
  <i :class="['burger-icon', { open: !sidebarCollapsed }]"></i>
</button>
        
        <div class="header-actions">
          <button class="icon-button notifications-button" aria-label="Notifications">
            <i class="notification-icon"></i>
            <span class="notification-badge">3</span>
          </button>
          
          <div class="account-dropdown" ref="accountDropdown">
            <button class="user-profile-button" @click="toggleAccountPanel" aria-label="Open Account Panel">
              <img
                src="https://ui-avatars.com/api/?name=User&background=random"
                alt="User Avatar"
                class="user-avatar"
              />
              <span class="user-name">{{ currentapUsername || 'User' }}</span>
              <i class="chevron-icon" :class="{ 'rotated': showAccountPanel }"></i>
            </button>

            <!-- Dropdown Panel with Transition -->
            <transition name="fade-slide">
              <div
                v-if="showAccountPanel"
                class="account-panel"
                @click.stop
              >
                <div class="account-panel-header">
                  <img 
                    src="https://ui-avatars.com/api/?name=User&background=random" 
                    alt="User Avatar" 
                    class="panel-avatar"
                  />
                  <div class="panel-user-info">
                    <h3>{{ currentapUsername }}</h3>
                    <p>{{ currentapEmail }}</p>
                  </div>
                </div>

                <div class="account-panel-content">
                  <!-- Current details -->
                  <div class="panel-section">
                    <h4 class="panel-section-title">Account</h4>
                    <div class="panel-menu-item" @click="openEditFieldModal('username')">
                      <i class="user-edit-icon"></i>
                      <span>Edit Username</span>
                    </div>
                    <div class="panel-menu-item" @click="openEditFieldModal('email')">
                      <i class="email-edit-icon"></i>
                      <span>Update Email</span>
                    </div>
                    <div class="panel-menu-item" @click="openEditFieldModal('password')">
                      <i class="password-edit-icon"></i>
                      <span>Change Password</span>
                    </div>
                  </div>

                  <hr class="panel-divider" />

                  <!-- "My Calendars" section -->
                  <div class="panel-section">
                    <h4 class="panel-section-title">Your Calendars</h4>
                    <div class="panel-calendar-list">
                      <div
                        v-for="cal in userCalendars.slice(0, 3)"
                        :key="cal.calendarId"
                        class="panel-calendar-item"
                        :style="{ '--cal-indicator': calColor(cal.color) }"
                        @click="accountPanelGotoCalendar(cal.calendarId)"
                      >
                        <span class="calendar-name">{{ cal.name }}</span>
                        <small class="calendar-type">{{ cal.isGroup ? 'Group' : 'Personal' }}</small>
                      </div>
                      
                      <div v-if="userCalendars.length > 3" class="panel-more-calendars">
                        +{{ userCalendars.length - 3 }} more calendars
                      </div>
                    </div>
                  </div>

                  <hr class="panel-divider" />
                  
                  <div class="panel-actions">
                    <button class="panel-action-button" @click="toggleDarkMode">
                      <i :class="[darkMode ? 'light-mode-icon' : 'dark-mode-icon']"></i>
                      <span>{{ darkMode ? 'Light Mode' : 'Dark Mode' }}</span>
                    </button>
                    <button class="panel-action-button logout-button" @click="handleLogout">
                      <i class="logout-icon"></i>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>My Calendars</h3>
            <button class="add-button" @click="openCreateModal" aria-label="Create personal calendar">
              <i class="plus-icon"></i>
            </button>
          </div>
          
          <div class="calendar-list">
            <div
              v-for="cal in personalCalendars"
              :key="cal.calendarId"
              @click="setActiveCalendar(cal.calendarId)"
              :class="['calendar-item', { active: cal.calendarId === activeCalendarId }]"
              :style="{ '--cal-indicator': calColor(cal.color) }"
            >
              <span class="calendar-name">{{ cal.name }}</span>
              <div class="calendar-actions">
                <button 
                  v-if="cal.calendarId === activeCalendarId"
                  class="calendar-action-btn edit-btn" 
                  @click.stop="openEditPersonalCalendarModal"
                  aria-label="Edit calendar"
                >
                  <i class="edit-icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Group Calendars</h3>
            <button class="add-button" @click="openCreateGroupModal" aria-label="Create group calendar">
              <i class="plus-icon"></i>
            </button>
          </div>
          
          <div class="calendar-list">
            <div
              v-for="cal in groupCalendars"
              :key="cal.calendarId"
              @click="setActiveCalendar(cal.calendarId)"
              :class="['calendar-item', { active: cal.calendarId === activeCalendarId }]"
              :style="{ '--cal-indicator': calColor(cal.color) }"
            >
              <span class="calendar-name">{{ cal.name }}</span>
              <div class="calendar-meta">
                <span class="member-count">{{ getMemberCount(cal) }} members</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Quick Actions</h3>
          </div>
          
          <div class="quick-actions">
            <button class="quick-action-btn" @click="openImportModal">
              <i class="import-icon"></i>
              <span>Import Calendar</span>
            </button>
            
            <button class="quick-action-btn" @click="openAddEventModal">
              <i class="event-icon"></i>
              <span>Add Event</span>
            </button>
            
            <button class="quick-action-btn" :disabled="!activeCalendar" @click="openDetailsModal">
              <i class="details-icon"></i>
              <span>Calendar Details</span>
            </button>
          </div>
        </div>
        
        <div class="sidebar-section">
          <div class="section-header">
            <h3>Statistics</h3>
          </div>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-value">{{ allEvents.length }}</div>
              <div class="stat-label">Total Events</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">{{ upcomingEventsCount }}</div>
              <div class="stat-label">Upcoming</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-value">{{ calendars.length }}</div>
              <div class="stat-label">Calendars</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main content area -->
      <main class="dashboard-main">
        <div class="content-header">
          <div class="content-title">
            <h2>{{ activeCalendarId === defaultCalendarId ? 'Home Calendar' : activeCalendar?.name || 'Calendar' }}</h2>
            <p class="content-subtitle">{{ formatCurrentDate() }}</p>
          </div>
          
          <div class="content-actions">
            <div class="view-selector">
              <button 
                class="view-button" 
                :class="{ active: currentView === 'month' }"
                @click="setCalendarView('month')"
              >
                Month
              </button>
              <button 
                class="view-button" 
                :class="{ active: currentView === 'week' }"
                @click="setCalendarView('week')"
              >
                Week
              </button>
              <button 
                class="view-button" 
                :class="{ active: currentView === 'day' }"
                @click="setCalendarView('day')"
              >
                Day
              </button>
            </div>
            
            <button class="primary-button" @click="openAddEventModal">
              <i class="plus-icon"></i>
              <span>Add Event</span>
            </button>
          </div>
        </div>
        
        <div class="calendar-container">
          <!-- Home Calendar -->
          <HomeCalendar
            v-if="activeCalendarId === defaultCalendarId"
            :userId="userId"
            :calendar-color="activeCalendarColor"
            :current-view="currentView"
            ref="homeCalendarRef"
          />
          
          <!-- Personal/Group Calendar -->
          <PersonalCalendar
            v-else-if="activeCalendarId && activeCalendar"
            :userId="userId"
            :calendarId="activeCalendarId"
            :calendar-color="activeCalendarColor"
            :calendar-name="activeCalendar?.name || 'My Calendar'"
            :current-view="currentView"
            ref="personalCalendarRef"
          />
          
          <!-- Loading state -->
          <div v-else class="calendar-loading">
            <div class="loading-spinner"></div>
            <p>Loading your calendar...</p>
          </div>
        </div>
        
        <div class="dashboard-widgets">
          <div class="widget upcoming-events">
            <div class="widget-header">
              <h3>Upcoming Events</h3>
              <button class="widget-action" @click="refreshEvents">
                <i class="refresh-icon"></i>
              </button>
            </div>
            
            <div class="widget-content">
              <div v-if="upcomingEvents.length > 0" class="events-list">
                <div 
                  v-for="event in upcomingEvents" 
                  :key="event.eventId"
                  class="event-item"
                >
                  <div class="event-time">{{ formatEventTime(event) }}</div>
                  <div class="event-details">
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-calendar">{{ getCalendarName(event.calendarId) }}</div>
                  </div>
                </div>
              </div>
              
              <div v-else class="empty-state">
                <div class="empty-icon"></div>
                <p>No upcoming events. Click "Add Event" to create one.</p>
              </div>
            </div>
          </div>
          
<!-- Weather widget (dynamic) -->
<div class="widget weather-widget">
  <div class="widget-header">
    <h3>Weather</h3>
    <div class="location">{{ locationLabel }}</div>
  </div>

  <div class="widget-content weather-content" v-if="!weatherError">
    <!-- current  -->
    <div class="current-weather" v-if="weatherCurrent">
      <div :class="['weather-icon', iconClass(weatherCurrent.icon)]"></div>
      <div class="weather-temp">{{ Math.round(weatherCurrent.temp) }}°{{ unitSymbol }}</div>
      <div class="weather-desc">{{ weatherCurrent.desc }}</div>
    </div>

    <!-- forecast  – next 3 days -->
    <div class="weather-forecast" v-if="weatherForecast.length">
      <div class="forecast-day" v-for="day in weatherForecast" :key="day.dt">
        <div>{{ dayjs.unix(day.dt).format('ddd').toUpperCase() }}        </div>
        <div :class="['forecast-icon', iconClass(day.icon)]"></div>
        <div>{{ Math.round(day.temp.day) }}°</div>
      </div>
    </div>

    <!-- loading spinner -->
    <div v-else class="empty-state">
      <div class="loading-spinner"></div>
      <p>Loading weather…</p>
    </div>
  </div>

  <!-- error -->
  <div v-else class="widget-content">
    <p class="empty-state">Couldn’t load weather for your location.</p>
  </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODALS -->
    <!-- Import Calendar Modal -->
    <div v-if="showImportModal" class="modal-backdrop" @click.self="handleImportModalBackdropClick">
      <div class="modal-content">
        <div class="modal-header">
          <h3 :style="{ color: calColor(importSelectedColor) }">Import Internet Calendar</h3>
          <button class="close-button" @click="closeImportModal">&times;</button>
        </div>
        
        <form @submit.prevent="importCalendar">
          <div class="form-group">
            <label for="importCalURL" :style="{ color: calColor(importSelectedColor) }">iCal URL:</label>
            <input
              id="importCalURL"
              v-model="importCalURL"
              type="url"
              placeholder="Enter the iCal feed URL"
              required
            />
          </div>

          <div class="form-group">
            <label :for="'importCalName'" :style="{ color: calColor(importSelectedColor) }">Calendar Name:</label>
            <input
              id="importCalName"
              v-model="importCalName"
              type="text"
              placeholder="Optional: Name for the imported calendar"
            />
          </div>

          <div class="form-group">
            <label for="importCalColor" :style="{ color: calColor(importSelectedColor) }">Choose a Color:</label>
            <div id="importCalColor" class="color-options">
              <label
                v-for="color in availableColors"
                :key="color.value"
                :style="{ backgroundColor: calColor(color.value) }"
                class="color-option"
                :class="{ selected: color.value === importSelectedColor }"
              >
                <input
                  type="radio"
                  name="importCalendarColor"
                  :value="color.value"
                  v-model="importSelectedColor"
                  required
                />
                <span class="color-circle"></span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              class="btn-submit"
              :style="{ backgroundColor: calColor(importSelectedColor) }"
              :disabled="isImporting"
              aria-label="Import Calendar"
            >
              <span v-if="isImporting">
                <i class="spinner"></i> Importing...
              </span>
              <span v-else>
                Import Calendar
              </span>
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="closeImportModal"
              :disabled="isImporting"
              aria-label="Cancel Import"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- CREATE PERSONAL CALENDAR MODAL -->
    <div v-if="showCreateModal" class="modal-backdrop" @click.self="closeCreateModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 :style="{ color: calColor(selectedColor) }">Create New Personal Calendar</h3>
          <button class="close-button" @click="closeCreateModal">&times;</button>
        </div>
        
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

          <div class="modal-footer">
            <button
              type="submit"
              class="btn-submit"
              :style="{ backgroundColor: calColor(selectedColor) }"
            >
              Create Calendar
            </button>
            <button type="button" class="btn-cancel" @click="closeCreateModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CREATE GROUP CALENDAR MODAL -->
    <div v-if="showCreateGroupModal" class="modal-backdrop" @click.self="closeCreateGroupModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 :style="{ color: calColor(groupSelectedColor) }">Create New Group Calendar</h3>
          <button class="close-button" @click="closeCreateGroupModal">&times;</button>
        </div>
        
        <form @submit.prevent="createNewGroupCalendar">
          <div class="form-group">
            <label
              for="groupCalName"
              :style="{ color: calColor(groupSelectedColor) }"
            >
              Calendar Name:
            </label>
            <input id="groupCalName" v-model="groupCalendarName" required />
          </div>

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

          <div class="form-group">
            <label
              for="memberUsername"
              :style="{ color: calColor(groupSelectedColor) }"
            >
              Add Members:
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
                class="add-member-btn"
                @click="handleAddMember"
                :style="{ backgroundColor: calColor(groupSelectedColor) }"
              >
                Add
              </button>
            </div>
            <p class="help-text">Max 4 additional members (5 total with you).</p>
          </div>

          <div class="modal-footer">
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

    <!-- EDIT PERSONAL CALENDAR MODAL -->
    <div
      v-if="showEditPersonalCalendarModal"
      class="modal-backdrop edit-modal"
      @click.self="handleEditModalBackdropClick"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3 :style="{ color: calColor(editPersonalCalendarColor) }">Edit Personal Calendar</h3>
          <button class="close-button" @click="handleCloseEditModal">&times;</button>
        </div>
        
        <form @submit.prevent="editPersonalCalendar">
          <div class="form-group">
            <label
              for="editPersonalCalendarName"
              :style="{ color: calColor(editPersonalCalendarColor) }"
            >
              Name:
            </label>
            <input
              id="editPersonalCalendarName"
              v-model="editPersonalCalendarName"
              required
            />
          </div>

          <div class="form-group">
            <label
              for="editPersonalCalendarColor"
              :style="{ color: calColor(editPersonalCalendarColor) }"
            >
              Color:
            </label>
            <div id="editPersonalCalendarColor" class="color-options">
              <label
                v-for="color in availableColors"
                :key="color.value"
                :style="{ backgroundColor: calColor(color.value) }"
                class="color-option"
                :class="{ selected: editPersonalCalendarColor === color.value }"
              >
                <input
                  type="radio"
                  name="editPersonalCalendarColor"
                  :value="color.value"
                  v-model="editPersonalCalendarColor"
                  required
                />
                <span class="color-circle"></span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              class="btn-submit"
              :style="{ backgroundColor: calColor(editPersonalCalendarColor) }"
            >
              Save Changes
            </button>
            <button
              type="button"
              class="btn-cancel"
              @click="handleCloseEditModal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Confirmation Modal for Discarding Changes -->
      <ConfirmationModal
        v-if="showDiscardConfirmation"
        :visible="showDiscardConfirmation"
        title="Discard Changes?"
        message="You have unsaved changes. Do you want to discard them?"
        confirmText="Discard"
        cancelText="Keep Editing"
        @confirm="discardEditChanges"
        @cancel="cancelDiscard"
      />
    </div>

    <!-- VIEW CALENDAR DETAILS MODAL -->
    <div v-if="showDetailsModal && activeCalendar" class="modal-backdrop" @click.self="closeDetailsModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Calendar Details</h3>
          <button class="close-button" @click="closeDetailsModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="calendar-detail-header" :style="{ backgroundColor: calColor(activeCalendar.color) }">
            <h2>{{ activeCalendar?.name }}</h2>
            <div class="calendar-meta-info">
              <div class="calendar-type-badge">{{ activeCalendar?.isGroup ? 'Group Calendar' : 'Personal Calendar' }}</div>
              <div class="calendar-owner">Created by {{ getUsername(activeCalendar?.ownerId) }}</div>
            </div>
          </div>
          
          <div class="calendar-details-container">
            <div class="calendar-stats">
              <div class="calendar-stat-item">
                <div class="stat-icon events-icon"></div>
                <div class="stat-info">
                  <div class="stat-value">{{ getCalendarEventCount(activeCalendar.calendarId) }}</div>
                  <div class="stat-label">Events</div>
                </div>
              </div>
              
              <div v-if="activeCalendar?.isGroup" class="calendar-stat-item">
                <div class="stat-icon members-icon"></div>
                <div class="stat-info">
                  <div class="stat-value">{{ activeCalendar.memberUsernames?.length || 0 }}</div>
                  <div class="stat-label">Members</div>
                </div>
              </div>
              
              <div class="calendar-stat-item">
                <div class="stat-icon date-icon"></div>
                <div class="stat-info">
                  <div class="stat-value">{{ formatDateShort(new Date()) }}</div>
                  <div class="stat-label">Last Updated</div>
                </div>
              </div>
            </div>

            <div v-if="activeCalendar?.isGroup">
              <h4 class="section-title">Members</h4>
              <div class="members-container">
                <div
                  v-for="(username, index) in activeCalendar.memberUsernames"
                  :key="index"
                  class="member-tile"
                  :style="{ backgroundColor: calColor(activeCalendar.color) }"
                >
                  <div class="member-avatar">{{ username.charAt(0).toUpperCase() }}</div>
                  <span class="member-name">{{ username }}</span>
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
              
              <div class="member-actions">
                <button
                  v-if="isAdmin"
                  class="btn-add-user"
                  @click="openAddUserModal"
                >
                  <i class="user-add-icon"></i>
                  <span>Add Member</span>
                </button>
                <button
                  v-else
                  class="btn-leave-calendar"
                  @click="openLeaveCalendarModal"
                >
                  <i class="leave-icon"></i>
                  <span>Leave Group Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            v-if="!activeCalendar.isGroup"
            class="btn-edit"
            @click="openEditPersonalCalendarModal"
          >
            <i class="edit-icon"></i>
            <span>Edit Calendar</span>
          </button>
          <button
            class="btn-delete"
            @click="confirmDeleteCalendar"
            v-if="isAdmin || !activeCalendar.isGroup"
            :disabled="isDeleting"
          >
            <i class="delete-icon"></i>
            <span>{{ isDeleting ? 'Deleting...' : 'Delete Calendar' }}</span>
          </button>
          <button
            class="btn-cancel"
            @click="closeDetailsModal"
          >
            Close
          </button>
        </div>
      </div>

      <!-- ADD USER MODAL -->
      <div v-if="showAddUserModal" class="modal-backdrop" @click.self="closeAddUserModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Add User to Calendar</h3>
            <button class="close-button" @click="closeAddUserModal">&times;</button>
          </div>
          
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
            
            <div class="modal-footer">
              <button type="submit" class="btn-submit">Add User</button>
              <button type="button" class="btn-cancel" @click="closeAddUserModal">Cancel</button>
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
        :isLoading="isDeleting"
        @confirm="deleteCalendar"
        @cancel="closeConfirmDeleteModal"
      />
    </div>

    <!-- Single-Field Edit Modal -->
    <div
      v-if="showEditFieldModal"
      class="modal-backdrop"
      @click.self="closeEditFieldModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit {{ editFieldName }}</h3>
          <button class="close-button" @click="closeEditFieldModal">&times;</button>
        </div>
        
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

          <div class="modal-footer">
            <button type="submit" class="btn-submit">Save Changes</button>
            <button type="button" class="btn-cancel" @click="closeEditFieldModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dayjs from 'dayjs';
import 'dayjs/locale/en';   
import PersonalCalendar from '@/components/PersonalCalendar.vue';
import HomeCalendar from '@/components/HomeCalendar.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import calendarService from '@/services/calendarService';
import axios from 'axios';
import { buildFunctionUrl } from '@/services/urlBuilder';

/* ─── env helper ──────────────────────────────────────── */
export function getOWKey () {
  /* Vite */
  const viteKey = import.meta?.env?.VITE_OPENWEATHER_KEY
  if (viteKey) return viteKey

  /* Vue-CLI / Webpack */
  const cliKey = process.env.VUE_APP_OPENWEATHER_KEY   // ← one single reference
  if (cliKey) return cliKey

  console.warn('[Weather] OpenWeather API key missing.')
  return ''
}



export default {
  name: 'DashboardView',
  components: { PersonalCalendar, HomeCalendar, ConfirmationModal },
  data() {
    return {
      // Current view for VueCal calendar
      currentView: 'month',
      
      // Import Calendar Modal
      showImportModal: false,
      importCalURL: '',
      importCalName: '',
      importSelectedColor: 'blue',
      isImporting: false,
      weatherLoading: true,
weatherError:   false,
weatherCurrent: null,      // { temp, icon, desc }
weatherForecast: [],       // 3-day array from daily[]
locationLabel:  '—',       // e.g. "London, UK"
unit:           (Intl.DateTimeFormat().resolvedOptions().locale === 'en-US' ? 'imperial' : 'metric'),


      isDeleting: false,

      dayjs,

      // Personal Calendar Modal
      showCreateModal: false,
      newCalendarName: '',
      selectedColor: 'blue',

      showEditPersonalCalendarModal: false,
      editPersonalCalendarName: '',
      editPersonalCalendarColor: '',
      initialEditPersonalCalendarName: '',
      initialEditPersonalCalendarColor: '',
      showDiscardConfirmation: false,

      // Account Panel
      showAccountPanel: false,

      // User details
      currentUsername: '',
      currentEmail: '',

      // Single-field edit modal
      showEditFieldModal: false,
      editFieldName: '',
      editFieldValue: '',

      // Group Calendar Modal
      showCreateGroupModal: false,
      groupCalendarName: '',
      groupSelectedColor: 'blue',
      groupMembers: [],
      memberUsername: '',

      // Calendar details
      showDetailsModal: false,

      // Editing calendar
      showEditCalendarModal: false,
      editCalendarName: '',
      editCalendarColor: '',

      // Deletion
      showConfirmDeleteModal: false,

      // Adding users
      showAddUserModal: false,
      newUserToAdd: '',

      // Leaving calendar
      showLeaveCalendarModal: false,

      // Available colors
      availableColors: [
        { name: 'Pink', value: 'pink' },
        { name: 'Green', value: 'green' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Red', value: 'red' },
        { name: 'Purple', value: 'purple' },
        { name: 'Orange', value: 'orange' },
        { name: 'Blue', value: 'blue' },
      ],

      // Dark mode
      darkMode: localStorage.getItem('darkMode') === 'true',
      sidebarCollapsed: false,
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
    };
  },
  computed: {
    ...mapGetters([
      'userId',
      'defaultCalendarId',
      'calendars',
      'activeCalendarId',
      'activeCalendar',
      'allEvents'
    ]),

    unitSymbol () { return this.unit === 'metric' ? 'C' : 'F'; },
    
    // User info from store
    currentapUsername() { 
      return this.$store.getters.currentUsername; 
    },
    currentapEmail() { 
      return this.$store.getters.currentEmail; 
    },

    // Split calendars by type
    personalCalendars() {
      return this.calendars.filter(cal => !cal.isGroup);
    },
    
    groupCalendars() {
      return this.calendars.filter(cal => cal.isGroup);
    },
    
    userCalendars() {
      return this.calendars;
    },
    
    activeCalendarColor() {
      return this.activeCalendar ? this.activeCalendar.color : 'blue';
    },
    
    isAdmin() {
      return this.activeCalendar && this.userId === this.activeCalendar.ownerId && this.activeCalendar.isGroup;
    },
    
    hasUnsavedChanges() {
      return (
        this.editPersonalCalendarName !== this.initialEditPersonalCalendarName ||
        this.editPersonalCalendarColor !== this.initialEditPersonalCalendarColor
      );
    },
    
    // Upcoming events (next 7 days)
    upcomingEvents() {
      if (!this.allEvents || this.allEvents.length === 0) return [];
      
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      return this.allEvents
        .filter(event => {
          const eventStartTime = new Date(event.startTime);
          return eventStartTime >= now && eventStartTime <= nextWeek;
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
        .slice(0, 5); // Show only next 5 events
    },
    
    // Count of upcoming events
    upcomingEventsCount() {
      if (!this.allEvents || this.allEvents.length === 0) return 0;
      
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      
      return this.allEvents.filter(event => {
        const eventStartTime = new Date(event.startTime);
        return eventStartTime >= now;
      }).length;
    }
  },
  
  mounted() {
    // Set dark mode from localStorage
    document.body.classList.toggle('dark-mode', this.darkMode);
    this.initWeather();
    
    // Load user calendars
    if (this.userId) {
      this.fetchCalendars();
    }
    
    // Add click outside listener for account panel
    document.addEventListener('click', this.handleClickOutside);
    
    // Set calendar view if provided in localStorage
    const savedView = localStorage.getItem('calendarView');
    if (savedView && ['month', 'week', 'day'].includes(savedView)) {
      this.currentView = savedView;
    }
  },
  
  beforeUnmount() {
    // Remove event listeners
    document.removeEventListener('click', this.handleClickOutside);
  },
  
  methods: {
    ...mapActions([
      'logout',
      'notify',
      'fetchCalendars',
      'fetchAllEvents'
    ]),

    toggleSidebar () {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    // Color helper
    calColor(color) {
      const colorMap = {
        'pink': '#e91e63',
        'green': '#4caf50',
        'yellow': '#ffc107',
        'red': '#f44336',
        'purple': '#9c27b0',
        'orange': '#ff9800',
        'blue': '#4361ee' // Updated to use the new primary blue
      };
      return colorMap[color] || '#4361ee';
    },
    async initWeather () {
  try {
    const coords = await this.getCoords();
    await this.fetchWeather(coords);
  } catch (e) {
    console.error(e);
    this.weatherError = true;
  } finally {
    this.weatherLoading = false;
  }
},


getCoords () {
  /* try browser geolocation first */
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no-geo'));
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      async () => {                  // fallback – freegeoip.app
        try {
          const { data } = await axios.get('https://ipapi.co/json/');
          resolve({ lat: data.latitude, lon: data.longitude });
        } catch {
          reject(new Error('geo-fail'));
        }
      },
      { timeout: 5000 }
    );
  });
},

async fetchWeather ({ lat, lon }) {
      const KEY = getOWKey();
      if (!KEY) { this.weatherError = true; return; }

      /* 1 — current weather ------------------------------------------------ */
      const nowURL = `https://api.openweathermap.org/data/2.5/weather` +
                     `?lat=${lat}&lon=${lon}&units=${this.unit}&appid=${KEY}`;
      const { data: now } = await axios.get(nowURL);

      this.weatherCurrent = {
        temp : now.main.temp,
        icon : now.weather[0].icon,
        desc : this.cap(now.weather[0].description)
      };

      /* 2 — 5-day / 3-hour forecast  -------------------------------------- */
      const fcURL = `https://api.openweathermap.org/data/2.5/forecast` +
                    `?lat=${lat}&lon=${lon}&units=${this.unit}&appid=${KEY}`;
      const { data: fc } = await axios.get(fcURL);

      // grab the first three *midday* entries after today
      const noonSlices = fc.list
        .filter(x => x.dt_txt.includes('12:00:00'))
        .slice(1, 4);

      this.weatherForecast = noonSlices.map(s => ({
        dt   : s.dt,
        temp : { day: s.main.temp },   // keep the same shape the template expects
        icon : s.weather[0].icon
      }));

      /* 3 — pretty location label ---------------------------------------- */
      this.locationLabel = `${now.name}, ${now.sys.country}`;
    },

    cap (str) { return str.charAt(0).toUpperCase() + str.slice(1); },

iconClass (owmIcon) {
  /* very small mapping table – extend as you like */
  const map = {
    '01d': 'sunny',  '01n': 'sunny',
    '02d': 'cloudy', '02n': 'cloudy',
    '03d': 'cloudy', '03n': 'cloudy',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rainy',  '09n': 'rainy',
    '10d': 'rainy',  '10n': 'rainy',
    '11d': 'rainy',  '11n': 'rainy',
    '13d': 'snowy',  '13n': 'snowy',
    '50d': 'cloudy', '50n': 'cloudy'
  };
  return map[owmIcon] || 'cloudy';
},


    closeEditCalendarModal() {
    // personal calendar edit modal
    if (this.showEditPersonalCalendarModal) {
      this.closeEditPersonalCalendarModal();
    }

    // group calendar edit modal (add one when you build it)
    if (this.showEditGroupCalendarModal) {
      this.closeEditGroupCalendarModal();
    }
  },
    
    // Set calendar view (month, week, day)
    setCalendarView(view) {
  this.currentView = view;                 // 'month' | 'week' | 'day'
  localStorage.setItem('calendarView', view);

 const viewMap = {
   month: 'dayGridMonth',
   week : 'timeGridWeek',
   day  : 'timeGridDay',
 };
 const fcView = viewMap[view];

  if (this.activeCalendarId === this.defaultCalendarId &&
      this.$refs.homeCalendarRef) {
  this.$refs.homeCalendarRef.setView(fcView);
  } else if (this.$refs.personalCalendarRef) {
       this.$refs.personalCalendarRef.setView(fcView);
  }
},
    
    // Format the current date for display
    formatCurrentDate() {
      return dayjs().format('dddd, MMMM D, YYYY');
    },
    
    // Format date in a shorter style
    formatDateShort(date) {
      return dayjs(date).format('MMM D, YYYY');
    },
    
    // Format event time for display
    formatEventTime(event) {
      const startTime = dayjs(event.startTime);
      const today = dayjs().startOf('day');
      const tomorrow = today.add(1, 'day');
      
      if (startTime.isSame(today, 'day')) {
        return `Today, ${startTime.format('h:mm A')}`;
      } else if (startTime.isSame(tomorrow, 'day')) {
        return `Tomorrow, ${startTime.format('h:mm A')}`;
      } else {
        return startTime.format('MMM D, h:mm A');
      }
    },
    
    // Get member count for a calendar
    getMemberCount(calendar) {
      if (!calendar.isGroup) return 1;
      return calendar.memberUsernames?.length || 0;
    },
    
    // Get calendar name by ID
    getCalendarName(calendarId) {
      const calendar = this.calendars.find(cal => cal.calendarId === calendarId);
      return calendar ? calendar.name : 'Unknown Calendar';
    },
    
    // Get event count for a specific calendar
    getCalendarEventCount(calendarId) {
      return this.allEvents.filter(event => event.calendarId === calendarId).length;
    },
    
    // Refresh events data
    refreshEvents() {
      this.fetchAllEvents();
      this.notify({ type: 'info', message: 'Events refreshed.' });
    },
    
    // Toggle Account Panel
    toggleAccountPanel() {
      this.showAccountPanel = !this.showAccountPanel;
    },
    
    // Close account panel
    closeAccountPanel() {
      this.showAccountPanel = false;
    },

    // Handle clicks outside the account dropdown
    handleClickOutside(event) {
      const dropdown = this.$refs.accountDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.closeAccountPanel();
      }
    },

    // Navigate to calendar from account panel
    accountPanelGotoCalendar(calId) {
      this.setActiveCalendar(calId);
      this.closeAccountPanel();
    },

    // Import Calendar Modal
    openImportModal() {
      this.showImportModal = true;
      this.importCalURL = '';
      this.importCalName = '';
      this.importSelectedColor = 'blue';
    },
    
    closeImportModal() {
      this.showImportModal = false;
    },
    
    handleImportModalBackdropClick() {
      if (!this.isImporting) {
        this.closeImportModal();
      }
    },
    
    // URL validation
    validateURL(url) {
      const pattern = new RegExp('^(https?:\\/\\/)' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?' +
        '(\\/[-a-z\\d%@_.~+&:]*)*' +
        '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
      return !!pattern.test(url);
    },
    
    // Import Calendar
    async importCalendar() {
      if (!this.validateURL(this.importCalURL)) {
        this.notify({ type: 'error', message: 'Please enter a valid URL.' });
        return;
      }

      this.isImporting = true;

      try {
        const response = await calendarService.importInternetCalendar(
          this.userId,
          this.importCalURL,
          this.importCalName || '',
          this.importSelectedColor || 'blue'
        );

        this.notify({
          type: 'success',
          message: response.data.message || 'Calendar imported successfully.',
        });

        this.closeImportModal();
        await this.fetchCalendars();
      } catch (err) {
        console.error('Error importing calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to import calendar.';
        this.notify({ type: 'error', message: errorMsg });
      } finally {
        this.isImporting = false;
      }
    },

    // Set Active Calendar
    setActiveCalendar(calendarId) {
      this.$store.commit('SET_ACTIVE_CALENDAR_ID', calendarId);
      this.closeDetailsModal();
      this.closeEditCalendarModal();
      if (this.closeConfirmDeleteModal) {
        this.closeConfirmDeleteModal();
      }
    },

    // Toggle Dark Mode
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
      this.closeAccountPanel();
    },
    
    // Logout function
    handleLogout() {
      this.logout();
      this.$router.push('/');
    },

    // Open modal to edit user fields (username, email, password)
    openEditFieldModal(field) {
      this.editFieldName = field;
      this.showEditFieldModal = true;
      
      if (field === 'username') {
        this.editFieldValue = this.currentapUsername;
      } else if (field === 'email') {
        this.editFieldValue = this.currentapEmail;
      } else {
        this.editFieldValue = '';
      }
      
      this.closeAccountPanel();
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
        await axios.put(buildFunctionUrl(`/user/${this.userId}`), updates);
        await this.$store.dispatch('fetchUserDoc');
        this.notify({ type: 'success', message: 'Profile updated successfully.' });
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
      this.selectedColor = 'blue';
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
      this.groupSelectedColor = 'blue';
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
        const memberUsernames = this.groupMembers.map(m => m.username);

        await calendarService.createGroupCalendar(
          this.userId,
          this.groupCalendarName,
          memberUsernames,
          this.groupSelectedColor || 'blue'
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

    // Add User Modal (Group Calendar)
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
        const response = await calendarService.getUserId(username);
        const userId = response.data.userId;
        
        if (!userId) {
          this.notify({ type: 'error', message: `User '${username}' does not exist.` });
          return;
        }
        
        await calendarService.addUserToGroupCalendar(
          this.activeCalendar.calendarId,
          this.userId,
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

    // Get Username from ID
    getUsername(userId) {
      if (this.activeCalendar && this.activeCalendar.memberUsernames) {
        const index = this.activeCalendar.members.indexOf(userId);
        if (index !== -1 && this.activeCalendar.memberUsernames[index]) {
          return this.activeCalendar.memberUsernames[index];
        }
      }
      
      if (userId === this.userId) {
        return this.currentapUsername || 'You';
      }
      
      return userId;
    },
    
    async removeUser(username) {
      try {
        const userId = await this.fetchUserId(username);
        if (!userId) {
          this.notify({ type: 'error', message: `User '${username}' does not exist.` });
          return;
        }
        
        await calendarService.removeUserFromGroupCalendar(
          this.activeCalendar.calendarId,
          this.userId,
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

    // Leave Group Calendar
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

    // Edit Personal Calendar
    openEditPersonalCalendarModal() {
      if (!this.activeCalendar) return;
      
      this.showEditPersonalCalendarModal = true;
      this.editPersonalCalendarName = this.activeCalendar.name;
      this.editPersonalCalendarColor = this.activeCalendar.color;
      
      // Set initial values for change detection
      this.initialEditPersonalCalendarName = this.activeCalendar.name;
      this.initialEditPersonalCalendarColor = this.activeCalendar.color;
    },
    
    // Handle backdrop clicks for Edit Modal
    handleEditModalBackdropClick() {
      if (this.hasUnsavedChanges) {
        this.showDiscardConfirmation = true;
      } else {
        this.closeEditPersonalCalendarModal();
      }
    },
    
    // Handle close button click
    handleCloseEditModal() {
      if (this.hasUnsavedChanges) {
        this.showDiscardConfirmation = true;
      } else {
        this.closeEditPersonalCalendarModal();
      }
    },
    
    // Confirm discard changes
    discardEditChanges() {
      this.showDiscardConfirmation = false;
      this.closeEditPersonalCalendarModal();
    },
    
    // Cancel discard
    cancelDiscard() {
      this.showDiscardConfirmation = false;
    },
    
    // Close edit modal
    closeEditPersonalCalendarModal() {
      this.showEditPersonalCalendarModal = false;
      this.editPersonalCalendarName = '';
      this.editPersonalCalendarColor = '';
      this.initialEditPersonalCalendarName = '';
      this.initialEditPersonalCalendarColor = '';
    },
    
    // Submit edited calendar
    async editPersonalCalendar() {
      try {
        const updatedData = {
          name: this.editPersonalCalendarName,
          color: this.editPersonalCalendarColor,
        };
        
        await calendarService.editPersonalCalendar(
          this.activeCalendar.calendarId,
          this.userId,
          updatedData
        );

        this.notify({ type: 'success', message: 'Calendar updated successfully.' });
        this.closeEditPersonalCalendarModal();
        await this.fetchCalendars();
        this.closeDetailsModal();
      } catch (err) {
        console.error('Error editing personal calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to edit calendar.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },

    // Open modal to add a new event
    openAddEventModal() {
      // Use the HomeCalendar or PersonalCalendar component method
      if (this.activeCalendarId === this.defaultCalendarId && this.$refs.homeCalendarRef) {
        this.$refs.homeCalendarRef.openAddEventModal();
      } else if (this.$refs.personalCalendarRef) {
        this.$refs.personalCalendarRef.openAddEventModal();
      }
    },

    // Delete Calendar
    confirmDeleteCalendar() {
      this.showConfirmDeleteModal = true;
    },
    
    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    },
    
    async deleteCalendar() {
      if (!this.activeCalendar) return;

      this.isDeleting = true;

      try {
        if (this.activeCalendar.isGroup) {
          await calendarService.deleteGroupCalendar(this.activeCalendar.calendarId, this.userId);
          this.notify({ type: 'success', message: 'Group calendar deleted successfully.' });
        } else {
          await calendarService.deletePersonalCalendar(this.activeCalendar.calendarId, this.userId);
          this.notify({ type: 'success', message: 'Personal calendar deleted successfully.' });
        }

        await this.fetchCalendars();

        // Set active calendar to default or another available
        if (this.defaultCalendarId) {
          this.setActiveCalendar(this.defaultCalendarId);
        } else if (this.calendars.length > 0) {
          this.setActiveCalendar(this.calendars[0].calendarId);
        } else {
          this.$store.commit('SET_ACTIVE_CALENDAR_ID', null);
        }

        this.closeDetailsModal();
        this.closeConfirmDeleteModal();
      } catch (err) {
        console.error('Error deleting calendar:', err);
        const errorMsg = err?.response?.data?.error || 'Failed to delete calendar.';
        this.notify({ type: 'error', message: errorMsg });
      } finally {
        this.isDeleting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Complete Dashboard Styles */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Base Variables */
:root {
  /* Primary Colors */
  --primary-color: #4361ee;
  --primary-light: #7d97f4;
  --primary-dark: #2541b2;
  
  /* Secondary Colors */
  --secondary-color: #f8f9fe;
  --bg-color: #f9fafb;
  --text-color: #333333;
  --text-secondary: #6b7280;
  --border-color: #e2e8f0;
  
  /* Status Colors */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  --info-color: #3b82f6;
  
  /* Theme Colors */
  --pink-color: #e91e63;
  --green-color: #4caf50;
  --yellow-color: #ffc107;
  --red-color: #f44336;
  --purple-color: #9c27b0;
  --orange-color: #ff9800;
  --blue-color: #4361ee;
  
  /* Shadow Variables */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  --shadow-transition: box-shadow 0.2s ease;
  --transform-transition: transform 0.2s ease;
}

/* Dark Mode Variables */
.dark-mode {
  --bg-color: #111827;
  --secondary-color: #1f2937;
  --text-color: #f3f4f6;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  
  /* Shadow Variables */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
}

/* ====== BASE STYLES ====== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--text-color);
  background-color: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button, input, select, textarea {
  font-family: inherit;
}

/* ====== DASHBOARD CONTAINER ====== */
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* ====== HEADER ====== */
.dashboard-header {
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
  z-index: 30;
  height: 64px;
  position: sticky;
  top: 0;
}

.dark-mode .dashboard-header {
  background-color: var(--secondary-color);
  border-color: var(--border-color);
}

.header-left {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-color);
  transition: opacity var(--transition-fast);
}

.logo-link:hover {
  opacity: 0.9;
  text-decoration: none;
}

.calendify-logo {
  height: 32px;
  width: auto;
  margin-right: 0.75rem;
}

.logo-link h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

/* Search Box */
.search-container {
  position: relative;
  width: 300px;
  max-width: 300px;
  transition: max-width 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  background-color: var(--bg-color);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.1);
}

.dark-mode .search-input {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-color: var(--border-color);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.5;
}

.dark-mode .search-icon {
  filter: invert(1);
  opacity: 0.4;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Icon Buttons */
.icon-button {
  background: transparent;
  border: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast), 
              box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.icon-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .icon-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.notifications-button {
  position: relative;
}

.notification-icon {
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.dark-mode .notification-icon {
  filter: invert(1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--danger-color);
  color: white;
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* User Profile Button */
.user-profile-button {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background-color: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast), 
              box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.user-profile-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .user-profile-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
}

.dark-mode .user-name {
  color: var(--text-color);
}

.chevron-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: transform var(--transition-fast);
}

.dark-mode .chevron-icon {
  filter: invert(1);
}

.chevron-icon.rotated {
  transform: rotate(180deg);
}

/* ====== ACCOUNT DROPDOWN ====== */
.account-dropdown {
  position: relative;
  z-index: 40;
}

.account-panel {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2),
              0 10px 10px -5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transform-origin: top right;
}

.account-panel::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 16px;
  width: 12px;
  height: 12px;
  background: inherit;
  transform: rotate(45deg);
  border-top: 1px solid var(--border-color);
  border-left: 1px solid var(--border-color);
  z-index: -1;
}

.dark-mode .account-panel {
  background-color: var(--secondary-color);
  border-color: var(--border-color);
}

.dark-mode .account-panel::before {
  border-color: var(--border-color);
}

.account-panel-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.panel-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.panel-user-info h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.panel-user-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.account-panel-content {
  padding: 1rem;
}

.panel-section {
  margin-bottom: 1.25rem;
}

.panel-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.05em;
}

.panel-menu-item {
  display: flex;
  align-items: center;
  padding: 0.625rem;
  gap: 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.panel-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .panel-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.panel-menu-item i {
  width: 1.25rem;
  height: 1.25rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.7;
}

.dark-mode .panel-menu-item i {
  filter: invert(1);
  opacity: 0.7;
}

.user-edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'%3E%3C/path%3E%3C/svg%3E");
}

.email-edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.password-edit-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'%3E%3C/path%3E%3C/svg%3E");
}

.panel-divider {
  border: 0;
  height: 1px;
  background-color: var(--border-color);
  margin: 1rem 0;
}

.panel-calendar-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel-calendar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem;
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.03);
  position: relative;
  cursor: pointer;
  transition: transform var(--transition-fast);
}

.panel-calendar-item:hover {
  transform: translateY(-2px);
}

.dark-mode .panel-calendar-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.panel-calendar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--cal-indicator, var(--primary-color));
  border-top-left-radius: var(--radius-sm);
  border-bottom-left-radius: var(--radius-sm);
}

.calendar-name {
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.875rem;
}

.calendar-type {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.panel-more-calendars {
  font-size: 0.75rem;
  text-align: center;
  padding: 0.5rem;
  color: var(--text-secondary);
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: var(--radius-sm);
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  font-size: 0.875rem;
  color: var(--text-color);
}

.panel-action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .panel-action-button {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.dark-mode .panel-action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.panel-action-button i {
  width: 1.25rem;
  height: 1.25rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.7;
}

.dark-mode .panel-action-button i {
  filter: invert(1);
  opacity: 0.7;
}

.dark-mode-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'%3E%3C/path%3E%3C/svg%3E");
}

.light-mode-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'%3E%3C/path%3E%3C/svg%3E");
}

.logout-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'%3E%3C/path%3E%3C/svg%3E");
}

.logout-button {
  border-top: 1px solid var(--border-color);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

/* ====== DASHBOARD CONTENT ====== */
.dashboard-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 64px); /* Subtract header height */
}

/* ====== SIDEBAR ====== */
.dashboard-sidebar {
  width: 320px;
  border-right: 1px solid var(--border-color);
  background-color: white;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: background-color var(--transition-normal), border-color var(--transition-normal);
  height: calc(100vh - 64px);
  overflow-x: hidden;
  position: sticky;
  top: 64px;
  scrollbar-width: thin;
}

.dashboard-sidebar::-webkit-scrollbar {
  width: 5px;
}

.dashboard-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.dashboard-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.dark-mode .dashboard-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-mode .dashboard-sidebar {
  background-color: var(--secondary-color);
  border-color: var(--border-color);
}

.sidebar-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-header h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
  margin: 0;
}

.add-button {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.add-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .add-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.plus-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.dark-mode .plus-icon {
  filter: invert(1);
}

.calendar-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.calendar-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem;
  padding-left: 1.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.calendar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 3px;
  background-color: var(--cal-indicator, var(--primary-color));
  border-radius: 3px;
  opacity: 0.8;
  transition: opacity 0.2s ease, top 0.2s ease, bottom 0.2s ease;
}

.calendar-item:hover::before {
  top: 0.3rem;
  bottom: 0.3rem;
  opacity: 1;
}

.calendar-item.active::before {
  top: 0.2rem;
  bottom: 0.2rem;
  opacity: 1;
}

.calendar-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(2px);
}

.dark-mode .calendar-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.calendar-item.active {
  background-color: rgba(67, 97, 238, 0.12);
  font-weight: 500;
}

.dark-mode .calendar-item.active {
  background-color: rgba(67, 97, 238, 0.2);
}

.calendar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.calendar-action-btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
}

.calendar-action-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .calendar-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.edit-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.dark-mode .edit-icon {
  filter: invert(1);
}

.calendar-meta {
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
}

.member-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast), 
              box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
  position: relative;
  overflow: hidden;
}

.quick-action-btn:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.quick-action-btn:not(:disabled):active {
  transform: translateY(0);
}

.dark-mode .quick-action-btn {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.dark-mode .quick-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.quick-action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.quick-action-btn i {
  width: 1.25rem;
  height: 1.25rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.7;
}

.dark-mode .quick-action-btn i {
  filter: invert(1);
  opacity: 0.7;
}

.import-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'%3E%3C/path%3E%3C/svg%3E");
}

.event-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.details-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'%3E%3C/path%3E%3C/svg%3E");
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-sm);
  padding: 1rem;
  text-align: center;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.dark-mode .stat-card {
  background-color: rgba(255, 255, 255, 0.05);
}

.stat-value {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* ====== MAIN CONTENT ====== */
.dashboard-main {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--bg-color);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
  overflow-x: hidden;
  height: calc(100vh - 64px);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.content-title h2 {
  color: var(--accent-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
}

.content-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.content-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-selector {
  display: flex;
  background-color: var(--secondary-color);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  box-shadow: var(--shadow-sm);
}

.dark-mode .view-selector {
  background-color: var(--secondary-color);
}

.view-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast), color var(--transition-fast);
  color: var(--text-color);
}

.view-button.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.primary-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast), 
              box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.primary-button:not(:disabled):hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.primary-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.calendar-container {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  height: auto;
  min-height: 600px;
  transition: background-color var(--transition-normal), box-shadow var(--transition-normal);
  flex: 1;
  overflow: hidden;
  position: relative;
}

.calendar-container:hover {
  box-shadow: var(--shadow-md);
}

.dark-mode .calendar-container {
  background-color: var(--secondary-color);
}

/* Animation for calendar switching */
.calendar-container > div {
  animation: fadeIn 0.3s ease;
}

.calendar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 5;
  backdrop-filter: blur(2px);
}

.dark-mode .calendar-loading {
  background-color: rgba(31, 41, 55, 0.7);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(67, 97, 238, 0.1);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ====== WIDGETS ====== */
.dashboard-widgets {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.widget {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.widget:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.dark-mode .widget {
  background-color: var(--secondary-color);
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: border-color var(--transition-normal);
}

.widget-header h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.location {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.widget-action {
  background: transparent;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.widget-action:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .widget-action:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.refresh-icon {
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.dark-mode .refresh-icon {
  filter: invert(1);
}

.widget-content {
  padding: 1rem 1.5rem;
}

/* Upcoming Events Widget */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
  margin-bottom: 0.75rem;
}

.dark-mode .event-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.event-time {
  color: var(--text-color);
  font-size: 0.875rem;
  font-weight: 500;

  min-width: 100px;
}

.event-details {
  flex: 1;
}

.event-title {
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.event-calendar {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 1rem;
  color: var(--text-secondary);
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.4;
}

/* Weather Widget */
.weather-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.current-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.weather-icon {
  width: 4rem;
  height: 4rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.sunny {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f59e0b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'%3E%3C/path%3E%3C/svg%3E");
}

.cloudy {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'%3E%3C/path%3E%3C/svg%3E");
}

.rainy {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%233b82f6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'%3E%3C/path%3E%3C/svg%3E");
}

.weather-temp {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.weather-desc {
  font-size: 1rem;
  color: var(--text-secondary);
}

.weather-forecast {
  display: flex;
  justify-content: space-around;
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-size: 0.875rem;
}

.forecast-icon {
  width: 2rem;
  height: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

/* ====== MODAL STYLES ====== */
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
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: modalFadeIn 0.2s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(2px); }
}

.modal-content {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 
              0 10px 10px -5px rgba(0, 0, 0, 0.1);
  width: 500px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
  overscroll-behavior: contain;
}

@keyframes modalSlideIn {
  from { transform: translateY(30px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* Fix scrolling inside modals */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent; 
}
 
.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.dark-mode .modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.dark-mode .modal-content {
  background-color: var(--secondary-color);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.close-button {
  background: transparent;
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--text-secondary);
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-color);
}

.dark-mode .close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Calendar Detail Modal Styles */
.calendar-detail-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.calendar-detail-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.5rem;
}

.calendar-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.calendar-type-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.75rem;
}

.calendar-owner {
  opacity: 0.9;
}

.calendar-details-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calendar-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.calendar-stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(0, 0, 0, 0.03);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  flex: 1;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.dark-mode .calendar-stat-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.calendar-stat-item:hover {
  transform: translateY(-2px);
  background-color: rgba(0, 0, 0, 0.05);
}

.dark-mode .calendar-stat-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.stat-icon {
  width: 1.5rem;
  height: 1.5rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.7;
}

.dark-mode .stat-icon {
  filter: invert(1);
  opacity: 0.7;
}

.events-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.members-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'%3E%3C/path%3E%3C/svg%3E");
}

.date-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.members-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.member-tile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.member-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.member-avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.member-name {
  font-weight: 500;
}

.remove-user-btn {
  background: transparent;
  border: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  color: white;
  opacity: 0.7;
  transition: opacity var(--transition-fast), background-color var(--transition-fast);
  margin-left: 0.25rem;
}

.remove-user-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.15);
}

.member-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-add-user,
.btn-leave-calendar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.btn-add-user {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-add-user:hover {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
}

.btn-leave-calendar {
  background-color: var(--danger-color);
  color: white;
  border: none;
}

.btn-leave-calendar:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.user-add-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.leave-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.btn-edit,
.btn-delete,
.btn-submit,
.btn-cancel {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast), 
              box-shadow var(--transition-fast),
              opacity var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn-edit {
  background-color: var(--primary-color);
  color: white;
}

.btn-edit:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-delete {
  background-color: var(--danger-color);
  color: white;
}

.btn-delete:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
}

.btn-submit {
  background-color: var(--primary-color);
  color: white;
}

.btn-submit:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-cancel {
  background-color: var(--text-secondary);
  color: white;
}

.btn-cancel:hover {
  background-color: #4b5563;
  transform: translateY(-2px);
}

.delete-icon {
  width: 1rem;
  height: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

/* ====== FORM ELEMENTS ====== */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-color);
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  color: var(--text-color);
}

.dark-mode .form-group input,
.dark-mode .form-group textarea,
.dark-mode .form-group select {
  background-color: var(--secondary-color);
  border-color: var(--border-color);
  color: var(--text-color);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.dark-mode .form-group input:focus,
.dark-mode .form-group textarea:focus,
.dark-mode .form-group select:focus {
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.3);
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.color-option {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.dark-mode .color-option:hover {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
}

.color-option.selected {
  box-shadow: 0 0 0 2px white, 0 0 0 4px var(--primary-color);
}

.dark-mode .color-option.selected {
  box-shadow: 0 0 0 2px var(--secondary-color), 0 0 0 4px var(--primary-color);
}

.color-option input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.color-circle {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
}

.help-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* Member Chips Styles */
.member-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.chip {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius-full);
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.chip-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: 0.5rem;
  cursor: pointer;
  border-radius: var(--radius-full);
  font-size: 1.25rem;
  opacity: 0.7;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.chip-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.15);
}

.member-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.member-input input {
  flex: 1;
}

.add-member-btn {
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.add-member-btn:hover {
  background-color: var(--primary-dark);
}

/* Spinner inside buttons */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Transitions */
.theme-blue,
.theme-pink,
.theme-green,
.theme-yellow,
.theme-red,
.theme-purple,
.theme-orange {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* ====== RESPONSIVE STYLES ====== */
@media (max-width: 1200px) {
  .dashboard-widgets {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 992px) {
  .dashboard-sidebar {
    width: 280px;
  }
  
  .search-container {
    width: 200px;
  }
  
  .calendar-stats {
    flex-wrap: wrap;
  }
  
  .calendar-stat-item {
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
  }
  
  .dashboard-sidebar {
    width: 100%;
    height: auto;
    max-height: 300px;
    position: relative;
    top: 0;
  }
  
  .header-left h1 {
    font-size: 1.25rem;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .content-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .view-selector {
    flex: 1;
  }
}

@media (max-width: 576px) {
  .dashboard-header {
    padding: 0 1rem;
  }
  
  .search-container {
    display: none;
  }
  
  .dashboard-widgets {
    margin-top: 1rem;
  }
  
  .widget {
    margin-bottom: 1rem;
  }
  
  .account-panel {
    width: 100%;
    right: 0;
    left: 0;
    position: fixed;
    top: auto;
    bottom: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    transform-origin: bottom center;
    max-height: 80vh;
    overflow-y: auto;
  }

  .account-panel::before {
    display: none;
  }

  .fade-slide-enter-from,
  .fade-slide-leave-to {
    transform: translateY(20px);
  }
  
  .calendify-logo {
    height: 28px;
  }
  
  .logo-link h1 {
    font-size: 1.125rem;
  }
  
  .view-selector {
    flex: 1;
  }
  
  .view-button {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
}


/* ====== sidebar collapse ====== */
.dashboard-sidebar.collapsed  {
  width: 0;                     /* collapse */
  padding: 0;
  border: none;
  overflow: hidden;
  transition: width .25s ease;
}

/* slide main panel over when sidebar is closed */
.sidebar-collapsed .dashboard-main {
  margin-left: 0;
}

/* simple burger icon */
.burger-icon, .burger-icon::before, .burger-icon::after {
  content:'';
  display:block;
  height:2px;
  width:18px;
  background:var(--text-color);
  transition:transform .25s ease, opacity .25s ease;
}
.burger-icon::before { transform:translateY(-6px); }
.burger-icon::after  { transform:translateY(4px); }
.burger-icon.open    { background:transparent; }
.burger-icon.open::before { transform:rotate(45deg); }
.burger-icon.open::after  { transform:rotate(-45deg); }

/* ====== modern thin scrollbar ====== */
.dashboard-sidebar::-webkit-scrollbar      { width: 8px; }
.dashboard-sidebar::-webkit-scrollbar-track{ background:transparent; }
.dashboard-sidebar::-webkit-scrollbar-thumb{
  background:rgba(255,255,255,.12);        /* light translucent rail */
  border-radius:4px;
}
.dashboard-sidebar:hover::-webkit-scrollbar-thumb{
  background:rgba(255,255,255,.30);        /* brighter on hover */
}

/* Firefox */
.dashboard-sidebar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.30) transparent;
}
</style>
