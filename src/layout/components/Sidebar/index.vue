<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-05-05 11:45:11
 -->
<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routerArr"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      routerArr: []
    }
  },
  watch: {
    userInfo: {
      handler(oldVal, newVal) {
        if (newVal) {
          this.getRightByRole(newVal.role)
        }
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    },
    myRight: {
      handler(oldVal, newVal) {
        if (newVal) {
          console.error('myRight:', this.myRight)
          this.dealRight(JSON.parse(JSON.stringify(this.myRight)))
        }
      },
      deep: true // 为true，表示深度监听，这时候就能监测到a值变化
    }
  },
  created() {
    console.log('--permission_routes:', this.permission_routes)
  },
  methods: {
    loopAddFalse(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i]['isCheck'] = false
        if (arr[i].children) {
          this.loopAddFalse(arr[i].children)
        }
      }
    },
    dealRight(theRight) {
      for (let i = 0; i < theRight.length; i++) {
        if (theRight[i].children) {
          if (theRight[i].children[0].name != '增') {
            this.loopRight(theRight[i].children)
          } else {
            delete theRight[i].children
          }
        }
      }
      const routerArr = JSON.parse(JSON.stringify(this.permission_routes))
      for (let i = 0; i < routerArr.length; i++) {
        routerArr[i]['isCheck'] = false
        // if(routerArr[i].children){
        //   this.loopAddFalse(routerArr[i].children)
        // }
      }
      // console.error('最后right-menu:',theRight,routerArr);
      for (let i = 0; i < routerArr.length; i++) {
        if (!routerArr[i].children) {
          routerArr[i]['isCheck'] = true
          continue
        }
        if (routerArr[i].children.length == 1) {
          if (routerArr[i].children[0].meta.title == '主页') {
            routerArr[i]['isCheck'] = true
            routerArr[i].children[0]['isCheck'] = true
          }
          for (let k = 0; k < theRight.length; k++) {
            if (routerArr[i].children[0].meta.title == theRight[k].name) {
              // console.error('theRight[k].name:',theRight[k].name);
              routerArr[i]['isCheck'] = theRight[k]['isCheck']
              routerArr[i].children[0]['isCheck'] = theRight[k]['isCheck']
              break
            }
          }
        } else if (routerArr[i].children.length > 1) {
          for (let j = 0; j < theRight.length; j++) {
            if (routerArr[i].meta.title == theRight[j].name) {
              routerArr[i]['isCheck'] = theRight[j]['isCheck']
              this.loopAdd(routerArr[i].children, theRight[j].children)
            }
          }
        }
        console.log('one:', routerArr[i].path)
      }

      // console.error('最后right-menu2:',routerArr);
      this.routerArr = routerArr
    },
    loopAdd(routerArr, theRight) {
      for (let i = 0; i < routerArr.length; i++) {
        for (let j = 0; j < theRight.length; j++) {
          if (routerArr[i].meta.title == theRight[j].name) {
            routerArr[i]['isCheck'] = theRight[j]['isCheck']
            if (routerArr[i].children && theRight[j].children && routerArr[i].children.length > 1 && theRight[j].children.length > 1) {
              this.loopAdd(routerArr[i].children, theRight[j].children)
            }
          }
        }
      }
    },
    loopRight(theRight) {
      for (let i = 0; i < theRight.length; i++) {
        if (theRight[i].children) {
          if (theRight[i].children[0].name != '增') {
            this.loopRight(theRight[i].children)
          } else {
            delete theRight[i].children
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      myRight: state => state.common.myRight,
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      console.log('activeMenu-route', route)
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
