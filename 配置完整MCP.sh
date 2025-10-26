#!/bin/bash

echo "🚀 配置完整的 MCP 套件"
echo ""
echo "这将配置："
echo "  - 文件系统访问"
echo "  - SQLite 数据库访问"
echo "  - Git 操作"
echo ""

# 项目路径
WORKSPACE_DIR="/Users/tomnice/cursor/call-center-workspace"
PROJECT_DIR="$WORKSPACE_DIR/call-center-lead-management"
DB_PATH="$PROJECT_DIR/backend/instance/callcenter.db"

# 检查 npx
if ! command -v npx >/dev/null 2>&1; then
  echo "❌ 未找到 npx"
  echo ""
  echo "请先安装 Node.js："
  echo "  brew install node"
  echo ""
  exit 1
fi

echo "✅ npx 已安装"
echo ""

# 检查数据库
if [ ! -f "$DB_PATH" ]; then
  echo "⚠️  未找到数据库文件: $DB_PATH"
  echo "   数据库 MCP 将跳过配置"
  echo ""
  DB_EXISTS=false
else
  echo "✅ 找到数据库: $DB_PATH"
  DB_EXISTS=true
fi

echo ""
echo "================================"
echo "📝 创建 MCP 配置"
echo "================================"
echo ""

mkdir -p "$PROJECT_DIR/.cursor"

if [ "$DB_EXISTS" = true ]; then
  # 完整配置（包含数据库）
  cat > "$PROJECT_DIR/.cursor/mcp.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "$WORKSPACE_DIR"
      ],
      "env": {}
    },
    "database": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "$DB_PATH"
      ],
      "env": {}
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "$WORKSPACE_DIR"
      ],
      "env": {}
    }
  }
}
EOF
else
  # 不包含数据库的配置
  cat > "$PROJECT_DIR/.cursor/mcp.json" << EOF
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "$WORKSPACE_DIR"
      ],
      "env": {}
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "$WORKSPACE_DIR"
      ],
      "env": {}
    }
  }
}
EOF
fi

echo "✅ 已创建配置文件: $PROJECT_DIR/.cursor/mcp.json"
echo ""
echo "配置内容："
cat "$PROJECT_DIR/.cursor/mcp.json"
echo ""

echo "================================"
echo "🎉 配置完成！"
echo "================================"
echo ""
echo "已启用的 MCP 服务器："
echo ""
echo "  ✅ filesystem - 文件系统访问"
echo "     允许范围: $WORKSPACE_DIR"
echo ""

if [ "$DB_EXISTS" = true ]; then
  echo "  ✅ database - SQLite 数据库"
  echo "     数据库: callcenter.db"
  echo ""
fi

echo "  ✅ git - Git 操作"
echo "     仓库: $WORKSPACE_DIR"
echo ""

echo "================================"
echo "📋 下一步"
echo "================================"
echo ""
echo "1️⃣  重启 Cursor"
echo "   - 按 Cmd+Q 完全退出"
echo "   - 重新打开 Cursor"
echo "   - 打开项目文件夹"
echo ""
echo "2️⃣  测试功能"
echo ""
echo "   【文件系统】"
echo "   「搜索所有包含 TODO 的文件」"
echo "   「找出最大的 10 个文件」"
echo ""

if [ "$DB_EXISTS" = true ]; then
  echo "   【数据库】"
  echo "   「数据库中有哪些表？」"
  echo "   「统计任务数量」"
  echo ""
fi

echo "   【Git】"
echo "   「显示最近 10 次提交」"
echo "   「哪些文件改动最频繁？」"
echo ""

echo "================================"
echo "💡 提示"
echo "================================"
echo ""
echo "- 首次使用时，npx 会自动下载 MCP 服务器"
echo "- 下载可能需要几秒钟"
echo "- 配置文件使用 npx，无需全局安装"
echo ""
echo "如果遇到问题："
echo "  1. 检查网络连接"
echo "  2. 查看 Cursor 的输出日志"
echo "  3. 尝试手动安装: npm install -g @modelcontextprotocol/server-*"
echo ""
echo "✨ 完成！"
echo ""

