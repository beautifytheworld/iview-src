<template>
  <div>
    <Row type="flex" justify="start" class="code-row-bg" :gutter="24">
      <Col :span="24">
      <div class="home-top">
        <div class="top-title">
          <span class="title">
            <span style="background:#1abc9c;">&nbsp;</span>
            &nbsp; 提现订单
          </span>
          <Button icon="loop" :loading="loading" @click="toLoading" class="title-refresh">刷新</Button>
        </div>
      </div>
      </Col>

      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/ze.png" alt="" class="item-logo">
        <p class="item-title">总额:</p>
        <p class="item-number">{{staticDatas['总额']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4" span="4">
      <div class="flex-item"> <img src="./images/cgje.png" alt="" class="item-logo">
        <p class="item-title">成功金额:</p>
        <p class="item-number">{{staticDatas['成功金额']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/ddzs.png" alt="" class="item-logo">
        <p class="item-title">订单总数:</p>
        <p class="item-number">{{staticDatas['订单总数']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/cgbs.png" alt="" class="item-logo">
        <p class="item-title">成功笔数:</p>
        <p class="item-number">{{staticDatas['成功笔数']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/cgl.png" alt="" class="item-logo">
        <p class="item-title">成功率:</p>
        <p class="item-number">{{staticDatas['成功率']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/czrs.png" alt="" class="item-logo">
        <p class="item-title">人数:</p>
        <p class="item-number">{{staticDatas['人数']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/rj.png" alt="" class="item-logo">
        <p class="item-title">人均:</p>
        <p class="item-number">{{staticDatas['人均']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/jrbs.png" alt="" class="item-logo">
        <p class="item-title">今日笔数:</p>
        <p class="item-number">{{staticDatas['今日笔数']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/jrje.png" alt="" class="item-logo">
        <p class="item-title">今日金额:</p>
        <p class="item-number">{{staticDatas['今日金额']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/jrrs.png" alt="" class="item-logo">
        <p class="item-title">今日人数:</p>
        <p class="item-number">{{staticDatas['今日人数']}}&nbsp;</p>
      </div>
      </Col>
    </Row>
    <br>

  <Form ref="formDynamic" :model="query" label-position="right" :label-width="70" inline>

      <FormItem label="ID:" prop="UserID" >
        <Input clearable type="text" v-model="query.UserID" placeholder="填写玩家ID"></Input>
      </FormItem>
      <FormItem label="订单ID:" class="">
        <Input clearable type="text" v-model="query.OrderID" placeholder="填写订单ID"></Input>
      </FormItem>
      <!-- <FormItem label="玩家账号:" class="">
                <Input clearable type="text" v-model="query.Mobile" placeholder="填写玩家账号"></Input>
            </FormItem> -->
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
      <FormItem label="时间选择:" class="">
        <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>
        <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery('formDynamic')" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading"  @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>
     <GameLog :show="showGame" @cancel="showGame=false" @page-change="gpageChange" @page-size-change="gpageSizeChange" :loading="gameLoading" :scolumns="scolumns" :stableDatas="stableDatas" :columns="gColumns"  :tableDatas="gameTableDatas" :current="gPage" :total="gTotal" ></GameLog>
 <Modal v-model="showAdd"
           title="请填写忽略备注:"
           width="400">

          <Input v-model="remark" type="textarea"
                  :autosize="{minRows: 2,maxRows: 4}" placeholder="输入忽略备注..." ></Input>
  <div slot="footer"
           style="color:#f60;text-align:right">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toHulv" :loading="loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { getKey } from '@/utils/auth'
import GameLog from '@/components/GameLog/game-log.vue'
export default {
  mixins: [myMixin],
  components: {
    GameLog
  },
  data () {
    return {
      remark: '',
      gameLoading: false,
      showGame: false,
      gameTableDatas: [],
      gTotal: 0,
      gColumns: [],
      gPage: 1,
      g_per_page: 20,
      gameUserId: 0,
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      game_types: [{ label: '全部', value: 0 }, { label: '捕鱼', value: '捕鱼' }, { label: '注册', value: '注册' }],
      statusObj: {
        '0': '待审核',
        '1': '提现成功',
        '2': '拒绝提现',
        '3': '待打款',
        '5': '忽略' },
      loading: false,
      query: { game_type: 0, UserID: '', Status: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [],
      tableDatas: [],
      staticDatas: {},
      scolumns: [],
      stableDatas: []
    }
  },
  mounted () {
    this.queryWithdrawStatics()
  },
  computed: {},
  methods: {
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
    showGameModal (index) {
      this.showGame = true
      this.gameUserId = this.tableDatas[index].UserID
      this.gPage = 1
      this.toQueryAGGoldSource()
      this.queryGameList()
    },
    async queryGameList () {
      try {
        this.gameLoading = true
        let minIndex = (this.gPage - 1) * this.g_per_page
        let maxIndex = this.gPage * this.g_per_page
        const data = {
          UserId: this.gameUserId,
          page: this.gPage,
          per_page: this.g_per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.gTotal && this.gTotal && this.gPage > 1) ? this.gTotal : maxIndex
        }
        const result = await this.$store.dispatch('getGameLogs', data)
        const res = this.handleResult(result)
        this.gColumns = []
        this.gameTableDatas = []
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
          if (obj.key === 'AddGold') {
            obj.render = (h, params) => {
              return h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: params.row.AddGold <= 0 ? '#ed3f14' : '#19be6b'
                    }
                  }, params.row.AddGold
                )
              ])
            }
          }
          this.gColumns.push(obj)
        }
        this.gameTableDatas = res.tableDatas
        this.gTotal = res.total
        // this.arrTitles = res.arrTitles
      } catch (error) {
      }
      this.gameLoading = false
    },
    async toQueryAGGoldSource () {
      try {
        const data = {UserId: this.gameUserId}
        const result = await this.$store.dispatch('getAGGoldSource', data)
        const res = this.handleResult(result)

        this.scolumns = []
        this.stableDatas = []
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
          this.scolumns.push(obj)
        }
        this.stableDatas = res.tableDatas
      } catch (error) {
      }
    },
    init () {
      this.queryList()
    },
    sortChange (obj) {
      this.query.order_by = obj.key + ' ' + obj.order
      this.queryList()
    },
    pickerChange (am, b) {
      this.datasTime = am
      this.clearDate()
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
    async queryWithdrawStatics () {
      try {
        this.loading = true
        const result = await this.$store.dispatch('getWithdrawStatics')
        const res = this.handleResult(result)
        this.staticDatas = res.tableDatas[0]
      } catch (error) {
      }
      this.loading = false
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

        const result = await this.$store.dispatch('getExchangeOrders', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: columnTitles[i].length * 15 + 48,
            align: 'center',
            key: columnKeys[i]
          }
          if (obj.key === 'UserID') {
            obj.render = (h, params) => {
              return h('div', [
                h(
                  'a',
                  {
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.showGameModal(params.index)
                      }
                    }
                  }, params.row.UserID
                )

              ])
            }
          }
          if (obj.key === 'Status') {
            obj.render = (h, params) => {
              return h('span', this.statusObj[params.row.Status])
            }
          }
          this.columns.push(obj)
        }
        if (getKey('nLv') === '1000') {
          this.columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            width: 170,
            render: (h, params) => {
              if (params.index !== 10 && params.index !== 20 && params.index !== 30) {
                if (params.row.Status === 0 || params.row.Status === '0') {
                  return h('div', [
                    h('Poptip',
                      { props: { confirm: true, title: '您确认要拒绝吗？' },
                        style: { textAlign: 'left' },
                        on: {
                          'on-ok': () => { this.toUpdateSettlement(params.index, '2') },
                          'on-cancel': () => {}
                        }
                      },
                      [ h('Button', { props: { type: 'error', size: 'small' } }, '拒绝') ]
                    ),
                    h('Poptip',
                      { props: { confirm: true, title: '您确认要同意吗？' },
                        style: { textAlign: 'left', marginLeft: '5px' },
                        on: {
                          'on-ok': () => { this.toUpdateSettlement(params.index, '3') },
                          'on-cancel': () => {}
                        }
                      },
                      [ h('Button', { props: { type: 'success', size: 'small' } }, '同意') ]
                    ),
                    h('Button', { props: { type: 'default', size: 'small' },
                      on: {
                        'click': () => {
                          this.editRow = {
                            OrderID: this.tableDatas[params.index].OrderID,
                            Status: '5'}
                          this.showAdd = true
                        }
                      },
                      style: { textAlign: 'left', marginLeft: '5px' } }, '忽略')
                  ])
                } else if ((params.row.Status === 1 || params.row.Status === '1') && params.row.WithdrawChannel === '银行卡') {
                  return h('div', [
                    h('Poptip',
                      { props: { confirm: true, title: '您确认要退款吗？' },
                        style: { textAlign: 'left' },
                        on: {
                          'on-ok': () => { this.toUpdateSettlement(params.index, '4') },
                          'on-cancel': () => {}
                        }
                      },
                      [ h('Button', { props: { type: 'primary', size: 'small' } }, '退款') ]
                    )
                  ])
                } else {
                  return h('div', '---')
                }
              }
            }
          })
        }
        this.tableDatas = res.tableDatas
        this.total = res.total
      } catch (error) {
      }
      this.queryLoading = false
    },
    toQuery (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.page = 1
          this.queryList()
        }
      })
    },
    toUpdateSettlement (index, status) {
      let data = {
        OrderID: this.tableDatas[index].OrderID,
        Status: status
      }
      this.saveEdit(data)
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateExchange', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.$Message.success('操作成功!')
          setTimeout(() => {
            this.queryList()
          }, 2500)
        }
      } catch (error) {
      }
      this.loading = false
    },
    toLoading () {
      this.queryWithdrawStatics()
    },
    cancel () {
      this.remark = ''
      this.showAdd = false
      this.editRow = {}
    },
    toHulv () {
      if (this.remark.trim().length) {
        this.editRow.remark = this.remark
        this.saveEdit(this.editRow)
        this.showAdd = false
      } else {
        this.$Message.error('请输入备注!')
      }
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
.home-top {
  height: 40px;
  line-height: 40px;
  background: #f0f4f7;
  margin-bottom: 5px;
  .top-title {
    .title {
      float: left;
      font-size: 13px;
      color: #999;
    }
    .title-refresh {
      float: right;
      margin-top: 5px;
      margin-right: 10px;
      height: 30px;
    }
  }
}
.flex-item {
  border: 1px solid #ebebeb;
  padding: 8px;
  background: #f0f4f7;
  margin-bottom: 10px;
  .item-logo {
    float: left;
    margin: 4px 12px 0 10px;
  }
  .item-title {
    font-size: 13px;
    color: #a0a1a3;
    font-weight: 300;
  }
  .item-number {
    font-weight: 700;
    font-size: 16px;
    color: #707579;
  }
}
</style>
