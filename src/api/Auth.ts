import request from '../utils/request'

export interface AuthResponse {
  [key: string]: unknown
}

export function login (): Promise<AuthResponse> {
  return request.get<AuthResponse>('/api/index/index', {
    member_id: 1,
    bigVersion: 'v3',
    version: '3.1.1.8',
    scene: 1001
  })
}

export default { login }
