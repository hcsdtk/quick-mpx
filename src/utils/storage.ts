import mpx from '@mpxjs/core'

export default {
  get<T = unknown> (key: string): T | undefined {
    const data = mpx.getStorageSync(key) as T | string | undefined
    if (typeof data !== 'string') {
      return data
    }

    try {
      return JSON.parse(data) as T
    } catch (error) {
      return data as T
    }
  },
  set<T> (key: string, data: T): void {
    const value = typeof data === 'string' ? data : JSON.stringify(data)
    mpx.setStorageSync(key, value)
  },
  remove (key: string): void {
    mpx.removeStorageSync(key)
  }
}
