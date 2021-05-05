<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-04 22:47:47
-->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    userInfo: {
      handler(oldVal, newVal) {
        console.error('登录变化：', oldVal, newVal)
        if (newVal) {
          this.getRightByRole(newVal.role)
        }
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
