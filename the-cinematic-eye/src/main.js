import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import store from './services/store';
import vue3GoogleLogin from 'vue3-google-login'

createApp(App).use(router).use(store).use(vue3GoogleLogin, {
    clientId: '599203859511-bf0n3k9qptlmd61n2butlap8s39gsrgb.apps.googleusercontent.com'
}).mount('#app');
