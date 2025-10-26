#!/bin/bash

echo "🔍 验证 DNS 设置"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣ 检查 DNS 设置..."
dns_output=$(scutil --dns | grep 'nameserver\[0\]' | head -1)
echo "   $dns_output"
echo ""

if echo "$dns_output" | grep -q "8.8.8.8"; then
    echo "   ✅ DNS 已成功设置为 8.8.8.8"
    dns_changed=true
elif echo "$dns_output" | grep -q "114.114.114.114"; then
    echo "   ✅ DNS 已成功设置为 114.114.114.114"
    dns_changed=true
else
    echo "   ⚠️  DNS 可能还未生效，当前为："
    echo "   $dns_output"
    dns_changed=false
fi

echo ""
echo "2️⃣ 测试扩展市场连接..."
if curl -s -m 10 "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery" \
   -H "Content-Type: application/json" \
   -d '{"filters":[{"criteria":[{"filterType":8,"value":"Microsoft.VisualStudio.Code"}]}],"flags":439}' \
   | grep -q "results"; then
    echo "   ✅ 扩展市场 API 连接成功！"
    market_ok=true
else
    echo "   ❌ 扩展市场连接失败"
    market_ok=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$dns_changed" = true ] && [ "$market_ok" = true ]; then
    echo "🎉 太好了！问题已解决！"
    echo ""
    echo "✅ 下一步："
    echo "   1. 按 Cmd+Q 完全退出 Cursor"
    echo "   2. 重新打开 Cursor"
    echo "   3. 按 Cmd+Shift+X 打开扩展面板"
    echo "   4. 搜索 'CloudBase' 或其他扩展"
    echo "   5. 现在应该能正常搜索和安装了！"
elif [ "$dns_changed" = true ] && [ "$market_ok" = false ]; then
    echo "⚠️  DNS 已更改，但扩展市场仍无法连接"
    echo ""
    echo "建议："
    echo "   1. 等待 1-2 分钟让 DNS 生效"
    echo "   2. 重新运行这个验证脚本"
    echo "   3. 或者尝试重启电脑"
    echo "   4. 或者使用手机热点测试"
else
    echo "❌ DNS 设置未生效"
    echo ""
    echo "请检查："
    echo "   1. 是否输入了正确的密码？"
    echo "   2. 命令是否执行成功（没有报错）？"
    echo "   3. 尝试使用图形界面方法（系统设置 → 网络）"
fi

echo ""

