import { request } from '@/api/axios'

export const post = (params:any) => {
  return request('/api/post', params, 'post')
}