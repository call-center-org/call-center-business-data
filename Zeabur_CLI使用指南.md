# 🚀 Zeabur CLI 使用指南

## 📊 当前状态

根据检查结果：
- ❌ **Zeabur CLI 未安装**
- ❌ **未登录 Zeabur**
- ✅ **项目中有 zeabur.json 配置文件**

---

## 🎯 Zeabur CLI 可以做什么？

通过命令行你可以：
- ✅ 查看所有项目和服务
- ✅ 查看部署状态和日志
- ✅ 部署新版本
- ✅ 管理环境变量
- ✅ 查看域名配置
- ✅ 监控服务运行状态

**比网页端更快更方便！**

---

## 📦 第一步：安装 Zeabur CLI

### 方法 1：使用 Homebrew（推荐 macOS）

```bash
# 添加 Zeabur tap
brew tap zeabur/tap

# 安装 Zeabur CLI
brew install zeabur
```

### 方法 2：使用 npm

```bash
npm install -g @zeabur/cli
```

### 方法 3：使用 curl（直接下载）

```bash
# 下载并安装
curl -fsSL https://cli.zeabur.com/install.sh | bash

# 重新加载 shell 配置
source ~/.zshrc
```

### 验证安装

```bash
zeabur --version
```

如果看到版本号，说明安装成功！

---

## 🔑 第二步：登录 Zeabur

### 使用浏览器登录（推荐）

```bash
zeabur auth login
```

这会：
1. 打开浏览器
2. 跳转到 Zeabur 登录页面
3. 授权后自动保存登录凭证

### 使用 API Token 登录

```bash
# 从 Zeabur 网站获取 API Token
# https://dash.zeabur.com/account/tokens

zeabur auth login --token YOUR_API_TOKEN
```

### 验证登录状态

```bash
zeabur auth whoami
```

---

## 📋 第三步：查看部署情况

### 1. 列出所有项目

```bash
zeabur project list
```

**输出示例：**
```
ID                    NAME                     REGION
proj_xxxxxxxxx        call-center-lead        us-west-1
```

### 2. 查看项目详情

```bash
# 使用项目名称
zeabur project get call-center-lead

# 或使用项目 ID
zeabur project get proj_xxxxxxxxx
```

### 3. 列出服务

```bash
# 列出项目下的所有服务
zeabur service list --project call-center-lead
```

**输出示例：**
```
SERVICE ID          NAME          STATUS      TYPE        UPDATED
svc_xxx1           backend       running     python      2h ago
svc_xxx2           frontend      running     nodejs      2h ago
```

### 4. 查看服务详情

```bash
zeabur service get backend --project call-center-lead
```

### 5. 查看部署状态

```bash
# 查看最新部署
zeabur deployment list --project call-center-lead --service backend

# 查看特定部署的详情
zeabur deployment get deployment_xxxxx
```

### 6. 查看实时日志

```bash
# 查看后端日志
zeabur logs backend --project call-center-lead --follow

# 查看前端日志
zeabur logs frontend --project call-center-lead --follow

# 查看最近 100 行
zeabur logs backend --project call-center-lead --tail 100
```

### 7. 查看域名

```bash
zeabur domain list --project call-center-lead --service backend
```

### 8. 查看环境变量

```bash
zeabur env list --project call-center-lead --service backend
```

---

## 🚀 常用命令速查

### 部署管理

```bash
# 触发新部署
zeabur deploy --project call-center-lead --service backend

# 回滚到上一个版本
zeabur deployment rollback deployment_xxxxx

# 查看部署历史
zeabur deployment list --project call-center-lead --service backend
```

### 环境变量管理

```bash
# 添加环境变量
zeabur env set KEY=VALUE --project call-center-lead --service backend

# 删除环境变量
zeabur env unset KEY --project call-center-lead --service backend

# 批量导入环境变量
zeabur env import .env --project call-center-lead --service backend
```

### 日志查看

```bash
# 实时日志（类似 tail -f）
zeabur logs backend --project call-center-lead --follow

# 查看最近的日志
zeabur logs backend --project call-center-lead --tail 50

# 查看特定时间范围的日志
zeabur logs backend --project call-center-lead --since 1h
```

### 服务管理

```bash
# 重启服务
zeabur service restart backend --project call-center-lead

# 停止服务
zeabur service stop backend --project call-center-lead

# 启动服务
zeabur service start backend --project call-center-lead

# 删除服务
zeabur service delete backend --project call-center-lead
```

