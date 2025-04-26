<!-- src/components/HomeCalendar.vue -->
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

    <!-- Calendar Stats Summary -->
    <div class="calendar-summary">
      <div class="summary-card">
        <div class="summary-icon">
          <i class="icon calendar-icon"></i>
        </div>
        <div class="summary-info">
          <div class="summary-value">{{ allEvents.length }}</div>
          <div class="summary-label">Total Events</div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon">
          <i class="icon calendar-icon"></i>
        </div>
        <div class="summary-info">
          <div class="summary-value">{{ todaysEvents.length }}</div>
          <div class="summary-label">Today's Events</div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon">
          <i class="icon clock-icon"></i>
        </div>
        <div class="summary-info">
          <div class="summary-value">{{ upcomingEvents.length }}</div>
          <div class="summary-label">Upcoming</div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="summary-icon">
          <i class="icon calendar-icon"></i>
        </div>
        <div class="summary-info">
          <div class="summary-value">{{ calendars.length }}</div>
          <div class="summary-label">Calendars</div>
        </div>
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
              <label for="chooseCalendar">Select Calendar</label>
              <select 
                id="chooseCalendar" 
                v-model="chosenCalendarId" 
                class="form-control form-select"
                required
              >
                <option disabled value="">Select a calendar</option>
                <option 
                  v-for="cal in personalCalendars" 
                  :key="cal.calendarId" 
                  :value="cal.calendarId"
                  :style="{ '--cal-indicator': calColor(cal.color) }"
                  class="calendar-option"
                >
                  {{ cal.name }}
                </option>
              </select>
            </div>
            
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
            
            <div class="info-text">
              <i class="icon icon-sm info-icon"></i>
              <p>This will add the event to your selected personal calendar. Group calendars can be accessed from the sidebar.</p>
            </div>
            
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary" :disabled="!chosenCalendarId">
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
          <div class="event-detail-card" :style="{ borderLeftColor: getEventColor(selectedEvent) }">
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
              
              <div v-if="selectedEvent.extendedProps?.calendarId" class="event-detail-item">
                <i class="icon icon-sm calendar-icon"></i>
                <span>{{ getCalendarName(selectedEvent.extendedProps.calendarId) }}</span>
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
          <button class="btn btn-secondary" @click="closeDetailModal">
            <span>Close</span>
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
import { mapGetters, mapActions } from 'vuex';
import dayjs from 'dayjs';
import calendarService from '@/services/calendarService';

// FullCalendar imports
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

