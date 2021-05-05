/*
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-04-11 13:56:15
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-04 23:08:56
 */

var obj = {
  methods: {
    loopCheckFun(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i]['isCheck'] = true
        if (arr[i].children) {
          this.loopCheckFun(arr[i].children)
        }
      }
    },
    async getRightByRole(name) {
      if (name == 'admin') {
        console.error('这个是管理员')
        const rel = await this.postData({
          url: '/dealFun',
          table: 'configs',
          action: 'find',
          data: {
            'dataType': 'rightData'
          }
        })
        console.log('权限：', rel)
        if (rel.data.error == 0) {
          const arr = rel.data.data[0].data
          // 要循环处理--全部选上
          for (let i = 0; i < arr.length; i++) {
            arr[i]['isCheck'] = true
            if (arr[i].children) {
              this.loopCheckFun(arr[i].children)
            }
          }
          this.$store.commit('common/saveMyRight', rel.data.data[0].data)
        }
      } else {
        console.error('普通用户')
        const rel = await this.postData({
          url: '/dealFun',
          table: 'roles',
          action: 'find',
          data: {
            name
          }
        })
        console.log('权限2：', rel.data.data[0].data)
        if (rel.data.error == 0) {
          this.$store.commit('common/saveMyRight', rel.data.data[0].data)
        }
      }
    },
    copyObj(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    myMsg(message, type = 'success') {
      this.$message({
        message,
        type
      })
    },
    answerFun(msg = '确定删除?') {
      return new Promise((resolve, reject) => {
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      })
    },
    postData(obj) {
      return new Promise((resolve, reject) => {
        const methodUrl = obj.url || '/dealFun'
        let url = obj.baseUrl || window.serverPath
        url += methodUrl
        this.$axios
          .post(url, obj)
          .then((rel) => {
            console.log('rel', rel)
            resolve(rel)
          })
          .catch((error) => {
            console.log('err:', error)
            resolve(error)
          })
      })
    }
  }
}

var mixin = {
  install(Vue) {
    Vue.mixin(obj)
  }
}

export default mixin
