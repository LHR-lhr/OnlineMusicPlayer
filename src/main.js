import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './assets/css/font-awesome.css'

Vue.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