### 域名管理

```bash
# 添加自定义域名
zeabur domain add example.com --project call-center-lead --service backend

# 删除域名
zeabur domain remove example.com --project call-center-lead --service backend
```

---

## 💡 实用场景

### 场景 1：快速查看项目状态

```bash
# 一键查看所有信息
zeabur project get call-center-lead
zeabur service list --project call-center-lead
```

### 场景 2：调试生产问题

```bash
# 查看实时日志
zeabur logs backend --project call-center-lead --follow

# 如果需要重启
zeabur service restart backend --project call-center-lead
```

### 场景 3：部署新版本

```bash
# 方法 1：Git push 触发（推荐）
git push origin main

# 方法 2：手动触发
zeabur deploy --project call-center-lead --service backend
```

### 场景 4：修改环境变量

```bash
# 修改环境变量
zeabur env set DATABASE_URL=new_value --project call-center-lead --service backend

# 重启服务使其生效
zeabur service restart backend --project call-center-lead
```

### 场景 5：监控部署进度

```bash
# 查看部署列表
zeabur deployment list --project call-center-lead --service backend

# 查看特定部署的日志
zeabur logs backend --project call-center-lead --deployment deployment_xxxxx
```

---

## 📊 创建快捷命令

在 `~/.zshrc` 或 `~/.bashrc` 中添加别名：

```bash
# Zeabur 快捷命令
alias zb='zeabur'
alias zblist='zeabur service list --project call-center-lead'
alias zbstatus='zeabur project get call-center-lead'
alias zblogs-backend='zeabur logs backend --project call-center-lead --follow'
alias zblogs-frontend='zeabur logs frontend --project call-center-lead --follow'
alias zbdeploy='zeabur deploy --project call-center-lead'
alias zbrestart-backend='zeabur service restart backend --project call-center-lead'
alias zbrestart-frontend='zeabur service restart frontend --project call-center-lead'
```

使用：
```bash
# 重新加载配置
source ~/.zshrc

# 使用快捷命令
zblist           # 列出服务
zbstatus         # 查看项目状态
zblogs-backend   # 查看后端日志
```

---

## 🔧 故障排查

### 问题 1：命令找不到

**错误信息：**
```
zeabur: command not found
```

**解决方法：**
```bash
# 检查是否在 PATH 中
echo $PATH

# 重新加载 shell 配置
source ~/.zshrc

# 或重新安装
curl -fsSL https://cli.zeabur.com/install.sh | bash
```

---

### 问题 2：未授权

**错误信息：**
```
Error: unauthorized
```

**解决方法：**
```bash
# 重新登录
zeabur auth login

# 验证登录状态
zeabur auth whoami
```

---

### 问题 3：找不到项目

**错误信息：**
```
Error: project not found
```

**解决方法：**
```bash
# 列出所有项目
zeabur project list

# 使用正确的项目名称或 ID
zeabur service list --project YOUR_PROJECT_NAME
```

---

## 📚 更多资源

### 官方文档
- [Zeabur CLI 文档](https://zeabur.com/docs/cli)
- [Zeabur 官网](https://zeabur.com)
- [Zeabur Dashboard](https://dash.zeabur.com)

### 获取帮助

```bash
# 查看所有命令
zeabur --help

# 查看特定命令的帮助
zeabur project --help
zeabur service --help
zeabur logs --help
```

---

## 🎯 快速开始 Checklist

- [ ] 安装 Zeabur CLI
- [ ] 登录账号
- [ ] 查看项目列表
- [ ] 查看服务状态
- [ ] 查看日志
- [ ] 设置快捷命令

---

## 🚨 重要提示

1. **API Token 安全**
   - 不要将 Token 提交到 Git
   - 不要在脚本中明文写 Token
   - 定期更换 Token

2. **生产环境操作**
   - 重启服务前三思
   - 修改环境变量要小心
   - 删除操作无法撤销

3. **日志查看**
   - 实时日志会消耗带宽
   - 使用 `--tail` 限制日志数量
   - 大量日志建议下载后分析

---

## 💬 下一步

1. **安装 CLI**
   ```bash
   brew tap zeabur/tap && brew install zeabur
   ```

2. **登录**
   ```bash
   zeabur auth login
   ```

3. **查看部署**
   ```bash
   zeabur project list
   zeabur service list --project call-center-lead
   ```

---

**生成时间**：2025-10-18  
**适用版本**：Zeabur CLI v1.x

