import { request } from '@/api/axios'

// 获取任务列表
export const getAllTasks = (params:any) => {
  return request('/api/tasks/AllTasks', params, 'get')
}

//获取项目
export const getProjects=()=>{
  return request('/api/projects/', {}, 'get')
}

//添加项目
export const postProjects=(params:any)=>{
  return request('/api/projects/', params, 'post')
}
//删除项目
export const deleteProjects=(id:string)=>{
  return request(`/api/projects/${id}`, {}, 'delete')
}
//更新项目
export const putProjects=(params:any)=>{
  return request(`/api/projects/${params.id}`, params, 'put')
}