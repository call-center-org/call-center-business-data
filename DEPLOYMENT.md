# 🚀 外网部署指南

本文档将指导您如何将"外呼坐席数据获取系统"部署到外网，让团队成员可以通过互联网访问。

## 📋 目录
- [方案一：Vercel 部署（推荐）](#方案一vercel-部署推荐)
- [方案二：Netlify 部署](#方案二netlify-部署)
- [方案三：内网穿透（临时方案）](#方案三内网穿透临时方案)

---

## 方案一：Vercel 部署（推荐）

### ✨ 优势
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（推送代码自动更新）
- ✅ 简单易用

### 📝 步骤

#### 1. 上传代码到 GitHub

**1.1 创建 GitHub 仓库**
1. 访问 https://github.com
2. 登录您的账号
3. 点击右上角 "+" → "New repository"
4. 填写信息：
   - Repository name: `outbound-agent-data`
   - Description: `外呼坐席数据获取系统`
   - 选择 `Public`（公开）或 `Private`（私有，需要付费）
   - **不要勾选** "Add a README file"
5. 点击 "Create repository"

**1.2 关联并推送代码**
在终端运行以下命令：
```bash
cd /Users/tomnice/outbound-agent-data

# 添加远程仓库（替换为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/outbound-agent-data.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 2. 部署到 Vercel

**2.1 注册 Vercel**
1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub" 用 GitHub 账号登录

**2.2 导入项目**
1. 登录后点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 找到 `outbound-agent-data` 仓库，点击 "Import"
4. 配置项目：
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. 点击 "Deploy"

**2.3 等待部署完成**
- 大约 1-2 分钟后，部署完成
- 您会看到一个类似 `https://outbound-agent-data.vercel.app` 的网址
- 这就是您的外网访问地址！

**2.4 自定义域名（可选）**
1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入您自己的域名（需要先购买域名）
3. 按照提示配置 DNS 解析

---

## 方案二：Netlify 部署

### 📝 步骤

#### 1. 上传代码到 GitHub
（同方案一的步骤 1）

#### 2. 部署到 Netlify

**2.1 注册 Netlify**
1. 访问 https://netlify.com
2. 点击 "Sign up"
3. 选择 "GitHub" 登录

**2.2 导入项目**
1. 登录后点击 "Add new site" → "Import an existing project"
2. 选择 "GitHub"
3. 授权并选择 `outbound-agent-data` 仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 "Deploy site"

**2.3 访问网站**
- 部署完成后，会生成一个 `https://random-name.netlify.app` 的网址
- 可以在 "Site settings" → "Domain management" 中自定义域名

---

## 方案三：内网穿透（临时方案）

### ⚠️ 适用场景
- 临时演示
- 测试用途
- 不想注册账号

### 📝 使用 ngrok

**3.1 安装 ngrok**
```bash
# macOS
brew install ngrok

# 或下载安装包
# 访问 https://ngrok.com/download
```

**3.2 启动项目**
```bash
cd /Users/tomnice/outbound-agent-data
npm run dev
```
（项目运行在 http://localhost:3001）

**3.3 启动 ngrok**
打开新的终端窗口：
```bash
ngrok http 3001
```

**3.4 获取外网地址**
- 终端会显示一个 `https://xxxx.ngrok.io` 的地址
- 团队成员可以通过这个地址访问
- ⚠️ 注意：每次重启 ngrok，地址会变化（付费版可固定）

---

## 🔐 安全建议

### API 密钥保护
由于您的代码中包含 API 用户名和密码：
```javascript
// src/utils/apiConfig.js
CREDENTIALS: {
  username: '江苏职场',
  password: 'Rodin310#'
}
```

**建议做法：**

1. **仅限内部团队访问**
   - 不要将网址公开在互联网上
   - 只分享给团队成员

2. **添加访问密码（推荐）**
   - 可以为网站添加一个简单的登录验证
   - 只有输入正确密码才能访问

3. **使用环境变量（最佳实践）**
   - 将敏感信息移到环境变量
   - Vercel/Netlify 支持配置环境变量

---

## 📱 访问方式

部署完成后，团队成员可以：
- ✅ 电脑浏览器访问
- ✅ 手机浏览器访问
- ✅ 平板访问
- ✅ 任何有网络的设备

---

## 🔄 如何更新

### 自动更新（Vercel/Netlify）
1. 在本地修改代码
2. 提交并推送到 GitHub：
   ```bash
   git add .
   git commit -m "更新说明"
   git push
   ```
3. Vercel/Netlify 会自动检测并重新部署
4. 1-2 分钟后，网站自动更新

---

## 💡 推荐方案对比

| 方案 | 费用 | 稳定性 | 易用性 | 更新方式 |
|------|------|--------|--------|----------|
| **Vercel** | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 自动 |
| **Netlify** | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 自动 |
| **ngrok** | 免费 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 手动 |

**最推荐：Vercel** ✨

---

## ❓ 常见问题

### Q1: 部署后无法访问 API？
A: 检查 API 配置文件中的 URL 是否正确，确保可以从外网访问到 API 服务器。

### Q2: 如何更改网址？
A: 在 Vercel/Netlify 的项目设置中可以自定义域名。

### Q3: 部署失败怎么办？
A: 检查构建日志，通常是依赖安装或构建命令配置问题。

### Q4: 免费版有限制吗？
A: Vercel 和 Netlify 免费版对个人和小团队完全够用，有带宽和构建次数限制，但很宽松。

---

## 📞 需要帮助？

如有问题，可以：
1. 查看 Vercel 文档: https://vercel.com/docs
2. 查看 Netlify 文档: https://docs.netlify.com
3. 检查项目的 GitHub Issues

---

**祝您部署顺利！🎉**

