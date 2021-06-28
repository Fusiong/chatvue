import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import store from './store/store.js'
import axios from 'axios'

Vue.prototype.$axios=axios
Vue.prototype.$http=axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
