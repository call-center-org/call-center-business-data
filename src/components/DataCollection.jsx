import { useState } from 'react'
import { Upload, FileText, Download, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

function DataCollection({ onDataUpdate }) {
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionStatus, setCollectionStatus] = useState('idle')

  const handleStartCollection = async () => {
    setIsCollecting(true)
    setCollectionStatus('collecting')
    
    try {
      // 模拟数据采集过程
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // 模拟采集到的数据
      const mockData = [
        {
          id: Date.now() + 1,
          name: '张小明',
          phone: '138****1234',
          status: '在线',
          todayCalls: 25,
          totalCalls: 1250,
          successRate: '72%',
          lastCall: '2分钟前'
        },
        {
          id: Date.now() + 2,
          name: '李小红',
          phone: '139****5678',
          status: '通话中',
          todayCalls: 18,
          totalCalls: 980,
          successRate: '68%',
          lastCall: '正在通话'
        }
      ]
      
      onDataUpdate(mockData)
      setCollectionStatus('completed')
      toast.success('数据采集完成！')
    } catch (error) {
      setCollectionStatus('error')
      toast.error('数据采集失败，请重试')
    } finally {
      setIsCollecting(false)
    }
  }

  const handleExportData = () => {
    toast.success('数据导出功能开发中...')
  }

  const handleRefreshData = () => {
    toast.success('数据刷新功能开发中...')
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">数据采集</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleStartCollection}
            disabled={isCollecting}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            {isCollecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {isCollecting ? '采集中...' : '开始采集'}
          </button>
          
          <button
            onClick={handleExportData}
            className="btn-secondary flex items-center gap-2 justify-center"
          >
            <Download className="w-4 h-4" />
            导出数据
          </button>
          
          <button
            onClick={handleRefreshData}
            className="btn-secondary flex items-center gap-2 justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            刷新数据
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">采集状态</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              collectionStatus === 'completed' ? 'bg-green-500' :
              collectionStatus === 'collecting' ? 'bg-yellow-500 animate-pulse' :
              collectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {collectionStatus === 'completed' ? '采集完成' :
               collectionStatus === 'collecting' ? '正在采集数据...' :
               collectionStatus === 'error' ? '采集失败' : '等待开始'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">数据源配置</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              数据源类型
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>API接口</option>
              <option>数据库连接</option>
              <option>文件导入</option>
              <option>实时监控</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              采集频率
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>实时采集</option>
              <option>每5分钟</option>
              <option>每15分钟</option>
              <option>每小时</option>
              <option>每天</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataCollection
