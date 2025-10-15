# 🚀 腾讯云 COS 部署指南

本文档详细指导如何将外呼坐席数据统计系统部署到腾讯云 COS，让大陆同事无需翻墙即可访问。

## 📋 部署前准备

### 1. 腾讯云账号准备
- ✅ 注册腾讯云账号：https://cloud.tencent.com
- ✅ 实名认证（必须完成）
- ✅ 准备至少 10 元余额

### 2. 本地环境准备
- ✅ Node.js 16+ 已安装
- ✅ 项目代码已下载

## 🛠️ 部署步骤

### 步骤 1：创建 COS Bucket

1. **登录腾讯云控制台**
   - 访问：https://console.cloud.tencent.com/cos
   - 使用您的腾讯云账号登录

2. **创建 Bucket**
   - 点击「创建存储桶」
   - 填写配置信息：
     - **存储桶名称**：`outbound-agent-data-您的用户ID`（必须全局唯一）
     - **地域**：选择离您最近的地域，推荐：
       - `华东地区（上海）` - ap-shanghai
       - `华北地区（北京）` - ap-beijing  
       - `华南地区（广州）` - ap-guangzhou
     - **访问权限**：公有读私有写
     - **版本控制**：关闭
   - 点击「下一步」→「创建」

3. **配置静态网站托管**
   - 进入 Bucket → 基础配置 → 静态网站
   - 开启静态网站功能
   - 设置索引文档：`index.html`
   - 设置错误文档：`index.html`（支持 SPA）
   - 点击「保存」

### 步骤 2：安装和配置 COSCLI

1. **安装 COSCLI**
   ```bash
   # macOS
   curl -o coscli "https://cosbrowser.cloud.tencent.com/software/coscli/coscli-darwin"
   chmod +x coscli
   sudo mv coscli /usr/local/bin/
   
   # 或者使用 npm 安装
   npm install -g @tencentyun/coscli
   ```

2. **配置认证信息**
   ```bash
   coscli config
   ```
   - 输入 SecretID 和 SecretKey
     - 获取位置：腾讯云控制台 → 访问管理 → 访问密钥
   - 输入存储桶名称和地域

### 步骤 3：修改 API 配置（重要！）

由于部署到大陆服务器，需要确保 API 可以在大陆访问：

编辑 `src/utils/apiConfig.js`：
```javascript
// API基础URL - 确保这个URL在大陆可以访问
export const API_CONFIG = {
  BASE_URL: 'https://open-api.gooki.com', // 确认这个域名在大陆可访问
  // 如果不可访问，可能需要使用代理或更换API服务商
  
  // 其他配置保持不变...
}
```

### 步骤 4：创建腾讯云部署脚本

创建文件 `deploy-to-tencent.sh`：
```bash
#!/bin/bash

echo "🚀 开始部署到腾讯云 COS..."

# 检查是否安装了 coscli
if ! command -v coscli &> /dev/null; then
    echo "❌ 未安装 coscli 工具"
    echo "请先安装 coscli："
    echo "1. 访问：https://cloud.tencent.com/document/product/436/63144"
    echo "2. 下载或安装 coscli"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

# 修复路径
echo "🔧 修复路径..."
node fix-paths.js

# 上传到 COS
echo "☁️ 上传到腾讯云 COS..."
coscli cp -r dist/ cos://outbound-agent-data-您的用户ID/ -f

echo "✅ 部署完成！"
echo "🌐 访问地址：https://outbound-agent-data-您的用户ID.cos.地域.myqcloud.com"
echo "💡 提示：请将 '您的用户ID' 和 '地域' 替换为实际值"
```

给脚本执行权限：
```bash
chmod +x deploy-to-tencent.sh
```

### 步骤 5：执行部署

```bash
cd /Users/tomnice/outbound-agent-data
./deploy-to-tencent.sh
```

### 步骤 6：获取访问地址

部署完成后，您的访问地址为：
`https://outbound-agent-data-您的用户ID.cos.地域.myqcloud.com`

将「您的用户ID」和「地域」替换为实际值，如：
- 上海：`https://outbound-agent-data-123456.cos.ap-shanghai.myqcloud.com`
- 北京：`https://outbound-agent-data-123456.cos.ap-beijing.myqcloud.com`

## 🔧 常见问题解决

### ❌ 问题 1：API 访问被阻止
**症状**：页面可以打开，但数据加载失败
**解决方案**：
1. 检查 API URL 是否在大陆可访问
2. 如果不可访问，考虑使用腾讯云 API 网关进行代理转发

### ❌ 问题 2：跨域错误（CORS）
**症状**：浏览器控制台显示跨域错误
**解决方案**：
1. 在 COS Bucket 中配置 CORS：
   - 进入 Bucket → 安全设置 → 跨域访问 CORS 设置
   - 添加规则：
     - 来源：`*`
     - 操作：GET, POST, PUT, DELETE, HEAD
     - 暴露头部：`*`
     - 最大年龄：3600

### ❌ 问题 3：页面刷新 404
**症状**：直接访问子路由显示 404
**解决方案**：
1. 确保静态网站托管配置了错误文档为 `index.html`

### ❌ 问题 4：coscli 配置错误
**症状**：部署脚本执行失败
**解决方案**：
```bash
# 重新配置 coscli
coscli config

# 测试连接
coscli ls cos://outbound-agent-data-您的用户ID/
```

## 💰 费用预估

腾讯云 COS 费用很低：
- **存储费用**：约 0.118元/GB/月
- **流量费用**：约 0.50元/GB（外网流出）
- **请求费用**：约 0.01元/万次

**月均费用**：如果每天 100次访问，月费用约 3-5 元

## 🔐 安全建议

### 1. 访问控制
- 虽然设置为公有读，但建议添加简单的密码保护
- 可以在代码中添加基本的认证机制

### 2. API 密钥保护
- 不要将敏感信息硬编码在代码中
- 考虑使用环境变量或后端代理

## 📞 技术支持

如果遇到问题：
1. 查看腾讯云文档：https://cloud.tencent.com/document/product/436
2. 联系腾讯云客服

## 🎉 部署完成

完成以上步骤后，您的同事就可以通过提供的网址访问系统了！

**访问测试**：
1. 在大陆网络环境下打开网址
2. 测试数据加载功能
3. 确认所有功能正常

如果一切正常，恭喜您部署成功！🎊
