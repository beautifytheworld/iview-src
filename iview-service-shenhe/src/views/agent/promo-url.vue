<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
        <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <!-- <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page> -->

  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
// import Qrcode from '@/components/Qrcode'
export default {
  components: {
    // Qrcode
  },
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      game_types: [{ label: '全部', value: 0 }],
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
        {
          title: 'APP下载地址',
          minWidth: 200,
          align: 'center',
          key: 'APP',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  display: 'inline-block',
                  height: '30px',
                  lineHeight: '30px'
                },
                on: {
                  click: () => {
                    window.open(params.row.APP)
                  }
                }
              }, params.row.APP),
              h('Qrcode', {
                props: {
                  val: params.row.APP
                }
              })
            ])
          }
        },
        {
          title: 'H5游戏地址',
          minWidth: 200,
          align: 'center',
          key: 'H5',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  display: 'inline-block',
                  height: '30px',
                  lineHeight: '30px'
                },
                on: {
                  click: () => {
                    window.open(params.row.H5)
                  }
                }
              }, params.row.H5),
              h('Qrcode', {
                props: {
                  val: params.row.H5
                }
              })
            ])
          }
        }
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
    selectChange () {

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

        const result = await this.$store.dispatch('getPromoUrl', data)
        const res = this.handleResult(result, ['APP', 'H5'])
        this.tableDatas = res.tableDatas
        this.total = res.total
        this.arrTitles = res.arrTitles
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
