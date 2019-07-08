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
  // 生命周期函数
  created () {
    // 配置响应拦截器：因为需要操作Vue对象$message成员，所以拦截器要放在Vue内部
    axios.interceptors.response.use(response => {
      // 实现请求返回的后续处理:
      // response：是axios请求从服务器端返回的结果——>await修饰的返回结果
      // response是一个对象：config、data、header、request、status、statusText
      // console.log(response)

      // 判断请求失败（判断当状态码不等于200(获取、修改、删除)/201(添加)）
      if (response.data.meta.status !== 200 && response.data.meta.status !== 201) {
        console.log(this) // this指向问题，需要设置箭头函数来指向Vue实例
        return this.$message.error(response.data.meta.msg)
      }

      return response
    }, function (error) {
      return Promise.reject(error)
    })
  },
  router,
  render: h => h(App)
}).$mount('#app')
