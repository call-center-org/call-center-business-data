import { Phone, BarChart3, Database, Settings } from 'lucide-react'

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'statistics', label: '呼出统计', icon: BarChart3 },
    { id: 'dashboard', label: '数据概览', icon: Database },
    { id: 'analytics', label: '数据分析', icon: BarChart3 },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">外呼坐席数据获取系统</h1>
              <p className="text-sm text-gray-500">智能获取和分析外呼坐席数据</p>
            </div>
          </div>
          
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
