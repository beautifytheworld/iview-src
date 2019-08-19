<template>
  <div>
    <Form label-position="right" :label-width="1" inline>

      <FormItem>
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

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

    <Modal v-model="showEdit" title="修改提现设置" width="480">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">
        <FormItem label="pkid" prop="pkid">
          <Input v-model="editRow.pkid" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="支付宝最小兑换" prop="MinExchange" :rules="{ required: true, message: '请输入兑换值', trigger: 'blur' }">
          <Input v-model="editRow.MinExchange" style="width:200px"></Input>
        </FormItem>
        <FormItem label="支付宝最大兑换" prop="MaxExchange" :rules="{ required: true, message: '请输入兑换值', trigger: 'blur' }">
          <Input v-model="editRow.MaxExchange" style="width:200px"></Input>
        </FormItem>
        <FormItem label="税收" prop="Tax" :rules="{ required: true, message: '请输入税收！', trigger: 'blur' }">
          <Input v-model="editRow.Tax" style="width:200px"></Input>
        </FormItem>
        <FormItem label="次数限制" prop="LimitCount" :rules="{ required: true, message: '请输入次数限制！', trigger: 'blur' }">
          <Input v-model="editRow.LimitCount" style="width:200px"></Input>
        </FormItem>
         <FormItem label="Union最小兑换" prop="UnionMinExchange" :rules="{ required: true, message: '请输入兑换值', trigger: 'blur' }">
          <Input v-model="editRow.UnionMinExchange" style="width:200px"></Input>
        </FormItem>
        <FormItem label="Union最大兑换" prop="UnionMaxExchange" :rules="{ required: true, message: '请输入兑换值', trigger: 'blur' }">
          <Input v-model="editRow.UnionMaxExchange" style="width:200px"></Input>
        </FormItem>
        <FormItem label="Union税收" prop="UnionTax" :rules="{ required: true, message: '请输入税收！', trigger: 'blur' }">
          <Input v-model="editRow.UnionTax" style="width:200px"></Input>
        </FormItem>
        <FormItem label="状态" prop="State" :rules="{ required: true, message: '请选择状态！', trigger: 'blur' }">
          <Select v-model="editRow.State" style="width:100px">
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
        // {
        //   sortable: 'custom',
        //   title: 'pkid',
        //   // 'fixed': 'left',
        //   width: 80,
        //   key: 'pkid'
        // },
        // {
        //   sortable: 'custom',
        //   title: '最小兑换',
        //   key: 'MinExchange'
        // },
        // {
        //   sortable: 'custom',
        //   title: '最大兑换',
        //   key: 'MaxExchange'
        // },
        // {
        //   sortable: 'custom',
        //   title: '税收',
        //   key: 'Tax',
        //   ellipsis: true
        // },
        // {
        //   sortable: 'custom',
        //   title: '状态',
        //   key: 'State',
        //   render: (h, params) => {
        //     return h('span', this.stateObj[params.row.State])
        //   }
        // },
        // {
        //   title: '操作',
        //   key: 'action',
        //   // fixed: 'right',
        //   align: 'center',
        //   width: 160,
        //   render: (h, params) => {
        //     return h('div', [
        //       h(
        //         'Button',
        //         {
        //           props: {
        //             type: 'success',
        //             icon: 'compose',
        //             size: 'small'
        //           },
        //           style: {
        //             marginRight: '2px'
        //           },
        //           on: {
        //             click: () => {
        //               this.showEditModal(params.index)
        //             }
        //           }
        //         }, '编辑'
        //       )
        //       // h(
        //       //   'Poptip',
        //       //   {
        //       //     props: {
        //       //       confirm: true,
        //       //       title: '您确认要删除吗？'
        //       //     },
        //       //     style: {
        //       //       textAlign: 'left'
        //       //     },
        //       //     on: {
        //       //       'on-ok': () => {
        //       //         this.toDelete(params.index)
        //       //       },
        //       //       'on-cancel': () => {
        //       //       }
        //       //     }
        //       //   },
        //       //   [
        //       //     h('Button', { props: {
        //       //       type: 'error',
        //       //       icon: 'android-delete',
        //       //       size: 'small'
        //       //     } }, '删除')
        //       //   ]

        //       // )
        //     ])
        //   }
        // }
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

        const result = await this.$store.dispatch('getExchangeSetting', data)
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

          if (obj.key === 'State') {
            obj.render = (h, params) => {
              return h('span', this.stateObj[params.row.State])
            }
          }
          this.columns.push(obj)
        }
        this.columns.push({
          title: '操作',
          key: 'action',
          // fixed: 'right',
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
            ])
          }
        })
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
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateExchangeSetting', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          setTimeout(() => {
            this.toQuery()
          }, 1000)
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
