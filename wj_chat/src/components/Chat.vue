<template>
  <div>
    <!-- <div class="app-header">
      <div class="person-name">联系客服</div>
    </div> -->
    <!-- <div class="content-box">
    </div> -->
    <!-- <img src="./images/bg.png" alt="" class="content-box"> -->
    <div class="app-conetnt-box">
      <ul
        class="app-conetnt"
        ref="ul_msg_box"
      >
        <li
          v-for="(item,index) in chatMessages "
          :key="index"
          :class="parseInt(item.u_type)===1?'chat-item-me':'chat-item'"
        >

          <img
            class="head-img"
            :src="faceid"
            v-if="parseInt(item.u_type)===1"
          >
          <img
            class="head-img"
            src="./images/kf.png"
            v-else
          >
          <p
            :style="{textAlign:parseInt(item.u_type)===1?'right':'left',color:'#7a482c'}"
            v-if="item.created_at"
          >
            {{ parseInt(item.u_type)===2 ? '小仙女客服'+ item.service_id : nickname }}
            &nbsp; &nbsp;{{item.created_at}}</p>
          <div
            class="chat-msg"
            v-text="item.msg"
          ></div>
          <div style="clear:both;"></div>
        </li>

      </ul>

    </div>

    <div class="app-send">
      <div class="app-send-box">

        <div class="send-content">
          <textarea
            type="text"
            v-model="userMsg"
            @keyup.enter="sendMsg"
            autofocus
          ></textarea>
        </div>
        <img
          src="./images/send.png"
          alt=""
          class="send-icon"
          @click="sendMsg"
        >
      </div>
      <!-- <div class="send-icon" @click="sendMsg">
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data () {
    return {
      websocket: null,
      messages: [],
      userMsg: '',
      uid: 0,
      faceid: '',
      nickname: '',
      osTop: 0,
      box: '',
      chatMessages: [
      ]
    }
  },
  mounted: function () {
    // this.osTop = this.ref.scrollTop || document.body.scrollTop
    this.osTop = this.$refs.ul_msg_box.scrollTop
    console.log(this.osTop)
    window.addEventListener('scroll', this.handleScroll)
    const obj = this.parseUrl(window.location.href)
    this.uid = obj.hasOwnProperty('uid') ? parseInt(obj.uid) : 0
    this.faceid = obj.hasOwnProperty('faceid') ? obj.faceid : ''
    this.nickname = obj.hasOwnProperty('nickname') ? obj.nickname : ''
    if (this.uid && this.uid > 0 && this.faceid && this.nickname) {
      this.faceid = '/static/' + this.faceid + '.png'
      // this.faceid = decodeURIComponent(this.faceid)
      this.nickname = decodeURIComponent(this.nickname)
      this.initWebSocket()
      this.queryChatMessages()
    } else {
      console.log('url error')
    }
  },
  updated: function () {
    // document.documentElement.scrollTop = document.body.scrollTop = this.osTop + 10000
    this.$refs.ul_msg_box.scrollTop = document.body.scrollTop = this.osTop + 10000
  },
  methods: {
    parseUrl (url) {
      var result = {}
      var query = url.split('?')[1]
      var queryArr = query.split('&')
      queryArr.forEach(function (item) {
        var key = item.split('=')[0]
        var value = item.split('=')[1]
        result[key] = value
      })
      return result
    },
    handleScroll () {
      // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    },
    initWebSocket () {
      // const wsuri = 'ws://chat.syjjmj.com/wsapp' // ws地址 uu
      // const wsuri = 'ws://23.100.95.151/wsapp' // ws地址 test
      // const wsuri = 'ws://wj_chat.sgqoc.com/wsapp' // ws地址 test
      // const wsuri = 'ws://192.168.10.10:2346' // ws地址
      const wsuri = 'ws://23.101.26.232:8008/wsapp' // ws地址
      this.websocket = new WebSocket(wsuri)
      this.websocket.onopen = this.websocketonopen
      this.websocket.onerror = this.websocketonerror
      this.websocket.onmessage = this.websocketonmessage
      this.websocket.onclose = this.websocketclose
    },
    websocketonopen () {
      console.log('WebSocket连接成功')
      setInterval(() => {
        this.websocket.send('c')
      }, 40000)
    },
    websocketonmessage (e) { // 数据接收
      // json数据转换成js对象
      let data = JSON.parse(e.data)
      // console.log(data)
      var type = data.type || ''
      switch (type) {
        // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
        case 'init':
          // 起ajax请求，将client_id发给后端进行uid绑定
          axios.post('/api/player_bind', { client_id: data.client_id, uid: this.uid }).then((response) => {
            // console.log(response)
          }).catch((err) => {
            console.log(err, 'error')
            alert('系统繁忙!请稍后再试！')
          })
          break
        // 当mvc框架调用GatewayClient发消息时直接alert出来
        default:
          this.chatMessages.push(data)
      }
    },
    websocketonerror (e) { // 错误
      console.log('WebSocket连接发生错误')
    },
    websocketclose (e) { // 关闭
      console.log('connection closed (' + e.code + ')')
    },
    sendMsg () {
      var str = this.userMsg
      var arr = []
      var n = 200
      var len = Math.ceil(str.length / n)
      for (var i = 0; i < len; i++) {
        if (str.length >= n) {
          var strCut = str.substring(0, n)
          arr.push(strCut)
          str = str.substring(n)
        } else {
          arr.push(str)
        }
      }
      arr.forEach((item, index) => {
        if (this.uid) {
          axios.post('/api/send', { msg: item, player_id: this.uid }).then((response) => {
            if (response.data && response.data.data) {
              this.chatMessages.push(response.data.data)
            }
          }).catch((err) => {
            console.log(err, 'error')
          })
        }
      })

      this.userMsg = ''
    },
    queryChatMessages () {
      axios.get('/api/chat_messages', {
        params: {
          player_id: this.uid
        }
      }).then((response) => {
        if (response.data && response.data.data) {
          this.chatMessages = response.data.data.reverse()
        }
        if (this.chatMessages.length === 0) {
          this.chatMessages.push({
            u_type: 2,
            msg: '您好,有什么可以帮到你的么？'
          })
        }
      }).catch((err) => {
        console.log(err, 'error')
      })
      this.userMsg = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.app-send {
  position: fixed;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1rem;
  /* background-color: #231a4f; */
  align-items: center;
  /* padding:1px; */
}
.app-send-box {
  flex: 1;
  padding: 5px 10px 5px 0;
  display: flex;
  height: 1rem;
  /* background-color: #231a4f; */
  background-image: url("images/send_box.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.send-content {
  flex: 1;
  height: 0.9rem;
  margin: 0.02rem 0.44rem 0 0.12rem;
}
.send-content textarea {
  width: 96%;
  resize:none;
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 20px;
  border: none;
  outline: none;
  border-radius: 10px;
  color: #7a482c;
  /* background-color: #231a4f; */
  /* margin: 0.1rem; */
  margin-left: 15px;
  padding-left: 12px;
  background-image: url("images/send_text.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.send-icon {
  width: 1.8rem;
  height: 0.96rem;
}

.app-conetnt-box {
  position: fixed;
  padding: 30px 10px 50px 10px;
  left: 0;
  right: 0;
  top: 0;
  background-image: url("images/bg.png");
  background-repeat:  no-repeat;
  background-size: 100% 100%;
  bottom: 1rem;
  /* background-color: #231a4f; */
  overflow-y:scroll;
  overflow-x:hidden;
}
.app-conetnt-box::-webkit-scrollbar {
  display: none;
}
.app-conetnt {
  position: absolute;
  position: relative;
  padding: 10px;
  height: 100%;
  overflow-y: scroll;
}
.app-conetnt::-webkit-scrollbar {
  display: none;
}
.app-conetnt .chat-item {
  margin-bottom: 10px;
}

.chat-item .head-img {
  display: block;
  border-radius: 5px;
  width: 0.76rem;
  height: 0.76rem;
  float: left;
  margin: 0 0.18rem;
}

.chat-item .chat-msg {
  position: relative;
  float: left;
  background: #fffeff;
  max-width: 64%;
  line-height: 0.48rem;
  font-size: 0.32rem;
  padding: 0.1rem;
  border-radius: 6px;
  word-break: break-all;
  color: #7a482c;
}

.chat-item .chat-msg:before {
  content: " ";
  position: absolute;
  border: 0.2rem solid transparent;
  border-top-color: #fffeff;
  top: 0rem;
  left: -0.1rem;
}

.app-conetnt .chat-item-me {
  margin-bottom: 10px;
}

.chat-item-me .head-img {
  display: block;
  border-radius: 5px;
  width: 0.76rem;
  height: 0.76rem;
  float: right;
  margin: 0 0.18rem;
}

.chat-item-me .chat-msg {
  position: relative;
  float: right;
  background: #acf756;
  color: #7a482c;;
  max-width: 64%;
  line-height: 0.48rem;
  font-size: 0.32rem;
  padding: 0.1rem;
  border-radius: 6px;
  word-break: break-all;
}
.chat-item-me .chat-msg:before {
  content: " ";
  position: absolute;
  border: 0.2rem solid transparent;
  border-top-color: #acf756;
  top: 0rem;
  right: -0.1rem;
}
</style>
