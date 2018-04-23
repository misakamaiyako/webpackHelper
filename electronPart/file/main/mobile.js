import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import env from './config/env';

Vue.use(VueRouter);
Vue.use(Vuex);

const RouterConfig = {
    mode: {mode},
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    window.scrollTo(0, 0);
});

const store = new Vuex.Store({
    state: {

    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
});

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});



