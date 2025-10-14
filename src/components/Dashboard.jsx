import { Users, Phone, Clock, TrendingUp } from 'lucide-react'

function Dashboard({ agentData }) {
  const stats = [
    {
      title: '总坐席数',
      value: agentData.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '今日通话数',
      value: agentData.reduce((sum, agent) => sum + (agent.todayCalls || 0), 0),
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '平均通话时长',
      value: '4.2分钟',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '成功率',
      value: '68.5%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近坐席活动</h3>
          <div className="space-y-3">
            {agentData.slice(0, 5).map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{agent.name || `坐席 ${index + 1}`}</p>
                  <p className="text-sm text-gray-500">{agent.status || '在线'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{agent.todayCalls || 0} 通</p>
                  <p className="text-xs text-gray-500">今日通话</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">数据概览</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">数据完整性</span>
              <span className="font-medium text-green-600">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">数据更新频率</span>
              <span className="font-medium text-blue-600">实时</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">系统状态</span>
              <span className="font-medium text-green-600">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
