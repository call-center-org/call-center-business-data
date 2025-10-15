#!/bin/bash

# 阿里云 OSS 部署脚本
# 使用方法：./deploy-to-aliyun.sh

echo "🚀 开始部署到阿里云 OSS..."

# 检查是否安装了 ossutil
if ! command -v ossutil &> /dev/null; then
    echo "❌ 未安装 ossutil 工具"
    echo "请先安装 ossutil："
    echo "1. 访问：https://help.aliyun.com/document_detail/120075.html"
    echo "2. 下载适合您系统的 ossutil"
    echo "3. 配置密钥：ossutil config"
    exit 1
fi

# 检查是否配置了 OSS
if ! ossutil ls oss://outbound-agent-data/ &> /dev/null; then
    echo "❌ OSS 未配置或 Bucket 不存在"
    echo "请先创建 OSS Bucket："
    echo "1. 登录阿里云控制台：https://oss.console.aliyun.com"
    echo "2. 创建 Bucket：outbound-agent-data"
    echo "3. 配置 ossutil：ossutil config"
    exit 1
fi

# 构建项目
echo "📦 构建项目..."
npm run build

# 修复路径
echo "🔧 修复路径..."
node fix-paths.js

# 复制认证文件（如果需要）
if [ -f "2b0f35d6f92d93aaa4a22103f1bf4553.txt" ]; then
    echo "📄 复制认证文件..."
    cp 2b0f35d6f92d93aaa4a22103f1bf4553.txt dist/
fi

# 上传到 OSS
echo "☁️ 上传到阿里云 OSS..."
ossutil cp -r dist/ oss://outbound-agent-data/ --force

# 设置静态网站托管
echo "🌐 配置静态网站托管..."
ossutil bucket-website --enable oss://outbound-agent-data/

# 设置文件权限为公共读
echo "🔓 设置文件权限..."
ossutil set-acl oss://outbound-agent-data/ public-read --recursive

echo "✅ 部署完成！"
echo "🌐 访问地址：https://outbound-agent-data.oss-cn-地域.aliyuncs.com"
echo "💡 提示：请将 '地域' 替换为您的 OSS Bucket 实际地域"
echo "📱 微信认证：https://outbound-agent-data.oss-cn-地域.aliyuncs.com/index.html"
