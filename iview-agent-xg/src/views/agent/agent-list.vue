<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus" v-show="showAddBtn">新增</Button>
      </FormItem>
      <FormItem label="代理ID:" class="">
        <Input clearable type="text" v-model="query.AgencyID" placeholder="填写代理ID"></Input>
      </FormItem>
      <FormItem label="代理账号:" class="">
        <Input clearable type="text" v-model="query.AccountName" placeholder="填写代理账号"></Input>
      </FormItem>
      <FormItem label="代理等级:" class="">
        <Input clearable type="text" v-model="query.AgentLv" placeholder="填写代理等级"></Input>
      </FormItem>
      <FormItem label="绑定手机:" class="">
        <Input clearable type="text" v-model="query.Mobile" placeholder="填写手机号"></Input>
      </FormItem>

      <FormItem label="账户余额:" class="">
        <Input clearable type="text" v-model="query.minMoney" placeholder="" style="width:88px;"></Input>
        -
        <Input clearable type="text" v-model="query.maxMoney" placeholder="" style="width:88px;"></Input>
      </FormItem>
      <!-- <FormItem label="通道:" class="">
                <Select v-model="query.game_type" style="width:100px">
                    <Option v-for="item in game_types" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem> -->
      <FormItem label="状态:" class="">
        <Select v-model="query.Status" style="width:100px" clearable>
          <Option v-for="(item,key) in statusObj" :value="key" :key="key">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="注册时间:" class="">
         <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>         <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="直属上级ID:" class="" :label-width="80">
        <Input clearable type="text" v-model="query.ParentID" placeholder="直属上级ID"></Input>
      </FormItem>
      <FormItem label="上级树ID:" class="">
        <Input clearable type="text" v-model="query.ParentTree" placeholder="上级树ID"></Input>
      </FormItem>
       <FormItem label="微信:" class="">
        <Input clearable type="text" v-model="query.WXID" placeholder="微信ID"></Input>
      </FormItem>
      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading"  @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd" title="添加代理信息" width="520">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <FormItem label="账号" prop="AccountName">
          <Input v-model="addRow.AccountName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="昵称" prop="NickName">
          <Input v-model="addRow.NickName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="密码" prop="AcPwd">
          <Input v-model="addRow.AcPwd" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="Pwd_confirm">
          <Input v-model="addRow.Pwd_confirm" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="提成比例" prop="RebatePercent">
          <div style="display:flex;">
            <Input v-model="addRow.RebatePercent" style="width:80px">
            <span slot="append">%</span>
            </Input>
            <div style="color:#f00;padding-left:5px;">可设定范围：0-{{nPersent}},设置后比例只可上调不可下调！</div>

          </div>
        </FormItem>
        <FormItem label="自动升降返点" prop="animal" v-if="nLv==0">
          <RadioGroup v-model="addRow.animal">
             <Radio label="1">是</Radio>
             <Radio label="0">否</Radio>
        </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showEdit" title="修改代理信息" width="520"  class="demo-tabs-style1">
      <Form :model="editRow" ref="editFormValidate" :rules="editFormRuleValidate" label-position="right" :label-width="120">
        <FormItem label="代理ID " prop="">
          <Input v-model="editRow.AgencyID" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="账号 " prop="">
          <Input v-model="editRow.AccountName" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="昵称 " prop="NickName">
          <Input v-model="editRow.NickName" style="width:200px"></Input>
        </FormItem>
        <FormItem label="密码 " prop="AcPwd">
          <Input v-model="editRow.AcPwd" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="确认密码 " prop="Pwd_confirm">
          <Input v-model="editRow.Pwd_confirm" type="password" style="width:200px"></Input>
        </FormItem>
        <FormItem label="状态 " prop="Status">
          <Select v-model="editRow.Status" style="width:100px">
            <Option value="2">禁用</Option>
            <Option value="1">启用</Option>
          </Select>
        </FormItem>
        <FormItem label="提成比例 " prop="RebatePercent">
          <div style="display:flex;">
            <Input v-model="editRow.RebatePercent" style="width:80px">
            <span slot="append">%</span>
            </Input>
            <div style="color:#f00;padding-left:5px;">可设定范围：0-{{nPersent}},设置后比例只可上调不可下调！</div>

          </div>

        </FormItem>
         <FormItem label="支付宝:" prop="AliPay">
              <Input v-model="editRow.AliPay" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('AliPay')"> 重设</div>
              </Input>
            </FormItem>
         <FormItem label="微信ID:" prop="WXID">
              <Input v-model="editRow.WXID" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('WXID')"> 重设</div>
              </Input>
            </FormItem>

      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">确定</Button>
      </div>
    </Modal>
     <Modal v-model="resetModal" width="360" class-name="reset-modal" :styles="{top: '200px'}" >
            <p slot="header" style="">
              <Icon type="information-circled"></Icon>
              <span>确认重置</span>
            </p>
            <div style="text-align:center">
              <p>你确定？</p>
            </div>
            <div slot="footer">
              <Button size="large"  :disabled="modal_loading" @click="resetModal=false">取消</Button>
              <Button type="primary" size="large"  :loading="modal_loading" @click="clearSomething">确定</Button>
            </div>
          </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { getKey } from '@/utils/auth'

