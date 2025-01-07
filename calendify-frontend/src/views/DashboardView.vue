<template>
  <div class="dashboard">
    <h2>Dashboard</h2>
    <p>Welcome, User ID: {{ userId }}!</p>
    <button @click="handleLogout">Logout</button>

    <!-- Personal Calendar Component -->
    <PersonalCalendar
        v-if="defaultCalendarId"
        :userId="userId"
        :calendarId="defaultCalendarId"
        calendarName="My Default Personal Calendar"
    />
    <p v-else>Loading default calendar...</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PersonalCalendar from '@/components/PersonalCalendar.vue';

export default {
  name: 'DashboardView',
  components: { PersonalCalendar },
  computed: {
    ...mapGetters(['userId', 'defaultCalendarId']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #ff4d4d;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 3px;
}
button:hover {
  background-color: #ff1a1a;
}
</style>
