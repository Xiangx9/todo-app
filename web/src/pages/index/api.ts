import { request } from '@/api/axios'

// 获取任务列表
export const getTasks = (params:any) => {
  return request('/api/tasks/', params, 'get')
}

// 新增任务
export const postTasks = (params:any) => {
  return request('/api/tasks/', params, 'post')
}

// 删除任务
export const deleteTasks = (id:string) => {
  return request(`/api/tasks/${id}`, {}, 'delete')
}

//更新任务
export const putTasks = ( params:any) => {
  return request(`/api/tasks/${params.id}`, params, 'put')
}

//标记任务完成
export const completedTasks = (id:string) => {
  return request(`/api/tasks/completed/${id}`, {},'put')
}