import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'index',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index
  }
]
const router = new VueRouter({
  routes
})
// yoken:所有路由在被访问时，都会优先经过全局前置守卫，只有前置守卫放行了，才能真正显示匹配路由、
// from:从哪来
// to:到哪去
// next()放行-->如果去登录放行；其他情况拦截到登录页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router
// 本接口会将token认证信息返回，请求时携带进行认证
// 前端：储存token；请求时携带
