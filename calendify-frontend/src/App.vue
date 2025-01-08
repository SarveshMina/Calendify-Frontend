<template>
  <div :class="['app-container', currentThemeClass]">
    <router-view />
    <NotificationPopUp />
  </div>
</template>

<script>
import NotificationPopUp from '@/components/NotificationPopUp.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    NotificationPopUp,
  },
  computed: {
    ...mapGetters(['activeCalendarColor']),
    currentThemeClass() {
      return this.activeCalendarColor ? `theme-${this.activeCalendarColor}` : 'theme-blue';
    },
  },
  mounted() {
    this.fetchCalendars();
  },
  methods: {
    ...mapActions(['fetchCalendars']),
  },
};
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
