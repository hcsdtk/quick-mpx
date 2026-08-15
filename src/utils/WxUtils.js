import mpx from '@mpxjs/core'

export default class WxUtils {
  static get tabUrls () {
    return ['/pages/index/index', '/pages/member/index', '/pages/mine/index', '/pages/order/index']
  }

  static isTab (url) {
    return this.tabUrls.some(path => path === url)
  }

  static handleScanUrl (url) {
    return url.indexOf('/') === 0 ? url : '/' + url
  }

  static redirect (url) {
    url = this.handleScanUrl(url)
    if (this.isTab(url)) {
      mpx.switchTab({
        url: url
      })
    } else {
      mpx.redirectTo({
        url: url
      })
    }
  }

  static navigate (url, params) {
    url = this.handleScanUrl(url)
    if (this.isTab(url)) {
      mpx.switchTab({
        url: url
      })
    } else {
      mpx.navigateTo({
        url: url
      })
    }
  }

  static wxPay (param) {
    return new Promise((resolve, reject) => {
      param.complete = res => {
        if (res.errMsg.toLocaleLowerCase() === 'requestPayment:ok'.toLocaleLowerCase()) {
          resolve(res)
        } else {
          reject(res)
        }
      }
      mpx.requestPayment(param)
    })
  }
}
