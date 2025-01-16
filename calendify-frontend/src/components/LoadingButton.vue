<!-- src/components/LoadingButton.vue -->
<template>
  <button
      :class="buttonClass"
      :style="buttonStyle"
      :disabled="isLoading || disabled"
      @click="$emit('click')"
      :aria-label="ariaLabel"
      aria-busy="isLoading"
      role="button"
  >
    <span v-if="isLoading">
      <i class="spinner"></i> {{ loadingText }}
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: 'Loading...',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: String,
      default: '',
    },
    buttonStyle: {
      type: Object,
      default: () => ({}),
    },
    ariaLabel: {
      type: String,
      default: 'Button',
    },
  },
};
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3; /* Light gray */
  border-top: 3px solid #fff; /* White or adjust based on button background */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
