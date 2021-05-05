<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-03-21 22:19:44
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-23 21:01:38
-->
<template>
  <div>
    <h3 style="text-align: center; line-height: 60px; background-color: #ccc; margin: 5px;">
      问卷页
    </h3>
    <div style="border: 1px solid #ccc;">
      <ul>
        <li v-for="(item,index) in allTitle" :key="item.title+index">
          <h4>{{ index+1 }}.{{ item.title }}</h4>
          <div v-if="item.type && item.type=='textArea'">
            <el-input v-model="item.value" type="textarea" />
          </div>
          <div v-else>
            <el-radio-group v-model="item.value">
              <el-radio v-for="(one,index) in item.options" :key="one+index" :label="one">
                {{ one }}
              </el-radio>
            </el-radio-group>
          </div>
        </li>
      </ul>
    </div>
    <div style="margin: 10px;">
      <el-button type="primary" style="height: 50px; width: 200px;" @click="commitFun">提交问卷</el-button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  mounted() {
    console.log('object', this.username)
  },
  methods: {
    commitFun() {
      console.log('rel', this.allTitle)
      const arr = JSON.parse(JSON.stringify(this.allTitle))
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].value) {
          this.$alert('题目: [' + (i + 1) + '.' + arr[i].title + '] 未完成，请完成后再提交！')
          return
        }
      }
      for (let i = 0; i < arr.length; i++) {
        delete arr[i].options
        delete arr[i].type
        arr[i].username = this.username
      }
      this.$axios.post(window.serverPath + '/wj', { data: arr }).then((rel, b) => {
        console.log('object', rel, b)
        this.$message.success('提交成功！')
      }).catch((err) => {
        console.log('err', err)
        this.$message.error('提交失败！')
      })
    }
  },
  computed: {
    ...mapState({
      username: state => state.user.username,
      allTitle: state => state.common.allTitle
    })
  },
  data() {
    return {

    }
  }
}
</script>

