/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-04-24 20:01:03
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import './main.css'

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// 混入
import mixin from './mixin'
Vue.use(mixin)

import axios from 'axios'
Vue.prototype.$axios = axios

// http://47.105.90.67:7000/
var localServer = 'http://localhost:7000'
var remoteServer = 'http://47.105.90.67:7000'
window.serverPath = localServer

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

// 全局方法
window.setLocal = (name, content) => {
  window.localStorage.setItem(name, content)
}
window.getLocal = (name) => {
  return window.localStorage.getItem(name)
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
