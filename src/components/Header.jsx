import { Phone, BarChart3 } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">外呼坐席数据统计</h1>
              <p className="text-sm text-gray-500">实时获取和展示外呼坐席统计数据</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
