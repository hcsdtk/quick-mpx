import request from '../utils/request'

export interface BannerItem {
  banner?: string
  link?: string
  url?: string
}

export interface IndexInfo {
  banner?: string
  level?: string | number
  list: BannerItem[]
}

export function index (): Promise<IndexInfo> {
  return request.get<IndexInfo>('/api/index/index')
}

export default { index }
