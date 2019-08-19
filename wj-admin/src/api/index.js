import http from "./../libs/http";
export default {
  // 后台登录
  login(data) {
    return http({
      url: "/api/wj_login",
      method: "post",
      data
    });
  },
  logout(data) {
    return http({
      url: "/api/auth/logout",
      method: "delete",
      data
    });
  },
  //请求玩家列表
  getWJUserList(params) {
    return http({
      url: "/api/agent/wj_user_list",
      method: "get",
      params
    });
  },
  // 获取推广统计
  getWjPromoList(params) {
    return http({
      url: "/api/agent/wj_promo_list",
      method: "get",
      params
    });
  },
  // 返回推广链接
  getWJPromoURL(params) {
    return http({
      url: "/api/agent/wj_promo_url",
      method: "get",
      params
    });
  },
  // 收入明细
  getWJIncomeDetail(params) {
    return http({
      url: "/api/agent/wj_income_detail",
      method: "get",
      params
    });
  },
  // 领取收益
  getUserAgencyAward(params) {
    return http({
      url: "/api/agent/user_agency_award",
      method: "get",
      params
    });
  }
};
