#!/bin/bash

echo "🚀 开始批量安装 Cursor 扩展..."
echo ""

# 定义扩展列表
extensions=(
  "Tencent.cloudbase-toolkit"              # CloudBase 工具包
  "kisstkondoros.vscode-gutter-preview"    # Image Preview
  "Gruntfuggly.todo-tree"                  # Todo Tree
  "alefragnani.project-manager"            # Project Manager
  "yzhang.markdown-all-in-one"             # Markdown All in One
  "hediet.vscode-drawio"                   # Draw.io Integration
  "ms-vscode.live-server"                  # Live Preview
  "cweijan.vscode-database-client2"        # Database Client
  "rangav.vscode-thunder-client"           # Thunder Client
  "mhutchie.git-graph"                     # Git Graph
  "eamodio.gitlens"                        # GitLens
  "phplasma.csv-to-table"                  # CSV to Table
  "PKief.material-icon-theme"              # Material Icon Theme
  "johnpapa.vscode-peacock"                # Peacock
  "WakaTime.vscode-wakatime"               # WakaTime
)

# 计数器
total=${#extensions[@]}
success=0
failed=0

# 逐个安装
for ext in "${extensions[@]}"; do
  echo "📦 正在安装: $ext"
  if code --install-extension "$ext" --force 2>&1 | grep -q "successfully installed"; then
    echo "   ✅ 安装成功"
    ((success++))
  else
    echo "   ❌ 安装失败"
    ((failed++))
  fi
  echo ""
done

echo "================================"
echo "📊 安装统计"
echo "================================"
echo "总计: $total"
echo "成功: $success"
echo "失败: $failed"
echo ""
echo "✨ 安装完成！请重启 Cursor 以激活扩展。"
echo ""
echo "注意："
echo "- Figma 扩展需要手动在扩展市场搜索 'Figma' 安装"
echo "- Zeabur 目前没有官方 VSCode 扩展"



