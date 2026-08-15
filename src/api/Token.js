/* global getCurrentPages */

import mpx from '@mpxjs/core'
import store from '../store/user'
import Config from '../config'

let refreshingToken

class Token {
  static requestToken (url, data) {
    return mpx.request({
      url: Config.apiUrl + url,
      data,
      method: 'POST'
    }).then(response => response.data)
  }

  static async refreshToken () {
    const loginResult = await mpx.login()
    const userResult = await this.getUserInfo()
    const params = {
      code: loginResult.code,
      encryptedData: userResult.encryptedData,
      iv: userResult.iv,
      userInfo: userResult.userInfo
    }

    if (userResult.userInfo) {
      await store.dispatch('modifyUserInfo', userResult.userInfo)
    }
    return this.requestToken('/plan/login/miniAppsLogin', params)
  }

  static async getUserInfo () {
    const setting = await mpx.getSetting()
    if (setting.authSetting && setting.authSetting['scope.userInfo']) {
      return mpx.getUserInfo()
    }

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const dialog = currentPage && currentPage.selectComponent('#loginDialog')
    if (!dialog) {
      throw new Error('登录弹窗尚未挂载')
    }
    return dialog.open()
  }

  static getToken () {
    if (!store.getters.checkTokenExpire) {
      return Promise.resolve(store.getters.token)
    }

    if (!refreshingToken) {
      refreshingToken = this.refreshToken()
        .then(result => {
          const data = {
            token: result.data.member_id,
            expire_time: -1
          }
          return store.dispatch('modifyLoginInfo', data).then(() => data.token)
        })
        .finally(() => {
          refreshingToken = undefined
        })
    }
    return refreshingToken
  }
}

export default Token
