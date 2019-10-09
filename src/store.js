import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

let timer = null;

export default new Vuex.Store({
    state: {
        loading: {
            display: false,
            progress: 0
        }
    },
    mutations: {
        startLoading(state) {
            state.loading = {
                display: true,
                progress: 0
            };
        },
        finishLoading(state) {
            clearInterval(timer);
            state.loading.progress = 100;
            setTimeout(() => {
                if (100 < state.loading.progress)
                    return;
                state.loading = {
                    display: false,
                    progress: 0
                };
            }, 500);
        }
    },
    actions: {
        startLoading({state}) {
            clearInterval(timer);
            state.loading = {
                display: true,
                progress: 0
            };
            timer = setInterval(() => {
                state.loading.progress += 10;
                if (state.loading.progress >= 90) {
                    clearInterval(timer);
                }
            }, 200);
        }
    }
});
