import Vue from 'vue';
import app from './app.vue';
import router from './router/router';
import store from './store';
import 'babel-polyfill';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    render: (h) => h(app)
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
})
