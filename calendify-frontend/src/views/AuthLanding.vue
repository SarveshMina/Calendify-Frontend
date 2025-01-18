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
      <!-- 1. Dynamic Logo Based on Dark Mode -->
      <div class="logo-container">
        <img :src="currentLogo" alt="Calendify Logo" class="logo" />
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
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="loginLoading"
          >
            <span v-if="loginLoading" class="button-content">
              <SpinnerLoader /> Logging in...
            </span>
            <span v-else>Login</span>
          </button>
          <div class="google-signin-wrapper">
            <div id="google-button-login"></div>
          </div>
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
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="registerLoading"
          >
            <span v-if="registerLoading" class="button-content">
              <SpinnerLoader /> Registering...
            </span>
            <span v-else>Register</span>
          </button>

          <div class="google-signin-wrapper">
            <div id="google-button-register"></div>
          </div>
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

          <button
              type="submit"
              class="btn btn-primary"
              :disabled="forgotPasswordLoading"
          >
            <span v-if="forgotPasswordLoading" class="button-content">
              <SpinnerLoader /> Sending OTP...
            </span>
            <span v-else>Send OTP</span>
          </button>
        </form>
        <p class="switch-link">
          Remembered your password? <a href="#" @click.prevent="switchView('login')">Login</a>
        </p>
      </div>

      <!-- Reset Password Panel -->
      <div v-else-if="currentView === 'resetPassword'" class="auth-panel reset-password-panel">
        <h3>Enter OTP & Reset Password</h3>
        <form @submit.prevent="performResetPassword">
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

          <button
              type="submit"
              class="btn btn-primary"
              :disabled="resetPasswordLoading"
          >
            <span v-if="resetPasswordLoading" class="button-content">
              <SpinnerLoader /> Resetting...
            </span>
            <span v-else>Reset Password</span>
          </button>
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

    <!-- Notifications -->
    <div class="notifications">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', notification.type]"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SpinnerLoader from '@/components/SpinnerLoader.vue'; // Import SpinnerLoader

