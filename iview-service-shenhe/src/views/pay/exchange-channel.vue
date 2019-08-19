
<template>
    <div class="setting-main">
        <div class="setting-top">
            <div class="top-title">
                <span class="title">
                    <span style="background:#1abc9c;">&nbsp;</span>
                    &nbsp; 充值功能配置
                </span>
                <Button icon="loop" :loading="loading" @click="toLoading" class="title-refresh">刷新</Button>
            </div>
        </div>
        <div class="setting-data">
            <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

        </div>
        <!-- <div style="text-align:right;padding:10px;">
            <Button>取消修改</Button>
            <Button type="primary">提交修改</Button>
        </div> -->
    </div>

</template>

<script>
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  components: {

  },
  data () {
    return {
      modal5: false,
      loading: false,
      queryLoading: false,
      arrTitles: [],
      arrDatas: [],
      page: 1,
      per_page: 200,
      title: '',
      content: '',
      columns: [
        {
          title: '通道名字',
          align: 'center',
          key: 'ChannelName'
        },
        {
          title: '通道类型',
          align: 'center',
          key: 'ChannelType'
        },
        {
          title: '请求地址',
          align: 'center',
          key: 'ChannelURL'
        },
        {
          title: '回调地址',
          align: 'center',
          key: 'ChannelCallbackURL'
        },
        {
          title: 'TOKEN密钥',
          align: 'center',
          key: 'ChannelToken'
        },
        {
          ellipsis: true,
          title: '公钥',
          align: 'center',
          key: 'ChannelPublicKey'
        },
        {
          ellipsis: true,
          title: '私钥',
          align: 'center',
          key: 'ChannelPrivateKey'
        },
        {
          title: '商户名',
          align: 'center',
          key: 'MerchandID'
        },
        {
          title: '状态',
          key: 'Status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: (params.row.Status === '1' || params.row.Status === 1),
                  size: 'large'
                },
                scopedSlots: {
                  open: () => {
                    return '开启'
                  },
                  close: () => {
                    return '关闭'
                  }
                },
                on: {
                  'on-change': status => {
                    this.changeStatus(params.index)
                  }
                }
              })
            ])
          }
          // render: (h, params) => {
          //   return h('div', [
          //     h('RadioGroup',
          //       {
          //         props: { value: params.row.Status },
          //         on: {
          //           'on-change': status => {
          //             console.log(status)
          //           }
          //         }
          //       }, [
          //         h('Radio', { props: { label: '1' } }, '开启'),
          //         h('Radio', { props: { label: '0' } }, '关闭'),
          //         h('Radio', { props: { label: '2' } }, '隐藏')
          //       ])

          //   ])
          // }
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
      this.per_page = 30
      this.getStatics()
    },
    async getStatics () {
      try {
        this.loading = true
        const data = {}
        const result = await this.$store.dispatch('getExchangeChannel', data)
        const res = this.handleResult(result, ['pkid', 'ChannelName', 'ChannelType', 'ChannelURL', 'ChannelCallbackURL', 'ChannelToken', 'ChannelPublicKey', 'ChannelPrivateKey', 'MerchandID', 'Status'])
        this.tableDatas = res.tableDatas
        this.total = res.total
        this.arrTitles = res.arrTitles
      } catch (error) {
      }
      this.loading = false
    },
    toLoading () {
      this.init()
    },
    changeStatus (index) {
      const data = { pkid: this.tableDatas[index].pkid, Status: (this.tableDatas[index].Status === '1' || this.tableDatas[index].Status === 1) ? '0' : '1' }
      this.saveEdit(data)
    },
    async saveEdit (data) {
      try {
        const res = await this.$store.dispatch('updateExchangeChannel', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.$Message.success('修改成功!')
          this.init()
        }
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setting-main {
  margin: 0 auto;
  width: 1080px;
  .setting-top {
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
  .setting-data {
    margin: 10px 0;
  }
}
</style>
