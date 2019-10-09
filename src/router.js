import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/intro',
            name: 'intro',
            component: () => import( './views/Intro.vue')
        },
        {
            path: '/forum',
            name: 'forum',
            component: () => import( './views/Forum.vue')
        },
        {
            path: '/tutorial',
            name: 'tutorial',
            component: () => import( './views/Tutorial.vue')
        },
        {
            path: '/pages/:ypId',
            name: 'page',
            props: true,
            component: () => import( './views/Page.vue')
        },
        {
            path: '/fpage/:yfpId',
            name: 'fpage',
            props: true,
            component: () => import( './views/Fpage.vue')
        },
        {
            path: '/github_callback',
            name: 'githubCallback',
            props: true,
            component: () => import( './views/GithubCallback.vue')
        },
        {
            path: '/demo',
            name: 'modal',
            component: () => import( './components/Modal.vue')
        },
        {
            path: '/under_maintenance',
            name: 'under_maintenance',
            component: () => import( './views/UnderMaintenance.vue')
        },
        {
            path: '/ostecAuth',
            name: 'ostecAuth',
            component: () => import( './views/OstecAuth.vue')
        },
        {
            path: '*',
            name: 'not_found',
            component: () => import( './views/NotFound.vue')
        }
    ]
});
