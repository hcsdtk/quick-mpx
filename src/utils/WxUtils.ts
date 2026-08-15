import mpx from '@mpxjs/core'

interface PaymentParams {
  complete?: (result: PaymentResult) => void
  [key: string]: unknown
}

export interface PaymentResult {
  errMsg?: string
  [key: string]: unknown
}

export default class WxUtils {
  static get tabUrls () {
    return ['/pages/index/index', '/pages/member/index', '/pages/mine/index', '/pages/order/index']
  }

  static isTab (url: string): boolean {
    return this.tabUrls.some(path => path === url)
  }

  static handleScanUrl (url: string): string {
    return url.indexOf('/') === 0 ? url : '/' + url
  }

  static redirect (url: string): void {
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

  static navigate (url: string, _params?: Record<string, unknown>): void {
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

  static wxPay (param: PaymentParams): Promise<PaymentResult> {
    return new Promise((resolve, reject) => {
      param.complete = result => {
        if (String(result.errMsg || '').toLocaleLowerCase() === 'requestPayment:ok'.toLocaleLowerCase()) {
          resolve(result)
        } else {
          reject(result)
        }
      }
      ;(mpx as any).requestPayment(param)
    })
  }
}
