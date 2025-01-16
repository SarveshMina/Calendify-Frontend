<!-- src/views/AuthLanding.vue -->
<template>
  <div class="auth-container" @mousemove="handleMouseMove">
    <!-- Existing Background and Overlay -->
    <div class="background-animation"></div>
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
      <!-- 1. Added Logo -->
      <div class="logo-container">
        <img src="@/assets/icons/logo-light.webp" alt="Calendify Logo" class="logo" />
      </div>
      <h2 class="slogan">Organize Your Life Seamlessly</h2>
      <p class="description">
        Calendify is your ultimate shared calendar solution, enabling you to schedule, collaborate, and stay on top of your events effortlessly.
      </p>
    </section>

    <!-- Authentication Panels -->
    <main class="auth-main">
      <!-- Login Panel -->
      <div v-if="currentView === 'login'" class="auth-panel login-panel">
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
        <p class="switch-link">
          Don't have an account? <a href="#" @click.prevent="switchView('register')">Register</a>
        </p>
        <p class="switch-link">
          Forgot your password? <a href="#" @click.prevent="switchView('forgotPassword')">Reset Password</a>
        </p>
      </div>

      <!-- Registration Panel with Email field -->
      <div v-else-if="currentView === 'register'" class="auth-panel register-panel">
        <h3>Register</h3>
        <form @submit.prevent="doRegister">
          <!-- USERNAME -->
          <div class="form-group">
            <input
                v-model="registerUsername"
                type="text"
                placeholder="Username"
                required
                class="auth-input"
            />
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <input
                v-model="registerEmail"
                type="email"
                placeholder="Email"
                required
                class="auth-input"
            />
          </div>

          <!-- PASSWORD -->
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

          <!-- CONFIRM PASSWORD -->
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
        <p class="switch-link">
          Already have an account? <a href="#" @click.prevent="switchView('login')">Login</a>
        </p>
      </div>

      <!-- Forgot Password Request Panel -->
      <div v-else-if="currentView === 'forgotPassword'" class="auth-panel forgot-password-panel">
        <h3>Reset Password</h3>
        <form @submit.prevent="requestResetPassword">
          <!-- EMAIL -->
          <div class="form-group">
            <input
                v-model="forgotEmail"
                type="email"
                placeholder="Enter your registered Email"
                required
                class="auth-input"
            />
          </div>

          <p v-if="forgotPasswordError" class="error">{{ forgotPasswordError }}</p>
          <p v-if="forgotPasswordMessage" class="success">{{ forgotPasswordMessage }}</p>

          <button type="submit" class="btn btn-primary">Send OTP</button>
        </form>
        <p class="switch-link">
          Remembered your password? <a href="#" @click.prevent="switchView('login')">Login</a>
        </p>
      </div>

      <!-- Reset Password Panel -->
      <div v-else-if="currentView === 'resetPassword'" class="auth-panel reset-password-panel">
        <h3>Enter OTP & Reset Password</h3>
        <form @submit.prevent="resetPassword">
          <!-- EMAIL -->
          <div class="form-group">
            <input
                v-model="resetEmail"
                type="email"
                placeholder="Registered Email"
                required
                class="auth-input"
            />
          </div>

          <!-- OTP -->
          <div class="form-group">
            <input
                v-model="resetOTP"
                type="text"
                placeholder="Enter OTP"
                required
                class="auth-input"
                maxlength="6"
            />
          </div>

          <!-- NEW PASSWORD -->
          <div class="form-group password-group">
            <input
                :type="showResetPassword ? 'text' : 'password'"
                v-model="resetPasswordInput"
                placeholder="New Password"
                required
                class="auth-input"
            />
            <img
                :src="showResetPassword ? eyeOffIcon : eyeIcon"
                alt="Toggle Password Visibility"
                class="toggle-password"
                :class="{ rotated: showResetPassword }"
                @click="toggleResetPassword"
            />
          </div>

          <!-- CONFIRM NEW PASSWORD -->
          <div class="form-group password-group">
            <input
                :type="showConfirmResetPassword ? 'text' : 'password'"
                v-model="confirmResetPassword"
                placeholder="Confirm New Password"
                required
                class="auth-input"
            />
            <img
                :src="showConfirmResetPassword ? eyeOffIcon : eyeIcon"
                alt="Toggle Confirm Password Visibility"
                class="toggle-password"
                :class="{ rotated: showConfirmResetPassword }"
                @click="toggleConfirmResetPassword"
            />
          </div>

          <p v-if="resetPasswordError" class="error">{{ resetPasswordError }}</p>
          <p v-if="resetPasswordMessage" class="success">{{ resetPasswordMessage }}</p>

          <button type="submit" class="btn btn-primary">Reset Password</button>
        </form>
        <p class="switch-link">
          Need a new OTP? <a href="#" @click.prevent="switchView('forgotPassword')">Request OTP</a>
        </p>
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
import authService from '@/services/authService'; // Import the authService

