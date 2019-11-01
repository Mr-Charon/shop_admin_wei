import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/rights/Roles.vue'
import Rights from '../components/rights/Rights.vue'
import Goods from '../components/products/Goods.vue'
import Categories from '../components/products/Categories.vue'
Vue.use(VueRouter)
// 解决更新的小bug,重复点不报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/categories', component: Categories }

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
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
  // console.log(localStorage.getItem('token'))
  // next()
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
