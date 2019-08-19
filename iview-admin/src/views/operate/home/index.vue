
<template>
    <div class="home-main">

        <div class="home-main-top clearfloat">
            <div class="home-main-top-left">
                <Button class="left-top" long :loading="loading" icon="loop" @click="toLoading">点我刷新数据</Button>
                <div class="left-bottom">
                    <p class="left-bottom-title">用户综述</p>
                    <div class="left-bottom-data">
                        <div class="data-item" v-for="i in 10" :key="i+'user-num'">
                          <span v-if="arrTitles[28+i] != '代理最高注册'"> {{arrTitles[28+i]}}：{{arrDatas[28+i]}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="home-main-top-right ">
                <p class="top-right-title">综述</p>
                <div class="top-right-data">
                    <div class="data-item"  v-for="i in 10" :key="i+'zs-num'">
                        {{arrTitles[i-1]}}：{{arrDatas[i-1]}}
                    </div>

                    <div class="data-item">
                        <!-- 预留： -->
                    </div>
                    <div class="data-item">
                        <!-- 预留： -->
                    </div>
                     <div class="data-item"  v-for="i in 9" :key="i+'zs1-num'">
                        {{arrTitles[9+i]}}：{{arrDatas[9+i]}}
                    </div>

                     <div class="data-item"  v-for="i in 9" :key="i+'zs2-num'">
                        {{arrTitles[18+i]}}：{{arrDatas[18+i]}}
                    </div>

                </div>

            </div>

        </div>

        <div class="home-user-online">
        <div class="online-title">在线分布</div>
        <ve-histogram :data="chartData1" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram>
        <Row type="flex" justify="space-around" class="code-row-bg">
            <Col span="8"><ve-histogram :data="chartData2" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram></Col>
            <Col span="16"><ve-histogram :data="chartData3" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram></Col>
       </Row>

        <ve-histogram :data="chartData4" :settings="chartSettings" :extend="extend" height="300px"></ve-histogram>
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
        columns: ['游戏', '百人房'],
        rows: [
        ]
      },
      chartData2: {
        columns: ['游戏', '5倍房', '10倍房'],
        rows: [
        ]
      },
      chartData3: {
        columns: ['游戏', '7包房', '7包优先房', '10包房', '10包优先房'],
        rows: [
        ]
      },
      chartData4: {
        columns: ['游戏', '新手房', '初级房', '高级房', '富豪房', '试玩房', '约战房'],
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
        let rows3 = []
        let rows4 = []
        let len = this.arrDatas.length
        let f1 = this.arrTitles.indexOf('百人牛牛')
        let f2 = this.arrTitles.indexOf('扫雷红包')
        let f3 = f2 + 5
        let startIndex = this.arrTitles.indexOf('今日注册') + 1

        for (let i = startIndex; i < f1; i += 2) {
          rows1.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '百人房': this.arrDatas[i + 1]
          })
        }
        for (let i = f1; i < f2; i += 3) {
          rows2.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '5倍房': this.arrDatas[i + 1], '10倍房': this.arrDatas[i + 2] })
        }
        for (let i = f2; i < f3; i += 5) {
          rows3.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '7包房': this.arrDatas[i + 1], '7包优先房': this.arrDatas[i + 2], '10包房': this.arrDatas[i + 3], '10包优先房': this.arrDatas[i + 4] })
        }
        for (let i = f3; i < len; i += 7) {
          rows4.push({ '游戏': this.arrTitles[i] + ': ' + this.arrDatas[i], '新手房': this.arrDatas[i + 1], '初级房': this.arrDatas[i + 2], '高级房': this.arrDatas[i + 3], '富豪房': this.arrDatas[i + 4], '试玩房': this.arrDatas[i + 5], '约战房': this.arrDatas[i + 6] })
        }
        this.chartData1.rows = rows1
        this.chartData2.rows = rows2
        this.chartData3.rows = rows3
        this.chartData4.rows = rows4
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
          margin-top: 8px;
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
