import axios from 'axios';
import { message } from 'ant-design-vue';
import { showMessage } from "./status"; // 引入状态码文件
import { userState } from "@/store/user"; // 引入用户信息
interface UserValue {
  token: string;
  refreshToken?: string;
}
let { user } = userState();
let token = (user.value as UserValue).token || '';
let refreshTokens = (user.value as UserValue).refreshToken || '';

axios.defaults.baseURL = ""; // 设置默认接口地址

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // 传参方式表单
// axios.defaults.headers['Content-Type'] ='application/x-www-form-urlencoded',   // 传参方式表单
//  axios.defaults.headers['Content-Type'] = "multipart/form-data"; //图片上传

axios.defaults.headers.Authorization = `Bearer ${token}`; // 将新的token设置到

axios.defaults.timeout = 90000; // 设置接口超时时间

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    // 配置请求头
    if (config.url == "/api/goods/upload") {
      axios.defaults.headers['Content-Type'] = "multipart/form-data"; //图片上传
    }
    // console.log("config", config.headers);
    return config;
  },
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

//刷新token
// 是否正在刷新的标记
let isRefreshing = false
//重试队列
let requests: any[] = []
function refreshToken(params: any) {
  return axios.post("/api/user/refresh-token", params).then((res) => res.data);
}

//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做一些处理
    return response;
  },
  async (error) => {
    const { response } = error;
    const originalRequest = error.config;
    if (response) {
      if (response.status === 401) { // 401 token失效
        if (!isRefreshing) {
          isRefreshing = true
          // 发起刷新 token 的请求
          let params = {
            refreshToken: refreshTokens,
          }

          return refreshToken(params).then((res) => {
            console.log("res", res.token);
            // 储存token
            (user.value as UserValue).token = res.token;
            (user.value as UserValue).refreshToken = res.refreshToken;

            const newToken = res.token;
            originalRequest.headers.Authorization = `Bearer ${newToken}`; // 将新的token设置到请求头中
            // token 刷新后将数组的方法重新执行
            requests.forEach((cb) => {
              cb(newToken)
            })
            requests = [] // 重新请求完清空
            return axios.request(originalRequest);
          }).catch((err) => {
            // 回到登录页
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          // 正在刷新token，将请求存入队列
          return new Promise((resolve, reject) => {
            requests.push((token: any) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axios(originalRequest))
            })
          })
        }
      }
      showMessage(response.status); // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    } else {
      return Promise.reject(error);
    }
  }
);

// 封装 GET POST 请求并导出
export function request(url = "", params = {}, type = "POST") {
  //设置 url params type 的默认值
  return new Promise((resolve, reject) => {
    let promise: Promise<any>; // 定义一个promise对象
    if (type.toUpperCase() === "GET") {
      promise = axios({
        url,
        params,
      });
    } else if (type.toUpperCase() === "POST") {
      promise = axios({
        method: "POST",
        url,
        data: params,
      });
    } else if (type.toUpperCase() === "PUT") {
      promise = axios({
        method: "PUT",
        url,
        data: params,
      });
    } else if (type.toUpperCase() === "DELETE") {
      promise = axios({
        method: "delete",
        url,
        params,
      });
    }
    //处理返回
    promise.then((res) => {
      resolve(res);
      console.log("处理返回res", res);
    })
      .catch((err) => {
        reject(err);
        message.error(err.message);
        console.log("处理返回err", err);
      });
  });
}
