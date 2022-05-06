import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import "vuetify/dist/vuetify.min.css";
import router from "./router";
import Axios from 'axios';

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
Vue.prototype.$baseURL = 'http://192.168.155.2:8000/'
Vue.prototype.$api = 'http://192.168.155.2:8000/api'

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#app')
