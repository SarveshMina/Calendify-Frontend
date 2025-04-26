<!-- src/components/SpinnerLoader.vue -->
<template>
  <div class="spinner-container" :class="{ small: size === 'small' }">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'SpinnerLoader',
  props: {
    size: {
      type: String,
      default: 'normal',
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    }
  }
}
</script>

<style scoped>
.spinner-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

.spinner-container.small .spinner {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
}

@keyframes spin {
  to { 
    transform: rotate(360deg); 
  }
}
</style>