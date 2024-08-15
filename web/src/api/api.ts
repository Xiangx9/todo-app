import { request } from './axios'
export class Logins {       // 登录模块
    static async register(params: object) {
        return request('/api/users/register', params, 'post')
    }
    static async login(params: object) {
        return request('/api/users/login', params, 'post')
    }
}

export class landRelevant {     // 模块二
    static async landList(params: object) {
        return request('', params, 'get')
    }
}