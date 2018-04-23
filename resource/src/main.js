import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import VueI18n from 'vue-i18n';

import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';


Vue.use(VueRouter);

Vue.use(VueI18n);

Vue.use(iView);

const i18n = new VueI18n({
    locale: 'en',  // 语言标识
    messages: {
        'zh': require('./language/zh.js'),
        'en': require('./language/en.js')
    }
});

// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});



new Vue({
    i18n,
    el: '#app',
    router: router,
    render: h => h(App)
});