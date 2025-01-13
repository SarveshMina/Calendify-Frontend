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
        >
          {{ confirmText }}
        </button>
        <button
            class="btn-cancel"
            @click="handleCancel"
            aria-label="Cancel"
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
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
    },
  },
  beforeUnmount() {
    // Ensure that scrolling is enabled when component is destroyed
    document.body.style.overflow = '';
  },
};
</script>

<style scoped>
/* No additional styles needed as we're using global styles */
</style>
