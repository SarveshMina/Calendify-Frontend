<!-- src/components/ConflictModal.vue -->
<template>
  <div
      v-if="visible"
      class="modal-backdrop"
      @click.self="handleClose"
      role="dialog"
  >
    <div class="modal-content">
      <h3>Conflict Detected</h3>
      <p>{{ message }}</p>

      <div class="modal-buttons">
        <!-- Only one button that closes the modal -->
        <button class="btn-cancel" @click="handleClose">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConflictModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    message: {
      type: String,
      default: 'There is a conflict.'
    }
  },
  emits: ['close'],
  methods: {
    handleClose() {
      // Just emit 'close' so the parent can set showConflictModal = false
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  /* Similar modal backdrop styling as your others */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1600;
}

.modal-content {
  background: #fff;
  width: 400px;
  max-width: 90%;
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Example styling for the single "OK" button */
.btn-cancel {
  background-color: #007bff;
  color: #fff;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-cancel:hover {
  background-color: #005cbf;
}
</style>
