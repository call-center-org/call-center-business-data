# Cursor 续杯工具代理修复指南

## 🚨 问题症状

当遇到以下情况时，说明代理出现问题：
- ✅ 续杯工具的"突破地区限制"功能已开启
- ❌ Cursor 的 Auto 模式无法对话
- ❌ Claude 模型无响应
- ❌ 点击提交按钮后没有任何反应

---

## 🛠️ 快速修复方法

### 方法 1：运行自动修复脚本（推荐）

**在终端中运行以下命令：**

```bash
# 运行修复脚本
~/fix-cursor-proxy.sh
```

或者：

```bash
cd ~/cursor/call-center-workspace/call-center-business-data
./fix-cursor-proxy.sh
```

**脚本会自动完成：**
1. ✅ 检查续杯工具状态
2. ✅ 检查代理端口
3. ✅ 备份当前配置
4. ✅ 清除代理配置
5. ✅ 重启 Cursor

**执行时间：约 10 秒**

---

### 方法 2：手动修复

如果脚本无法运行，可以手动执行以下步骤：

#### 步骤 1：关闭 Cursor
```bash
killall Cursor
```

#### 步骤 2：清除代理配置
在终端中运行：
```bash
cat > ~/Library/Application\ Support/Cursor/User/settings.json << 'EOF'
{
    "database-client.autoSync": true,
    "update.enableWindowsBackgroundUpdates": false,
    "update.mode": "none",
    "http.proxyAuthorization": null,
    "json.schemas": []
}
EOF
```

#### 步骤 3：重启 Cursor
```bash
open -a Cursor
```

#### 步骤 4：重新开启续杯工具代理
- 打开续杯工具
- 开启"突破地区限制"功能
- 等待 5 秒钟

---

## 🧪 测试步骤

修复后，请按以下顺序测试：

### 1. 测试 Auto 模式
- 在 Cursor 中发送一条消息
- 看看是否能正常回复

### 2. 测试 Claude 模型
- 切换到 Claude 模型
- 发送一条消息
- 确认能正常回复

---

## 💡 常见问题

### Q1: 脚本提示"续杯工具未运行"怎么办？
**A:** 先启动续杯工具，然后再运行脚本。

### Q2: 脚本提示"未检测到代理端口"怎么办？
**A:** 在续杯工具中开启"突破地区限制"功能，等待 5 秒后再运行脚本。

### Q3: 运行脚本后还是不行怎么办？
**A:** 联系 AI 助手，说："代理又不行了，Claude语言模型用不了"

### Q4: 配置文件在哪里？
**A:** `~/Library/Application Support/Cursor/User/settings.json`

### Q5: 备份文件在哪里？
**A:** 脚本会自动创建备份，格式为 `settings.json.backup.日期时间`

---

## 📂 文件位置

### 修复脚本
- **主目录**：`~/fix-cursor-proxy.sh`
- **项目目录**：`~/cursor/call-center-workspace/call-center-business-data/fix-cursor-proxy.sh`

### 配置文件
- **Cursor 配置**：`~/Library/Application Support/Cursor/User/settings.json`
- **续杯工具配置**：`~/Library/Application Support/cursor-renewal-client/settings.json`

---

## 🔧 脚本说明

### 脚本功能
1. 检查续杯工具运行状态
2. 检查代理端口是否活动
3. 自动备份当前配置
4. 清除可能导致冲突的代理设置
5. 重启 Cursor 使配置生效

### 为什么要清除代理配置？
因为续杯工具会自动设置系统代理，Cursor 手动配置的代理可能与之冲突，导致无法正常连接。

### 脚本安全性
- ✅ 所有操作都有备份
- ✅ 不会删除任何重要文件
- ✅ 只修改 Cursor 的配置文件
- ✅ 可以随时恢复备份

---

## 📞 需要帮助？

如果脚本无法解决问题，请：
1. 检查续杯工具是否正常运行
2. 确认"突破地区限制"功能已开启
3. 联系 AI 助手获取进一步帮助

**快速求助暗号**：
> "代理又不行了，Claude语言模型用不了"

---

**最后更新**：2025-10-20  
**版本**：v1.0

