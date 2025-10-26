#!/bin/bash

echo "🔧 修复 Cursor Marketplace 连接问题"
echo "======================================"
echo ""

# 检查 Cursor 是否在运行
if pgrep -x "Cursor" > /dev/null; then
    echo "⚠️  Cursor 正在运行！"
    echo "请先完全退出 Cursor (Cmd+Q)，然后重新运行此脚本。"
    echo ""
    read -p "按 Enter 键继续（如果已退出），或按 Ctrl+C 取消..."
fi

echo "1️⃣ 清除扩展缓存..."
rm -rf ~/Library/Application\ Support/Cursor/CachedExtensionVSIXs/*
echo "   ✅ 已清除扩展缓存"

echo ""
echo "2️⃣ 清除扩展安装记录..."
rm -rf ~/Library/Application\ Support/Cursor/CachedData/*
echo "   ✅ 已清除安装记录"

echo ""
echo "3️⃣ 检查网络代理设置..."
if [ -n "$http_proxy" ] || [ -n "$https_proxy" ]; then
    echo "   ⚠️  检测到代理设置："
    echo "      http_proxy: $http_proxy"
    echo "      https_proxy: $https_proxy"
    echo ""
    echo "   建议临时取消代理："
    echo "   export http_proxy="
    echo "   export https_proxy="
else
    echo "   ✅ 未检测到代理设置"
fi

echo ""
echo "4️⃣ 测试扩展市场连接..."
if curl -s -m 5 https://marketplace.visualstudio.com/_apis/public/gallery > /dev/null; then
    echo "   ✅ 扩展市场连接正常"
else
    echo "   ❌ 扩展市场连接失败"
    echo ""
    echo "   可能的原因："
    echo "   - 网络限制"
    echo "   - DNS 问题"
    echo "   - 需要设置代理"
fi

echo ""
echo "5️⃣ 检查 DNS 设置..."
echo "   当前 DNS 服务器："
scutil --dns | grep 'nameserver\[0\]' | head -3
echo ""
echo "   如果 DNS 有问题，可以尝试："
echo "   - 使用 8.8.8.8 (Google DNS)"
echo "   - 使用 114.114.114.114 (国内)"

echo ""
echo "======================================"
echo "✅ 清理完成！"
echo ""
echo "🚀 下一步操作："
echo "   1. 重新打开 Cursor"
echo "   2. 按 Cmd+Shift+X 打开扩展面板"
echo "   3. 尝试搜索扩展"
echo ""
echo "如果还是不行，请尝试："
echo "   • 重启电脑"
echo "   • 检查防火墙设置"
echo "   • 使用手机热点测试"
echo ""

