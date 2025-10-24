#!/bin/bash

# ===================================
# 外呼数据系统 - Zeabur 部署脚本
# ===================================

set -e

echo "⚡ 外呼数据系统 - Zeabur 部署"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Zeabur CLI
echo "📋 检查 Zeabur CLI..."
if ! command -v zeabur &> /dev/null; then
    echo -e "${YELLOW}⚠️  Zeabur CLI 未安装${NC}"
    echo ""
    echo "请选择安装方式："
    echo "1) 使用 npm 安装（推荐）"
    echo "2) 使用 curl 安装"
    echo "3) 跳过（稍后手动安装）"
    read -p "请输入选项 [1-3]: " install_option
    
    case $install_option in
        1)
            echo -e "${BLUE}📦 使用 npm 安装 Zeabur CLI...${NC}"
            npm install -g @zeabur/cli
            ;;
        2)
            echo -e "${BLUE}📦 使用 curl 安装 Zeabur CLI...${NC}"
            curl -fsSL https://zeabur.com/install.sh | bash
            ;;
        3)
            echo -e "${RED}❌ 请先安装 Zeabur CLI${NC}"
            echo "安装命令: npm install -g @zeabur/cli"
            echo "或访问: https://zeabur.com/docs/deploy/cli"
            exit 1
            ;;
        *)
            echo -e "${RED}❌ 无效的选项${NC}"
            exit 1
            ;;
    esac
fi

echo -e "${GREEN}✅ Zeabur CLI 已安装${NC}"
echo ""

# 登录检查
echo "🔐 检查登录状态..."
if ! zeabur auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  未登录 Zeabur${NC}"
    echo "即将打开浏览器进行登录..."
    zeabur auth login
else
    echo -e "${GREEN}✅ 已登录 Zeabur${NC}"
    zeabur auth whoami
fi

echo ""

# 检查配置文件
if [ ! -f "zeabur.json" ]; then
    echo -e "${RED}❌ 未找到 zeabur.json 配置文件${NC}"
    echo "请确认在项目根目录运行此脚本"
    exit 1
fi

echo "📝 配置文件检查通过"
echo ""

# 部署确认
echo -e "${BLUE}📋 部署信息：${NC}"
echo "  项目名: call-center-business-data"
echo "  前端: Vite + React"
echo "  后端: Flask + SQLAlchemy"
echo ""

# 环境变量提醒
echo -e "${YELLOW}⚠️  重要提醒！${NC}"
echo ""
echo "部署前请在 Zeabur 控制台配置以下环境变量："
echo ""
echo "【后端服务】"
echo "  FLASK_ENV=production"
echo "  PORT=5001"
echo "  SECRET_KEY=<生成随机字符串>"
echo "  JWT_SECRET_KEY=<生成随机字符串>"
echo "  GUANKE_USERNAME=<你的用户名>"
echo "  GUANKE_PASSWORD=<你的密码>"
echo ""
echo "【前端服务】"
echo "  VITE_BACKEND_URL=<后端服务的URL>"
echo ""
echo "💡 提示: 登录 https://dash.zeabur.com 配置环境变量"
echo ""

read -p "确认已配置环境变量？(y/n) " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo -e "${YELLOW}⏸  部署已取消${NC}"
    echo "请先在 Zeabur 控制台配置环境变量后再部署"
    exit 0
fi

# 开始部署
echo ""
echo -e "${GREEN}🚀 开始部署到 Zeabur...${NC}"
echo ""

zeabur deploy

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📊 后续步骤："
echo "1. 访问 https://dash.zeabur.com 查看部署状态"
echo "2. 在服务页面获取访问域名"
echo "3. 配置自定义域名（可选）"
echo ""
echo "📝 常用命令："
echo "  查看状态: zeabur status"
echo "  查看日志: zeabur logs"
echo "  查看服务: zeabur list"
echo ""
echo "🎉 祝您使用愉快！"

