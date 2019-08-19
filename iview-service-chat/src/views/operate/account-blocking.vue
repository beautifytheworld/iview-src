<template>
  <div>
    <Form label-position="right"
          :label-width="70"
          inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal"
                type="primary"
                icon="plus">封锁玩家账号</Button>
      </FormItem>
      <FormItem label="ID:"
                class="">
        <Input clearable
               type="text"
               v-model="query.userid"
               placeholder="填写玩家ID"></Input>
      </FormItem>

      <FormItem label="时间选择:"
                class="">
        <Button :type="btTypes[0]"
                @click="changeDate(1)"
                size="small">今天</Button>
        <Button :type="btTypes[1]"
                @click="changeDate(7)"
                size="small">近一周</Button>
        <Button :type="btTypes[2]"
                @click="changeDate(30)"
                size="small">近一月</Button>
        <DatePicker @on-change="pickerChange"
                    @on-clear="clearDate"
                    :value="datasTime"
                    format="yyyy/MM/dd"
                    type="daterange"
                    clearable
                    placement="bottom-end"
                    placeholder="Select date"
                    style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary"
                @click="toQuery"
                :loading="queryLoading"
                icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading"
           border
           ref="selection"
           :columns="columns"
           :data="tableDatas"
           stripe></Table>

    <Page :total="total"
          :page-size-opts="[20,50,100]"
          :current="page"
          class-name="margin-top-10"
          @on-page-size-change="pageSizeChange"
          @on-change="pageChange"
          size="small"
          show-total
          show-elevator
          show-sizer
          :page-size="20"
          class="margin-top-10"></Page>
    <Modal v-model="showAdd"
           title="封锁玩家账号"
           width="480">
      <Form :model="addRow"
            ref="formValidate"
            :rules="ruleValidate"
            label-position="right"
            :label-width="140">
        <FormItem label="玩家ID"
                  prop="UserID">
          <Input v-model="addRow.UserID"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="封锁类型"
                  prop="State">
      <Select v-model="editRow.State"
                  style="width:100px">
            <Option value="1">启用</Option>
             <Option value="0">禁用</Option>
          </Select>
        </FormItem>
        <FormItem label="封锁原因"
                  prop="reason" >
          <Input v-model="addRow.reason"
                 style="width:200px"
                 type="textarea"
                 :autosize="{minRows: 3,maxRows: 5}"
                 placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toAdd('formValidate')"
                :loading="loading">保存</Button>
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
      btTypes: ['ghost', 'ghost', 'ghost'],
      loading: false,
      query: { userid: '' },
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
        //   title: 'userid',
        //   width: 180,
        //   key: 'userid'
        // },
        // {
        //   title: '原因',
        //   minWidth: 200,
        //   key: 'LogUse'
        // },
        // {
        //   title: '变化值',
        //   minWidth: 120,
        //   key: 'LogValue',
        //   render: (h, params) => {
        //     return h('span', (params.row.LogValue === '0' || params.row.LogValue === 0) ? '启用' : '禁用')
        //   }
        // },
        // {
        //   title: '变化后',
        //   minWidth: 120,
        //   key: 'AfterValue',
        //   render: (h, params) => {
        //     return h('span', (params.row.AfterValue === '0' || params.row.AfterValue === 0) ? '启用' : '禁用')
        //   }
        // },
        // {
        //   title: '记录时间',
        //   width: 180,
        //   key: 'RecordTime'
        // }
      ],
      tableDatas: [],
      ruleValidate: {
        UserID: [
          { required: true, message: '玩家ID不能为空!', trigger: 'blur' }
        ],
        State: [
          { required: true, message: '请选择封锁类型!', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请填写调整原因！', trigger: 'blur' }

        ]

      }
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
      this.datasTime = am
      this.clearDate()
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

        const result = await this.$store.dispatch('getAccountBlocking', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            minWidth: 120,
            key: columnKeys[i]
          }
          if (obj.key === 'LogValue') {
            obj.render = (h, params) => {
              return h('span', (params.row.LogValue === '0' || params.row.LogValue === 0) ? '启用' : '禁用')
            }
          }
          if (obj.key === 'AfterValue') {
            obj.render = (h, params) => {
              return h('span', (params.row.AfterValue === '0' || params.row.AfterValue === 0) ? '启用' : '禁用')
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
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    cancel () {
      this.showEdit = false
      this.showAdd = false
    },
    showAddModal () {
      this.showAdd = true
      this.handleReset('formValidate')
      this.addRow = {}
    },
    toAdd (name) {
      this.$Message.error('暂无后端接口!')
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.add(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateGold', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('添加成功!')
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
