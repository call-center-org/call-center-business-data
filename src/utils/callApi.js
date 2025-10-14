import apiClient from './apiClient'
import { API_CONFIG, FIELD_MAPPING } from './apiConfig'

/**
 * 获取近N天的呼出记录
 * @param {number} days - 天数（默认3天）
 * @returns {Promise} - 呼出记录数据
 */
export async function getRecentCalls(days = 3, onProgress = null) {
  try {
    // 计算日期范围
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // 设置时间为当天的开始和结束
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)
    
    // 格式化为 YYYY-MM-DD HH:mm:ss
    const formatDateTime = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
    
    const startTimeStr = formatDateTime(startDate)
    const endTimeStr = formatDateTime(endDate)
    
    console.log(`📅 获取时间范围: ${startTimeStr} 到 ${endTimeStr}`)
    
    // 分页获取所有数据
    let allCalls = []
    let currentPage = 1
    let totalCount = 0
    const pageSize = 1000 // 每页最多1000条
    
    while (true) {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        startTime: startTimeStr,
        endTime: endTimeStr,
      }
      
      console.log(`📋 请求第 ${currentPage} 页，每页 ${pageSize} 条`)
      
      // 发送API请求
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.getOutboundCalls, {
        params
      })
      
      if (response.code === 200) {
        if (response.data && response.data.data) {
          const pageData = response.data.data
          totalCount = response.data.totalCount || 0
          
          allCalls = allCalls.concat(pageData)
          
          console.log(`✅ 第 ${currentPage} 页获取 ${pageData.length} 条记录 (已获取: ${allCalls.length}/${totalCount})`)
          
          // 通知进度
          if (onProgress) {
            onProgress({
              page: currentPage,
              current: allCalls.length,
              total: totalCount
            })
          }
          
          // 如果已经获取了所有数据，或者当前页没有数据，则停止
          if (pageData.length === 0 || allCalls.length >= totalCount) {
            break
          }
          
          currentPage++
        } else {
          console.warn('⚠️ 响应成功但data为空:', response)
          break
        }
      } else {
        console.error('❌ API返回错误:', response.message || '未知错误')
        throw new Error(response.message || 'API请求失败')
      }
    }
    
    console.log(`🎉 总共获取 ${allCalls.length} 条话单记录 (API返回总计: ${totalCount})`)
    if (allCalls.length > 0) {
      console.log('📝 第一条记录示例:', allCalls[0])
      console.log('📝 记录字段:', Object.keys(allCalls[0]))
      
      // 统计isCall字段
      const isCallCount = allCalls.filter(c => c.isCall === 1).length
      const notCallCount = allCalls.filter(c => c.isCall === 0 || !c.isCall).length
      console.log(`📊 isCall=1 (已呼叫): ${isCallCount}`)
      console.log(`📊 isCall=0 (未呼叫): ${notCallCount}`)
      
      // 统计duration>0的记录
      const connectedCount = allCalls.filter(c => (c.duration || 0) > 0).length
      console.log(`📊 duration>0 (接通): ${connectedCount}`)
    }
    
    return allCalls
  } catch (error) {
    console.error('获取呼出记录失败:', error)
    throw error
  }
}

/**
 * 统计近N天的呼出数量
 * @param {number} days - 天数（默认3天）
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise} - 统计数据
 */
export async function getCallStatistics(days = 3, onProgress = null) {
  try {
    const calls = await getRecentCalls(days, onProgress)
    
    // 按日期统计
    const statsByDate = {}
    
    // 初始化所有日期（确保没有数据的日期也显示）
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      statsByDate[dateStr] = {
        date: dateStr,
        totalCalls: 0,
        connectedCalls: 0,
        successCalls: 0,
        totalDuration: 0,
        gradeStats: {},
      }
    }
    
    // 统计每条记录
    calls.forEach(call => {
      // 时间戳转换为日期
      const timestamp = call[FIELD_MAPPING.callTime]
      const date = new Date(timestamp * 1000)
      const callDate = date.toISOString().split('T')[0]
      
      if (!statsByDate[callDate]) {
        statsByDate[callDate] = {
          date: callDate,
          totalCalls: 0,
          connectedCalls: 0,
          successCalls: 0,
          totalDuration: 0,
          gradeStats: {},
        }
      }
      
      // 外呼数量：只统计isCall=1的记录（已呼叫的）
      const isCall = call[FIELD_MAPPING.isCall]
      if (isCall === 1) {
        statsByDate[callDate].totalCalls++
      }
      
      statsByDate[callDate].totalDuration += call[FIELD_MAPPING.duration] || 0
      
      // 根据意向度/评级统计
      const grade = call[FIELD_MAPPING.grade] || '未知'
      if (!statsByDate[callDate].gradeStats[grade]) {
        statsByDate[callDate].gradeStats[grade] = 0
      }
      statsByDate[callDate].gradeStats[grade]++
      
      // 接通数量：通话时长>0的记录
      const duration = call[FIELD_MAPPING.duration] || 0
      if (duration > 0) {
        statsByDate[callDate].connectedCalls++
      }
      
      // 成功单：根据意向度判断（不包含失败相关的评级）
      // 排除：邀约失败、F-直接挂机、未接通等失败评级
      const failGrades = ['邀约失败', 'F-直接挂机', '未接通', '空号', '关机', '停机', '无人接听', '拒接']
      const isSuccess = duration > 0 && !failGrades.some(fg => grade.includes(fg))
      if (isSuccess) {
        statsByDate[callDate].successCalls++
      }
    })
    
    // 计算每日的接通率和成功率
    Object.values(statsByDate).forEach(stat => {
      stat.connectedRate = stat.totalCalls > 0 
        ? ((stat.connectedCalls / stat.totalCalls) * 100).toFixed(1)
        : '0.0'
      stat.successRate = stat.totalCalls > 0
        ? ((stat.successCalls / stat.totalCalls) * 100).toFixed(1)
        : '0.0'
    })
    
    // 转换为数组并排序
    const statistics = Object.values(statsByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    )
    
    // 计算总计
    const totalConnected = statistics.reduce((sum, stat) => sum + stat.connectedCalls, 0)
    const totalSuccess = statistics.reduce((sum, stat) => sum + stat.successCalls, 0)
    
    const summary = {
      totalDays: days,
      totalCalls: calls.length,
      totalConnected: totalConnected,
      connectedRate: calls.length > 0 
        ? ((totalConnected / calls.length) * 100).toFixed(1)
        : '0.0',
      totalSuccess: totalSuccess,
      successRate: calls.length > 0
        ? ((totalSuccess / calls.length) * 100).toFixed(1)
        : '0.0',
      avgCallsPerDay: Math.round(calls.length / days),
      dailyStats: statistics,
    }
    
    console.log('📊 呼出统计:', summary)
    
    return summary
  } catch (error) {
    console.error('统计呼出数据失败:', error)
    throw error
  }
}

/**
 * 测试API连接
 * @returns {Promise<boolean>} - 连接是否成功
 */
export async function testApiConnection() {
  try {
    console.log('测试API连接...')
    const calls = await getRecentCalls(1)
    console.log('✅ API连接成功！获取到', calls.length, '条记录')
    return true
  } catch (error) {
    console.error('❌ API连接失败:', error.message)
    return false
  }
}
