# 🔧 Cursor Marketplace 修复指南

## ✅ 已完成的诊断

### 1. 网络连接测试
- ✅ 基础网络连接正常
- ✅ 可以访问 open-vsx.org
- ⚠️ marketplace.visualstudio.com 连接异常

### 2. 系统配置检查
- ✅ 系统代理：未启用
- ✅ VPN：已关闭
- ✅ Hosts 文件：正常
- ℹ️ DNS：使用 IPv6（可能需要优化）

### 3. 已执行的修复
- ✅ 清除了 Cursor 主缓存
- ✅ 清除了扩展缓存目录

---

## 🎯 解决方案（按优先级）

### 方案 1：重新配置 Cursor 的扩展源 ⭐⭐⭐⭐⭐

Cursor 可能正在使用有问题的扩展市场源。

**操作步骤：**

1. **打开 Cursor 设置**
   ```
   Cmd+, (或 File → Preferences → Settings)
   ```

2. **搜索 "marketplace" 或 "gallery"**

3. **查找这些设置项：**
   - `extensions.gallery.serviceUrl`
   - `extensions.gallery.itemUrl`
   - `extensions.gallery.resourceUrlTemplate`

4. **如果存在，尝试删除或重置这些设置**

5. **重启 Cursor**

---

### 方案 2：使用备用 DNS ⭐⭐⭐⭐

你当前使用的是 IPv6 DNS，可能导致解析问题。

**操作步骤：**

1. **打开系统设置**
   - 系统偏好设置 → 网络

2. **选择你的网络（Wi-Fi 或以太网）**

3. **点击"高级" → "DNS"**

4. **添加以下 DNS 服务器：**
   ```
   8.8.8.8        (Google DNS)
   8.8.4.4        (Google 备用)
   114.114.114.114 (国内备用)
   ```

5. **点击"好" → "应用"**

6. **重启 Cursor 并测试**

---

### 方案 3：修改 Cursor 的网络设置 ⭐⭐⭐⭐

**操作步骤：**

1. **在 Cursor 中按 `Cmd+Shift+P`**

2. **输入并选择：**
   ```
   Preferences: Open User Settings (JSON)
   ```

3. **添加以下配置：**
   ```json
   {
     "http.proxySupport": "on",
     "http.proxyStrictSSL": false,
     "extensions.autoCheckUpdates": false,
     "extensions.autoUpdate": false
   }
   ```

4. **保存并重启 Cursor**

---

### 方案 4：完全重置 Cursor ⭐⭐⭐

如果以上方法都不行，完全重置 Cursor。

**⚠️ 警告：这会删除所有设置和扩展**

**操作步骤：**

1. **完全退出 Cursor** (`Cmd+Q`)

2. **执行以下命令：**
   ```bash
   # 备份设置（可选）
   cp -r ~/Library/Application\ Support/Cursor ~/Desktop/Cursor_Backup
   
   # 删除 Cursor 配置
   rm -rf ~/Library/Application\ Support/Cursor
   rm -rf ~/Library/Caches/Cursor
   
   # 重新打开 Cursor
   ```

3. **重新安装扩展**

---

### 方案 5：使用手机热点测试 ⭐⭐⭐

可能是当前网络环境的问题。

**操作步骤：**

1. **打开手机热点**
2. **Mac 连接手机热点**
3. **打开 Cursor 测试扩展市场**
4. **如果能用，说明是原网络问题**

---

### 方案 6：手动下载并安装扩展 ⭐⭐

绕过扩展市场，直接安装。

**操作步骤：**

1. **访问 VSCode 扩展市场网页版：**
   ```
   https://marketplace.visualstudio.com/vscode
   ```

2. **搜索你要的扩展（如 "CloudBase"）**

3. **下载 .vsix 文件**

4. **在 Cursor 中：**
   ```
   Cmd+Shift+P → "Extensions: Install from VSIX..."
   选择下载的 .vsix 文件
   ```

---

## 🧪 快速测试命令

执行以下命令测试连接：

```bash
# 测试 VSCode Marketplace API
curl -v https://marketplace.visualstudio.com/_apis/public/gallery 2>&1 | grep -E "Connected|HTTP"

# 测试扩展下载
curl -I https://marketplace.visualstudio.com/_apis/public/gallery/publishers/Tencent/vsextensions/cloudbase-toolkit/latest/vspackage
```

---

## 💡 推荐顺序

**如果你不想太麻烦：**

1. ✅ 先试 **方案 2（更换 DNS）** - 最简单，最可能有效
2. ✅ 再试 **方案 5（手机热点）** - 快速验证是否是网络问题
3. ✅ 然后试 **方案 1（重新配置扩展源）**
4. ✅ 最后试 **方案 6（手动安装）** - 保底方案

---

## 🚨 如果所有方法都不行

**可能的原因：**
- 公司/学校网络限制
- 防火墙阻止
- ISP 限制
- 地区网络限制

**终极解决方案：**
- 使用命令行安装扩展（已经成功装了 13 个）
- 或者不用扩展，直接用 CLI 工具部署

---

## 📞 下一步

**立即执行：**

1. **方案 2：更换 DNS 为 8.8.8.8**
2. **重启 Cursor**
3. **测试扩展市场**

**如果还是不行，告诉我具体的错误信息！**

---

生成时间：2025-10-16

