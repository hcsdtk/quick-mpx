import mpx from '@mpxjs/core'
import WxUtils from '../utils/WxUtils'

interface NavigationEvent {
  currentTarget?: {
    dataset?: {
      url?: string
    }
  }
}

mpx.mixin({
  tapNavTo (event: NavigationEvent): void {
    const currentTarget = event && event.currentTarget
    const url = currentTarget && currentTarget.dataset && currentTarget.dataset.url
    if (url) {
      WxUtils.navigate(url)
    }
  }
})
