<template>
  <div>
    <Row type="flex" justify="start" class="code-row-bg" :gutter="24">
      <Col :span="24">
      <div class="home-top">
        <div class="top-title">
          <span class="title">
            <span style="background:#1abc9c;">&nbsp;</span>
            &nbsp; 游戏税收
          </span>
          <Button icon="loop" :loading="loading" @click="toLoading" class="title-refresh">刷新</Button>
        </div>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/ze.png" alt="" class="item-logo">
        <p class="item-title">总税收:</p>
        <p class="item-number">{{staticDatas['总税收']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4" span="4">
      <div class="flex-item"> <img src="./images/u226.png" alt="" class="item-logo">
        <p class="item-title">代理税收:</p>
        <p class="item-number">{{staticDatas['代理税收']}}&nbsp;</p>
      </div>
      </Col>
      <Col :xs="20" :sm="12" :md="8" :lg="4">
      <div class="flex-item"> <img src="./images/u235.png" alt="" class="item-logo">
        <p class="item-title">平台税收:</p>
        <p class="item-number">{{staticDatas['平台税收']}}&nbsp;</p>
      </div>
      </Col>
    </Row>
    <br>
    <Form label-position="right" :label-width="70" inline>

      <FormItem label="ID:" class="">
        <Input clearable type="text" v-model="query.UserId" placeholder="填写玩家ID"></Input>
      </FormItem>
      <FormItem label="玩家昵称:" class="">
        <Input clearable type="text" v-model="query.NickName" placeholder="填写玩家昵称"></Input>
      </FormItem>
      <FormItem label="游戏类别:" class="">
        <Select v-model="query.game_type" style="width:100px" clearable>
          <Option v-for="item in game_types" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="房间:" class="">
        <Select v-model="query.RoomName" style="width:100px" clearable>
          <Option v-for="item in room_names" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      arrDatas: [123123, 234, 23, 4, 1, 23, 12, 31, 21],
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      game_types: [{ label: '百人牛牛', value: '百人牛牛' }, { label: '豪车俱乐部', value: '豪车俱乐部' }, { label: '斗地主', value: '斗地主' }, { label: '二人麻将', value: '二人麻将' }, { label: '捕鱼', value: '捕鱼' },
        { label: '神兽转盘', value: '神兽转盘' }, { label: '水果机', value: '水果机' }, { label: '四人牛牛', value: '四人牛牛' }, { label: '拼三张', value: '拼三张' }, { label: '十三张', value: '十三张' }, { label: '财神红包', value: '财神红包' }, { label: '扫雷红包', value: '扫雷红包' }],
      room_names: [{ label: '新手房', value: '新手房' }, { label: '初级房', value: '初级房' }, { label: '高级场', value: '高级场' }, { label: '富豪场', value: '富豪场' }, { label: '约战房', value: '约战房' }],

      loading: false,
      query: { UserId: '' },
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
        //   title: 'UserId',
        //   width: 160,
        //   key: 'UserId'

        // },
        // {
        //   title: '昵称',
        //   width: 200,
        //   key: 'NickName'
        // },
        // {
        //   title: '手机',
        //   width: 200,
        //   key: 'Mobile'
        // },
        // {
        //   title: '游戏',
        //   minWidth: 200,
        //   key: '游戏'
        // },
        // {
        //   title: '游戏房间',
        //   minWidth: 200,
        //   key: 'RoomName'
        // },
        // {
        //   title: '税收',
        //   width: 200,
        //   key: 'Tax'
        // },
        // {
        //   title: 'begintime',
        //   width: 160,
        //   key: 'begintime'
        // },
        // {
        //   title: '归属代理',
        //   width: 180,
        //   key: 'AgentId'
        // }
      ],
      tableDatas: [],
      staticDatas: {}
    }
  },
  mounted () {
    this.queryTaxStatics()
  },
  computed: {},
  methods: {
    init () {
      this.queryTaxStatics()
      let timeInterval = setInterval(() => {
        this.queryTaxStatics()
      }, 60000)
      this.$store.commit('SET_TIME_INTERVAL', timeInterval)
    },
    selectChange () {

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

    async queryTaxStatics () {
      try {
        this.loading = true
        const result = await this.$store.dispatch('getTaxStatics')
        const res = this.handleResult(result, ['总税收', '代理税收', '平台税收'])
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

        const result = await this.$store.dispatch('getGameTax', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          this.columns.push(
            {
              title: columnTitles[i],
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
    toLoading () {
      this.queryTaxStatics()
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
