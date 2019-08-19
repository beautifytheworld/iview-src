<template>
  <div class="login-box">
    <van-cell-group>
      <van-field
        v-model="formInline.username"
        required
        clearable
        label="用户名"
        label-align="left"
        placeholder="请输入游戏绑定的手机号"
      />

      <van-field
        label-align="left"
        v-model="formInline.password"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
      />
      <van-field
        v-model="formInline.code"
        required
        center
        clearable
        label="验证码"
        placeholder="请输入右侧图片验证码"
      >
        <img
          class="show-captcha"
          slot="button"
          :src="imagesrc"
          @click="changeSrc"
        />
      </van-field>
    </van-cell-group>
    <van-button block type="primary" @click="submit">登录</van-button>
  </div>
</template>
<script>
import * as UUID from "uuidjs";
import { setToken, setKey } from "@/libs/util";

export default {
  data() {
    return {
      imagesrc: "",
      uuid: "",
      formInline: {
        username: "",
        password: "",
        code: ""
      },
      canGetIdentifyCode: true,
      gettingIdentifyCodeBtnContent: "获取验证码"
    };
  },
  mounted() {
    this.uuid = UUID.generate();
    this.imagesrc = "/api/captcha/" + this.uuid;
  },
  methods: {
    changeSrc() {
      this.uuid = UUID.generate();
      this.imagesrc = "/api/captcha/" + this.uuid;
    },
    getIdentifyCode() {
      //   this.$refs.formInline.validate(valid => {
      // if (valid) {
      if (this.canGetIdentifyCode) {
        this.canGetIdentifyCode = false;
        let timeLast = 20;
        const timer = setInterval(() => {
          if (timeLast >= 0) {
            this.gettingIdentifyCodeBtnContent = timeLast + "秒后重试";
            timeLast -= 1;
          } else {
            clearInterval(timer);
            this.gettingIdentifyCodeBtnContent = "获取验证码";
            this.canGetIdentifyCode = true;
          }
        }, 1000);

        // you can write ajax request here
      }
      // }
      //   })
    },
    submit() {
      this.$store
        .dispatch("login", {
          username: this.formInline.username,
          password: this.formInline.password,
          uuid: this.uuid,
          code: this.formInline.code
        })
        .then(res => {
          if (res && res.data) {
            const result = res.data;
            if (result.qrCode) {
              this.svgStr = result.qrCode;
              this.qrcodeModal = true;
            } else if (result.szToken) {
              setToken(result.szToken);
              setKey("user_name", result.szUser);
              setKey("bankMoney", result.bankMoney);
              setKey("fCurMoney", result.fCurMoney);
              setKey("nLv", result.nLv);
              setKey("nPercent", result.nPercent);
              setKey("szAliPay", result.szAliPay);
              setKey("szRealName", result.szRealName);
              setKey("szNickName", result.szNickName);
              setKey("szBindID", result.szBindID);
              this.$router.push({ name: "home" });
            } else {
              this.$toast.fail("账号或密码有误!");
            }
          }
        })
        .catch(error => {
          const response = error.response;
          let msg =
            response.data && response.data.message ? response.data.message : "";
          if (response) {
            this.$toast.fail(msg);
            if (msg === "验证码已过期！") {
              setTimeout(() => {
                this.changeSrc();
              }, 1000);
            }
          }
        });
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        username: "",
        password: "",
        isAgree: false
      };
    }
  }
};
</script>
<style lang="less" scoped>
// .login-box {
//   margin-top: 10%;
//   .login-title {
//     text-align: center;
//     font-size: 0.48rem;
//   }
// }
</style>
