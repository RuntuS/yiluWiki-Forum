import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import hljs from 'hljs';

Vue.prototype.$request = request;

request.interceptors.request.use((config) => {
    store.dispatch('startLoading');
    return config;
}, (err) => {
    store.commit('finishLoading');
    return Promise.reject(err);
});

request.interceptors.response.use((res) => {
    store.commit('finishLoading');
    return res;
}, (err) => {
    store.commit('finishLoading');
    return Promise.reject(err);
}
);

Vue.prototype.dateTrans = function (oDate) {
    const date = new Date(oDate);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
};

Vue.config.productionTip = false;

Vue.directive('highlight', (el) => {
    const blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block);
    });
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
