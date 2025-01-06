<!--&lt;!&ndash; src/views/RegisterView.vue &ndash;&gt;-->
<!--<template>-->
<!--  <div class="register">-->
<!--    <h2>Register</h2>-->
<!--    <form @submit.prevent="handleRegister">-->
<!--      <div>-->
<!--        <label>Username:</label>-->
<!--        <input type="text" v-model="username" required />-->
<!--      </div>-->
<!--      <div>-->
<!--        <label>Password:</label>-->
<!--        <input type="password" v-model="password" required />-->
<!--      </div>-->
<!--      <button type="submit">Register</button>-->
<!--    </form>-->
<!--    <p v-if="error" class="error">{{ error }}</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapActions } from 'vuex';-->

<!--export default {-->
<!--  name: 'RegisterView',-->
<!--  data() {-->
<!--    return {-->
<!--      username: '',-->
<!--      password: '',-->
<!--      error: null,-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    ...mapActions(['register']),-->
<!--    async handleRegister() {-->
<!--      try {-->
<!--        await this.register({ username: this.username, password: this.password });-->
<!--        this.$router.push('/dashboard');-->
<!--      } catch (err) {-->
<!--        this.error = err?.response?.data?.error || 'Registration failed. Please try again.';-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.register {-->
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
