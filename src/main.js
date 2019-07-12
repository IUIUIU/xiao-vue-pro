import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入全局CSS样式控制文件
import './assets/css/global.css'
// 引入ElementUI组件库（全局引入）
// import ElementUI from 'element-ui'

// 单独引入ElementUI组件库的CSS样式文件：
import 'element-ui/lib/theme-chalk/index.css'

// 引入封装的面包屑组件：BreadCrumb.vue
import BreadCrumb from './components/BreadCrumb.vue'

// 按需导入需要的ElementUI组件库：注意，import需要放在事件方法之前呦！！！
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'

// 引入NProgress进度条相关JS、CSS文件：
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入axios:
import axios from 'axios'

// 关闭小圆圈：
NProgress.configure({ showSpinner: false })

// 注册面包屑组件：BreadCrumb.vue：
Vue.component('bread-crumb', BreadCrumb)

// 配置请求公共跟地址:
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// 配置请求拦截器：
// console.dir(axios)
axios.interceptors.request.use(function (config) {
  // console.log(config)
  NProgress.start() // 开启进度条
  // 给axios配置携带token：token在axios请求头协议信息中需要通过Authorization字段提供token令牌
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function (error) {
  return Promise.reject(error)
})

// 通过原型继承axios方法：
Vue.prototype.$http = axios

// 注册ElementUI（全局注册）
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册组件：
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

// 注册方法：
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

// Vue实例对象
new Vue({
  // 生命周期函数
  created () {
    // 配置响应拦截器：因为需要操作Vue对象$message成员，所以拦截器要放在Vue内部
    axios.interceptors.response.use(response => {
      NProgress.done() // 关闭进度条
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