export default {
  mixins: [myMixin],
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请输入密码!'))
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
        callback(new Error('请再次输入密码!'))
      } else if (value !== this.addRow.AcPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      modal_loading: false,
      resetModal: false,
      resetType: '',
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      game_types: [{ label: '全部', value: 0 }, { label: '捕鱼', value: '捕鱼' }, { label: '注册', value: '注册' }],
      statusObj: { '1': '启用', '2': '禁用' },
      loading: false,
      query: { UserID: '', Status: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showAddBtn: false,
      showEdit: false,
      showAdd: false,
      addRow: {animal: '0'},
      editRow: {},
      delRow: {},
      columns: [],
      tableDatas: [],
      ruleValidate: {
        AccountName: [
          { required: true, message: '账号不能为空！', trigger: 'blur' }
        ],
        NickName: [
          { required: true, message: '昵称不能为空！', trigger: 'blur' }
        ],
        AcPwd: [
          { required: true, message: '密码不能为空！', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        Pwd_confirm: [
          { required: true, message: '请再次输入密码！', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'change' }
        ],
        RebatePercent: [
          { required: true, message: '请填写提成比例！', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }
        ]
      },
      editFormRuleValidate: {
        NickName: [
          { required: true, message: '昵称不能为空！', trigger: 'blur' }
        ],
        Status: [{ required: true, message: '请选择状态！', trigger: 'blur' }],
        RebatePercent: [
          { required: true, message: '请填写提成比例！', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }
        ]
      }
    }
  },
  mounted () {
    let nLv = getKey('nLv')
    this.showAddBtn = !(nLv >= 5)
    if (+nLv !== 0) {
      this.addRow = {}
    }
  },
  computed: {
    nPersent: function () {
      return getKey('nPercent')
    },
    nLv: function () {
      return +getKey('nLv')
    }
  },
  methods: {
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

        const result = await this.$store.dispatch('getAgentList', data)

        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            minWidth: columnTitles[i].length * 15 + 48,
            align: 'center',
            sortable: 'custom',
            key: columnKeys[i]
          }
          if (obj.key === 'Status') {
            obj.render = (h, params) => {
              return h('span', this.statusObj[params.row.Status])
            }
          }
          this.columns.push(obj)
        }
        this.columns.push({
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
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
              )
            ])
          }
        })
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
        const res = await this.$store.dispatch('insertAgentAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('添加成功!')
          this.toQuery()
        }
        this.loading = false
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
    showEditModal (index) {
      this.showEdit = true
      this.handleReset('editFormValidate')
      this.editRow = {
        AcPwd: '',
        Pwd_confirm: '',
        AgencyID: this.tableDatas[index].AgencyID,
        AccountName: this.tableDatas[index].AccountName,
        NickName: this.tableDatas[index].NickName,
        Status: this.tableDatas[index].Status,
        RebatePercent: this.tableDatas[index].RebatePercent,
        WXID: this.tableDatas[index].WXID,
        AliPay: this.tableDatas[index].AliPay
      }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.editRow.AcPwd.trim() !== this.editRow.Pwd_confirm.trim()) {
            this.$Message.error('两次输入密码不一致!')
          } else {
            this.saveEdit(this.editRow)
          }
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateAgentAccount', data)
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
        const res = await this.$store.dispatch('deleteAgentAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('删除成功!')
          this.toQuery()
        }
        this.loading = false
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
    toClear (type) {
      this.resetModal = true
      this.resetType = type
    },
    async clearSomething () {
      try {
        this.modal_loading = true
        let data = {AgencyID: this.editRow.AgencyID, resetType: this.resetType}
        const res = await this.$store.dispatch('updateAgentAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.resetModal = false
          this.$Message.success('操作成功!')
          this.editRow[this.resetType] = ''
        }
      } catch (error) {

      }
      this.modal_loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}

.demo-tabs-style1 {
  .ivu-tabs-card {
    .ivu-tabs-content {
      .ivu-tabs-tabpane {
        // background: #f00;
        margin-top: -16px;
        padding-top: 16px;
        padding-left: 5px;
        // border-left: 1px solid #dddee1;
        // border-right: 1px solid #dddee1;
        // border-bottom: 1px solid #dddee1;
      }
    }
  }
  .ivu-input-group-append {
    .self-input-append {
      background: #ed3f14;
      margin: -5px -10px;
      height: 32px;
      line-height: 32px;
      width: 60px;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
