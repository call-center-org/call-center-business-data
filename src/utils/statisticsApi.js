import apiClient from './apiClient'
import { API_CONFIG } from './apiConfig'

/**
 * 获取单日统计数据
 * @param {string} date - 日期，格式：YYYY-MM-DD
 * @returns {Promise} 统计数据
 */
export async function getDailyStatistics(date) {
  try {
    console.log(`📊 获取${date}的统计数据...`)
    
    const requestBody = {
      start_time: date,
      end_time: date,
      query_type: 1  // 账号维度
    }
    
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.getStatistics, requestBody)
    
    if (response.code === 200 && response.data) {
      const total = response.data.total || {}
      const content = response.data.content || []
      
      const calloutNumber = total.callout_number || 0
      const calledNumber = total.called_number || 0
      const successNumber = total.success_number || 0
      
      const connectedRate = calloutNumber > 0 
        ? ((calledNumber / calloutNumber) * 100).toFixed(2)
        : '0.00'
      
      const successRate = calledNumber > 0
        ? ((successNumber / calledNumber) * 100).toFixed(2)
        : '0.00'
      
      // 统计坐席数量：排除指定账号，且外呼数>0的账号
      const excludedAccounts = ['淮安助理', '江苏职场', '总计', '平均']
      const activeSeats = content.filter(account => {
        const username = account.username || ''
        const calloutNum = account.callout_number || 0
        // 有外呼数 且 不在排除列表中
        return calloutNum > 0 && !excludedAccounts.includes(username)
      }).length
      
      console.log(`✅ ${date} 统计:`, {
        calloutNumber,
        calledNumber,
        successNumber,
        activeSeats,
        connectedRate: connectedRate + '%',
        successRate: successRate + '%'
      })
      
      return {
        date,
        calloutNumber,
        calledNumber,
        successNumber,
        activeSeats,  // 坐席数量
        connectedRate,
        successRate
      }
    } else {
      throw new Error(response.message || '获取统计数据失败')
    }
  } catch (error) {
    console.error(`❌ 获取${date}统计失败:`, error)
    throw error
  }
}

/**
 * 获取指定月份的外呼统计信息
 * @param {string} month - 月份（格式：YYYY-MM）
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise} - 统计数据
 */
export async function getMonthlyStatistics(month, onProgress = null) {
  try {
    // 解析月份
    const [year, monthNum] = month.split('-').map(Number)
    
    // 计算该月的第一天和最后一天
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0) // 0表示上个月的最后一天，即当月最后一天
    
    // 格式化为 YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    const startDateStr = formatDate(startDate)
    const endDateStr = formatDate(endDate)
    
    console.log(`📅 获取${month}月统计数据: ${startDateStr} 到 ${endDateStr}`)
    
    // 计算总天数
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    
    // 初始化所有日期的统计数据
    const statsByDate = {}
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d)
      statsByDate[dateStr] = {
        date: dateStr,
        totalCalls: 0,
        connectedCalls: 0,
        successCalls: 0,
        connectedRate: '0.0',
        successRate: '0.0',
      }
    }
    
    // 按天请求统计数据
    let processedDays = 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d)
      
      const requestBody = {
        start_time: dateStr,
        end_time: dateStr,
        query_type: 1 // 1=账号维度
      }
      
      console.log(`📋 请求 ${dateStr} 的统计数据`)
      
      try {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.getStatistics, requestBody)
        
        if (response.code === 200 && response.data) {
          const total = response.data.total || {}
          
          // 外呼数量
          const calloutNumber = total.callout_number || 0
          // 接通数量（已接通）
          const calledNumber = total.called_number || 0
          // 成功单数量
          const successNumber = total.success_number || 0
          
          // 计算接通率
          const connectedRate = calloutNumber > 0 
            ? ((calledNumber / calloutNumber) * 100).toFixed(2)
            : '0.00'
          
          // 计算成功率（相对于接通数）
          const successRate = calledNumber > 0
            ? ((successNumber / calledNumber) * 100).toFixed(2)
            : '0.00'
          
          statsByDate[dateStr] = {
            date: dateStr,
            totalCalls: calloutNumber,
            connectedCalls: calledNumber,
            successCalls: successNumber,
            connectedRate: connectedRate,
            successRate: successRate,
          }
          
          console.log(`✅ ${dateStr}: 外呼=${calloutNumber}, 接通=${calledNumber}, 成功=${successNumber}`)
        } else {
          console.warn(`⚠️ ${dateStr} 统计数据获取失败:`, response)
        }
      } catch (error) {
        console.error(`❌ ${dateStr} 统计数据请求失败:`, error)
      }
      
      processedDays++
      
      // 通知进度
      if (onProgress) {
        onProgress({
          page: processedDays,
          current: processedDays,
          total: totalDays
        })
      }
    }
    
    // 转换为数组并排序
    const statistics = Object.values(statsByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
    
    // 计算总计
    const totalCalls = statistics.reduce((sum, stat) => sum + stat.totalCalls, 0)
    const totalConnected = statistics.reduce((sum, stat) => sum + stat.connectedCalls, 0)
    const totalSuccess = statistics.reduce((sum, stat) => sum + stat.successCalls, 0)
    
    const summary = {
      month: month,
      totalDays: totalDays,
      totalCalls: totalCalls,
      totalConnected: totalConnected,
      connectedRate: totalCalls > 0 
        ? ((totalConnected / totalCalls) * 100).toFixed(2)
        : '0.00',
      totalSuccess: totalSuccess,
      successRate: totalConnected > 0
        ? ((totalSuccess / totalConnected) * 100).toFixed(2)
        : '0.00',
      avgCallsPerDay: Math.round(totalCalls / totalDays),
      dailyStats: statistics,
    }
    
    console.log('📊 外呼统计汇总:', summary)
    
    return summary
  } catch (error) {
    console.error('获取外呼统计失败:', error)
    throw error
  }
}

