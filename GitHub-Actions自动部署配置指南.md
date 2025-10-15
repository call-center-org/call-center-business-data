# GitHub Actions 自动部署到CloudBase配置指南

## ✅ 已完成的工作

我已经为您创建了GitHub Actions配置文件：
- 文件位置：`.github/workflows/deploy.yml`
- 功能：自动构建并部署到腾讯云CloudBase

## 🔑 需要配置的密钥（重要！）

为了让GitHub Actions能够部署到CloudBase，需要配置腾讯云API密钥。

### 步骤1：获取腾讯云API密钥

1. **访问腾讯云密钥管理页面**
   ```
   https://console.cloud.tencent.com/cam/capi
   ```

2. **创建密钥**（如果还没有）
   - 点击"新建密钥"
   - 会生成 `SecretId` 和 `SecretKey`
   - ⚠️ **立即复制保存**，SecretKey只显示一次！

3. **记录信息**
   - `SecretId`：类似 `AKIDxxxxxxxxxxxxx`
   - `SecretKey`：类似 `xxxxxxxxxxxxxxxx`

---

### 步骤2：在GitHub仓库中配置Secrets

1. **打开GitHub仓库设置**
   ```
   https://github.com/tom88115/outbound-agent-data/settings/secrets/actions
   ```

2. **添加第一个Secret**
   - 点击 "New repository secret"
   - Name: `CLOUDBASE_SECRET_ID`
   - Value: 粘贴您的 SecretId
   - 点击 "Add secret"

3. **添加第二个Secret**
   - 再次点击 "New repository secret"
   - Name: `CLOUDBASE_SECRET_KEY`
   - Value: 粘贴您的 SecretKey
   - 点击 "Add secret"

---

### 步骤3：提交配置文件到GitHub

在终端运行以下命令：

```bash
cd /Users/tomnice/outbound-agent-data
git add .github/workflows/deploy.yml
git commit -m "添加GitHub Actions自动部署配置"
git push origin main
```

---

### 步骤4：验证自动部署

1. **推送代码后**
   - 访问：https://github.com/tom88115/outbound-agent-data/actions
   - 应该能看到正在运行的工作流

2. **查看部署进度**
   - 点击工作流名称
   - 可以看到详细的部署日志
   - 等待约2-3分钟

3. **部署成功**
   - 工作流显示绿色✓
   - 网站自动更新

---

## 🎉 配置完成后的工作流程

### 以后您只需要：

```bash
# 1. 修改代码
# ... 编辑文件 ...

# 2. 提交并推送
git add .
git commit -m "更新功能：XXX"
git push origin main

# 3. 完全自动部署！
# GitHub Actions自动：
# - 安装依赖
# - 构建项目
# - 部署到CloudBase
# - 1-2分钟后网站更新
```

**您什么都不用做！** ✨

---

## 📋 完整步骤总结

### ✅ 需要完成的步骤：

1. ☐ 获取腾讯云API密钥
   - 访问：https://console.cloud.tencent.com/cam/capi
   - 创建或获取 SecretId 和 SecretKey

2. ☐ 配置GitHub Secrets
   - 访问：https://github.com/tom88115/outbound-agent-data/settings/secrets/actions
   - 添加 `CLOUDBASE_SECRET_ID`
   - 添加 `CLOUDBASE_SECRET_KEY`

3. ☐ 推送配置文件
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "添加GitHub Actions自动部署"
   git push origin main
   ```

4. ☐ 验证部署
   - 访问：https://github.com/tom88115/outbound-agent-data/actions
   - 查看工作流运行状态

---

## ⚠️ 安全提示

1. **不要将API密钥提交到代码中**
   - 只在GitHub Secrets中配置
   - 永远不要写在代码文件里

2. **定期轮换密钥**
   - 建议每3-6个月更换一次

3. **最小权限原则**
   - 可以创建子账号，只给CloudBase权限

---

## 🔍 故障排查

### 如果部署失败：

1. **检查Secrets配置**
   - 确认两个Secret都已添加
   - 确认名称完全正确（区分大小写）

2. **查看错误日志**
   - 在GitHub Actions页面查看详细日志
   - 根据错误信息调整

3. **手动测试命令**
   - 本地运行 `npm run build` 确认构建成功
   - 确认环境ID正确

---

## 💡 优势

使用GitHub Actions自动部署的好处：

- ✅ **完全自动化**：推送即部署
- ✅ **版本控制**：所有部署都有记录
- ✅ **失败通知**：部署失败会收到邮件
- ✅ **回滚简单**：可以重新运行之前的工作流
- ✅ **团队协作**：其他开发者也能自动部署

---

**现在请按照步骤配置API密钥和GitHub Secrets！** 🚀

