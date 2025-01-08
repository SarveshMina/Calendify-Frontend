<!-- src/App.vue -->

<template>
  <div id="app">
    <router-view />
    <NotificationPopUp /> <!-- Ensure the correct component is used -->
  </div>
</template>

<script>
import NotificationPopUp from '@/components/NotificationPopUp.vue'; // Correct import

export default {
  name: 'App',
  components: {
    NotificationPopUp, // Registering the component
  },
};
</script>

<style>
/* Any global styles if necessary */
</style>
