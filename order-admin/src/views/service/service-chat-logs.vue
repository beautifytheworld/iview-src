<template>
  <div>
    <Form label-position="right" :label-width="70" inline>

      <FormItem label="玩家ID:" class="">
        <Input clearable type="text" v-model="query.player_id" placeholder="填写玩家ID"></Input>
      </FormItem>
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
    <Modal v-model="showEdit" :title="'玩家'+this.playerId+'的聊天记录'" width="560"  @on-cancel="cancel">
      <ul class="message" ref="message_box" id="ul_message_box1">
        <li v-for="(item,index) in chatMessages" :key="index">
          <!-- <p :class="'time'+item.u_type">
            <span>{{item.created_at}}</span>
          </p> -->
          <div class="main" :class="{ self: parseInt(item.u_type) === 2 }">

            <img class="avatar" width="30" height="30" :src="parseInt(item.u_type) === 1 ?require('./images/wj.png') :require('./images/kf.png')" />
<div>{{item.created_at}}{{parseInt(item.u_type) === 2 ? '&nbsp;&nbsp;'+item.service_id:''}}</div>
            <div class="text">{{item.msg }}</div>
          </div>
        </li>
      </ul>
      <div slot="footer" style="color:#f60;" class="send-box">
        <!-- <Button type="default" @click="cancel">取消</Button> -->

      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
// import { mapGetters } from 'vuex'

// import axios from 'axios'
export default {
  mixins: [myMixin],
  data () {
    return {
      box: '',
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      websocket: null,
      loading: false,
      query: { game_type: 0, UserId: '', servicetype: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      playerId: '',
      chatCurrentPage: 1,
      chatTotalPage: 1,
      addRow: {},
      editRow: {},
      columns: [
        {
          title: '玩家ID',
          minWidth: 100,
          key: 'player_id'
        },
        {
          title: '提问次数',
          minWidth: 120,
          key: 'send_num'
        },
        {
          title: '最后提问时间',
          minWidth: 100,
          key: 'last_send_time'
        },
        {
          title: '最后的问题',
          minWidth: 200,
          ellipsis: true,
          key: 'last_send_msg'
        },
        {
          title: '客服ID',
          minWidth: 100,
          key: 'service_id'
        },
        {
          title: '客服回答时间',
          minWidth: 100,
          key: 'last_replay_time'
        },
        {
          title: '客服回答',
          minWidth: 200,
          key: 'last_replay_msg'
        },
        {
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
                    icon: 'chatboxes',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(this.tableDatas[params.index].player_id)
                    }
                  }
                }, '查看详情'
              )
            ])
          }
        }

      ],
      tableDatas: [],
      chatMessages: [],
      mymodel: 'my-model1'
    }
  },
  watch: {
    // $route (to) {
    //   if (to.query.player_id) {
    //     if (this.isPunch) {
    //       this.showEditModal(to.query.player_id)
    //     }
    //   }
    // }
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
          ...this.query,
          start_time: (this.datasTime.length > 0 && this.datasTime[0]) ? this.datasTime[0] : '',
          end_time: (this.datasTime.length > 1 && this.datasTime[1]) ? this.datasTime[1] + ' 23:59:59' : ''
        }
        const result = await this.$store.dispatch('getPlayerSummary', data)
        if (result) {
          if (result.data) {
            this.tableDatas = result.data
          }
          if (result.meta) {
            this.total = result.meta.total
          }
        }
        // this.tableDatas = res.tableDatas
        // this.total = res.total
        // this.arrTitles = res.arrTitles
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
      this.showAdd = false
      this.init()
    },
    showEditModal (playerId) {
      this.showEdit = true
      this.playerId = playerId
      this.queryChatMessages({player_id: this.playerId})
      this.box = this.$refs.message_box
      setTimeout(() => {
        this.$refs.message_box.scrollTop = this.$refs.message_box.scrollHeight
      }, 500)

      this.box.addEventListener('scroll', () => {
        this.throttle(this.queryMsg, this)
      }, false)
    },
    queryMsg () {
      if (this.$refs.message_box.scrollTop === 0) {
        if (this.chatCurrentPage < this.chatTotalPage) {
          this.queryChatMessages({player_id: this.playerId, page: this.chatCurrentPage + 1})
        }
      }
    },
    throttle (method, context) {
      clearTimeout(method.tId)
      method.tId = setTimeout(function () {
        method.call(context)
      }, 500)
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        }
      })
    },
    async queryChatMessages (data) {
      try {
        this.queryLoading = true
        const result = await this.$store.dispatch('getChatMessages', data)
        if (result) {
          if (result.data && result.meta.current_page === 1) {
            this.chatMessages = result.data.reverse()
          }
          if (result.data && result.meta.current_page > 1) {
            this.chatMessages = result.data.reverse().concat(this.chatMessages)
          }
          this.chatCurrentPage = (result.meta && result.meta.current_page) ? result.meta.current_page : 1
          this.chatTotalPage = (result.meta && result.meta.last_page) ? result.meta.last_page : 1
        }
      } catch (error) {
      }
      this.queryLoading = false
    }
  }
}
</script>
<style>

.my-model {
  left: 0;
}
.my-model1 {
  left: 15px;
}
.my-model2 {
  left: -15px;
}
</style>

<style lang="less" scoped>
.message {
  list-style: none;
  padding: 10px 15px;
  overflow-y: scroll;
  height: 400px;
  li {
    margin-bottom: 15px;
  }
  .time1 {
    margin: 7px 0;
    text-align: left;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .time2 {
    margin: 7px 0;
    text-align: right;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .time {
    margin: 7px 0;
    text-align: center;
    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }
  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }
  .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: ~'calc(100% - 40px)';
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #f3f3f3;
    border-radius: 3px;
    &:before {
      content: ' ';
      position: absolute;
      top: 2px;
      right: 100%;
      border: 5px solid transparent ;
      border-bottom-width: 8px  ;
      border-right-color: #f3f3f3;
    }
  }
  .self {
    text-align: right;
    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }
    .text {
      background-color: #b2e281;
      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
.send-box {
  display: flex;
  .replay-box {
    flex: 1;
  }
  .replay-btn {
    flex: 0 0 60px;
    align-self: flex-end;
    text-align: center;
  }
}
.margin-top-10 {
  margin-top: 10px;
}
</style>
