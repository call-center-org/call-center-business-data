# 🚀 阿里云 OSS 部署指南

本文档详细指导如何将外呼坐席数据统计系统部署到阿里云 OSS，让大陆同事无需翻墙即可访问。

## 📋 部署前准备

### 1. 阿里云账号准备
- ✅ 注册阿里云账号：https://www.aliyun.com
- ✅ 实名认证（必须完成）
- ✅ 准备至少 10 元余额（用于 OSS 费用）

### 2. 本地环境准备
- ✅ Node.js 16+ 已安装
- ✅ Git 已安装
- ✅ 项目代码已下载

## 🛠️ 部署步骤

### 步骤 1：创建 OSS Bucket

1. **登录阿里云控制台**
   - 访问：https://oss.console.aliyun.com
   - 使用您的阿里云账号登录

2. **创建 Bucket**
   - 点击「创建 Bucket」
   - 填写配置信息：
     - **Bucket 名称**：`outbound-agent-data`（必须全局唯一）
     - **地域**：选择离您最近的地域，推荐：
       - `华东1（杭州）` - oss-cn-hangzhou
       - `华东2（上海）` - oss-cn-shanghai  
       - `华北2（北京）` - oss-cn-beijing
     - **存储类型**：标准存储
     - **读写权限**：公共读（重要！）
     - **版本控制**：关闭
     - **实时日志查询**：关闭
   - 点击「确定」创建

3. **配置静态网站托管**
   - 进入 Bucket → 基础设置 → 静态页面
   - 设置默认首页：`index.html`
   - 设置默认 404 页：`index.html`（支持 SPA）
   - 点击「保存」

### 步骤 2：安装和配置 ossutil

1. **下载 ossutil**
   ```bash
   # macOS
   curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.13/ossutilmac64
   chmod +x ossutil
   sudo mv ossutil /usr/local/bin/
   
   # Windows：下载 https://gosspublic.alicdn.com/ossutil/1.7.13/ossutil64.zip
   ```

2. **配置认证信息**
   ```bash
   ossutil config
   ```
   - 输入 Endpoint：根据您的地域选择，如 `oss-cn-hangzhou.aliyuncs.com`
   - 输入 AccessKey ID 和 AccessKey Secret
     - 获取位置：阿里云控制台 → 头像 → AccessKey 管理
   - 其他配置保持默认

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

### 步骤 4：执行部署

```bash
cd /Users/tomnice/outbound-agent-data

# 给部署脚本执行权限
chmod +x deploy-to-aliyun.sh

# 执行部署
./deploy-to-aliyun.sh
```

### 步骤 5：获取访问地址

部署完成后，您的访问地址为：
`https://outbound-agent-data.oss-cn-地域.aliyuncs.com`

将「地域」替换为您的实际地域，如：
- 杭州：`https://outbound-agent-data.oss-cn-hangzhou.aliyuncs.com`
- 上海：`https://outbound-agent-data.oss-cn-shangzhou.aliyuncs.com`
- 北京：`https://outbound-agent-data.oss-cn-beijing.aliyuncs.com`

## 🔧 常见问题解决

### ❌ 问题 1：API 访问被阻止
**症状**：页面可以打开，但数据加载失败
**解决方案**：
1. 检查 API URL 是否在大陆可访问
2. 如果不可访问，考虑：
   - 使用代理服务器
   - 更换为支持大陆访问的 API 服务
   - 使用阿里云 API 网关进行转发

### ❌ 问题 2：跨域错误（CORS）
**症状**：浏览器控制台显示跨域错误
**解决方案**：
1. 在 OSS Bucket 中配置 CORS：
   - 进入 Bucket → 权限管理 → 跨域设置
   - 添加规则：
     - 来源：`*`
     - 允许 Methods：GET, POST, PUT, DELETE, HEAD
     - 允许 Headers：`*`
     - 暴露 Headers：`*`
     - 缓存时间：3600

### ❌ 问题 3：页面刷新 404
**症状**：直接访问子路由显示 404
**解决方案**：
1. 确保静态网站托管配置了默认 404 页为 `index.html`
2. 或者在 OSS 中配置重定向规则

### ❌ 问题 4：ossutil 配置错误
**症状**：部署脚本执行失败
**解决方案**：
```bash
# 重新配置 ossutil
ossutil config

# 测试连接
ossutil ls oss://outbound-agent-data/
```

## 💰 费用预估

阿里云 OSS 费用很低：
- **存储费用**：约 0.12元/GB/月
- **流量费用**：约 0.50元/GB（外网流出）
- **请求费用**：约 0.01元/万次

**月均费用**：如果每天 100次访问，月费用约 3-5 元

## 🔐 安全建议

### 1. 访问控制
- 虽然设置为公共读，但建议添加简单的密码保护
- 可以在代码中添加基本的认证机制

### 2. API 密钥保护
- 不要将敏感信息硬编码在代码中
- 考虑使用环境变量或后端代理

### 3. 监控和日志
- 开启 OSS 访问日志
- 定期检查访问情况

## 📞 技术支持

如果遇到问题：
1. 查看阿里云文档：https://help.aliyun.com/product/31815.html
2. 检查项目 GitHub Issues
3. 联系阿里云客服

## 🎉 部署完成

完成以上步骤后，您的同事就可以通过提供的网址访问系统了！

**访问测试**：
1. 在大陆网络环境下打开网址
2. 测试数据加载功能
3. 确认所有功能正常

如果一切正常，恭喜您部署成功！🎊
