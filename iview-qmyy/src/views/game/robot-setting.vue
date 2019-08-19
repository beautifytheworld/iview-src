<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
       <FormItem label="游戏房间:" >
         <Input v-model="query.RoomName" placeholder="填写游戏房间" clearable></Input>
      </FormItem>
      <FormItem :label-width="1">
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

    <Modal v-model="showEdit" title="修改机器人配置" width="480">
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="140">
        <FormItem label="pkId" prop="pkId">
          <Input v-model="editRow.pkId" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="游戏房间" prop="RoomName">
          <Input v-model="editRow.RoomName" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="携带最大金额" prop="GoldMax" :rules="[{ required: true, message: '请填写携带最大金额！', trigger: 'blur' }, { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'change',
            transform (value) {
              return Number(value)
            } }]">
          <Input v-model="editRow.GoldMax" style="width:200px"></Input>
        </FormItem>
        <FormItem label="携带最小金额" prop="GoldMin" :rules="[{ required: true, message: '携带最小金额！', trigger: 'blur' }, { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'change',
            transform (value) {
              return Number(value)
            } }]">
          <Input v-model="editRow.GoldMin" style="width:200px"></Input>
        </FormItem>
        <FormItem label="机器人数量" prop="RobotCount" :rules="[{ required: true, message: '请输入机器人数量！', trigger: 'blur' }, { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'change',
            transform (value) {
              return Number(value)
            } }]">
          <Input v-model="editRow.RobotCount" style="width:200px"></Input>
        </FormItem>
        <!-- <FormItem label="状态" prop="state" :rules="{ required: true, message: '请选择状态！', trigger: 'blur' }">
          <Select v-model="editRow.IsLocked" style="width:100px">
            <Option value="0">禁用</Option>
            <Option value="1">启用</Option>
          </Select>
        </FormItem> -->
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
      query: {},
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: { ntype: 'qq' },
      editRow: {},
      columns: [],
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

        const result = await this.$store.dispatch('getRobotSetting', data)
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
        const res = await this.$store.dispatch('updateRobotSetting', data)
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
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
