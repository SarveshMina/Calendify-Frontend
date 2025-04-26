<!-- src/views/AuthLanding.vue -->
<template>
  <div class="auth-container" @mousemove="handleMouseMove">
    <!-- Background elements -->
    <div class="background-animation"></div>
    <div class="overlay"></div>

    <!-- Header with app name and dark mode toggle -->
    <header class="auth-header">
      <h1 class="app-name">Calendify</h1>
      <button @click="toggleDarkMode" class="toggle-container" aria-label="Toggle Dark Mode">
        <img :src="darkMode ? moonIcon : sunIcon" alt="Dark Mode Toggle" class="toggle-icon" />
      </button>
    </header>

    <!-- Introduction section -->
    <section class="auth-intro">
      <div class="logo-container">
        <img :src="currentLogo" alt="Calendify Logo" class="logo" />
      </div>
      <h2 class="slogan">Organize Your Life Seamlessly</h2>
      <p class="description">
        Calendify is your ultimate shared calendar solution, enabling you to schedule, collaborate,
        and stay on top of your events effortlessly.
      </p>
    </section>

    <!-- Authentication forms -->
    <main class="auth-main">
      <!-- Login Panel -->
      <div v-if="currentView === 'login'" class="auth-panel login-panel">
        <h3>Welcome Back</h3>
        <form @submit.prevent="doLogin">
          <div class="form-group">
            <input
              v-model="loginUsername"
              type="text"
              placeholder="Username"
              required
              class="auth-input"
              aria-label="Username"
            />
          </div>
          
          <div class="form-group password-group">
            <input
              :type="showLoginPassword ? 'text' : 'password'"
              v-model="loginPassword"
              placeholder="Password"
              required
              class="auth-input"
              aria-label="Password"
            />
            <img
              :src="showLoginPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle Password Visibility"
              class="toggle-password"
              @click="toggleLoginPassword"
              role="button"
              tabindex="0"
              aria-label="Toggle Password Visibility"
            />
          </div>
          
          <p v-if="loginError" class="error" role="alert">{{ loginError }}</p>
          
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loginLoading"
          >
            <span v-if="loginLoading" class="button-content">
              <SpinnerLoader /> Signing in...
            </span>
            <span v-else>Sign In</span>
          </button>
          
          <div class="google-signin-wrapper">
            <div id="google-button-login"></div>
          </div>
        </form>
        
        <p class="switch-link">
          Don't have an account? <a href="#" @click.prevent="switchView('register')">Create account</a>
        </p>
        <p class="switch-link">
          <a href="#" @click.prevent="switchView('forgotPassword')">Forgot password?</a>
        </p>
      </div>

      <!-- Register Panel -->
      <div v-else-if="currentView === 'register'" class="auth-panel register-panel">
        <h3>Create Account</h3>
        <form @submit.prevent="doRegister">
          <div class="form-group">
            <input
              v-model="registerUsername"
              type="text"
              placeholder="Username"
              required
              class="auth-input"
              aria-label="Username"
            />
          </div>

          <div class="form-group">
            <input
              v-model="registerEmail"
              type="email"
              placeholder="Email"
              required
              class="auth-input"
              aria-label="Email"
            />
          </div>

          <div class="form-group password-group">
            <input
              :type="showRegisterPassword ? 'text' : 'password'"
              v-model="registerPassword"
              placeholder="Password"
              required
              class="auth-input"
              aria-label="Password"
            />
            <img
              :src="showRegisterPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle Password Visibility"
              class="toggle-password"
              @click="toggleRegisterPassword"
              role="button"
              tabindex="0"
              aria-label="Toggle Password Visibility"
            />
          </div>

          <div class="form-group password-group">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="Confirm Password"
              required
              class="auth-input"
              aria-label="Confirm Password"
            />
            <img
              :src="showConfirmPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle Confirm Password Visibility"
              class="toggle-password"
              @click="toggleConfirmPassword"
              role="button"
              tabindex="0"
              aria-label="Toggle Confirm Password Visibility"
            />
          </div>

          <p v-if="registerError" class="error" role="alert">{{ registerError }}</p>
          
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="registerLoading"
          >
            <span v-if="registerLoading" class="button-content">
              <SpinnerLoader /> Creating account...
            </span>
            <span v-else>Create Account</span>
          </button>

          <div class="google-signin-wrapper">
            <div id="google-button-register"></div>
          </div>
        </form>
        
        <p class="switch-link">
          Already have an account? <a href="#" @click.prevent="switchView('login')">Sign in</a>
        </p>
      </div>

      <!-- Forgot Password Panel -->
      <div v-else-if="currentView === 'forgotPassword'" class="auth-panel forgot-password-panel">
        <h3>Reset Password</h3>
        <form @submit.prevent="requestResetPassword">
          <div class="form-group">
            <input
              v-model="forgotEmail"
              type="email"
              placeholder="Your Email Address"
              required
              class="auth-input"
              aria-label="Email"
            />
          </div>

          <p v-if="forgotPasswordError" class="error" role="alert">{{ forgotPasswordError }}</p>
          <p v-if="forgotPasswordMessage" class="success" role="status">{{ forgotPasswordMessage }}</p>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="forgotPasswordLoading"
          >
            <span v-if="forgotPasswordLoading" class="button-content">
              <SpinnerLoader /> Sending verification code...
            </span>
            <span v-else>Send Verification Code</span>
          </button>
        </form>
        
        <p class="switch-link">
          Remember your password? <a href="#" @click.prevent="switchView('login')">Sign in</a>
        </p>
      </div>

      <!-- Reset Password Panel -->
      <div v-else-if="currentView === 'resetPassword'" class="auth-panel reset-password-panel">
        <h3>Create New Password</h3>
        <form @submit.prevent="performResetPassword">
          <div class="form-group">
            <input
              v-model="resetEmail"
              type="email"
              placeholder="Your Email Address"
              required
              class="auth-input"
              aria-label="Email"
            />
          </div>

          <div class="form-group">
            <input
              v-model="resetOTP"
              type="text"
              placeholder="Verification Code"
              required
              class="auth-input"
              aria-label="Verification Code"
              maxlength="6"
            />
          </div>

          <div class="form-group password-group">
            <input
              :type="showResetPassword ? 'text' : 'password'"
              v-model="resetPasswordInput"
              placeholder="New Password"
              required
              class="auth-input"
              aria-label="New Password"
            />
            <img
              :src="showResetPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle Password Visibility"
              class="toggle-password"
              @click="toggleResetPassword"
              role="button"
              tabindex="0"
              aria-label="Toggle Password Visibility"
            />
          </div>

          <div class="form-group password-group">
            <input
              :type="showConfirmResetPassword ? 'text' : 'password'"
              v-model="confirmResetPassword"
              placeholder="Confirm New Password"
              required
              class="auth-input"
              aria-label="Confirm New Password"
            />
            <img
              :src="showConfirmResetPassword ? eyeOffIcon : eyeIcon"
              alt="Toggle Confirm Password Visibility"
              class="toggle-password"
              @click="toggleConfirmResetPassword"
              role="button"
              tabindex="0"
              aria-label="Toggle Confirm Password Visibility"
            />
          </div>

          <p v-if="resetPasswordError" class="error" role="alert">{{ resetPasswordError }}</p>
          <p v-if="resetPasswordMessage" class="success" role="status">{{ resetPasswordMessage }}</p>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="resetPasswordLoading"
          >
            <span v-if="resetPasswordLoading" class="button-content">
              <SpinnerLoader /> Resetting password...
            </span>
            <span v-else>Reset Password</span>
          </button>
        </form>
        
        <p class="switch-link">
          Need a new verification code? <a href="#" @click.prevent="switchView('forgotPassword')">Request Code</a>
        </p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="auth-footer">
      <p>&copy; 2025 Calendify. All rights reserved.</p>
    </footer>

    <!-- Notifications -->
    <div class="notifications" aria-live="polite">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
        role="alert"
      >
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SpinnerLoader from '@/components/SpinnerLoader.vue';

