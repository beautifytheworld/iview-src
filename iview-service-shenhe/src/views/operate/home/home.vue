
<template>
    <div class="home-main">
        <div class="home-top">
            <div class="top-title">
                <span class="title">
                    <span style="background:#1abc9c;">&nbsp;</span>
                    今日数据
                </span>
                <Button icon="loop" :loading="loading" @click="toLoading" class="title-refresh">刷新</Button>
            </div>

        </div>

        <div class="home-today">
            <div class="today-item">
                <img src="../images/u226.png" alt="" class="item-logo">
                <p class="today-item-title">
                    今日充值
                </p>
                <p class="today-item-number">¥{{arrDatas[0]}}</p>

            </div>
            <div class="today-item">
                <img src="../images/u230.png" alt="" class="item-logo">
                <p class="today-item-title">
                    今日提现
                </p>
                <p class="today-item-number">¥{{arrDatas[1]}}</p>
            </div>
            <div class="today-item">
                <img src="../images/u233.png" alt="" class="item-logo">
                <p class="today-item-title">
                    今日税收
                </p>
                <p class="today-item-number">¥{{arrDatas[2]}}</p>
            </div>
            <div class="today-item">
                <img src="../images/u238.png" alt="" class="item-logo">
                <p class="today-item-title">
                    今日代理分成
                </p>
                <p class="today-item-number">¥{{arrDatas[4]}}</p>
            </div>
            <div class="today-item">
                <img src="../images/u235.png" alt="" class="item-logo">
                <p class="today-item-title">
                    今日利润
                </p>
                <p class="today-item-number">¥{{arrDatas[5]}}</p>
            </div>
        </div>

        <div class="home-user-overview">
            <div class="overview-title">用户概览</div>
            <div class="overview-data">
                <div class="data-left">

                    <overview-item className="overview-item" color="#66c" title="注册总数：" width="180px" :peoples="arrDatas[25]" :max="arrDatas[25]"></overview-item>
                    <overview-item className="overview-item" color="#393" title="安卓注册：" width="180px" :peoples="arrDatas[27]" :max="arrDatas[25]"></overview-item>
                    <overview-item className="overview-item" color="#c33" title="苹果注册：" width="180px" :peoples="arrDatas[29]" :max="arrDatas[25]"></overview-item>
                    <overview-item className="overview-item" color="#06f" title="H5注册：" width="180px" :peoples="arrDatas[31]" :max="arrDatas[25]"></overview-item>
                    <overview-item className="overview-item" color="#f60" title="代理最高注册：" width="180px" :peoples="arrDatas[33]" :max="arrDatas[25]"></overview-item>
                </div>
                <div class="data-center">
                    <div class="center-line"></div>

                </div>
                <div class="data-right">

                    <overview-item className="overview-item" color="#66c" title="在线总数：" width="180px" :peoples="arrDatas[26]" :max="arrDatas[26]"></overview-item>
                    <overview-item className="overview-item" color="#393" title="大厅人数：" width="180px" :peoples="arrDatas[28]" :max="arrDatas[26]"></overview-item>
                    <overview-item className="overview-item" color="#c33" title="游戏人数：" width="180px" :peoples="arrDatas[30]" :max="arrDatas[26]"></overview-item>
                    <overview-item className="overview-item" color="#06f" title="最高同时在线：" width="180px" :peoples="arrDatas[10]" :max="arrDatas[10]"></overview-item>
                    <overview-item className="overview-item" color="#f60" title="代理最高在线：" width="180px" :peoples="arrDatas[10]" :max="arrDatas[10]"></overview-item>

                </div>

            </div>
        </div>

        <div class="home-user-online">
            <div class="online-title">在线分布</div>
            <div class="online-data">
                <div class="online-data-left">
                    <div class="room-title" style="background-color:#ccc">新手房</div>
                    <div class="room-title" style="background-color:#0cd">初级房</div>
                    <div class="room-title" style="background-color:#3465cc">高级房</div>
                    <div class="room-title" style="background-color:#ff3203">富豪房</div>
                    <div class="room-title" style="background-color:#393">约战房</div>
                </div>
                <div class="online-data-right">

                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[36]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[37]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[38]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[39]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[40]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[35]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[42]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[43]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[44]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[45]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[46]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[41]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[48]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[49]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[50]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[51]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[52]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[47]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[54]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[55]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[56]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[57]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[58]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[53]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[60]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[61]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[62]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[63]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[64]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[59]}}
                        </div>
                    </div>
                         <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[66]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[67]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[68]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[69]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[70]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[65]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[72]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[73]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[74]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[75]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[76]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[71]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[78]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[79]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[80]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[81]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[82]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[77]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[84]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[85]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[86]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[87]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[88]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[83]}}
                        </div>
                    </div>
                    <div class="online-data-item">
                        <div class="data-item-bar">
                            <online-item :number="arrDatas[90]" :max="onlineMax" bg="#ccc"></online-item>
                            <online-item :number="arrDatas[91]" :max="onlineMax" bg="#0cd"></online-item>
                            <online-item :number="arrDatas[92]" :max="onlineMax" bg="#3465cc"></online-item>
                            <online-item :number="arrDatas[93]" :max="onlineMax" bg="#ff3203"></online-item>
                            <online-item :number="arrDatas[94]" :max="onlineMax" bg="#393"></online-item>
                        </div>
                        <div class="data-item-bottom">
                            {{arrTitles[89]}}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import overviewItem from './components/overview-item.vue'
