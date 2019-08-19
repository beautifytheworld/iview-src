import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
import { setToken, getToken, canTurnTo } from "@/libs/util";

Vue.use(Router);
const router = new Router({
  routes
  // mode: 'history'
});
// const LOGIN_PAGE_NAME = "login";
let whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  if (getToken()) {
    // 存在token
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      next();
      // if (store.getters.menuList.length === 0) {
      //   // 判断当前用户是否已拥有菜单
      //   store
      //     .dispatch("getUserMenu")
      //     .then(data => {
      //       // 拉取用户菜单
      //       next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      //     })
      //     .catch(() => {
      //       // 拉取用户信息失败，提示登录状态失效
      //       store.dispatch("fedLogOut").then(() => {
      //         next({ path: "/login" });
      //       });
      //     });
      // } else {
      //   next();
      // }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next("/login"); // 否则全部重定向到登录页
    }
  }
});

router.afterEach(to => {
  window.scrollTo(0, 0);
});

export default router;
