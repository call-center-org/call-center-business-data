import axios from 'axios'
import { API_CONFIG } from './apiConfig'
import tokenManager from './tokenManager'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
})

// 请求拦截器 - 添加认证信息
apiClient.interceptors.request.use(
  async (config) => {
    // 确保Token可用
    try {
      const token = await tokenManager.ensureToken()
      if (token) {
        config.headers.Authorization = token
      }
    } catch (error) {
      console.warn('Token获取失败，继续请求:', error.message)
    }
    
    console.log('📤 API请求:', config.method.toUpperCase(), config.url, config.params || config.data)
    return config
  },
  (error) => {
    console.error('❌ 请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API响应:', response.config.url, response.data)
    
    // 检查业务状态码
    if (response.data.code === 1000001) {
      console.error('❌ Token无效')
      tokenManager.clearToken()
    } else if (response.data.code === 1000002) {
      console.error('❌ Token过期')
      tokenManager.clearToken()
    }
    
    return response.data
  },
  (error) => {
    console.error('❌ 响应错误:', error.response?.data || error.message)
    
    // 处理HTTP状态码错误
    if (error.response?.status === 401) {
      console.error('认证失败，请检查API Token')
      tokenManager.clearToken()
    } else if (error.response?.status === 403) {
      console.error('权限不足')
    } else if (error.response?.status === 404) {
      console.error('接口不存在')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
