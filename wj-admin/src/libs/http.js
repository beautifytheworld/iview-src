import axios from "axios";
// import store from '@/store'
import { getToken, clearAllCache } from "@/libs/util";
// import { Message } from "iview";
import { Toast } from "vant";
// import { Spin } from 'iview'

/**
 * http请求工具类
 * 请求拦截器 负责将客户端标识token值存储并放置在头部提交给服务端
 *
 * 响应拦截器 负责全局处理业务请求的网络或者业务错误
 */

// 创建一个axios实例
const http = axios.create({
  // baseURL: process.env.BASE_API, // 基础URL
  timeout: 25000 // 超时时间
});

const loginUrls = ["/api/login", "/api/kf_login"];

// 请求拦截
http.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config;
  },
  err => {
    console.log(err);
    Promise.reject(err);
  }
);

// 响应拦截
http.interceptors.response.use(
  response => {
    /**
     * 通过response自定义errCode来标示请求状态
     */
    const status = response.status;
    if (status === 200 || status === 201 || status === 204) {
      let res = response.data;

      if (
        (res.data &&
          res.data.arrTitles &&
          res.data.arrTitles.arrString &&
          res.data.arrTitles.arrString.length &&
          res.data.arrTitles.arrString[0].startsWith("登录超时")) ||
        (res.data &&
          res.data.szresult &&
          res.data.szresult.startsWith("登录超时"))
      ) {
        Toast.loading({
          duration: 2000, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          // loadingType: "spinner",
          message: "登录超时,请重新登录!"
        });
        clearAllCache();
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
      return response.data;
    } else {
      return Promise.reject(new Error("error"));
    }
  },
  err => {
    console.log(JSON.stringify(err));
    let msg = "";
    if (err.code && err.code === "ECONNABORTED") {
      msg = "请求超时!";
      // Message.error({
      //   content: msg,
      //   duration: 5
      // });
    }
    if (err.config && loginUrls.includes(err.config.url)) {
      return Promise.reject(err);
    } else {
      const response = err.response;

      if (response && response.status) {
        msg =
          response.data && response.data.message ? response.data.message : "";
        if (response.status === 400) {
          msg = msg || "Bad Request!";
        } else if (response.status === 401) {
          msg = msg || "Unauthorized!";
        } else if (response.status === 403) {
          msg = msg || "Forbidden!";
        } else if (response.status === 404) {
          msg = msg || "Not Found !";
        } else if (response.status === 405) {
          msg = msg || "Method Not Allowed!";
        } else if (response.status === 500) {
          msg = "系统繁忙,稍后再试!";
        } else {
          msg = "系统繁忙,稍后再试!";
        }

        Toast.fail(msg);
      }
      return Promise.reject(err);
    }
  }
);

export default http;
