#!/bin/bash

# ===================================
# 外呼数据系统 - Docker 快速部署脚本
# ===================================

set -e

echo "🚀 外呼数据系统 - Docker 快速部署"
echo "=================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Docker
echo "📋 检查 Docker 环境..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装！${NC}"
    echo "请访问 https://www.docker.com/get-started 安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装！${NC}"
    echo "请安装 Docker Compose"
    exit 1
fi

echo -e "${GREEN}✅ Docker 环境检查通过${NC}"
echo ""

# 检查环境变量文件
echo "📝 检查环境变量配置..."
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  未找到 backend/.env 文件，从示例创建...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}请编辑 backend/.env 文件，填入冠客 API 配置！${NC}"
    echo "配置文件路径: $(pwd)/backend/.env"
    echo ""
    read -p "按 Enter 键继续（确认已配置）..." 
fi

# 询问部署模式
echo "请选择部署模式："
echo "1) 开发环境（使用 SQLite，适合测试）"
echo "2) 生产环境（使用 PostgreSQL，适合正式使用）"
read -p "请输入选项 [1-2]: " mode

case $mode in
    1)
        echo -e "${GREEN}🔧 启动开发环境...${NC}"
        docker-compose up -d
        ;;
    2)
        echo -e "${GREEN}🚀 启动生产环境...${NC}"
        if [ ! -f "backend/.env.production" ]; then
            echo -e "${YELLOW}⚠️  未找到生产环境配置${NC}"
            cp backend/.env.example backend/.env.production
            echo "请编辑 backend/.env.production 配置生产数据库"
            exit 1
        fi
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    *)
        echo -e "${RED}❌ 无效的选项${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📊 服务访问地址："
echo "  - 前端: http://localhost:3001"
echo "  - 后端API: http://localhost:5001"
echo "  - 后端健康检查: http://localhost:5001/api/health"
echo ""
echo "📝 常用命令："
echo "  查看日志: docker-compose logs -f"
echo "  查看状态: docker-compose ps"
echo "  停止服务: docker-compose stop"
echo "  删除容器: docker-compose down"
echo ""
echo "🎉 祝您使用愉快！"

