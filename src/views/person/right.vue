<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-04-18 15:16:00
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-05 11:33:49
-->
<template>
  <div>
    <h3>权限-所有页面权限</h3>
    <el-tree :data="treeData" :props="defaultProps" />

  </div>
</template>

<script>

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      pageData: [
        {
          name: '库存管理',
          id: 1,
          action: 'stock',
          children: [
            {
              name: '商品入库',
              id: 11,
              action: 'instock',
              children: []
            },
            {
              name: '商品出库',
              id: 12,
              action: 'instock',
              children: []
            },
            {
              name: '库存盘点',
              id: 13,
              action: 'allstock',
              children: []
            }
          ]
        },
        {
          name: '分类管理',
          id: 2,
          action: 'kind',
          children: [
            {
              name: '物料分类管理',
              id: 21,
              action: 'wlKind',
              children: []
            },
            {
              name: '细分分类管理',
              id: 22,
              action: 'xfKind',
              children: []
            },
            {
              name: '经销商管理',
              id: 23,
              action: 'jxsKind',
              children: []
            }
          ]
        },
        {
          name: '用户权限管理',
          id: 3,
          action: 'userRight',
          children: [
            {
              name: '用户管理',
              id: 31,
              action: 'user',
              children: []
            },
            {
              name: '角色管理',
              id: 32,
              action: 'role',
              children: []
            },
            {
              name: '权限管理',
              id: 33,
              action: 'right',
              children: []
            }
          ]
        }
      ],
      baseOption: [{
        name: '增',
        action: 'add'
      },
      {
        name: '删',
        action: 'delete'
      },
      {
        name: '改',
        action: 'update'
      },
      {
        name: '查',
        action: 'read'
      }]
    }
  },
  created() {
    this.compaseKind()
  },
  methods: {
    async compaseKind() {
      const arr = this.pageData
      for (let i = 0; i < arr.length; i++) {
        const son = arr[i].children
        for (let j = 0; j < son.length; j++) {
          const faId = son[j].id
          const arra = this.copyObj(this.baseOption)
          for (let z = 0; z < arra.length; z++) {
            arra[z]['id'] = faId + '' + z
          }
          son[j].children = arra
        }
      }
      console.log('pageData', this.pageData)
      this.treeData = this.pageData
      const row = {
        dataType: 'rightData',
        data: this.treeData
      }
      // 提交到数据库
      const rem = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'remove',
        data: {
          _id: row._id
        }
      })

      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'save',
        data: row
      })
      console.log('sureAddWl', rem, rel)
    }
  }
}
</script>
