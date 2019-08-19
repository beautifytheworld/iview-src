<template>
  <div class="main-content">
    <van-tabs v-model="active" sticky>
      <van-tab title="首页">
        <van-notice-bar mode="closeable"
          >收益会在1~2小时内发放至您的推广账户内，请在推广处查看</van-notice-bar
        >

        <van-button
          size="small"
          type="danger"
          class="reload-btn"
          @click="init"
          round
          :loading="loading2"
          >刷新</van-button
        >

        <div v-if="promoObj">
          <div v-for="(item, key) in promoObj" :key="key">
            <div
              style="text-align:left;font-size:16px;padding:10px 0 5px 30px"
              v-if="key == '可领取收益'"
            >
              {{ key }}：{{ item }}
              <van-button
                v-if="item > 0"
                size="small"
                type="danger"
                @click="getUserAgencyAward"
                round
                :loading="loading3"
                >点击领取</van-button
              >
            </div>
            <div
              style="text-align:left;font-size:16px;padding:10px 0 5px 30px"
              v-else
            >
              {{ key }}：{{ item }}
            </div>
          </div>
        </div>
        <div class="exit-btn">
          <van-nav-bar @click-right="loginOut">
            <div slot="left">当前用户: {{ szNickName }}</div>

            <van-button size="small" slot="right">退出登录</van-button>
          </van-nav-bar>
        </div>
      </van-tab>

      <van-tab title="推广链接">
        <div v-if="qrcodes">
          <van-panel v-for="(item, key) in qrcodes" :key="key">
            <div
              slot="header"
              style="text-align:center;font-size:16px;padding:5px;"
            >
              <a :href="item" target="_blank">{{ key }}</a>
            </div>
            <div style="text-align:center">
              <Qrcode :val="item"></Qrcode>
            </div>
          </van-panel>
        </div>
      </van-tab>

      <van-tab title="玩家列表">
        <div class="reg-date-box">
          <div class="reg-title"><label for="RegDate">注册时间:</label></div>
          <input
            type="date"
            name="start"
            v-model="query1.start_time"
            id="RegDate"
            class="input-date"
            placeholder="开始"
          />-
          <input
            type="date"
            name="end"
            v-model="query1.end_time"
            class="input-date"
          />
        </div>
        <div class="wjid-box">
          <div class="reg-title">
            <label for="wjid">玩&nbsp;家&nbsp;&nbsp;ID:</label>
          </div>
          <input
            type="text"
            v-model="query1.UserID"
            id="wjid"
            class="input-user"
            placeholder="输入玩家ID"
          />
          <!-- <vant-button class="search-btn" @click="onSearch1" >搜索</vant-button> -->
          <van-button
            size="small"
            class="search-btn"
            @click="onSearch1"
            :loading="loading1"
            >搜索</van-button
          >
        </div>
        <!-- <van-search
          v-model="value"
          placeholder="请输入搜索关键词"
          show-action
          @search="onSearch"
        >
          <div
            slot="action"
            @click="onSearch"
          >搜索</div>  </van-search> -->

        <van-pagination
          v-model="currentPage1"
          :total-items="total1"
          :items-per-page="per_page"
          @change="toNextPage1"
          mode="simple"
        />
        <mu-paper :z-depth="1">
          <mu-data-table
            height="600"
            stripe
            border
            :columns="columns1"
            :data="tableDatas1"
          >
          </mu-data-table>
        </mu-paper>
      </van-tab>
      <van-tab title="收入明细">
        <div class="reg-date-box">
          <div class="reg-title"><label for="RegDate2">游戏时间:</label></div>
          <input
            type="date"
            name="start"
            v-model="query2.start_time"
            id="RegDate2"
            class="input-date"
            placeholder="开始"
          />-
          <input
            type="date"
            name="end"
            v-model="query2.end_time"
            class="input-date"
          />
        </div>
        <div class="wjid-box">
          <div class="reg-title">
            <label for="wjid2">玩&nbsp;家&nbsp;&nbsp;ID:</label>
          </div>
          <input
            type="text"
            v-model="query2.UserID"
            id="wjid2"
            class="input-user"
            placeholder="输入玩家ID"
          />
          <!-- <vant-button class="search-btn" @click="onSearch2" >搜索</vant-button> -->
          <van-button
            size="small"
            class="search-btn"
            @click="onSearch2"
            :loading="loading2"
            >搜索</van-button
          >
        </div>
        <van-pagination
          v-model="currentPage2"
          :total-items="total2"
          :items-per-page="per_page"
          mode="simple"
          @change="toNextPage2"
        />
        <mu-paper :z-depth="1">
          <mu-data-table
            height="600"
            stripe
            border
            :columns="columns2"
            :data="tableDatas2"
          >
          </mu-data-table>
        </mu-paper>
      </van-tab>
    </van-tabs>
    <!-- <van-nav-bar
  title=""
 
  right-text="当前用户"
  @click-left="onClickLeft"
  @click-right="onClickRight"
