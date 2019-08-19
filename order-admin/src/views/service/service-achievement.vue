<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
   <FormItem label="客服ID:" class="">
        <Input clearable type="text" v-model="query.service_id" placeholder="填写客服ID"></Input>
      </FormItem>
      <!-- <FormItem label="上班状态:" class="">
        <Select v-model="query.status" style="width:100px" clearable>
          <Option v-for="item in statusTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem> -->
      <!-- <FormItem label="时间选择:" class="">
        <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem> -->

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
import { transformSecond } from '@/utils/validate.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      statusTypes: [{ label: '全部', value: '' }, { label: '上班', value: '1' }, { label: '下班', value: '2' }],
      room_names: [{ label: '全部', value: 0 }, { label: '新手房', value: '新手房' }, { label: '初级房', value: '初级房' }, { label: '中级房', value: '中级房' }, { label: '高级房', value: '高级房' }],
      isPunch: false,
      isPunchText: '',
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
      statusObj: {
        '1': '上班',
        '2': '下班'
      },
      columns: [
        {
          title: '客服ID',
          minWidth: 100,
          key: 'service_id'
        },
        {
          title: '分配问题数',
          minWidth: 160,
          key: 'allot_num'
        },
        {
          title: '已处理问题数',
          minWidth: 160,
          key: 'allot_num',
          render: (h, params) => {
            return h('span', params.row.allot_num - params.row.not_handle_num)
          }
        },
        {
          title: '未处理数量',
          minWidth: 160,
          key: 'not_handle_num'
        },
        {
          title: '工作时长',
          minWidth: 160,
          key: 'work_duration',
          render: (h, params) => {
            return h('span', transformSecond(params.row.work_duration))
          }
        },
        {
          title: '最后回复时间',
          minWidth: 160,
          key: 'last_replay_time'
        },
        {
          title: '记录时间',
          minWidth: 160,
          key: 'created_at'
        }
      ],
      tableDatas: []
    }
  },
  mounted () {
  },
  computed: {

  },
  methods: {
    init () {
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
        const data = {
          page: this.page,
          per_page: this.per_page,
          ...this.query
        }

        const result = await this.$store.dispatch('getServiceAchievements', data)
        if (result) {
          if (result.data) {
            this.tableDatas = result.data
          }
          if (result.meta) {
            this.total = result.meta.total
          }
        }
      } catch (error) {
      }
      this.queryLoading = false
    },
    toQuery () {
      this.page = 1
      this.queryList()
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
