import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/common.css'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
