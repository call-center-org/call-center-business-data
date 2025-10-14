import axios from 'axios'
import { API_CONFIG } from './apiConfig'

/**
 * Token管理器
 */
class TokenManager {
  constructor() {
    this.token = API_CONFIG.AUTH.token || localStorage.getItem('api_token')
    this.tokenExpiry = localStorage.getItem('token_expiry')
  }

  /**
   * 通过用户名密码获取Token
   */
  async getTokenByPassword(username, password) {
    try {
      // axios会自动进行URL编码，不需要手动encodeURIComponent
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.getToken}`, {
        params: {
          username: username,
          password: password
        }
      })

      if (response.data.code === 200) {
        this.setToken(response.data.data.token)
        console.log('✅ Token获取成功')
        return response.data.data.token
      } else {
        throw new Error(response.data.message || 'Token获取失败')
      }
    } catch (error) {
      console.error('❌ Token获取失败:', error.message)
      throw error
    }
  }

  /**
   * 通过密钥获取Token
   */
  async getTokenBySecret(secret) {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.getTokenBySecret}`, {
        params: { secret }
      })

      if (response.data.code === 200) {
        this.setToken(response.data.data.token)
        console.log('✅ Token获取成功（密钥方式）')
        return response.data.data.token
      } else {
        throw new Error(response.data.message || 'Token获取失败')
      }
    } catch (error) {
      console.error('❌ Token获取失败:', error.message)
      throw error
    }
  }

  /**
   * 保存Token
   */
  setToken(token) {
    this.token = token
    // Token默认有效期30天
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000
    this.tokenExpiry = expiry
    
    // 保存到localStorage
    localStorage.setItem('api_token', token)
    localStorage.setItem('token_expiry', expiry.toString())
    
    // 更新API配置
    API_CONFIG.AUTH.token = token
  }

  /**
   * 获取Token
   */
  getToken() {
    return this.token
  }

  /**
   * 检查Token是否过期
   */
  isTokenExpired() {
    if (!this.token || !this.tokenExpiry) {
      return true
    }
    return Date.now() > parseInt(this.tokenExpiry)
  }

  /**
   * 清除Token
   */
  clearToken() {
    this.token = null
    this.tokenExpiry = null
    localStorage.removeItem('api_token')
    localStorage.removeItem('token_expiry')
  }

  /**
   * 自动获取Token
   */
  async ensureToken() {
    // 如果Token存在且未过期，直接返回
    if (this.token && !this.isTokenExpired()) {
      return this.token
    }

    // 尝试使用配置的凭证获取Token
    const { username, password, secret } = API_CONFIG.CREDENTIALS

    if (secret) {
      return await this.getTokenBySecret(secret)
    } else if (username && password) {
      return await this.getTokenByPassword(username, password)
    } else {
      throw new Error('未配置API凭证，请在 apiConfig.js 中配置 username/password 或 secret')
    }
  }
}

// 导出单例
export default new TokenManager()
