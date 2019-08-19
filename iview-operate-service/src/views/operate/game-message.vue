<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">新增</Button>
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

    <Modal v-model="showAdd" title="添加游戏公告" width="600" :loading="loading">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="120">
        <FormItem label="标题" prop="MsgTitle">
          <Input v-model="addRow.MsgTitle" style="width:360px"></Input>
        </FormItem>
        <FormItem label="公告内容" prop="MsgContent">
          <Input v-model="addRow.MsgContent" style="width:360px" type="textarea" :autosize="{minRows: 8,maxRows: 10}" placeholder="输入公告内容..."></Input>
        </FormItem>
        <FormItem label="类型" prop="MsgType">
          <RadioGroup v-model="addRow.MsgType">
            <Radio label="1">1滚</Radio>
            <Radio label="2">2系</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="开始时间" prop="StartTime">
          <DatePicker type="datetime" placeholder="Select date and time" style="width: 360px" :value="addRow.StartTime" format="yyyy-MM-dd HH:mm:ss" @on-change="addRow.StartTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="EndTime">
          <DatePicker type="datetime" placeholder="Select date and time" style="width: 360px" :value="addRow.EndTime" format="yyyy-MM-dd HH:mm:ss" @on-change="addRow.EndTime=$event"></DatePicker>
        </FormItem>

      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>

    <Modal v-model="showEdit" title="编辑游戏公告" width="600">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="120">
        <FormItem label="标题" prop="MsgTitle" :rules="{ required: true, message: '请输入标题!', trigger: 'blur' }">
          <Input v-model="editRow.MsgTitle" style="width:360px"></Input>
        </FormItem>
        <FormItem label="公告内容" prop="MsgContent" :rules="{ required: true, message: '请输入公告内容!', trigger: 'blur' }">
          <Input v-model="editRow.MsgContent" style="width:360px" type="textarea" :autosize="{minRows: 8,maxRows: 10}" placeholder="输入公告内容..."></Input>
        </FormItem>
        <FormItem label="类型" prop="MsgType" :rules="{ required: true, message: '请选择类型!', trigger: 'blur' }">
          <RadioGroup v-model="editRow.MsgType">
            <Radio :label="'1'">滚</Radio>
            <Radio :label="'2'">系</Radio>
          </RadioGroup>

        </FormItem>
        <FormItem label="开始时间" prop="StartTime" :rules="{ required: true, message: '请选择开始时间!', trigger: 'blur' }">
          <DatePicker type="datetime" placeholder="Select date and time" style="width: 360px" :value="editRow.StartTime" format="yyyy-MM-dd HH:mm:ss" @on-change="editRow.StartTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="结束时间" prop="EndTime" :rules="{ required: true, message: '请选择结束时间!', trigger: 'blur' }">
          <DatePicker type="datetime" placeholder="Select date and time" style="width: 360px" :value="editRow.EndTime" format="yyyy-MM-dd HH:mm:ss" @on-change="editRow.EndTime=$event"></DatePicker>
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
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      loading: false,
      query: { userid: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: { MsgType: '1' },
      editRow: {},
      delRow: {},
      columns: [

      ],
      tableDatas: [],
      ruleValidate: {
        MsgTitle: [
          { required: true, message: '标题不能为空!', trigger: 'blur' }
        ],
        MsgContent: [
          { required: true, message: '内容不能为空!', trigger: 'blur' }
        ],
        StartTime: [
          { required: true, message: '请选择开始时间!', trigger: 'change' }
        ],
        EndTime: [
          { required: true, message: '请选择结束时间!', trigger: 'change' }
        ],
        MsgType: [
          { required: true, message: '请选择类型! ', trigger: 'blur' }

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

        const result = await this.$store.dispatch('getGameMessage', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          this.columns.push(
            {
              title: columnTitles[i],
              sortable: 'custom',
              minWidth: 120,
              key: columnKeys[i]
            }
          )
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
      this.addRow = { MsgType: '1' }
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
        let actionName = (data.MsgType === '1' || data.MsgType === 1) ? 'insertMessage' : 'insertSysMessage'
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
      this.editRow.StartTime = this.editRow.StartTime.length <= 10 ? this.editRow.StartTime + ' 00:00:00' : this.editRow.StartTime
      this.editRow.EndTime = this.editRow.EndTime.length <= 10 ? this.editRow.EndTime + ' 00:00:00' : this.editRow.EndTime
      this.editRow.OrderNum = 1
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
        const res = await this.$store.dispatch('updateGameMessage', data)
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
