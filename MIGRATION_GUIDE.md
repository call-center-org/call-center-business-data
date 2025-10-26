# 前后端分离架构迁移指南

> 从 MVP 静态页面迁移到前后端分离架构

---

## 📋 迁移概述

本次迁移将外呼数据系统从**纯前端静态页面**（直接调用冠客 API）升级为**前后端分离架构**（前端调用自己的后端，后端再调用冠客 API）。

### 迁移前 vs 迁移后

| 项目 | 迁移前（MVP） | 迁移后（v2.0） |
|------|-------------|-------------|
| 前端 | React + Vite | React + Vite（保持不变） |
| 后端 | ❌ 无 | ✅ Flask + SQLAlchemy |
| 数据库 | ❌ 无 | ✅ SQLite / PostgreSQL |
| 认证 | 冠客 Token | JWT Token（组织统一） |
| 数据存储 | localStorage | 数据库持久化 |
| API 调用 | 前端 → 冠客 API | 前端 → 后端 → 冠客 API |

---

## 🎯 迁移优势

1. **统一认证**：使用组织 JWT Token，与其他系统集成
2. **数据持久化**：外呼数据存储到数据库，支持历史查询
3. **性能优化**：后端缓存、批量处理
4. **安全性**：API 密钥存储在后端，前端不暴露敏感信息
5. **可扩展性**：支持定时任务、数据同步、复杂分析

---

## 🚀 迁移步骤

### 阶段 1：后端搭建（已完成 ✅）

#### 1.1 安装后端依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 1.2 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置冠客 API 密钥：

```env
FLASK_ENV=development
PORT=5001
GUANKE_API_SECRET=your-api-secret-here
```

#### 1.3 初始化数据库

```bash
python scripts/init_db.py
```

输出：
```
✅ 数据库表创建成功！
已创建的表：
- call_records (通话记录)
- daily_stats (每日统计)
```

#### 1.4 生成测试 Token

```bash
python scripts/generate_test_token.py
```

复制生成的 Token，稍后在前端测试时使用。

#### 1.5 启动后端服务

```bash
python run.py
```

访问 http://localhost:5001/api/health 验证后端是否启动成功。

---

### 阶段 2：前端迁移（进行中 🔄）

#### 2.1 创建环境变量文件

在**项目根目录**（与 `src` 平级）创建 `.env.development`：

```env
VITE_BACKEND_URL=http://localhost:5001
```

#### 2.2 使用新的 API 客户端

新的 API 客户端已创建：
- `src/utils/backendApiClient.js` - HTTP 客户端
- `src/utils/backendApi.js` - API 接口封装

**使用示例**：

```javascript
import { getCallSummary, syncData } from '../utils/backendApi'
import { setAuthToken } from '../utils/backendApiClient'

// 设置 JWT Token（从测试脚本获取）
setAuthToken('your-test-token-here')

// 获取近 3 天的数据
const summary = await getCallSummary(3)
console.log(summary)

// 同步数据
const result = await syncData(1)
console.log(result)
```

#### 2.3 修改组件（推荐方式）

**选项 A：创建新组件（推荐）**

创建 `src/components/CallStatisticsV2.jsx`，使用新的后端 API：

```javascript
import { useState, useEffect } from 'react'
import { getCallSummary, syncData } from '../utils/backendApi'
import { setAuthToken } from '../utils/backendApiClient'

function CallStatisticsV2() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // 设置 Token（生产环境从 ERP 系统获取）
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      setAuthToken(token)
    }
  }, [])
  
  // 加载数据
  const loadData = async (days = 3) => {
    setLoading(true)
    try {
      const data = await getCallSummary(days)
      setSummary(data)
    } catch (error) {
      console.error('加载失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      {/* UI 代码 */}
    </div>
  )
}
```

**选项 B：渐进式迁移（兼容旧代码）**

在现有组件中添加开关，支持新旧两种模式：

```javascript
const USE_NEW_API = import.meta.env.VITE_USE_NEW_API === 'true'

if (USE_NEW_API) {
  // 使用新的后端 API
  const data = await getCallSummary(days)
} else {
  // 使用旧的前端直连 API
  const data = await getRecentCalls(days)
}
```

---

### 阶段 3：数据同步

#### 3.1 首次数据同步

启动后端后，首次需要从冠客 API 同步历史数据：

