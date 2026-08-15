import mpx from '@mpxjs/core'

export default {
  get (key) {
    const data = mpx.getStorageSync(key)
    if (typeof data !== 'string') {
      return data
    }

    try {
      return JSON.parse(data)
    } catch (error) {
      return data
    }
  },
  set (key, data) {
    const value = typeof data === 'string' ? data : JSON.stringify(data)
    mpx.setStorageSync(key, value)
  },
  remove (key) {
    mpx.removeStorageSync(key)
  }
}
