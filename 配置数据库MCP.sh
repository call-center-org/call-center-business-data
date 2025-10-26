#!/bin/bash

echo "🚀 配置呼叫中心数据库 MCP"
echo ""
echo "这将让 Cursor AI 能够直接查询你的数据库！"
echo ""

# 项目路径
PROJECT_DIR="/Users/tomnice/cursor/call-center-workspace/call-center-lead-management"
DB_PATH="$PROJECT_DIR/backend/instance/callcenter.db"

# 检查数据库是否存在
if [ ! -f "$DB_PATH" ]; then
  echo "❌ 未找到数据库文件: $DB_PATH"
  echo ""
  echo "请先启动后端服务创建数据库："
  echo "  cd $PROJECT_DIR/backend"
  echo "  python run.py"
  echo ""
  exit 1
fi

echo "✅ 找到数据库: $DB_PATH"
echo ""

# 步骤 1：安装 MCP 服务器
echo "================================"
echo "📦 步骤 1: 安装 SQLite MCP 服务器"
echo "================================"
echo ""

if command -v npx >/dev/null 2>&1; then
  echo "✅ npx 已安装"
  echo ""
  echo "提示：我们将使用 npx 自动下载 MCP 服务器"
  echo "     不需要全局安装 npm 包"
else
  echo "❌ 未找到 npx，正在检查 npm..."
  if command -v npm >/dev/null 2>&1; then
    echo "✅ npm 已安装"
    echo ""
    echo "正在全局安装 SQLite MCP 服务器..."
    npm install -g @modelcontextprotocol/server-sqlite
  else
    echo "❌ 未找到 npm"
    echo ""
    echo "请先安装 Node.js："
    echo "  brew install node"
    echo ""
    exit 1
  fi
fi

# 步骤 2：创建 MCP 配置
echo "================================"
echo "📝 步骤 2: 创建 MCP 配置文件"
echo "================================"
echo ""

mkdir -p "$PROJECT_DIR/.cursor"

cat > "$PROJECT_DIR/.cursor/mcp.json" << EOF
{
  "mcpServers": {
    "callcenter-database": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "$DB_PATH"
      ]
    }
  }
}
EOF

echo "✅ 已创建配置文件: $PROJECT_DIR/.cursor/mcp.json"
echo ""
echo "配置内容："
cat "$PROJECT_DIR/.cursor/mcp.json"
echo ""

# 步骤 3：使用说明
echo "================================"
echo "🎉 配置完成！"
echo "================================"
echo ""
echo "下一步："
echo ""
echo "1️⃣  重启 Cursor"
echo "   - 按 Cmd+Q 完全退出 Cursor"
echo "   - 重新打开 Cursor"
echo "   - 打开项目: $PROJECT_DIR"
echo ""
echo "2️⃣  测试 MCP 是否生效"
echo "   在 Cursor 中对 AI 说："
echo ""
echo "   「查询一下数据库中有多少条任务记录」"
echo "   「分析最近一周的通话数据」"
echo "   「显示所有表的结构」"
echo ""
echo "   如果 MCP 配置成功，AI 将直接查询数据库并返回结果！"
echo ""
echo "3️⃣  查看 MCP 状态"
echo "   - 按 Cmd+Shift+P"
echo "   - 输入 'MCP'"
echo "   - 应该能看到 MCP 相关的命令"
echo ""
echo "================================"
echo "💡 使用示例"
echo "================================"
echo ""
echo "你可以问 AI："
echo ""
echo "  「数据库中有哪些表？」"
echo "  「查询最近10条任务」"
echo "  「统计每个标签的任务数量」"
echo "  「分析任务的完成率」"
echo "  「找出拨打次数最多的任务」"
echo ""
echo "AI 会自动执行 SQL 查询并返回结果！"
echo ""
echo "================================"
echo "🚨 注意事项"
echo "================================"
echo ""
echo "- MCP 只能读取数据，不能修改数据库（安全考虑）"
echo "- 如果遇到权限问题，检查数据库文件权限"
echo "- 配置文件位于项目的 .cursor 目录下"
echo ""
echo "✨ 享受更强大的 AI 助手吧！"
echo ""

