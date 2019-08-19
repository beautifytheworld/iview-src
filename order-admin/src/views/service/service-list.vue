<template>
  <div>
    <Form ref="formDynamic" :model="query" label-position="right" :label-width="70" inline>

      <FormItem label="ID:" prop="UserId" class="" :rules="{required: true, message: '玩家ID不能为空!', trigger: 'change', transform(value) {
      return value.trim();
    }}">
                <Input clearable type="text" v-model="query.UserId" placeholder="填写玩家ID"></Input>
            </FormItem>
      <FormItem label="问题类型:" class="">
        <Select v-model="query.servicetype" style="width:100px" clearable>
          <Option v-for="item in room_names" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="时间选择:" class="">
        <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1" >
        <Button type="primary" @click="toQuery('formDynamic')" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>
    <Modal v-model="showEdit" title="回复玩家" width="480">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">
        <FormItem label="玩家问题">
          <Input type="textarea" v-model="editRow.Question" style="width:220px" disabled :autosize="{minRows: 3,maxRows: 5}" readonly></Input>
        </FormItem>
        <FormItem label="回复内容" prop="Answer" :rules="{ required: true, message: '请输入回复内容', trigger: 'blur' }">
          <Input  type="textarea" v-model="editRow.Answer" style="width:220px" :autosize="{minRows: 3,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { getKey } from '@/utils/auth.js'
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      game_types: [{ label: '全部', value: 0 }, { label: '捕鱼', value: '捕鱼' }, { label: '注册', value: '注册' }],
      room_names: [{ label: '充值', value: '充值' }, { label: '其他', value: '其他' }],

      loading: false,
      query: { game_type: 0, UserId: '', servicetype: '' },
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
        //   title: '记录时间',
        //   width: 160,
        //   key: 'RecordTime'
        // },
        // {
        //   title: '玩家ID',
        //   width: 100,
        //   key: 'UserId'
        // },
        // {
        //   title: '昵称',
        //   width: 160,
        //   key: 'NickName'
        // },
        // {
        //   title: '问题类型',
        //   width: 160,
        //   key: 'servicetype'
        // },
        // {
        //   title: '玩家问题',
        //   minWidth: 160,
        //   key: 'Question'
        // },
        // {
        //   title: '回复时间',
        //   width: 160,
        //   key: 'AnswerTime'
        // },
        // {
        //   title: '客服回复',
        //   minWidth: 160,
        //   key: 'Answer'
        // }

      ],
      tableDatas: []
    }
  },
  mounted () {

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
        const result = await this.$store.dispatch('getServiceList', data)
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
          this.columns.push(obj)
        }
        if ((+getKey('nLv')) !== 1000) {
          this.columns.push({
            title: '操作',
            key: 'action',
            align: 'center',
            width: 160,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      icon: 'compose',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.showEditModal(params.index)
                      }
                    }
                  }, '回复'
                )
              ])
            }
          })
        }
        this.total = res.total
        this.tableDatas = this.total ? res.tableDatas : []
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
    cancel () {
      this.showEdit = false
      this.showAdd = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateServiceList', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          // this.toQuery()
        }
        this.loading = false
      } catch (error) {
        const response = error.response
        if (response) {
          if (response.status === 401) {
            this.$Message.error('你没有权限!')
          }
          if (response.status === 500) {
            this.$Message.error('系统繁忙，请稍后再试!')
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
