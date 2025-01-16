<!-- src/components/ConfirmationModal.vue -->
<template>
  <div
      v-if="visible"
      class="modal-backdrop"
      @click.self="handleCancel"
      aria-modal="true"
      role="dialog"
  >
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="modal-buttons">
        <button
            ref="confirmButton"
            class="btn-submit"
            @click="handleConfirm"
            aria-label="Confirm"
            :disabled="isLoading"
        >
          <span v-if="isLoading">
            <i class="spinner"></i> Deleting...
          </span>
          <span v-else>{{ confirmText }}</span>
        </button>
        <button
            class="btn-cancel"
            @click="handleCancel"
            aria-label="Cancel"
            :disabled="isLoading"
        >
          {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
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
    isLoading: { // New prop
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'cancel'],
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        this.$nextTick(() => {
          this.$refs.confirmButton.focus();
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
    // Ensure that scrolling is enabled when component is destroyed
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
/* Spinner Styles */
.spinner {
  border: 3px solid #f3f3f3; /* Light gray */
  border-top: 3px solid #0078d4; /* Primary color */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}

/* Spin Animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Existing modal styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
}

.modal-content {
  background-color: #fff;
  width: 400px;
  max-width: 90%;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-submit {
  background-color: #0078d4; /* Primary color */
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover:enabled {
  background-color: #005c9c;
}

.btn-submit:disabled {
  background-color: #a0c4e3;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6c757d; /* Gray */
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel:hover:enabled {
  background-color: #5a6268;
}

.btn-cancel:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
}
</style>
