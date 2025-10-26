# 🚀 Zeabur CLI 快速开始

## 📊 当前状态

✅ 你的项目已配置 Zeabur（`zeabur.json` 存在）  
❌ 但还没有安装 Zeabur CLI  
❌ 还没有登录 Zeabur 账号

---

## 🎯 Zeabur CLI 能干什么？

通过命令行，你可以：
- ✅ **查看部署状态** - 不用打开网页
- ✅ **实时查看日志** - 调试生产问题
- ✅ **管理服务** - 重启、停止、启动
- ✅ **查看环境变量** - 快速检查配置
- ✅ **触发部署** - 一键部署新版本
- ✅ **监控域名** - 查看访问地址

**比网页操作快 10 倍！**

---

## 🚀 三步开始使用

### 步骤 1：安装 Zeabur CLI

**最简单的方式**（选一个）：

```bash
# 方式 1：使用我创建的脚本（推荐）
bash 安装Zeabur_CLI.sh

# 方式 2：使用 Homebrew（macOS）
brew tap zeabur/tap && brew install zeabur

# 方式 3：使用 npm
npm install -g @zeabur/cli

# 方式 4：使用 curl
curl -fsSL https://cli.zeabur.com/install.sh | bash
```

**验证安装**：
```bash
zeabur --version
```

---

### 步骤 2：登录 Zeabur

```bash
zeabur auth login
```

这会：
1. 自动打开浏览器
2. 跳转到 Zeabur 登录页面
3. 授权后自动保存凭证

**验证登录**：
```bash
zeabur auth whoami
```

---

### 步骤 3：查看部署状态

**使用我创建的脚本**（一键查看所有信息）：
```bash
bash 查看Zeabur部署状态.sh
```

**或者手动查询**：
```bash
# 列出所有项目
zeabur project list

# 查看服务列表（替换成你的项目名）
zeabur service list --project YOUR_PROJECT_NAME

# 查看实时日志
zeabur logs backend --project YOUR_PROJECT_NAME --follow
```

---

## 💡 常用命令速查

### 🔍 查看状态

```bash
# 列出所有项目
zeabur project list

# 查看项目详情
zeabur project get call-center-lead

# 列出服务
zeabur service list --project call-center-lead

# 查看服务详情
zeabur service get backend --project call-center-lead
```

---

### 📋 查看日志

```bash
# 实时日志（后端）
zeabur logs backend --project call-center-lead --follow

# 实时日志（前端）
zeabur logs frontend --project call-center-lead --follow

# 查看最近 50 行
zeabur logs backend --project call-center-lead --tail 50

# 查看最近 1 小时的日志
zeabur logs backend --project call-center-lead --since 1h
```

**提示**：按 `Ctrl+C` 停止实时日志

---

### 🔄 服务管理

```bash
# 重启服务
zeabur service restart backend --project call-center-lead

# 查看部署历史
zeabur deployment list --project call-center-lead --service backend

# 触发新部署
zeabur deploy --project call-center-lead --service backend
```

---

### 🌐 域名查看

```bash
# 查看后端域名
zeabur domain list --project call-center-lead --service backend

# 查看前端域名
zeabur domain list --project call-center-lead --service frontend
```

---

### ⚙️ 环境变量

```bash
# 查看所有环境变量
zeabur env list --project call-center-lead --service backend

# 添加环境变量
zeabur env set KEY=VALUE --project call-center-lead --service backend

# 删除环境变量
zeabur env unset KEY --project call-center-lead --service backend
```

---

## 🎯 实用场景

### 场景 1：生产环境出问题了

**快速排查**：
```bash
# 1. 查看实时日志
zeabur logs backend --project call-center-lead --follow

# 2. 如果需要重启
zeabur service restart backend --project call-center-lead

# 3. 查看部署历史，看看最近改了什么
zeabur deployment list --project call-center-lead --service backend
```

---

### 场景 2：想知道当前部署状态

**一键查看**：
```bash
bash 查看Zeabur部署状态.sh
```

这会显示：
- ✅ 项目列表
- ✅ 服务状态
- ✅ 部署历史
- ✅ 域名配置

