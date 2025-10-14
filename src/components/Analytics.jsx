import { BarChart3, TrendingUp, Users, Phone } from 'lucide-react'

function Analytics({ agentData }) {
  const performanceData = [
    { name: '张小明', calls: 25, success: 18, rate: 72 },
    { name: '李小红', calls: 18, success: 12, rate: 67 },
    { name: '王大力', calls: 32, success: 24, rate: 75 },
    { name: '赵小美', calls: 28, success: 20, rate: 71 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">坐席绩效排行</h3>
          <div className="space-y-3">
            {performanceData.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-500">{agent.calls} 通电话</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{agent.success} 成功</p>
                  <p className="text-sm text-green-600">{agent.rate}% 成功率</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">数据统计</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">总通话数</span>
              </div>
              <span className="text-xl font-bold text-blue-600">1,247</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">成功率</span>
              </div>
              <span className="text-xl font-bold text-green-600">71.2%</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">活跃坐席</span>
              </div>
              <span className="text-xl font-bold text-purple-600">12</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">趋势分析</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">图表功能开发中...</p>
          <p className="text-sm text-gray-400 mt-2">将支持实时数据可视化</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">通话质量</h4>
          <p className="text-2xl font-bold text-blue-600">4.8/5</p>
          <p className="text-sm text-gray-500">平均评分</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">转化率</h4>
          <p className="text-2xl font-bold text-green-600">15.3%</p>
          <p className="text-sm text-gray-500">本月平均</p>
        </div>
        
        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">客户满意度</h4>
          <p className="text-2xl font-bold text-purple-600">92%</p>
          <p className="text-sm text-gray-500">好评率</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