export default {
  name: 'AuthLanding',
  components: {
    SpinnerLoader,
  },
  data() {
    return {
      // Current view state
      currentView: 'login',

      // Login data
      loginUsername: '',
      loginPassword: '',
      loginError: null,
      showLoginPassword: false,
      loginLoading: false,

      // Register data
      registerUsername: '',
      registerEmail: '',
      registerPassword: '',
      confirmPassword: '',
      registerError: null,
      showRegisterPassword: false,
      showConfirmPassword: false,
      registerLoading: false,

      // Forgot Password data
      forgotEmail: '',
      forgotPasswordError: null,
      forgotPasswordMessage: null,
      forgotPasswordLoading: false,

      // Reset Password data
      resetEmail: '',
      resetOTP: '',
      resetPasswordInput: '',
      confirmResetPassword: '',
      resetPasswordError: null,
      resetPasswordMessage: null,
      showResetPassword: false,
      showConfirmResetPassword: false,
      resetPasswordLoading: false,

      // Dark mode and icons
      darkMode: localStorage.getItem('darkMode') === 'true',
      moonIcon: require('@/assets/icons/moon.svg'),
      sunIcon: require('@/assets/icons/sun.svg'),
      eyeIcon: require('@/assets/icons/eye.png'),
      eyeOffIcon: require('@/assets/icons/eye-off.png'),
      
      // Logo assets
      lightLogo: require('@/assets/icons/logo-light.png'),
      darkLogo: require('@/assets/icons/logo-dark.png'),
    };
  },
  
  computed: {
    ...mapGetters(['notifications']),
    
    // Dynamic logo based on dark mode
    currentLogo() {
      return this.darkMode ? this.lightLogo : this.darkLogo;
    },
  },

  watch: {
    currentView(newVal) {
      if (newVal === 'login' || newVal === 'register') {
        this.$nextTick(() => {
          this.renderGoogleButton();
        });
      }
    }
  },

  methods: {
    ...mapActions(['login', 'register', 'forgotPassword', 'resetPassword', 'notify', 'googleSignIn']),

    // UI State Management
    switchView(view) {
      // Prevent switching if any operation is in progress
      if (
        this.loginLoading ||
        this.registerLoading ||
        this.forgotPasswordLoading ||
        this.resetPasswordLoading
      ) {
        this.notify({
          type: 'info',
          message: 'Please wait for the current operation to complete.',
        });
        return;
      }

      const validViews = ['login', 'register', 'forgotPassword', 'resetPassword'];
      if (!validViews.includes(view)) {
        this.notify({
          type: 'error',
          message: 'Invalid view requested.',
        });
        return;
      }

      this.currentView = view;
      this.clearMessages();

      // Pre-fill email in reset flow
      if (view === 'resetPassword' && this.forgotEmail) {
        this.resetEmail = this.forgotEmail;
      }
    },

    clearMessages() {
      this.loginError = null;
      this.registerError = null;
      this.forgotPasswordError = null;
      this.forgotPasswordMessage = null;
      this.resetPasswordError = null;
      this.resetPasswordMessage = null;
    },

    // Google Sign In
    handleGoogleLogin(response) {
      if (response && response.credential) {
        this.handleGoogleIDToken(response.credential);
      }
    },

    async handleGoogleIDToken(idToken) {
      try {
        await this.googleSignIn(idToken);
        this.$router.push('/dashboard');
      } catch (err) {
        console.error('Google sign-in error:', err);
        this.notify({
          type: 'error',
          message: 'Google sign-in failed. Please try again.',
        });
      }
    },

    renderGoogleButton() {
  if (!window.google?.accounts?.id) {
    console.log('Google Identity Services not loaded yet');
    return;
  }

  // Initialize Google Identity Services
  window.google.accounts.id.initialize({
    client_id: '254139626237-l4klntpne4skrjof2401ecr4l6tv275s.apps.googleusercontent.com',
    callback: this.handleGoogleLogin,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  // Determine which container to use based on current view
  const containerId = this.currentView === 'login' 
    ? 'google-button-login' 
    : 'google-button-register';
    
  const container = document.getElementById(containerId);
  if (container) {
    // Clear any existing content
    container.innerHTML = '';
    
    // Render the Google Sign In button with improved styling
    window.google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: this.darkMode ? 'outline' : 'filled_blue', // Use outline theme in dark mode
      size: 'large',
      shape: 'pill',
      text: 'continue_with', // 'continue_with' instead of 'signin_with'
      logo_alignment: 'center',
      width: '100%', // Use percentage for better responsiveness
    });
    
    // Make the button more visible by adding a custom class to its parent
    setTimeout(() => {
      const iframe = container.querySelector('iframe');
      if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const googleButton = iframeDocument.querySelector('div[role="button"]');
        if (googleButton) {
          googleButton.style.width = '100%';
          googleButton.style.maxWidth = '280px';
          googleButton.style.margin = '0 auto';
        }
      }
    }, 100);
  }

  // Disable One Tap to only show the button
  window.google.accounts.id.cancel();
},

    // Authentication Actions
    async doLogin() {
      this.loginLoading = true;
      this.loginError = null;
      
      try {
        await this.login({
          username: this.loginUsername,
          password: this.loginPassword,
        });
        this.$router.push('/dashboard');
      } catch (err) {
        this.loginError = err?.response?.data?.error || 'Login failed. Please check your credentials.';
      } finally {
        this.loginLoading = false;
      }
    },

    async doRegister() {
      if (this.registerPassword !== this.confirmPassword) {
        this.registerError = 'Passwords do not match.';
        return;
      }
      
      this.registerLoading = true;
      this.registerError = null;
      
      try {
        await this.register({
          username: this.registerUsername,
          password: this.registerPassword,
          email: this.registerEmail,
        });
        this.$router.push('/dashboard');
      } catch (err) {
        this.registerError = err?.response?.data?.error || 'Registration failed. Please try again.';
      } finally {
        this.registerLoading = false;
      }
    },

    async requestResetPassword() {
      this.forgotPasswordLoading = true;
      this.forgotPasswordError = null;
      this.forgotPasswordMessage = null;
      
      try {
        const response = await this.forgotPassword(this.forgotEmail);
        this.forgotPasswordMessage = response.data.message || 'Verification code sent to your email.';
        this.resetEmail = this.forgotEmail;
        
        // Switch to reset password view after brief delay
        setTimeout(() => {
          this.switchView('resetPassword');
        }, 1500);
        
      } catch (err) {
        this.forgotPasswordError = err?.response?.data?.error || 'Failed to send verification code. Please try again.';
      } finally {
        this.forgotPasswordLoading = false;
      }
    },

    async performResetPassword() {
      if (this.resetPasswordInput !== this.confirmResetPassword) {
        this.resetPasswordError = 'Passwords do not match.';
        return;
      }
      
      this.resetPasswordLoading = true;
      this.resetPasswordError = null;
      this.resetPasswordMessage = null;
      
      try {
        const response = await this.resetPassword({
          email: this.resetEmail,
          otp: this.resetOTP,
          newPassword: this.resetPasswordInput,
        });
        
        this.resetPasswordMessage = response.data.message || 'Password reset successful.';
        
        // Redirect to login after success
        setTimeout(() => {
          this.switchView('login');
          this.resetEmail = '';
          this.resetOTP = '';
          this.resetPasswordInput = '';
          this.confirmResetPassword = '';
        }, 2000);
        
      } catch (err) {
        this.resetPasswordError = err?.response?.data?.error || 'Failed to reset password. Please verify your information.';
      } finally {
        this.resetPasswordLoading = false;
      }
    },

    // UI Toggles
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
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
    
    toggleResetPassword() {
      this.showResetPassword = !this.showResetPassword;
    },
    
    toggleConfirmResetPassword() {
      this.showConfirmResetPassword = !this.showConfirmResetPassword;
    },

    // Background Effects
    handleMouseMove(event) {
      const { clientX, clientY } = event;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate angle based on mouse position
      const xPercent = clientX / windowWidth;
      const yPercent = clientY / windowHeight;
      
      // Create dynamic angle based on mouse position
      const angle = 135 + (xPercent - 0.5) * 30 + (yPercent - 0.5) * 30;
      
      // Set CSS variable with a throttled update
      if (!this.throttleTimeout) {
        this.throttleTimeout = setTimeout(() => {
          this.$el.style.setProperty('--gradient-angle', `${angle}deg`);
          this.throttleTimeout = null;
        }, 50);
      }
    }
  },
  
  mounted() {
    // Apply dark mode
    document.body.classList.toggle('dark-mode', this.darkMode);
    
    // Watch for Google API availability
    const waitForGoogle = () => {
      if (window.googleScriptLoaded && window.google?.accounts?.id) {
        this.renderGoogleButton();
      } else {
        requestAnimationFrame(waitForGoogle);
      }
    };
    
    if (window.google?.accounts?.id) {
      this.renderGoogleButton();
    } else {
      waitForGoogle();
    }
  },
  
  beforeUnmount() {
    // Clear any pending timeouts
    if (this.throttleTimeout) {
      clearTimeout(this.throttleTimeout);
    }
  }
};
</script>

<style src="@/assets/styles/auth.css" scoped></style>