export default {
  name: 'AuthLanding',
  data() {
    return {
      // Current view state: 'login', 'register', 'forgotPassword', 'resetPassword'
      currentView: 'login',

      // Login data
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      showLoginPassword: false, // Tracks login password visibility

      // Register data
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      registerError: null,
      showRegisterPassword: false, // Tracks register password visibility
      showConfirmPassword: false, // Tracks confirm password visibility

      // Forgot Password data
      forgotEmail: '',
      forgotPasswordError: null,
      forgotPasswordMessage: null,

      // Reset Password data
      resetEmail: '',
      resetOTP: '',
      resetPasswordInput: '',
      confirmResetPassword: '',
      resetPasswordError: null,
      resetPasswordMessage: null,
      showResetPassword: false,
      showConfirmResetPassword: false,

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

    // Switch between different views
    switchView(view) {
      this.currentView = view;
      // Clear all error and success messages when switching views
      this.clearMessages();
    },

    // Clear all messages
    clearMessages() {
      this.loginError = null;
      this.registerError = null;
      this.forgotPasswordError = null;
      this.forgotPasswordMessage = null;
      this.resetPasswordError = null;
      this.resetPasswordMessage = null;
    },

    // Login method
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

    // Register method
    async doRegister() {
      if (this.registerPassword !== this.confirmPassword) {
        this.registerError = 'Passwords do not match.';
        return;
      }
      try {
        await this.register({
          username: this.registerUsername,
          password: this.registerPassword,
          email: this.registerEmail
        });
        // If register is successful, navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.registerError = err?.response?.data?.error || 'Registration failed.';
      }
    },

    // Forgot Password: Request OTP
    async requestResetPassword() {
      this.forgotPasswordError = null;
      this.forgotPasswordMessage = null;
      try {
        const response = await authService.forgotPassword(this.forgotEmail);
        this.forgotPasswordMessage = response.data.message || 'OTP sent successfully.';
        // Automatically switch to resetPassword view after requesting OTP
        this.switchView('resetPassword');
        // Pre-fill the email in resetPassword view
        this.resetEmail = this.forgotEmail;
      } catch (err) {
        this.forgotPasswordError = err?.response?.data?.error || 'Failed to send OTP.';
      }
    },

    // Reset Password: Submit OTP and New Password
    async resetPassword() {
      this.resetPasswordError = null;
      this.resetPasswordMessage = null;

      if (this.resetPasswordInput !== this.confirmResetPassword) {
        this.resetPasswordError = 'Passwords do not match.';
        return;
      }

      try {
        const response = await authService.resetPassword(
            this.resetEmail,
            this.resetOTP,
            this.resetPasswordInput
        );
        this.resetPasswordMessage = response.data.message || 'Password reset successful.';
        // Optionally, redirect to login after successful password reset
        setTimeout(() => {
          this.switchView('login');
          // Clear reset fields
          this.resetEmail = '';
          this.resetOTP = '';
          this.resetPasswordInput = '';
          this.confirmResetPassword = '';
        }, 2000); // 2-second delay before redirect
      } catch (err) {
        this.resetPasswordError = err?.response?.data?.error || 'Failed to reset password.';
      }
    },

    // Toggle Dark Mode
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },

    // Handle Mouse Movement for Background Animation
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

    // Toggle Password Visibility Methods
    toggleLoginPassword() {
      this.showLoginPassword = !this.showLoginPassword;
    },
    toggleRegisterPassword() {
      this.showRegisterPassword = !this.showRegisterPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    toggleResetPassword() {
      this.showResetPassword = !this.showResetPassword;
    },
    toggleConfirmResetPassword() {
      this.showConfirmResetPassword = !this.showConfirmResetPassword;
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

<style src="@/assets/styles/auth.css" scoped>
/* Add styles for success messages */
.success {
  color: #4caf50; /* Green color for success */
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

/* Additional styles for the logo */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px; /* Space between logo and slogan */
}

.logo {
  width: 200px; /* Adjust size as needed */
  height: auto;
}
</style>
