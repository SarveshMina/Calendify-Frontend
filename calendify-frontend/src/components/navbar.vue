<template>
  <nav class="navbar">
    <router-link to="/">Home</router-link>
    <router-link to="/dashboard" v-if="isAuthenticated">Dashboard</router-link>
    <router-link to="/contact">Contact Us</router-link>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>

<style scoped>
.navbar {
  background: #007bff;
  padding: 15px;
  display: flex;
  justify-content: space-around;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
