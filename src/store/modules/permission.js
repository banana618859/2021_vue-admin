/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-18 21:44:29
 */
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    console.log('SET_ROUTES:', routes, constantRoutes, constantRoutes.length)
    state.addRoutes = routes

    state.routes = constantRoutes.concat(routes)
  },
  ADD_ROUTES: (state, routes) => {
    console.log('SET_ROUTES:', routes, asyncRoutes, asyncRoutes.length)
    state.addRoutes = routes

    let theOne
    for (let i = 0; i < asyncRoutes.length; i++) {
      if (asyncRoutes[i].name == 'Permission') {
        theOne = i
        break
      }
    }
    console.log('theOne:', theOne)
    // let newRoute = {
    //   path: 'new',
    //   component: () => import('@/views/permission/new'),
    //   name: routes,
    //   meta: {
    //     title: routes,
    //     roles: ['admin']
    //   }
    // }

    // asyncRoutes[theOne].children.push(newRoute)
    // asyncRoutes.splice(theOne, i, newOne)
    //  state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
