<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">新增</Button>
      </FormItem>
      <FormItem label="昵称:" class="">
        <Input clearable type="text" v-model="query.NickName" placeholder="填写用户昵称"></Input>
      </FormItem>
      <!-- <FormItem label="手机:" class="">
                <Input clearable type="text" v-model="query.Mobile" placeholder="填写手机号"></Input>
            </FormItem> -->

      <FormItem label="创建时间:" class="">
         <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>         <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd" title="新增管理账号" width="480">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="140">
        <FormItem label="账号" prop="AccountName">
          <Input v-model="addRow.AccountName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="昵称" prop="NickName">
          <Input v-model="addRow.NickName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="密码" prop="Pwd">
          <Input v-model="addRow.Pwd" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="Pwd_confirm">
          <Input v-model="addRow.Pwd_confirm" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="角色" prop="RoleLevel">
          <Select v-model="addRow.RoleLevel" style="width:200px" clearable>
            <Option v-for="item in roleLevelTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>
    <Modal v-model="showEdit" title="编辑管理账号" width="480">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">
        <FormItem label="账号" prop="name">
          <Input v-model="editRow.AccountName" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="昵称" prop="NickName" :rules="{ required: true, message: '请输入昵称', trigger: 'blur' }">
          <Input v-model="editRow.NickName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="RoleLevel" prop="RoleLevel" :rules="{ required: true, message: '请选择角色!', trigger: 'blur' }">
          <Select v-model="editRow.RoleLevel" style="width:200px">
            <Option v-for="item in roleLevelTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="Status" :rules="{ required: true, message: '请选择状态！', trigger: 'blur' }">
          <Select v-model="editRow.Status" style="width:200px">
            <Option v-for="(item,key) in statusObj" :value="key" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请输入密码！'))
      } else {
        if (this.addRow.Pwd_confirm !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('Pwd_confirm')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.addRow.Pwd) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      statusObj: { '1': '启用', '0': '禁用' },
      roleLevelTypes: [{ label: '管理员', value: '0' }, { label: '运营', value: '10' }, { label: '普通客服', value: '100' }, { label: '审核客服', value: '1000' }, { label: '客服主管', value: '999' }],
      loading: false,
      query: {},
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      delRow: {},
      columns: [
        {
          title: 'AccountName',
          width: 160,
          key: 'AccountName'
        },
        {
          title: '昵称',
          minWidth: 150,
          key: 'NickName'
        },

        {
          title: '手机',
          minWidth: 120,
          key: 'Mobile'
        },
        {
          title: 'Pwd',
          width: 80,
          key: 'Pwd'
        },
        {
          title: 'MachineCode',
          minWidth: 120,
          key: 'MachineCode'
        },
        {
          title: '登录IP',
          minWidth: 120,
          key: 'LastIP'
        },
        {
          title: 'LastTime',
          width: 150,
          key: 'LastTime'
        },
        {
          title: '创建时间',
          width: 150,
          key: 'CreateTime'
        },
        {
          title: 'Create操作人',
          minWidth: 120,
          key: 'CreateAdmin'
        },
        {
          title: 'CreateIP',
          minWidth: 120,
          key: 'CreateIP'
        },
        {
          title: 'RoleLevel',
          minWidth: 100,
          key: 'RoleLevel'
        },
        {
          title: '状态',
          minWidth: 100,
          key: 'Status',
          render: (h, params) => {
            return h('span', this.statusObj[params.row.Status])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 160,
          render: (h, params) => {
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
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.index)
                    }
                  }
                }, '编辑'
              ),

              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    title: '您确认要删除吗？'
                  },
                  style: {
                    textAlign: 'left'
                  },
                  on: {
                    'on-ok': () => {
                      this.toDelete(params.index)
                    },
                    'on-cancel': () => {
                    }
                  }
                },
                [
                  h('Button', { props: {
                    type: 'error',
                    icon: 'android-delete',
                    size: 'small'
                  } }, '删除')
                ]

              )
            ])
          }
        }

      ],
      tableDatas: [],
      ruleValidate: {
        AccountName: [
          { required: true, message: '账号不能为空！', trigger: 'blur' }
        ],
        NickName: [
          { required: true, message: '昵称不能为空！', trigger: 'blur' }
        ],
        Pwd: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        Pwd_confirm: [
          { required: true, message: '请再次输入密码！', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'change' }
        ],
        RoleLevel: [
          { required: true, message: '请选择角色！ ', trigger: 'blur' }

        ]
      }
    }
  },
  mounted () {
    // this.init();
  },
  computed: {},
  methods: {
    init () {
      this.queryList()
    },
    selectChange () {

    },
    pickerChange (am, b) {
      this.datasTime = am; this.clearDate()
    },
    clearDate () {
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
      } if (day === 1) {
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

        const result = await this.$store.dispatch('getGMAccountList', data)
        const res = this.handleResult(result, ['AccountName', 'NickName', 'Mobile', 'Pwd', 'MachineCode', 'LastIP', 'LastTime', 'CreateTime', 'CreateAdmin', 'CreateIP', 'RoleLevel', 'Status'])
        this.tableDatas = res.tableDatas
        this.total = res.total
        this.arrTitles = res.arrTitles
        this.queryLoading = false
      } catch (error) {
        const response = error.response
        if (response) {
          if (response.status === 401) {
            this.$Message.error('你没有权限!')
          }
          if (response.status === 500) {
            this.$Message.error('系统繁忙，请稍后再试!')
          }
        }
      }
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
        const res = await this.$store.dispatch('insertGMAccount', data)
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
      this.editRow = {
        AccountName: this.tableDatas[index].AccountName,
        NickName: this.tableDatas[index].NickName,
        RoleLevel: this.tableDatas[index].RoleLevel,
        Status: this.tableDatas[index].Status
      }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateGMAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          this.toQuery()
        }
      } catch (error) {
      }
      this.loading = false
    },
    toDelete (index) {
      this.delRow = { ...this.tableDatas[index] }
      let data = { AccountName: this.delRow.AccountName }
      this.deleteRow(data)
    },
    async deleteRow (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('deleteGMAccount', data)
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
