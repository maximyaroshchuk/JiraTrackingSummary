import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/javascript',
        name: 'javascript',
        children: [
            {
                path: 'string',
                name: 'javascriptstring',
                component: () => import(/* webpackChunkName: "string" */ '../views/javascript/StringComponent.vue')
            },
            {
                path: 'object',
                name: 'javascriptobject',
                component: () => import(/* webpackChunkName: "object" */ '../views/javascript/object/ObjectView.vue')
            },
            {
                path: 'json',
                name: 'javascriptjson',
                component: () => import(/* webpackChunkName: "json" */ '../views/javascript/json/JsonView.vue')
            },
            {
                path: 'mutation',
                name: 'javascriptmutation',
                component: () => import(/* webpackChunkName: "mutation" */ '../views/javascript/mutation/MutationView.vue')
            },
            {
                path: 'functions',
                name: 'javascriptfunctions',
                component: () => import(/* webpackChunkName: "functions" */ '../views/javascript/functions/FunctionsView.vue')
            },
            {
                path: 'scope',
                name: 'javascriptscope', 
                component: () => import(/* webpackChunkName: "scope" */ '../views/javascript/scope/ScopeView.vue')
            },
            {
                path: 'operators',
                name: 'javascriptoperators',
                component: () => import(/* webpackChunkName: "operators" */ '../views/javascript/operators/OperatorsView.vue')
            },
            {
                path: 'arrays',
                name: 'javascriptarrays', 
                component: () => import(/* webpackChunkName: "arrays" */ '../views/javascript/arrays/ArraysView.vue')
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/AboutView.vue')
    },
    {
        path: '/security',
        name: 'security',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/SecurityPage.vue')
    },
    {
        path: '/privacy',
        name: 'privacy',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/PrivacyPageStub.vue')
    },
    {
        path: '/terms',
        name: 'terms',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/TermsPageStub.vue')
    },
    {
        path: '/contact',
        name: 'contact',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/ContactUsPage.vue')
    },
    {
        path: '/api-docs',
        name: 'apidocs',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/footer/ApiDocPage.vue')
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
