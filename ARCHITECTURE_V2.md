# 架构文档 v2.0

> 外呼数据系统 - 前后端分离架构

---

## 🏗️ 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
│                   (http://localhost:3001)               │
└─────────────────────────────────────────────────────────┘
                            ↓
                    HTTP/HTTPS + JWT Token
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   前端服务 (React + Vite)                │
│  - 用户界面展示                                          │
│  - JWT Token 管理                                        │
│  - 调用后端 API                                          │
│  端口: 3001                                              │
└─────────────────────────────────────────────────────────┘
                            ↓
                    RESTful API + JWT Auth
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   后端服务 (Flask)                       │
│  - JWT 认证                                              │
│  - 业务逻辑处理                                          │
│  - 数据同步调度                                          │
│  - 调用冠客 API                                          │
│  端口: 5001                                              │
└─────────────────────────────────────────────────────────┘
         ↓                                ↓
   HTTPS (冠客密钥)                  SQL Queries
         ↓                                ↓
┌──────────────────┐          ┌────────────────────────┐
│   冠客 API        │          │   数据库 (SQLite/PG)   │
│ open-api.gooki   │          │  - call_records        │
│  - 通话记录       │          │  - daily_stats         │
│  - 任务数据       │          └────────────────────────┘
└──────────────────┘
```

---

## 📦 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| Vite | 5.x | 构建工具 |
| TailwindCSS | 3.x | 样式框架 |
| Axios | 1.x | HTTP 客户端 |
| Lucide React | - | 图标库 |
| React Hot Toast | - | 通知提示 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Flask | 2.3.x | Web 框架 |
| Flask-CORS | 4.0.x | 跨域支持 |
| Flask-SQLAlchemy | 3.0.x | ORM |
| Flask-Migrate | 4.0.x | 数据库迁移 |
| PyJWT | 2.8.x | JWT 认证 |
| Requests | 2.31.x | HTTP 客户端 |

### 数据库

| 环境 | 数据库 | 说明 |
|------|--------|------|
| 开发 | SQLite | 无需配置，开箱即用 |
| 生产 | PostgreSQL | 推荐，性能更好 |

---

## 🔐 认证架构

### JWT Token 流程

```
1. 用户登录 ERP 系统（未来）
        ↓
2. ERP 生成 JWT Token
        ↓
3. Token 存储在 localStorage
        ↓
4. 前端请求时携带 Token
        ↓
5. 后端验证 Token
        ↓
6. Token 有效 → 返回数据
   Token 无效 → 返回 401
```

### JWT Token 结构

```json
{
  "user_id": 1,
  "username": "test_user",
  "role": "admin",
  "exp": 1729123456,
  "iat": 1729037056
}
```

### 开发环境 Token 生成

```bash
python backend/scripts/generate_test_token.py
```

---

## 📊 数据库设计

### 表结构

#### call_records（通话记录）

| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | Integer | 主键 | PK |
| call_id | String(100) | 通话ID（唯一） | ✅ |
| task_id | String(100) | 任务ID | ✅ |
| task_name | String(200) | 任务名称 | - |
| agent_id | String(100) | 坐席ID | ✅ |
| agent_name | String(100) | 坐席名称 | - |
| phone | String(20) | 客户电话 | - |
| start_time | DateTime | 开始时间 | ✅ |
| end_time | DateTime | 结束时间 | - |
| duration | Integer | 通话时长（秒） | - |
| hangup_reason | String(50) | 挂机原因 | - |
| is_success | Boolean | 是否成功 | ✅ |
| created_at | DateTime | 创建时间 | - |
| synced_at | DateTime | 同步时间 | - |

#### daily_stats（每日统计）

| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | Integer | 主键 | PK |
| stat_date | Date | 统计日期（唯一） | ✅ |
| total_calls | Integer | 总呼出 | - |
| success_calls | Integer | 成功呼出 | - |
| failed_calls | Integer | 失败呼出 | - |
| success_rate | Float | 成功率 | - |
| total_duration | Integer | 总时长 | - |
| avg_duration | Float | 平均时长 | - |
| created_at | DateTime | 创建时间 | - |
| updated_at | DateTime | 更新时间 | - |

---

## 🔄 数据流程

### 1. 数据同步流程

```
定时任务/手动触发
        ↓
后端调用冠客 API
        ↓
获取通话记录
        ↓
数据清洗和处理
        ↓
判断成功/失败
        ↓
保存到 call_records
        ↓
计算每日统计
        ↓
更新 daily_stats
```

### 2. 数据查询流程

```
前端发起请求
        ↓
后端验证 JWT Token
        ↓
查询 daily_stats 表
        ↓
计算汇总数据
        ↓
返回 JSON 数据
        ↓
前端展示
```

### 3. 成功判断标准

```python
is_success = (
    hangup_reason == 'NORMAL_CLEARING' and
    duration > 0
)
```

---

## 🛠️ API 设计

### RESTful API 规范

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| GET | `/api/health` | ❌ | 健康检查 |
| GET | `/api/calls/summary` | ✅ | 获取概览 |
| GET | `/api/calls/daily` | ✅ | 每日明细 |
| POST | `/api/calls/sync` | ✅ | 同步数据 |
| GET | `/api/stats/overview` | ✅ | 统计概览 |
| GET | `/api/stats/trend` | ✅ | 趋势数据 |

### 统一响应格式

**成功**：
```json
{
  "success": true,
  "data": { ... }
}
```

**失败**：
```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## 🔧 配置管理

### 环境变量

#### 后端 (.env)

```env
# Flask 环境
FLASK_ENV=development|production
PORT=5001

# 密钥
SECRET_KEY=<随机字符串>
JWT_SECRET_KEY=call-center-secret-key-2024-change-in-production

# 数据库
DATABASE_URL=sqlite:///business_data.db  # 或 PostgreSQL URL

# 冠客 API
GUANKE_BASE_URL=https://open-api.gooki.com
GUANKE_API_SECRET=<你的密钥>
```

#### 前端 (.env.development)

```env
VITE_BACKEND_URL=http://localhost:5001
```

---

## 📈 性能优化

### 1. 数据库索引

- `call_records.call_id` - 唯一索引
- `call_records.task_id` - 普通索引
- `call_records.agent_id` - 普通索引
- `call_records.start_time` - 时间查询优化
- `call_records.is_success` - 统计查询优化
- `daily_stats.stat_date` - 唯一索引

### 2. 查询优化

- 使用 `daily_stats` 预计算表加速查询
- 避免实时计算大量数据
- 分页查询（未来）

### 3. 缓存策略（未来）

- Redis 缓存热点数据
- 定时刷新缓存
- 缓存失效策略

---

## 🚀 部署架构

### 开发环境

```
前端: http://localhost:3001
后端: http://localhost:5001
数据库: SQLite (本地文件)
```

### 生产环境（Zeabur）

```
前端: https://frontend-xxx.zeabur.app
后端: https://backend-xxx.zeabur.app
数据库: PostgreSQL (Zeabur 托管)
```

---

## 📝 代码结构

### 后端

```
backend/
├── app/
│   ├── __init__.py         # Flask 应用工厂
│   ├── config.py           # 配置管理
│   ├── core/
│   │   └── auth.py         # JWT 认证装饰器
│   ├── models/
│   │   ├── call_record.py  # 通话记录模型
│   │   └── daily_stat.py   # 统计模型
│   ├── routes/
│   │   ├── health.py       # 健康检查
│   │   ├── calls.py        # 呼出数据接口
│   │   └── stats.py        # 统计接口
│   └── services/
│       ├── guanke_api.py   # 冠客 API 客户端
│       └── data_processor.py  # 数据处理服务
├── scripts/
│   ├── init_db.py          # 数据库初始化
│   ├── generate_test_token.py  # 生成测试 Token
│   └── sync_initial_data.py    # 首次数据同步
├── requirements.txt
└── run.py
```

### 前端

```
src/
├── components/
│   └── CallStatistics.jsx  # 统计组件（旧）
├── utils/
│   ├── apiClient.js        # 旧的 API 客户端
│   ├── backendApiClient.js # 新的后端客户端
│   └── backendApi.js       # 新的 API 接口
└── App.jsx
```

---

## 🔮 未来规划

### Phase 1（已完成）
- ✅ 后端基础架构
- ✅ JWT 认证
- ✅ 数据库设计
- ✅ 核心 API

### Phase 2（待开发）
- [ ] 前端完全迁移到新 API
- [ ] 定时任务（自动同步）
- [ ] 更多统计维度（坐席、任务）

### Phase 3（未来）
- [ ] Redis 缓存
- [ ] 实时数据推送
- [ ] 数据导出功能
- [ ] 高级数据分析

---

**文档版本**: v2.0  
**最后更新**: 2025-10-19

