export default {
  name: 'AuthLanding',
  components: {
    SpinnerLoader, // Register SpinnerLoader
  },
  data() {
    return {
      // Current view state: 'login', 'register', 'forgotPassword', 'resetPassword'
      currentView: 'login',

      // Login data
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      showLoginPassword: false, // Tracks login password visibility
      loginLoading: false, // Tracks login loading state

      // Register data
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      registerError: null,
      showRegisterPassword: false, // Tracks register password visibility
      showConfirmPassword: false, // Tracks confirm password visibility
      registerLoading: false, // Tracks register loading state

      // Forgot Password data
      forgotEmail: '',
      forgotPasswordError: null,
      forgotPasswordMessage: null,
      forgotPasswordLoading: false, // Tracks forgot password loading state

      // Reset Password data
      resetEmail: '',
      resetOTP: '',
      resetPasswordInput: '',
      confirmResetPassword: '',
      resetPasswordError: null,
      resetPasswordMessage: null,
      showResetPassword: false,
      showConfirmResetPassword: false,
      resetPasswordLoading: false, // Tracks reset password loading state

      // Dark mode
      darkMode: false,
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      eyeIcon: require('@/assets/icons/eye.png'), // Eye icon for show password
      eyeOffIcon: require('@/assets/icons/eye-off.png'), // Eye-off icon for hide password
      // Logo assets
      lightLogo: require('@/assets/icons/logo-light.png'),
      darkLogo: require('@/assets/icons/logo-dark.png'),
    };
  },
  computed: {
    ...mapGetters(['notifications']),
    // Compute the current logo based on darkMode
    currentLogo() {
      return this.darkMode ? this.lightLogo : this.darkLogo;
    },
  },

  watch: {
    currentView(newVal) {
      if (newVal === 'login' || newVal === 'register') {
        // Re-render the Google button for whichever view is active
        this.$nextTick(() => {
          this.renderGoogleButton();
        });
      }
    }
  },

  methods: {
    ...mapActions(['login', 'register', 'forgotPassword', 'resetPassword', 'notify',  'googleSignIn']),

    // Switch between different views
    switchView(view) {
      // Prevent switching views if any action is loading
      if (
          this.loginLoading ||
          this.registerLoading ||
          this.forgotPasswordLoading ||
          this.resetPasswordLoading
      ) {
        this.notify({
          type: 'error',
          message: 'Please wait for the current operation to complete.',
        });
        return;
      }

      // Additional validation: Ensure the view exists
      const validViews = ['login', 'register', 'forgotPassword', 'resetPassword'];
      if (!validViews.includes(view)) {
        this.notify({
          type: 'error',
          message: 'Invalid view requested.',
        });
        return;
      }

      this.currentView = view;
      // Clear all error and success messages when switching views
      this.clearMessages();
    },

    handleGoogleLogin(response) {
      const idToken = response.credential;
      this.handleGoogleIDToken(idToken);
    },

    async handleGoogleIDToken(idToken) {
      try {
        // Dispatch the Vuex action that calls the backend
        await this.googleSignIn(idToken);
        // If successful, go to the dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        console.error(err);
        // Show an error if needed
      }
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

    renderGoogleButton() {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: '254139626237-l4klntpne4skrjof2401ecr4l6tv275s.apps.googleusercontent.com',
        callback: this.handleGoogleLogin,
        auto_select: false,
      });

      let containerId = '';
      if (this.currentView === 'login') {
        containerId = 'google-button-login';
      } else if (this.currentView === 'register') {
        containerId = 'google-button-register';
      } else {
        return;
      }

      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = ''; // Clear any previous button
        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'medium',         // 'small' | 'medium' | 'large'
          shape: 'pill',          // or 'rectangular', etc.
          text: 'signin_with',
          logo_alignment: 'left',
          width: 200,             // reduce from 300 to 220 (or 200) for a smaller button
          height: 40,             // reduce from 60 to 40 for a smaller button
        });
      }

      // Optionally cancel One Tap if you want to only show the button
      window.google.accounts.id.cancel();
    },


    // Login method
    async doLogin() {
      this.loginLoading = true;
      this.loginError = null;
      try {
        await this.login({
          username: this.loginUsername,
          password: this.loginPassword,
        });
        // If login is successful, navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.loginError = err?.response?.data?.error || 'Login failed.';
      } finally {
        this.loginLoading = false;
      }
    },

    // Register method
    async doRegister() {
      this.registerLoading = true;
      this.registerError = null;
      if (this.registerPassword !== this.confirmPassword) {
        this.registerError = 'Passwords do not match.';
        this.registerLoading = false;
        return;
      }
      try {
        await this.register({
          username: this.registerUsername,
          password: this.registerPassword,
          email: this.registerEmail,
        });
        // If register is successful, navigate to dashboard
        this.$router.push('/dashboard');
      } catch (err) {
        this.registerError = err?.response?.data?.error || 'Registration failed.';
      } finally {
        this.registerLoading = false;
      }
    },

    // Forgot Password: Request OTP
    async requestResetPassword() {
      this.forgotPasswordLoading = true;
      this.forgotPasswordError = null;
      this.forgotPasswordMessage = null;
      try {
        const response = await this.forgotPassword(this.forgotEmail);
        console.log('Forgot Password Response:', response); // Debugging Line
        this.forgotPasswordMessage = response.data.message || 'OTP sent successfully.';
        // Pre-fill the email in resetPassword view
        this.resetEmail = this.forgotEmail;
      } catch (err) {
        console.error('Forgot Password Error:', err); // Debugging Line
        this.forgotPasswordError = err?.response?.data?.error || 'Failed to send OTP.';
      } finally {
        this.forgotPasswordLoading = false;
      }

      // Only switch view if there was no error
      if (!this.forgotPasswordError) {
        this.switchView('resetPassword');
      }
    },

    // Reset Password: Submit OTP and New Password
    async performResetPassword() {
      this.resetPasswordLoading = true;
      this.resetPasswordError = null;
      this.resetPasswordMessage = null;

      if (this.resetPasswordInput !== this.confirmResetPassword) {
        this.resetPasswordError = 'Passwords do not match.';
        this.resetPasswordLoading = false;
        return;
      }

      try {
        const response = await this.resetPassword({
          email: this.resetEmail,
          otp: this.resetOTP,
          newPassword: this.resetPasswordInput,
        });
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
      } finally {
        this.resetPasswordLoading = false;
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
    
    this.renderGoogleButton();

    if (this.currentView === 'login' || this.currentView === 'register') {
      this.$nextTick(() => {
        this.renderGoogleButton();
      });
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: '254139626237-l4klntpne4skrjof2401ecr4l6tv275s.apps.googleusercontent.com',
        callback: (response) => {
          // Extract the ID token from Google's response
          const idToken = response.credential;
          // Pass it into our existing method
          this.handleGoogleIDToken(idToken);
        },
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
          document.getElementById('google-button-container'),
          { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular', logo_alignment: 'left' }
      );
      window.google.accounts.id.cancel();
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

/* Add styles for error messages */
.error {
  color: #f44336; /* Red color for errors */
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

/* Styles for notifications */
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  background-color: #fff;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: opacity 0.5s ease;
}

.notification.success {
  border-left: 5px solid #4caf50;
}

.notification.error {
  border-left: 5px solid #f44336;
}

.notification.info {
  border-left: 5px solid #2196f3;
}

/* Apply text color based on CSS variable */
.auth-container {
  color: var(--text-color);
}

/* Ensure child elements inherit the text color */
.auth-container h1,
.auth-container h2,
.auth-container h3,
.auth-container p,
.auth-container a {
  color: var(--text-color);
}

/* Style links for better visibility */
.auth-container a {
  color: var(--text-color);
  text-decoration: underline;
}

.auth-container a:hover {
  opacity: 0.8;
}

/* Ensure the spinner appears correctly inside the button */
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ensure buttons have consistent width and padding */
.auth-main .auth-panel .btn {
  width: 100%;
  padding: 12px; /* Matches .auth-input */
  border: none;
  border-radius: 8px;
  color: #000; /* Set text color to black for contrast */
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  animation: changeButtonColor 30s infinite;
  /* Remove any default margin */
  margin: 0;
}

/* Button Styles */
.btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: var(--primary-color, #0078d4);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-main .auth-panel .btn:hover {
  /* Remove background-color hover effect, as background is animated */
  background-color: var(--event-hover-color, #005c9c);
  transform: translateY(-2px);
}

/* Button Background Color Animation */
@keyframes changeButtonColor {
  0% { background-color: #a1c4fd; }    /* Light Blue */
  20% { background-color: #c2e9fb; }   /* Lighter Blue */
  40% { background-color: #a1c4fd; }   /* Light Blue */
  60% { background-color: #c2e9fb; }   /* Lighter Blue */
  80% { background-color: #a1c4fd; }   /* Light Blue */
  100% { background-color: #c2e9fb; }  /* Lighter Blue */
}

/* Error Messages */
.auth-main .auth-panel .error {
  color: #ff6b6b;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 500;
}

/* Footer Styles */
.auth-footer {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
  color: var(--footer-text-color);
}

/* Responsive Design */
@media (max-width: 768px) {
  .logo {
    width: 150px;
  }
  .auth-main {
    flex-direction: column;
    gap: 30px;
    padding: 20px;
  }

  .auth-main .auth-panel {
    width: 90%;
    padding: 25px 30px;
  }

  .auth-header {
    padding: 15px 20px;
  }

  .auth-header .app-name {
    font-size: 2rem;
  }

  .auth-intro .slogan {
    font-size: 1.8rem;
  }

  .auth-intro .description {
    font-size: 1rem;
  }

  /* Adjust logo size on mobile */
  .auth-intro .logo {
    width: 80px; /* Smaller size on mobile */
  }
}

/* Focus Styles for Accessibility */
.auth-input:focus, .btn:focus {
  box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.5);
}

/* Dynamic Text Color Animations */
@keyframes changeTextColor {
  0% { color: var(--dynamic-color-1); }
  16% { color: var(--dynamic-color-2); }
  33% { color: var(--dynamic-color-3); }
  50% { color: var(--dynamic-color-4); }
  66% { color: var(--dynamic-color-5); }
  83% { color: var(--dynamic-color-6); }
  100% { color: var(--dynamic-color-7); }
}

.auth-header .app-name, .auth-intro .slogan, .auth-main .auth-panel h3 {
  animation: changeTextColor 30s infinite;
}

.google-signin-wrapper {
  margin: 40px auto 20px auto !important; /* Force auto left/right */
  width: fit-content;                     /* Let content define width */
  display: flex;                          /* So we can flex-align the button itself */
  justify-content: center;
  align-items: center;
  background: var(--primary-color, #0078d4);
  border-radius: 8px;
  padding: 20px;
}

.auth-panel form > .btn + .google-signin-wrapper {
  margin-top: 2rem;
}
</style>
