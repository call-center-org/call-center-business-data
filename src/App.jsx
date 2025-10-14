import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import CallStatistics from './components/CallStatistics'
import Analytics from './components/Analytics'

function App() {
  const [activeTab, setActiveTab] = useState('statistics')
  const [agentData, setAgentData] = useState([])

  const handleDataUpdate = (newData) => {
    setAgentData(prevData => [...prevData, ...newData])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'statistics' && (
          <CallStatistics />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard agentData={agentData} />
        )}
        {activeTab === 'analytics' && (
          <Analytics agentData={agentData} />
        )}
      </main>
    </div>
  )
}

export default App
