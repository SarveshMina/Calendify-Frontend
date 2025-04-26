<!-- src/components/PersonalCalendar.vue -->
<template>
  <div :class="['calendar-container', `theme-${calendarColor}`, { 'dark-mode': isDarkMode }]">
    <!-- Calendar Header Area with Actions -->
    <div class="calendar-header">
      <div class="calendar-tools">
        <button class="calendar-nav-btn" @click="navigatePrevious" aria-label="Previous">
          <i class="icon icon-sm chevron-left-icon"></i>
        </button>
        <div class="current-date-display">
          <span>{{ formattedViewDate }}</span>
        </div>
        <button class="calendar-nav-btn" @click="navigateNext" aria-label="Next">
          <i class="icon icon-sm chevron-right-icon"></i>
        </button>
        <button class="btn-today" @click="goToToday">Today</button>
      </div>
      
      <div class="view-actions">
        <div class="view-selector">
          <button 
            class="view-button" 
            :class="{ active: currentViewType === 'dayGridMonth' }"
            @click="setView('dayGridMonth')"
          >
            Month
          </button>
          <button 
            class="view-button" 
            :class="{ active: currentViewType === 'timeGridWeek' }"
            @click="setView('timeGridWeek')"
          >
            Week
          </button>
          <button 
            class="view-button" 
            :class="{ active: currentViewType === 'timeGridDay' }"
            @click="setView('timeGridDay')"
          >
            Day
          </button>
        </div>
        
        <button class="btn-add-event" @click="openAddEventModal">
          <i class="icon icon-sm plus-icon"></i>
          <span>Add Event</span>
        </button>
      </div>
    </div>

    <!-- FullCalendar Component -->
    <div class="calendar-body">
      <FullCalendar 
        ref="fullCalendar"
        :options="calendarOptions"
        class="calendar"
      />
    </div>

    <!-- MODALS -->
    <!-- Add Event Modal -->
    <div v-if="showAddEventModal" class="modal-backdrop" @click.self="closeAddEventModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New Event</h3>
          <button class="close-button" @click="closeAddEventModal">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="createEvent">
            <div class="form-group">
              <label for="eventTitle">Event Title</label>
              <input 
                id="eventTitle" 
                v-model="newEventTitle" 
                placeholder="Enter event title" 
                class="form-control"
                required
              />
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="startTime">Start Time</label>
                <input 
                  id="startTime" 
                  type="datetime-local" 
                  v-model="newEventStart" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group form-group-half">
                <label for="endTime">End Time</label>
                <input 
                  id="endTime" 
                  type="datetime-local" 
                  v-model="newEventEnd" 
                  class="form-control"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description" 
                v-model="newEventDescription" 
                placeholder="Add event details" 
                class="form-control" 
                rows="3"
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">
                <i class="icon icon-sm save-icon"></i>
                <span>Create Event</span>
              </button>
              <button type="button" class="btn btn-secondary" @click="closeAddEventModal">
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div v-if="showDetailModal && selectedEvent" class="modal-backdrop" @click.self="closeDetailModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Event Details</h3>
          <button class="close-button" @click="closeDetailModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="event-detail-card" :style="{ borderLeftColor: getEventColor() }">
            <h4 class="event-detail-title">{{ selectedEvent.title }}</h4>
            
            <div class="event-detail-meta">
              <div class="event-detail-item">
                <i class="icon icon-sm calendar-icon"></i>
                <span>{{ formatEventDateTime(selectedEvent.start) }}</span>
              </div>
              
              <div v-if="selectedEvent.end" class="event-detail-item">
                <i class="icon icon-sm clock-icon"></i>
                <span>{{ formatEventDuration(selectedEvent.start, selectedEvent.end) }}</span>
              </div>
            </div>
            
            <div class="event-detail-description" v-if="selectedEvent.extendedProps?.description">
              <h5>Description</h5>
              <p>{{ selectedEvent.extendedProps.description }}</p>
            </div>
            <div class="event-detail-description" v-else>
              <p class="no-description">No description provided</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" @click="openEditModal">
            <i class="icon icon-sm edit-icon"></i>
            <span>Edit</span>
          </button>
          <button class="btn btn-danger" @click="confirmDeleteEvent">
            <i class="icon icon-sm delete-icon"></i>
            <span>Delete</span>
          </button>
          <button class="btn btn-secondary" @click="closeDetailModal">
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Event Modal -->
    <div v-if="showEditModal && selectedEvent" class="modal-backdrop" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit Event</h3>
          <button class="close-button" @click="closeEditModal">×</button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="updateEvent">
            <div class="form-group">
              <label for="editTitle">Event Title</label>
              <input 
                id="editTitle" 
                v-model="editEventTitle" 
                placeholder="Enter event title" 
                class="form-control"
                required
              />
            </div>
            
            <div class="form-row">
              <div class="form-group form-group-half">
                <label for="editStart">Start Time</label>
                <input 
                  id="editStart" 
                  type="datetime-local" 
                  v-model="editEventStart" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group form-group-half">
                <label for="editEnd">End Time</label>
                <input 
                  id="editEnd" 
                  type="datetime-local" 
                  v-model="editEventEnd" 
                  class="form-control"
                  required
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="editDescription">Description</label>
              <textarea 
                id="editDescription" 
                v-model="editEventDescription" 
                placeholder="Add event details" 
                class="form-control" 
                rows="3"
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">
                <i class="icon icon-sm save-icon"></i>
                <span>Save Changes</span>
              </button>
              <button type="button" class="btn btn-secondary" @click="closeEditModal">
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Deletion -->
    <div v-if="showConfirmDeleteModal" class="modal-backdrop" @click.self="closeConfirmDeleteModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Delete Event</h3>
          <button class="close-button" @click="closeConfirmDeleteModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="warning-text">
            <i class="icon warning-icon"></i>
            <p>Are you sure you want to delete this event? This action cannot be undone.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-danger" @click="deleteEvent">
            <span>Delete</span>
          </button>
          <button class="btn btn-secondary" @click="closeConfirmDeleteModal">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Conflict Modal -->
    <div v-if="showConflictModal" class="modal-backdrop" @click.self="closeConflictModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Scheduling Conflict</h3>
          <button class="close-button" @click="closeConflictModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="warning-text">
            <i class="icon warning-icon"></i>
            <p>{{ conflictMessage }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-warning" @click="handleConflictProceed">
            <span>Schedule Anyway</span>
          </button>
          <button class="btn btn-secondary" @click="closeConflictModal">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dayjs from 'dayjs';
import axios from 'axios';
import { buildFunctionUrl } from '@/services/urlBuilder';
import calendarService from '@/services/calendarService';

// FullCalendar imports
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default {
  name: 'PersonalCalendar',
  components: { 
    FullCalendar
  },
  props: {
    userId: { type: String, required: true },
    calendarId: { type: String, required: true },
    calendarName: { type: String, default: 'My Calendar' },
    calendarColor: { type: String, default: 'blue' },
    currentView: { type: String, default: 'month' },
  },
  
  data() {
    return {
      // Calendar state
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: false, // Using custom header
        dayMaxEvents: true,
        selectable: true,
        editable: false, // Handled manually
        events: [],
        slotMinTime: '06:00:00',
        slotMaxTime: '22:00:00',
        allDaySlot: true,
        height: '100%',
        eventClick: this.handleEventClick,
        dateClick: this.handleDateClick,
        select: this.handleSelect,
        noEventsContent: this.renderNoEventsContent,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        },
        eventContent: this.renderEventContent
      },
      currentViewType: 'dayGridMonth',
      loading: false,
      error: null,
      
      // Add Event Modal
      showAddEventModal: false,
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',
      
      // Event Details Modal
      showDetailModal: false,
      selectedEvent: null,
      
      // Edit Event Modal
      showEditModal: false,
      editEventTitle: '',
      editEventStart: '',
      editEventEnd: '',
      editEventDescription: '',
      
      // Confirmation Modal
      showConfirmDeleteModal: false,
      
      // Conflict Modal
      showConflictModal: false,
      conflictMessage: '',
    };
  },
  
  computed: {
    // Determine if we're in dark mode
    isDarkMode() {
      return document.body.classList.contains('dark-mode');
    },
    
    // Format the current date for display
    formattedViewDate() {
      if (!this.$refs.fullCalendar) return '';
      
      const calendarApi = this.$refs.fullCalendar.getApi();
      const viewDate = calendarApi.getDate();
      const viewType = calendarApi.view.type;
      
      if (viewType === 'dayGridMonth') {
        return dayjs(viewDate).format('MMMM YYYY');
      } else if (viewType === 'timeGridWeek') {
        const weekStart = dayjs(calendarApi.view.activeStart);
        const weekEnd = dayjs(calendarApi.view.activeEnd).subtract(1, 'day');
        
        if (weekStart.month() === weekEnd.month()) {
          return `${weekStart.format('MMM D')} - ${weekEnd.format('D, YYYY')}`;
        } else if (weekStart.year() === weekEnd.year()) {
          return `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
        } else {
          return `${weekStart.format('MMM D, YYYY')} - ${weekEnd.format('MMM D, YYYY')}`;
        }
      } else if (viewType === 'timeGridDay') {
        return dayjs(viewDate).format('dddd, MMMM D, YYYY');
      }
      
      return dayjs(viewDate).format('MMMM YYYY');
    }
  },
  
  watch: {
    // Update when calendar ID changes
    calendarId() {
      this.fetchEvents();
    },
    
    // Watch for current view changes from parent
    currentView(newView) {
      this.setViewFromProp(newView);
    }
  },
  
  mounted() {
    this.fetchEvents();
    this.setViewFromProp(this.currentView);
  },
  
  methods: {
    ...mapActions(['notify']),
    
    // Map parent view prop to FullCalendar view type
    setViewFromProp(parentView) {
      if (!parentView) return;
      
      const viewMap = {
        'month': 'dayGridMonth',
        'week': 'timeGridWeek',
        'day': 'timeGridDay',
      };
      
      if (viewMap[parentView]) {
        this.setView(viewMap[parentView]);
      }
    },
    
    // Get calendar color for styling
    getEventColor() {
      const colorMap = {
        'pink': '#ec4899',
        'green': '#10b981',
        'yellow': '#f59e0b',
        'red': '#ef4444',
        'purple': '#8b5cf6',
        'orange': '#f97316',
        'blue': '#4361ee'
      };
      return colorMap[this.calendarColor] || '#4361ee';
    },
    
    // Fetch event data from API
    async fetchEvents() {
      this.loading = true;
      try {
        const res = await axios.get(
          buildFunctionUrl(`/calendar/${this.calendarId}/events`),
          { params: { userId: this.userId } }
        );
        
        const events = res.data.events || [];
        
        // Format for FullCalendar
        const formattedEvents = events.map(ev => ({
          id: ev.eventId,
          title: ev.title,
          start: ev.startTime,
          end: ev.endTime,
          allDay: this.isAllDayEvent(ev.startTime, ev.endTime),
          extendedProps: {
            description: ev.description,
          },
          backgroundColor: this.getEventColor(),
          borderColor: this.getEventColor()
        }));
        
        // Update calendar options to refresh events
        this.calendarOptions = {
          ...this.calendarOptions,
          events: formattedEvents
        };
      } catch (err) {
        this.error = err?.response?.data?.error || 'Failed to load events.';
        this.notify({ type: 'error', message: this.error });
      } finally {
        this.loading = false;
      }
    },
    
    // Check if event is an all-day event
    isAllDayEvent(start, end) {
      if (!start || !end) return false;
      
      const startDate = dayjs(start);
      const endDate = dayjs(end);
      
      // Check if the event spans exactly one or more full days
      return (
        startDate.hour() === 0 && 
        startDate.minute() === 0 && 
        endDate.hour() === 0 && 
        endDate.minute() === 0 &&
        endDate.diff(startDate, 'day') >= 1
      );
    },
    
    // Convert Date to local datetime string for form inputs
    toLocalDateTime(dateObj) {
      if (!dateObj) return '';
      
      const date = typeof dateObj === 'string' ? new Date(dateObj) : dateObj;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      return `${y}-${m}-${d}T${hh}:${mm}`;
    },
    
    // Format event date and time
    formatEventDateTime(dateTime) {
      if (!dateTime) return '';
      return dayjs(dateTime).format('ddd, MMM D, YYYY • h:mm A');
    },
    
    // Calculate and format event duration
    formatEventDuration(start, end) {
      if (!start || !end) return '';
      
      const startTime = dayjs(start);
      const endTime = dayjs(end);
      const duration = endTime.diff(startTime, 'minute');
      
      if (duration < 60) {
        return `${duration} minutes`;
      } else {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        if (minutes === 0) {
          return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
          return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
        }
      }
    },
    
    // Render custom content for events
    renderEventContent(info) {
      // Simple HTML is fine here since FullCalendar handles it correctly
      return {
        html: `
          <div class="fc-event-custom-content">
            <div class="fc-event-time">${info.timeText}</div>
            <div class="fc-event-title">${info.event.title}</div>
          </div>
        `
      };
    },
    
    // Render empty state content
    renderNoEventsContent() {
      return {
        html: `
          <div class="fc-no-events">
            <div class="fc-no-events-icon"></div>
            <p>No events scheduled</p>
            <button class="btn btn-primary btn-sm" onclick="document.querySelector('.btn-add-event').click()">
              Add Event
            </button>
          </div>
        `
      };
    },
    
    // Calendar Navigation
    navigatePrevious() {
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.prev();
      }
    },
    
    navigateNext() {
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.next();
      }
    },
    
    goToToday() {
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.today();
      }
    },
    
    // Set calendar view (month, week, day)
    setView(viewType) {
      this.currentViewType = viewType;
      
      if (this.$refs.fullCalendar) {
        const calendarApi = this.$refs.fullCalendar.getApi();
        calendarApi.changeView(viewType);
      }
      
      // Map back to simplified view type for parent
      const parentViewMap = {
        'dayGridMonth': 'month',
        'timeGridWeek': 'week',
        'timeGridDay': 'day',
      };
      
      // Emit view change to parent component
      this.$emit('view-change', parentViewMap[viewType] || viewType);
    },
    
    // Handle date click (empty date/time slot)
    handleDateClick(info) {
      // Open add event modal with pre-filled date
      this.openAddEventModal();
      
      const clickedDate = new Date(info.date);
      
      // If clicked on month view, set default time to 9am
      if (info.view.type === 'dayGridMonth') {
        clickedDate.setHours(9, 0, 0);
      }
      
      this.newEventStart = this.toLocalDateTime(clickedDate);
      
      // Set end time to 1 hour after start
      const endDate = new Date(clickedDate);
      endDate.setHours(endDate.getHours() + 1);
      this.newEventEnd = this.toLocalDateTime(endDate);
    },
    
    // Handle selection (drag to select time range)
    handleSelect(info) {
      // Open add event modal with selected time range
      this.openAddEventModal();
      
      this.newEventStart = this.toLocalDateTime(info.start);
      this.newEventEnd = this.toLocalDateTime(info.end);
    },
    
    // Handle event click
    handleEventClick(info) {
      this.selectedEvent = info.event;
      this.showDetailModal = true;
    },
    
    // Add Event Modal
    openAddEventModal() {
      this.showAddEventModal = true;
      this.newEventTitle = '';
      this.newEventDescription = '';
      
      // Set default times if none are set
      if (!this.newEventStart) {
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to nearest 15 min
        this.newEventStart = this.toLocalDateTime(now);
        
        const endTime = new Date(now);
        endTime.setHours(endTime.getHours() + 1);
        this.newEventEnd = this.toLocalDateTime(endTime);
      }
    },
    
    closeAddEventModal() {
      this.showAddEventModal = false;
      this.newEventTitle = '';
      this.newEventStart = '';
      this.newEventEnd = '';
      this.newEventDescription = '';
    },
    
    // Create a new event
    async createEvent() {
      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart,
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        
        await calendarService.addEvent(this.calendarId, payload);
        
        this.notify({ type: 'success', message: 'Event created successfully.' });
        this.closeAddEventModal();
        this.fetchEvents();
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.conflictMessage = err.response.data.error || 'There is a scheduling conflict.';
          this.showConflictModal = true;
        } else {
          const errorMsg = err?.response?.data?.error || 'Failed to create event.';
          this.notify({ type: 'error', message: errorMsg });
        }
      }
    },
    
    // Detail Modal
    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedEvent = null;
    },
    
    // Edit Event Modal
    openEditModal() {
  if (!this.selectedEvent) return;

  /* don’t reset selectedEvent – just hide the window */
  this.showDetailModal = false;

  // pre-fill the edit form
  this.editEventTitle       = this.selectedEvent.title;
  this.editEventStart       = this.toLocalDateTime(this.selectedEvent.start);
  this.editEventEnd         = this.toLocalDateTime(this.selectedEvent.end);
  this.editEventDescription = this.selectedEvent.extendedProps?.description || '';

  this.showEditModal = true;
},
closeEditModal() {
  this.showEditModal       = false;
  this.selectedEvent       = null;   // reset here
  this.editEventTitle      = '';
  this.editEventStart      = '';
  this.editEventEnd        = '';
  this.editEventDescription= '';
},
    
    // Update an existing event
    async updateEvent() {
      if (!this.selectedEvent) return;
      
      try {
        const eventId = this.selectedEvent.id;
        const payload = {
          userId: this.userId,
          title: this.editEventTitle,
          startTime: this.editEventStart,
          endTime: this.editEventEnd,
          description: this.editEventDescription,
        };
        
        await axios.put(
          buildFunctionUrl(`/calendar/${this.calendarId}/event/${eventId}/update`),
          payload
        );
        
        this.fetchEvents();
        this.closeEditModal();
        this.notify({ type: 'success', message: 'Event updated successfully.' });
      } catch (err) {
        const errorMsg = err?.response?.data?.error || 'Failed to update event.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },
    
    // Delete Event
    confirmDeleteEvent() {
      this.showConfirmDeleteModal = true;
    },
    
    closeConfirmDeleteModal() {
      this.showConfirmDeleteModal = false;
    },
    
    async deleteEvent() {
      if (!this.selectedEvent) return;
      
      try {
        const eventId = this.selectedEvent.id;
        
        await axios.delete(
          buildFunctionUrl(`/calendar/${this.calendarId}/event/${eventId}/delete`),
          { data: { userId: this.userId } }
        );
        
        this.fetchEvents();
        this.closeDetailModal();
        this.closeConfirmDeleteModal();
        this.notify({ type: 'success', message: 'Event deleted successfully.' });
      } catch (err) {
        const errorMsg = err?.response?.data?.error || 'Failed to delete event.';
        this.notify({ type: 'error', message: errorMsg });
      }
    },
    
    // Conflict Modal
    closeConflictModal() {
      this.showConflictModal = false;
      this.conflictMessage = '';
    },
    
    async handleConflictProceed() {
      try {
        const payload = {
          userId: this.userId,
          title: this.newEventTitle,
          startTime: this.newEventStart,
          endTime: this.newEventEnd,
          description: this.newEventDescription,
        };
        
        await calendarService.addEvent(this.calendarId, payload, true);
        
        this.notify({ type: 'success', message: 'Event created successfully despite conflict.' });
        this.closeAddEventModal();
        this.closeConflictModal();
        this.fetchEvents();
      } catch (err) {
        const errorMsg = err?.response?.data?.error || 'Failed to create event.';
        this.notify({ type: 'error', message: errorMsg });
      }
    }
  }
};
</script>

<style scoped>
/* Component-specific styles */
.calendar-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.calendar {
  width: 100%;
  height: auto;
}

/* FC custom overrides - scoped to this component */
:deep(.fc-event-custom-content) {
  display: flex;
  flex-direction: column;
  padding: 2px 4px;
}

:deep(.fc-event-time) {
  font-size: var(--text-xs);
  opacity: 0.9;
  font-weight: 500;
}

:deep(.fc-event-title) {
  font-weight: 500;
  word-break: break-word;
}

/* Media queries for responsive behavior */
@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .calendar-tools, 
  .view-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  :deep(.fc-header-toolbar) {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  :deep(.fc-toolbar-chunk) {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .btn-add-event span {
    display: none;
  }
  
  .btn-add-event {
    padding: var(--space-2);
    aspect-ratio: 1/1;
    border-radius: var(--radius-full);
  }
}
</style>