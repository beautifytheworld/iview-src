<template>
  <div>
    <Form label-position="right"
          :label-width="70"
          inline>
      <FormItem label="状态:"
                class="">
        <Select v-model="query.IsLocked"
                style="width:100px" clearable>

          <Option v-for="(item,key) in stateObj"
                  :value="key"
                  :key="key">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="游戏名:"
                class="">
        <Input clearable
               type="text"
               v-model="query.AgentName"
               placeholder="填写游戏名"></Input>
      </FormItem>
      <FormItem label="游戏房间:"
                class="">
        <Input clearable
               type="text"
               v-model="query.Name"
               placeholder="填写游戏房间"></Input>
      </FormItem>

      <FormItem  :label-width="1">
        <Button type="primary"
                @click="toQuery"
                :loading="queryLoading"
                icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange"
           border
           ref="selection"
           :columns="columns"
           :data="tableDatas"
           stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]"
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

    <Modal v-model="showEdit"
           title="修改游戏房间设置"
           width="780">
      <Form :model="editRow"
            ref="editFormValidate"
            label-position="right"
            :label-width="160" inline>
            <FormItem label="pkId"
                  prop="pkId">
          <Input v-model="editRow.pkId"
                 style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="游戏名称"
                  prop="AgentName"
                  :rules="{ required: true, message: '请输入！', trigger: 'blur' }">
          <Input v-model="editRow.AgentName"
                 style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="游戏房间"
                  prop="Name"
                  :rules="{ required: true, message: '请输入！', trigger: 'blur' }">
          <Input v-model="editRow.Name"
                 style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="房间参数"
                  prop="GameParams">
          <Input v-model="editRow.GameParams"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="房间门限"
                  prop="MinGold"
                  :rules="{ required: true, message: '请输入！', trigger: 'blur' }">
          <Input v-model="editRow.MinGold"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="房间排序"
                  prop="OrderId"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.OrderId"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="税率"
                  prop="TaxRate"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
         <Input v-model="editRow.TaxRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="底分"
                  prop="BaseScore"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.BaseScore"
                 style="width:200px"></Input>
        </FormItem>

        <FormItem label="当前奖池">
          <Input v-model="editRow.currentWin"
                 style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="当前奖池增量:"
                  prop="CurGoldPool"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.CurGoldPool"
                 style="width:200px" :min="0"></Input>
        </FormItem>
        <FormItem label="最低奖池"
                  prop="MinGoldPool"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.MinGoldPool"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="低量奖池"
                  prop="NormalGoldPool_L"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.NormalGoldPool_L"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="高量奖池"
                  prop="NormalGoldPool_H"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.NormalGoldPool_H"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="最大奖池"
                  prop="MaxGoldPool"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.MaxGoldPool"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="暗税"
                  prop="ServiceRate"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.ServiceRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="个人最大赢钱"
                  prop="maxWinLimit"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.maxWinLimit"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="个人最大赢钱税收比例"
                  prop="maxWinRate"
                   :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.maxWinRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="个人高量赢钱税收比例"
                  prop="minWinRate"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.minWinRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="个人最大输钱税收比例"
                  prop="maxLoseRate"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.maxLoseRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="个人低量输钱税收比例"
                  prop="minLoseRate"
                  :rules="[{ required: true, message: '请输入！', trigger: 'blur' },{type: 'number',message: '请输入合法的数字!',  trigger: 'blur',transform (value) {  return Number(value) } }]">
          <Input v-model="editRow.minLoseRate"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="游戏标识"
                  prop="GameTypeId"
                  :rules="[{ required: true, message: '请选择！', trigger: 'blur' }]">
           <Select v-model="editRow.GameTypeId"
                  style="width:200px">
            <Option value="10">热</Option>
            <Option value="11">新</Option>
            <Option value="110">热+红点</Option>
            <Option value="111">新+红点</Option>
            <Option value="0">无</Option>
          </Select>
        </FormItem>
        <FormItem label="是否禁用"
                  prop="IsLocked"
                  :rules="{ required: true, message: '请选择！', trigger: 'blur' }">
          <Select v-model="editRow.IsLocked"
                  style="width:100px">
            <Option value="1">禁用</Option>
            <Option value="0">启用</Option>
          </Select>
        </FormItem>

      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toEdit('editFormValidate')"
                :loading="loading">确定</Button>
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
        '1': '禁用', '0': '启用'
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
        //   title: 'pkId',
        //   // 'fixed': 'left',
        //   width: 80,
        //   key: 'pkId'
        // },
        // {
        //   sortable: 'custom',
        //   title: '游戏名',
        //   width: 100,
        //   key: 'AgentName'
        // },
        // {
        //   sortable: 'custom',
        //   title: '游戏房间',
        //   width: 110,
        //   key: 'Name'
        // },
        // {
        //   sortable: 'custom',
        //   title: '房间参数',
        //   width: 110,
        //   align: 'center',
        //   key: 'GameParams',
        //   ellipsis: true,
        //   render: (h, params) => {
        //     return h('Poptip', {
        //       props: {
        //         trigger: 'hover',
        //         content: params.row.GameParams
        //       } },
        //     [
        //       h('div', { style: {

        //       }
        //       }, params.row.GameParams)
        //     ]
        //     )
        //   }
        // },
        // {
        //   sortable: 'custom',
        //   title: '房间门限',
        //   width: 110,
        //   key: 'MinGold'
        // },
        // {
        //   sortable: 'custom',
        //   title: '房间排序',
        //   width: 110,
        //   key: 'OrderId'
        // },
        // {
        //   sortable: 'custom',
        //   title: '税率',
        //   width: 100,
        //   key: 'TaxRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '底分',
        //   width: 100,
        //   key: 'BaseScore'
        // },
        // {
        //   sortable: 'custom',
        //   title: '当前奖池',
        //   width: 120,
        //   key: 'CurGoldPool'
        // },
        // {
        //   sortable: 'custom',
        //   title: '最低奖池',
        //   width: 120,
        //   key: 'MinGoldPool'
        // },
        // {
        //   sortable: 'custom',
        //   title: '低量奖池',
        //   width: 120,
        //   key: 'NormalGoldPool_L'
        // },
        // {
        //   sortable: 'custom',
        //   title: '高量奖池',
        //   width: 120,
        //   key: 'NormalGoldPool_H'
        // },
        // {
        //   sortable: 'custom',
        //   title: '最大奖池',
        //   width: 120,
        //   key: 'MaxGoldPool'
        // },
        // {
        //   sortable: 'custom',
        //   title: '暗税',
        //   width: 120,
        //   key: 'ServiceRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '个人最大赢钱',
        //   width: 130,
        //   key: 'maxWinLimit'
        // },
        // {
        //   sortable: 'custom',
        //   title: '个人最大赢钱税收比例',
        //   width: 120,
        //   key: 'maxWinRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '个人高量赢钱税收比例',
        //   width: 120,
        //   key: 'minWinRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '个人最大输钱税收比例',
        //   width: 120,
        //   key: 'maxLoseRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '个人低量输钱税收比例',
        //   width: 120,
        //   key: 'minLoseRate'
        // },
        // {
        //   sortable: 'custom',
        //   title: '是否禁用',
        //   width: 110,
        //   key: 'IsLocked',
        //   render: (h, params) => {
        //     return h('span', this.stateObj[params.row.IsLocked])
        //   }
        // },
        // {
        //   title: '操作',
        //   key: 'action',
        //   fixed: 'right',
        //   align: 'center',
        //   width: 220,
        //   render: (h, params) => {
        //     return h('div', [
        //       h(
        //         'Button',
        //         {
        //           props: {
        //             type: 'primary',
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
        //       ),
        //       h(
        //         'Poptip',
        //         {
        //           props: {
        //             transfer: true,
        //             confirm: true,
        //             title: '您确认要开服吗？'
        //           },
        //           style: {
        //             marginRight: '2px',
        //             textAlign: 'left'
        //           },
        //           on: {
        //             'on-ok': () => {
        //               this.toChangeStatus(params.index, '1')
        //             },
        //             'on-cancel': () => {
        //             }
        //           }
        //         },
        //         [
        //           h('Button', { props: {
        //             type: 'success',
        //             icon: 'checkmark-circled',
        //             size: 'small'
        //           } }, '开服')
        //         ]

        //       ),
        //       h(
        //         'Poptip',
        //         {
        //           props: {
        //             transfer: true,
        //             confirm: true,
        //             title: '您确认要停服吗？'
        //           },
        //           style: {
        //             textAlign: 'left'
        //           },
        //           on: {
        //             'on-ok': () => {
        //               this.toChangeStatus(params.index, '0')
        //             },
        //             'on-cancel': () => {
        //             }
        //           }
        //         },
        //         [
        //           h('Button', { props: {
        //             type: 'error',
        //             icon: 'close-circled',
        //             size: 'small'
        //           } }, '停服')
        //         ]

        //       )
        //     ])
        //   }
        // }
      ],
      tableDatas: [],
      ruleValidate: {
      },
      hongDiangObj: {
        '0': '无',
        '10': '热',
        '11': '新',
        '110': '热+红点',
        '111': '新+红点'
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

        const result = await this.$store.dispatch('getGameRoomSetting', data)
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
          if (obj.key === 'GameParams') {
            obj.ellipsis = true
            obj.render = (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  content: params.row.GameParams
                } },
              [
                h('div', { style: {

                }
                }, params.row.GameParams)
              ]
              )
            }
          }
          if (obj.key === 'IsLocked') {
            obj.render = (h, params) => {
              return h('span', this.stateObj[params.row.IsLocked])
            }
          }
          if (obj.key === 'GameTypeId') {
            obj.render = (h, params) => {
              return h('span', this.hongDiangObj.hasOwnProperty(params.row.GameTypeId) ? this.hongDiangObj[params.row.GameTypeId] : '无')
            }
          }
          this.columns.push(obj)
        }
        this.columns.push({
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 220,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
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
              ),
              h(
                'Poptip',
                {
                  props: {
                    transfer: true,
                    confirm: true,
                    title: '您确认要开服吗？'
                  },
                  style: {
                    marginRight: '2px',
                    textAlign: 'left'
                  },
                  on: {
                    'on-ok': () => {
                      this.toChangeStatus(params.index, '1')
                    },
                    'on-cancel': () => {
                    }
                  }
                },
                [
                  h('Button', { props: {
                    type: 'success',
                    icon: 'checkmark-circled',
                    size: 'small'
                  } }, '开服')
                ]

              ),
              h(
                'Poptip',
                {
                  props: {
                    transfer: true,
                    confirm: true,
                    title: '您确认要停服吗？'
                  },
                  style: {
                    textAlign: 'left'
                  },
                  on: {
                    'on-ok': () => {
                      this.toChangeStatus(params.index, '0')
                    },
                    'on-cancel': () => {
                    }
                  }
                },
                [
                  h('Button', { props: {
                    type: 'error',
                    icon: 'close-circled',
                    size: 'small'
                  } }, '停服')
                ]

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
      this.editRow.currentWin = this.editRow.CurGoldPool
      this.editRow.CurGoldPool = '0'
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
        const res = await this.$store.dispatch('updateGameRoomSetting', data)
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
    },
    async toChangeStatus (index, Status) {
      try {
        let data = {
          AgentName: this.tableDatas[index].AgentName,
          Name: this.tableDatas[index].Name,
          Status
        }
        const res = await this.$store.dispatch('updateGameRoomStatus', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('操作成功!')
        }
      } catch (error) {
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
