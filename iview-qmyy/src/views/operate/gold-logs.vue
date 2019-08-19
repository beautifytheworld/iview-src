<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <!-- <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">调整玩家携带金币</Button>
      </FormItem> -->
      <FormItem label="ID:" class="">
        <Input clearable type="text" v-model="query.userid" placeholder="填写玩家ID"></Input>
      </FormItem>
      <FormItem label="流通类型:" class="">
        <Select v-model="query.logtype" style="width:100px" clearable>
          <Option v-for="item in logtypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="游戏:" class="">
        <Select v-model="query.LogUse" style="width:100px" clearable>
          <Option v-for="item in logUseTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
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

    <Modal v-model="showAdd" title="调整玩家携带金币" width="480">
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="140">
        <FormItem label="玩家ID" prop="UserID">
          <Input v-model="addRow.UserID" style="width:200px"></Input>
        </FormItem>
        <FormItem label="调整数量" prop="Money">
          <Input v-model="addRow.Money" style="width:200px"></Input>
        </FormItem>
        <FormItem label="调整原因" prop="reason">
          <Input v-model="addRow.reason" style="width:200px" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
      </div>
    </Modal>

     <Modal v-model="showEdit" width="720" class="demo-tabs-style1" title="金币日志"  :transfer="false">

      <Table size="small" :loading="gameLoading" border ref="selection" :columns="gameColumns" :data="gameTableDatas" stripe></Table>

      <Page :total="gTotal" :page-size-opts="[20,50,100]" :current="gPage" class-name="margin-top-10" @on-page-size-change="gpageSizeChange" @on-change="gpageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

      <div slot="footer" style="color:#f60;text-align:right">
        <!-- <Button type="default" @click="cancel">取消</Button> -->
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
      gameLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      logtypes: [{ label: '游戏', value: '游戏' }, { label: '银行', value: '银行' }, { label: '提现', value: '提现' }, { label: '系统', value: '系统' }, { label: '邮件', value: '邮件' }],
      logUseTypes: [{ label: '四人牛牛', value: 'srnn' }, { label: '斗地主', value: 'ddz' }, { label: '拼三张', value: 'zjh' }, { label: '二人麻将', value: 'ermj' },
        { label: '红黑大战', value: 'hhdz' }, { label: '百家乐', value: 'bjl' }, { label: '摇一摇', value: 'yyy' }, { label: '百人牛牛', value: 'bbnn' },
        { label: '豪车俱乐部', value: 'bcbm' }, { label: '捕鱼', value: 'fish' }, { label: '神兽转盘', value: 'fqzs' }, { label: '水果机', value: 'sgj' },
        { label: '财神红包', value: 'qhb' }, { label: '扫雷红包', value: 'slhb' } ],
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
      columns: [
        // {
        //   title: 'userid',
        //   width: 100,
        //   key: 'userid'
        // },
        // {
        //   title: 'logtype',
        //   width: 100,
        //   key: 'logtype'
        // },
        // {
        //   title: '原因',
        //   key: 'LogUse'
        // },
        // {
        //   title: '变化值',
        //   key: 'LogValue'
        // },
        // {
        //   title: '变化后',
        //   key: 'AfterValue'
        // },
        // {
        //   title: '记录时间',
        //   width: 160,
        //   key: 'RecordTime'

        // },
        // {
        //   title: 'Uuid',
        //   key: 'Uuid'
        // }
      ],
      tableDatas: [],
      ruleValidate: {
        UserID: [
          { required: true, message: '玩家ID不能为空!', trigger: 'blur' }
        ],
        Money: [
          { required: true, message: '调整数量不能为空!', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请填写调整原因！', trigger: 'blur' }

        ]

      },
      gPage: 1,
      g_per_page: 20,
      gTotal: 0,
      Uuid: '',
      gameTableDatas: [],
      gameColumns: []
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
        const result = await this.$store.dispatch('getGoldLogs', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 140,
            align: 'center',
            key: columnKeys[i]
          }
          if (obj.key === 'Uuid') {
            obj.render = (h, params) => {
              return h('div', [
                h(
                  'a',
                  {
                    style: {
                    },
                    on: {
                      click: () => {
                        // this.$Message.error('游戏对局ID:' + this.tableDatas[params.index].GameID + '暂无接口')
                        this.showEditModal(params.index)
                      }
                    }
                  },
                  this.tableDatas[params.index].Uuid
                )
              ])
            }
          }
          this.columns.push(obj)
        }
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
        const res = await this.$store.dispatch('updateGold', data)
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
    gpageChange (page) {
      this.gPage = page
      this.queryGameList()
    },
    gpageSizeChange (perPage) {
      if (this.g_per_page !== perPage) {
        this.g_per_page = perPage
        this.queryGameList()
      }
    },
    showEditModal (index) {
      this.showEdit = true
      this.Uuid = this.tableDatas[index].Uuid
      this.queryGameList()
    },
    async queryGameList () {
      try {
        this.gameLoading = true
        let minIndex = (this.gPage - 1) * this.g_per_page
        let maxIndex = this.gPage * this.g_per_page
        const data = {
          Uuid: this.Uuid,
          page: this.gPage,
          per_page: this.g_per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.gTotal && this.gTotal && this.gPage > 1) ? this.gTotal : maxIndex
        }
        const result = await this.$store.dispatch('getGoldLogs', data)
        const res = this.handleResult(result)
        this.gameColumns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 120,
            key: columnKeys[i]
          }
          this.gameColumns.push(obj)
        }
        this.gameTableDatas = res.tableDatas
        this.gTotal = res.total
        // this.arrTitles = res.arrTitles
      } catch (error) {
      }
      this.gameLoading = false
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
