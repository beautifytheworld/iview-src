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
    path: '/withdrawal',
    name: 'withdrawal',
    redirect: '/withdrawal/list',
    meta: { title: '提现', icon: 'card' },
    component: layout,
    children: [
      { path: 'list', meta: { title: '订单列表', icon: 'android-list' }, name: 'withdrawal-list', component: () => import('@/views/withdrawal/list') }
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
      // { path: 'login-logs', meta: { title: '登陆日志', icon: 'record' }, name: 'login_logs', component: () => import('@/views/system/login-logs') },
      // { path: 'operate-logs', meta: { title: '操作日志', icon: 'disc' }, name: 'operate_logs', component: () => import('@/views/system/operate-logs') },
      // { path: 'gm-account-list', meta: { title: '管理账号', icon: 'person-stalker' }, name: 'gm_account_list', component: () => import('@/views/system/gm-account-list') }

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
