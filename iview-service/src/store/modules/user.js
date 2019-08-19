
import { constantRouterMap, asyncRouterMap, errorRouterMap, asyncRouterMap1 } from '@/router/routes'
import { setToken, clearAllCache, setKey, getKey } from '@/utils/auth'
import { Message, Notice } from 'iview'
import api from '@/api'
import * as UUID from 'uuidjs'
import router from './../../router'
const user = {
  state: {
    token: '',
    name: '',
    avatar: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
    roles: [],
    hasMenus: {},
    menuList: [],
    firstPage: '/',
    isPunch: '', // 是否已打卡
    isPunchText: '', // 打卡状态描述
    websocket: null,
    chatPlayerId: 0, // 当前与客服聊天的玩家id,
    showChatModal: false, // 聊天弹窗是否显示
    chatMessages: [], // 当前聊天数据,
    chatModalClass: 'my-model1'
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
    },
    SET_IS_PUNCH: (state, isPunch) => {
      state.isPunch = isPunch
    },
    SET_IS_PUNCH_TEXT: (state, isPunchText) => {
      state.isPunchText = isPunchText
    },
    SET_WS: (state, websocket) => {
      state.websocket = websocket
    },
    SET_CHAT_PLAYER_ID: (state, playerId) => {
      state.chatPlayerId = parseInt(playerId)
    },
    SET_SHOW_CHAT_MODAL: (state, flag) => {
      state.showChatModal = flag
    },
    SET_CHAT_MESSAGES: (state, chatMessages) => {
      state.chatMessages = chatMessages
    },
    PUSH_CHAT_MESSAGES: (state, msg) => {
      state.chatMessages.push(msg)
    },
    SET_chatModalClass: (state, cless) => {
      state.chatModalClass = cless
    }
  },
  actions: {
    initWebSocket: ({commit, state}) => {
      // const wsuri = 'ws://40.83.96.124/wsapp' // ws地址 uu
      // const wsuri = 'ws://23.100.95.151/wsapp' // ws地址 test
      const wsuri = 'ws://liaot.mm1117.com/wsapp' // ws地址 uu
      // const wsuri = 'ws://192.168.10.10:2346' // ws地址
      commit('SET_WS', new WebSocket(wsuri))
      state.websocket.onopen = () => {
        console.log('ws success', Date())
        setInterval(() => {
          state.websocket.send('a')
        }, 40000)
      }
      state.websocket.onerror = (e) => { // 错误
        console.log('ws error')
      }
      state.websocket.onmessage = (e) => { // 数据接收
        // json数据转换成js对象
        let data = JSON.parse(e.data)
        // console.log(data)
        var type = data.type || ''
        switch (type) {
          // Events.php中返回的init类型的消息，将client_id发给后台进行uid绑定
          case 'init':
            // 起ajax请求，将client_id发给后端进行uid绑定
            api.serviceClientBind({ client_id: data.client_id }).then((response) => {
              console.log(response)
            }).catch((err) => {
              console.log(err, 'error')
            })
            break
          // 当mvc框架调用GatewayClient发消息时直接alert出来
          default:
            const name = UUID.generate()
            document.getElementById('msgTipAudio').play().catch((err) => {
              console.log(err)
              console.log('该浏览器不支持声音播放!')
            })
            Notice.open({
              title: '玩家' + data.player_id + '发来新消息',
              name: name,
              duration: 300,
              render: h => {
                return h('div', [
                  // h('p', '玩家id:' + data.player_id),
                  h('div', {
                    style: {
                      padding: '4px'
                    }
                  }, data.msg),
                  h('Button', { props: {
                    type: 'primary',
                    icon: 'chatbubbles',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      if (state.chatPlayerId === parseInt(data.player_id)) {
                      } else {
                        router.push({ name: 'service_chat', query: { player_id: data.player_id, r: name } })
                      }
                      Notice.close(name)
                    }
                  } }, '回复')
                ])
              }
            })
            if (state.chatPlayerId === parseInt(data.player_id) && state.showChatModal) {
              commit('PUSH_CHAT_MESSAGES', data)
              setTimeout(() => {
                document.getElementById('ul_message_box').scrollTop = document.getElementById('ul_message_box').scrollHeight
              }, 500)

              var si = setInterval(() => {
                state.chatModalClass = state.chatModalClass === 'my-model2' ? 'my-model1' : 'my-model2'
              }, 60)
              setTimeout(() => {
                clearInterval(si)
                commit('SET_chatModalClass', 'my-model')
              }, 420)
            }
        }
      }
      state.websocket.onclose = (e) => { // 关闭
        console.log('connection closed (' + e.code + ')', Date())
      }
    },
    closeWebSocket: ({ commit, state }) => {
      state.websocket.close()
      commit('SET_WS', null)
    },
    login: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        api.loginByUsername(data).then((res) => {
          const result = res.data
          //   commit('SET_TOKEN', result.token_type + ' ' + result.access_token)
          if (result && result.szToken) {
            setToken(result.szToken)
            commit('SET_NAME', result.szUser)
            setKey('user_name', result.szUser)
            setKey('bankMoney', result.bankMoney)
            setKey('fCurMoney', result.fCurMoney)
            setKey('nLv', result.nLv)
            setKey('nPercent', result.nPercent)
            setKey('szAliPay', result.szAliPay)
            setKey('szRealName', result.szRealName)
            setKey('szNickName', result.szNickName)
            setKey('szBindID', result.szBindID)
            commit('SET_HASMENUS', result.menus)
            commit('SET_FIRSTPAGE', result.firstPage)
            setKey('hasMenus', JSON.stringify(result.menus))
            //   let routes = asyncRouterMap
            //   commit('SET_MENULIST', routes)
            //   router.addRoutes(routes.concat(errorRouterMap))
            //   setKey('refresh_token', result.refresh_token)
            //   setKey('expires_in', result.expires_in)
            resolve()
          } else {
            Message.error({
              content: '账号或密码有误！',
              duration: 5
            })
            reject(Error)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户菜单
    getUserMenu: ({ commit, dispatch, state }) => {
      return new Promise((resolve, reject) => {
        // 根据等级 分配菜单路由
        let routes = +getKey('nLv') === 999 ? asyncRouterMap1 : asyncRouterMap
        commit('SET_NAME', getKey('user_name'))
        commit('SET_MENULIST', routes)
        router.addRoutes(routes.concat(errorRouterMap))

        api.getLastOnePunchCards({}).then((res) => {
          if (res && res.data) {
            let data = res.data
            if (data.hasOwnProperty('status')) {
              commit('SET_IS_PUNCH_TEXT', parseInt(data.status) === 1 ? '已上班打卡' : '已下班打卡')
              commit('SET_IS_PUNCH', parseInt(data.status) === 1)
              if (parseInt(data.status) === 1) {
                // 打开webscoket
                dispatch('initWebSocket')
              }
            } else {
              commit('SET_IS_PUNCH_TEXT', '未打卡')
              commit('SET_IS_PUNCH', false)
            }
          }
          resolve()
        }).catch(err => {
          reject(err)
        })

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
    // 代理商人展示信息
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
    // 代理增加商人展示
    insertMerchantSetting: ({commit}, data) => {
      return api.insertMerchantSetting(data)
    },
    // 代理修改商人展示
    updateMerchantSetting: ({commit}, data) => {
      return api.updateMerchantSetting(data)
    },
    // 代理删除商人展示
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
    bind: ({commit}, data) => {
      return api.bind(data)
    },
    replayMessage: ({commit}, data) => {
      return api.replayMessage(data)
    },
    sendMessage: ({commit}, data) => {
      return api.sendMessage(data)
    },
    getMessageNotReplay: ({commit}, data) => {
      return api.getMessageNotReplay(data)
    },
    getChatMessages: ({commit}, data) => {
      return api.getChatMessages(data)
    },
    getPunchCards: ({commit}, data) => {
      return api.getPunchCards(data)
    },
    storePunchCard: ({commit}, data) => {
      return api.storePunchCard(data)
    },
    getLastOnePunchCards: ({commit}, data) => {
      return api.getLastOnePunchCards(data)
    },
    getServiceTimes: ({commit}, data) => {
      return api.getServiceTimes(data)
    },
    getServiceAchievements: ({commit}, data) => {
      return api.getServiceAchievements(data)
    },
    getPlayerSummary: ({commit}, data) => {
      return api.getPlayerSummary(data)
    },
    getAGGoldSource: ({commit}, data) => {
      return api.getAGGoldSource(data)
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
