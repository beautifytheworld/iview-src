import login from '@/views/login'
import page404 from '@/views/error-page/404.vue'

const layout = () => import(/* webpackChunkName: "group-index" */ '@/views/layout')

// 错误页面路由
export const errorRouterMap = [
  {
    path: '/403',
    meta: {
      title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
  },
  {
    path: '/500',
    meta: {
      title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
  },
  { path: '/*', name: '404', hidden: true, component: page404 }
]

/**
* hidden: true                   如果hidden为true则不在左侧菜单栏展示，默认为false
* name:'router-name'             路由名称，必须填写
* meta : {
    title: 'title'               对应路由在左侧菜单栏的标题名称
    icon: 'icon-class'             对应路由在左侧菜单栏的图标样式，样式使用iconfont图标库，见assest/iconfont文件夹
  }
  children 下要显示的只有一个 则不会显示二级菜单 只显示该菜单 此时建议上级meta的title为''
**/
export const asyncRouterMap = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    hidden: true,
    meta: { title: '', icon: 'android-home' },
    component: layout,
    children: [
      { path: 'welcome', name: 'welcome', meta: { title: '欢迎页', icon: 'ios-home' }, component: () => import(/* webpackChunkName: "group-index" */'@/views/home') }
    ]
  },
  {
    path: '/agent',
    alias: '/',
    name: 'agent',
    redirect: '/agent/promo-statics',
    meta: { title: '推广', icon: 'cube' },
    component: layout,
    children: [
      { path: 'promo-statics', meta: { title: '首页', icon: 'ios-home' }, name: 'promo_statics', component: () => import('@/views/agent/home') },
      { path: 'users', meta: { title: '用户查询', icon: 'person-stalker' }, name: 'users_index', component: () => import('@/views/operate/users') },
      { path: 'agent-list', meta: { title: '代理管理', keepAlive: true, icon: 'android-list' }, name: 'agent_list', component: () => import('@/views/agent/agent-list') },
      // { path: 'game-list', meta: { title: '约战房间', keepAlive: true, icon: 'ios-baseball' }, name: 'game_list', component: () => import('@/views/game/game-list') },
      { path: 'promo-url', meta: { title: '推广地址', keepAlive: true, icon: 'ios-location' }, name: 'promo_url', component: () => import('@/views/agent/promo-url') },
      { path: 'promo-list', meta: { title: '推广统计', keepAlive: true, icon: 'ios-analytics' }, name: 'promo_list', component: () => import('@/views/agent/promo-list') },
      { path: 'income-list', meta: { title: '收入统计', keepAlive: true, icon: 'pie-graph' }, name: 'income_list', component: () => import('@/views/agent/income-list') },
      { path: 'income-detail-list', meta: { title: '收入明细', keepAlive: true, icon: 'ios-flask' }, name: 'income_detail_list', component: () => import('@/views/agent/income-detail-list') },
      { path: 'merchant-setting', meta: { title: '商人展示', keepAlive: true, icon: 'android-contact' }, name: 'merchant_setting', component: () => import('@/views/agent/merchant-setting') },
      // { path: 'settle-record', meta: { title: '提现审核', icon: 'ios-list' }, name: 'settle_record', component: () => import('@/views/agent/settle-record') },
      { path: 'transfer', meta: { title: '转账操作', icon: 'arrow-swap' }, name: 'transfer', component: () => import('@/views/agent/transfer') },
      { path: 'transfer-record', meta: { title: '转账记录', keepAlive: true, icon: 'android-list' }, name: 'transfer_record', component: () => import('@/views/agent/transfer-record') },
      { path: 'buy-record', meta: { title: '进分记录', keepAlive: true, icon: 'ios-paper' }, name: 'buy_record', component: () => import('@/views/agent/buy-record') },
      { path: 'settle-acc', meta: { title: '结算账户', icon: 'locked' }, name: 'settle_acc', component: () => import('@/views/agent/settle-acc') },
      { path: 'settle-pass', meta: { title: '结算密码', icon: 'lock-combination' }, name: 'settle_pass', component: () => import('@/views/agent/settle-pass') },
      { path: 'settlement', meta: { title: '提交结算', icon: 'arrow-up-a' }, name: 'settlement', component: () => import('@/views/agent/settlement') },
      { path: 'player-transfer', meta: { title: '收分记录', icon: 'android-list' }, name: 'player_transfer', component: () => import('@/views/agent/player-transfer') }

    ]
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/system/gm-account-list',
    meta: { title: '系统', icon: 'android-desktop' },
    component: layout,
    children: [
      { path: 'account-setting', meta: { title: '账号设置', icon: 'ios-body' }, name: 'account_setting', component: () => import('@/views/system/account-setting') }
    ]
  }

]

