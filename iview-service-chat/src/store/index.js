import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'

Vue.use(Vuex)
// const myPlugin = store => {
//   // 当 store 初始化后调用
//   store.subscribe((mutation, state) => {
//     console.log('from myPlugin')
//     console.log(mutation, '11111111111')
//   })
//   store.subscribeAction((action, state) => {
//     console.log('from myPlugin')
//     console.log(action, '2222222222')
//   })
// }
const store = new Vuex.Store({
  modules: {
    app,
    user
  },
  // plugins: [myPlugin],
  getters
})

export default store
