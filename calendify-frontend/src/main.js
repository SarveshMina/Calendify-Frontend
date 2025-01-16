import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/styles/auth.css';
import '@/assets/styles/variables.css';
import '@/assets/styles/styles.css'; // Your existing global styles


createApp(App)
    .use(store)
    .use(router)
    .mount('#app');
