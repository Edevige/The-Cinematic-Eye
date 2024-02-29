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
    clientId: '599203859511-5f3c2e9dkgg7qjplu44f4qa1i57t1kf9.apps.googleusercontent.com'
  }).mount('#app');
