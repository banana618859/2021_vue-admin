<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-04-18 15:16:00
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-05 13:49:35
-->
<template>
  <div>
    <h3>角色 <el-button type="primary" size="mini" @click="addRole">添加</el-button></h3>
    <el-table
      :data="roleData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        type="index"
        width="65"
        element-loading-text="请给我点时间！"
      />

      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="创建者" prop="createPersonId" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editRow(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="角色" :visible.sync="showAdd" width="450px">
      <el-form ref="formRef" :model="form" label-width="110px">
        <el-form-item label="角色名称">
          <el-input v-model.trim="form.name" />
        </el-form-item>

        <el-form-item label="分配权限">
          <div style="height: 350px; overflow: auto; border:1px solid #ccc;">
            <el-tree
              ref="treeRef"
              show-checkbox
              node-key="id"
              :default-checked-keys="selectArr"
              :data="form.data"
              :props="defaultProps"
            />
          </div>
        </el-form-item>
      </el-form>

      <p style="text-align:right; overflow: hidden;">
        <el-button @click="showAdd = false">取消</el-button>
        <el-button
          v-if="!isAdd"
          type="primary"
          @click="sureUpdate(form)"
        >修改</el-button>
        <el-button v-else type="primary" @click="sureAdd">确定</el-button>
      </p>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {

  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  data() {
    return {
      baseRight: [],
      selectArr: [],
      isAdd: true,
      showAdd: false,
      form: {
        name: '',
        data: []
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleData: [
        {
          name: 'tom',
          createPerson: 'tom1',
          createTime: '2021-04-18 22:30:09'
        }
      ]
    }
  },
  mounted() {
    this.getAllRole()
    this.getBaseRight()
  },
  methods: {
    async getBaseRight() {
      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'find',
        data: {
          dataType: 'rightData'
        }
      })
      console.log('addRole', rel)
      this.baseRight = rel.data.data[0].data
    },
    async editRow(row) {
      console.log('editRow:', row)
      // this.myMsg('未完成：该功能尚在开发中！');
      this.form = JSON.parse(JSON.stringify(row))
      this.showAdd = true
      this.isAdd = false

      // 收集所有选中节点的id
      this.selectArr = []
      const arr = row.data
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].isCheck) {
          if (arr[i].children) {
            this.loopCollection(arr[i].children, this.selectArr)
          } else {
            // 只收集最低级就好
            this.selectArr.push(arr[i].id)
          }
        }
      }
      console.log('this.selectArr', this.selectArr)
    },
    loopCollection(arr, selectArr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].isCheck) {
          if (arr[i].children) {
            this.loopCollection(arr[i].children, selectArr)
          } else {
            // 只收集最低级就好
            selectArr.push(arr[i].id)
          }
        }
      }
    },
    async delRow(row) {
      console.log('delRow:', row)
      // 删除时，要二次确认
      const arel = await this.answerFun()
      if (!arel) {
        return
      }

      // 如果该角色关联了用户，则不允许删除 角色名唯一
      const hasUser = await this.postData({
        url: '/dealFun',
        table: 'users',
        action: 'find',
        data: {
          role: row.name
        }
      })
      console.log('hasUser', hasUser)
      if (hasUser.data.data.length) {
        this.myMsg('该角色尚绑定用户，不能删除！', 'warning')
        return
      }

      const rel = await this.postData({
        url: '/dealFun',
        table: 'roles',
        action: 'remove',
        data: {
          _id: row._id
        }
      })
      console.log('rm-rel', rel)
      if (rel.data.error == 0) {
        this.getAllRole()
      } else {
        this.myMsg('删除出错！', 'error')
      }
    },
    async getAllRole() {
      const AllRole = await this.postData({
        url: '/dealFun',
        table: 'roles',
        action: 'find',
        data: {}
      })
      console.log('AllRole', AllRole)
      this.roleData = AllRole.data.data
    },
    async sureAdd() {
      // 判断是否填角色名
      if (!this.form.name) {
        this.myMsg('请填写角色名！', 'warning')
        return
      } else {
        // 判断角色名是否重名
        if (this.form.name == 'admin') {
          this.myMsg('该角色名称已被占用！', 'warning')
          return
        }

        const rel = await this.findRole(this.form.name)
        console.log('same-name-rel', rel)
        if (rel.data.data.length) {
          this.myMsg('该角色名称已被占用！', 'warning')
          return
        }
      }

      const treeData = this.copyObj(this.baseRight)
      this.checkFun(treeData)
      console.log('sureAdd', this.userInfo, this.form, '被选中的' + treeData)
      const obj = {
        name: this.form.name,
        data: treeData,
        createPersonId: this.userInfo._id,
        createTime: Date.now()
      }

      // 保存到数据库
      const saveRel = await this.postData({
        url: '/dealFun',
        table: 'roles',
        action: 'save',
        data: obj
      })
      console.log('saveRel', saveRel)
      if (saveRel.data.error == 0) {
        this.myMsg('添加成功！')
        this.getAllRole()
      } else {
        this.myMsg('添加出错！', 'error')
      }
      this.showAdd = false
    },
    checkFun(treeData) {
      console.log('确定添加：object', treeData)
      // return
      const allCheck = this.$refs.treeRef.getCheckedNodes()
      console.log('allCheck', allCheck)
      for (let i = 0; i < allCheck.length; i++) {
        // 给自己加check--这里会导致污染原来数据
        // allCheck[i]['isCheck']=true;
        const myId = allCheck[i].id + ''
        // 第一层
        if (myId.length == 1) {
          for (let i = 0; i < treeData.length; i++) {
            if (treeData[i].id == myId) {
              treeData[i]['isCheck'] = true
              break
            }
          }
        } else {
          // 第二层
          for (let j = 0; j < treeData.length; j++) {
            if (myId.includes(treeData[j].id) && myId == treeData[j].id) {
              treeData[j]['isCheck'] = true
              break
            } else if (myId.includes(treeData[j].id) && myId != treeData[j].id) {
              if (treeData[j].children) {
                treeData[j]['isCheck'] = true
                this.loopCheck(treeData[j].children, myId)
              }
            }
          }
        }
      }
    },
    findRole(name) {
      return new Promise(async(resolve, reject) => {
        const rel = await this.postData({
          url: '/dealFun',
          table: 'roles',
          action: 'find',
          data: {
            name
          }
        })
        resolve(rel)
      })
    },
    loopCheck(treeData, myId) {
      for (let j = 0; j < treeData.length; j++) {
        if (myId.includes(treeData[j].id) && myId == treeData[j].id) {
          treeData[j]['isCheck'] = true
          break
        } else if (myId.includes(treeData[j].id) && myId != treeData[j].id) {
          if (treeData[j].children) {
            this.loopCheck(treeData[j].children, myId)
          }
        }
      }
    },
    async sureUpdate() {
      const treeData = this.copyObj(this.baseRight)
      console.error('treeData前:', this.baseRight)
      this.checkFun(treeData)
      console.log('sureUpdate', this.form, treeData)
      const obj = this.copyObj(this.form)
      obj.data = treeData
      const rel = await this.postData({
        url: '/dealFun',
        table: 'roles',
        action: 'update',
        data: {
          condition: {
            _id: obj._id
          },
          content: {
            data: obj.data
          }
        }
      })
      console.log('update-rel', rel)
      if (rel.data.error == 0) {
        this.myMsg('更新成功！')
        this.getAllRole()
      } else {
        this.myMsg('更新出错！', 'error')
      }
      this.showAdd = false
    },
    async addRole() {
      this.isAdd = true
      this.form.data = this.copyObj(this.baseRight)
      this.selectArr = []
      this.showAdd = true
      // console.log('显示：this.treeData',this.treeData);
    }
  }
}
</script>
