<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-04-18 15:16:00
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-05 09:47:41
-->
<template>
  <div>
    <h3>用户 <el-button type="primary" size="mini" @click="addUser">添加</el-button></h3>
    <el-table
      :data="allUser"
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

      <el-table-column label="用户" prop="username" />
      <el-table-column label="角色" prop="role" />
      <el-table-column label="创建者" prop="createPersonId" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editRow(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.role!='admi2n'" size="mini" type="danger" @click="delRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isAdd? '增加用户':'修改用户'" :visible.sync="showAdd" width="450px">
      <el-form ref="formRef" :model="form" label-width="110px">
        <el-form-item label="用户名">
          <el-input v-model.trim="form.username" :disabled="form.role=='admin'" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model.trim="form.password" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" :disabled="form.role=='admin'" placeholder="请选择角色">
            <el-option v-for="(item,index) in allRole" :key="item+index" :label="item" :value="item" />
          </el-select>
        </el-form-item>

      </el-form>

      <p style="text-align:right; overflow: hidden;">
        <el-button @click="showAdd = false">取消</el-button>
        <el-button
          v-if="!isAdd"
          type="primary"
          @click="sureUpdate(form)"
        >修改</el-button>
        <el-button v-else type="primary" @click="sureAdd(form)">确定</el-button>
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
      isAdd: true,
      showAdd: false,
      allRole: [],
      baseUser: {
        username: 'aa',
        password: '123456',
        role: ''
      },
      form: {},
      allUser: []
    }
  },
  created() {
    this.getUser()
  },

  methods: {
    async sureUpdate(row) {
      console.log('sureUpdate', row)
      const { username, password, role } = row
      const rel = await this.postData({
        url: '/dealFun',
        table: 'users',
        action: 'update',
        data: {
          condition: {
            _id: row._id
          },
          content: {
            username, password, role
          }
        }
      })
      console.log('update-rel', rel)
      if (rel.data.error == 0) {
        this.myMsg('更新成功！')
        this.getUser()
      } else {
        this.myMsg('更新出错！', 'error')
      }
      this.showAdd = false
    },
    async getUser() {
      const AllUser = await this.postData({
        url: '/dealFun',
        table: 'users',
        action: 'find',
        data: {}
      })
      console.log('AllUser11', AllUser)
      if (!AllUser.data.error) {
        this.allUser = AllUser.data.data
      } else {
        this.myMsg('获取用户失败！', 'error')
      }
    },
    async sureAdd(row) {
      console.log('sureAdd', row)
      row.createPersonId = this.userInfo._id
      row.createTime = Date.now()
      const AllUser = await this.postData({
        url: '/dealFun',
        table: 'users',
        action: 'save',
        data: row
      })
      console.log('AllUser', AllUser)
      if (!AllUser.data.error) {
        this.getUser()
      } else {
        this.myMsg('添加用户失败！', 'error')
      }
      this.showAdd = false
    },
    async getAllRole() {
      const AllRole = await this.postData({
        url: '/dealFun',
        table: 'roles',
        action: 'find',
        data: {}
      })
      console.log('AllRole', AllRole)
      return AllRole
    },
    async addUser() {
      const AllRole = await this.getAllRole()
      this.allRole = []
      const arr = AllRole.data.data
      for (let i = 0; i < arr.length; i++) {
        this.allRole.push(arr[i].name)
      }
      if (!this.allRole.length) {
        this.myMsg('先添加角色，才能添加用户！', 'warning')
        return
      }
      this.isAdd = true
      this.form = this.copyObj(this.baseUser)
      this.showAdd = true
      // console.log('显示：this.treeData',this.treeData);
    },
    editRow(row) {
      console.log('editRow:', row)
      // this.myMsg('未完成：该功能尚在开发中！');
      this.form = JSON.parse(JSON.stringify(row))
      this.showAdd = true
      this.isAdd = false
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
        action: 'remove',
        data: {
          _id: row._id
        }
      })
      console.log('hasUser', hasUser)
      if (hasUser.data.data.length) {
        this.myMsg('删除出错！', 'warning')
      } else {
        this.getUser()
      }
    }
  }
}
</script>
