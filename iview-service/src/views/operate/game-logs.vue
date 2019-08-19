<template>
  <div>
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
        <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[10,20,30]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="10" class="margin-top-10"></Page>
    <Modal v-model="showEdit" width="720" class="demo-tabs-style1" title="游戏信息"  :transfer="false">

      <Table size="small" :loading="gameLoading" border ref="selection" :columns="gameColumns" :data="gameTableDatas" stripe></Table>

      <Page :total="gTotal" :page-size-opts="[10,20,30]" :current="gPage" class-name="margin-top-10" @on-page-size-change="gpageSizeChange" @on-change="gpageChange" size="small" show-total show-elevator show-sizer :page-size="10" class="margin-top-10"></Page>

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
      btTypes: ['ghost', 'ghost', 'ghost'],
      game_types: [{ label: '百人牛牛', value: '百人牛牛' }, { label: '豪车俱乐部', value: '豪车俱乐部' }, { label: '斗地主', value: '斗地主' }, { label: '二人麻将', value: '二人麻将' }, { label: '捕鱼', value: '捕鱼' },
        { label: '神兽转盘', value: '神兽转盘' }, { label: '水果机', value: '水果机' }, { label: '四人牛牛', value: '四人牛牛' }, { label: '炸金花', value: '炸金花' }, { label: '十三张', value: '十三张' }],
      room_names: [{ label: '新手房', value: '新手房' }, { label: '初级房', value: '初级房' }, { label: '高级场', value: '高级场' }, { label: '富豪场', value: '富豪场' }, { label: '约战房', value: '约战房' }],

      loading: false,
      query: {},
      datasTime: [],
      page: 1,
      per_page: 10,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [
        // {
        //   title: '玩家ID',
        //   width: 100,
        //   key: 'UserID'
        // },
        // {
        //   title: '昵称',
        //   width: 120,
        //   key: 'NickName'
        // },
        // {
        //   title: '手机',
        //   width: 160,
        //   key: 'Mobile'
        // },
        // {
        //   title: '游戏',

        //   key: '游戏'
        // },
        // {
        //   title: '游戏房间',

        //   key: 'RoomName'
        // },
        // {
        //   title: '变化前',

        //   key: 'CurGold'
        // },
        // {
        //   title: '变化值',

        //   key: 'AddGold'
        // },
        // {
        //   title: 'begintime',
        //   width: 160,
        //   key: 'begintime'
        // },
        // {
        //   title: '游戏时长',
        //   width: 160,
        //   key: '游戏时长'
        // }

      ],
      tableDatas: [],
      gPage: 1,
      g_per_page: 10,
      gTotal: 0,
      GameID: '',
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
      this.btTypes = ['ghost', 'ghost', 'ghost']
    },
    changeDate (day) {
      this.datasTime = []
      var start = new Date()
      var end = new Date()
      if (day === 1) {
        this.btTypes = ['success', 'ghost', 'ghost']
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 7) {
        this.btTypes = ['ghost', 'success', 'ghost']
        start.setDate(start.getDate() - 6)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 30) {
        this.btTypes = ['ghost', 'ghost', 'success']
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

        const result = await this.$store.dispatch('getGameLogs', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            minWidth: 120,
            sortable: 'custom',
            key: columnKeys[i]
          }

          if (obj.key === 'GameID') {
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
                  this.tableDatas[params.index].GameID
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
      this.GameID = this.tableDatas[index].GameID
      this.queryGameList()
    },
    async queryGameList () {
      try {
        this.gameLoading = true
        let minIndex = (this.gPage - 1) * this.g_per_page
        let maxIndex = this.gPage * this.g_per_page
        const data = {
          GameID: this.GameID,
          page: this.gPage,
          per_page: this.g_per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.gTotal && this.gTotal && this.gPage > 1) ? this.gTotal : maxIndex
        }
        const result = await this.$store.dispatch('getGameLogs', data)
        const res = this.handleResult(result)
        this.gameColumns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
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
