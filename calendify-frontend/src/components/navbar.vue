<!-- src/components/Navbar.vue -->
<template>
  <nav class="app-navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/">
          <img 
            :src="require('@/assets/icons/logo-light.png')" 
            alt="Calendify"
            class="brand-logo"
          />
          <span class="brand-name">Calendify</span>
        </router-link>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="active">
          <i class="nav-icon home-icon"></i>
          <span>Home</span>
        </router-link>
        
        <router-link v-if="isAuthenticated" to="/dashboard" class="nav-link" active-class="active">
          <i class="nav-icon calendar-icon"></i>
          <span>Dashboard</span>
        </router-link>
        
        <router-link to="/contact" class="nav-link" active-class="active">
          <i class="nav-icon contact-icon"></i>
          <span>Contact</span>
        </router-link>
      </div>
      
      <div class="nav-actions">
        <template v-if="isAuthenticated">
          <button @click="handleLogout" class="logout-btn">
            <i class="logout-icon"></i>
            <span>Logout</span>
          </button>
        </template>
        <template v-else>
          <router-link to="/" class="login-btn">
            <i class="login-icon"></i>
            <span>Login</span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AppNavbar',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout() {
      this.logout();
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.app-navbar {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 700;
}

.brand-logo {
  height: 28px;
  margin-right: 0.75rem;
}

.brand-name {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 1.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover, .nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.nav-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.home-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'%3E%3C/path%3E%3C/svg%3E");
}

.calendar-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.contact-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E");
}

.nav-actions {
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.logout-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: white;
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.login-btn:hover {
  background-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.login-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234361ee'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-container {
    flex-wrap: wrap;
  }
  
  .nav-links {
    order: 3;
    width: 100%;
    margin-top: 0.75rem;
    justify-content: space-between;
  }
  
  .brand-name {
    font-size: 1.125rem;
  }
}

@media (max-width: 576px) {
  .nav-link span, 
  .logout-btn span,
  .login-btn span {
    display: none;
  }
  
  .nav-link, 
  .logout-btn,
  .login-btn {
    padding: 0.5rem;
  }
  
  .nav-icon, 
  .logout-icon,
  .login-icon {
    margin: 0;
  }
}
</style>