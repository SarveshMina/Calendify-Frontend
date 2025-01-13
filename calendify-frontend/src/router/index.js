// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import store from '../store'; // Import Vuex store
// import HomeView from '../views/HomeView.vue';
// import LoginView from '../views/LoginView.vue';
// import RegisterView from '../views/RegisterView.vue';
import AuthLanding from '@/views/AuthLanding.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
    // {
    //     path: '/auth',
    //     name: 'Home',
    //     component: HomeView,
    // },
    {   path: '/',
        name: 'AuthLanding',
        component: AuthLanding
    },
    // {
    //     path: '/login',
    //     name: 'Login',
    //     component: LoginView,
    //     meta: { requiresGuest: true },
    // },
    // {
    //     path: '/register',
    //     name: 'Register',
    //     component: RegisterView,
    //     meta: { requiresGuest: true },
    // },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation Guards
router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.isAuthenticated;
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next('/login');
        } else {
            next();
        }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
        if (isAuthenticated) {
            next('/dashboard');
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
