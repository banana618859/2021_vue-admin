<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors  : yizheng.yuan
 * @LastEditTime : 2020-01-09 16:00:42
 -->
<template>
  <div class="app-container">
    <switch-roles @change="handleRolesChange" />
    <el-button type="success" @click="showBoxFun">弹框</el-button>

    <el-dialog title="Add" :visible.sync="showBox" width="30%">
      <el-input v-model="subMenu" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBox = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SwitchRoles from './components/SwitchRoles'

export default {
  name: 'PagePermission',
  components: { SwitchRoles },
  data() {
    return {
      showBox: false,
      subMenu: ''
    }
  },
  methods: {
    addMenu() {
      console.log('--add:', this.subMenu)
      this.$store.commit('permission/ADD_ROUTES', this.subMenu)
    },
    handleRolesChange() {
      this.$router.push({ path: '/permission/index?' + +new Date() })
    },
    showBoxFun() {
      this.showBox = true
    }
  }
}
</script>
