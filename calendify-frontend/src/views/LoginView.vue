<!--&lt;!&ndash; src/views/LoginView.vue &ndash;&gt;-->
<!--<template>-->
<!--  <div class="login">-->
<!--    <h2>Login</h2>-->
<!--    <form @submit.prevent="handleLogin">-->
<!--      <div>-->
<!--        <label>Username:</label>-->
<!--        <input type="text" v-model="username" required />-->
<!--      </div>-->
<!--      <div>-->
<!--        <label>Password:</label>-->
<!--        <input type="password" v-model="password" required />-->
<!--      </div>-->
<!--      <button type="submit">Login</button>-->
<!--    </form>-->
<!--    <p v-if="error" class="error">{{ error }}</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapActions } from 'vuex';-->

<!--export default {-->
<!--  name: 'LoginView',-->
<!--  data() {-->
<!--    return {-->
<!--      username: '',-->
<!--      password: '',-->
<!--      error: null,-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions(['login']),-->
<!--    async handleLogin() {-->
<!--      try {-->
<!--        await this.login({ username: this.username, password: this.password });-->
<!--        this.$router.push('/dashboard');-->
<!--      } catch (err) {-->
<!--        this.error = err?.response?.data?.error || 'Login failed. Please try again.';-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.login {-->
<!--  max-width: 400px;-->
<!--  margin: 50px auto;-->
<!--  padding: 20px;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 5px;-->
<!--}-->
<!--.error {-->
<!--  color: red;-->
<!--  margin-top: 10px;-->
<!--}-->
<!--</style>-->
