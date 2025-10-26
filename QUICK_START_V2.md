# 快速开始指南（v2.0）

> 5 分钟启动外呼数据系统前后端

---

## 📋 前置要求

- ✅ Node.js 16+ （前端）
- ✅ Python 3.8+ （后端）
- ✅ 冠客 API 密钥

---

## 🚀 步骤 1：启动后端（5 步）

### 1.1 进入后端目录

```bash
cd backend
```

### 1.2 创建虚拟环境并激活

```bash
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 1.3 安装依赖

```bash
pip install -r requirements.txt
```

### 1.4 配置环境变量

复制示例文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置冠客 API 密钥：

```env
GUANKE_API_SECRET=你的冠客密钥
```

### 1.5 初始化数据库并启动

```bash
# 初始化数据库
python scripts/init_db.py

# 启动后端
python run.py
```

✅ 看到以下输出表示成功：

```
* Running on http://127.0.0.1:5001
```

**测试后端**：打开浏览器访问 http://localhost:5001/api/health

应该看到：
```json
{
  "status": "healthy",
  "service": "call-center-business-data",
  "version": "2.0.0"
}
```

---

## 🎨 步骤 2：启动前端（3 步）

### 2.1 回到项目根目录

```bash
cd ..  # 如果在 backend/ 目录，回到根目录
```

### 2.2 安装依赖

```bash
npm install
```

### 2.3 启动前端

```bash
npm run dev
```

✅ 看到以下输出表示成功：

```
VITE v... ready in ... ms
➜ Local:   http://localhost:3001/
```

---

## 🧪 步骤 3：测试（2 步）

### 3.1 生成测试 Token

在后端目录执行：

```bash
cd backend
python scripts/generate_test_token.py
```

复制生成的 Token。

### 3.2 在浏览器中测试

1. 打开 http://localhost:3001
2. 打开浏览器控制台（F12）
3. 输入以下命令设置 Token：

```javascript
localStorage.setItem('auth_token', '你复制的Token')
```

4. 刷新页面
5. 打开控制台，应该能看到前端调用后端的 API 请求

---

## 🎉 成功检查清单

- [ ] 后端启动成功（http://localhost:5001/api/health 返回 healthy）
- [ ] 前端启动成功（http://localhost:3001 能访问）
- [ ] 浏览器控制台能看到 API 请求日志
- [ ] 没有 401 认证错误

---

## 🐛 常见问题

### Q1: 后端启动失败？

**检查**：
- Python 版本是否 3.8+？
- 虚拟环境是否激活？
- 依赖是否安装完整？

**解决**：
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Q2: 前端无法连接后端？

**检查**：
- 后端是否启动？（访问 http://localhost:5001/api/health）
- 是否有 CORS 错误？

**解决**：确保后端正在运行，CORS 已配置。

### Q3: API 返回 401 错误？

**原因**：JWT Token 未设置或无效

**解决**：
1. 运行 `python scripts/generate_test_token.py` 生成 Token
2. 在浏览器控制台设置：`localStorage.setItem('auth_token', '你的Token')`

### Q4: 数据库初始化失败？

**解决**：
```bash
cd backend
rm -f business_data.db  # 删除旧数据库
python scripts/init_db.py  # 重新初始化
```

---

## 📚 下一步

- 📖 阅读 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 了解详细架构
- 🚀 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 了解如何部署
- 📊 同步历史数据：`python scripts/sync_initial_data.py 30`

---

## 💡 提示

**开发时推荐的终端布局**：

```
终端 1（后端）          终端 2（前端）
┌────────────────┐      ┌────────────────┐
│ cd backend     │      │ npm run dev    │
│ python run.py  │      │                │
│                │      │ ✅ Vite ready  │
│ ✅ Flask ready │      │                │
└────────────────┘      └────────────────┘
```

---

**最后更新**: 2025-10-19  
**版本**: v2.0

































