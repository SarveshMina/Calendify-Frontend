<!-- src/components/ConflictModal.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="modal-backdrop"
      @click.self="handleClose"
      role="dialog"
      aria-modal="true"
    >
      <transition name="slide-up">
        <div class="modal-container" v-if="visible">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ title }}</h3>
              <button class="close-button" @click="handleClose" aria-label="Close">
                &times;
              </button>
            </div>
            
            <div class="modal-body">
              <div class="conflict-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              
              <div class="conflict-message">
                <p>{{ message }}</p>
              </div>
              
              <div v-if="showDetails && details" class="conflict-details">
                <div class="details-header" @click="detailsExpanded = !detailsExpanded">
                  <span>Details</span>
                  <svg 
                    class="details-icon" 
                    :class="{ 'expanded': detailsExpanded }" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <transition name="collapse">
                  <div v-if="detailsExpanded" class="details-content">
                    <p>{{ details }}</p>
                  </div>
                </transition>
              </div>
            </div>
            
            <div class="modal-footer">
              <button v-if="showCancelButton" class="btn-outline" @click="handleClose">
                {{ cancelButtonText }}
              </button>
              
              <button v-if="showContinueButton" class="btn-warning" @click="handleContinue">
                {{ continueButtonText }}
              </button>
              
              <button v-if="!showContinueButton && !showCancelButton" class="btn-primary" @click="handleClose">
                {{ okButtonText }}
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
  name: 'ConflictModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Scheduling Conflict'
    },
    message: {
      type: String,
      default: 'There is a conflict with your schedule.'
    },
    details: {
      type: String,
      default: ''
    },
    showDetails: {
      type: Boolean,
      default: true
    },
    showContinueButton: {
      type: Boolean,
      default: true
    },
    continueButtonText: {
      type: String,
      default: 'Schedule Anyway'
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    cancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    okButtonText: {
      type: String,
      default: 'OK'
    }
  },
  emits: ['close', 'continue'],
  data() {
    return {
      detailsExpanded: false
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.detailsExpanded = false;
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleContinue() {
      this.$emit('continue');
    }
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
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
  z-index: 1600;
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 480px;
  margin: 1.5rem;
}

/* Modal Content */
.modal-content {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
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
  color: #ea580c; /* Orange heading for conflict */
}

.dark-mode .modal-header h3 {
  color: #fb923c;
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

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.conflict-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #ffedd5;
  color: #ea580c;
}

.dark-mode .conflict-icon {
  background-color: #7c2d12;
  color: #fb923c;
}

.conflict-icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.conflict-message {
  text-align: center;
  margin-bottom: 1.5rem;
}

.conflict-message p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
}

.dark-mode .conflict-message p {
  color: #cbd5e1;
}

/* Conflict Details */
.conflict-details {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 0.5rem;
}

.dark-mode .conflict-details {
  border-color: #334155;
}

.details-header {
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
}

.dark-mode .details-header {
  background-color: #1e293b;
}

.details-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.2s ease;
}

.details-icon.expanded {
  transform: rotate(180deg);
}

.details-content {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e2e8f0;
}

.dark-mode .details-content {
  background-color: #0f172a;
  border-top-color: #334155;
}

.details-content p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #64748b;
}

.dark-mode .details-content p {
  color: #94a3b8;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.5rem;
  gap: 0.75rem;
}

/* Buttons */
.btn-outline, .btn-primary, .btn-warning {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
}

.btn-outline {
  background-color: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.dark-mode .btn-outline {
  color: #cbd5e1;
  border-color: #475569;
}

.dark-mode .btn-outline:hover {
  background-color: #334155;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.btn-warning {
  background-color: #ea580c;
  color: white;
}

.btn-warning:hover {
  background-color: #c2410c;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.collapse-enter-active, .collapse-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.collapse-enter-from, .collapse-leave-to {
  max-height: 0;
  opacity: 0;
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
  
  .btn-outline, .btn-primary, .btn-warning {
    width: 100%;
  }
}
</style>