# 🔧 Zeabur 环境变量快速配置

> 部署前必须配置！请按照以下步骤操作

---

## 📋 配置步骤

### 1. 访问 Zeabur 控制台
👉 打开：https://dash.zeabur.com

### 2. 创建新项目
- 点击 **"New Project"**
- 输入项目名：`call-center-business-data`
- 选择地区：建议选择 **Hong Kong** 或 **Tokyo**（对中国大陆访问较快）

### 3. 连接 GitHub 仓库
- 点击 **"Deploy Service"**
- 选择 **"From GitHub"**
- 找到并选择您的仓库：`call-center-business-data`
- 点击 **"Deploy"**

---

## 🔑 环境变量配置

### 后端服务配置

在 Zeabur 控制台中找到后端服务，点击 **"Environment Variables"**，添加以下变量：

#### 必填项 ⭐

```bash
# 1. 应用环境
FLASK_ENV=production

# 2. 服务端口
PORT=5001

# 3. 安全密钥（请生成随机字符串！）
SECRET_KEY=请替换为随机32位字符串
JWT_SECRET_KEY=请替换为随机32位字符串

# 4. 冠客 API 配置（必填！）
GUANKE_USERNAME=您的冠客用户名
GUANKE_PASSWORD=您的冠客密码
```

#### 可选项

```bash
# 数据库（Zeabur 默认使用 SQLite，生产环境可升级 PostgreSQL）
# DATABASE_URL=postgresql://user:pass@host:5432/dbname

# CORS 配置（Zeabur 会自动配置，一般不需要改）
# ALLOWED_ORIGINS=https://your-frontend-url.zeabur.app
```

---

### 前端服务配置

在 Zeabur 控制台中找到前端服务，点击 **"Environment Variables"**，添加：

```bash
# 后端 API 地址（等后端部署完成后填入）
VITE_BACKEND_URL=https://your-backend-service.zeabur.app
```

**⚠️ 注意**：
- 先部署后端，复制后端服务的 URL
- 然后在前端环境变量中填入这个 URL
- 最后重新部署前端

---

## 🔐 生成随机密钥

### 方法 1：使用 Python（推荐）

```bash
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_hex(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_hex(32))"
```

### 方法 2：使用在线工具

访问：https://www.random.org/strings/

配置：
- 字符数：64
- 字符类型：Hex
- 生成 2 个

---

## 📝 配置示例

### 后端服务环境变量（完整示例）

```
FLASK_ENV=production
PORT=5001
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_SECRET_KEY=z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1
GUANKE_USERNAME=your_actual_username
GUANKE_PASSWORD=your_actual_password
```

### 前端服务环境变量（示例）

```
VITE_BACKEND_URL=https://call-center-backend-abc123.zeabur.app
```

---

## ✅ 检查清单

在点击部署前，请确认：

- [ ] 已在 Zeabur 创建项目
- [ ] 已连接 GitHub 仓库
- [ ] 后端服务已配置所有必填环境变量
- [ ] SECRET_KEY 和 JWT_SECRET_KEY 是随机生成的（不是示例值）
- [ ] GUANKE_USERNAME 和 GUANKE_PASSWORD 正确
- [ ] 前端服务已配置 VITE_BACKEND_URL（指向后端服务 URL）

---

## 🚀 部署流程

### 完整部署步骤

1. **在 Zeabur 控制台创建项目和服务**
2. **配置后端环境变量**（上面的所有后端配置）
3. **部署后端**，等待完成（约 2-5 分钟）
4. **复制后端服务 URL**（在 Zeabur 控制台中显示）
5. **配置前端环境变量**（填入后端 URL）
6. **部署前端**，等待完成
7. **访问前端 URL**，测试系统

---

## 🎯 快速访问

部署完成后：
- **后端健康检查**：https://your-backend.zeabur.app/api/health
- **前端访问**：https://your-frontend.zeabur.app

---

## 🆘 遇到问题？

### 后端部署失败
- 检查 GUANKE_USERNAME 和 GUANKE_PASSWORD 是否正确
- 查看 Zeabur 部署日志
- 确认所有必填环境变量都已配置

### 前端无法连接后端
- 检查 VITE_BACKEND_URL 是否正确
- 确认后端服务已成功部署
- 在浏览器开发者工具中检查网络请求

### 数据获取失败
- 检查冠客 API 账号是否有权限
- 查看后端日志（Zeabur 控制台 → Logs）

---

## 📞 需要帮助？

- Zeabur 文档：https://zeabur.com/docs
- 项目文档：[DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

---

**🎉 配置完成后，您的系统就可以在云端访问了！**

