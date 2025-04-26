<!-- src/components/ConfirmationModal.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="modal-backdrop"
      @click.self="handleCancel"
      aria-modal="true"
      role="dialog"
    >
      <transition name="scale">
        <div class="modal-container" v-if="visible">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ title }}</h3>
              <button class="close-button" @click="handleCancel" aria-label="Close" :disabled="isLoading">
                &times;
              </button>
            </div>
            
            <div class="modal-body">
              <div class="modal-icon" :class="{ warning: isWarning, danger: isDanger }">
                <svg v-if="isWarning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <svg v-else-if="isDanger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <p>{{ message }}</p>
            </div>
            
            <div class="modal-footer">
              <button
                class="btn-cancel"
                @click="handleCancel"
                aria-label="Cancel"
                :disabled="isLoading"
              >
                {{ cancelText }}
              </button>
              
              <button
                ref="confirmButton"
                class="btn-confirm"
                :class="{ 'btn-danger': isDanger, 'btn-warning': isWarning }"
                @click="handleConfirm"
                aria-label="Confirm"
                :disabled="isLoading"
              >
                <div v-if="isLoading" class="loading-spinner"></div>
                <span>{{ confirmText }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmationModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Confirm Action',
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?',
    },
    confirmText: {
      type: String,
      default: 'Yes',
    },
    cancelText: {
      type: String,
      default: 'No',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'warning', 'danger'].includes(value)
    }
  },
  emits: ['confirm', 'cancel'],
  computed: {
    isWarning() {
      return this.type === 'warning';
    },
    isDanger() {
      return this.type === 'danger';
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.$nextTick(() => {
          this.$refs.confirmButton?.focus();
        });
      } else {
        document.body.style.overflow = '';
      }
    },
  },
  methods: {
    handleConfirm() {
      if (!this.isLoading) {
        this.$emit('confirm');
      }
    },
    handleCancel() {
      if (!this.isLoading) {
        this.$emit('cancel');
      }
    },
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 480px;
  margin: 1.5rem;
  perspective: 1000px;
}

/* Modal Content */
.modal-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transform-origin: center;
}

/* Dark Mode */
.dark-mode .modal-content {
  background-color: #1e293b;
  color: #f1f5f9;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark-mode .modal-header {
  border-bottom-color: #334155;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
}

.dark-mode .modal-header h3 {
  color: #f1f5f9;
}

.close-button {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f1f5f9;
  color: #64748b;
}

.dark-mode .close-button {
  color: #94a3b8;
}

.dark-mode .close-button:hover {
  background-color: #334155;
  color: #cbd5e1;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #e0f2fe;
  color: #0ea5e9;
}

.modal-icon.warning {
  background-color: #fef9c3;
  color: #ca8a04;
}

.modal-icon.danger {
  background-color: #fee2e2;
  color: #ef4444;
}

.dark-mode .modal-icon {
  background-color: #075985;
  color: #7dd3fc;
}

.dark-mode .modal-icon.warning {
  background-color: #713f12;
  color: #fde047;
}

.dark-mode .modal-icon.danger {
  background-color: #7f1d1d;
  color: #fca5a5;
}

.modal-icon svg {
  width: 2rem;
  height: 2rem;
}

.modal-body p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
}

.dark-mode .modal-body p {
  color: #cbd5e1;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem;
  gap: 0.75rem;
}

/* Buttons */
.btn-cancel, .btn-confirm {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
  color: #334155;
}

.dark-mode .btn-cancel {
  background-color: #334155;
  color: #cbd5e1;
  border-color: #475569;
}

.dark-mode .btn-cancel:hover {
  background-color: #475569;
  color: #f1f5f9;
}

.btn-confirm {
  background-color: #0ea5e9;
  color: white;
}

.btn-confirm:hover {
  background-color: #0284c7;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.dark-mode .btn-confirm {
  background-color: #0ea5e9;
}

.dark-mode .btn-confirm:hover {
  background-color: #0284c7;
}

.btn-confirm.btn-warning {
  background-color: #eab308;
}

.btn-confirm.btn-warning:hover {
  background-color: #ca8a04;
}

.btn-confirm.btn-danger {
  background-color: #ef4444;
}

.btn-confirm.btn-danger:hover {
  background-color: #dc2626;
}

.btn-cancel:disabled, .btn-confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loading Spinner */
.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-enter-active, .scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from, .scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    margin: 1rem;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .btn-cancel, .btn-confirm {
    width: 100%;
  }
}
</style>