export const asyncRouterMap2 = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    hidden: true,
    meta: { title: '', icon: 'android-home' },
    component: layout,
    children: [
      { path: 'welcome', name: 'welcome', meta: { title: '欢迎页', icon: 'ios-home' }, component: () => import(/* webpackChunkName: "group-index" */'@/views/home') }
    ]
  },
  {
    path: '/agent',
    alias: '/',
    name: 'agent',
    redirect: '/agent/promo-statics',
    meta: { title: '推广', icon: 'cube' },
    component: layout,
    children: [
      { path: 'promo-statics', meta: { title: '首页', icon: 'ios-home' }, name: 'promo_statics', component: () => import('@/views/agent/home') },
      { path: 'users', meta: { title: '用户查询', icon: 'person-stalker' }, name: 'users_index', component: () => import('@/views/operate/users') },
      { path: 'agent-list', meta: { title: '代理管理', keepAlive: true, icon: 'android-list' }, name: 'agent_list', component: () => import('@/views/agent/agent-list') },
      // { path: 'game-list', meta: { title: '约战房间', keepAlive: true, icon: 'ios-baseball' }, name: 'game_list', component: () => import('@/views/game/game-list') },
      { path: 'promo-url', meta: { title: '推广地址', keepAlive: true, icon: 'ios-location' }, name: 'promo_url', component: () => import('@/views/agent/promo-url') },
      { path: 'promo-list', meta: { title: '推广统计', keepAlive: true, icon: 'ios-analytics' }, name: 'promo_list', component: () => import('@/views/agent/promo-list') },
      { path: 'income-list', meta: { title: '收入统计', keepAlive: true, icon: 'pie-graph' }, name: 'income_list', component: () => import('@/views/agent/income-list') },
      { path: 'income-detail-list', meta: { title: '收入明细', keepAlive: true, icon: 'ios-flask' }, name: 'income_detail_list', component: () => import('@/views/agent/income-detail-list') },
      { path: 'merchant-setting', meta: { title: '商人展示', keepAlive: true, icon: 'android-contact' }, name: 'merchant_setting', component: () => import('@/views/agent/merchant-setting') },
      // { path: 'settle-record', meta: { title: '提现审核', icon: 'ios-list' }, name: 'settle_record', component: () => import('@/views/agent/settle-record') },
      { path: 'transfer', meta: { title: '转账操作', icon: 'arrow-swap' }, name: 'transfer', component: () => import('@/views/agent/transfer') },
      { path: 'transfer-record', meta: { title: '转账记录', keepAlive: true, icon: 'android-list' }, name: 'transfer_record', component: () => import('@/views/agent/transfer-record') },
      { path: 'buy-record', meta: { title: '进分记录', keepAlive: true, icon: 'ios-paper' }, name: 'buy_record', component: () => import('@/views/agent/buy-record') },
      // { path: 'settle-acc', meta: { title: '结算账户', icon: 'locked' }, name: 'settle_acc', component: () => import('@/views/agent/settle-acc') },
      // { path: 'settle-pass', meta: { title: '结算密码', icon: 'lock-combination' }, name: 'settle_pass', component: () => import('@/views/agent/settle-pass') },
      // { path: 'settlement', meta: { title: '提交结算', icon: 'arrow-up-a' }, name: 'settlement', component: () => import('@/views/agent/settlement') }
      { path: 'player-transfer', meta: { title: '收分记录', icon: 'android-list' }, name: 'player_transfer', component: () => import('@/views/agent/player-transfer') },
      { path: 'agent-transfer', meta: { title: '下分记录', keepAlive: true, icon: 'ios-list' }, name: 'agent_transfer', component: () => import('@/views/agent/agent-transfer') }

    ]
  },
  {
    path: '/system',
    name: 'system',
    redirect: '/system/gm-account-list',
    meta: { title: '系统', icon: 'android-desktop' },
    component: layout,
    children: [
      { path: 'account-setting', meta: { title: '账号设置', icon: 'ios-body' }, name: 'account_setting', component: () => import('@/views/system/account-setting') }
    ]
  }

]
/**
 * 登陆路由
 */
export const constantRouterMap = [
  { path: '/login', name: 'login', hidden: true, meta: { title: '系统登录' }, component: login }
  //   ...asyncRouterMap,
  //   ...errorRouterMap
]
