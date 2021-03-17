import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './assets/css/font-awesome.css'
import Vuex from 'vuex'
import store from './store/store'

Vue.prototype.$axios = axios
// axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false
Vue.use(Vuex)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
