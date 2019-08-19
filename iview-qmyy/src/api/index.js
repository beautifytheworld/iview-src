import http from './../utils/http'
export default {
  // 后台登录
  loginByUsername (data) {
    return http({
      url: '/api/login',
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
  //   银行金币调整记录
  getGoldAdjustment (params) {
    return http({
      url: '/api/operate/gold_adjustment',
      method: 'get',
      params
    })
  },
  //   金币调整记录
  getBankGoldAdjustment (params) {
    return http({
      url: '/api/operate/bank_gold_adjustment',
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
  // 封锁账号
  updateAccountSatte (data) {
    return http({
      url: '/api/operate/account_state',
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
  },
  // 游戏房间开服 停服
  updateGameRoomStatus (data) {
    return http({
      url: '/api/operate/game_room_status',
      method: 'put',
      data
    })
  },
  // 查询机器人配置
  getRobotSetting (params) {
    return http({
      url: '/api/operate/robot_setting',
      method: 'get',
      params
    })
  },
  // 修改机器人配置
  updateRobotSetting (data) {
    return http({
      url: '/api/operate/robot_setting',
      method: 'put',
      data
    })
  },
  // api调用日志列表
  getApiLogList (params) {
    return http({
      url: '/api/agent/api_log_list',
      method: 'get',
      params
    })
  },
  // 发送api请求
  toSendRequest (data) {
    return http({
      url: '/api/admin/request_url',
      method: 'post',
      data
    })
  },
  // GM增加道具接口
  updateMyItem (data) {
    return http({
      url: '/api/agent/ag_my_item',
      method: 'put',
      data
    })
  },

  // 用户道具修改日志
  getItemRecordList (params) {
    return http({
      url: '/api/agent/ag_item_record_list',
      method: 'get',
      params
    })
  },
  // 用户道具查询
  getAGGetMyItem (params) {
    return http({
      url: '/api/agent/ag_my_item',
      method: 'get',
      params
    })
  },
  // 商城列表
  getAGGetShopList (params) {
    return http({
      url: '/api/agent/ag_shop_list',
      method: 'get',
      params
    })
  },

  // 商城修改
  updateAGShopList (data) {
    return http({
      url: '/api/agent/ag_shop_list',
      method: 'put',
      data
    })
  },
  // 商城删除
  deleteAGShopList (data) {
    return http({
      url: '/api/agent/ag_shop_list',
      method: 'delete',
      data
    })
  },
  // 修改风控配置
  updateRiskManagements (data) {
    return http({
      url: '/api/admin/risks',
      method: 'put',
      data
    })
  },
  getRiskManagements (params) {
    return http({
      url: '/api/admin/risks',
      method: 'get',
      params
    })
  },
  // 修改风控记录状态已读
  updateRiskRecords (data) {
    return http({
      url: '/api/admin/risk_record',
      method: 'put',
      data
    })
  },
  // 修改全部未读风控记录状态已读
  updateNoReadRiskRecords (data) {
    return http({
      url: '/api/admin/risk_records',
      method: 'put',
      data
    })
  },
  // 查询风控记录
  getRiskRecords (params) {
    return http({
      url: '/api/admin/risk_record',
      method: 'get',
      params
    })
  },
  // 查询风控记录未查看数
  getRiskRecordNoCounts (params) {
    return http({
      url: '/api/admin/risk_record_no',
      method: 'get',
      params
    })
  },
  resetGoogleCode (data) {
    return http({
      url: '/api/admin/reset_google',
      method: 'delete',
      data
    })
  },
  // 获取玩家与客服的的聊天记录
  getChatMessages (params) {
    return http({
      url: '/api/chat_messages',
      method: 'get',
      params
    })
  },

  // 玩家聊天统计
  getPlayerSummary (params) {
    return http({
      url: '/api/player_summary',
      method: 'get',
      params
    })
  },
  // 请求玩家列表
  getWJUserList (params) {
    return http({
      url: '/api/agent/wj_user_list',
      method: 'get',
      params
    })
  },
  // 获取全民推广
  getWjPromoList (params) {
    return http({
      url: '/api/agent/wj_promo_list',
      method: 'get',
      params
    })
  },
  // 获取推广设置
  getPromoSetting (params) {
    return http({
      url: '/api/agent/ag_promo_setting',
      method: 'get',
      params
    })
  },
  // 更新推广设置
  updatePromoSetting (data) {
    return http({
      url: '/api/agent/ag_promo_setting',
      method: 'put',
      data
    })
  },
  // 游戏输赢统计
  getGameWinTotal (params) {
    return http({
      url: '/api/agent/ag_get_game_win_total',
      method: 'get',
      params
    })
  },
  // 获取奖励配置
  getAwardSetting (params) {
    return http({
      url: '/api/agent/ag_award_setting',
      method: 'get',
      params
    })
  },
  // 更新奖励配置
  updateAwardSetting (data) {
    return http({
      url: '/api/agent/ag_award_setting',
      method: 'put',
      data
    })
  },
  // 玩家曲线
  getAGGoldDetail (params) {
    return http({
      url: '/api/agent/ag_gold_detail',
      method: 'get',
      params
    })
  },
  // 游戏币来源
  getAGGoldSource (params) {
    return http({
      url: '/api/agent/ag_gold_source',
      method: 'get',
      params
    })
  },
  // 获取红包配置
  getRedPacketSetting (params) {
    return http({
      url: '/api/agent/ag_red_packet_setting',
      method: 'get',
      params
    })
  },
  // 更新红包配置
  updateRedPacketSetting (data) {
    return http({
      url: '/api/agent/ag_red_packet_setting',
      method: 'put',
      data
    })
  },
  // 获取排行奖励
  getRankListSetting (params) {
    return http({
      url: '/api/agent/ag_ranklist_setting',
      method: 'get',
      params
    })
  },
  // 更新排行奖励
  updateRankListSetting (data) {
    return http({
      url: '/api/agent/ag_ranklist_setting',
      method: 'put',
      data
    })
  },
  // 发红包
  insertRedPacket (data) {
    return http({
      url: '/api/agent/ag_red_packet',
      method: 'post',
      data
    })
  },
  // 发用户邮件
  insertUserMessage (data) {
    return http({
      url: '/api/agent/ag_user_message',
      method: 'post',
      data
    })
  },
  // 查询红包领取情况
  getRedPacketList (params) {
    return http({
      url: '/api/agent/ag_red_packet_list',
      method: 'get',
      params
    })
  },
  // 查询系统红包领取情况
  getRedSysPacket (params) {
    return http({
      url: '/api/agent/ag_sys_red_packet',
      method: 'get',
      params
    })
  },
  // 查询排行玩家
  getRankUserList (params) {
    return http({
      url: '/api/agent/ag_rank_user_list',
      method: 'get',
      params
    })
  },
  // 查询过滤
  getFilter (params) {
    return http({
      url: '/api/agent/ag_filter',
      method: 'get',
      params
    })
  },
  updateFilter (data) {
    return http({
      url: '/api/agent/ag_filter',
      method: 'put',
      data
    })
  },
  insertFilter (data) {
    return http({
      url: '/api/agent/ag_filter',
      method: 'post',
      data
    })
  },
  // 查询忽略帐号
  getLimitUser (params) {
    return http({
      url: '/api/agent/ag_LimitUser',
      method: 'get',
      params
    })
  },
  updateLimitUser (data) {
    return http({
      url: '/api/agent/ag_LimitUser',
      method: 'put',
      data
    })
  },
  insertLimitUser (data) {
    return http({
      url: '/api/agent/ag_LimitUser',
      method: 'post',
      data
    })
  },
  getSuggestions (params) {
    return http({
      url: '/api/suggestion',
      method: 'get',
      params
    })
  },
  updatePlayerTransferRecord (data) {
    return http({
      url: '/api/agent/player_transfer_record',
      method: 'put',
      data
    })
  },
  getPlayerTransferRecord (params) {
    return http({
      url: '/api/agent/player_transfer_record',
      method: 'get',
      params
    })
  },
  getAgentTransferRecord (params) {
    return http({
      url: '/api/agent/agent_transfer_record',
      method: 'get',
      params
    })
  },
  updateAgentPackages (data) {
    return http({
      url: '/api/agent/agent_packages',
      method: 'put',
      data
    })
  },
  getAgentPackages (params) {
    return http({
      url: '/api/agent/agent_packages',
      method: 'get',
      params
    })
  },
  //   全民推广统计查
  getWJStatic (params) {
    return http({
      url: '/api/agent/wj_static',
      method: 'get',
      params
    })
  },
  //   玩家游戏轨迹
  getPlayerFootmark (params) {
    return http({
      url: '/api/agent/player_footmark',
      method: 'get',
      params
    })
  },
  //   新手分析
  getNewPlayerList (params) {
    return http({
      url: '/api/agent/new_player_list',
      method: 'get',
      params
    })
  },
  getApiRecordList (params) {
    return http({
      url: '/api/agent/api_record',
      method: 'get',
      params
    })
  },
  getApiAccount (params) {
    return http({
      url: '/api/agent/api_account',
      method: 'get',
      params
    })
  },
  insertApiAccount (data) {
    return http({
      url: '/api/agent/api_account',
      method: 'post',
      data
    })
  },
  updateApiAccount (data) {
    return http({
      url: '/api/agent/api_account',
      method: 'put',
      data
    })
  }
}
