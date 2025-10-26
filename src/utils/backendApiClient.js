/**
 * 后端 API 客户端
 * 调用我们自己的 Flask 后端，而不是直接调用冠客 API
 */
import axios from 'axios'

// 后端 API 基础 URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'

// 创建 axios 实例
const backendApiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器：自动添加 JWT Token
backendApiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 JWT Token
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log('📤 后端API请求:', config.method.toUpperCase(), config.url, config.params || config.data)
    return config
  },
  (error) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器：处理错误
backendApiClient.interceptors.response.use(
  (response) => {
    console.log('📥 后端API响应:', response.config.url, response.data)
    return response.data
  },
  (error) => {
    console.error('❌ 响应错误:', error.response?.data || error.message)
    
    // 处理 401 未授权
    if (error.response?.status === 401) {
      console.error('❌ Token 无效或已过期，请重新登录')
      localStorage.removeItem('auth_token')
      // TODO: 跳转到登录页
    }
    
    return Promise.reject(error)
  }
)

/**
 * 设置 JWT Token
 */
export function setAuthToken(token) {
  localStorage.setItem('auth_token', token)
}

/**
 * 获取 JWT Token
 */
export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

/**
 * 清除 Token
 */
export function clearAuthToken() {
  localStorage.removeItem('auth_token')
}

export default backendApiClient

