export default {
  name: 'HomeCalendar',
  components: { FullCalendar },
  props: {
    userId: { type: String, required: true },
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
        eventContent: this.renderEventContent,
        eventDidMount: this.eventDidMount
      },
      currentViewType: 'dayGridMonth',
      loading: false,
      
      // Add Event Modal
      showAddEventModal: false,
      chosenCalendarId: '',
      newEventTitle: '',
      newEventStart: '',
      newEventEnd: '',
      newEventDescription: '',
      
      // Event Details Modal
      showDetailModal: false,
      selectedEvent: null,
      
      // Conflict Modal
      showConflictModal: false,
      conflictMessage: '',
    };
  },
  
  computed: {
    ...mapGetters(['allEvents', 'calendars']),
    
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
    },
    
    // Today's events
    todaysEvents() {
      const today = dayjs().startOf('day');
      const tomorrow = today.add(1, 'day');
      
      return this.allEvents.filter(event => {
        const eventDate = dayjs(event.startTime);
        return eventDate.isAfter(today) && eventDate.isBefore(tomorrow);
      });
    },
    
    // Upcoming events (next 7 days)
    upcomingEvents() {
      const now = dayjs();
      const weekLater = now.add(7, 'day');
      
      return this.allEvents.filter(event => {
        const eventDate = dayjs(event.startTime);
        return eventDate.isAfter(now) && eventDate.isBefore(weekLater);
      });
    },
    
    // Filter personal calendars for the dropdown
    personalCalendars() {
      return this.calendars.filter(cal => !cal.isGroup);
    },
    
    // Filter group calendars
    groupCalendars() {
      return this.calendars.filter(cal => cal.isGroup);
    },
  },
  
  watch: {
    // Watch for allEvents changes to update the calendar
    allEvents: {
      handler(newEvents) {
        this.updateCalendarEvents(newEvents);
      },
      deep: true
    },
    
    // Watch for currentView changes from parent
    currentView(newView) {
      this.setViewFromProp(newView);
    },
    
    // Set first personal calendar as default when available
    personalCalendars: {
      handler(calendars) {
        if (calendars.length > 0 && !this.chosenCalendarId) {
          this.chosenCalendarId = calendars[0].calendarId;
        }
      },
      immediate: true
    }
  },
  
  mounted() {
    this.fetchAllEvents();
    this.setViewFromProp(this.currentView);
  },
  
  methods: {
    ...mapActions(['notify', 'fetchAllEvents']),
    
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
    
    // Update calendar with events from store
    updateCalendarEvents(events) {
      const formattedEvents = events.map(ev => {
        const calendar = this.getCalendarById(ev.calendarId);
        const color = this.calColor(calendar ? calendar.color : this.calendarColor);
        
        return {
          id: ev.eventId,
          title: ev.title,
          start: ev.startTime,
          end: ev.endTime,
          allDay: this.isAllDayEvent(ev.startTime, ev.endTime),
          extendedProps: {
            description: ev.description,
            calendarId: ev.calendarId,
            calendarName: calendar ? calendar.name : 'Unknown Calendar',
          },
          backgroundColor: color,
          borderColor: color,
          textColor: this.getContrastColor(color),
          classNames: [calendar ? `cal-${calendar.color}` : `cal-${this.calendarColor}`]
        };
      });
      
      // Update calendar options to refresh events
      this.calendarOptions = {
        ...this.calendarOptions,
        events: formattedEvents
      };
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
    
    // Get contrasting text color based on background
    getContrastColor(hexColor) {
      // Default to white text if we can't process the color
      if (!hexColor || !hexColor.startsWith('#')) {
        return '#FFFFFF';
      }
      
      // Convert hex to RGB
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      
      // Calculate brightness (YIQ method)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      // Return black or white text depending on brightness
      return brightness > 128 ? '#000000' : '#FFFFFF';
    },
    
    // Get calendar color
    calColor(color) {
      const colorMap = {
        'pink': '#ec4899',
        'green': '#10b981',
        'yellow': '#f59e0b',
        'red': '#ef4444',
        'purple': '#8b5cf6',
        'orange': '#f97316',
        'blue': '#4361ee'
      };
      return colorMap[color] || '#4361ee';
    },
    
    // Get event color based on source calendar
    getEventColor(event) {
      if (!event) return this.calColor(this.calendarColor);
      
      if (event.backgroundColor) {
        return event.backgroundColor;
      }
      
      const calendar = this.getCalendarById(event.extendedProps?.calendarId);
      return this.calColor(calendar ? calendar.color : this.calendarColor);
    },
    
    // Get calendar by ID
    getCalendarById(calendarId) {
      return this.calendars.find(cal => cal.calendarId === calendarId);
    },
    
    // Get calendar name
    getCalendarName(calendarId) {
      const calendar = this.getCalendarById(calendarId);
      return calendar ? calendar.name : 'Unknown Calendar';
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
    
    // Event rendering hooks
    renderEventContent(info) {
      // Show calendar name in month view events
      const calendarName = info.view.type === 'dayGridMonth' && info.event.extendedProps?.calendarName 
        ? `<div class="fc-event-calendar">${info.event.extendedProps.calendarName}</div>` 
        : '';
        
      return {
        html: `
          <div class="fc-event-custom-content">
            <div class="fc-event-time">${info.timeText}</div>
            <div class="fc-event-title">${info.event.title}</div>
            ${calendarName}
          </div>
        `
      };
    },
    
    // Add tooltip to events
    eventDidMount(info) {
      const calendar = this.getCalendarById(info.event.extendedProps?.calendarId);
      const calendarName = calendar ? calendar.name : 'Unknown Calendar';
      
      // Set custom tooltip
      info.el.setAttribute('title', `${info.event.title} (${calendarName})`);
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
      
      // Default to first personal calendar if not set
      if (this.personalCalendars.length > 0 && !this.chosenCalendarId) {
        this.chosenCalendarId = this.personalCalendars[0].calendarId;
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
      if (!this.chosenCalendarId) {
        this.notify({ type: 'error', message: 'Please select a calendar.' });
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
        
        await calendarService.addEvent(this.chosenCalendarId, payload);
        
        this.notify({ type: 'success', message: 'Event created successfully.' });
        this.closeAddEventModal();
        await this.fetchAllEvents();
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
        
        await calendarService.addEvent(this.chosenCalendarId, payload, true);
        
        this.notify({ type: 'success', message: 'Event created successfully despite conflict.' });
        this.closeAddEventModal();
        this.closeConflictModal();
        await this.fetchAllEvents();
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

:deep(.fc-event-calendar) {
  font-size: 0.675rem;
  opacity: 0.85;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Media queries for responsive behavior */
@media (max-width: 992px) {
  .calendar-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

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
  .calendar-summary {
    grid-template-columns: 1fr;
  }
  
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