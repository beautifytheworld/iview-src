<template>
  <div>
    <Form label-position="right" :label-width="70" inline>

      <FormItem label="订单号:" class="">
        <Input clearable type="text" v-model="query.OrderID" placeholder="填写订单号"></Input>
      </FormItem>
      <FormItem label="代理ID:" class="">
        <Input clearable type="text" v-model="query.AgencyID" placeholder="填写代理ID"></Input>
      </FormItem>

      <FormItem label="状态:" class="">
        <Select v-model="query.Status" style="width:100px" clearable>
          <Option v-for="(item,key) in statusObj" :value="key" :key="key">{{ item }}</Option>
        </Select>
      </FormItem>
         <FormItem label="提现方式:" class="">
        <Select v-model="query.WithdrawChannel" style="width:100px" clearable>
          <Option  :value="1"> 支付宝 </Option>
          <Option  :value="2"> 银行卡 </Option>
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
      room_names: [{ label: '全部', value: 0 }],
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
      columns: [
        // {
        //   sortable: 'custom',
        //   title: '订单ID',
        //   width: 160,
        //   key: 'OrderID'
        // },
        // {
        //   sortable: 'custom',
        //   title: '代理ID',
        //   minWidth: 100,
        //   key: 'AgencyID'
        // },
        // {
        //   sortable: 'custom',
        //   title: '数量',
        //   minWidth: 80,
        //   key: 'Amount'
        // },
        // {
        //   sortable: 'custom',
        //   title: '状态',
        //   minWidth: 100,
        //   key: 'Status',
        //   render: (h, params) => {
        //     return h('span', this.statusObj[params.row.Status])
        //   }
        // },
        // {
        //   sortable: 'custom',
        //   title: '提现后余额',
        //   minWidth: 120,
        //   key: 'MoneyAfter'
        // },
        // {
        //   sortable: 'custom',
        //   title: '创建时间',
        //   minWidth: 150,
        //   key: 'CreateTime'
        // },
        // {
        //   sortable: 'custom',
        //   title: '支付宝',
        //   minWidth: 100,
        //   key: 'AliPay'

        // },
        // {
        //   sortable: 'custom',
        //   title: '银行卡号',
        //   minWidth: 100,
        //   key: 'BankNo'

        // },
        // {
        //   sortable: 'custom',
        //   title: '姓名',
        //   minWidth: 100,
        //   key: 'RealName'
        // },

        // {
        //   sortable: 'custom',
        //   title: '完成时间',
        //   minWidth: 150,
        //   key: 'FinishTime'
        // },
        // {
        //   sortable: 'custom',
        //   title: '操作人',
        //   minWidth: 100,
        //   key: 'AdminID'
        // },
        // {
        //   title: '操作',
        //   key: 'action',
        //   align: 'center',
        //   width: 170,
        //   render: (h, params) => {
        //     if (!params.row.OrderID.includes('累计提现')) {
        //       if (params.row.Status === 0 || params.row.Status === '0') {
        //         return h('div', [
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要拒绝吗？' },
        //               style: { textAlign: 'left' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '2') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'error', size: 'small' } }, '拒绝')]
        //           ),
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要同意吗？' },
        //               style: { textAlign: 'left', marginLeft: '5px' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '3') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'success', size: 'small' } }, '同意')]
        //           ),
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要忽略吗？' },
        //               style: { textAlign: 'left', marginLeft: '5px' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '5') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'default', size: 'small' } }, '忽略')]
        //           )

        //         ])
        //       } else if (params.row.Status === 1 || params.row.Status === '1') {
        //         return h('div', [
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要退款吗？' },
        //               style: { textAlign: 'left' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '4') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'default', size: 'small' } }, '退款')]
        //           )
        //         ])
        //       } else {
        //         return h('div', '---')
        //       }
        //     }
        //   }
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

        const result = await this.$store.dispatch('getSettleRecord', data)
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

          if (obj.key === 'Status') {
            obj.render = (h, params) => {
              return h('span', this.statusObj[params.row.Status])
            }
          }
          this.columns.push(obj)
        }
        // this.columns.push({
        //   title: '操作',
        //   key: 'action',
        //   align: 'center',
        //   width: 170,
        //   render: (h, params) => {
        //     if (!params.row.OrderID.includes('累计提现')) {
        //       if (params.row.Status === 0 || params.row.Status === '0') {
        //         return h('div', [
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要拒绝吗？' },
        //               style: { textAlign: 'left' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '2') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'error', size: 'small' } }, '拒绝')]
        //           ),
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要同意吗？' },
        //               style: { textAlign: 'left', marginLeft: '5px' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '3') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'success', size: 'small' } }, '同意')]
        //           ),
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要忽略吗？' },
        //               style: { textAlign: 'left', marginLeft: '5px' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '5') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'default', size: 'small' } }, '忽略')]
        //           )

        //         ])
        //       } else if (params.row.Status === 1 || params.row.Status === '1') {
        //         return h('div', [
        //           h('Poptip',
        //             { props: { confirm: true, title: '您确认要退款吗？' },
        //               style: { textAlign: 'left' },
        //               on: {
        //                 'on-ok': () => { this.toUpdateSettlement(params.index, '4') },
        //                 'on-cancel': () => { }
        //               }
        //             },
        //             [h('Button', { props: { type: 'default', size: 'small' } }, '退款')]
        //           )
        //         ])
        //       } else {
        //         return h('div', '---')
        //       }
        //     }
        //   }
        // })
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
        const res = await this.$store.dispatch('updateSettlement', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('操作成功!')
          setTimeout(() => {
            this.toQuery()
          }, 3000)
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
