<!--
 * @Descripttion:
 * @Author: yizheng.yuan
 * @Date: 2019-09-12 17:11:27
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-04-15 23:26:30
-->
<template>
  <div>
    <div>
      <el-button type="primary" @click="addFun">添加</el-button>
    </div>
    <el-table
      v-if="type.key == 'wl'"
      :data="wlData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-loading="loading"
        align="center"
        type="index"
        width="65"
        element-loading-text="请给我点时间！"
      />

      <el-table-column label="名称" prop="name" />
      <el-table-column label="添加日期" prop="createTime" />

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{ row }">
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-else-if="type.key == 'jxs'"
      :data="jxsData"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        v-loading="loading"
        align="center"
        type="index"
        width="65"
        element-loading-text="请给我点时间！"
      />

      <el-table-column label="经销商名称" prop="name" />
      <el-table-column label="手机号码" prop="phone" />
      <el-table-column label="座机" prop="telephone" />
      <el-table-column label="地址" prop="address" />
      <el-table-column label="添加日期" prop="createTime" />
      <el-table-column label="备注" prop="note" />

      <el-table-column class-name="status-col" label="操作">
        <template slot-scope="{ row }">
          <el-button type="danger" @click="delRowJxs(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-else>
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="name"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ data.name }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => updateSelf(data)">
              修改
            </el-button>
            <el-button type="text" size="mini" @click="() => append(data)">
              增加子类
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <el-dialog title="细分分类" :visible.sync="showXf" width="450px">
      <el-form ref="formRef" :model="form" label-width="110px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-if="allFa.length && !isEdit" label="是否一级分类">
          <el-switch v-model="form.firstLevel" :disabled="isAddSon" />
        </el-form-item>
        <el-form-item v-if="!form.firstLevel && !isEdit" label="选择父级分类">
          <el-select
            v-model="form.faId"
            :disabled="isAddSon"
            placeholder="请选择父级分类"
          >
            <el-option
              v-for="(item, index) in allFa"
              :key="item.id + index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showXf = false">取消</el-button>
        <el-button
          v-if="isEdit"
          type="primary"
          @click="sureUpdate(form)"
        >修改</el-button>
        <el-button
          v-else-if="isAddSon"
          type="primary"
          @click="addSonFun(form)"
        >增加子类</el-button>
        <el-button v-else type="primary" @click="sureAddXf">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="物料分类" :visible.sync="showWl" width="450px">
      <el-form :model="wlform" label-width="110px">
        <el-form-item label="物料分类名称">
          <el-input v-model="wlform.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showWl = false">取消</el-button>
        <el-button
          v-if="isEditWl"
          type="primary"
          @click="sureUpdateWl(wlform)"
        >修改</el-button>
        <el-button
          v-else
          type="primary"
          @click="sureAddWl(wlform)"
        >确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="经销商资料" :visible.sync="showJxs" width="450px" :close-on-click-modal="isFalse">
      <el-form :model="jxsform" label-width="110px">
        <el-form-item label="经销商名称">
          <el-input v-model="jxsform.name" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="jxsform.phone" />
        </el-form-item>
        <el-form-item label="座机">
          <el-input v-model="jxsform.telephone" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="jxsform.address" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="jxsform.note" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showJxs = false">取消</el-button>
        <el-button
          v-if="isEditJxs"
          type="primary"
          @click="sureUpdateJxs(jxsform)"
        >修改</el-button>
        <el-button
          v-else
          type="primary"
          @click="sureAddJxs(jxsform)"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
