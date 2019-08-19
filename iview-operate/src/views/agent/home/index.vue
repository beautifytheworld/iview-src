
<template>
  <div>
    <div class="home-main">

      <div class="home-top">
        <div class="top-title">
          <span class="title">
            <span style="background:#1abc9c;">&nbsp;</span>
            &nbsp; 推广首页
          </span>
          <Button icon="loop"
                  :loading="loading"
                  @click="toLoading"
                  class="title-refresh">刷新</Button>
        </div>
      </div>
      <div class="home-data">
        <div class="statistics-box">
                  <div class="statistics-item" v-for="(item,i) in arrTitles" :key="i+'ads_ats'">{{arrTitles[i]}}：{{arrDatas[i]}}</div>
        </div>
      </div>
      <div class="home-report">
        <div class="home-report-top">
          <span class="report-public"> 公告信息 </span>

          <!-- <Button class="publish-btn"
                  @click="showAddModal">发布公告</Button> -->
          <a class="more-btn"
             @click="queryMore">更多公告</a>
        </div>
        <Table :loading="moreLoading"
               :columns="columns"
               disabled-hover
               :data="tableDatas"
               :show-header="false"
               height="400"
               stripe></Table>

      </div>
    </div>
    <Modal v-model="modal5"
           width="720">
      <p slot="header"
         style="text-align:center">
        <span>{{title}}</span>
      </p>
      <div v-html="content"></div>
      <div slot="footer">

      </div>
    </Modal>

    <Modal v-model="showAdd"
           title="添加公告信息"
           width="600">
      <Form :model="addRow"
            ref="formValidate"
            :rules="ruleValidate"
            label-position="right"
            :label-width="120">
        <FormItem label="标题"
                  prop="MsgTitle">
          <Input v-model="addRow.MsgTitle"
                 style="width:360px"></Input>
        </FormItem>
        <FormItem label="内容"
                  prop="MsgContent">
          <Input v-model="addRow.MsgContent"
                 style="width:360px"
                 type="textarea"
                 :autosize="{minRows: 8,maxRows: 10}"
                 placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="开始时间"
                  prop="StartTime">
          <DatePicker type="datetime"
                      placeholder="Select date and time"
                      style="width: 360px"
                      :value="addRow.StartTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      @on-change="addRow.StartTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="结束时间"
                  prop="EndTime">
          <DatePicker type="datetime"
                      placeholder="Select date and time"
                      style="width: 360px"
                      :value="addRow.EndTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      @on-change="addRow.EndTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="排序"
                  prop="OrderNum">
          <Input v-model="addRow.OrderNum"
                 style="width:360px"></Input>
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

    <Modal v-model="showEdit"
           title="编辑公告信息"
           width="600">
      <Form :model="editRow"
            ref="editFormValidate"
            label-position="right"
            :label-width="120">
        <FormItem label="标题"
                  prop="MsgTitle"   :rules="{ required: true, message: '请输入标题', trigger: 'blur' }">
          <Input v-model="editRow.MsgTitle"
                 style="width:360px"></Input>
        </FormItem>
        <FormItem label="内容"
                  prop="MsgContent"  :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
          <Input v-model="editRow.MsgContent"
                 style="width:360px"
                 type="textarea"
                 :autosize="{minRows: 8,maxRows: 10}"
                 placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem label="开始时间"
                  prop="StartTime">
          <DatePicker type="datetime"
                      placeholder="Select date and time"
                      style="width: 360px"
                      :value="editRow.StartTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      @on-change="editRow.StartTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="结束时间"
                  prop="EndTime">
          <DatePicker type="datetime"
                      placeholder="Select date and time"
                      style="width: 360px"
                      :value="editRow.EndTime"
                      format="yyyy-MM-dd HH:mm:ss"
                      @on-change="editRow.EndTime=$event"></DatePicker>
        </FormItem>
        <FormItem label="排序"
                  prop="OrderNum">
          <Input v-model="editRow.OrderNum"
                 style="width:360px"></Input>
        </FormItem>
      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toEdit('editFormValidate')"
                :loading="loading">保存</Button>
      </div>

    </Modal>
  </div>
</template>

<script>

