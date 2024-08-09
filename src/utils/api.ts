import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import type { PwListItem, GroupsItem, PasswordParams, CreatePassword, NoteListItem, CreateNote } from '@/types/api'

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
    console.log(data.code)
    if (+data.code !== 20000) {
      ElMessage({ message: data.msg, type: 'error' })
      return Promise.reject({ ...data, message: data.msg })
    } else {
      return Promise.resolve(data)
    }
  },
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      tokenExpired()
      ElMessage.error(error.response.data.msg)
    } else {
      error.response?.data?.msg && ElMessage.error(error.response.data.msg)
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

export function importNote(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance
    .post('note/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      return res.data
    })
}

export function getList(data: PasswordParams) {
  return axiosInstance
    .get<{ data: PwListItem[]; total: number }>('password/list', {
      params: {
        id: data.id,
        limit: 20,
        text: data.text,
        groupId: data.groupId,
      },
    })
    .then((res) => {
      return res.data
    })
}

export function getAuthConfig() {
  return axiosInstance.get('authConfig', { noAuthRequired: true }).then((res) => {
    return res.data
  })
}

export function getGroups() {
  return axiosInstance.get<GroupsItem[]>('password/groups').then((res) => {
    return res.data
  })
}

export function addPassword(data: CreatePassword) {
  return axiosInstance
    .post('password/add', data)
    .then((res) => {
      return res.data
    })
}

export function getPasswdText(id: string) {
  return axiosInstance
    .get('password/find', {
      params: {
        id,
      },
    })
    .then((res) => {
      return res.data as string
    })
}

function allToString<T extends object>(data: T): {
  [key in keyof T]?: string
} {
  const dataCopy = {} as { [key in keyof T]?: string }
  (Object.keys(data) as Array<keyof T>).forEach((key: keyof T) => {
    if (Array.isArray(data[key])) {
      if (data && data[key] && data[key].length > 0)
        dataCopy[key] = data[key].join(',')
    } else {
      if (data[key] !== undefined && data[key] !== null)
        dataCopy[key] = String(data[key])
    }
  })
  return dataCopy
}

export function updatePassword(id: string, data: CreatePassword) {
  const dataCopy = allToString<CreatePassword>(data)
  return axiosInstance
    .put('password/update/' + id, dataCopy)
    .then((res) => {
      return {
        pId: res.data.pId,
        name: res.data.name,
        username: res.data.username,
      }
    })
}

export function deletePassword(id: string) {
  return axiosInstance
    .delete('password/delete/' + id)
    .then((res) => {
      return res.data
    })
}

export function signOut() {
  localStorage.removeItem('token')
}

export function getNotes(data: PasswordParams) {
  return axiosInstance
    .get<{ data: NoteListItem[]; total: number }>('note/list', {
      params: {
        id: data.id,
        limit: 20,
        text: data.text,
        groupId: data.groupId,
      },
    })
    .then((res) => {
      return res.data
    })
}

export function getNoteText(id: string) {
  return axiosInstance
    .get('note/find', {
      params: {
        id,
      },
    })
    .then((res) => {
      return res.data as string
    })
}

export function deleteNote(id: string) {
  return axiosInstance
    .delete('note/delete/' + id)
    .then((res) => {
      return res.data
    })
}

export function updateNote(id: string, data: CreateNote) {
  const dataCopy = allToString<CreateNote>(data)
  return axiosInstance
    .put('note/update/' + id, dataCopy)
    .then((res) => {
      return res.data
    })
}

export function addNote(data: CreateNote) {
  return axiosInstance
    .post('note/add', data)
    .then((res) => {
      return res.data
    })
}