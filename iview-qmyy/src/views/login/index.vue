<template>
  <div class="login-container">
    <!-- <vue-canvas-nest :config="config"></vue-canvas-nest> -->
    <div class="login-container-left">
    </div>
    <div class="login-container-right">
      <div class="login-form">

        <Card :bordered="false">
          <p slot="title">
            <Icon type="log-in"></Icon> 欢迎登陆</p>
          <Form ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="username">
              <Input type="text" v-model="formInline.username" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="请输入密码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>

              <FormItem prop="oneCode">
              <Input type="text" v-model="formInline.oneCode" placeholder=" 未绑定可不填！" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <span style="color:#2d8cf0;">G</span><span style="color:#ed3f14;">o</span><span style="color:#ff9900;">o</span><span style="color:#2d8cf0;">g</span><span style="color:#19be6b;">l</span><span style="color:#ed3f14;">e</span>
                身份验证码
                <!-- <Icon :size="14" type="social-googleplus"></Icon> -->
              </span>
              <!-- <img class="show-captcha" slot="append" :src="imagesrc" @click="changeSrc"> -->
              </Input>
            </FormItem>
            <!-- <FormItem prop="code">
              <Input type="text" v-model="formInline.code" placeholder="请输入验证码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              <span class="show-pwd" slot="append" @click="getIdentifyCode"> {{gettingIdentifyCodeBtnContent}}</span>
              </Input>
            </FormItem> -->
            <!-- <FormItem prop="code">
              <Input type="text" v-model="formInline.code" placeholder="请输入右侧验证码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              <img class="show-captcha" slot="append" :src="imagesrc" @click="changeSrc">
              </Input>
            </FormItem> -->
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" long :loading="loading">登 录</Button>
            </FormItem>
          </Form>
        </Card>

      </div>
    </div>

      <Modal v-model="qrcodeModal" width="360">
        <p slot="header" style="color:#ed3f14;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>请打开Google身份验证器扫描二维码</span>
        </p>
        <div style="text-align:center" v-html="svgStr">

        </div>
        <div slot="footer">

              <Input type="text" v-model="oneCode" placeholder="请输入Google身份验证码后 点击确认绑定" @keyup.enter.native="toBind()" autofocus clearable>
              <span slot="prepend">
                <Icon :size="14" type="pinpoint"></Icon>
              </span>
              <!-- <img class="show-captcha" slot="append" :src="imagesrc" @click="changeSrc"> -->
              </Input>
<br>
            <Button type="error" size="large" long :loading="bind_loading" @click="toBind">确认绑定</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import vueCanvasNest from '@/components/VueCanvasNest'
