<template>
  <div :class="['app-container', currentThemeClass]">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
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
