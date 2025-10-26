# 🚀 重新部署到 Zeabur 指南

## 当前问题
后端服务的环境变量配置有问题，导致无法正常启动。

## 🔧 解决方案（两个选项）

### ✅ 方案 A：在 Zeabur 控制台手动添加环境变量（推荐）

1. **打开 Zeabur 控制台**
   - 访问：https://zeabur.cn/projects/68f27667b0efc3da1374455e/services/68fde9f429c72e01dc8ac7ab
   
2. **点击「环境变量」标签**

3. **删除所有现有环境变量**
   - 点击每个变量右侧的垃圾桶图标

4. **逐个添加以下环境变量**（点击「新增环境变量」）：

   ```
   Key: DATABASE_URL
   Value: sqlite:////app/instance/business_data.db
   
   Key: FLASK_ENV
   Value: production
   
   Key: PORT
   Value: 8080
   
   Key: SECRET_KEY
   Value: aaac407c031fb2de0f23eb939d3824af868156eb8571d10d66d16cc2be53317e
   
   Key: JWT_SECRET_KEY
   Value: f217e2f5b0a5cd52c66d6ba6c4d5d67ec50d390c0889c2204ce549cf0e29534e
   
   Key: GUANKE_USERNAME
   Value: 江苏职场
   
   Key: GUANKE_PASSWORD
   Value: Rodin310#
   ```

5. **点击「重新部署」按钮**

6. **等待 2-3 分钟**，然后访问：
   ```
   https://call-center-business-api.zeabur.app/health
   ```

---

### 方案 B：使用 Zeabur CLI 重新部署

如果方案 A 不起作用，可以尝试通过 CLI 重新部署：

```bash
# 1. 进入项目目录
cd /Users/tomnice/cursor/call-center-workspace/call-center-business-data

# 2. 推送新的提交触发重新部署
git add .
git commit -m "fix: 修复 Zeabur 环境变量配置"
git push origin main
```

---

## 📝 验证步骤

部署成功后，验证以下 URL：

1. **后端健康检查**：
   ```
   https://call-center-business-api.zeabur.app/health
   ```
   应该返回：`{"status": "ok"}`

2. **后端 API 测试**：
   ```
   https://call-center-business-api.zeabur.app/api/stats/daily/2024-10-26
   ```
   应该返回当天的统计数据

---

## 🆘 如果还是不行

请告诉我以下信息：
1. 您选择了哪个方案？
2. 在 Zeabur 控制台的「日志」标签页中，最新的错误是什么？

我会继续帮您解决！

