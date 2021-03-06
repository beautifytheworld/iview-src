
import { constantRouterMap, asyncRouterMap, errorRouterMap } from '@/router/routes'
import { clearAllCache, getKey } from '@/utils/auth'
// import { Notice } from 'iview'
import api from '@/api'
import router from './../../router'

const user = {
  state: {
    token: '',
    name: '',
    avatar: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
    roles: [],
    hasMenus: {},
    menuList: [],
    firstPage: '/'
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_MENULIST: (state, routes) => {
      state.menuList = constantRouterMap.concat(routes)
    },
    SET_HASMENUS: (state, menus) => {
      state.hasMenus = menus
    },
    SET_FIRSTPAGE: (state, firstPage) => {
      state.firstPage = firstPage
    }
  },
  actions: {
    login: ({ commit, state }, data) => {
      return api.loginByUsername(data)
      // return new Promise((resolve, reject) => {
      //   api.loginByUsername(data).then((res) => {
      //     const result = res.data
      //     //   commit('SET_TOKEN', result.token_type + ' ' + result.access_token)
      //     if (result && result.szToken) {
      //       setToken(result.szToken)
      //     } else {
      //       Message.error({
      //         content: '账号或密码有误！',
      //         duration: 5
      //       })
      //     }
      //     commit('SET_NAME', result.szUser)
      //     setKey('user_name', result.szUser)
      //     setKey('bankMoney', result.bankMoney)
      //     setKey('fCurMoney', result.fCurMoney)
      //     setKey('nLv', result.nLv)
      //     setKey('nPercent', result.nPercent)
      //     setKey('szAliPay', result.szAliPay)
      //     setKey('szRealName', result.szRealName)
      //     setKey('szNickName', result.szNickName)
      //     setKey('szBindID', result.szBindID)
      //     commit('SET_HASMENUS', result.menus)
      //     commit('SET_FIRSTPAGE', result.firstPage)
      //     setKey('hasMenus', JSON.stringify(result.menus))
      //     //   let routes = asyncRouterMap
      //     //   commit('SET_MENULIST', routes)
      //     //   router.addRoutes(routes.concat(errorRouterMap))
      //     //   setKey('refresh_token', result.refresh_token)
      //     //   setKey('expires_in', result.expires_in)
      //     resolve()
      //   }).catch(err => {
      //     reject(err)
      //   })
      // })
    },
    // 获取用户菜单
    getUserMenu: ({ commit, state }) => {
      return new Promise((resolve, reject) => {
        // 暂时无权限控制 分配所有菜单路由
        let routes = asyncRouterMap
        commit('SET_NAME', getKey('user_name'))
        commit('SET_MENULIST', routes)
        router.addRoutes(routes.concat(errorRouterMap))

        resolve()
        // let routes = []
        // // const userMenus = state.hasMenus
        // const userMenus = JSON.parse(getKey('hasMenus'))

        // asyncRouterMap.forEach(item => {
        //   if (userMenus.hasOwnProperty(item.name) && userMenus[item.name]) {
        //     if (item.children && item.children.length) {
        //       let children = item.children.filter(element => {
        //         return userMenus.hasOwnProperty(element.name) && userMenus[element.name]
        //       })
        //       item.children = children
        //     }
        //     routes.push(item)
        //   }
        // })
        // commit('SET_MENULIST', routes)
        // router.addRoutes(routes.concat(errorRouterMap))
        // resolve()
        //     router.addRoutes(routes.concat(errorRouterMap))
        // api.getUserInfo().then(res => {
        //   if (res && res.data) {
        //     const user = res.data
        //     commit('SET_HASMENUS', res.data.menus)
        //     commit('SET_NAME', user.name)
        //     commit('SET_AVATAR', user.avatar)
        //     const userMenus = res.data.menus

        //     //  设置左侧可显示菜单
        //     let routes = []
        //     if (!user.is_admin) {
        //       asyncRouterMap.forEach(item => {
        //         if (userMenus.hasOwnProperty(item.name) && userMenus[item.name]) {
        //           if (item.children && item.children.length) {
        //             let children = item.children.filter(element => {
        //               return userMenus.hasOwnProperty(element.name) && userMenus[element.name]
        //             })
        //             item.children = children
        //           }
        //           routes.push(item)
        //         }
        //       })
        //     } else {
        //       routes = asyncRouterMap
        //     }
        //     commit('SET_MENULIST', routes)
        //     router.addRoutes(routes.concat(errorRouterMap))
        //   }
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },
    // 运营首页
    getOperateHome: ({commit}, data) => {
      return api.getOperateHome(data)
    },
    // 用户查询
    getUserList: ({commit}, data) => {
      return api.getUserList(data)
    },
    // 金币日志
    getGoldLogs: ({commit}, data) => {
      return api.getGoldLogs(data)
    },
    // 游戏日志
    getGameLogs: ({commit}, data) => {
      return api.getGameLogs(data)
    },
    // 调整金币
    getGoldAdjustment: ({commit}, data) => {
      return api.getGoldAdjustment(data)
    },
    // 封锁账号
    getAccountBlocking: ({commit}, data) => {
      return api.getAccountBlocking(data)
    },
    // 游戏公告
    getGameMessage: ({commit}, data) => {
      return api.getGameMessage(data)
    },
    // 游戏税收
    getGameTax: ({commit}, data) => {
      return api.getGameTax(data)
    },
    // 在线玩家
    getUsersOnline: ({commit}, data) => {
      return api.getUsersOnline(data)
    },
    // 举报记录
    getReportLogs: ({commit}, data) => {
      return api.getReportLogs(data)
    },
    // 提现订单
    getExchangeOrders: ({commit}, data) => {
      return api.getExchangeOrders(data)
    },
    // 客服反馈列表
    getServiceList: ({commit}, data) => {
      return api.getServiceList(data)
    },
    // 客服反馈
    updateServiceList: ({commit}, data) => {
      return api.updateServiceList(data)
    },
    // 后台登录日志
    getLoginLogs: ({commit}, data) => {
      return api.getLoginLogs(data)
    },
    // 后台操作日志
    getOperateLogs: ({commit}, data) => {
      return api.getOperateLogs(data)
    },
    // 充值订单
    getChargeOrders: ({commit}, data) => {
      return api.getChargeOrders(data)
    },
    // 后台账号列表
    getGMAccountList: ({commit}, data) => {
      return api.getGMAccountList(data)
    },
    // 代理推广首页
    getPromoStatics: ({commit}, data) => {
      return api.getPromoStatics(data)
    },
    // 代理系统公告
    getAgentMessage: ({commit}, data) => {
      return api.getAgentMessage(data)
    },
    // 代理管理
    getAgentList: ({commit}, data) => {
      return api.getAgentList(data)
    },
    // 代理推广统计
    getPromoList: ({commit}, data) => {
      return api.getPromoList(data)
    },
    // 代理收入统计
    getIncomeList: ({commit}, data) => {
      return api.getIncomeList(data)
    },
    // 代理收入明细
    getIncomeDetailList: ({commit}, data) => {
      return api.getIncomeDetailList(data)
    },
    // 代理商人绑定信息
    getMerchantSetting: ({commit}, data) => {
      return api.getMerchantSetting(data)
    },
    // 代理提现订单
    getSettleRecord: ({commit}, data) => {
      return api.getSettleRecord(data)
    },
    // 代理转账记录
    getTransferRecord: ({commit}, data) => {
      return api.getTransferRecord(data)
    },
    // 代理上分记录
    getBuyRecord: ({commit}, data) => {
      return api.getBuyRecord(data)
    },
    // 代理推广二维码
    getPromoUrl: ({commit}, data) => {
      return api.getPromoUrl(data)
    },
    // 代理推广余额
    getAccount: ({commit}, data) => {
      return api.getAccount(data)
    },
    // 充值配置
    getExchangeChannel: ({commit}, data) => {
      return api.getExchangeChannel(data)
    },
    // 提现配置
    getRechargeChannel: ({commit}, data) => {
      return api.getRechargeChannel(data)
    },
    // 增加后台账号
    insertGMAccount: ({commit}, data) => {
      return api.insertGMAccount(data)
    },
    // 修改后台账号
    updateGMAccount: ({commit}, data) => {
      return api.updateGMAccount(data)
    },
    // 删除后台账号
    deleteGMAccount: ({commit}, data) => {
      return api.deleteGMAccount(data)
    },
    // 增加代理公告
    insertAgentMessage: ({commit}, data) => {
      return api.insertAgentMessage(data)
    },
    // 修改代理公告
    updateAgentMessage: ({commit}, data) => {
      return api.updateAgentMessage(data)
    },
    // 删除代理公告
    deleteAgentMessage: ({commit}, data) => {
      return api.deleteAgentMessage(data)
    },
    // 增加代理
    insertAgentAccount: ({commit}, data) => {
      return api.insertAgentAccount(data)
    },
    // 修改代理账号
    updateAgentAccount: ({commit}, data) => {
      return api.updateAgentAccount(data)
    },
    // 结算账户 结算密码 修改
    updateAgentAccountSettle: ({commit}, data) => {
      return api.updateAgentAccountSettle(data)
    },
    // 删除代理账号
    deleteAgentAccount: ({commit}, data) => {
      return api.deleteAgentAccount(data)
    },
    // 代理增加商人绑定
    insertMerchantSetting: ({commit}, data) => {
      return api.insertMerchantSetting(data)
    },
    // 代理修改商人绑定
    updateMerchantSetting: ({commit}, data) => {
      return api.updateMerchantSetting(data)
    },
    // 代理删除商人绑定
    deleteMerchantSetting: ({commit}, data) => {
      return api.deleteMerchantSetting(data)
    },
    // 充值配置修改
    updateExchangeChannel: ({commit}, data) => {
      return api.updateExchangeChannel(data)
    },
    // 提现配置修改
    updateRechargeChannel: ({commit}, data) => {
      return api.updateRechargeChannel(data)
    },
    // 新增滚动公告
    insertMessage: ({commit}, data) => {
      return api.insertMessage(data)
    },
    // 新增系统公告
    insertSysMessage: ({commit}, data) => {
      return api.insertSysMessage(data)
    },
    // 删除公告
    deleteMessage: ({commit}, data) => {
      return api.deleteMessage(data)
    },
    // 修改账号信息
    updateAccount: ({commit}, data) => {
      return api.updateAccount(data)
    },
    // 修改携带游戏币
    updateGold: ({commit}, data) => {
      return api.updateGold(data)
    },
    // 修改银行余额
    updateBankGold: ({commit}, data) => {
      return api.updateBankGold(data)
    },
    //  代理转账
    insertTransfer: ({commit}, data) => {
      return api.insertTransfer(data)
    },
    //  代理申请提现
    insertSettlement: ({commit}, data) => {
      return api.insertSettlement(data)
    },
    //  代理提现审核
    updateSettlement: ({commit}, data) => {
      return api.updateSettlement(data)
    },
    //  玩家提现审核
    updateExchange: ({commit}, data) => {
      return api.updateExchange(data)
    },
    // 游戏房间设置
    getGameRoomSetting: ({commit}, data) => {
      return api.getGameRoomSetting(data)
    },
    // 修改游戏房间设置
    updateGameRoomSetting: ({commit}, data) => {
      return api.updateGameRoomSetting(data)
    },
    // 提现设置 (查询玩家的提现设置)
    getExchangeSetting: ({commit}, data) => {
      return api.getExchangeSetting(data)
    },
    // 玩家提现配置
    updateExchangeSetting: ({commit}, data) => {
      return api.updateExchangeSetting(data)
    },
    // 注册赠送配置
    getRegisterSetting: ({commit}, data) => {
      return api.getRegisterSetting(data)
    },
    // 注册赠送修改
    updateRegistSetting: ({commit}, data) => {
      return api.updateRegistSetting(data)
    },
    // 举报有奖配置
    getReportSetting: ({commit}, data) => {
      return api.getReportSetting(data)
    },
    // 举报有奖修改
    updateReportSetting: ({commit}, data) => {
      return api.updateReportSetting(data)
    },
    // 查询月入百万配置
    getYRBWSetting: ({commit}, data) => {
      return api.getYRBWSetting(data)
    },
    // 修改月入百万配置
    updateYRBWSetting: ({commit}, data) => {
      return api.updateYRBWSetting(data)
    },
    // 修改游戏公告
    updateGameMessage: ({commit}, data) => {
      return api.updateGameMessage(data)
    },
    // 金额配置查询
    getRechargeSetting: ({commit}, data) => {
      return api.getRechargeSetting(data)
    },
    // 修改金额配置
    updateRechargeSetting: ({commit}, data) => {
      return api.updateRechargeSetting(data)
    },
    // 统计
    getPotatoRobotStatics: ({commit}, data) => {
      return api.getPotatoRobotStatics(data)
    },
    // 用户输赢
    getUserWinTotalg: ({commit}, data) => {
      return api.getUserWinTotalg(data)
    },
    // 用户充值
    getUserChargeTotal: ({commit}, data) => {
      return api.getUserChargeTotal(data)
    },
    // 税收统计
    getTaxStatics: ({commit}, data) => {
      return api.getTaxStatics(data)
    },
    // 在线统计
    getOnlineStatics: ({commit}, data) => {
      return api.getOnlineStatics(data)
    },
    // 提现统计
    getWithdrawStatics: ({commit}, data) => {
      return api.getWithdrawStatics(data)
    },
    // 充值统计
    getChargeStatics: ({commit}, data) => {
      return api.getChargeStatics(data)
    },
    getPlayerSummary: ({commit}, data) => {
      return api.getPlayerSummary(data)
    },
    getChatMessages: ({commit}, data) => {
      return api.getChatMessages(data)
    },
    getGameWinTotal: ({commit}, data) => {
      return api.getGameWinTotal(data)
    },
    getWJUserList: ({commit}, data) => {
      return api.getWJUserList(data)
    },
    getWjPromoList: ({commit}, data) => {
      return api.getWjPromoList(data)
    },
    getPlayerTransferRecord: ({commit}, data) => {
      return api.getPlayerTransferRecord(data)
    },
    updatePlayerTransferRecord: ({commit}, data) => {
      return api.updatePlayerTransferRecord(data)
    },
    getAgentTransferRecord: ({commit}, data) => {
      return api.getAgentTransferRecord(data)
    },
    getWJStatic: ({commit}, data) => {
      return api.getWJStatic(data)
    },
    getPlayerFootmark: ({commit}, data) => {
      return api.getPlayerFootmark(data)
    },
    getNewPlayerList: ({commit}, data) => {
      return api.getNewPlayerList(data)
    },
    // 退出登录
    logOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        clearAllCache()
        resolve()
      })
    },
    // 前端 登出
    fedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        clearAllCache()
        resolve()
      })
    }
  }
}

export default user
