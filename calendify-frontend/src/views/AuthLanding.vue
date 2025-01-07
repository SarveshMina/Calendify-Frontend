<!-- src/views/AuthLanding.vue -->
<template>
  <section class="landing">
    <p>Calendify: Shared Calendar</p>
    <p class="scroll-indicator">Welcome to your one-stop calendar</p>
  </section>

  <section class="content">
    <div class="auth-container">

      <!-- Login Panel -->
      <div class="auth-section login">
        <h3>Login</h3>
        <!-- Error message -->
        <p v-if="loginError" class="error">{{ loginError }}</p>

        <input v-model="loginUsername" placeholder="Username" />
        <input v-model="loginPassword" type="password" placeholder="Password" />
        <button @click="doLogin">Login</button>
      </div>

      <!-- Register Panel -->
      <div class="auth-section register">
        <h3>Register</h3>
        <!-- Error message -->
        <p v-if="registerError" class="error">{{ registerError }}</p>

        <input v-model="registerUsername" placeholder="Username" />
        <input v-model="registerPassword" type="password" placeholder="Password" />
        <button @click="doRegister">Register</button>
      </div>

    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthLanding',
  data() {
    return {
      // Login data
      loginUsername: '',
      loginPassword: '',
      loginError: null,

      // Register data
      registerUsername: '',
      registerPassword: '',
      registerError: null,
    };
  },
  methods: {
    ...mapActions(['login', 'register']),
    async doLogin() {
      try {
        await this.login({
          username: this.loginUsername,
          password: this.loginPassword,
        });
        // If login is successful, navigate or do something
        this.$router.push('/dashboard');
      } catch (err) {
        this.loginError = err?.response?.data?.error || 'Login failed.';
      }
    },
    async doRegister() {
      try {
        await this.register({
          username: this.registerUsername,
          password: this.registerPassword,
        });
        // If register is successful, navigate or do something
        this.$router.push('/dashboard');
      } catch (err) {
        this.registerError = err?.response?.data?.error || 'Registration failed.';
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-bottom: 10px;
}
</style>
