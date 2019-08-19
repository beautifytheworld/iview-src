<template>
  <div>
    <Form label-position="right" :label-width="70" inline>

      <!-- <FormItem label="商人ID:" class="">
                <Input clearable type="text" v-model="query.Mobile" placeholder="填写商人ID"></Input>
            </FormItem> -->
      <FormItem label="代理ID:" class="">
        <Input clearable type="text" v-model="query.AgencyID" placeholder="填写代理ID"></Input>
      </FormItem>

      <FormItem label="转出金额:" class="">
        <Input clearable type="text" v-model="query.minMoney" placeholder="" style="width:88px;"></Input>
        -
        <Input clearable type="text" v-model="query.maxMoney" placeholder="" style="width:88px;"></Input>
      </FormItem>
      <!-- <FormItem label="状态:" class="">
                <Select v-model="query.Status" style="width:100px">
                    <Option v-for="item in room_names" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem> -->
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

    <Modal v-model="showModal" title="转账记录信息" width="520">
      <Form :model="showRow" label-position="right" :label-width="140">
        <FormItem label="订单ID：" prop="AccountName">
          <Input v-model="showRow.订单ID" style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="订单类型：" prop="NickName">
          <Input :value="'充值'" style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="代理名称：" prop="AcPwd">
          <Input v-model="showRow.代理名称"  style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="用户ID：" prop="Pwd_confirm">
          <Input v-model="showRow.转到玩家"  style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="充值金额：" prop="Pwd_confirm">
          <Input :value="-(showRow.转出金额)"  style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="大写金额：" prop="Pwd_confirm">
          <Input :value="moneyUppercase(-showRow.转出金额)"   style="width:240px" readonly></Input>
        </FormItem>
        <FormItem label="充值时间：" prop="Pwd_confirm">
          <Input v-model="showRow.RecordTime"  style="width:240px" readonly></Input>
        </FormItem>

      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="showModal=false">关 闭</Button>
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
      room_names: [{ label: '全部', value: 0 }, { label: '正常', value: '1' }, { label: '已封', value: '2' }],
      loading: false,
      query: { game_type: 0, UserID: '', Status: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showModal: false,
      showAdd: false,
      addRow: {},
      showRow: {},
      columns: [
        // {
        //   sortable: 'custom',
        //   title: '订单ID',
        //   width: 260,
        //   key: 'a0',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('a', {
        //         // style: {
        //         //     color: '#868686'
        //         // },
        //         class: 'mouse-on',
        //         on: {
        //           click: () => {
        //             this.showShowModal(params.index)
        //           }
        //         } }, params.row.a0)

        //     ])
        //   }
        // }
        // {
        //   sortable: 'custom',
        //   title: '代理ID',
        //   width: 100,
        //   key: 'a1'
        // },
        // {
        //   sortable: 'custom',
        //   title: '代理名称',
        //   minWidth: 120,
        //   key: 'a2'
        // },
        // {
        //   sortable: 'custom',
        //   title: '转出金额',
        //   minWidth: 120,
        //   key: 'a3'
        // },
        // {
        //   sortable: 'custom',
        //   title: '转出后余额',
        //   minWidth: 120,
        //   key: 'a4'
        // },
        // {
        //   sortable: 'custom',
        //   title: '转出玩家',
        //   minWidth: 120,
        //   key: 'a5'
        // },
        // {
        //   sortable: 'custom',
        //   title: '转到玩家',
        //   minWidth: 120,
        //   key: 'a6'

        // },
        // {
        //   sortable: 'custom',
        //   title: '转到后余额',
        //   minWidth: 120,
        //   key: 'a7'
        // },
        // {
        //   sortable: 'custom',
        //   title: '记录时间',
        //   width: 150,
        //   key: 'a8'
        // }

      ],
      tableDatas: []
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

        const result = await this.$store.dispatch('getTransferRecord', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 120,
            key: columnKeys[i]
          }
          if (obj.key === '订单ID') {
            obj.render = (h, params) => {
              return h('div', [
                h('a', {
                // style: {
                //     color: '#868686'
                // },
                  class: 'mouse-on',
                  on: {
                    click: () => {
                      this.showShowModal(params.index)
                    }
                  } }, params.row['订单ID'])

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
    showShowModal (index) {
      if (this.tableDatas[index]['订单ID'] !== '累计转出:') {
        this.showModal = true
        this.showRow = this.tableDatas[index]
      }
    },
    moneyUppercase (n) {
      var fraction = ['角', '分']
      var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
      ]
      var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
      ]
      var head = n < 0 ? '欠' : ''
      n = Math.abs(n)
      var s = ''
      for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)
      for (let i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
