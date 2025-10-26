# rclone Google Drive 配置指南

## 📋 一次性配置步骤

### 1️⃣ 打开终端并运行配置命令

```bash
rclone config
```

### 2️⃣ 按照提示操作

| 提示 | 您的输入 | 说明 |
|------|---------|------|
| `e/n/d/r/c/s/q>` | **n** | 创建新的远程连接 |
| `name>` | **gdrive** | 给连接命名 |
| `Storage>` | **drive** | 选择 Google Drive（或输入对应数字，通常是 15） |
| `client_id>` | **直接回车** | 使用 rclone 默认 |
| `client_secret>` | **直接回车** | 使用 rclone 默认 |
| `scope>` | **1** | 完全访问权限 |
| `service_account_file>` | **直接回车** | 不使用服务账号 |
| `Edit advanced config?` | **n** | 不需要高级配置 |
| `Use web browser?` | **y** | 使用浏览器自动授权 |

### 3️⃣ 浏览器授权

- 浏览器会自动打开
- 选择您的 Google 账号
- 点击"允许"授权 rclone 访问

### 4️⃣ 完成配置

| 提示 | 您的输入 |
|------|---------|
| `Configure this as a Shared Drive?` | **n** |
| `Keep this "gdrive" remote?` | **y** |
| `e/n/d/r/c/s/q>` | **q** (退出) |

---

## 🚀 配置完成后的上传命令

### 上传单个文件
```bash
rclone copy "文件名.csv" gdrive:/文件夹名/
```

### 上传您的两个 CSV 文件
```bash
# 上传胜算导出订单.csv
rclone copy "胜算导出订单.csv" gdrive:/pet-data-anylsis/

# 上传运费报表.csv  
rclone copy "运费报表.csv" gdrive:/pet-data-anylsis/
```

---

## ✅ 验证上传
```bash
# 列出文件夹内容
rclone ls gdrive:/pet-data-anylsis/
```

---

## 📝 注意事项

- 配置只需要做一次
- 之后可以随时使用命令上传
- Token 会自动刷新，长期有效