import { mapGetters } from 'vuex'
import { setToken, setKey } from '@/utils/auth'
import * as UUID from 'uuidjs'
export default {
  name: 'Login',
  components: { vueCanvasNest },
  data () {
    return {
      qrcodeModal: false,
      config: { color: '255,255,255', opacity: '1', count: 240 },
      loading: false,
      bind_loading: false,
      oneCode: '',
      imagesrc: '',
      svgStr: '',
      uuid: '',
      formInline: {
        username: '',
        password: '',
        code: ''
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: '请输入用户名！',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码！',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 5,
            message: '密码长度不能小于5位！',
            trigger: 'blur'
          }
        ]
        // code: [
        //   {
        //     required: true,
        //     message: '请输入验证码！',
        //     trigger: 'blur'
        //   }
        // ]
      },
      canGetIdentifyCode: true,
      gettingIdentifyCodeBtnContent: '获取验证码'
    }
  },
  computed: {
    ...mapGetters([
      'firstPage'
    ])
  },
  mounted () {
    this.uuid = UUID.generate()
    // this.imagesrc = '/api/captcha/' + this.uuid
  },
  methods: {
    changeSrc () {
      this.uuid = UUID.generate()
      // this.imagesrc = '/api/captcha/' + this.uuid
    },
    getIdentifyCode () {
      //   this.$refs.formInline.validate(valid => {
      // if (valid) {
      if (this.canGetIdentifyCode) {
        this.canGetIdentifyCode = false
        let timeLast = 20
        const timer = setInterval(() => {
          if (timeLast >= 0) {
            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试'
            timeLast -= 1
          } else {
            clearInterval(timer)
            this.gettingIdentifyCodeBtnContent = '获取验证码'
            this.canGetIdentifyCode = true
          }
        }, 1000)

        // you can write ajax request here
      }
      // }
      //   })
    },
    handleSubmit (name) {
      this.$refs[name].validate(async valid => {
        this.loading = true
        if (valid) {
          try {
            const res = await this.$store.dispatch('login', { username: this.formInline.username, password: this.formInline.password, oneCode: this.formInline.oneCode, uuid: this.uuid })
            if (res && res.data) {
              const result = res.data
              if (result.qrCode) {
                this.svgStr = result.qrCode
                this.qrcodeModal = true
              } else if (result.szToken) {
                setToken(result.szToken)
                this.$store.commit('SET_NAME', result.szUser)
                setKey('user_name', result.szUser)
                setKey('bankMoney', result.bankMoney)
                setKey('fCurMoney', result.fCurMoney)
                setKey('nLv', result.nLv)
                setKey('nPercent', result.nPercent)
                setKey('szAliPay', result.szAliPay)
                setKey('szRealName', result.szRealName)
                setKey('szNickName', result.szNickName)
                setKey('szBindID', result.szBindID)
                this.$store.commit('SET_HASMENUS', result.menus)
                this.$store.commit('SET_FIRSTPAGE', result.firstPage)
                setKey('hasMenus', JSON.stringify(result.menus))
                await this.$store.dispatch('getUserMenu')
                this.$router.push({ name: 'welcome' })
              } else {
                this.$Message.error({
                  content: '账号或密码有误！',
                  duration: 5
                })
              }
            }
          } catch (error) {
            const response = error.response
            let msg = (response.data && response.data.message) ? response.data.message : ''
            if (response) {
              this.$Message.error({
                content: msg,
                duration: 5
              })
              if (msg === '验证码已过期！') {
                setTimeout(() => {
                  this.changeSrc()
                }, 1200)
              }
            }
          }
        } else {
          this.$Message.error('请填写账号密码!')
        }
        this.loading = false
      })
    },
    async toBind () {
      try {
        this.bind_loading = true
        if (this.oneCode) {
          const res = await this.$store.dispatch('login', { username: this.formInline.username, password: this.formInline.password, uuid: this.uuid, oneCode: this.oneCode, bind: 1 })
          if (res && res.data) {
            const result = res.data
            if (result.msg) {
              this.$Message.success({
                content: result.msg,
                duration: 3
              })
              this.svgStr = ''
              this.qrcodeModal = false
              this.formInline.oneCode = ''
            }
          }
          this.oneCode = ''
        } else {
          this.$Message.error('请输入google验证码！')
        }
      } catch (error) {
        const response = error.response
        let msg = (response.data && response.data.message) ? response.data.message : ''
        this.$Message.error({
          content: msg,
          duration: 4
        })
      }
      this.bind_loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;
  //   background: #2d3a4b;
  //   background-color:rgba(0,152,50,0.7);// -->70%的不透明度
  background-image: url('bg0.jpg');
  //   background-image: url("https://file.iviewui.com/iview-admin/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  .login-container-left {
    flex: 1;
  }
  .login-container-right {
    flex: 0 0 360px;
    .login-form {
      margin: 200px 20px 20px 20px;
      // padding: 20px;
      background: #fff;
      width: 300px;
      // height: 300px;
      border-radius: 5px;
    }
  }
}
.show-pwd {
  cursor: pointer;
}
.show-captcha {
  cursor: pointer;
  margin-top: -5px;
  margin-bottom: -8px;
  margin-left: -7px;
  margin-right: -7px;
}
</style>
