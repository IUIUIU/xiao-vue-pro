import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局CSS样式控制文件
import './assets/css/global.css'
// 引入ElementUI组件库
import ElementUI from 'element-ui'

// 引入axios:
import axios from 'axios'
// 配置请求公共跟地址:
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 配置请求拦截器：
// console.dir(axios)
axios.interceptors.request.use(function (config) {
  // console.log(config)
  // 给axios配置携带token：token在axios请求头协议信息中需要通过Authorization字段提供token令牌
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function (error) {
  return Promise.reject(error)
})

Vue.prototype.$http = axios

// 注册ElementUI
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
