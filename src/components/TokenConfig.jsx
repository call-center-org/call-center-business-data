import { useState } from 'react'
import { Key, Lock, User, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import tokenManager from '../utils/tokenManager'
import { API_CONFIG } from '../utils/apiConfig'

function TokenConfig({ onTokenReady }) {
  const [authMethod, setAuthMethod] = useState('secret') // 'secret' or 'password'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secret, setSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenStatus, setTokenStatus] = useState(null) // 'success' or 'error'

  // 检查是否已有Token
  const existingToken = tokenManager.getToken()
  const [showConfig, setShowConfig] = useState(!existingToken || tokenManager.isTokenExpired())

  const handleGetToken = async () => {
    setLoading(true)
    setTokenStatus(null)

    try {
      let token
      if (authMethod === 'secret') {
        if (!secret) {
          toast.error('请输入密钥')
          setLoading(false)
          return
        }
        token = await tokenManager.getTokenBySecret(secret)
      } else {
        if (!username || !password) {
          toast.error('请输入用户名和密码')
          setLoading(false)
          return
        }
        token = await tokenManager.getTokenByPassword(username, password)
      }

      setTokenStatus('success')
      toast.success('Token获取成功！')
      
      // 保存到配置
      if (authMethod === 'secret') {
        API_CONFIG.CREDENTIALS.secret = secret
      } else {
        API_CONFIG.CREDENTIALS.username = username
        API_CONFIG.CREDENTIALS.password = password
      }

      // 通知父组件
      if (onTokenReady) {
        setTimeout(() => onTokenReady(token), 1000)
      }

      // 隐藏配置面板
      setTimeout(() => setShowConfig(false), 2000)
    } catch (error) {
      setTokenStatus('error')
      toast.error(`Token获取失败: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    tokenManager.clearToken()
    setShowConfig(true)
    setTokenStatus(null)
    toast.success('已清除Token')
  }

  if (!showConfig && existingToken && !tokenManager.isTokenExpired()) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">已认证</p>
              <p className="text-xs text-green-600">Token有效期至: {new Date(parseInt(tokenManager.tokenExpiry)).toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-green-600 hover:text-green-700 underline"
          >
            退出登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">API认证配置</h3>
          <p className="text-sm text-slate-500">首次使用需要配置API认证信息</p>
        </div>
      </div>

      {/* 认证方式选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">认证方式</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setAuthMethod('secret')}
            className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              authMethod === 'secret'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <Key className={`w-5 h-5 ${authMethod === 'secret' ? 'text-purple-600' : 'text-slate-400'}`} />
            <div className="text-left">
              <p className={`text-sm font-medium ${authMethod === 'secret' ? 'text-purple-900' : 'text-slate-700'}`}>
                密钥方式
              </p>
              <p className="text-xs text-slate-500">推荐使用</p>
            </div>
          </button>

          <button
            onClick={() => setAuthMethod('password')}
            className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              authMethod === 'password'
                ? 'border-purple-500 bg-purple-50'
                : 'border-slate-200 hover:border-purple-300'
            }`}
          >
            <Lock className={`w-5 h-5 ${authMethod === 'password' ? 'text-purple-600' : 'text-slate-400'}`} />
            <div className="text-left">
              <p className={`text-sm font-medium ${authMethod === 'password' ? 'text-purple-900' : 'text-slate-700'}`}>
                账号密码
              </p>
              <p className="text-xs text-slate-500">传统方式</p>
            </div>
          </button>
        </div>
      </div>

      {/* 密钥输入 */}
      {authMethod === 'secret' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            API密钥
          </label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="请输入您的API密钥"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-slate-500">
            💡 在平台中通过 "用户密钥生成" 接口获取密钥
          </p>
        </div>
      )}

      {/* 账号密码输入 */}
      {authMethod === 'password' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </>
      )}

      {/* 获取Token按钮 */}
      <button
        onClick={handleGetToken}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            获取Token中...
          </span>
        ) : (
          '获取Token'
        )}
      </button>

      {/* 状态提示 */}
      {tokenStatus === 'success' && (
        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Token获取成功！即将跳转...</p>
        </div>
      )}

      {tokenStatus === 'error' && (
        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <XCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Token获取失败，请检查凭证是否正确</p>
        </div>
      )}

      {/* 帮助信息 */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          📌 <strong>如何获取密钥？</strong><br />
          1. 登录外呼平台<br />
          2. 访问 "用户设置" → "API密钥"<br />
          3. 点击 "生成密钥" 并保存<br />
          <br />
          ⚠️ <strong>安全提示：</strong>密钥只显示一次，请妥善保管
        </p>
      </div>
    </div>
  )
}

export default TokenConfig
