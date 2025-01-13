<!-- src/views/AuthLanding.vue -->
<template>
  <div class="auth-container" @mousemove="handleMouseMove">
    <!-- Responsive Light Blue Gradient Background -->
    <div class="background-animation"></div>

    <!-- Overlay for content readability -->
    <div class="overlay"></div>

    <!-- Header with Dark Mode Toggle -->
    <header class="auth-header">
      <h1 class="app-name">Calendify</h1>
      <button @click="toggleDarkMode" class="toggle-container" aria-label="Toggle Dark Mode">
        <img :src="darkMode ? moonIcon : sunIcon" alt="Dark Mode Toggle" class="toggle-icon" />
      </button>
    </header>

    <!-- Slogan and Explanation -->
    <section class="auth-intro">
      <h2 class="slogan">Organize Your Life Seamlessly</h2>
      <p class="description">
        Calendify is your ultimate shared calendar solution, enabling you to schedule, collaborate, and stay on top of your events effortlessly.
      </p>
    </section>

    <!-- Authentication Panels -->
    <main class="auth-main">
      <!-- Login Panel -->
      <div class="auth-panel login-panel">
        <h3>Login</h3>
        <form @submit.prevent="doLogin">
          <div class="form-group">
            <input
                v-model="loginUsername"
                type="text"
                placeholder="Username"
                required
                class="auth-input"
            />
          </div>
          <div class="form-group password-group">
            <input
                :type="showLoginPassword ? 'text' : 'password'"
                v-model="loginPassword"
                placeholder="Password"
                required
                class="auth-input"
            />
            <img
                :src="showLoginPassword ? eyeOffIcon : eyeIcon"
                alt="Toggle Password Visibility"
                class="toggle-password"
                :class="{ rotated: showLoginPassword }"
                @click="toggleLoginPassword"
            />
          </div>
          <p v-if="loginError" class="error">{{ loginError }}</p>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
      </div>

      <!-- Register Panel -->
      <div class="auth-panel register-panel">
        <h3>Register</h3>
        <form @submit.prevent="doRegister">
          <div class="form-group">
            <input
                v-model="registerUsername"
                type="text"
                placeholder="Username"
                required
                class="auth-input"
            />
          </div>
          <div class="form-group password-group">
            <input
                :type="showRegisterPassword ? 'text' : 'password'"
                v-model="registerPassword"
                placeholder="Password"
                required
                class="auth-input"
            />
            <img
                :src="showRegisterPassword ? eyeOffIcon : eyeIcon"
                alt="Toggle Password Visibility"
                class="toggle-password"
                :class="{ rotated: showRegisterPassword }"
                @click="toggleRegisterPassword"
            />
          </div>
          <div class="form-group password-group">
            <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                placeholder="Confirm Password"
                required
                class="auth-input"
            />
            <img
                :src="showConfirmPassword ? eyeOffIcon : eyeIcon"
                alt="Toggle Confirm Password Visibility"
                class="toggle-password"
                :class="{ rotated: showConfirmPassword }"
                @click="toggleConfirmPassword"
            />
          </div>
          <p v-if="registerError" class="error">{{ registerError }}</p>
          <button type="submit" class="btn btn-primary">Register</button>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <footer class="auth-footer">
      <p>&copy; 2025 Calendify. All rights reserved.</p>
    </footer>
  </div>
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
      showLoginPassword: false, // Tracks login password visibility

      // Register data
      registerUsername: '',
      registerPassword: '',
      confirmPassword: '',
      registerError: null,
      showRegisterPassword: false, // Tracks register password visibility
      showConfirmPassword: false, // Tracks confirm password visibility

      // Dark mode
      darkMode: false,
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      eyeIcon: require('@/assets/icons/eye.png'), // Eye icon for show password
      eyeOffIcon: require('@/assets/icons/eye-off.png'), // Eye-off icon for hide password
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
        // If login is successful, navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.loginError = err?.response?.data?.error || 'Login failed.';
      }
    },
    async doRegister() {
      if (this.registerPassword !== this.confirmPassword) {
        this.registerError = 'Passwords do not match.';
        return;
      }

      try {
        await this.register({
          username: this.registerUsername,
          password: this.registerPassword,
        });
        // If register is successful, navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.registerError = err?.response?.data?.error || 'Registration failed.';
      }
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    handleMouseMove(event) {
      const { clientX } = event; // Removed clientY
      const windowWidth = window.innerWidth;

      // Calculate angle based on mouse position
      const xPercent = clientX / windowWidth;

      // Determine angle (0 to 360 degrees)
      const angle = xPercent * 360; // Horizontal movement affects angle

      // Set CSS variable --gradient-angle
      this.$el.style.setProperty('--gradient-angle', `${angle}deg`);
    },
    toggleLoginPassword() {
      this.showLoginPassword = !this.showLoginPassword;
    },
    toggleRegisterPassword() {
      this.showRegisterPassword = !this.showRegisterPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
  mounted() {
    // Initialize dark mode to false (light mode) by default
    this.darkMode = false;
    document.body.classList.remove('dark-mode');

    // Load dark mode preference from localStorage
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (storedDarkMode) {
      this.darkMode = true;
      document.body.classList.add('dark-mode');
    }
  },
};
</script>

<style src="@/assets/styles/auth.css" scoped></style>
