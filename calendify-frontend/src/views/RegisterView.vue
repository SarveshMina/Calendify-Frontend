<!-- src/views/RegisterView.vue -->
<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" type="text" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      try {
        await this.register({ username: this.username, password: this.password });
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err?.response?.data?.error || 'Registration failed. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.error {
  color: red;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 3px;
}

button:hover {
  background-color: #45a049;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}
</style>
