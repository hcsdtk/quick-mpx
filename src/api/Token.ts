import mpx from '@mpxjs/core'
import { useUserStore, type LoginInfo, type UserInfo } from '../store/user'
import Config from '../config'

interface LoginResult {
  code: string
}

export interface UserAuthResult {
  encryptedData?: string
  iv?: string
  userInfo?: UserInfo
  errMsg?: string
  [key: string]: unknown
}

interface TokenResponse {
  data: {
    member_id: string
  }
}

let refreshingToken: Promise<string> | undefined

function getUserStore () {
  return useUserStore()
}

class Token {
  static async requestToken (url: string, data: Record<string, unknown>): Promise<TokenResponse> {
    const response = await (mpx as any).request({
      url: Config.apiUrl + url,
      data,
      method: 'POST'
    }) as TokenResponse
    return response
  }

  static async refreshToken (): Promise<TokenResponse> {
    const loginResult = await (mpx as any).login() as LoginResult
    const userResult = await this.getUserInfo()
    const params = {
      code: loginResult.code,
      encryptedData: userResult.encryptedData,
      iv: userResult.iv,
      userInfo: userResult.userInfo
    }

    if (userResult.userInfo) {
      getUserStore().modifyUserInfo(userResult.userInfo)
    }
    return this.requestToken('/plan/login/miniAppsLogin', params)
  }

  static async getUserInfo (): Promise<UserAuthResult> {
    const setting = await (mpx as any).getSetting() as {
      authSetting?: Record<string, boolean>
    }
    if (setting.authSetting && setting.authSetting['scope.userInfo']) {
      return (mpx as any).getUserInfo() as Promise<UserAuthResult>
    }

    const pages = getCurrentPages() as unknown as Array<{
      selectComponent?: (selector: string) => { open: (options?: object) => Promise<UserAuthResult> } | null
    }>
    const currentPage = pages[pages.length - 1]
    const dialog = currentPage?.selectComponent?.('#loginDialog')
    if (!dialog) {
      throw new Error('登录弹窗尚未挂载')
    }
    return dialog.open()
  }

  static getToken (): Promise<string> {
    const store = getUserStore()
    if (!store.checkTokenExpire) {
      return Promise.resolve(store.token)
    }

    if (!refreshingToken) {
      refreshingToken = this.refreshToken()
        .then(result => {
          const data: LoginInfo = {
            token: result.data.member_id,
            expire_time: -1
          }
          store.modifyLoginInfo(data)
          return data.token
        })
        .finally(() => {
          refreshingToken = undefined
        })
    }
    return refreshingToken
  }
}

export default Token
