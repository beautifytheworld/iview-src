<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
      <FormItem label="打卡状态:" class="">
        <Tag color="blue">{{isPunchText}}</Tag>
      </FormItem>
      <FormItem label="" class="" :label-width="1">
        <Button type="primary" :loading="loading" @click="toPunchCard" :icon="isPunch?'arrow-down-c':'arrow-up-c'">
          <span v-if="!isPunch">上班打卡</span>
          <span v-else>下班打卡</span>
        </Button>
      </FormItem>

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
    <Modal v-model="showEdit" :title="'与玩家'+this.playerId+'聊天'" width="560" :class-name="chatModalClass" @on-cancel="cancel">
      <ul class="message" ref="message_box" id="ul_message_box">
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

        <div class="replay-box">
          <Input v-model="editRow.textarea" type="textarea" :autosize="{minRows: 3,maxRows: 3}" placeholder="输入回复内容..."></Input>
        </div>
        <div class="replay-btn">
          <Button type="primary" @click="sendMsg" :loading="loading" size="small">发送</Button>
        </div>

        <!-- <Button type="default" @click="cancel">取消</Button> -->

      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { mapGetters } from 'vuex'

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
          title: '反馈时间',
          minWidth: 160,
          key: 'created_at'
        },
        {
          title: '玩家ID',
          minWidth: 100,
          key: 'player_id'
        },
        {
          title: '状态',
          minWidth: 160,
          key: 'u_type',
          render: (h, params) => {
            return h('span', '未处理')
          }
        },
        {
          title: '反馈内容',
          minWidth: 160,
          key: 'msg'
        },
        {
          title: '客服ID',
          minWidth: 100,
          key: 'service_id'
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
                    icon: 'chatbubbles',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      if (this.isPunch) {
                        this.showEditModal(this.tableDatas[params.index].player_id)
                      } else {
                        this.$Message.error('请先打卡上班后才能回复！')
                      }
                    }
                  }
                }, '回复'
              )
            ])
          }
        }

      ],
      tableDatas: [],
      // chatMessages: [],
      mymodel: 'my-model1'
    }
  },
  watch: {
    $route (to) {
      if (to.query.player_id) {
        if (this.isPunch) {
          this.showEditModal(to.query.player_id)
        }
      }
    }
  },
  mounted () {
    console.log(this.$route.query.player_id)
  },
  computed: {
    ...mapGetters(['isPunch', 'isPunchText', 'chatMessages', 'chatModalClass'])
  },
  methods: {
    init () {
      this.queryList()
    },
    toPunchCard () {
      this.loading = true
      setTimeout(() => {
        if (this.isPunch) {
          // 下班打卡
          this.$Modal.confirm({
            title: '确认下班打卡',
            content: '<p> 确认下班打卡后会自动退出系统！</p>',
            onOk: () => {
              this.addPunchCard(false)
            },
            onCancel: () => {
              // this.$Message.info('Clicked cancel')
            }
          })
        } else {
          // 上班打卡
          this.addPunchCard(true)
        }
        this.loading = false
      }, 200)
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
        const result = await this.$store.dispatch('getMessageNotReplay', data)
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
      this.$store.commit('SET_CHAT_PLAYER_ID', 0)
      this.$store.commit('SET_SHOW_CHAT_MODAL', false)
      this.showAdd = false
      this.init()
    },
    // async getLastOnePunchCards () {
    //   try {
    //     var data = {
    //       service_id: '8888'
    //     }
    //     const result = await this.$store.dispatch('getLastOnePunchCards', data)
    //     if (result && result.data) {
    //       console.log(result)
    //       let data = result.data
    //       if (data.hasOwnProperty('status')) {
    //         this.isPunchText = data.status === 1 ? '已上班打卡' : '已下班打卡'
    //         this.isPunch = data.status === 1
    //       } else {
    //         this.isPunch = false
    //       }
    //     }
    //   } catch (error) {

    //   }
    // },
    async addPunchCard (punchCard) {
      try {
        var data = {
          type: 1
        }
        if (punchCard) {
          data.status = 1
          this.$store.dispatch('initWebSocket')
          // 上班打卡
          const result = await this.$store.dispatch('storePunchCard', data)
          this.$store.commit('SET_IS_PUNCH', true)
          this.$store.commit('SET_IS_PUNCH_TEXT', '已打卡上班')
          console.log(result)
        } else {
          // 下班打卡
          data.status = 2
          this.$store.dispatch('closeWebSocket')
          await this.$store.dispatch('storePunchCard', data)
          this.$store.commit('SET_IS_PUNCH', false)
          this.$store.commit('SET_IS_PUNCH_TEXT', '已打卡下班')
          this.$store.dispatch('logOut').then(() => location.reload())
        }
      } catch (error) {

      }
    },
    showEditModal (playerId) {
      this.showEdit = true
      this.playerId = playerId
      this.$store.commit('SET_CHAT_PLAYER_ID', this.playerId)
      this.$store.commit('SET_SHOW_CHAT_MODAL', true)
      this.queryChatMessages({player_id: this.playerId})
      this.box = this.$refs.message_box
      setTimeout(() => {
        this.$refs.message_box.scrollTop = this.$refs.message_box.scrollHeight
      }, 500)

      this.box.addEventListener('scroll', () => {
        // console.log(' scroll ' + this.$refs.message_box.scrollTop)
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
            this.$store.commit('SET_CHAT_MESSAGES', result.data.reverse())
          }
          if (result.data && result.meta.current_page > 1) {
            this.$store.commit('SET_CHAT_MESSAGES', result.data.reverse().concat(this.chatMessages))
          }
          this.chatCurrentPage = (result.meta && result.meta.current_page) ? result.meta.current_page : 1
          this.chatTotalPage = (result.meta && result.meta.last_page) ? result.meta.last_page : 1
        }
      } catch (error) {
      }
      this.queryLoading = false
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
          this.toQuery()
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
    },

    async sendMsg () {
      try {
        const result = await this.$store.dispatch('replayMessage', { msg: this.editRow.textarea, player_id: this.playerId })
        if (result && result.data) {
          // this.chatMessages.push()
          this.$store.commit('PUSH_CHAT_MESSAGES', result.data)
        }
        this.editRow.textarea = ''
        this.boxShake(false)
      } catch (error) {

      }
    },
    boxShake (flag) {
      setTimeout(() => {
        this.$refs.message_box.scrollTop = this.$refs.message_box.scrollHeight
      }, 500)
      if (flag) {
        var si = setInterval(() => {
          this.mymodel = this.mymodel === 'my-model2' ? 'my-model1' : 'my-model2'
        }, 80)
        setTimeout(() => {
          clearInterval(si)
          this.mymodel = 'my-model'
        }, 600)
      }
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
