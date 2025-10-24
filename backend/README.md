# 外呼数据系统 - 后端 API

> Flask + SQLAlchemy + PostgreSQL

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置冠客 API 密钥：

```env
GUANKE_API_SECRET=your-api-secret-here
```

### 3. 初始化数据库

```bash
python scripts/init_db.py
```

### 4. 启动开发服务器

```bash
python run.py
```

访问：http://localhost:5001

---

## 🔐 认证

### 生成测试 Token

开发环境下，使用脚本生成测试 Token：

```bash
python scripts/generate_test_token.py
```

复制生成的 Token，在 API 请求中使用：

```bash
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:5001/api/calls/summary?days=3
```

### 生产环境

生产环境中，Token 由 ERP 系统统一生成和管理。

---

## 📡 API 端点

### 健康检查

```bash
GET /api/health
# 无需认证
```

### 呼出数据概览

```bash
GET /api/calls/summary?days=3
# 需要认证
# 参数：
#   - days: 统计天数（默认 3）
```

### 每日明细

```bash
GET /api/calls/daily?start_date=2025-10-01&end_date=2025-10-19
# 需要认证
# 参数：
#   - start_date: 开始日期（YYYY-MM-DD）
#   - end_date: 结束日期（YYYY-MM-DD）
```

### 手动同步数据

```bash
POST /api/calls/sync
Content-Type: application/json

{
  "days": 1
}
# 需要认证
```

---

## 📊 数据库

### 表结构

**call_records（通话记录）**
- 存储从冠客 API 同步的原始通话数据
- 包含：通话ID、任务信息、坐席信息、时长、挂机原因等

**daily_stats（每日统计）**
- 预计算的每日统计数据
- 包含：总呼出、成功呼出、成功率、平均时长等

### 迁移命令

使用 Flask-Migrate 管理数据库变更：

```bash
# 初始化迁移
flask db init

# 生成迁移脚本
flask db migrate -m "描述"

# 执行迁移
flask db upgrade
```

---

## 🔧 开发

### 项目结构

```
backend/
├── app/
│   ├── __init__.py          # Flask 应用工厂
│   ├── config.py            # 配置管理
│   ├── core/
│   │   └── auth.py          # JWT 认证
│   ├── models/              # 数据库模型
│   │   ├── call_record.py
│   │   └── daily_stat.py
│   ├── routes/              # API 路由
│   │   ├── health.py
│   │   ├── calls.py
│   │   └── stats.py
│   └── services/            # 业务逻辑
│       ├── guanke_api.py
│       └── data_processor.py
├── scripts/                 # 工具脚本
├── requirements.txt
└── run.py                   # 启动文件
```

### 添加新接口

1. 在 `app/routes/` 下创建或修改蓝图
2. 在 `app/__init__.py` 中注册蓝图
3. 使用 `@require_auth` 装饰器进行认证

---

## 🚀 部署

### Zeabur 部署

1. 项目已配置为前后端分离架构
2. 在 Zeabur 控制台添加后端服务
3. 配置环境变量（生产环境）
4. 连接 PostgreSQL 数据库

详见根目录的部署文档。

---

## 📝 环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| FLASK_ENV | 运行环境 | development | 否 |
| PORT | 端口 | 5001 | 否 |
| SECRET_KEY | Flask 密钥 | (开发默认值) | 生产必需 |
| JWT_SECRET_KEY | JWT 密钥 | (开发默认值) | 生产必需 |
| DATABASE_URL | 数据库连接 | SQLite | 生产必需 |
| GUANKE_BASE_URL | 冠客 API 地址 | https://open-api.gooki.com | 否 |
| GUANKE_API_SECRET | 冠客 API 密钥 | - | 是 |

---

## 🔍 调试

启用详细日志：

```bash
export FLASK_ENV=development
export SQLALCHEMY_ECHO=True
python run.py
```

---

## ⚠️ 注意事项

1. **JWT 密钥**：生产环境必须修改为强密钥
2. **数据库**：生产环境使用 PostgreSQL
3. **CORS**：根据实际前端地址配置
4. **冠客 API**：确保配置正确的密钥

---

## 📞 技术支持

如有问题，请查看：
- Flask 日志
- 数据库连接状态
- 冠客 API 密钥是否正确

































