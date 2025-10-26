# 测试指南

> 外呼数据系统 v2.0 - 前后端集成测试

---

## 🧪 测试环境准备

### 1. 启动后端

```bash
cd backend
source venv/bin/activate
python run.py
```

### 2. 启动前端

```bash
# 在项目根目录
npm run dev
```

---

## ✅ 测试清单

### 阶段 1：后端单元测试

#### 1.1 健康检查

```bash
curl http://localhost:5001/api/health
```

**预期输出**：
```json
{
  "status": "healthy",
  "service": "call-center-business-data",
  "timestamp": "2025-10-19T...",
  "version": "2.0.0"
}
```

✅ / ❌ 

---

#### 1.2 生成测试 Token

```bash
cd backend
python scripts/generate_test_token.py
```

**预期**：输出一个 JWT Token

复制 Token 备用。

✅ / ❌ 

---

#### 1.3 测试认证（无 Token）

```bash
curl http://localhost:5001/api/calls/summary?days=3
```

**预期输出**：
```json
{
  "error": "No token provided"
}
```

**状态码**: 401

✅ / ❌ 

---

#### 1.4 测试认证（有 Token）

```bash
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:5001/api/calls/summary?days=3
```

**预期**：返回数据或空数据（如果数据库还没数据）

```json
{
  "success": true,
  "data": {
    "days": 3,
    "total_calls": 0,
    ...
  }
}
```

✅ / ❌ 

---

#### 1.5 测试数据同步

```bash
curl -X POST http://localhost:5001/api/calls/sync \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 1}'
```

**预期**：同步成功，返回同步结果

```json
{
  "success": true,
  "data": {
    "start_date": "2025-10-18",
    "end_date": "2025-10-19",
    "total_records": 150,
    "new_count": 150,
    "updated_count": 0
  }
}
```

✅ / ❌ 

---

### 阶段 2：数据库验证

#### 2.1 检查数据库表

```bash
cd backend
sqlite3 business_data.db ".tables"
```

**预期输出**：
```
call_records  daily_stats
```

✅ / ❌ 

---

#### 2.2 检查通话记录数量

```bash
sqlite3 business_data.db "SELECT COUNT(*) FROM call_records;"
```

**预期**：返回一个数字（如果已同步数据）

✅ / ❌ 

---

#### 2.3 检查每日统计

```bash
sqlite3 business_data.db "SELECT * FROM daily_stats LIMIT 5;"
```

**预期**：返回每日统计数据

✅ / ❌ 

---

### 阶段 3：前端集成测试

#### 3.1 设置 Token

1. 打开浏览器：http://localhost:3001
2. 打开控制台（F12）
3. 执行：

```javascript
localStorage.setItem('auth_token', '<your-test-token>')
```

4. 刷新页面

✅ / ❌ 

---

#### 3.2 检查网络请求

在浏览器控制台的 Network 标签中：

1. 应该看到请求 `http://localhost:5001/api/calls/summary`
2. 请求头应该包含 `Authorization: Bearer ...`
3. 响应应该是 200 或有数据返回

✅ / ❌ 

---

#### 3.3 检查控制台日志

应该看到：

```
📤 后端API请求: GET /api/calls/summary?days=3
📥 后端API响应: ...
```

✅ / ❌ 

---

#### 3.4 UI 功能测试

- [ ] 页面正常加载
- [ ] 选择天数按钮工作
- [ ] 加载数据按钮工作
- [ ] 数据正确显示（如果有数据）
- [ ] 没有 JavaScript 错误

✅ / ❌ 

---

### 阶段 4：完整流程测试

#### 4.1 完整数据流程

1. 清空数据库：
```bash
cd backend
rm business_data.db
python scripts/init_db.py
```

2. 启动后端：`python run.py`

3. 同步数据（使用 Postman 或 curl）：
```bash
curl -X POST http://localhost:5001/api/calls/sync \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 3}'
```

4. 检查数据库：
```bash
sqlite3 business_data.db "SELECT COUNT(*) FROM call_records;"
```

5. 前端查看数据：
   - 打开 http://localhost:3001
   - 设置 Token
   - 加载数据
   - 应该能看到统计数据

✅ / ❌ 

---

## 🐛 常见问题排查

### 问题 1：后端启动失败

**检查**：
```bash
# 查看 Python 版本
python --version  # 应该 >= 3.8

# 查看依赖
pip list

# 重新安装
pip install -r requirements.txt
```

---

### 问题 2：数据库错误

**解决**：
```bash
cd backend
rm business_data.db  # 删除数据库
python scripts/init_db.py  # 重新初始化
```

---

### 问题 3：Token 无效

**解决**：
```bash
# 重新生成 Token
python scripts/generate_test_token.py

# 在浏览器重新设置
localStorage.setItem('auth_token', '新Token')
```

---

### 问题 4：CORS 错误

**检查**：
1. 后端是否启动在 5001 端口？
2. 前端是否启动在 3001 端口？
3. 查看 `backend/app/__init__.py` 的 CORS 配置

---

### 问题 5：数据同步失败

**检查**：
1. `.env` 文件中的 `GUANKE_API_SECRET` 是否正确？
2. 网络是否能访问 `https://open-api.gooki.com`？
3. 查看后端控制台的错误日志

---

## 📊 性能测试（可选）

### 测试数据加载速度

```bash
# 测试获取 30 天数据的性能
time curl -H "Authorization: Bearer <token>" \
  "http://localhost:5001/api/calls/summary?days=30"
```

**预期**：< 2 秒

---

### 测试数据同步速度

```bash
# 同步 30 天数据
time curl -X POST http://localhost:5001/api/calls/sync \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

**预期**：根据数据量，可能需要 10-60 秒

---

## 📝 测试报告模板

### 测试环境

- 操作系统：macOS / Windows / Linux
- Python 版本：
- Node.js 版本：
- 测试时间：

### 测试结果

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 后端健康检查 | ✅ / ❌ | |
| Token 生成 | ✅ / ❌ | |
| 认证测试 | ✅ / ❌ | |
| 数据同步 | ✅ / ❌ | |
| 数据库验证 | ✅ / ❌ | |
| 前端集成 | ✅ / ❌ | |
| 完整流程 | ✅ / ❌ | |

### 发现的问题

1. 
2. 
3. 

### 结论

- [ ] 所有测试通过，可以部署
- [ ] 有问题需要修复

---

**测试人员**：  
**测试日期**：  
**版本**：v2.0

































