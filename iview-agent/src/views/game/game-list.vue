<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem :label-width="1">
        <Button @click="showAddModal" type="primary" icon="plus">新增</Button>
      </FormItem>
      <!-- <FormItem label="道具名称:"
                class="">
        <Input clearable
               type="text"
               v-model="query.ItemName"
               placeholder="填写道具名称"></Input>
      </FormItem> -->
      <!-- <FormItem label="时间选择:" class="">
         <Button :type="btTypes[3]" @click="changeDate(-1)" size="small">昨天</Button>         <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
        <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
        <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
        <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem> -->

      <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>

    </Form>
    <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

    <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    <Modal v-model="showAdd" title="添加约战房间配置" width="600" :loading="loading" >
      <Form :model="addRow" ref="formValidate" :rules="ruleValidate" label-position="top" style="padding-left:90px">
        <FormItem label="房间名" prop="RoomName">

          <Select v-model="addRow.RoomName" style="width:200px" @on-change="roomSelectChange">
            <Option v-for="item in RoomNames" :value="item.name" :key="item.name+'_'+item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="房间号" prop="RoomNumber">
          <Input v-model="addRow.RoomNumber" style="width:360px"></Input>
        </FormItem>
        <FormItem label="局数" prop="innings" v-if="RoomConfig.hasOwnProperty('局数')">
           <RadioGroup v-model="addRow.innings" >
                <Radio :label="value"  v-for="value in RoomConfig['局数'].split(',')" :key="'js_'+value"></Radio>

            </RadioGroup>

        </FormItem>
        <FormItem label="底分" prop="footScore" v-if="RoomConfig.hasOwnProperty('底分')">

          <RadioGroup v-model="addRow.footScore" >
                <Radio :label="value"  v-for="value in RoomConfig['底分'].split(',')" :key="'df_'+value"></Radio>

            </RadioGroup>
        </FormItem>

        <FormItem label="玩法(0表示标准玩法)" prop="playType" v-if='RoomConfig.hasOwnProperty("玩法(0表示标准玩法)")'>
          <RadioGroup v-model="addRow.playType">
                            <Radio :label="value"  v-for="value in RoomConfig['玩法(0表示标准玩法)'].split(',')" :key="'hblx_'+value"></Radio>

          </RadioGroup>
        </FormItem>
        <FormItem  label="货币(0，游戏币，1积分)" prop="currencyType" v-if='RoomConfig.hasOwnProperty("货币(0，游戏币，1积分)")' >
          <RadioGroup v-model="addRow.currencyType">

                            <Radio :label="value"  v-for="value in RoomConfig['货币(0，游戏币，1积分)'].split(',')" :key="'hblx_'+value"></Radio>

          </RadioGroup>
        </FormItem>
        <FormItem label="付费方式(0,代理付，1自费)" prop="freeType" v-if='RoomConfig.hasOwnProperty("付费方式(0,代理付，1自费)")' >
          <RadioGroup v-model="addRow.freeType">
                                        <Radio :label="value"  v-for="value in RoomConfig['付费方式(0,代理付，1自费)'].split(',')" :key="'hblx_'+value"></Radio>

          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toAdd('formValidate')" :loading="loading">保存</Button>
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
      query: { userid: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: { playType: '0', currencyType: '0', freeType: '0' },
      editRow: {},
      delRow: {},
      columns: [

      ],
      tableDatas: [],
      RoomNames: [],
      RoomConfig: {},
      ruleValidate: {
        RoomName: [
          { required: true, message: '房间名不能为空!', trigger: 'blur' }
        ],
        RoomNumber: [
          { required: true, message: '房间号不能为空!', trigger: 'blur' }
        ],
        innings: [
          { required: true, message: '局数不能为空! ', trigger: 'blur' }

        ],
        footScore: [
          { required: true, message: '底分不能为空!', trigger: 'blur' }
        ],
        playType: [
          { required: true, message: '玩法不能为空!', trigger: 'blur' }
        ],
        currencyType: [
          { required: true, message: '货币类型不能为空!', trigger: 'blur' }
        ],
        freeType: [
          { required: true, message: '房费类型不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.init();
    this.queryGameRoomName()
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
      this.datasTime = []
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

        const result = await this.$store.dispatch('getGameInfo', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          this.columns.push(
            {
              title: columnTitles[i],
              sortable: 'custom',
              minWidth: 120,
              key: columnKeys[i]
            }
          )
        }
        let obj = {
          title: '操作',
          width: 180,
          key: 'action'
        }
        obj.render = (h, params) => {
          return h('div', [
            // h(
            //   'Button',
            //   {
            //     props: {
            //       type: 'success',
            //       icon: 'compose',
            //       size: 'small'
            //     },
            //     style: {
            //     },
            //     on: {
            //       click: () => {
            //         this.showEditModal(params.index)
            //       }
            //     }
            //   }, '编辑'
            // ),
            h('Poptip',
              {
                props: {
                  confirm: true,
                  title: '您确认要删除吗？'
                },
                style: {
                  textAlign: 'left',
                  marginLeft: '5px'
                },
                on: {
                  'on-ok':
                    () => { this.toDelete(params.index) },
                  'on-cancel':
                    () => { }
                }
              },
              [h('Button', { props: { type: 'error', icon: 'trash-a', size: 'small' } }, '删除')])
          ])
        }
        this.columns.push(obj)
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
    },
    toAdd (name) {
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
        const res = await this.$store.dispatch('agInsertGame', data)
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
    },
    async queryGameRoomName () {
      try {
        const data = {
          minIndex: 0,
          maxIndex: 100,
          Name: '约战房'
        }

        const result = await this.$store.dispatch('getGameRoomSetting', data)
        const res = this.handleResult(result)
        if (res.tableDatas && (res.tableDatas instanceof Array)) {
          this.RoomNames = res.tableDatas.map((item) => {
            return {
              id: item.pkId,
              name: item.AgentName + item.Name
            }
          })
        }
      } catch (error) {
      }
    },
    async roomSelectChange (value) {
      try {
        const result = await this.$store.dispatch('getGameCustomSetting', {RoomName: value})
        const res = this.handleResult(result)
        if (res.tableDatas && (res.tableDatas instanceof Array) && res.tableDatas[0]) {
          this.RoomConfig = res.tableDatas[0]
        } else {
          this.RoomConfig = {}
        }
        // console.log(this.RoomConfig)
      } catch (error) {
      }
    },
    toDelete (index) {
      let data = { RoomName: this.tableDatas[index].RoomName, RoomNumber: this.tableDatas[index].RoomNumber }
      this.deleteRow(data)
    },
    async deleteRow (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('agDeleteGame', data)
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
