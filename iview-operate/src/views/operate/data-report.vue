<template>
  <div>
    <ButtonGroup>
      <Button :type="tagTypes[0]" @click="clickTagBtn(0)">统计</Button>
      <Button :type="tagTypes[1]" @click="clickTagBtn(1)">用户赢</Button>
      <Button :type="tagTypes[2]" @click="clickTagBtn(2)">用户费用</Button>
      <Button :type="tagTypes[3]" @click="clickTagBtn(3)">游戏输赢统计</Button>
      <Button :type="tagTypes[4]" @click="clickTagBtn(4)">新手分析</Button>
    </ButtonGroup>
    <br>
    <br>
    <Form label-position="right" :label-width="70" inline>
      <FormItem label="玩家ID:" class="" v-if="showFormItem">
        <Input clearable type="text" v-model="query.UserID" placeholder="玩家ID"></Input>
      </FormItem>
      <FormItem label="游戏类别:" class="" v-if="showFormItem1">
        <Select v-model="query.GameName" style="width:100px" clearable>
          <Option v-for="item in game_types" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="代理ID:" class="" v-if="tagType==4">
        <Input clearable type="text" v-model="query.agentId" placeholder="代理ID"></Input>
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
     <FormItem :label-width="1">
        <Button @click="exportTable" type="success" icon="ios-download-outline">导出csv</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>
    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="per_page" class="margin-top-10"></Page>

  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      showFormItem: false,
      showFormItem1: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost', 'ghost'],
      room_names: [{ label: '全部', value: 0 }, { label: '充值', value: '充值' }, { label: '其他', value: '其他' }],
      tagTypes: ['ghost', 'ghost', 'ghost'],
      game_types: [{ label: '红黑大战', value: '红黑大战' }, { label: '百家乐', value: '百家乐' }, { label: '摇一摇', value: '摇一摇' }, { label: '百人牛牛', value: '百人牛牛' }, { label: '豪车俱乐部', value: '豪车俱乐部' }, { label: '欢乐斗地主', value: '欢乐斗地主' }, { label: '二人麻将', value: '二人麻将' }, { label: '捕鱼', value: '捕鱼' },
        { label: '神兽转盘', value: '神兽转盘' }, { label: '水果机', value: '水果机' }, { label: '四人牛牛', value: '四人牛牛' }, { label: '拼三张', value: '拼三张' }, { label: '十三张', value: '十三张' }, { label: '财神红包', value: '财神红包' }, { label: '扫雷红包', value: '扫雷红包' }],
      tagType: 0,
      loading: false,
      query: { game_type: 0, AccountName: '', servicetype: 0 },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [
      ],
      tableDatas: []
    }
  },
  mounted () {
    // this.init();
    this.tagType = 0
    this.clickTagBtn(this.tagType)
  },
  computed: {},
  methods: {
    init () {
      this.page = 1
      this.per_page = 20
      this.total = 0
      this.queryList()
    },
    sortChange (obj) {
      this.query.order_by = obj.key + ' ' + obj.order
      this.queryList()
    },
    clickTagBtn (type) {
      this.showFormItem1 = false
      if (type === 0) {
        this.tagTypes = ['primary', 'ghost', 'ghost', 'ghost', 'ghost']
        this.tagType = 0
        this.showFormItem = false
      }
      if (type === 1) {
        this.tagTypes = ['ghost', 'primary', 'ghost', 'ghost', 'ghost']
        this.tagType = 1
        this.showFormItem = true
        this.showFormItem1 = true
      }
      if (type === 2) {
        this.tagTypes = ['ghost', 'ghost', 'primary', 'ghost', 'ghost']
        this.tagType = 2
        this.showFormItem = true
      }
      if (type === 3) {
        this.tagTypes = ['ghost', 'ghost', 'ghost', 'primary', 'ghost']
        this.tagType = 3
        this.showFormItem = true
      }

      if (type === 4) {
        this.tagTypes = ['ghost', 'ghost', 'ghost', 'ghost', 'primary']
        this.tagType = 4
        this.showFormItem = false
      }
      this.datasTime = []
      this.query = {}
      this.clearDate()
      this.columns = []
      this.tableDatas = []
      this.page = 1
      this.per_page = 20
      this.total = 0
      // this.init()
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
        let action = ''

        if (this.tagType === 0) {
          action = 'getPotatoRobotStatics'
        }
        if (this.tagType === 1) {
          action = 'getUserWinTotalg'
        }
        if (this.tagType === 2) {
          action = 'getUserChargeTotal'
        }
        if (this.tagType === 3) {
          action = 'getGameWinTotal'
        }
        if (this.tagType === 4) {
          action = 'getNewPlayerList'
        }
        const result = await this.$store.dispatch(action, data)
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
    exportTable () {
      let names = ['统计数据', '用户赢数据', '用户费用数据', '游戏输赢统计', '新手分析']
      this.exportData('selection', names[this.tagType])
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