/**
 * 获取按意向度分类的统计数据
 * @param {string} date - 日期，格式：YYYY-MM-DD
 * @returns {Promise} 意向度统计数据
 */
export async function getGradeStatistics(date) {
  try {
    console.log(`📊 获取${date}的意向度统计数据...`)
    
    // 调用后端API，添加10秒超时
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'
    
    // 创建超时 Promise（20秒，考虑生产环境网络延迟）
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('请求超时（20秒）')), 20000)
    )
    
    // 创建 fetch Promise
    const fetchPromise = fetch(`${backendUrl}/api/stats/grade-stats?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Token认证会由后端自动处理
      }
    })
    
    // 使用 Promise.race 实现超时
    const response = await Promise.race([fetchPromise, timeoutPromise])
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success && result.data) {
      console.log(`✅ ${date} 意向度统计:`, result.data)
      return result.data
    } else {
      throw new Error(result.error || '获取意向度统计失败')
    }
  } catch (error) {
    console.error(`❌ 获取${date}意向度统计失败:`, error)
    throw error
  }
}

/**
 * 获取月度意向度统计数据（累计所有日期）
 * @param {string} month - 月份，格式：YYYY-MM
 * @returns {Promise} 月度意向度统计数据
 */
export async function getMonthlyGradeStatistics(month) {
  try {
    console.log(`📊 获取${month}月的意向度统计数据...`)
    
    // 解析月份，获取该月的所有日期
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)
    
    const formatDate = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    let totalGrade9 = 0
    let totalGrade1 = 0
    let totalSuccess = 0
    
    // 获取每一天的意向度数据并累加
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d)
      
      try {
        const dayGradeStats = await getGradeStatistics(dateStr)
        totalGrade9 += dayGradeStats.grade_9 || 0
        totalGrade1 += dayGradeStats.grade_1 || 0
        totalSuccess += dayGradeStats.total_success || 0
      } catch (err) {
        console.warn(`跳过 ${dateStr} 的意向度统计:`, err.message)
      }
    }
    
    console.log(`✅ ${month}月意向度统计:`, { totalGrade9, totalGrade1, totalSuccess })
    
    return {
      month,
      grade_9: totalGrade9,
      grade_1: totalGrade1,
      total_success: totalSuccess
    }
  } catch (error) {
    console.error(`❌ 获取${month}月意向度统计失败:`, error)
    throw error
  }
}

