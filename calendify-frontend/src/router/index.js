// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import AuthLanding from '@/views/AuthLanding.vue';
import Dashboard from '@/views/DashboardView.vue'; // Assume you have a Dashboard component

const routes = [
    {
        path: '/',
        name: 'AuthLanding',
        component: AuthLanding,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.isAuthenticated) {
            next({ name: 'AuthLanding' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
