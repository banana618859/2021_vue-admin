<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-03-18 13:42:26
-->
<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="序号" type="index" width="60" />
    <el-table-column label="库存预警" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.thing }}
      </template>
    </el-table-column>
    <el-table-column label="库存数量" prop="count">
      <template slot-scope="scope">
        <span v-if="scope.row.count<5" style="color: red;">
          {{ scope.row.count }}
        </span>
        <span v-else>
          {{ scope.row.count }}
        </span>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      transactionList().then(response => {
        // this.list = response.data.items.slice(0, 8)
        this.list = [
          {
            thing: '采购物料A',
            count: 2
          },
          {
            thing: '采购物料B',
            count: 3
          },
          {
            thing: '采购物料C',
            count: 4
          }
        ]
      })
    }
  }
}
</script>
