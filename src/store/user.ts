import { computed, ref } from '@mpxjs/core'
import { defineStore } from '@mpxjs/pinia'
import storage from '../utils/storage'

export interface LoginInfo {
  token: string
  expire_time: number
}

export interface UserInfo {
  [key: string]: unknown
}

const defaultLoginInfo: LoginInfo = {
  token: '',
  expire_time: 0
}

export const useUserStore = defineStore('user', () => {
  const loginInfo = ref<LoginInfo>(storage.get<LoginInfo>('loginInfo') || defaultLoginInfo)
  const userInfo = ref<UserInfo>(storage.get<UserInfo>('userInfo') || {})

  const token = computed(() => loginInfo.value.token)
  const checkTokenExpire = computed(() => {
    if (loginInfo.value.token === '') {
      return true
    }
    if (loginInfo.value.expire_time === -1) {
      return false
    }
    return Date.now() - (loginInfo.value.expire_time - 15 * 60 * 1000) >= 0
  })

  function modifyLoginInfo (payload: LoginInfo): void {
    loginInfo.value = payload
    storage.set('loginInfo', payload)
  }

  function modifyUserInfo (payload: UserInfo): void {
    userInfo.value = payload
    storage.set('userInfo', payload)
  }

  return {
    loginInfo,
    userInfo,
    token,
    checkTokenExpire,
    modifyLoginInfo,
    modifyUserInfo
  }
})

export default useUserStore
