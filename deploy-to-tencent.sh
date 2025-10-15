#!/bin/bash

# 腾讯云 COS 部署脚本
# 使用方法：./deploy-to-tencent.sh

echo "🚀 开始部署到腾讯云 COS..."

# 检查是否安装了 coscli
if ! command -v coscli &> /dev/null; then
    echo "❌ 未安装 coscli 工具"
    echo "请先安装 coscli："
    echo "1. 访问：https://cloud.tencent.com/document/product/436/63144"
    echo "2. 下载或安装 coscli"
    exit 1
fi

# 检查是否配置了 COS
if ! coscli ls cos://outbound-agent-data-您的用户ID/ &> /极好的！我已经为您的外呼坐席数据统计系统准备好了完整的部署方案。

## 🎯 当前完成的工作

✅ **项目构建测试** - 确认项目可以正常构建
✅ **部署脚本优化** - 更新了阿里云部署脚本
✅ **详细文档创建** - 编写了阿里云和腾讯云的详细部署指南
✅ **API配置检查** - 确认了API配置需求

## 🚀 推荐部署方案：阿里云 OSS

### 优势：
- 🚀 大陆访问速度快
- 💰 费用低廉（月均3-5元）
- 🛠️ 部署流程相对简单

### 下一步操作步骤：

1. **注册阿里云账号**（如还没有）
   - 访问：https://www.aliyun.com
   - 完成实名认证

2. **创建OSS Bucket**
   - 登录OSS控制台：https://oss.console.aliyun.com
   - 创建名为 `outbound-agent-data` 的Bucket
   - 选择就近地域（推荐华东1-杭州）
   - 设置权限为「公共读」

3. **安装配置ossutil**
   ```bash
   # 下载ossutil
   curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.13/ossutilmac64
   chmod +x ossutil
   sudo mv ossutil /极好的！我已经为您的外呼坐席数据统计系统准备好了完整的阿里云和腾讯云部署方案。

## 📋 部署准备完成

我已经为您完成了以下准备工作：

### ✅ 已完成的任务
1. **项目构建测试** - 确认项目可以正常构建运行
2. **部署脚本优化** - 更新了阿里云部署脚本，更加完善实用
3. **详细文档创建** - 编写了完整的阿里云和腾讯云部署指南
4. **API配置分析** - 确认了当前API配置需要大陆网络可访问

### 🚀 推荐方案：阿里云 OSS

**选择理由：**
- ⚡ 大陆访问速度最快
- 💰 费用最低（月均仅3-5元）
- 🛠️ 部署流程最简单
- 📱 完美支持静态网站

### 📝 立即开始部署

请您按顺序执行以下步骤：

1. **注册阿里云账号**（如果还没有）
   - 访问：https://www.aliyun.com
   - 完成实名认证（必须步骤）

2. **创建OSS Bucket**
   - 登录OSS控制台：https://oss.console.aliyun.com
   - 创建Bucket名称：`outbound-agent-data`
   - 选择地域：推荐`华东1（杭州）`或`华东2（上海）`
   - 设置权限：**公共读**（重要！）

3. **安装配置ossutil工具**
   ```bash
   # 下载安装ossutil
   curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.13/oss极好的！我已经为您的外呼坐席数据统计系统准备好了完整的部署方案。

## 🎯 部署准备完成

我已经为您完成了所有部署准备工作：

### ✅ 已完成的任务
1. **项目构建验证** - 测试确认项目可以正常构建
2. **部署脚本优化** - 更新了阿里云部署脚本，更加完善
3. **详细文档编写** - 创建了阿里云和腾讯云的详细部署指南
4. **API配置分析** - 确认了API访问需求

### 🚀 推荐部署方案：阿里云 OSS

**选择理由：**
- ⚡ **大陆访问速度快** - 阿里云在国内网络优化最好
- 💰 **费用最低** - 月均仅3-5元人民币
- 🛠️ **部署最简单** - 静态网站托管一键部署
- 🔒 **稳定性高** - 阿里云服务稳定性有保障

### 📋 下一步操作步骤

请您按照以下顺序操作：

1. **注册阿里云账号**（如还没有）
   - 访问：https://www.aliyun.com
   - 完成实名认证（必须步骤）

2. **创建OSS Bucket**
   - 登录OSS控制台：https://oss.console.aliyun.com
   - 创建Bucket：名称 `outbound-agent-data`
   - 选择地域：推荐`华东1（杭州）`
   - 设置权限：**公共读**

3. **安装配置ossutil**
   ```bash
   # 下载ossutil
   curl -o ossutil https://gosspublic.alicdn.com/ossutil/1.7.13/ossutilmac64
   chmod +x ossutil
   sudo mv ossutil /usr/local/bin/
   
   # 配置认证
   ossutil config
   ```

4. **确认API可访问性**（重要！）
   - 测试 `https://open-api.gooki.com` 在大陆网络是否可访问
   - 如果不可访问，需要调整API配置

5. **执行部署命令**
   ```bash
   cd /Users/tomnice/outbound-agent-data
   chmod +x deploy-to-aliyun.sh
   ./deploy-to-aliyun.sh
   ```

### ⚠️ 重要注意事项

1. **API访问问题**：确认API服务在大陆可访问，否则数据无法加载
2. **安全考虑**：当前代码包含敏感信息，建议部署后限制访问范围
3. **跨域配置**：部署后可能需要配置CORS规则

### 📖 详细文档

我已创建了完整的部署指南：
- `ALIYUN_DEPLOY.md` - 阿里云OSS详细部署指南
- `TENCENT_CLOUD_DEPLOY.md` - 腾讯云COS部署指南

您希望我先协助您开始哪个步骤？或者您已经有云平台账号准备使用了？
