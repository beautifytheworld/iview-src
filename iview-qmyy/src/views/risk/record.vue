<template>
  <div>
    <Form label-position="right" :label-width="70" inline>

      <FormItem label="类型:" class="">
        <Select v-model="query.status" style="width:100px" clearable>
          <Option v-for="item in statuss" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="时间选择:" class="">
         <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>         <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1" >
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>
      <FormItem :label-width="30" >
        <Button type="success" @click="toUpdateAll" :loading="queryLoading" icon="checkmark-circled">全部标为已读</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { mapGetters } from 'vuex'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      statuss: [{ label: '未读', value: '0' }, { label: '已读', value: '1' }],
      loading: false,
      query: {status: '0'},
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      columns: [
        {
          title: '是否已读',
          key: 'action',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: (params.row.status === 1) ? 'text' : 'warning',
                    // icon: 'compose',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.toEdit(params.index)
                    }
                  }
                }, (params.row.status === 1) ? '已读' : ' 未读 '
              )
            ])
          }
        },

        {
          title: '记录ID',
          width: 100,

          key: 'id'
        },
        {
          title: '触发时间',
          width: 160,

          key: 'created_at'
        },
        {
          title: '引发者',
          width: 160,
          key: 'case_user'
        },
        {
          title: '触发内容',
          minWidth: 160,
          key: 'content'
        },
        {
          title: '已查看管理员',
          width: 160,
          key: 'admin_user'
        }

      ],
      tableDatas: []
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
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
        const data = {
          page: this.page,
          per_page: this.per_page,
          ...this.query,
          start_time: (this.datasTime.length > 0 && this.datasTime[0]) ? this.datasTime[0] : '',
          end_time: (this.datasTime.length > 1 && this.datasTime[1]) ? this.datasTime[1] + ' 23:59:59' : ''
        }
        const result = await this.$store.dispatch('getRiskRecords', data)
        if (result && result.data) {
          this.tableDatas = result.data
        }
        this.total = (result && result.meta && result.meta.total) ? result.meta.total : 0
      } catch (error) {
      }
      this.queryLoading = false
    },
    toQuery () {
      this.page = 1
      this.queryList()
    },
    toEdit (index) {
      var obj = this.tableDatas[index]
      if ((+obj.status) === 0) {
        this.saveEdit([obj.id])
      }
    },
    async toUpdateAll () {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateNoReadRiskRecords', {name: this.name})
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          this.toQuery()
        }
      } catch (error) {

      }
      this.loading = false
    },
    async saveEdit (ids) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateRiskRecords', {ids: ids, name: this.name})
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('已读, 修改成功!')
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
