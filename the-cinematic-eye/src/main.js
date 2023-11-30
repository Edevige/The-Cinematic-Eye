import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { createStore } from 'vuex';

const store = createStore({
    state:{
        nav: true
    },
    mutations:{
        navInv(state){
            state.nav=!state.nav;
        }
    }
});
createApp(App).use(router).use(store).mount('#app');
