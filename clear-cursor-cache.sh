#!/bin/bash

echo "🧹 清除 Cursor 缓存..."
echo ""
echo "⚠️  请先完全退出 Cursor (Cmd+Q)"
echo ""
read -p "按回车继续..."
echo ""

# 清除缓存
echo "📦 清除主缓存..."
rm -rf ~/Library/Caches/Cursor/*

echo "📦 清除工作区存储..."
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage/*

echo "📦 清除 GPU 缓存..."
rm -rf ~/Library/Application\ Support/Cursor/GPUCache/*

echo ""
echo "✅ 缓存清除完成！"
echo ""
echo "📌 下一步："
echo "   1. 重新打开 Cursor"
echo "   2. 等待完全加载（可能需要一点时间）"
echo "   3. 测试 AI 对话切换是否正常"
echo ""

