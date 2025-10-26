#!/bin/bash

echo "📊 Zeabur 部署状态检查"
echo ""

# 检查 CLI 是否安装
if ! command -v zeabur >/dev/null 2>&1; then
  echo "❌ Zeabur CLI 未安装"
  echo ""
  echo "请先安装 Zeabur CLI："
  echo "  bash 安装Zeabur_CLI.sh"
  echo ""
  echo "或手动安装："
  echo "  brew tap zeabur/tap && brew install zeabur"
  echo ""
  exit 1
fi

echo "✅ Zeabur CLI 已安装"
zeabur --version
echo ""

# 检查登录状态
echo "================================"
echo "📋 检查登录状态"
echo "================================"
echo ""

if zeabur auth whoami >/dev/null 2>&1; then
  echo "✅ 已登录 Zeabur"
  zeabur auth whoami
  echo ""
else
  echo "❌ 未登录 Zeabur"
  echo ""
  echo "请先登录："
  echo "  zeabur auth login"
  echo ""
  exit 1
fi

# 列出所有项目
echo "================================"
echo "📋 你的所有项目"
echo "================================"
echo ""

zeabur project list
echo ""

# 查找 call-center 相关的项目
echo "================================"
echo "📋 查找呼叫中心项目"
echo "================================"
echo ""

PROJECT_NAME=$(zeabur project list | grep -i "call-center\|lead" | awk '{print $2}' | head -1)

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ 未找到呼叫中心相关项目"
  echo ""
  echo "请在上面的项目列表中找到你的项目名称，然后运行："
  echo "  zeabur service list --project YOUR_PROJECT_NAME"
  echo ""
  exit 1
fi

echo "✅ 找到项目: $PROJECT_NAME"
echo ""

# 查看项目详情
echo "================================"
echo "📋 项目详情"
echo "================================"
echo ""

zeabur project get "$PROJECT_NAME"
echo ""

# 列出服务
echo "================================"
echo "📋 服务列表"
echo "================================"
echo ""

zeabur service list --project "$PROJECT_NAME"
echo ""

# 查看后端状态
echo "================================"
echo "📋 后端服务详情"
echo "================================"
echo ""

if zeabur service get backend --project "$PROJECT_NAME" 2>/dev/null; then
  echo ""
else
  echo "⚠️  未找到 backend 服务"
  echo ""
fi

# 查看前端状态
echo "================================"
echo "📋 前端服务详情"
echo "================================"
echo ""

if zeabur service get frontend --project "$PROJECT_NAME" 2>/dev/null; then
  echo ""
else
  echo "⚠️  未找到 frontend 服务"
  echo ""
fi

# 查看最近部署
echo "================================"
echo "📋 最近的部署"
echo "================================"
echo ""

echo "后端部署历史："
zeabur deployment list --project "$PROJECT_NAME" --service backend 2>/dev/null | head -10
echo ""

echo "前端部署历史："
zeabur deployment list --project "$PROJECT_NAME" --service frontend 2>/dev/null | head -10
echo ""

# 查看域名
echo "================================"
echo "📋 域名配置"
echo "================================"
echo ""

echo "后端域名："
zeabur domain list --project "$PROJECT_NAME" --service backend 2>/dev/null
echo ""

echo "前端域名："
zeabur domain list --project "$PROJECT_NAME" --service frontend 2>/dev/null
echo ""

# 提供快捷命令
echo "================================"
echo "💡 常用命令"
echo "================================"
echo ""
echo "查看实时日志："
echo "  zeabur logs backend --project $PROJECT_NAME --follow"
echo "  zeabur logs frontend --project $PROJECT_NAME --follow"
echo ""
echo "重启服务："
echo "  zeabur service restart backend --project $PROJECT_NAME"
echo "  zeabur service restart frontend --project $PROJECT_NAME"
echo ""
echo "查看环境变量："
echo "  zeabur env list --project $PROJECT_NAME --service backend"
echo ""
echo "触发部署："
echo "  zeabur deploy --project $PROJECT_NAME --service backend"
echo ""
echo "✨ 完成！"
echo ""

