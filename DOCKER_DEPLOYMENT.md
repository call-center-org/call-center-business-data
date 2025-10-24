# 🐳 Docker 部署指南

> 外呼数据系统 - Docker 容器化部署完整指南

---

## 📋 目录

- [快速开始](#快速开始)
- [部署方式对比](#部署方式对比)
- [本地开发部署](#本地开发部署)
- [生产环境部署](#生产环境部署)
- [Zeabur 部署](#zeabur部署推荐)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 一键启动（开发环境）

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd call-center-business-data

# 2. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 填入冠客 API 配置

# 3. 启动所有服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f
```

访问：
- 前端：http://localhost:3001
- 后端API：http://localhost:5001

---

## 📊 部署方式对比

| 方式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **Docker Compose** | 本地开发、小型部署 | 简单快速 | 单机限制 |
| **Zeabur** | 快速上线、中国用户 | 国内访问快、自动CI/CD | 有一定费用 |
| **云服务器 + Docker** | 完全控制 | 灵活性高 | 需要运维 |

---

## 💻 本地开发部署

### 1. 基础部署

```bash
# 启动所有服务
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看实时日志
docker-compose logs -f backend    # 后端日志
docker-compose logs -f frontend   # 前端日志
```

### 2. 配置说明

#### 后端配置 (`backend/.env`)

```bash
# 应用环境
FLASK_ENV=development

# 数据库（开发环境使用 SQLite）
DATABASE_URL=sqlite:////app/instance/business_data.db

# 密钥（开发环境可以使用默认值）
SECRET_KEY=dev-secret-key
JWT_SECRET_KEY=dev-jwt-secret-key

# 冠客 API 配置（必填）
GUANKE_USERNAME=your-username
GUANKE_PASSWORD=your-password
```

#### 前端配置 (`.env.development`)

```bash
# 后端 API 地址
VITE_BACKEND_URL=http://localhost:5001
```

### 3. 重新构建

```bash
# 修改代码后重新构建
docker-compose build

# 重启服务
docker-compose restart

# 或者一步完成
docker-compose up -d --build
```

### 4. 停止和清理

```bash
# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 删除容器和数据卷（⚠️ 会删除数据库）
docker-compose down -v
```

---

## 🌐 生产环境部署

### 方式 1：使用生产配置文件

```bash
# 1. 创建生产环境配置
cp backend/.env.example backend/.env.production
cp .env.production.example .env.production

# 2. 编辑配置文件
vim backend/.env.production
# 填入生产数据库、密钥等

# 3. 使用生产配置启动
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 方式 2：云服务器部署（以腾讯云为例）

#### 步骤 1：准备服务器

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose
apt-get install docker-compose-plugin

# 启动 Docker
systemctl start docker
systemctl enable docker
```

#### 步骤 2：部署应用

```bash
# 1. 克隆代码
git clone <your-repo-url>
cd call-center-business-data

# 2. 配置环境变量
cp backend/.env.example backend/.env
vim backend/.env

# 必须配置：
# - DATABASE_URL（PostgreSQL 推荐）
# - SECRET_KEY（生成随机字符串）
# - JWT_SECRET_KEY（生成随机字符串）
# - GUANKE_USERNAME
# - GUANKE_PASSWORD

# 3. 启动服务
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. 验证
docker-compose ps
docker-compose logs
```

#### 步骤 3：配置 Nginx 反向代理（可选）

```nginx
# /etc/nginx/sites-available/call-center

server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# 启用配置
ln -s /etc/nginx/sites-available/call-center /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

#### 步骤 4：配置 HTTPS（推荐）

```bash
# 使用 Let's Encrypt 免费证书
apt-get install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## ⚡ Zeabur 部署（推荐）

> Zeabur 是对中国用户非常友好的部署平台，支持自动 CI/CD

### 优势

✅ **国内访问快** - 有中国节点
✅ **自动 CI/CD** - Git push 自动部署
✅ **简单易用** - 无需配置服务器
✅ **免费额度** - 小项目完全够用

### 部署步骤

#### 方式 1：使用 Zeabur 控制台（推荐新手）

1. **访问 [Zeabur](https://zeabur.com)**
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 GitHub 仓库

3. **配置服务**
   
   **后端服务：**
   - Service Type: `Python`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python run.py`
   - Port: `5001`
   
   环境变量：
   ```
   FLASK_ENV=production
   PORT=5001
   SECRET_KEY=<生成随机字符串>
   JWT_SECRET_KEY=<生成随机字符串>
   GUANKE_USERNAME=<你的用户名>
   GUANKE_PASSWORD=<你的密码>
   ```

   **前端服务：**
   - Service Type: `Static Site`
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Port: `3001`
   
   环境变量：
   ```
   VITE_BACKEND_URL=<后端服务的URL>
   ```

4. **获取域名**
   - Zeabur 会自动分配域名
   - 或绑定自定义域名

5. **自动部署**
   - 每次 git push，Zeabur 自动重新部署

#### 方式 2：使用 Zeabur CLI（推荐老手）

```bash
# 1. 安装 Zeabur CLI
npm install -g @zeabur/cli
# 或
curl -fsSL https://zeabur.com/install.sh | bash

# 2. 登录
zeabur auth login

# 3. 初始化项目（已有 zeabur.json 可跳过）
zeabur init

# 4. 部署
zeabur deploy

# 5. 查看部署状态
zeabur status

# 6. 查看日志
zeabur logs
```

### Zeabur 配置文件说明

项目已包含 `zeabur.json`，配置如下：

```json
{
  "name": "call-center-business-data",
  "version": "2.0.0",
  "services": [
    {
      "name": "frontend",
      "type": "static",
      "buildCommand": "npm install && npm run build",
      "outputDirectory": "dist",
      "port": 3001
    },
    {
      "name": "backend",
      "type": "python",
      "rootDirectory": "backend",
      "buildCommand": "pip install -r requirements.txt",
      "startCommand": "python run.py",
      "port": 5001
    }
  ]
}
```

---

## 🔧 常见问题

### 1. 端口冲突

**问题**：`port is already allocated`

**解决**：
```bash
# 查看端口占用
lsof -i :5001
lsof -i :3001

# 停止占用端口的进程
kill -9 <PID>

# 或修改 docker-compose.yml 中的端口映射
ports:
  - "5002:5001"  # 将 5001 改为 5002
```

### 2. 数据库连接失败

**问题**：`database connection failed`

**解决**：
```bash
# 检查环境变量
docker-compose exec backend env | grep DATABASE

# 查看后端日志
docker-compose logs backend

# 初始化数据库
docker-compose exec backend python scripts/init_db.py
```

### 3. 前端无法连接后端

**问题**：前端显示 API 连接失败

**解决**：
```bash
# 1. 检查 VITE_BACKEND_URL 配置
cat .env.development

# 2. 确保后端服务正常
curl http://localhost:5001/api/health

# 3. 检查 CORS 配置
# backend/.env 中确保配置了正确的 ALLOWED_ORIGINS
```

### 4. Docker 镜像构建慢

**问题**：构建过程很慢

**解决**：
```bash
# 使用国内 Docker 镜像源
# 创建 /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com"
  ]
}

# 重启 Docker
systemctl daemon-reload
systemctl restart docker
```

### 5. 容器内存不足

**问题**：容器频繁重启

**解决**：
```bash
# 调整 docker-compose.prod.yml 中的资源限制
deploy:
  resources:
    limits:
      memory: 2G  # 增加内存限制
```

### 6. 数据持久化丢失

**问题**：重启后数据丢失

**解决**：
```bash
# 确保使用了数据卷
volumes:
  - backend-data:/app/instance

# 备份数据卷
docker run --rm -v backend-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup.tar.gz -C /data .

# 恢复数据卷
docker run --rm -v backend-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/backup.tar.gz -C /data
```

---

## 📊 性能优化建议

### 生产环境推荐配置

1. **使用 PostgreSQL 而非 SQLite**
   ```bash
   DATABASE_URL=postgresql://user:pass@db:5432/callcenter
   ```

2. **启用 Gzip 压缩**
   - Nginx 配置已包含 gzip 设置

3. **使用 CDN**
   - 静态资源上传到 CDN
   - 修改前端构建配置

4. **配置缓存策略**
   - API 响应缓存
   - 静态资源缓存（已配置）

5. **监控和日志**
   ```bash
   # 设置日志轮转
   # 使用 Sentry 监控错误
   # 配置健康检查告警
   ```

---

## 🔐 安全建议

1. **修改默认密钥**
   ```bash
   # 生成随机密钥
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

2. **使用环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用 `.env` 文件

3. **限制 CORS**
   ```python
   ALLOWED_ORIGINS=https://your-domain.com
   ```

4. **配置 HTTPS**
   - 生产环境必须使用 HTTPS

5. **定期更新依赖**
   ```bash
   npm audit fix
   pip list --outdated
   ```

---

## 📚 相关文档

- [README.md](./README.md) - 项目概览
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 其他部署方式
- [Zeabur快速开始.md](./Zeabur快速开始.md) - Zeabur 详细指南

---

## 🆘 获取帮助

- 查看日志：`docker-compose logs -f`
- 检查健康状态：`docker-compose ps`
- GitHub Issues: 提交问题
- 团队支持：联系开发团队

---

**🎉 祝您部署顺利！**

