<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem>
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <!-- <Modal v-model="showAdd"
           title="添加商人展示信息"
           width="480">
      <Form :model="addRow"
            ref="formValidate"
            :rules="ruleValidate"
            label-position="right"
            :label-width="140">
        <FormItem label="展示名字"
                  prop="nickname">
          <Input v-model="addRow.nickname"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="类型"
                  prop="ntype">
          <RadioGroup v-model="addRow.ntype">
            <Radio label="qq">QQ</Radio>
            <Radio label="wx">微信</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="号码"
                  prop="name">
          <Input v-model="addRow.name"
                 style="width:200px"></Input>
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
    </Modal> -->

    <Modal v-model="showEdit" title="修改游戏房间设置" width="480">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">
        <FormItem label="pkId" prop="pkId">
          <Input v-model="editRow.pkId" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="房间排序" prop="OrderId" :rules="{ required: true, message: '请输入房间排序！', trigger: 'blur' }">
          <Input v-model="editRow.OrderId" style="width:200px"></Input>
        </FormItem>
        <FormItem label="税率" prop="TaxRate" :rules="{ required: true, message: '请填写税率！', trigger: 'blur' }">
          <Input v-model="editRow.TaxRate" style="width:200px"></Input>
        </FormItem>
        <FormItem label="底分" prop="BaseScore" :rules="{ required: true, message: '请输入底分！', trigger: 'blur' }">
          <Input v-model="editRow.BaseScore" style="width:200px"></Input>
        </FormItem>
        <FormItem label="状态" prop="state" :rules="{ required: true, message: '请选择状态！', trigger: 'blur' }">
          <Select v-model="editRow.IsLocked" style="width:100px">
            <Option value="0">禁用</Option>
            <Option value="1">启用</Option>
          </Select>
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
export default {
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      loading: false,
      ntypeObj: {
        qq: 'QQ', wx: '微信'
      },
      stateObj: {
        '0': '禁用', '1': '启用'
      },
      query: { ntype: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: { ntype: 'qq' },
      editRow: {},
      columns: [
        {
          title: 'pkId',
          // 'fixed': 'left',
          width: 80,
          key: 'pkId'
        },
        {
          title: '游戏名',
          width: 100,
          key: 'AgentName'
        },
        {
          title: '游戏房间',
          width: 100,
          key: 'Name'
        },
        {
          title: '房间参数',
          width: 100,
          key: 'GameParams',
          ellipsis: true
        },
        {
          title: '房间门限',
          width: 100,
          key: 'MinGold'
        },
        {
          title: '房间排序',
          width: 100,
          key: 'OrderId'
        },
        {
          title: '税率',
          width: 100,
          key: 'TaxRate'
        },
        {
          title: '底分',
          width: 100,
          key: 'BaseScore'
        },
        {
          title: '当前奖池',
          width: 120,
          key: 'CurGoldPool'
        },
        {
          title: '最低奖池',
          width: 120,
          key: 'MinGoldPool'
        },
        {
          title: '低量奖池',
          width: 120,
          key: 'NormalGoldPool_L'
        },
        {
          title: '高量奖池',
          width: 120,
          key: 'NormalGoldPool_H'
        },
        {
          title: '最大奖池',
          width: 120,
          key: 'MaxGoldPool'
        },
        {
          title: '暗税',
          width: 120,
          key: 'ServiceRate'
        },
        {
          title: '个人最大赢钱',
          width: 120,
          key: 'maxWinLimit'
        },
        {
          title: '个人最大赢钱税收比例',
          width: 120,
          key: 'maxWinRate'
        },
        {
          title: '个人高量赢钱税收比例',
          width: 120,
          key: 'minWinRate'
        },
        {
          title: '个人最大输钱税收比例',
          width: 120,
          key: 'maxLoseRate'
        },
        {
          title: '个人低量输钱税收比例',
          width: 120,
          key: 'minLoseRate'
        },
        {
          title: '是否禁用',
          width: 100,
          key: 'IsLocked',
          render: (h, params) => {
            return h('span', this.stateObj[params.row.IsLocked])
          }
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
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
                }, '编辑'
              )
              // h(
              //   'Poptip',
              //   {
              //     props: {
              //       confirm: true,
              //       title: '您确认要删除吗？'
              //     },
              //     style: {
              //       textAlign: 'left'
              //     },
              //     on: {
              //       'on-ok': () => {
              //         this.toDelete(params.index)
              //       },
              //       'on-cancel': () => {
              //       }
              //     }
              //   },
              //   [
              //     h('Button', { props: {
              //       type: 'error',
              //       icon: 'android-delete',
              //       size: 'small'
              //     } }, '删除')
              //   ]

              // )
            ])
          }
        }
      ],
      tableDatas: [],
      ruleValidate: {
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

        const result = await this.$store.dispatch('getReportSetting', data)
        const res = this.handleResult(result, ['pkId', 'AgentName', 'Name', 'GameParams', 'MinGold', 'OrderId', 'TaxRate', 'BaseScore', 'CurGoldPool', 'MinGoldPool', 'NormalGoldPool_L', 'NormalGoldPool_H', 'MaxGoldPool', 'ServiceRate', 'maxWinLimit', 'maxWinRate', 'minWinRate', 'maxLoseRate', 'minLoseRate', 'IsLocked'])
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
    handleReset (name) {
      this.$refs[name].resetFields()
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
        const res = await this.$store.dispatch('updateReportSetting', data)
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
    toDelete (index) {
      this.delRow = { ...this.tableDatas[index] }
      let data = { AccountName: this.delRow.AccountName }
      this.deleteRow(data)
    },
    async deleteRow (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('deleteMerchantSetting', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('删除成功!')
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
