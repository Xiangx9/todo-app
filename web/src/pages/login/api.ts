import { request } from '@/api/axios'

export const register = (params:any) => {
  return request('/api/user/register', params, 'post')
}

export const login = (params:any) => {
  return request('/api/user/login', params, 'post')
}

export const RefreshToken = (params:any) => {
  return request('/api/user/refresh-token', params, 'post')
}