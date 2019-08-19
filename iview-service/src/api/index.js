import http from './../utils/http'
export default {
  // 后台登录
  loginByUsername (data) {
    return http({
      url: '/api/kf_login',
      method: 'post',
      data
    })
  },
  //   运营首页数据接口
  getOperateHome (params) {
    return http({
      url: '/api/operate/home',
      method: 'get',
      params
    })
  },
  //   用户查询
  getUserList (params) {
    return http({
      url: '/api/operate/users',
      method: 'get',
      params
    })
  },
  //   金币日志
  getGoldLogs (params) {
    return http({
      url: '/api/operate/gold_logs',
      method: 'get',
      params
    })
  },
  //   游戏日志
  getGameLogs (params) {
    return http({
      url: '/api/operate/game_logs',
      method: 'get',
      params
    })
  },
  //   金币调整记录
  getGoldAdjustment (params) {
    return http({
      url: '/api/operate/gold_adjustment',
      method: 'get',
      params
    })
  },
  //   账号封禁记录
  getAccountBlocking (params) {
    return http({
      url: '/api/operate/account_blocking',
      method: 'get',
      params
    })
  },
  //   游戏公告
  getGameMessage (params) {
    return http({
      url: '/api/operate/game_message',
      method: 'get',
      params
    })
  },
  //   游戏税收
  getGameTax (params) {
    return http({
      url: '/api/operate/game_tax',
      method: 'get',
      params
    })
  },
  //   在线用户
  getUsersOnline (params) {
    return http({
      url: '/api/operate/users_online',
      method: 'get',
      params
    })
  },
  // 举报记录
  getReportLogs (params) {
    return http({
      url: '/api/operate/report_logs',
      method: 'get',
      params
    })
  },
  //   提现订单
  getExchangeOrders (params) {
    return http({
      url: '/api/operate/exchange_orders',
      method: 'get',
      params
    })
  },
  //   提现设置
  getExchangeSetting (params) {
    return http({
      url: '/api/operate/exchange_setting',
      method: 'get',
      params
    })
  },
  //   客服反馈列表
  getServiceList (params) {
    return http({
      url: '/api/operate/service_list',
      method: 'get',
      params
    })
  },
  // 客服反馈
  updateServiceList (data) {
    return http({
      url: '/api/operate/service_list',
      method: 'put',
      data
    })
  },
  // 修改游戏公告
  updateGameMessage (data) {
    return http({
      url: '/api/operate/game_message',
      method: 'put',
      data
    })
  },
  //   注册赠送配置
  getRegisterSetting (params) {
    return http({
      url: '/api/operate/register_setting',
      method: 'get',
      params
    })
  },
  //   举报有奖配置
  getReportSetting (params) {
    return http({
      url: '/api/operate/report_setting',
      method: 'get',
      params
    })
  },
  //   后台登录日志
  getLoginLogs (params) {
    return http({
      url: '/api/operate/login_logs',
      method: 'get',
      params
    })
  },
  //   后台操作日志
  getOperateLogs (params) {
    return http({
      url: '/api/operate/operate_logs',
      method: 'get',
      params
    })
  },
  //   充值订单
  getChargeOrders (params) {
    return http({
      url: '/api/operate/charge_orders',
      method: 'get',
      params
    })
  },
  //   玩家提现配置
  updateExchangeSetting (data) {
    return http({
      url: '/api/operate/exchange_setting',
      method: 'put',
      data
    })
  },
  //   注册赠送修改
  updateRegistSetting (data) {
    return http({
      url: '/api/operate/register_setting',
      method: 'put',
      data
    })
  },
  //   举报有奖修改
  updateReportSetting (data) {
    return http({
      url: '/api/operate/report_setting',
      method: 'put',
      data
    })
  },
  //   游戏房间设置
  getGameRoomSetting (params) {
    return http({
      url: '/api/operate/game_room_setting',
      method: 'get',
      params
    })
  },
  //   修改游戏房间设置
  updateGameRoomSetting (data) {
    return http({
      url: '/api/operate/game_room_setting',
      method: 'put',
      data
    })
  },
  //   修改携带游戏币
  updateGold (data) {
    return http({
      url: '/api/operate/gold',
      method: 'put',
      data
    })
  },
  //   修改银行余额
  updateBankGold (data) {
    return http({
      url: '/api/operate/bank_gold',
      method: 'put',
      data
    })
  },
  //   修改账号信息
  updateAccount (data) {
    return http({
      url: '/api/operate/account',
      method: 'put',
      data
    })
  },
  //   新增滚动公告
  insertMessage (data) {
    return http({
      url: '/api/operate/message',
      method: 'post',
      data
    })
  },
  //   新增系统公告
  insertSysMessage (data) {
    return http({
      url: '/api/operate/sys_message',
      method: 'post',
      data
    })
  },
  //   删除公告
  deleteMessage (data) {
    return http({
      url: '/api/operate/message',
      method: 'delete',
      data
    })
  },
  //   查询月入百万配置
  getYRBWSetting (params) {
    return http({
      url: '/api/operate/yrbw_setting',
      method: 'get',
      params
    })
  },
  //   修改月入百万配置
  updateYRBWSetting (data) {
    return http({
      url: '/api/operate/yrbw_setting',
      method: 'put',
      data
    })
  },
  //  增加月入百万配置
  insertYRBWSettingRespond (data) {
    return http({
      url: '/api/operate/yrbw_setting_respond',
      method: 'post',
      data
    })
  },
  //  删除月入百万配置
  deleteYRBWSettingRespond (data) {
    return http({
      url: '/api/operate/yrbw_setting_respond',
      method: 'delete',
      data
    })
  },
  //   获取后台账号列表
  getGMAccountList (params) {
    return http({
      url: '/api/operate/gm_account_list',
      method: 'get',
      params
    })
  },
  //   增加后台账号
  insertGMAccount (data) {
    return http({
      url: '/api/operate/gm_account',
      method: 'post',
      data
    })
  },
  //   修改后台账号
  updateGMAccount (data) {
    return http({
      url: '/api/operate/gm_account',
      method: 'put',
      data
    })
  },
  //   删除后台账号
  deleteGMAccount (data) {
    return http({
      url: '/api/operate/gm_account',
      method: 'delete',
      data
    })
  },
  //   玩家提现审核
  updateExchange (data) {
    return http({
      url: '/api/operate/exchange',
      method: 'put',
      data
    })
  },
  //   充值配置
  getExchangeChannel (params) {
    return http({
      url: '/api/operate/exchange_channel',
      method: 'get',
      params
    })
  },
  //   充值配置修改
  updateExchangeChannel (data) {
    return http({
      url: '/api/operate/exchange_channel',
      method: 'put',
      data
    })
  },
  //   提现配置
  getRechargeChannel (params) {
    return http({
      url: '/api/operate/recharge_channel',
      method: 'get',
      params
    })
  },
  //   提现配置修改
  updateRechargeChannel (data) {
    return http({
      url: '/api/operate/recharge_channel',
      method: 'put',
      data
    })
  },

  //   代理登录接口
  agentLogin (data) {
    return http({
      url: '/api/ag_login',
      method: 'post',
      data
    })
  },
  //   代理推广首页
  getPromoStatics (params) {
    return http({
      url: '/api/agent/promo_statics',
      method: 'get',
      params
    })
  },
  //   代理管理
  getAgentList (params) {
    return http({
      url: '/api/agent/agent_list',
      method: 'get',
      params
    })
  },
  //   代理推广统计
  getPromoList (params) {
    return http({
      url: '/api/agent/promo_list',
      method: 'get',
      params
    })
  },
  //   代理提现订单
  getSettleRecord (params) {
    return http({
      url: '/api/agent/settle_record',
      method: 'get',
      params
    })
  },
  //   代理推广二维码
  getPromoUrl (params) {
    return http({
      url: '/api/agent/promo_url',
      method: 'get',
      params
    })
  },
  //   代理推广余额
  getAccount (params) {
    return http({
      url: '/api/agent/account',
      method: 'get',
      params
    })
  },
  //   代理转账记录
  getTransferRecord (params) {
    return http({
      url: '/api/agent/transfer_record',
      method: 'get',
      params
    })
  },
  //   代理商人展示信息
  getMerchantSetting (params) {
    return http({
      url: '/api/agent/merchant_setting',
      method: 'get',
      params
    })
  },
  //   代理系统公告
  getAgentMessage (params) {
    return http({
      url: '/api/agent/agent_message',
      method: 'get',
      params
    })
  },
  //   代理上分记录
  getBuyRecord (params) {
    return http({
      url: '/api/agent/buy_record',
      method: 'get',
      params
    })
  },
  //   代理收入统计
  getIncomeList (params) {
    return http({
      url: '/api/agent/income_list',
      method: 'get',
      params
    })
  },
  //   代理收入明细
  getIncomeDetailList (params) {
    return http({
      url: '/api/agent/income_detail_list',
      method: 'get',
      params
    })
  },
  //   代理转账
  insertTransfer (data) {
    return http({
      url: '/api/agent/transfer',
      method: 'post',
      data
    })
  },
  //   代理提现审核
  updateSettlement (data) {
    return http({
      url: '/api/agent/settlement',
      method: 'put',
      data
    })
  },
  // 代理申请提现
  insertSettlement (data) {
    return http({
      url: '/api/agent/settlement',
      method: 'post',
      data
    })
  },
  // 代理增加商人展示
  insertMerchantSetting (data) {
    return http({
      url: '/api/agent/merchant_setting',
      method: 'post',
      data
    })
  },
  // 代理修改商人展示
  updateMerchantSetting (data) {
    return http({
      url: '/api/agent/merchant_setting',
      method: 'put',
      data
    })
  },
  // 代理删除商人展示
  deleteMerchantSetting (data) {
    return http({
      url: '/api/agent/merchant_setting',
      method: 'delete',
      data
    })
  },
  // 增加代理公告
  insertAgentMessage (data) {
    return http({
      url: '/api/agent/agent_message',
      method: 'post',
      data
    })
  },
  // 修改代理公告
  updateAgentMessage (data) {
    return http({
      url: '/api/agent/agent_message',
      method: 'put',
      data
    })
  },
  // 删除代理公告
  deleteAgentMessage (data) {
    return http({
      url: '/api/agent/agent_message',
      method: 'delete',
      data
    })
  },
  // 增加代理公告
  insertAgentAccount (data) {
    return http({
      url: '/api/agent/agent_account',
      method: 'post',
      data
    })
  },
  // 修改代理账号
  updateAgentAccount (data) {
    return http({
      url: '/api/agent/agent_account',
      method: 'put',
      data
    })
  },
  // 结算账户 结算密码 修改
  updateAgentAccountSettle (data) {
    return http({
      url: '/api/agent/agent_account_settle',
      method: 'put',
      data
    })
  },
  // 删除代理账号
  deleteAgentAccount (data) {
    return http({
      url: '/api/agent/agent_account',
      method: 'delete',
      data
    })
  },
  //   金额配置查询
  getRechargeSetting (params) {
    return http({
      url: '/api/operate/recharge_setting',
      method: 'get',
      params
    })
  },
  // 修改金额配置
  updateRechargeSetting (data) {
    return http({
      url: '/api/operate/recharge_setting',
      method: 'put',
      data
    })
  },
  //   统计
  getPotatoRobotStatics (params) {
    return http({
      url: '/api/operate/potato_robot_statics',
      method: 'get',
      params
    })
  },
  //   用户输赢
  getUserWinTotalg (params) {
    return http({
      url: '/api/operate/user_win_total',
      method: 'get',
      params
    })
  },
  //   用户充值
  getUserChargeTotal (params) {
    return http({
      url: '/api/operate/user_charge_total',
      method: 'get',
      params
    })
  },
  //   税收统计
  getTaxStatics (params) {
    return http({
      url: '/api/operate/tax_statics',
      method: 'get',
      params
    })
  },
  //   在线统计
  getOnlineStatics (params) {
    return http({
      url: '/api/operate/ol_statics',
      method: 'get',
      params
    })
  },
  // 提现统计
  getWithdrawStatics (params) {
    return http({
      url: '/api/operate/withdraw_statics',
      method: 'get',
      params
    })
  },
  // 充值统计
  getChargeStatics (params) {
    return http({
      url: '/api/operate/charge_statics',
      method: 'get',
      params
    })
  }
}
