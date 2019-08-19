<template>
  <div class="login-container">
    <vue-canvas-nest :config="config"></vue-canvas-nest>
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
            <!-- <FormItem prop="code">
              <Input type="text" v-model="formInline.code" placeholder="请输入验证码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              <span class="show-pwd" slot="append" @click="getIdentifyCode"> {{gettingIdentifyCodeBtnContent}}</span>
              </Input>
            </FormItem> -->
            <FormItem prop="code">
              <Input type="text" v-model="formInline.code" placeholder="请输入右侧验证码" @keyup.enter.native="handleSubmit('formInline')">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              <img class="show-captcha" slot="append" :src="imagesrc" @click="changeSrc">
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formInline')" long :loading="loading">登 录</Button>
            </FormItem>
          </Form>
        </Card>

      </div>
    </div>
  </div>
</template>

<script>
import vueCanvasNest from '@/components/VueCanvasNest'
import { mapGetters } from 'vuex'
import * as UUID from 'uuidjs'
export default {
  name: 'Login',
  components: { vueCanvasNest },
  data () {
    return {
      config: { color: '255,255,255', opacity: '1', count: 240 },
      loading: false,
      imagesrc: '',
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
        ],
        code: [
          {
            required: true,
            message: '请输入验证码！',
            trigger: 'blur'
          }
        ]
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
    this.imagesrc = '/api/captcha/' + this.uuid
  },
  methods: {
    changeSrc () {
      this.uuid = UUID.generate()
      this.imagesrc = '/api/captcha/' + this.uuid
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
            await this.$store.dispatch('login', { username: this.formInline.username, password: this.formInline.password, uuid: this.uuid, code: this.formInline.code })
            await this.$store.dispatch('getUserMenu')
            this.$router.push({ name: 'welcome' })
          } catch (error) {
            this.loading = false
            const response = error.response ? error.response : ''
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
