# 📦 GitHub 仓库设置指南

## 🎯 快速开始

### 步骤 1: 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `outbound-agent-data`
   - **Description**: `外呼坐席数据获取系统 - 实时统计和分析外呼数据`
   - **Visibility**: 选择 Private（私有，推荐）
   - ❌ **不要勾选** "Initialize this repository with a README"
3. 点击 "Create repository"

### 步骤 2: 复制 GitHub 提供的命令

创建仓库后，GitHub 会显示类似以下的命令。**但请使用下面我们准备好的命令！**

### 步骤 3: 在终端执行以下命令

```bash
# 进入项目目录
cd /Users/tomnice/outbound-agent-data

# 添加远程仓库（请替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/outbound-agent-data.git

# 推送代码到 GitHub
git push -u origin main
```

**⚠️ 重要：** 请将 `YOUR_USERNAME` 替换为您的 GitHub 用户名！

### 示例

如果您的 GitHub 用户名是 `tomnice`，命令应该是：
```bash
git remote add origin https://github.com/tomnice/outbound-agent-data.git
git push -u origin main
```

---

## 🔑 如果需要输入账号密码

GitHub 现在要求使用 Personal Access Token（个人访问令牌）而不是密码。

### 创建 Personal Access Token

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写信息：
   - **Note**: `outbound-agent-data`
   - **Expiration**: 选择有效期（建议 90 days）
   - **Select scopes**: 勾选 `repo`（完整仓库访问权限）
4. 点击 "Generate token"
5. **立即复制并保存 Token**（只显示一次！）

### 使用 Token 推送

执行 `git push` 时：
- **Username**: 您的 GitHub 用户名
- **Password**: 粘贴刚才复制的 Token（不是您的 GitHub 密码）

---

## ✅ 验证上传成功

推送成功后：
1. 刷新 GitHub 仓库页面
2. 您应该能看到所有项目文件
3. 包括：
   - `src/` 目录
   - `package.json`
   - `README.md`
   - 等等

---

## 🚀 下一步：部署到 Vercel

上传到 GitHub 后，请参考 `DEPLOYMENT.md` 文件中的"方案一：Vercel 部署"章节。

简要步骤：
1. 访问 https://vercel.com
2. 用 GitHub 账号登录
3. 导入 `outbound-agent-data` 项目
4. 点击 Deploy
5. 完成！获得外网访问地址 🎉

---

## 📝 后续更新代码

每次修改代码后，使用以下命令同步到 GitHub：

```bash
# 查看修改的文件
git status

# 添加所有修改
git add .

# 提交修改（填写修改说明）
git commit -m "添加新功能：XXX"

# 推送到 GitHub
git push
```

推送后，Vercel 会自动检测并重新部署，1-2 分钟后网站自动更新！

---

## 🔧 常用 Git 命令

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库地址
git remote -v

# 拉取最新代码（如果有团队协作）
git pull

# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main
```

---

**准备好了吗？开始上传到 GitHub 吧！** 🚀

