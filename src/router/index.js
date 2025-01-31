import {createRouter, createWebHistory} from 'vue-router'
import ConverterView from "@/views/ConverterView.vue";
import HomeView from "@/views/HomeView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/converter/:conversion',
        name: 'converter',
        component: ConverterView,
        beforeEnter: (to, from, next) => {
            const [fromFormat, toFormat] = to.params.conversion.split('-to-');
            if (!fromFormat || !toFormat) {
                next({name: 'notfound'});
            } else {
                next();
            }
        },
        props: (route) => {
            const [from, to] = route.params.conversion.split('-to-');
            return {
                from: from.toLowerCase(),
                to: to.toLowerCase(),
            };
        },
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/security',
        name: 'security',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/SecurityPage.vue')
    },
    {
        path: '/privacy',
        name: 'privacy',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/PrivacyPage.vue')
    },
    {
        path: '/terms',
        name: 'terms',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/TermsPage.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/ContactUsPage.vue')
    },
    {
        path: '/api-docs',
        name: 'apidocs',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/ApiDocPage.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('../components/layouts/NotFound.vue')
    },
    {
        path: '/not-found',
        name: 'notfoundpage',
        component: () => import('../components/layouts/NotFound.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
