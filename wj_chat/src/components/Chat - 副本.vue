<template>
  <div>
    <div class="app-header">
      <div class="person-name">联系客服</div>
    </div>
    <ul class="app-conetnt" ref="ul_msg_box">
      <li v-for="(item,index) in chatMessages " :key="index" :class="parseInt(item.u_type)===1?'chat-item-me':'chat-item'">

        <img class="head-img" src="./images/me.png" v-if="parseInt(item.u_type)===1">
        <img class="head-img" src="./images/robot.png" v-else>
          <p :style="{textAlign:parseInt(item.u_type)===1?'right':'left',color:'#999'}" v-if="item.created_at"> {{ parseInt(item.u_type)===2 ? item.service_id : ''}}  {{item.created_at}}</p>
        <div class="chat-msg" v-text="item.msg"></div>
        <div style="clear:both;"></div>
      </li>

    </ul>

    <div class="app-send">
      <!-- <div class="send-icon">
            <i class="fa fa-smile-o" aria-hidden="true"></i>
        </div> -->
      <div class="send-content">
        <textarea type="text" v-model="userMsg" @keyup.enter="sendMsg"></textarea>
      </div>
      <div class="send-icon" @click="sendMsg">
        <!-- <i class="fa fa-paper-plane" aria-hidden="true"></i> -->
        发送
      </div>
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
      osTop: 0,
      box: '',
      chatMessages: [
      ]
    }
  },
  mounted: function () {
    this.osTop = document.documentElement.scrollTop || document.body.scrollTop

    window.addEventListener('scroll', this.handleScroll)
    const obj = this.parseUrl(window.location.href)
    this.uid = obj.hasOwnProperty('uid') ? parseInt(obj.uid) : 0
    if (this.uid && this.uid > 0) {
      this.initWebSocket()
      this.queryChatMessages()
    } else {
      console.log('url error')
    }
  },
  updated: function () {
    document.documentElement.scrollTop = document.body.scrollTop = this.osTop + 10000
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
      // const wsuri = 'ws://40.83.96.124/wsapp' // ws地址 uu
      // const wsuri = 'ws://23.100.95.151/wsapp' // ws地址 test
      const wsuri = 'ws://192.168.10.10:2346' // ws地址
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
        axios.post('/api/send', { msg: item, player_id: this.uid }).then((response) => {
          if (response.data && response.data.data) {
            this.chatMessages.push(response.data.data)
          }
        }).catch((err) => {
          console.log(err, 'error')
        })
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
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 1rem;
  background: #373940;
  color: #fff;
  font-size: 0.34rem;
  align-items: center;
  z-index: 1000;
}

.return-icon {
  flex: 0 0 1rem;
  border-right: 1px solid #282a31;
  text-align: center;
  box-sizing: border-box;
}

.person-name {
  flex: 1;
  padding-left: 0.2rem;
}

.person-icon {
  flex: 0 0 1rem;
  text-align: center;
}

.app-send {
  position: fixed;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background: #000;
  align-items: center;
}

.send-icon {
  flex: 0 0 1rem;
  text-align: center;
}

.send-content {
  flex: 1;
  height: 0.72rem;
}
.send-content textarea {
  width: 100%;
  height: 0.72rem;
  font-size: 0.4rem;
  border: none;
  outline: none;
  border-radius: 3px;
  padding-left: 0.1rem;
  padding-top: 0.12rem;
}
.app-conetnt {
  margin: 1.1rem 0;
}

.app-conetnt .chat-item {
  margin-bottom: 0.2rem;
}

.chat-item .head-img {
  display: block;
  border-radius: 50%;
  width: 0.72rem;
  height: 0.72rem;
  float: left;
  margin: 0 0.1rem;
}

.chat-item .chat-msg {
  position: relative;
  float: left;
  background: #fffeff;
  max-width: 64%;
  line-height: 0.48rem;
  font-size: 0.32rem;
  padding: 0.1rem;
  border-radius: 5px;
  word-break: break-all;
}

.chat-item .chat-msg:before {
  content: ' ';
  position: absolute;
  border: 0.2rem solid transparent;
  border-top-color: #fffeff;
  top: 0rem;
  left: -0.1rem;
}

.app-conetnt .chat-item-me {
  margin-bottom: 0.2rem;
}

.chat-item-me .head-img {
  display: block;
  border-radius: 50%;
  width: 0.72rem;
  height: 0.72rem;
  float: right;
  margin: 0 0.1rem;
}

.chat-item-me .chat-msg {
  position: relative;
  float: right;
  background: #b0e56d;
  max-width: 64%;
  line-height: 0.48rem;
  font-size: 0.32rem;
  padding: 0.1rem;
  border-radius: 5px;
  word-break: break-all;
}
.chat-item-me .chat-msg:before {
  content: ' ';
  position: absolute;
  border: 0.2rem solid transparent;
  border-top-color: #b0e56d;
  top: 0rem;
  right: -0.1rem;
}
</style>
