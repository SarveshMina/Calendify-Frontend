<!-- src/components/Notification.vue -->
<template>
  <div class="notification-container" aria-live="assertive" aria-atomic="true">
    <transition-group name="fade" tag="div">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', notification.type]"
          role="alert"
      >
        <span>{{ notification.message }}</span>
        <button class="close-btn" @click="removeNotification(notification.id)" aria-label="Close Notification">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'NotificationPopUp',
  computed: {
    ...mapGetters(['notifications']),
  },
  methods: {
    ...mapMutations(['REMOVE_NOTIFICATION']),
    removeNotification(id) {
      this.REMOVE_NOTIFICATION(id);
    },
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000; /* Ensure it's above other elements */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Notification base styles */
.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  padding: 12px 16px;
  border-radius: 4px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

/* Notification types */
.notification.success {
  background-color: #28a745; /* Green */
}

.notification.error {
  background-color: #dc3545; /* Red */
}

.notification.info {
  background-color: #17a2b8; /* Blue */
}

.notification.warning {
  background-color: #ffc107; /* Yellow */
  color: #333;
}

/* Close button */
.close-btn {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 600px) {
  .notification-container {
    left: 20px;
    right: 20px;
    top: auto;
    bottom: 20px;
  }

  .notification {
    width: 100%;
    max-width: 400px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
