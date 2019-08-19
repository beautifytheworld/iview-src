import api from "@/api";

import { setToken, getToken } from "@/libs/util";

export default {
  state: {
    userName: "",
    userId: "",
    avatorImgPath: "",
    token: getToken()
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    }
  },
  getters: {},
  actions: {
    // 登录
    login: ({ commit, state }, data) => {
      return api.login(data);
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        api
          .logout()
          .then(() => {
            commit("setToken", "");
            commit("setAccess", []);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      });
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          api
            .getUserInfo()
            .then(res => {
              const data = res.data;
              commit("setUserName", data.name);
              commit("setUserId", data.id);
              commit("setHasGetInfo", true);
              resolve(data);
            })
            .catch(err => {
              reject(err);
            });
        } catch (error) {
          reject(error);
        }
      });
    }
  }
};
