<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2021-03-21 22:19:44
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-23 21:57:11
-->
<template>
  <div>
    <h3 style="text-align: center; line-height: 60px; background-color: #ccc; margin: 5px;">
      结果页
    </h3>
    <div class="relBox">
      <ul>
        <li v-for="(item,index) in allData" :key="item.title+index">
          <p style="background-color: #eee; padding: 10px 5px;">{{ index+1 }}.题目：{{ item.title }}-({{ item.count }})</p>
          <div style="border: 1px solid #eee; padding: 10px 5px;">
            <div v-if="item.children[0].username">
              <p v-for="(t,index) in item.children" :key="t.value+index">
                {{ index+1 }}.{{ t.value }}
              </p>
            </div>
            <p v-for="(one,index) in item.children" v-else :key="one.value+index">
              {{ one.value }}-({{ one.count }})-({{ one.count|baifen(item.count) }})
            </p>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  filters: {
    baifen(a, b) {
      // console.log('baifen',a,b);
      return ((a / b) * 100).toFixed(2) + '%'
    }
  },
  data() {
    return {
      allData: []
    }
  },
  computed: {
    ...mapState({
      allTitle: state => state.common.allTitle
    })
  },
  mounted() {
    console.log('re-allTitle:', this.allTitle)
    this.getRel()
  },
  methods: {
    getRel() {
      const kindArr = []
      for (let i = 0; i < this.allTitle.length; i++) {
        const theTitle = this.allTitle[i].title
        const oneKind = {
          title: theTitle,
          count: 0,
          children: []
        }
        const options = this.allTitle[i].options
        console.log('options', options)
        if (options) {
          for (let j = 0; j < options.length; j++) {
            const oneType = {
              title: theTitle,
              value: options[j],
              count: 0
            }
            oneKind.children.push(oneType)
          }
        }

        kindArr.push(oneKind)
      }
      console.log('kindArr', kindArr)

      this.$axios.post(window.serverPath + '/getwj', { data: kindArr }).then((rel, b) => {
        console.log('object', rel, b)
        this.allData = rel.data.data
        this.$message.success('获取成功！')
      }).catch((err) => {
        console.log('err', err)
        this.$message.error('获取失败！')
      })
    }
  }
}
</script>

<style scoped>
 .relBox ul{
   margin-right: 40px;
 }
</style>

