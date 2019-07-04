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
Vue.prototype.$http = axios

// 注册ElementUI
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
