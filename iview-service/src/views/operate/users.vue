<template>
  <div>
    <Form label-position="right" :label-width="70" inline>

      <FormItem label="ID:" class="">
        <Input clearable type="text" v-model="query.UserID" placeholder="填写玩家ID"></Input>
      </FormItem>
      <FormItem label="玩家昵称:" class="">
        <Input clearable type="text" v-model="query.NickName" placeholder="填写玩家昵称"></Input>
      </FormItem>
      <FormItem label="手机:" class="">
        <Input clearable type="text" v-model="query.Mobile" placeholder="填写手机"></Input>
      </FormItem>
      <FormItem label="设备:" class="">
        <Select v-model="query.RegisterDevice" style="width:100px" clearable>
          <Option v-for="item in deviceTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <FormItem label="注册时间:" class="">
        <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[10,20,30]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="10" class="margin-top-10"></Page>
    <Modal v-model="showEdit" width="680" class="demo-tabs-style1" :closable="false" :transfer="false">
      <Tabs type="card">
        <TabPane label="基本资料">
          <Form :model="editRow" ref="editFormValidate" label-position="top" inline>
            <FormItem label="ID:" prop="UserID">
              <Input v-model="editRow.UserID" style="width:200px;" disabled></Input>
            </FormItem>
            <FormItem label="昵称:" prop="NickName" :rules="{ required: true, message: '请输入昵称', trigger: 'blur' }">
              <Input v-model="editRow.NickName" style="width:200px"></Input>
            </FormItem>
            <FormItem label="设备:" prop="RegisterDevice">
              <Input v-model="editRow.RegisterDevice" style="width:200px" disabled></Input>
            </FormItem>
            <FormItem label="银行密码:" prop="BankPassword">
              <Input v-model="editRow.BankPassword" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('BankPassword')"> 重设</div>
              </Input>
            </FormItem>
            <FormItem label="用户密码:" prop="Password">
              <Input v-model="editRow.Password" type="password" style="width:200px"></Input>
            </FormItem>
            <FormItem label="绑定手机:" prop="Mobile">
              <Input v-model="editRow.Mobile" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('Mobile')"> 重设</div>
              </Input>
            </FormItem>
            <div style="border-top:1px solid #dddee1;width:640px;height:1px;margin:0 auto;margin-bottom:24px;"></div>

            <FormItem label="注册时间:" prop="RegDate">
              <Input v-model="editRow.RegDate" style="width:200px" disabled></Input>
            </FormItem>
            <FormItem label="注册IP:" prop="RegisterIP">
              <Input v-model="editRow.RegisterIP" style="width:200px" disabled></Input>
            </FormItem>
            <FormItem label="登陆次数:" prop="RoleLevel">
              <Input v-model="editRow.RoleLevel" style="width:200px" disabled></Input>
            </FormItem>
            <FormItem label="最后登陆时间:" prop="lastplaytime">
              <Input v-model="editRow.lastplaytime" style="width:306px;" disabled></Input>
            </FormItem>
            <FormItem label="最后登陆IP:" prop="LastIP">
              <Input v-model="editRow.LastIP" style="width:306px" disabled></Input>
            </FormItem>
            <div style="border-top:1px solid #dddee1;width:640px;height:1px;margin:0 auto;margin-bottom:24px;"></div>
            <FormItem label="绑定支付宝:" prop="Email">
              <Input v-model="editRow.Email" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('Email')"> 重设</div>
              </Input>
            </FormItem>
            <FormItem label="銀行賬戶:" prop="UnionCard">
              <Input v-model="editRow.UnionCard" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('UnionCard')"> 重设</div>
              </Input>
            </FormItem>
            <FormItem label="姓名:" prop="RealName">
              <Input v-model="editRow.RealName" style="width:200px" disabled>
              <div class="self-input-append" slot="append" @click="toClear('RealName')"> 重设</div>
              </Input>
            </FormItem>
            <div style="text-align:right;padding-right:12px;">
              <Button @click="cancel()" :loading="loading">取消 </Button>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" @click="toEdit('editFormValidate')" :loading="loading">确定</Button>
            </div>
          </Form>

          <Modal v-model="resetModal" width="360" class-name="reset-modal" :styles="{top: '200px'}" >
            <p slot="header" style="">
              <Icon type="information-circled"></Icon>
              <span>确认重置</span>
            </p>
            <div style="text-align:center">
              <p>你确定？</p>
            </div>
            <div slot="footer">
              <Button size="large"  :disabled="modal_loading" @click="resetModal=false">取消</Button>
              <Button type="primary" size="large"  :loading="modal_loading" @click="clearSomething">确定</Button>
            </div>
          </Modal>

        </TabPane>
        <TabPane label="游戏信息">
          <Table size="small" :loading="gameLoading" border ref="selection" :columns="gameColumns" :data="gameTableDatas" stripe></Table>

          <Page :total="gTotal" :page-size-opts="[10,20,30]" :current="gPage" class-name="margin-top-10" @on-page-size-change="gpageSizeChange" @on-change="gpageChange" size="small" show-total show-elevator show-sizer :page-size="10" class="margin-top-10"></Page>

        </TabPane>

      </Tabs>
      <div slot="footer" style="color:#f60;text-align:center">
        <!-- <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit('formValidate')" :loading="loading">确定</Button> -->
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
      gameLoading: false,
      modal_loading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      deviceTypes: [{ label: 'iOS', value: 'iOS' }, { label: 'Android', value: 'Android' }, { label: 'Windows', value: 'Windows' }, { label: 'OS X', value: 'OS X' }],
      loading: false,
      query: { RegisterDevice: '', UserID: '', RoomName: 0 },
      datasTime: [],
      page: 1,
      per_page: 10,
      total: 0,
      gPage: 1,
      g_per_page: 10,
      gTotal: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [
        // {
        //   title: '玩家ID',
        //   key: 'UserID',
        //   align: 'center',
        //   width: 100,
        //   render: (h, params) => {
        //     return h('div', [
        //       h(
        //         'a',
        //         {
        //           style: {
        //             color: '#2d8cf0'
        //           },
        //           on: {
        //             click: () => {
        //               this.showEditModal(params.index)
        //             }
        //           }
        //         }, params.row.UserID
        //       )

        //     ])
        //   }
        // },
        // {
        //   title: '昵称',
        //   width: 120,
        //   key: 'NickName'
        // },
        // {
        //   title: '携带',
        //   width: 120,
        //   key: 'Money'
        // },
        // {
        //   title: '银行余额',
        //   width: 120,
        //   key: 'BankMoney'

        // },
        // {
        //   title: '手机',
        //   width: 120,
        //   key: 'Mobile'
        // },
        // {
        //   title: '密码',
        //   width: 80,
        //   key: 'Password'
        // },
        // {
        //   title: '银行密码',
        //   width: 90,
        //   key: 'BankPassword'
        // },
        // {
        //   title: '支付宝',
        //   width: 90,
        //   key: 'Email'
        // },
        // {
        //   title: 'UnionCard',
        //   width: 120,
        //   key: 'UnionCard'
        // },
        // {
        //   title: '姓名',
        //   width: 80,
        //   key: 'RealName'
        // },
        // {
        //   title: '登陆IP',
        //   width: 120,
        //   key: 'LastIP'
        // },
        // {
        //   title: '注册时间',
        //   width: 90,
        //   key: 'RegDate'
        // },
        // {
        //   title: '注册IP',
        //   width: 120,
        //   key: 'RegisterIP'
        // },
        // {
        //   title: '注册设备',
        //   width: 120,
        //   key: 'RegisterDevice'
        // },
        // {
        //   title: '上次设备',
        //   width: 120,
        //   key: 'LastLoginDevice'
        // },
        // {
        //   title: '状态',
        //   width: 70,
        //   key: 'State',
        //   render: (h, params) => {
        //     return h('span', (params.row.State === '0' || params.row.State === 0) ? '启用' : '禁用')
        //   }
        // },
        // {
        //   title: '上次时间',
        //   width: 90,
        //   key: 'lastplaytime'
        // },
        // {
        //   title: '总税收',
        //   width: 120,
        //   key: 'TotalTax'
        // },
        // {
        //   title: '直属代理',
        //   width: 120,
        //   key: 'AgentID'
        // },
        // {
        //   title: '代理总充值',
        //   width: 120,
        //   key: '代理总充值'
        // },
        // {
        //   title: '在线总充值',
        //   width: 120,
        //   key: '在线总充值'
        // },
        // {
        //   title: '总提现',
        //   width: 120,
        //   key: '总提现'
        // }
        // {
        //     title: "游戏记录",
        //     key: "GameID",
        //       render: (h, params) => {
        //         return h("div", [
        //             h(
        //                 "Button",
        //                 {
        //                     props: {
        //                         type: "error",
        //                         // icon: "compose",
        //                         size: "small"
        //                     },
        //                     style: {
        //                         marginRight: "5px"
        //                     },
        //                     on: {
        //                         click: () => {
        //                             this.$Message.error('游戏对局ID:'+ this.tableDatas[params.index].GameID + '暂无接口')
        //                             // this.showEditModal(params.index);
        //                         }
        //                     }
        //                 },
        //                 "明细"
        //             )
        //         ]);
        //     }
        // },
      ],
      gameUserId: '',
      tableDatas: [],
      resetModal: false,
      resetType: '',
      gameColumns: [
        {
          title: '玩家ID',
          width: 100,
          key: 'UserID'
        },
        {
          title: '昵称',
          width: 110,
          key: 'NickName'
        },
        {
          title: '手机',
          width: 100,
          key: 'Mobile'
        },
        {
          title: '游戏',
          width: 100,
          key: '游戏'
        },
        {
          title: '游戏房间',
          width: 120,
          key: 'RoomName'
        },
        {
          title: '变化前',
          width: 100,
          key: 'CurGold'
        },
        {
          title: '变化值',
          width: 90,
          key: 'AddGold'
        },
        {
          title: 'begintime',
          width: 150,
          key: 'begintime'
        },
        {
          title: '游戏时长',
          width: 90,
          key: '游戏时长'
        },
        {
          title: '游戏记录',
          width: 160,
          key: 'GameID'
        }
      ],
      gameTableDatas: []
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
    gpageChange (page) {
      this.gPage = page
      this.queryGameList()
    },
    gpageSizeChange (perPage) {
      if (this.g_per_page !== perPage) {
        this.g_per_page = perPage
        this.queryGameList()
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

        const result = await this.$store.dispatch('getUserList', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            minWidth: 120,
            align: 'center',
            sortable: 'custom',
            key: columnKeys[i]
          }
          if (obj.key === 'UserID') {
            obj.render = (h, params) => {
              return h('div', [
                h(
                  'a',
                  {
                    style: {
                      color: '#2d8cf0'
                    },
                    on: {
                      click: () => {
                        this.showEditModal(params.index)
                      }
                    }
                  }, params.row.UserID
                )

              ])
            }
          }
          if (obj.key === 'State') {
            obj.render = (h, params) => {
              return h('span', (params.row.State === '0' || params.row.State === 0) ? '启用' : '禁用')
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
    cancel () {
      this.showEdit = false
      // this.showAdd = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
      this.gameUserId = this.tableDatas[index].UserID
      this.queryGameList()
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
        if (data.Password === '***') {
          data.Password = ''
        }
        const res = await this.$store.dispatch('updateAccount', data)
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
    async queryGameList () {
      try {
        this.gameLoading = true
        let minIndex = (this.gPage - 1) * this.g_per_page
        let maxIndex = this.gPage * this.g_per_page
        const data = {
          UserId: this.gameUserId,
          page: this.gPage,
          per_page: this.g_per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.gTotal && this.gTotal && this.gPage > 1) ? this.gTotal : maxIndex
        }
        const result = await this.$store.dispatch('getGameLogs', data)
        const res = this.handleResult(result, ['UserID', 'NickName', 'Mobile', '游戏', 'RoomName', 'CurGold', 'AddGold', 'begintime', '游戏时长', 'GameID'])
        this.gameTableDatas = res.tableDatas
        this.gTotal = res.total
        // this.arrTitles = res.arrTitles
      } catch (error) {
      }
      this.gameLoading = false
    },
    toClear (type) {
      this.resetModal = true
      this.resetType = type
    },
    async clearSomething () {
      try {
        this.modal_loading = true
        let data = {UserID: this.gameUserId, resetType: this.resetType}
        const res = await this.$store.dispatch('updateAccount', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.resetModal = false
          this.$Message.success('操作成功!')
        }
      } catch (error) {

      }
      this.modal_loading = false
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}

.demo-tabs-style1 {
  .ivu-tabs-card {
    .ivu-tabs-content {
      .ivu-tabs-tabpane {
        // background: #f00;
        margin-top: -16px;
        padding-top: 16px;
        padding-left: 5px;
        // border-left: 1px solid #dddee1;
        // border-right: 1px solid #dddee1;
        // border-bottom: 1px solid #dddee1;
      }
    }
  }
  .ivu-input-group-append {
    .self-input-append {
      background: #ed3f14;
      margin: -5px -10px;
      height: 32px;
      line-height: 32px;
      width: 60px;
      border-radius: 3px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>
