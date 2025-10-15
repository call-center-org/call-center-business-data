#!/bin/bash

echo "🔧 修复OSS文件Content-Type..."

# 使用用户目录下的ossutil
OSSUTIL="$HOME/ossutil"
BUCKET="oss://outbound-agent-data-tomnice"

# 检查ossutil是否已配置
if ! $OSSUTIL ls $BUCKET &> /dev/null; then
    echo "❌ ossutil未配置或无法访问Bucket"
    echo "请先运行：$OSSUTIL config"
    echo ""
    echo "配置时需要填写："
    echo "1. Endpoint: oss-cn-beijing.aliyuncs.com"
    echo "2. AccessKey ID: 您的AccessKey ID"
    echo "3. AccessKey Secret: 您的AccessKey Secret"
    echo ""
    echo "获取AccessKey: https://ram.console.aliyun.com/manage/ak"
    exit 1
fi

# 设置HTML文件
echo "📄 设置HTML文件..."
$OSSUTIL set-meta $BUCKET/index.html Content-Type:text/html -f

# 设置CSS文件
echo "🎨 设置CSS文件..."
$OSSUTIL set-meta $BUCKET/assets/ Content-Type:text/css -r -f --include "*.css"

# 设置JS文件
echo "⚡ 设置JS文件..."
$OSSUTIL set-meta $BUCKET/assets/ Content-Type:application/javascript -r -f --include "*.js"

echo ""
echo "✅ Content-Type修复完成！"
echo "🌐 现在可以访问：http://outbound-agent-data-tomnice.oss-cn-beijing.aliyuncs.com/index.html"
