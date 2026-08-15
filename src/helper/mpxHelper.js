import mpx from '@mpxjs/core'
import WxUtils from '../utils/WxUtils'

mpx.mixin({
  tapNavTo (event) {
    const currentTarget = event && event.currentTarget
    const url = currentTarget && currentTarget.dataset && currentTarget.dataset.url
    if (url) {
      WxUtils.navigate(url)
    }
  }
})
