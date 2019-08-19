<template>
  <div>
    <Form label-position="right" :label-width="1" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal"
                type="error"
                icon="plus">发红包</Button>
      </FormItem>
      <FormItem :label-width="1">
        <Button @click="showAddEmailModal"
                type="success"
                icon="paper-airplane">发邮件</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd"
           title="发红包"
           width="580">
      <Form :model="addRow"
            ref="formValidate"
            :rules="ruleValidate"
            label-position="right"
            :label-width="160">
        <FormItem label="红包昵称"
                  prop="redName">
          <Input v-model="addRow.redName"
                 style="width:240px"></Input>
        </FormItem>
        <FormItem label="显示金额"
                  prop="showMoney">
          <Input v-model="addRow.showMoney"
                 style="width:240px"></Input>
        </FormItem>
        <FormItem label="实际金额"
                  prop="realMoney">
          <Input v-model="addRow.realMoney"
                 style="width:240px"></Input>
        </FormItem>
        <FormItem label="红包个数"
                  prop="redNum">
          <Input v-model="addRow.redNum"
                 style="width:240px"></Input>
        </FormItem>

        <FormItem label="指定账号"
                  prop="account">
                 <Input v-model="addRow.accounts"
                 style="width:320px"
                 type="textarea"
                 :autosize="{minRows: 4,maxRows: 6}"
                 placeholder="输入账号, 多个账号用英文逗号隔开, eg:123,234,456"></Input>
        </FormItem>

      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toAdd('formValidate')"
                :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showAddEmail"
           title="发用户邮件"
           width="580">
      <Form :model="addRow"
            ref="formValidateEmail"
            :rules="ruleValidateEmail"
            label-position="right"
            :label-width="140">
        <FormItem label="标题"
                  prop="title">
          <Input v-model="addRow.title"
                 style="width:300px"></Input>
        </FormItem>
        <FormItem label="内容"
                  prop="content">
            <Input v-model="addRow.content"
                 style="width:300px"
                 type="textarea"
                 :autosize="{minRows: 6,maxRows: 10}"
                 placeholder="输入邮件内容。。。"></Input>
        </FormItem>
        <FormItem label="金额"
                  prop="money">
          <Input v-model="addRow.money"
                 style="width:150px" placeholder="0表示没奖励"></Input>
        </FormItem>

        <FormItem label="指定账号"
                  prop="accounts">
                 <Input v-model="addRow.accounts"
                 style="width:300px"
                 type="textarea"
                 :autosize="{minRows: 4,maxRows: 6}"
                 placeholder="输入账号, 多个账号用英文逗号隔开, eg:123,234,456"></Input>
        </FormItem>

      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toSend('formValidateEmail')"
                :loading="loading">发送</Button>
      </div>
    </Modal>

    <Modal v-model="showEdit" title="修改红包设置" width="580" :styles="{top: '100px'}">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">

        <FormItem label="开始时间"   >

         <DatePicker @on-change="pickerChangeStartTime" :value="editRow.StartTime" format="yyyy/MM/dd HH:mm:ss"
         type="datetime"  style="width: 200px"></DatePicker>

        </FormItem>
        <FormItem label="结束时间"   >
          <DatePicker @on-change="pickerChangeEndTime" :value="editRow.EndTime" format="yyyy/MM/dd HH:mm:ss"
         type="datetime"  style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="数量"   >
          <Input v-model="editRow.Amount" style="width:200px"></Input>
        </FormItem>
        <FormItem label="显示数量"   >
          <Input v-model="editRow.DisPlayAmount" style="width:200px"></Input>
        </FormItem>
        <FormItem label="红包个数"   >
          <Input v-model="editRow.PlayerNum" style="width:200px"></Input>
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
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      loading: false,
      ntypeObj: {
        qq: 'QQ', wx: '微信'
      },
      stateObj: {
        '0': '禁用', '1': '启用'
      },
      query: { ntype: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      showAddEmail: false,
      addRow: { ntype: 'qq' },
      editRow: {},
      columns: [],
      tableDatas: [],
      ruleValidate: {
        redName: [
          { required: true, message: '红包昵称不能为空!', trigger: 'change' }
        ],
        // account: [
        //   { required: true, message: '指定账号不能为空!', trigger: 'change' }
        // ],
        redNum: [
          { required: true, message: '红包数量不能为空!', trigger: 'change' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }
        ],
        showMoney: [
          { required: true, message: '金额不能为空! ', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }

        ],
        realMoney: [
          { required: true, message: '金额不能为空! ', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }

        ]
      },
      ruleValidateEmail: {
        title: [
          { required: true, message: '标题不能为空!', trigger: 'change' }
        ],
        content: [
          { required: true, message: '内容不能为空!', trigger: 'change' }
        ],
        accounts: [
          { required: true, message: '账号不能为空!', trigger: 'change' }
        ],
        money: [
          { required: true, message: '金额不能为空!', trigger: 'change' },
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
    // this.init();
  },
  computed: {},
  methods: {
    init () {
      this.queryList()
    },
    sortChange (obj) {
      this.query.order_by = obj.key + ' ' + obj.order
      this.queryList()
    },
    pickerChangeStartTime (am, b) {
      this.editRow.StartTime = am
    },
    pickerChangeEndTime (am, b) {
      this.editRow.EndTime = am.replace(/00:00:00/, '23:59:59')
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

        const result = await this.$store.dispatch('getRedPacketSetting', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 120,
            align: 'center',
            key: columnKeys[i]
          }

          if (obj.key === 'State') {
            obj.render = (h, params) => {
              return h('span', this.stateObj[params.row.State])
            }
          }
          this.columns.push(obj)
        }
        this.columns.push({
          title: '操作',
          key: 'action',
          // fixed: 'right',
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
      this.showAddEmail = false
    },
    showAddModal () {
      this.showAdd = true
      this.handleReset('formValidate')
      this.addRow = {}
    },
    showAddEmailModal () {
      this.showAddEmail = true
      this.handleReset('formValidateEmail')
      this.addRow = {}
    },
    toAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.addRow.accounts) {
            var accounts = this.addRow.accounts.split(',')
            var len = accounts.length
            if (!accounts[len - 1]) {
              len = len - 1
            }
            if (this.addRow.redNum < len) {
              this.$Message.error('红包数量不能小于账号数!')
              return
            }
          }

          this.add(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('insertRedPacket', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('添加成功!')
        }
      } catch (error) {
      }
      this.loading = false
    },
    toSend (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.sendEmail(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async sendEmail (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('insertUserMessage', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAddEmail = false
          this.$Message.success('发送成功!')
        }
      } catch (error) {
      }
      this.loading = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { 'StartTime': this.tableDatas[index].StartTime.length <= 10 ? this.tableDatas[index].StartTime + ' 00:00:00' : this.tableDatas[index].StartTime,
        'EndTime': this.tableDatas[index].EndTime.length <= 10 ? this.tableDatas[index].EndTime + ' 00:00:00' : this.tableDatas[index].EndTime,
        'Amount': this.tableDatas[index].Amount,
        'DisPlayAmount': this.tableDatas[index].DisPlayAmount,
        'PlayerNum': this.tableDatas[index].PlayerNum
      }
    },
    toEdit (name) {
      this.saveEdit(this.editRow)
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateRedPacketSetting', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          setTimeout(() => {
            this.toQuery()
          }, 1000)
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
        const res = await this.$store.dispatch('deleteMerchantSetting', data)
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
