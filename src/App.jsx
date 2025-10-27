import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import CallStatistics from './components/CallStatistics'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <CallStatistics />
      </main>
    </div>
  )
}

export default App
