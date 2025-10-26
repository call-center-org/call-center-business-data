/**
 * 后端 API 接口
 * 封装所有与后端的交互
 */
import backendApiClient from './backendApiClient'

/**
 * 获取外呼数据概览
 * @param {number} days - 统计天数（默认 3 天）
 * @returns {Promise} - 概览数据
 */
export async function getCallSummary(days = 3) {
  try {
    console.log(`📊 获取近 ${days} 天的外呼数据概览`)
    
    const response = await backendApiClient.get('/api/calls/summary', {
      params: { days }
    })
    
    if (response.success) {
      console.log('✅ 数据获取成功:', response.data)
      return response.data
    } else {
      throw new Error(response.error || '获取数据失败')
    }
  } catch (error) {
    console.error('❌ 获取外呼概览失败:', error.message)
    throw error
  }
}

/**
 * 获取每日明细数据
 * @param {string} startDate - 开始日期（YYYY-MM-DD）
 * @param {string} endDate - 结束日期（YYYY-MM-DD）
 * @returns {Promise} - 每日明细数据
 */
export async function getDailyStats(startDate, endDate) {
  try {
    console.log(`📅 获取每日明细: ${startDate} 到 ${endDate}`)
    
    const response = await backendApiClient.get('/api/calls/daily', {
      params: { start_date: startDate, end_date: endDate }
    })
    
    if (response.success) {
      console.log('✅ 每日明细获取成功')
      return response.data
    } else {
      throw new Error(response.error || '获取每日明细失败')
    }
  } catch (error) {
    console.error('❌ 获取每日明细失败:', error.message)
    throw error
  }
}

/**
 * 手动同步数据
 * @param {number} days - 同步最近 N 天的数据（默认 1 天）
 * @returns {Promise} - 同步结果
 */
export async function syncData(days = 1) {
  try {
    console.log(`🔄 同步最近 ${days} 天的数据...`)
    
    const response = await backendApiClient.post('/api/calls/sync', { days })
    
    if (response.success) {
      console.log('✅ 数据同步成功:', response.data)
      return response.data
    } else {
      throw new Error(response.error || '数据同步失败')
    }
  } catch (error) {
    console.error('❌ 数据同步失败:', error.message)
    throw error
  }
}

/**
 * 健康检查
 * @returns {Promise} - 健康状态
 */
export async function healthCheck() {
  try {
    const response = await backendApiClient.get('/api/health')
    console.log('✅ 后端健康检查通过:', response)
    return response
  } catch (error) {
    console.error('❌ 后端健康检查失败:', error.message)
    throw error
  }
}

/**
 * 获取统计数据概览
 * @returns {Promise} - 统计概览（昨日 + 本月）
 */
export async function getStatsOverview() {
  try {
    const response = await backendApiClient.get('/api/stats/overview')
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || '获取统计概览失败')
    }
  } catch (error) {
    console.error('❌ 获取统计概览失败:', error.message)
    throw error
  }
}

/**
 * 获取趋势数据
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise} - 趋势数据
 */
export async function getTrend(startDate, endDate) {
  try {
    const response = await backendApiClient.get('/api/stats/trend', {
      params: { start_date: startDate, end_date: endDate }
    })
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || '获取趋势数据失败')
    }
  } catch (error) {
    console.error('❌ 获取趋势数据失败:', error.message)
    throw error
  }
}

































