import {createRouter, createWebHistory} from 'vue-router'
import JiraTrackingSummary from "../components/JiraTrackingSummary.vue";
import ProfilePage from "../components/ProfilePage.vue";
import {isAuthenticated} from "../services/auth/AuthService.js";
import AuthLayout from "../components/layouts/AuthLayout.vue";
import MainLayout from "../components/layouts/MainLayout.vue";

const routes = [
    {
        path: '/',
        component: MainLayout,
        redirect: () => {
            if (isAuthenticated()) {
                return {name: 'summary'};
            } else {
                return {name: 'auth'};
            }
        },
        children: [
            {
                path: 'summary',
                name: 'summary',
                component: JiraTrackingSummary
            },
            {
                path: 'profile',
                name: 'profile',
                component: ProfilePage
            },
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        name: 'auth',
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('../components/layouts/NotFound.vue')
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const publicPages = ['auth'];
    const authRequired = !publicPages.includes(to.name);
    const loggedIn = isAuthenticated();

    router.previousRoute = from;

    if (authRequired && !loggedIn) {
        next({name: 'auth'});
    } else if (loggedIn && to.name === 'auth') {
        next({name: 'summary'});
    } else {
        next();
    }
});

export default router
