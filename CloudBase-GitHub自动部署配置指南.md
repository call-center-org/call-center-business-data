# CloudBase GitHub 自动部署配置指南

## 📋 配置步骤

### 步骤1：打开CloudBase控制台

访问：https://console.cloud.tencent.com/tcb

或者：https://console.cloud.tencent.com/tcb/env/index?envId=cloud1-6gt5ulxm10210d0f

---

### 步骤2：进入静态网站托管

1. 在左侧菜单找到 **"静态网站托管"**
2. 点击进入

---

### 步骤3：配置部署来源

在静态网站托管页面：

1. **找到"部署"或"设置"选项**
   - 可能在页面右上角
   - 或者在"部署管理"标签中

2. **选择部署方式**
   - 点击 "新建部署" 或 "配置部署"
   - 选择 **"GitHub"** 作为部署来源

---

### 步骤4：授权GitHub

1. **点击"授权GitHub账号"**
   - 会跳转到GitHub授权页面
   - 使用您的GitHub账号登录（tom88115）

2. **授权CloudBase访问**
   - 点击 "Authorize Tencent CloudBase"
   - 可能会要求输入GitHub密码确认

3. **返回CloudBase控制台**
   - 授权成功后自动返回

---

### 步骤5：选择仓库和配置

1. **选择仓库**
   ```
   tom88115/outbound-agent-data
   ```

2. **选择分支**
   ```
   main
   ```

3. **配置构建参数**（重要！）
   
   **框架预设**：
   - 选择 `Vite` 或 `Node.js`
   
   **构建命令**：
   ```bash
   npm install && npm run build
   ```
   
   **输出目录**：
   ```
   dist
   ```
   
   **Node版本**（如果有这个选项）：
   ```
   16.x 或 18.x
   ```

4. **环境变量**（可选）
   - 当前项目不需要，跳过

---

### 步骤6：保存并开始部署

1. **点击"保存"或"开始部署"**
   
2. **首次部署**
   - 等待3-5分钟
   - 可以看到构建日志
   - 显示构建进度

3. **部署成功**
   - 显示"部署成功"
   - 访问地址不变：`https://cloud1-6gt5ulxm10210d0f-1300255017.tcloudbaseapp.com`

---

## 🎉 配置完成后的工作流程

以后您只需要：

### 1. 本地修改代码
```bash
# 修改您的代码...
```

### 2. 提交到GitHub
```bash
git add .
git commit -m "更新功能：XXX"
git push origin main
```

### 3. 自动部署！
- CloudBase自动检测到代码更新
- 自动开始构建（npm install && npm run build）
- 自动部署到线上
- 1-2分钟后，网站自动更新！

**您什么都不用做！** ✨

---

## ⚠️ 可能遇到的问题

### 问题1：找不到"新建部署"或GitHub选项

**解决方案**：
1. 查看页面顶部是否有 "静态网站托管" 和 "静态网站托管" 两个标签
2. 尝试切换标签
3. 或者查看 "设置" 菜单

### 问题2：GitHub授权失败

**解决方案**：
1. 检查网络连接
2. 使用无痕模式重试
3. 或者刷新页面重新授权

### 问题3：构建失败

**检查项**：
1. 构建命令是否正确：`npm install && npm run build`
2. 输出目录是否正确：`dist`
3. Node版本是否兼容

**查看构建日志**：
- 在部署详情页可以看到完整的构建日志
- 根据错误信息调整配置

---

## 📞 需要帮助？

如果在配置过程中遇到问题：
1. 截图当前页面
2. 告诉我具体的错误信息
3. 我会立即帮您解决！

---

## 💡 提示

**如果CloudBase控制台界面找不到GitHub集成选项**，可能是因为：
1. 需要在不同的入口（如"持续部署"菜单）
2. 或者CloudBase可能需要通过其他方式配置

如果遇到这种情况，告诉我，我会提供替代方案（使用GitHub Actions）。

---

**现在请打开CloudBase控制台开始配置！** 🚀

访问：https://console.cloud.tencent.com/tcb/env/index?envId=cloud1-6gt5ulxm10210d0f