import onlineItem from './components/online-bar.vue'
// import { mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    overviewItem,
    onlineItem
  },
  data () {
    return {
      loading: false,
      arrTitles: [],
      arrDatas: []
    }
  },
  computed: {
    // userName () {
    //   return Cookies.get('user_name')
    // },
    onlineMax () {
      let maxArr = []
      if (this.arrDatas.length) {
        for (let i = 0; i < 10; i++) {
          maxArr.push(parseInt(this.arrDatas[i * 6 + 19]))
        }
        return Math.max(...maxArr)
      } else {
        return 0
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    async queryList () {
      try {
        this.loading = true
        const data = {}
        const result = await this.$store.dispatch('getOperateHome', data)
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
    toLoading () {
      this.queryList()
    }
  }
}
</script>
<style lang="less" scoped>
.home-main {
  margin: 0 40px;
  .home-top {
    height: 40px;
    line-height: 40px;
    background: rgba(243, 243, 243, 1);
    width: 1080px;
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
  .home-today {
    width: 1080px;
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
    .today-item {
      flex: 0 0 200px;
      border: 1px solid rgba(228, 228, 228, 1);
      font-family: "微软雅黑";
      font-weight: 400;
      .item-logo {
        float: left;
        margin: 4px 12px 0 10px;
      }
      .today-item-title {
        font-size: 14px;

        color: #a1a1a1;
      }
      .today-item-number {
        font-size: 16px;
        color: #949494;
      }
    }
  }

  .home-user-overview {
    width: 1080px;
    border: 1px solid #e4e4e4;
    height: 200px;
    margin: 10px auto;
    .overview-title {
      font-size: 13px;
      font-weight: 700;
      padding-left: 20px;
      background-color: #e4e4e4;
    }
    .overview-data {
      margin: 5px;
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
      height: 175px;
      .data-left {
        flex: 0 0 500px;
      }
      .data-center {
        flex: 1;
        .center-line {
          margin: 0 auto;
          width: 5px;
          height: 160px;
          background: #949494;
        }
      }

      .data-right {
        flex: 0 0 500px;
      }
    }
    .overview-item {
      width: 520px;
      font-size: 14px;
      height: 34px;
    }
  }

  .home-user-online {
    width: 1080px;
    border: 1px solid #e4e4e4;
    // height: 200px;
    margin: 0 auto;
    .online-title {
      font-size: 13px;
      font-weight: 700;
      padding: 1px 20px;
      background-color: #e4e4e4;
    }
    .online-data {
      display: flex;
      .online-data-left {
        flex: 0 0 120px;
        padding-top: 20px;
        .room-title {
          width: 50px;
          height: 20px;
          font-size: 12px;
          margin: 10px auto;
          text-align: center;
          color: #fff;
        }
      }

      .online-data-right {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .online-data-item {
          flex: 0 0 120px;
          margin-right: 40px;
          display: flex;
          flex-direction: column;
          .data-item-bar {
            flex: 1 0 120px;
            display: flex;
          }
          .data-item-bottom {
            flex: 0 0 20px;
            align-self: center;
          }
        }
      }
    }
  }
}
</style>