---

### 场景 3：修改环境变量

```bash
# 1. 查看当前环境变量
zeabur env list --project call-center-lead --service backend

# 2. 修改某个变量
zeabur env set DATABASE_URL=new_value --project call-center-lead --service backend

# 3. 重启服务使其生效
zeabur service restart backend --project call-center-lead
```

---

### 场景 4：查看访问地址

```bash
# 查看域名
zeabur domain list --project call-center-lead --service backend
zeabur domain list --project call-center-lead --service frontend
```

---

## 🔥 创建快捷命令

为了更方便使用，可以创建别名。

**编辑配置文件**：
```bash
nano ~/.zshrc
```

**添加以下内容**：
```bash
# Zeabur 快捷命令
alias zb='zeabur'
alias zblist='zeabur service list --project call-center-lead'
alias zbstatus='bash ~/cursor/call-center-workspace/call-center-business-data/查看Zeabur部署状态.sh'
alias zblogs-backend='zeabur logs backend --project call-center-lead --follow'
alias zblogs-frontend='zeabur logs frontend --project call-center-lead --follow'
alias zbrestart-backend='zeabur service restart backend --project call-center-lead'
alias zbrestart-frontend='zeabur service restart frontend --project call-center-lead'
```

**保存后重新加载**：
```bash
source ~/.zshrc
```

**使用快捷命令**：
```bash
zbstatus           # 查看完整状态
zblist             # 列出所有服务
zblogs-backend     # 查看后端日志
zbrestart-backend  # 重启后端
```

---

## 📊 我创建的工具

### 1. `安装Zeabur_CLI.sh`
**功能**：一键安装 Zeabur CLI
```bash
bash 安装Zeabur_CLI.sh
```

---

### 2. `查看Zeabur部署状态.sh`
**功能**：查看完整的部署信息
```bash
bash 查看Zeabur部署状态.sh
```

**显示内容**：
- ✅ 所有项目
- ✅ 服务列表和状态
- ✅ 最近的部署
- ✅ 域名配置
- ✅ 常用命令提示

---

### 3. `Zeabur_CLI使用指南.md`
**功能**：详细的 CLI 使用文档
```bash
cat Zeabur_CLI使用指南.md
```

---

## 🚨 注意事项

### 安全提醒

1. **不要泄露 Token**
   - Token 保存在 `~/.zeabur/token`
   - 不要分享这个文件
   - 不要提交到 Git

2. **谨慎操作生产环境**
   - 重启会导致短暂的服务中断
   - 删除操作无法撤销
   - 修改环境变量前先备份

---

### 常见问题

**Q: 命令找不到？**
```bash
# 重新加载 shell
source ~/.zshrc

# 检查安装
zeabur --version
```

**Q: 未授权错误？**
```bash
# 重新登录
zeabur auth login
```

**Q: 找不到项目？**
```bash
# 列出所有项目
zeabur project list

# 使用正确的项目名称
```

---

## 🎉 立即开始

### 如果你还没安装：

```bash
# 运行安装脚本
bash 安装Zeabur_CLI.sh
```

### 如果已经安装：

```bash
# 登录
zeabur auth login

# 查看部署状态
bash 查看Zeabur部署状态.sh
```

---

## 📚 更多资源

- **详细文档**：`Zeabur_CLI使用指南.md`
- **官方文档**：https://zeabur.com/docs/cli
- **Zeabur Dashboard**：https://dash.zeabur.com

---

## 💬 快速对比

| 操作 | 网页端 | CLI |
|------|--------|-----|
| 查看日志 | 需要打开浏览器 → 登录 → 找项目 → 点日志 | `zblogs-backend` |
| 重启服务 | 浏览器 → 登录 → 找服务 → 点重启 | `zbrestart-backend` |
| 查看状态 | 需要多次点击 | `zbstatus` |
| 切换项目 | 需要重新导航 | 一条命令 |

**CLI 效率提升 10 倍！**

---

**生成时间**：2025-10-18  
**下一步**：运行 `bash 安装Zeabur_CLI.sh`

