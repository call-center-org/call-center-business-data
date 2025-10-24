import { useState, useEffect } from 'react'
import { Phone, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react'
import { testApiConnection } from '../utils/callApi'
import { getMonthlyStatistics, getDailyStatistics, getGradeStatistics, getMonthlyGradeStatistics } from '../utils/statisticsApi'
import { formatNumber } from '../utils/formatNumber'
import toast from 'react-hot-toast'
import tokenManager from '../utils/tokenManager'
import TokenConfig from './TokenConfig'

function CallStatistics() {
  // 获取当前月份
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }
  
  // 获取日期字符串
  const getDateString = (daysOffset = 0) => {
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 渲染接通率（整数部分大，小数部分小）
  const renderConnectedRate = (rate) => {
    const [integer, decimal] = rate.split('.')
    return (
      <span className="inline-flex items-baseline">
        <span className="text-3xl font-bold">{integer}</span>
        {decimal && (
          <>
            <span className="text-base font-bold">.{decimal}</span>
          </>
        )}
        <span className="text-base font-bold ml-0.5">%</span>
      </span>
    )
  }

  // 渲染成功率（如果是0.xx格式，0字号小）
  const renderSuccessRate = (rate) => {
    const [integer, decimal] = rate.split('.')
    return (
      <span className="inline-flex items-baseline">
        {integer === '0' ? (
          <span className="text-base font-bold">{integer}</span>
        ) : (
          <span className="text-3xl font-bold">{integer}</span>
        )}
        {decimal && (
          <>
            <span className="text-3xl font-bold">.{decimal}</span>
          </>
        )}
        <span className="text-3xl font-bold ml-0.5">%</span>
      </span>
    )
  }
  
  const [statistics, setStatistics] = useState(null)
  const [todayStats, setTodayStats] = useState(null)
  const [yesterdayStats, setYesterdayStats] = useState(null)
  const [todayGradeStats, setTodayGradeStats] = useState(null)
  const [yesterdayGradeStats, setYesterdayGradeStats] = useState(null)
  const [monthGradeStats, setMonthGradeStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth())
  const [tokenInitialized, setTokenInitialized] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0, page: 0 })
  const [lastRefreshTime, setLastRefreshTime] = useState(null)
  
  // 从localStorage加载保存的数据（只在首次挂载时）
  useEffect(() => {
    const saved = localStorage.getItem('monthlyStatistics')
    if (saved) {
      try {
        setStatistics(JSON.parse(saved))
      } catch (err) {
        console.error('加载缓存数据失败:', err)
      }
    }
  }, [])
  
  // 可选月份列表
  const availableMonths = [
    { value: '2025-08', label: '2025年8月' },
    { value: '2025-09', label: '2025年9月' },
    { value: '2025-10', label: '2025年10月' },
  ]

  // 月份变化时的处理
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }
  
  // 加载当日和昨日统计数据
  const loadDailyStats = async () => {
    try {
      const today = getDateString(0)
      const yesterday = getDateString(-1)
      
      console.log('🔄 加载当日和昨日数据...', { today, yesterday })
      
      // 同时加载汇总数据和意向度数据
      const [todayData, yesterdayData, todayGrade, yesterdayGrade] = await Promise.all([
        getDailyStatistics(today),
        getDailyStatistics(yesterday),
        getGradeStatistics(today).catch(err => {
          console.warn('获取今日意向度统计失败:', err)
          return { grade_9: 0, grade_1: 0, total_success: 0 }
        }),
        getGradeStatistics(yesterday).catch(err => {
          console.warn('获取昨日意向度统计失败:', err)
          return { grade_9: 0, grade_1: 0, total_success: 0 }
        })
      ])
      
      setTodayStats(todayData)
      setYesterdayStats(yesterdayData)
      setTodayGradeStats(todayGrade)
      setYesterdayGradeStats(yesterdayGrade)
      setLastRefreshTime(new Date())
      
      console.log('✅ 当日昨日数据加载完成')
    } catch (err) {
      console.error('❌ 加载当日昨日数据失败:', err)
      toast.error('加载当日昨日数据失败')
    }
  }
  
  // 加载月度统计数据
  const loadStatistics = async (month) => {
    setLoading(true)
    setError(null)
    setLoadingProgress({ current: 0, total: 0, page: 0 })
    
    try {
      // 同时加载月度汇总数据和意向度数据
      const [stats, gradeStats] = await Promise.all([
        getMonthlyStatistics(month, (progress) => {
          setLoadingProgress(progress)
        }),
        getMonthlyGradeStatistics(month).catch(err => {
          console.warn('获取月度意向度统计失败:', err)
          return { grade_9: 0, grade_1: 0, total_success: 0 }
        })
      ])
      
      setStatistics(stats)
      setMonthGradeStats(gradeStats)
      localStorage.setItem('monthlyStatistics', JSON.stringify(stats))
      toast.success(`成功加载${month}月数据，外呼总数：${formatNumber(stats.totalCalls)}`)
    } catch (err) {
      setError(err.message)
      toast.error('加载数据失败，请检查API配置')
    } finally {
      setLoading(false)
      setLoadingProgress({ current: 0, total: 0, page: 0 })
    }
  }
  
  // 自动初始化Token
  useEffect(() => {
    console.log('🚀 组件加载，开始初始化Token')
    const initToken = async () => {
      try {
        // 检查是否已有有效Token
        if (tokenManager.getToken() && !tokenManager.isTokenExpired()) {
          console.log('✅ Token已存在且有效')
          setTokenInitialized(true)
          return
        }

        // 自动获取Token
        console.log('🔄 自动获取Token中...')
        await tokenManager.ensureToken()
        setTokenInitialized(true)
        toast.success('✅ 认证成功！')
      } catch (error) {
        console.error('❌ Token初始化失败:', error)
        toast.error('Token获取失败: ' + error.message)
        setError('认证失败，请检查配置')
      }
    }

    initToken()
  }, [])
  
  // 当Token初始化完成时，加载当日昨日数据
  useEffect(() => {
    if (tokenInitialized) {
      loadDailyStats()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInitialized])
  
  // 每10分钟自动刷新当日昨日数据
  useEffect(() => {
    if (!tokenInitialized) return
    
    const interval = setInterval(() => {
      console.log('⏰ 10分钟自动刷新当日昨日数据')
      loadDailyStats()
    }, 10 * 60 * 1000) // 10分钟
    
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInitialized])
  
  // 当Token初始化完成且没有数据时，自动加载当前月份
  useEffect(() => {
    if (tokenInitialized && !statistics) {
      loadStatistics(selectedMonth)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenInitialized])
  
  // 当月份变化时，加载新月份的数据
  useEffect(() => {
    if (tokenInitialized && statistics) {
      loadStatistics(selectedMonth)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth])

  // 显示加载状态
  if (!tokenInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-700">正在初始化认证...</p>
          <p className="text-sm text-slate-500 mt-2">自动获取Token中</p>
        </div>
      </div>
    )
  }

  // 测试API连接
  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const isConnected = await testApiConnection()
      if (isConnected) {
        toast.success('API连接测试成功！')
      } else {
        toast.error('API连接测试失败')
      }
    } catch (err) {
      toast.error('连接测试失败: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">月度呼出统计</h2>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择月份
            </label>
            <select 
              value={selectedMonth}
              onChange={handleMonthChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {availableMonths.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => loadStatistics(selectedMonth)}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            {loading ? (
              loadingProgress.total > 0 
                ? `加载中... ${loadingProgress.current}/${loadingProgress.total}天`
                : '加载中...'
            ) : '刷新数据'}
          </button>
          
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="btn-secondary flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            测试连接
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">加载失败</p>
          </div>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <p className="text-sm text-red-600 mt-1">
            请检查 src/utils/apiConfig.js 中的API配置
          </p>
        </div>
      )}

      {/* 当日统计 */}
      {todayStats && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">当日数据</h3>
            {lastRefreshTime && (
              <span className="text-sm text-gray-500">
                最后更新: {lastRefreshTime.toLocaleTimeString('zh-CN')}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">外呼数量</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {formatNumber(todayStats.calloutNumber)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">今日</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">接通数量</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {formatNumber(todayStats.calledNumber)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {todayStats.connectedRate}% 接通率
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-600 font-medium">接通率</p>
                  <div className="text-cyan-900 mt-2">
                    {renderConnectedRate(todayStats.connectedRate)}
                  </div>
                  <p className="text-xs text-cyan-600 mt-1">今日</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-purple-600 font-medium">成功单</p>
                    {todayGradeStats && todayStats.successNumber !== (todayGradeStats.grade_9 + todayGradeStats.grade_1) && (
                      <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        偏差
                      </span>
                    )}
                  </div>
                  {todayGradeStats ? (
                    <div className="flex items-end gap-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(todayGradeStats.grade_9)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">9元</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(todayGradeStats.grade_1)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">1元</p>
                      </div>
                      <div className="text-center ml-auto">
                        <p className="text-3xl font-bold text-purple-700">{formatNumber(todayStats.successNumber)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">总计</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{formatNumber(todayStats.successNumber)}</p>
                      <p className="text-xs text-purple-600 mt-1">今日</p>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center ml-3">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-600 font-medium">成功率</p>
                  <div className="text-pink-900 mt-2">
                    {renderSuccessRate(todayStats.successRate)}
                  </div>
                  <p className="text-xs text-pink-600 mt-1">今日</p>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">坐席数量</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {todayStats.activeSeats || 0}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">有外呼数</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 昨日统计 */}
      {yesterdayStats && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">昨日数据</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">外呼数量</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {formatNumber(yesterdayStats.calloutNumber)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">昨日</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">接通数量</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {formatNumber(yesterdayStats.calledNumber)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {yesterdayStats.connectedRate}% 接通率
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-600 font-medium">接通率</p>
                  <div className="text-cyan-900 mt-2">
                    {renderConnectedRate(yesterdayStats.connectedRate)}
                  </div>
                  <p className="text-xs text-cyan-600 mt-1">昨日</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-purple-600 font-medium">成功单</p>
                    {yesterdayGradeStats && yesterdayStats.successNumber !== (yesterdayGradeStats.grade_9 + yesterdayGradeStats.grade_1) && (
                      <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        偏差
                      </span>
                    )}
                  </div>
                  {yesterdayGradeStats ? (
                    <div className="flex items-end gap-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(yesterdayGradeStats.grade_9)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">9元</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(yesterdayGradeStats.grade_1)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">1元</p>
                      </div>
                      <div className="text-center ml-auto">
                        <p className="text-3xl font-bold text-purple-700">{formatNumber(yesterdayStats.successNumber)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">总计</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{formatNumber(yesterdayStats.successNumber)}</p>
                      <p className="text-xs text-purple-600 mt-1">昨日</p>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center ml-3">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-600 font-medium">成功率</p>
                  <div className="text-pink-900 mt-2">
                    {renderSuccessRate(yesterdayStats.successRate)}
                  </div>
                  <p className="text-xs text-pink-600 mt-1">昨日</p>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">坐席数量</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {yesterdayStats.activeSeats || 0}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">有外呼数</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 月度统计概览 */}
      {statistics && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">本月数据汇总</h3>
            {/* 第一行：外呼数量、接通数量、接通率、成功单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. 外呼数量 */}
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">外呼数量</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {formatNumber(statistics.totalCalls)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">{statistics.month}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 2. 接通数量 */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">接通数量</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {formatNumber(statistics.totalConnected)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">本月总计</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 3. 接通率 */}
            <div className="card bg-gradient-to-br from-cyan-50 to-cyan-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-600 font-medium">接通率</p>
                  <p className="text-3xl font-bold text-cyan-900 mt-2">
                    {statistics.connectedRate}%
                  </p>
                  <p className="text-xs text-cyan-600 mt-1">本月平均</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 4. 成功单 */}
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-purple-600 font-medium">成功单</p>
                    {monthGradeStats && statistics.totalSuccess !== (monthGradeStats.grade_9 + monthGradeStats.grade_1) && (
                      <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        偏差
                      </span>
                    )}
                  </div>
                  {monthGradeStats ? (
                    <div className="flex items-end gap-3">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(monthGradeStats.grade_9)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">9元</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-900">{formatNumber(monthGradeStats.grade_1)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">1元</p>
                      </div>
                      <div className="text-center ml-auto">
                        <p className="text-3xl font-bold text-purple-700">{formatNumber(statistics.totalSuccess)}</p>
                        <p className="text-xs text-purple-600 mt-0.5">总计</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{formatNumber(statistics.totalSuccess)}</p>
                      <p className="text-xs text-purple-600 mt-1">本月总计</p>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center ml-3">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

            {/* 第二行：成功率、日均外呼、日均接通、日均成功单 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* 5. 成功率 */}
            <div className="card bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-600 font-medium">成功率</p>
                  <div className="text-pink-900 mt-2">
                    {renderSuccessRate(statistics.successRate)}
                  </div>
                  <p className="text-xs text-pink-600 mt-1">本月平均</p>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 6. 日均外呼 */}
            <div className="card bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">日均外呼</p>
                  <p className="text-3xl font-bold text-orange-900 mt-2">
                    {(() => {
                      // 只计算截止今天的工作日数量（外呼数>0 且 日期<=今天）
                      const today = new Date()
                      today.setHours(23, 59, 59, 999)
                      const workingDays = statistics.dailyStats.filter(day => {
                        const dayDate = new Date(day.date)
                        return dayDate <= today && day.totalCalls > 0
                      }).length
                      const avgCalls = workingDays > 0 ? Math.round(statistics.totalCalls / workingDays) : 0
                      return formatNumber(avgCalls)
                    })()}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">通/工作日</p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 7. 日均接通 */}
            <div className="card bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 font-medium">日均接通</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">
                    {(() => {
                      // 只计算截止今天的工作日数量（外呼数>0 且 日期<=今天）
                      const today = new Date()
                      today.setHours(23, 59, 59, 999)
                      const workingDays = statistics.dailyStats.filter(day => {
                        const dayDate = new Date(day.date)
                        return dayDate <= today && day.totalCalls > 0
                      }).length
                      const avgConnected = workingDays > 0 ? Math.round(statistics.totalConnected / workingDays) : 0
                      return formatNumber(avgConnected)
                    })()}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">通/工作日</p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* 8. 日均成功单 */}
            <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">日均成功单</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">
                    {(() => {
                      // 只计算截止今天的工作日数量（外呼数>0 且 日期<=今天）
                      const today = new Date()
                      today.setHours(23, 59, 59, 999)
                      const workingDays = statistics.dailyStats.filter(day => {
                        const dayDate = new Date(day.date)
                        return dayDate <= today && day.totalCalls > 0
                      }).length
                      const avgSuccess = workingDays > 0 ? Math.round(statistics.totalSuccess / workingDays) : 0
                      return formatNumber(avgSuccess)
                    })()}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">单/工作日</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* 每日明细 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">每日呼出明细</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      日期
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      外呼数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      接通数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      接通率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      成功单
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      成功率
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {statistics.dailyStats
                    .filter(day => {
                      // 只显示今天及之前的日期
                      const dayDate = new Date(day.date)
                      const today = new Date()
                      today.setHours(23, 59, 59, 999) // 设置为今天的结束时间
                      return dayDate <= today
                    })
                    .map((day, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(day.totalCalls)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {formatNumber(day.connectedCalls)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.connectedRate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {formatNumber(day.successCalls)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.successRate}%
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-slate-100 to-slate-50">
                  <tr className="border-t-2 border-slate-300">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      汇总
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {formatNumber(statistics.totalCalls)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                      {formatNumber(statistics.totalConnected)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {statistics.connectedRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                      {formatNumber(statistics.totalSuccess)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      {statistics.successRate}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 空状态 */}
      {!statistics && !loading && !error && (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
          <p className="text-gray-500 mb-4">请先配置API并点击"加载数据"</p>
          <button
            onClick={handleTestConnection}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            测试API连接
          </button>
        </div>
      )}
    </div>
  )
}

export default CallStatistics
