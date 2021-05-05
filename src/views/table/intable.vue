<template>
  <div class="app-container">
    <div style="margin-bottom: 5px">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addIn">
        新增入库记录
      </el-button>
    </div>
    <el-table
      v-loading="inListLoading"
      :data="inList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="入库记录ID" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="单价">
        <template slot-scope="scope">
          <span style="color: red">￥ </span><span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" prop="count" label="数量" />

      <el-table-column class-name="status-col" label="单位" width="110">
        <template slot-scope="{ row }">
          <el-tag :type="row.unit | statusFilter">
            {{ row.unit }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column width="100px" prop="createPerson" label="录入者" />

      <el-table-column width="180px" align="center" label="入库时间">
        <template slot-scope="scope">
          <span>{{
            scope.row.createTime | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="editRow(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-edit"
            @click="delRow(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]"
      width="600px"
      :visible.sync="showAdd"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="form"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="form.price" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" />
        </el-form-item>
        <el-form-item label="物料分类" prop="wl">
          <el-select v-model="form.wl" placeholder="请选择活动区域">
            <el-option
              v-for="(item,index) in wlData"
              :key="item.name+index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="细分分类" prop="xf">
          <el-cascader
            v-model="form.xf"
            :options="allKind"
            :props="{ label:'name',value:'name' }"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="经销商" prop="jxs">
          <el-select v-model="form.jxs" placeholder="请选择活动区域">
            <el-option
              v-for="(item,index) in jxsData"
              :key="item.name+index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAdd = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'add' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'InTable',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  computed: {
    ...mapState({
      inList: (state) => state.common.inList,
      jxsData: (state) => state.common.jxs,
      allKind: (state) => state.common.allKind,
      wlData: (state) => state.common.wlData
    })
  },
  data() {
    return {
      value: [],
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            }
          ]
        }
      ],
      baseForm: {
        name: '',
        price: 0,
        unit: '',
        count: '',
        wl: '',
        xf: [],
        jxs: ''
      },
      form: {
        name: '',
        price: 0,
        unit: '',
        count: ''
      },
      showAdd: false,
      dialogStatus: 'Edit',
      textMap: {
        update: 'Edit',
        create: 'add'
      },
      inListLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      rules: {
        name: [
          { required: true, message: 'name is required', trigger: 'blur' }
        ],
        price: [
          { required: true, message: 'price is required', trigger: 'blur' }
        ],
        count: [
          { required: true, message: 'count is required', trigger: 'blur' }
        ],
        unit: [
          {
            type: 'string',
            required: true,
            message: 'unit is required',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
    console.log('jxsData', this.jxsData)
    console.log('allKind', this.allKind)
    console.log('wlData', this.wlData)
  },
  methods: {
    handleChange(value) {
      console.log('handleChange', value)
    },
    delRow(row) {
      this.$store.dispatch('common/delInList', row)
    },
    createData() {
      console.log('createData')
      this.form.id = this.inList.length + 1
      this.form.createPerson = '李四'
      this.form.createTime = Date.now()
      this.$store.commit('common/addInListOne', this.form)
      this.showAdd = false
    },
    editRow(row) {
      console.log('editRow', row)
      this.form = JSON.parse(JSON.stringify(row))
      this.showAdd = true
      this.dialogStatus = 'Edit'
    },
    updateData() {
      console.log('updateData')
      const obj = JSON.parse(JSON.stringify(this.form))
      const arr = this.inList
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == obj.id) {
          arr.splice(i, 1, obj)
          break
        }
      }
      this.showAdd = false
    },
    addIn() {
      console.log('addIn')
      this.showAdd = true
      this.dialogStatus = 'add'
      this.form = JSON.parse(JSON.stringify(this.baseForm))
    },
    async getList() {
      this.inListLoading = true
      // const { data } = await fetchList(this.inListQuery)
      // const items = data.items
      // this.inList = items.map(v => {
      //   this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      //   v.originalTitle = v.title //  will be used when user click the cancel botton
      //   return v
      // })

      // this.$store.dispatch(
      //   'common/getListIn',
      //   {
      //     userId: 1,
      //     pageNum: 1,
      //     pageSize: 10
      //   })
      //   .then(() => {
      //   console.log('关闭1--');
      //   this.inListLoading = false})
      //   .catch(err => {
      //   console.log('关闭2--',err);
      //   this.inListLoading = false
      // })

      const rel = await this.$store.dispatch('common/getListIn', {
        userId: 1,
        pageNum: 1,
        pageSize: 10
      })
      console.log('关闭2--', rel)
      setTimeout(() => {
        this.inListLoading = false
      }, 100)
    },
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