```bash
# 后端已启动的情况下
curl -X POST http://localhost:5001/api/calls/sync \
  -H "Authorization: Bearer <your-test-token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

或在前端调用：

```javascript
import { syncData } from '../utils/backendApi'

// 同步最近 30 天的数据
await syncData(30)
```

#### 3.2 定时同步（可选）

后端支持定时任务，可每小时自动同步数据。

---

### 阶段 4：测试验证

#### 4.1 后端健康检查

```bash
curl http://localhost:5001/api/health
```

预期输出：
```json
{
  "status": "healthy",
  "service": "call-center-business-data",
  "timestamp": "2025-10-19T...",
  "version": "2.0.0"
}
```

#### 4.2 测试获取数据

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/calls/summary?days=3"
```

预期输出：
```json
{
  "success": true,
  "data": {
    "days": 3,
    "total_calls": 1500,
    "success_calls": 750,
    "success_rate": 0.5,
    "daily_breakdown": [...]
  }
}
```

#### 4.3 前后端联调

1. 启动后端：`cd backend && python run.py`
2. 启动前端：`npm run dev`
3. 在浏览器打开 http://localhost:3001
4. 查看控制台是否有 API 请求日志

---

## 📝 配置清单

### 后端配置

| 文件 | 位置 | 说明 |
|------|------|------|
| `.env` | `backend/.env` | 环境变量（不提交到 Git） |
| `config.py` | `backend/app/config.py` | Flask 配置 |
| `requirements.txt` | `backend/requirements.txt` | Python 依赖 |

### 前端配置

| 文件 | 位置 | 说明 |
|------|------|------|
| `.env.development` | 项目根目录 | 开发环境变量 |
| `backendApiClient.js` | `src/utils/` | 后端 API 客户端 |
| `backendApi.js` | `src/utils/` | API 接口封装 |

---

## ⚠️ 注意事项

### 1. Token 管理

**开发环境**：
- 使用 `scripts/generate_test_token.py` 生成测试 Token
- 手动设置：`localStorage.setItem('auth_token', 'your-token')`

**生产环境**：
- Token 由 ERP 系统统一生成和管理
- 前端从 ERP 登录后获取 Token

### 2. 数据迁移

- 历史数据需要通过 `/api/calls/sync` 接口同步
- 建议首次同步 30 天数据
- 后续可定期同步（如每小时）

### 3. CORS 配置

后端已配置 CORS，允许以下域名：
- `http://localhost:3001`
- `http://127.0.0.1:3001`
- CloudBase 生产域名

如需添加其他域名，修改 `backend/app/__init__.py`。

### 4. 数据库选择

- **开发环境**：使用 SQLite（无需额外配置）
- **生产环境**：推荐使用 PostgreSQL

---

## 🐛 常见问题

### Q1: 后端启动失败？

**检查项**：
1. Python 虚拟环境是否激活？
2. 依赖是否全部安装？`pip install -r requirements.txt`
3. `.env` 文件是否配置？

### Q2: 前端请求 401 错误？

**原因**：JWT Token 无效或未设置

**解决**：
```javascript
// 设置 Token
import { setAuthToken } from '../utils/backendApiClient'
setAuthToken('your-test-token')
```

### Q3: 数据同步失败？

**检查项**：
1. 冠客 API 密钥是否正确？（在 `backend/.env` 中）
2. 网络是否能访问冠客 API？
3. 查看后端日志：`python run.py`

### Q4: 前端无法连接后端？

**检查项**：
1. 后端是否启动？访问 http://localhost:5001/api/health
2. `.env.development` 是否正确配置？
3. 浏览器控制台是否有 CORS 错误？

---

## 📚 相关文档

- [后端 README](./backend/README.md) - 后端详细文档
- [组织架构文档](../call-center-docs/ORGANIZATION_README.md) - 整体架构
- [API 认证规范](../call-center-docs/architecture/authentication.md) - JWT 认证标准

---

## 🎉 迁移完成检查清单

- [ ] 后端服务启动成功（http://localhost:5001/api/health）
- [ ] 数据库初始化完成（call_records + daily_stats 表）
- [ ] 测试 Token 生成成功
- [ ] 前端环境变量配置（`.env.development`）
- [ ] 前端成功调用后端 API
- [ ] 数据同步成功（至少 1 天数据）
- [ ] 前后端联调通过
- [ ] 部署配置更新（Zeabur）

---

**最后更新**: 2025-10-19  
**版本**: v2.0

