import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  name: 'home',
  components: {
  },
  data () {
    return {
      showAdd: false,
      showEdit: false,
      modal5: false,
      loading: false,
      editRow: {

      },
      addRow: {
        StartTime: '',
        EndTime: ''
      },
      ruleValidate: {
        MsgTitle: [
          { required: true, message: '标题不能为空!', trigger: 'blur' }
        ],
        MsgContent: [
          { required: true, message: '内容不能为空!', trigger: 'blur' }
        ],
        StartTime: [
          { required: true, message: '请选择开始时间!', trigger: 'change' }
        ],
        EndTime: [
          { required: true, message: '请选择结束时间!', trigger: 'change' }
        ],
        OrderNum: [
          { required: true, message: '请填写排序数字! ', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }

        ]
      },
      moreLoading: false,
      arrTitles: [],
      arrDatas: [],
      page: 1,
      per_page: 20,
      title: '',
      content: '',
      columns: [
        {
          title: '标题',
          key: 'MsgTitle',
          width: 700,
          render: (h, params) => {
            return h('div', [
              h('a', {
                // style: {
                //     color: '#868686'
                // },
                class: 'mouse-on',
                on: {
                  click: () => {
                    this.title = params.row.MsgTitle
                    this.content = params.row.MsgContent
                    this.modal5 = true
                  }
                } }, params.row.MsgTitle)

            ])
          }
        },

        {
          title: 'date',
          key: 'StartTime',
          width: 270,
          render: (h, params) => {
            return h('div', params.row.StartTime + ' - ' + params.row.EndTime)
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    icon: 'compose',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.index)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      tableDatas: [
      ]
    }
  },
  computed: {

  },
  mounted () {
    this.init()
  },
  methods: {

    init () {
      this.page = 1
      this.per_page = 10
      this.getStatics()
      this.getMessage()
    },
    async getStatics () {
      try {
        this.loading = true
        const data = {}
        const result = await this.$store.dispatch('getPromoStatics', data)
        if (result && result.data) {
          let data = result.data
          if (data.arrTitles && data.arrTitles.arrString && data.arrTitles.arrString.length) {
            this.arrTitles = data.arrTitles.arrString
          }
          if (data.arrTitles && data.arrDatas && data.arrDatas.length && data.arrDatas[0].arrString) {
            this.arrDatas = data.arrDatas[0].arrString
          }
        }
      } catch (error) {
      }
      this.loading = false
    },
    async getMessage () {
      try {
        this.moreLoading = true
        let minIndex = (this.page - 1) * this.per_page
        let maxIndex = this.page * this.per_page
        const data = {
          page: this.page,
          per_page: this.per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.total && this.total) ? this.total : maxIndex
        }
        const result = await this.$store.dispatch('getAgentMessage', data)
        const res = this.handleResult(result)
        res.tableDatas.forEach(element => {
          this.tableDatas.push(element)
        })
        this.total = res.total
      } catch (error) {
      }
      this.moreLoading = false
    },
    toLoading () {
      this.init()
    },
    queryMore () {
      this.page += 1
      this.getMessage()
    },
    cancel () {
      this.showAdd = false
      this.showEdit = false
    },
    showAddModal () {
      this.showAdd = true
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
        const res = await this.$store.dispatch('insertAgentMessage', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('添加成功!')
          this.init()
        }
      } catch (error) {
      }
      this.loading = false
    },
    showEditModal (index) {
      this.showEdit = true

      this.editRow = { ...this.tableDatas[index] }
      this.editRow.StartTime = this.editRow.StartTime.length <= 10 ? this.editRow.StartTime + ' 00:00:00' : this.editRow.StartTime
      this.editRow.EndTime = this.editRow.EndTime.length <= 10 ? this.editRow.EndTime + ' 00:00:00' : this.editRow.EndTime
      this.editRow.OrderNum = 1
      console.log(this.editRow)
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
        const res = await this.$store.dispatch('updateAgentMessage', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('修改成功!')
          this.init()
        }
      } catch (error) {
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less">
.home-report {
  .mouse-on {
    color: #868686;
    font-size: 14px;
  }
  .mouse-on:hover {
    color: #138cdd;
  }
}
</style>

<style lang="less" scoped>
.home-main {
  margin: 0 auto;
  width: 1080px;
  .home-top {
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
    margin: 0 auto;
    .top-title {
      width: 1060px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .title {
        flex: 0 0 100px;
        font-size: 13px;
        color: #999;
      }
      .title-refresh {
        flex: 0 0 50px;
        margin-top: 5px;
        height: 30px;
      }
    }
  }
  .home-data {
    width: 600px;
    margin-left: 20px;
    margin-top: 8px;
    .statistics-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .statistics-item {
        flex: 1 0 200px;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
  .home-report {
    margin-top: 20px;
    .home-report-top {
      background: #ebebeb;
      .report-public {
        display: inline-block;
        padding: 10px 20px;
        color: #999;
        font-size: 14px;
        font-weight: 500;
      }
      .publish-btn {
        margin-top: 5px;
        margin-right: 5px;
        float: right;
      }
      .more-btn {
        float: right;
        display: inline-block;
        padding: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
