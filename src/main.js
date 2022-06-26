import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import "vuetify/dist/vuetify.min.css";
import router from "./router";
import Axios from 'axios';

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
Vue.prototype.$baseURL = 'https://ajr.yohanhw.site/api/public/'
Vue.prototype.$api = 'https://ajr.yohanhw.site/api/api'

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#app')
