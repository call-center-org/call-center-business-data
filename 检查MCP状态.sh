#!/bin/bash

echo "🔍 检查 Cursor MCP 配置状态"
echo ""
echo "================================"
echo "📋 1. 检查项目 MCP 配置"
echo "================================"
echo ""

# 检查项目中的 MCP 配置
for project in "/Users/tomnice/cursor/call-center-workspace"/*; do
  if [ -d "$project" ]; then
    project_name=$(basename "$project")
    echo "📁 检查项目: $project_name"
    
    if [ -f "$project/.cursor/mcp.json" ]; then
      echo "   ✅ 找到 MCP 配置文件"
      echo "   配置内容:"
      cat "$project/.cursor/mcp.json" | head -20
      echo ""
    else
      echo "   ❌ 未配置 MCP"
    fi
    echo ""
  fi
done

echo "================================"
echo "📋 2. 检查全局 MCP 配置"
echo "================================"
echo ""

# 检查全局配置
global_config="$HOME/Library/Application Support/Cursor/User/globalStorage/anysphere.cursor-mcp"
if [ -d "$global_config" ]; then
  echo "✅ 找到全局 MCP 配置目录"
  echo "目录内容:"
  ls -la "$global_config"
  echo ""
  
  if [ -f "$global_config/config.json" ]; then
    echo "MCP 配置:"
    cat "$global_config/config.json"
  fi
else
  echo "❌ 未找到全局 MCP 配置"
fi

echo ""
echo "================================"
echo "📋 3. 检查可用的 MCP 服务器"
echo "================================"
echo ""

echo "检查是否安装了 MCP 服务器包..."

mcp_packages=(
  "@modelcontextprotocol/server-filesystem"
  "@modelcontextprotocol/server-sqlite"
  "@modelcontextprotocol/server-postgres"
  "@modelcontextprotocol/server-git"
  "@modelcontextprotocol/server-github"
  "@modelcontextprotocol/server-fetch"
)

for package in "${mcp_packages[@]}"; do
  if npm list -g "$package" >/dev/null 2>&1; then
    echo "✅ $package - 已安装"
  else
    echo "❌ $package - 未安装"
  fi
done

echo ""
echo "================================"
echo "📋 4. MCP 使用建议"
echo "================================"
echo ""

echo "根据你的项目类型，推荐配置："
echo ""
echo "1️⃣  数据库分析（推荐）"
echo "   让 AI 可以查询你的 SQLite 数据库"
echo "   需要安装: npm install -g @modelcontextprotocol/server-sqlite"
echo ""
echo "2️⃣  文件系统访问"
echo "   让 AI 可以更快地浏览项目文件"
echo "   需要安装: npm install -g @modelcontextprotocol/server-filesystem"
echo ""
echo "3️⃣  Git 集成"
echo "   让 AI 可以操作 Git"
echo "   需要安装: npm install -g @modelcontextprotocol/server-git"
echo ""
echo "================================"
echo "📋 5. 快速配置脚本"
echo "================================"
echo ""
echo "如果你想配置数据库 MCP，运行："
echo ""
echo "  bash 配置数据库MCP.sh"
echo ""
echo "我会创建这个脚本在同一目录下。"
echo ""
echo "✅ 检查完成！"
