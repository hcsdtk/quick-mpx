import mpx from '@mpxjs/core'
import mpxFetch from '@mpxjs/fetch'

import Config from '../config/index'
import Token from '../api/Token'

mpx.use(mpxFetch)

export interface RequestConfig {
  url: string
  method?: string
  data?: Record<string, unknown>
  header?: Record<string, string>
}

interface RawResponse<T = unknown> {
  statusCode: number
  errMsg?: string
  data: T | string
}

export interface ServerResponse<T = unknown> {
  httpCode: number
  httpMsg: string
  serverCode: number
  serverMsg: string
  serverData: T
}

interface FetchClient {
  interceptors: {
    request: { use: (handler: (config: RequestConfig) => Promise<RequestConfig>) => void }
    response: { use: (handler: (response: RawResponse) => unknown) => void }
  }
  fetch: <T = unknown>(config: RequestConfig) => Promise<T>
}

const fetchClient = (mpx as any).xfetch as FetchClient

// 请求拦截器
fetchClient.interceptors.request.use(async config => {
  const token = await Token.getToken()
  if (!token) {
    return config
  }

  config.header = {
    ...config.header,
    Authorization: token
  }
  config.data = {
    ...config.data,
    member_id: token,
    bigVersion: 'v3',
    version: '3.1.1.8',
    scene: 1001
  }
  return config
})

// 处理后台返回数据
function handlerResponseData<T> (response: RawResponse<T>): ServerResponse<T> {
  let data: unknown = response.data
  const result: ServerResponse<T> = {
    httpCode: response.statusCode,
    httpMsg: response.errMsg || '',
    serverCode: 0,
    serverMsg: '',
    serverData: {} as T
  }
  if (response.statusCode === 200) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (e) {
        data = {
          code: 1,
          msg: `服务器异常，请稍后重试`,
          data: {}
        }
      }
    }
    const payload = data && typeof data === 'object'
      ? data as { code?: number; msg?: string; data?: T }
      : {}
    result.serverCode = payload.code || 0
    result.serverMsg = payload.msg || `服务器繁忙，请稍后重试`
    result.serverData = payload.data || {} as T
  }
  return result
}

// 判断请求是否成功
function isSuccess<T> (response: ServerResponse<T>): boolean {
  return response.httpCode === 200 && response.serverCode === Config.httpCode.success
}

// 请求成功拦截器
function interceptorsResponse<T> (response: RawResponse<T>): T | Promise<never> {
  const responseData = handlerResponseData(response)
  if (isSuccess(responseData)) {
    return responseData.serverData
  } else {
    return Promise.reject(responseData)
  }
}

fetchClient.interceptors.response.use(interceptorsResponse)

const request = {
  done<T> (url: string, data: Record<string, unknown> = {}, type = 'get'): Promise<T> {
    url = /^https?:\/\//.test(url) ? url : Config.apiUrl + url
    return fetchClient.fetch<T>({
      url: url,
      method: type,
      data: data
    })
  },
  post<T> (url: string, data: Record<string, unknown> = {}): Promise<T> {
    return request.done<T>(url, data, 'POST')
  },
  get<T> (url: string, data: Record<string, unknown> = {}): Promise<T> {
    return request.done<T>(url, data, 'GET')
  }
}

export default request