const id = 1000
export default {
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
  props: {
    type: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isFalse: false,
      isEditJxs: false,
      showJxs: false,
      jxsform: {},
      BaseJxsform: {
        dataType: 'wl',
        name: '某公司',
        phone: '13631338856',
        telephone: '020-18736782',
        address: '广东佛山',
        note: 'A类'
      },
      isEdit: false,
      isEditWl: false,
      showWl: false,
      wlform: {},
      BaseWlform: {
        dataType: 'wl',
        name: ''
      },
      isEdit: false,
      isAddSon: false,
      form: {
        name: '',
        firstLevel: true,
        level: 1,
        faId: ''
      },
      baseForm: {
        name: '',
        firstLevel: true,
        level: 1,
        faId: ''
      },
      currentFa: null,
      allFa: [],
      firstAllFa: [],
      secondAllFa: [],
      showXf: false,
      treeData: [],
      list: null,
      wlData: [],
      jxsData: [],
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type.key,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    this.getAllKind()
    this.getWlKind()
    this.getJxs()
  },
  methods: {
    delRow(row) {
      console.log('delRow', row)
    },
    async delRowJxs(row) {
      console.log('del-jxs', row)
      const rel = await this.answerFun()
      if (!rel) {
        return
      }
      const ret = await this.postData({
        table: 'configs',
        action: 'remove',
        data: {
          _id: row._id
        }
      })
      console.log('del-ret:', ret)
      this.getJxs()
    },
    sureUpdateWl() {
      console.log('getWlKind')
    },
    async sureAddWl(row) {
      console.log('sureAddWl', row)
      row['createTime'] = Date.now()
      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'save',
        data: row
      })
      console.log('sureAddWl', rel)
      this.getWlKind()
      this.showWl = false
    },
    async getWlKind() {
      console.log('getWlKind')
      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'find',
        data: {
          dataType: 'wl'
        }
      })
      console.log('dealFun-getWlKind', rel)
      if (!rel.data.error) {
        this.wlData = rel.data.data
        // 提交到vuex
        this.$store.commit('common/saveWlData', this.copyObj(this.wlData))
      } else {
        this.wlData = []
      }
    },
    async sureUpdate(row) {
      const rel = await this.postData({
        table: 'kinds',
        baseUrl: window.serverPath,
        url: '/updateById',
        action: 'update',
        _id: row._id,
        data: {
          name: row.name
        }
      })
      console.log('rel--1', rel)
      this.getAllKind()
      this.showXf = false
      this.myMsg('修改成功！')
    },

    async updateSelf(row) {
      this.isEdit = true
      this.showXf = true
      this.form = row
      console.log('updateSelf', row)
    },
    sureAddXf() {
      console.log('form', this.form)
      const one = JSON.parse(JSON.stringify(this.form))
      one.id = Date.now()
      if (one.firstLevel) {
        this.firstAllFa.push(one)
      }
      this.allFa = [...this.firstAllFa]
      this.treeData.push(one)

      this.saveKind(one)
    },
    getAllKind() {
      this.$axios
        .get(window.serverPath + '/getAllKind')
        .then((rel, b) => {
          console.log('object', rel, b)
          if (rel.data.error == 0) {
            // this.myMsg('获取分类成功！')
            this.dealRelsult(rel.data.data)
          } else {
            this.$message.error('获取分类失败!')
          }
          this.showXf = false
        })
        .catch((err) => {
          this.showXf = false
          console.log('err', err)
          this.$message.error('获取分类失败!')
        })
    },
    async dealRelsult(arr) {
      const backRel = JSON.parse(JSON.stringify(arr))
      console.log('backRel', backRel)
      const levelName = []
      const allLevel = []
      for (let i = 0; i < arr.length; i++) {
        if (!levelName.includes(arr[i].level)) {
          levelName.push(arr[i].level)
          allLevel.push([arr[i]])
        } else {
          const indx = levelName.indexOf(arr[i].level)
          allLevel[indx].push(arr[i])
        }
      }
      const allLevel1 = JSON.parse(JSON.stringify(allLevel))
      console.log('allLevel1', allLevel1)
      let relArr = []
      if (allLevel.length < 2) {
        relArr = allLevel
      } else {
        const arr = allLevel
        const lastArr = arr.pop() // 获取倒数第一个数组
        const last2Arr = arr.pop()
        for (let i = 0; i < lastArr.length; i++) {
          for (let j = 0; j < last2Arr.length; j++) {
            if (lastArr[i].faId == last2Arr[j].id) {
              // 找到父亲了
              if (!last2Arr[j].children) {
                this.$set(last2Arr[j], 'children', [])
              }
              last2Arr[j].children.push(lastArr[i])
              break
            }
          }
        }
        if (arr.length) {
          relArr = await this.loopCompass(arr, last2Arr)
        } else {
          relArr = last2Arr
        }
        this.treeData = relArr
        // 提交到vuex，其他页面能共享
        this.$store.commit('common/saveAllKind', this.copyObj(relArr))
      }
      // this.treeData = this.loopCompass(allLevel,relArr)
    },
    loopCompass(arr, resultArr) {
      return new Promise(async(resolve, reject) => {
        const last2Arr = arr.pop() // 获取倒数第一个数组
        for (let i = 0; i < resultArr.length; i++) {
          for (let j = 0; j < last2Arr.length; j++) {
            if (resultArr[i].faId == last2Arr[j].id) {
              // 找到父亲了
              if (!last2Arr[j].children) {
                this.$set(last2Arr[j], 'children', [])
              }
              last2Arr[j].children.push(resultArr[i])
              break
            }
          }
        }
        if (arr.length) {
          resolve(this.loopCompass(arr, last2Arr))
        } else {
          resolve(last2Arr)
        }
      })
    },
    saveKind(one) {
      console.log('saveKind', one)
      this.$axios
        .post(window.serverPath + '/addKind', one)
        .then((rel, b) => {
          console.log('object', rel, b)
          if (rel.data.error == 0) {
            this.$message.success('保存成功！')
          } else {
            this.$message.error('保存失败！')
          }
          this.showXf = false
        })
        .catch((err) => {
          this.showXf = false
          console.log('err', err)
          this.$message.error('保存失败！')
        })
    },
    append(data) {
      // const newChild = { id: id++, label: "testtest", children: [] };
      this.form = JSON.parse(JSON.stringify(this.baseForm))
      this.showXf = true
      this.isAddSon = true
      this.isEdit = false
      this.form.faId = data.id
      this.form.name = ''
      this.form.level = data.level + 1
      this.form.firstLevel = false
      this.allFa = [data]
      this.currentFa = data
      // this.$refs['formRef'].resetFields();
    },
    addSonFun(newChild) {
      const data = this.currentFa
      newChild = JSON.parse(JSON.stringify(newChild))
      newChild.id = Date.now()
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.saveKind(newChild)
    },
    deleteByIdWithTable(obj) {
      return new Promise((resolve, reject) => {
        this.$axios
          .post(window.serverPath + '/deleteByIdWithTable', obj)
          .then((rel, b) => {
            console.log('object', rel, b)
            resolve(rel)
          })
          .catch((err) => {
            resolve(err)
          })
      })
    },
    async remove(node, data) {
      const relt = await this.answerFun()
      if (!relt) {
        return
      }
      const parent = node.parent
      const children = parent.data.children || parent.data
      const rel = await this.deleteByIdWithTable({
        table: 'kinds',
        _id: data._id
      })
      if (!rel.data.data.error) {
        const index = children.findIndex((d) => d.id === data.id)
        children.splice(index, 1)
      } else {
        this.$message.error('删除出错!')
      }
    },
    addJxs() {
      this.showJxs = true
      this.isEditJsx = false
      this.jxsform = this.copyObj(this.BaseJxsform)
    },
    sureUpdateJxs(one) {
      console.log('sureUpdateJxs', one)
      this.showJxs = false
    },
    async sureAddJxs(one) {
      console.log('sureAddJxs', one)
      one['createTime'] = Date.now()
      this.showJxs = false
      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'save',
        data: {
          dataType: 'jxs',
          name: '',
          data: one
        }
      })
      console.log('rel-jxs', rel)
      this.getJxs()
    },
    async getJxs() {
      const rel = await this.postData({
        url: '/dealFun',
        table: 'configs',
        action: 'find',
        data: {
          dataType: 'jxs'
        }
      })
      console.log('get-jxs', rel)
      this.jxsData = []
      if (!rel.data.error) {
        rel.data.data.forEach(item => {
          item.data['_id'] = item._id
          item.data['dataType'] = item['dataType']
          this.jxsData.push(item.data)
        })
        // 将经销商存到vuex
        this.$store.commit('common/saveJxs', this.jxsData)
      } else {
        this.myMsg('获取经销商数据出错！', 'error')
      }
    },
    addFun() {
      switch (this.type.key) {
        case 'wl':
          console.log('add wl')
          this.addWl()
          break
        case 'xf':
          this.addxf()
          break
        case 'jxs':
          this.addJxs()
          break
        default:
          break
      }
    },
    addWl() {
      this.showWl = true
      this.isEditWl = false
      this.wlform = JSON.parse(JSON.stringify(this.BaseWlform))
    },
    addxf() {
      console.log('add xf')
      this.form = JSON.parse(JSON.stringify(this.baseForm))
      this.showXf = true
      this.isAddSon = false
      this.isEdit = false
    },
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchList(this.listQuery).then((response) => {
        this.list = response.data.items
        this.loading = false
      })
    }
  }
}
</script>

