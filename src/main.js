import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './css/common.css'
import router from './router'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false
Vue.use(ElementUI)
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
  config.headers = { authorization: localStorage.getItem('token') }
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  response = response.data
  const { meta } = response
  if (meta.status === 401) {
    meta.msg = 'the token has expired'
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
Vue.prototype.$axios = axios

Vue.filter('format', function (val) {
  return moment(val * 1000).format('YYYY-MM-DD hh:mm:ss')
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
