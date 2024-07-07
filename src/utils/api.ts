import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

declare module 'axios' {
  export interface AxiosRequestConfig {
    noAuthRequired?: boolean
  }
}

const axiosInstance = axios.create({
  baseURL: '/api/', // url = base url + request url
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60 * 60 * 1000,
  // timeout: 30 * 1000
  // withCredentials: true, // send cookies when cross-domain requests
})
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axiosInstance.defaults.headers.get['Cache-Control'] = 'no-cache'
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (!config.noAuthRequired) {
      if (!token) {
        tokenExpired()
        throw new Error('No token found')
      }
      config.headers['Authorization'] = 'Bearer ' + token
    }
    config.headers['Accept-Language'] = 'zh-hans'
    return config
  },
  (error) => {
    console.error('Request error', error)
    return Promise.reject(error)
  },
)
axiosInstance.interceptors.response.use(
  (response) => {
    const { data, headers } = response
    if (headers['x-new-token']) {
      localStorage.setItem('token', headers['x-new-token'])
    }
    if (+data.code !== 20000) {
      ElMessage({ message: data.errorMsg, type: 'error' })
      return Promise.reject({ ...data, message: data.errorMsg })
    } else {
      return Promise.resolve(data)
    }
  },
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      tokenExpired()
    }
    return Promise.reject(error)
  },
)

function tokenExpired() {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

export function login(user: string, passwd: string) {
  return axiosInstance
    .post('login', { username: user, password: passwd }, { noAuthRequired: true })
    .then((res) => {
      localStorage.setItem('token', res.data.token)
    })
}

export function register(user: string, passwd: string) {
  return axiosInstance.post(
    'register',
    { username: user, password: passwd },
    { noAuthRequired: true },
  )
}

export function importPasswd(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance
    .post('password/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      return res.data
    })
}

export function getList() {
  return axiosInstance
    .get('password/list', {
      params: {
        page: 1,
        limit: 20,
      },
    })
    .then((res) => {
      return res.data
    })
}