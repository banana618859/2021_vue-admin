/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-03-19 14:00:12
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-04 22:18:39
 */

import { getInList } from '@/api/common'

var state = {
  myRight: [],
  jxs: [],
  inList: [],
  outList: [],
  allKind: [],
  wlData: [],
  allTitle: [
    {
      title: '以下哪个是静态网页的组成元素?',
      options: ['div+css', 'java+sql', 'php+sql', 'python+sql'],
      value: ''
    },
    {
      title: '以下哪个是你最擅长的后端语言?',
      options: ['java', 'php', 'python', 'c语言', 'nodejs', '以上都不擅长'],
      value: ''
    },
    {
      title: '以下哪个是你最擅长的前端框架?',
      options: ['jquery', 'vue', 'react', 'angular', '以上都不擅长'],
      value: ''
    },
    {
      title: '以下哪个是你最熟悉的数据库?',
      options: ['mysql', 'mongodb', 'sqlServer', 'oracle', '以上都是'],
      value: ''
    },
    {
      title: '接触过小程序开发?',
      options: ['有', '没有'],
      value: ''
    },
    {
      title: '目前能独立完成一个项目吗，包括前后台?',
      options: ['能', '简单点的能', '不能'],
      value: ''
    },
    {
      title: '希望毕业设计，自己能独立完成吗?',
      options: ['希望', '不希望'],
      value: ''
    },
    {
      title: '关于毕业设计或者程序员工作，你想了解些什么？',
      type: 'textArea',
      value: ''
    }
  ]
}

var mutations = {
  saveMyRight(state, data) {
    state.myRight = data
  },
  saveWlData(state, data) {
    state.wlData = data
  },
  saveJxs(state, data) {
    state.jxs = data
  },
  saveAllKind(state, data) {
    state.allKind = data
  },
  addOutList(state, data) {
    state.outList.push(data)
  },
  addListOut(state, data) {
    state.outList = data
  },
  addInListOne(state, data) {
    state.inList.push(data)
  },
  addList(state, data) {
    state.inList = data
  },
  delInList(state, data) {
    const arr = state.inList
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == data.id) {
        arr.splice(i, 1)
        break
      }
    }
  }
}

var actions = {
  getListOut(context, data) {
    const outList = [{
      id: 1,
      name: '苹果',
      price: 8,
      unit: '斤',
      count: 2,
      createPerson: '张三',
      createTime: 1615986140867
    },
    {
      id: 2,
      name: '钢笔',
      price: 8,
      unit: '支',
      count: 1,
      createPerson: '张三',
      createTime: 1615986160867
    }]
    // if(context.state.outList.length>0){
    //   return
    // }else{
    //   context.commit('addListOut',outList)
    // }
  },
  getListIn(context, data) {
    console.log('context,data', context, data)
    // if(context.state.inList.length>0){
    //   return
    // }else{
    //   return new Promise((res,rej)=>{
    //     getInList(data)
    //     .then((result,b)=>{
    //       console.log('result',result,b);
    //       context.commit('addList',result.data)
    //       res('success')
    //     }).catch(err=>{
    //       rej(err)
    //     })
    //   })
    // }
  },
  delInList(ctx, data) {
    ctx.commit('delInList', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
