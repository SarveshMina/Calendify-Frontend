
<!-- src/components/SpinnerLoader.vue -->
<template>
  <span class="spinner"></span>
</template>

<script>
export default {
  name: 'SpinnerLoader',
};
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
