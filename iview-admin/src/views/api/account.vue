<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">新增</Button>
      </FormItem>
         <FormItem label="商户名:" class="">
        <Input clearable type="text" v-model="query.AccountName" placeholder="填写商户名"></Input>
      </FormItem>
      <FormItem label="时间选择:" class="">
         <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>         <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd" title="添加账号" width="600" :loading="loading">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <FormItem label="用户名" prop="AccountName">
          <Input v-model="addRow.AccountName" style="width:360px"></Input>
        </FormItem>
        <FormItem label="昵称" prop="NickName">
          <Input v-model="addRow.NickName" style="width:360px"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="addRow.password" style="width:360px"></Input>
        </FormItem>
         <FormItem label="秘钥" prop="Token">
          <Input v-model="addRow.Token" style="width:360px" readonly></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showEdit" title="编辑账号" width="600">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="120">
        <FormItem label="用户名" >
          <Input v-model="editRow.AccountName" style="width:360px" disabled></Input>
        </FormItem>
        <FormItem label="昵称" prop="NickName" :rules="{ required: true, message: '请输入昵称!', trigger: 'blur' }">
          <Input v-model="editRow.NickName" style="width:360px"  placeholder="输入昵称"></Input>
        </FormItem>
        <FormItem label="状态" prop="Status" :rules="{ required: true, message: '请选择状态!', trigger: 'blur' }">
          <RadioGroup v-model="editRow.Status">
            <Radio :label="'1'">启用</Radio>
            <Radio :label="'0'">禁用</Radio>
          </RadioGroup>
        </FormItem>
         <FormItem label="秘钥" prop="Token" :rules="{ required: true, message: '请输入秘钥!', trigger: 'blur' }">
          <Input v-model="editRow.Token" style="width:360px" readonly>
           <Button slot="append" @click="changeEditToken" > 点击更换</Button>
          </Input>
        </FormItem>
         <FormItem label="ip白名单" prop="IPPermission" :rules="{ required: true, message: '请输入ip白名单!', trigger: 'blur' }">
          <Input v-model="editRow.IPPermission" style="width:360px"  placeholder="输入ip白名单"></Input>
          <br>多个ip用分号;分隔
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">保存</Button>
      </div>

    </Modal>

  </div>
</template>
<script>
import * as UUID from 'uuidjs'
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      loading: false,
      query: { },
      datasTime: [],
      statusObj: { '1': '启用', '0': '禁用' },
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: { Token: '' },
      editRow: {},
      delRow: {},
      columns: [

      ],
      tableDatas: [],
      ruleValidate: {
        AccountName: [
          { required: true, message: '不能为空!', trigger: 'blur' }
        ],
        NickName: [
          { required: true, message: '不能为空!', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空!', trigger: 'blur' }
        ],
        Token: [
          { required: true, message: '不能为空!', trigger: 'blur' }
        ]

      }
    }
  },
  mounted () {
    // this.init();
  },
  computed: {},
  methods: {
    changeEditToken () {
      this.editRow.Token = UUID.generate().replace(/-/g, '')
      // this.imagesrc = '/api/captcha/' + this.uuid
    },
    init () {
      this.queryList()
    },
    sortChange (obj) {
      this.query.order_by = obj.key + ' ' + obj.order
      this.queryList()
    },
    pickerChange (am, b) {
      this.datasTime = am; this.clearDate()
    },
    clearDate () {
      this.datasTime = []
      this.btTypes = ['ghost', 'ghost', 'ghost', 'ghost']
    },
    changeDate (day) {
      this.datasTime = []
      var start = new Date()
      var end = new Date()
      if (day === -1) {
        this.btTypes = [ 'ghost', 'ghost', 'ghost', 'success' ]
        start.setDate(start.getDate() - 1)
        end.setDate(end.getDate() - 1)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 1) {
        this.btTypes = ['success', 'ghost', 'ghost', 'ghost']
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 7) {
        this.btTypes = ['ghost', 'success', 'ghost', 'ghost']
        start.setDate(start.getDate() - 6)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 30) {
        this.btTypes = ['ghost', 'ghost', 'success', 'ghost']
        start.setDate(start.getDate() - 29)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
    },
    getDateFormate (date) {
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    },
    pageChange (page) {
      this.page = page
      this.queryList()
    },
    pageSizeChange (perPage) {
      if (this.per_page !== perPage) {
        this.per_page = perPage
        this.queryList()
      }
    },
    async queryList () {
      try {
        this.queryLoading = true
        let minIndex = (this.page - 1) * this.per_page
        let maxIndex = this.page * this.per_page
        const data = {
          page: this.page,
          per_page: this.per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.total && this.total && this.page > 1) ? this.total : maxIndex,
          ...this.query,
          start_time: (this.datasTime.length > 0 && this.datasTime[0]) ? this.datasTime[0] : '',
          end_time: (this.datasTime.length > 1 && this.datasTime[1]) ? this.datasTime[1] + ' 23:59:59' : ''
        }

        const result = await this.$store.dispatch('getApiAccount', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          var obj1 = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 120,
            key: columnKeys[i]
          }
          if (obj1.key === 'Status') {
            obj1.render = (h, params) => {
              return h('span', this.statusObj[params.row.Status])
            }
          }
          this.columns.push(obj1)
        }
        let obj = {
          title: '操作',
          width: 100,
          key: 'action'
        }
        obj.render = (h, params) => {
          return h('div', [
            h(
              'Button',
              {
                props: {
                  type: 'success',
                  icon: 'compose',
                  size: 'small'
                },
                style: {
                },
                on: {
                  click: () => {
                    this.showEditModal(params.index)
                  }
                }
              }, '编辑'
            )
          ])
        }
        this.columns.push(obj)
        this.tableDatas = res.tableDatas
        this.total = res.total
      } catch (error) {
      }
      this.queryLoading = false
    },
    toQuery () {
      this.page = 1
      this.queryList()
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    cancel () {
      this.showEdit = false
      this.showAdd = false
    },
    showAddModal () {
      this.showAdd = true
      this.handleReset('formValidate')
      this.addRow = {}
      this.addRow.Token = UUID.generate().replace(/-/g, '')
    },
    toAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.add(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        let actionName = 'insertApiAccount'
        const res = await this.$store.dispatch(actionName, data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('添加成功!')
          this.toQuery()
        }
      } catch (error) {
      }
      this.loading = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateApiAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          this.init()
        }
      } catch (error) {
      }
      this.loading = false
    },
    toDelete (index) {
      this.delRow = { ...this.tableDatas[index] }
      let data = { pkid: this.delRow.pkid }
      this.deleteRow(data)
    },
    async deleteRow (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('deleteMessage', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('删除成功!')
          this.toQuery()
        }
      } catch (error) {
      }
      this.loading = false
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
