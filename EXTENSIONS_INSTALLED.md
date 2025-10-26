# 🎉 扩展安装报告

安装时间：2025-10-16

---

## ✅ 已成功安装（13个）

### 🎨 设计与UI
- ✅ **Image Preview** (`kisstkondoros.vscode-gutter-preview`)
  - 在代码中预览图片

- ✅ **Material Icon Theme** (`PKief.material-icon-theme`)
  - 漂亮的文件图标

- ✅ **Peacock** (`johnpapa.vscode-peacock`)
  - 给不同项目设置不同颜色

### 📊 项目管理
- ✅ **Todo Tree** (`Gruntfuggly.todo-tree`)
  - 自动收集项目中的 TODO 任务

- ✅ **Project Manager** (`alefragnani.project-manager`)
  - 快速切换多个项目

- ✅ **WakaTime** (`WakaTime.vscode-wakatime`)
  - 自动追踪工作时间

### 📝 文档与笔记
- ✅ **Markdown All in One** (`yzhang.markdown-all-in-one`)
  - Markdown 编辑增强

- ✅ **Draw.io Integration** (`hediet.vscode-drawio`)
  - 在编辑器内画流程图

### 🔍 预览与调试
- ✅ **Live Preview** (`ms-vscode.live-server`)
  - 在编辑器内预览网站

### 🗄️ 数据库
- ✅ **Database Client** (`cweijan.vscode-database-client2`)
  - 图形化数据库管理

### 🌐 API 测试
- ✅ **Thunder Client** (`rangav.vscode-thunder-client`)
  - API 测试工具（类似 Postman）

### 📊 Git 工具
- ✅ **Git Graph** (`mhutchie.git-graph`)
  - 可视化 Git 提交历史

- ✅ **GitLens** (`eamodio.gitlens`)
  - Git 增强工具

---

## ⚠️ 需要手动安装（4个）

### 1. 🎨 Figma for VS Code
- **原因**：扩展ID可能不正确或者需要特殊权限
- **手动安装方法**：
  1. 在 Cursor 中按 `Cmd+Shift+X` 打开扩展面板
  2. 搜索 "Figma"
  3. 找到官方 Figma 扩展并点击安装

### 2. ☁️ CloudBase Toolkit
- **原因**：可能需要腾讯云账号授权
- **手动安装方法**：
  1. 在扩展面板搜索 "CloudBase" 或 "Tencent"
  2. 安装 "CloudBase Toolkit"
  3. 安装后需要登录腾讯云账号

### 3. 📊 CSV to Table
- **原因**：扩展可能已停止维护或ID变更
- **替代方案**：
  1. 搜索 "Rainbow CSV" - 更流行的 CSV 工具
  2. 或搜索 "Excel Viewer" - 可以查看 CSV 和 Excel

### 4. 🚀 Zeabur
- **原因**：Zeabur 目前没有官方 VSCode 扩展
- **替代方案**：
  - 使用 Zeabur CLI 工具
  - 或通过网页端 https://zeabur.com 部署

---

## 🎯 快速激活指南

### 第一步：重启 Cursor
为了让所有扩展生效，请：
1. 按 `Cmd+Q` 完全退出 Cursor
2. 重新打开 Cursor

### 第二步：配置扩展

#### Material Icon Theme（图标主题）
1. 按 `Cmd+Shift+P`
2. 输入 "File Icon Theme"
3. 选择 "Material Icon Theme"

#### Peacock（项目颜色标识）
1. 按 `Cmd+Shift+P`
2. 输入 "Peacock: Change to a Favorite Color"
3. 选择一个喜欢的颜色

#### WakaTime（时间追踪）
1. 首次使用会提示输入 API Key
2. 访问 https://wakatime.com/api-key 获取
3. 输入 API Key 完成配置

#### Thunder Client（API测试）
1. 点击左侧活动栏的 ⚡ 图标
2. 创建新请求测试你的 API

#### Database Client（数据库）
1. 点击左侧活动栏的数据库图标
2. 点击 "+" 添加数据库连接
3. 选择数据库类型并输入连接信息

---

## 📖 使用技巧

### Todo Tree
在代码或文档中添加注释：
```javascript
// TODO: 完成支付功能
// FIXME: 修复登录bug
// ! 重要：这个功能很关键
```

Todo Tree 会自动收集并显示在侧边栏。

### Draw.io
1. 创建新文件：`architecture.drawio`
2. 自动打开绘图界面
3. 画完后保存，文件会包含在项目中

### Git Graph
1. 点击底部状态栏的 "Git Graph" 按钮
2. 或在源代码管理面板点击 "View Git Graph"
3. 可视化查看提交历史

### Live Preview
1. 右键点击 HTML 文件
2. 选择 "Show Preview"
3. 在编辑器内预览网站

---

## 🔧 推荐设置

创建 `.vscode/settings.json`（已自动创建）：

```json
{
  "todo-tree.general.tags": [
    "TODO",
    "FIXME",
    "NOTE",
    "HACK",
    "!",
    "?"
  ],
  "peacock.favoriteColors": [
    {
      "name": "外呼数据系统",
      "value": "#42b883"
    }
  ],
  "gitlens.currentLine.enabled": true,
  "material-icon-theme.activeIconPack": "react"
}
```

---

## 📞 需要帮助？

如果某个扩展安装或使用有问题：

1. **查看扩展文档**：在扩展详情页面有使用说明
2. **重启 Cursor**：很多问题重启就能解决
3. **禁用冲突扩展**：如果有问题，尝试禁用其他扩展
4. **清除缓存**：`Cmd+Shift+P` → "Developer: Reload Window"

---

## 🎊 安装完成！

你现在拥有了一套完整的非技术人员工具链：
- ✅ 项目管理和任务追踪
- ✅ Git 可视化
- ✅ API 测试
- ✅ 数据库管理
- ✅ 实时预览
- ✅ 流程图绘制
- ✅ 时间统计

**祝你使用愉快！** 🚀



