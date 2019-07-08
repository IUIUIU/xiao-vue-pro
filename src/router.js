import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Welcome from './views/Welcome.vue'
import User from './views/User.vue'

Vue.use(Router)

var router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    // 后期的业务组件都是 /home 的子路由：
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        // home组件的子路由Welcome.vue：
        { path: '/welcome', component: Welcome },
        // home组件的子路由User.vue：
        { path: '/users', component: User }
      ]
    }
  ]
})

// 路由守卫设置：
router.beforeEach((to, from, next) => {
  // 非登录用户状态，如果访问非登录页面，需要强制跳转到登录页面去
  var token = window.sessionStorage.getItem('token')
  if (!token && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
