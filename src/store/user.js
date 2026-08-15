import { createStore } from '@mpxjs/store'
import storage from '../utils/storage'

const UserStore = createStore({
  state: {
    loginInfo: storage.get('loginInfo') || {
      token: '',
      expire_time: 0
    },
    userInfo: storage.get('userInfo') || {}
  },
  getters: {
    token: state => state.loginInfo.token,
    userInfo: state => state.userInfo,
    checkTokenExpire: state => {
      return state.loginInfo.token === ''
        ? true
        : state.loginInfo.expire_time === -1
          ? false
          : new Date().getTime() - (state.loginInfo.expire_time - 15 * 60 * 1000) >= 0
    }
  },
  mutations: {
    modifyLoginInfo (state, payload) {
      state.loginInfo = payload
    },
    modifyUserInfo (state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    modifyLoginInfo ({ commit }, payload) {
      storage.set('loginInfo', payload)
      commit('modifyLoginInfo', payload)
    },
    modifyUserInfo ({ commit }, payload) {
      storage.set('userInfo', payload)
      commit('modifyUserInfo', payload)
    }
  }
})
export default UserStore