>  <van-icon name="arrow-down" slot="left" />
</van-nav-bar> -->

    <!-- <router-view/> -->
    <!-- <van-tabbar v-model="active">
  <van-tabbar-item icon="home">首页</van-tabbar-item>
  <van-tabbar-item icon="contact" >玩家列表</van-tabbar-item>
  <van-tabbar-item icon="gold-coin">收入明细</van-tabbar-item>
  <van-tabbar-item icon="records">推广链接</van-tabbar-item>
</van-tabbar> -->
  </div>
</template>
<script>
import api from "@/api";
import { clearAllCache, getKey } from "@/libs/util";

export default {
  name: "home",
  components: {},
  data() {
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      per_page: 30,
      currentPage1: 1,
      currentPage2: 1,
      value: "",
      active: 0,
      show: false,
      actions: [],
      sort: {
        name: "",
        order: "asc"
      },
      columns1: [],
      tableDatas1: [],
      total1: 0,
      total2: 0,
      columns2: [],
      tableDatas2: [],
      query1: {},
      query2: {},
      qrcodes: null,
      promoObj: null
    };
  },
  computed: {
    szNickName: function() {
      return getKey("szNickName");
    }
  },
  methods: {
    init() {
      this.getWjPromoList();
      this.getWJPromoURL();
      this.toNextPage1(1);
      this.toNextPage2(1);
    },
    toNextPage1(page) {
      let minIndex = (page - 1) * this.per_page;
      let maxIndex = page * this.per_page;
      const data = {
        minIndex: minIndex,
        maxIndex:
          maxIndex > this.total1 && this.total1 && page > 1
            ? this.total1
            : maxIndex,
        ...this.query1
      };
      this.getWJUserList(data);
    },
    toNextPage2(page) {
      let minIndex = (page - 1) * this.per_page;
      let maxIndex = page * this.per_page;
      const data = {
        minIndex: minIndex,
        maxIndex:
          maxIndex > this.total2 && this.tota2 && page > 1
            ? this.total2
            : maxIndex,
        ...this.query2
      };
      this.getWJIncomeDetail(data);
    },

    onSearch1() {
      this.currentPage1 = 1;
      this.toNextPage1(1);
    },
    onSearch2() {
      this.currentPage2 = 1;
      this.toNextPage2(1);
    },
    getWJUserList(data) {
      this.loading1 = true;

      api
        .getWJUserList(data)
        .then(result => {
          const res = this.handleResult(result);
          this.columns1 = [];
          let columnTitles = res.arrTitles;
          let columnKeys = res.arrKeys;
          for (let i = 0; i < columnKeys.length; i++) {
            this.columns1.push({
              title: columnTitles[i],
              width: 110,
              align: "center",
              class: "red-bg",
              name: columnKeys[i]
            });
          }
          this.tableDatas1 = res.tableDatas;
          this.total1 = res.total;
          this.loading1 = false;
        })
        .catch(err => {
          this.loading1 = false;

          console.log(JSON.stringify(err));
        });
    },
    getWJIncomeDetail(data) {
      this.loading2 = true;
      api
        .getWJIncomeDetail(data)
        .then(result => {
          const res = this.handleResult(result);
          this.columns2 = [];
          let columnTitles = res.arrTitles;
          let columnKeys = res.arrKeys;
          for (let i = 0; i < columnKeys.length; i++) {
            this.columns2.push({
              title: columnTitles[i],
              width: 110,
              align: "center",
              class: "red-bg",
              name: columnKeys[i]
            });
          }
          this.tableDatas2 = res.tableDatas;
          this.total2 = res.total;
          this.loading2 = false;
        })
        .catch(err => {
          this.loading2 = false;

          console.log(JSON.stringify(err));
        });
    },

    getWJPromoURL() {
      api
        .getWJPromoURL()
        .then(result => {
          const res = this.handleResult(result);
          if (res.tableDatas && res.tableDatas.length) {
            this.qrcodes = res.tableDatas[0];
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    getWjPromoList() {
      api
        .getWjPromoList()
        .then(result => {
          const res = this.handleResult(result);
          if (res.tableDatas && res.tableDatas.length) {
            this.promoObj = res.tableDatas[0];
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    handleResult(result, keys) {
      let res = { arrKeys: [], arrTitles: [], tableDatas: [], total: 0 };
      if (result && result.data) {
        let data = result.data;
        if (
          data.arrTitles &&
          data.arrTitles.arrString &&
          data.arrTitles.arrString.length
        ) {
          res.arrTitles = data.arrTitles.arrString;
        }
        if (
          data.arrKeys &&
          data.arrKeys.arrString &&
          data.arrKeys.arrString.length
        ) {
          res.arrKeys = data.arrKeys.arrString;
        }
        if (!res.arrKeys.length) {
          res.arrKeys = res.arrTitles;
        }
        if (!keys) {
          keys = res.arrKeys;
        }
        if (data.arrDatas && data.arrDatas.length) {
          for (let i = 0; i < data.arrDatas.length; i++) {
            var rowObj = {};
            for (let index = 0; index < keys.length; index++) {
              rowObj[keys[index]] = data.arrDatas[i].arrString[index];
            }
            res.tableDatas.push(rowObj);
          }
        }
        res.total = data.nTotal ? data.nTotal : 0;
      }
      return res;
    },
    getUserAgencyAward() {
      this.loading3 = true;
      api
        .getUserAgencyAward({ name: getKey("user_name") })
        .then(result => {
          if (result.data && result.data.szresult == "成功.") {
            setTimeout(() => {
              this.loading3 = false;
              this.init();
            }, 2500);
          }
        })
        .catch(err => {
          this.loading3 = false;
          console.log(JSON.stringify(err));
        });
    },
    loginOut() {
      this.$dialog
        .confirm({
          title: "确认退出?"
        })
        .then(() => {
          clearAllCache();
          setTimeout(() => {
            location.reload();
          }, 1000);
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.reload-btn {
  position: fixed;
  bottom: 80px;
  left: 0;
}
.exit-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
}
.wjid-box {
  padding: 0.18667rem 0.2rem;
  font-size: 14px;
  background: rgb(242, 242, 242);
  display: flex;
  .reg-title {
    padding: 0 0.26667rem;
    font-size: 0.37333rem;
    line-height: 0.8rem;
    color: #7d7e80;
  }
  .input-user {
    height: 28px;
    border: none;
    background: #fff;
    flex: 1;
    padding-left: 4px;
  }
  .search-btn {
    height: 28px;
    border: 1px solid #fff;
    background: #f2f2f2;
    width: 48px;
  }
}
.reg-date-box {
  padding: 0.18667rem 0.2rem;
  font-size: 14px;
  background: rgb(242, 242, 242);
  display: flex;
  .reg-title {
    padding: 0 0.26667rem;
    font-size: 0.37333rem;
    line-height: 0.8rem;
    color: #7d7e80;
  }
  .input-date {
    height: 28px;
    border: none;
    background: #fff;
    flex: 1;
  }
}
</style>

<style>
.red-bg {
  /* color: #!important; */
  background-color: #ebebeb;
}
</style>
