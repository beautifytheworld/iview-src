
<template>
    <div class="home-main">

        <div class="home-main-top clearfloat">
            <div class="home-main-top-left">
                <!-- <div class="left-top"> </div>  -->
                <Button class="left-top" long :loading="loading" icon="loop" @click="toLoading">点我刷新数据</Button>
                <div class="left-bottom">
                    <p class="left-bottom-title">用户综述</p>
                    <div class="left-bottom-data">
                        <div class="data-item" v-for="i in 10" :key="i+'user-num'">
                          {{arrTitles[24+i]}}：{{arrDatas[24+i]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-main-top-right ">
                <p class="top-right-title">综述</p>
                <div class="top-right-data">
                    <div class="data-item"  v-for="i in 14" :key="i+'zs-num'">
                        {{arrTitles[i-1]}}：{{arrDatas[i-1]}}
                    </div>
                    <!-- <div class="data-item">
                        今日代理充值：{{arrDatas[1]}}
                    </div>
                    <div class="data-item">
                        今日充值总额：{{arrDatas[2]}}
                    </div>
                    <div class="data-item">
                        今日玩家提现：{{arrDatas[3]}}
                    </div>
                    <div class="data-item">
                        今日代理提现：{{arrDatas[4]}}
                    </div>
                    <div class="data-item">
                        今日提现总额：{{arrDatas[5]}}
                    </div>
                    <div class="data-item">
                        今日税收：{{arrDatas[6]}}
                    </div>
                    <div class="data-item">
                        今日代理分成：{{arrDatas[7]}}
                    </div>
                    <div class="data-item">
                        今日利润：{{arrDatas[8]}}
                    </div>
                    <div class="data-item">
                        昨日充值：{{arrDatas[9]}}
                    </div>
                    <div class="data-item">
                        昨日提现：{{arrDatas[10]}}
                    </div>
                    <div class="data-item">
                        昨日税收：{{arrDatas[11]}}
                    </div>
                    <div class="data-item">
                        昨日代理分成：{{arrDatas[12]}}
                    </div>
                    <div class="data-item">
                        昨日利润：{{arrDatas[13]}}
                    </div> -->
                    <div class="data-item">
                        <!-- 预留： -->
                    </div>
                     <div class="data-item"  v-for="i in 5" :key="i+'zs1-num'">
                        {{arrTitles[13+i]}}：{{arrDatas[13+i]}}
                    </div>
                    <!-- <div class="data-item">
                        本月充值：{{arrDatas[14]}}
                    </div>
                    <div class="data-item">
                        本月提现：{{arrDatas[15]}}
                    </div>
                    <div class="data-item">
                        本月税收：{{arrDatas[16]}}
                    </div>
                    <div class="data-item">
                        本月代理分成：{{arrDatas[17]}}
                    </div>
                    <div class="data-item">
                        本月利润：{{arrDatas[18]}}
                    </div> -->
                    <div class="data-item">
                        <!-- 预留： -->
                    </div>
                     <div class="data-item"  v-for="i in 5" :key="i+'zs2-num'">
                        {{arrTitles[18+i]}}：{{arrDatas[18+i]}}
                    </div>
                    <!-- <div class="data-item">
                        充值总额：{{arrDatas[19]}}
                    </div>
                    <div class="data-item">
                        提现总额：{{arrDatas[20]}}
                    </div>
                    <div class="data-item">
                        税收总额：{{arrDatas[21]}}
                    </div>
                    <div class="data-item">
                        代理总分成：{{arrDatas[22]}}
                    </div>
                    <div class="data-item">
                        总利润：{{arrDatas[23]}}
                    </div> -->
                    <div class="data-item">
                        <!-- 预留： -->
                    </div>

                </div>

            </div>

        </div>

        <div class="home-user-online">
            <div class="online-title">在线分布</div>
            <!-- <div class="online-data">
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
            </div> -->
              <ve-histogram :data="chartData1" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram>
              <ve-histogram :data="chartData2" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram>
        </div>

    </div>
</template>

<script>

import onlineItem from './components/online-bar.vue'
// import { mapGetters } from 'vuex'

export default {
  name: 'home',
  components: {
    onlineItem
  },
  data () {
    this.chartSettings = {
      yAxisName: [ '游戏在线' ],
      yAxisType: ['KMB', 'percent'],
      min: [0]
    }
    return {
      loading: false,
      arrTitles: [],
      arrDatas: [],

      extend: {
        series: {
          label: { show: true, position: 'top' }
        }
      },
      chartData1: {
        columns: ['游戏', '新手房', '初级房', '高级房', '富豪房', '约战房'],
        rows: [
        ]
      },
      chartData2: {
        columns: ['游戏', '新手房', '初级房', '高级房', '富豪房', '约战房'],
        rows: [
        ]
      }
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
          maxArr.push(parseInt(this.arrDatas[i * 6 + 35]))
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
        let rows1 = []
        let rows2 = []
        let len = this.arrDatas.length
        let f1 = 35 + Math.round((len - 35) / 6 / 2) * 6

        for (let i = 35; i < f1; i += 6) {
          rows1.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '新手房': this.arrDatas[i + 1], '初级房': this.arrDatas[i + 2], '高级房': this.arrDatas[i + 3], '富豪房': this.arrDatas[i + 4], '约战房': this.arrDatas[i + 5] })
        }
        for (let i = f1; i < len; i += 6) {
          rows2.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '新手房': this.arrDatas[i + 1], '初级房': this.arrDatas[i + 2], '高级房': this.arrDatas[i + 3], '富豪房': this.arrDatas[i + 4], '约战房': this.arrDatas[i + 5] })
        }
        this.chartData1.rows = rows1
        this.chartData2.rows = rows2
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

  .home-main-top {
    margin: 0 auto;
    width: 1080px;
    .home-main-top-left {
      float: left;
      width: 480px;
      height: 320px;
      font-size: 14px;
      .left-top {
        border: 1px solid #e4e4e4;
        height: 120px;
        margin-bottom: 10px;
        font-size: 16px;
      }
      .left-bottom {
        border: 1px solid #e4e4e4;
        border-radius: 3px;
        height: 190px;
        .left-bottom-title {
          background: #e4e4e4;
          padding: 2px 20px;
          font-weight: 700;
        }
        .left-bottom-data {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          .data-item {
            flex: 0 0 200px;
            margin-top: 10px;
          }
        }
      }
    }
    .home-main-top-right {
      width: 580px;
      border: 1px solid #e4e4e4;
      border-radius: 3px;
      float: right;
      height: 320px;
      font-size: 14px;
      .top-right-title {
        background: #e4e4e4;
        padding: 2px 20px;
        font-size: 13px;
        font-weight: 700;
      }
      .top-right-data {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .data-item {
          flex: 0 0 180px;
          margin-top: 10px;
        }
      }
    }
  }
  .clearfloat {
    zoom: 1;
  }
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }

  .home-user-online {
    width: 1080px;
    border: 1px solid #e4e4e4;
    border-radius: 3px;
    margin: 10px auto;
    .online-title {
      font-size: 13px;
      font-weight: 700;
      padding: 2px 20px;
      background-color: #e4e4e4;
    }
    .online-data {
      display: flex;
      padding-bottom: 20px;
      .online-data-left {
        flex: 0 0 120px;
        padding-top: 20px;
        .room-title {
          width: 50px;
          height: 20px;
          font-size: 13px;
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
            font-size: 13px;
            align-self: center;
          }
        }
      }
    }
  }
}
</style>
