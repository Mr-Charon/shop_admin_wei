import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false
// 将axios挂载到vue原型上，将来所有实例都可以共享
Vue.prototype.$axios = axios
// 配置axios的基准地址, 效果: 将来所有的请求, 会自动在前面拼接上路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 配置请求拦截器：将每次的请求进行拦截，可以对每次的请求进行处理
axios.interceptors.request.use(function (config) {
// 在发送请求前做什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 响应拦截器
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  response = response.data
  // 校验结果，如果响应时，发现状态码是401，说明是无效的token，拦截到登陆
  if (response.meta.status === 401) {
    router.push('/login')
    response.meta.msg = '登陆状态以失效，请重新登录'
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
