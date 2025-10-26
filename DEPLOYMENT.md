# 部署指南

> 外呼数据系统 v2.0 - 前后端分离架构部署

---

## 📋 部署架构

```
用户浏览器
    ↓
前端服务 (React + Vite)
    ↓ HTTP/HTTPS
后端服务 (Flask)
    ↓ HTTPS
冠客 API
    ↓
数据库 (PostgreSQL / SQLite)
```

---

## 🚀 Zeabur 部署（推荐）

Zeabur 是一个现代化的云部署平台，支持自动构建和部署。

### 方式 1：通过 GitHub 自动部署（推荐）

#### 1.1 准备工作

1. 确保代码已推送到 GitHub
2. 登录 [Zeabur Dashboard](https://dash.zeabur.com)
3. 使用 GitHub 账号登录

#### 1.2 创建项目

1. 点击 "New Project"
2. 选择 "Import from GitHub"
3. 选择 `call-center-business-data` 仓库
4. Zeabur 会自动检测到前后端服务

#### 1.3 配置后端服务

在后端服务的环境变量中添加：

```env
# Flask 配置
FLASK_ENV=production
PORT=5001

# 密钥（生产环境必须修改）
SECRET_KEY=<生成强密钥>
JWT_SECRET_KEY=call-center-secret-key-2024-change-in-production

# 数据库（Zeabur PostgreSQL）
DATABASE_URL=<自动注入或手动配置>

# 冠客 API
GUANKE_BASE_URL=https://open-api.gooki.com
GUANKE_API_SECRET=<你的冠客密钥>
```

#### 1.4 配置前端服务

在前端服务的环境变量中添加：

```env
VITE_BACKEND_URL=<后端服务的URL>
```

例如：`https://backend-xxx.zeabur.app`

#### 1.5 添加 PostgreSQL 数据库

1. 在项目中点击 "Add Service"
2. 选择 "PostgreSQL"
3. Zeabur 会自动创建数据库并注入 `DATABASE_URL`

#### 1.6 部署

1. 保存配置后，Zeabur 会自动构建和部署
2. 等待构建完成（约 2-5 分钟）
3. 访问前端 URL 测试

### 方式 2：通过 Zeabur CLI 部署

#### 2.1 安装 CLI

```bash
npm install -g @zeabur/cli
```

#### 2.2 登录

```bash
zeabur auth login
```

#### 2.3 部署

```bash
# 在项目根目录
zeabur deploy
```

---

## 🐳 Docker 部署

### 前端 Dockerfile

在项目根目录创建 `Dockerfile.frontend`：

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 构建
COPY . .
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 后端 Dockerfile

在 `backend/` 目录创建 `Dockerfile`：

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制代码
COPY . .

# 暴露端口
EXPOSE 5001

# 启动命令
CMD ["python", "run.py"]
```

### Docker Compose

在项目根目录创建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3001:80"
    environment:
      - VITE_BACKEND_URL=http://backend:5001
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
    ports:
      - "5001:5001"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/business_data
      - GUANKE_API_SECRET=${GUANKE_API_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=business_data
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

启动：

```bash
docker-compose up -d
```

---

## ☁️ 腾讯云 CloudBase 部署

### 前端部署（静态托管）

1. 构建前端：
```bash
npm run build
```

2. 上传到 CloudBase 静态托管：
```bash
cloudbase hosting deploy dist /
```

### 后端部署（云函数）

CloudBase 也支持 Python 云函数，但推荐使用 Zeabur 部署后端。

---

## 🔧 生产环境配置检查清单

### 后端

- [ ] 修改 `SECRET_KEY` 为强密钥
- [ ] 修改 `JWT_SECRET_KEY`（与组织统一）
- [ ] 配置 PostgreSQL 数据库 URL
- [ ] 配置冠客 API 密钥
- [ ] 启用 HTTPS
- [ ] 配置 CORS 允许的域名
- [ ] 关闭 DEBUG 模式
- [ ] 配置日志记录

### 前端

- [ ] 配置后端 API 地址（`VITE_BACKEND_URL`）
- [ ] 构建生产版本（`npm run build`）
- [ ] 配置域名和 HTTPS
- [ ] 启用 Gzip 压缩
- [ ] 配置 CDN（可选）

### 数据库

- [ ] 执行数据库迁移
- [ ] 创建必要的索引
- [ ] 配置自动备份
- [ ] 设置连接池参数

---

## 🔒 安全配置

### 1. 环境变量管理

**生产环境禁止硬编码敏感信息**

使用环境变量：
- `SECRET_KEY`
- `JWT_SECRET_KEY`
- `DATABASE_URL`
- `GUANKE_API_SECRET`

### 2. HTTPS 配置

生产环境必须启用 HTTPS：
- 前端：通过 CDN 或 Nginx 配置
- 后端：通过反向代理（Nginx）或平台自动配置

### 3. CORS 配置

修改 `backend/app/__init__.py`：

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://your-frontend-domain.com"
        ],
        # ...
    }
})
```

### 4. 数据库安全

- 使用强密码
- 限制数据库访问 IP
- 启用 SSL 连接
- 定期备份

---

## 📊 监控和日志

### 应用监控

推荐使用：
- Sentry（错误监控）
- Datadog（性能监控）
- New Relic（APM）

### 日志管理

后端日志配置（`backend/app/config.py`）：

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

---

## 🔄 持续集成/部署（CI/CD）

### GitHub Actions

在 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Zeabur

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Zeabur
        run: |
          npm install -g @zeabur/cli
          zeabur auth login --token ${{ secrets.ZEABUR_TOKEN }}
          zeabur deploy
```

---

## 🐛 故障排查

### 后端无法启动

**检查项**：
1. 环境变量是否正确配置？
2. 数据库是否可访问？
3. 端口是否被占用？
4. 依赖是否完整安装？

### 前端无法连接后端

**检查项**：
1. `VITE_BACKEND_URL` 是否正确？
2. 后端 CORS 是否配置？
3. 网络是否可达？
4. JWT Token 是否有效？

### 数据同步失败

**检查项**：
1. 冠客 API 密钥是否正确？
2. 网络是否能访问冠客 API？
3. 数据库是否有足够空间？
4. 查看后端日志

---

## 📞 技术支持

部署遇到问题？

1. 查看日志文件
2. 检查环境变量配置
3. 验证网络连通性
4. 联系技术负责人

---

**最后更新**: 2025-10-19  
**版本**: v2.0

































