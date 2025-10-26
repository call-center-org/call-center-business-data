#!/bin/bash

echo "🔍 检查 Cursor 版本信息..."
echo ""

# 检查 Cursor 版本
if [ -d "/Applications/Cursor.app" ]; then
  version=$(defaults read /Applications/Cursor.app/Contents/Info.plist CFBundleShortVersionString 2>/dev/null)
  echo "📌 当前 Cursor 版本: $version"
else
  echo "❌ 未找到 Cursor 应用"
fi

echo ""
echo "📋 建议操作："
echo ""
echo "1️⃣ 检查更新："
echo "   - 打开 Cursor"
echo "   - 点击菜单栏: Cursor → Check for Updates"
echo "   - 如果有新版本，建议更新（可能已修复此 bug）"
echo ""
echo "2️⃣ 查看是否是已知问题："
echo "   - 访问: https://github.com/getcursor/cursor/issues"
echo "   - 搜索关键词: 'scroll', 'chat', 'jump to top'"
echo "   - 看看是否有其他人报告类似问题"
echo ""
echo "3️⃣ 如果是新 bug，建议报告："
echo "   - 在 Cursor 中: Help → Report Issue"
echo "   - 描述: '切换 AI 对话时，先闪到底部，再跳到顶部'"
echo "   - 提供: 版本号、安装的扩展列表"
echo ""

