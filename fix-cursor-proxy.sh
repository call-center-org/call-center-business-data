#!/bin/bash

# ============================================
# Cursor 续杯工具代理修复脚本
# ============================================
# 用途：当续杯工具代理功能出现问题时，一键修复
# 使用方法：./fix-cursor-proxy.sh
# ============================================

echo "🚀 开始修复 Cursor 代理问题..."
echo ""

# 步骤 1：检查续杯工具是否运行
echo "📋 步骤 1/5: 检查续杯工具状态..."
if ps aux | grep -i "CursorRenewal" | grep -v grep > /dev/null; then
    echo "✅ 续杯工具正在运行"
else
    echo "⚠️  续杯工具未运行，请先启动续杯工具"
    exit 1
fi
echo ""

# 步骤 2：检查代理端口
echo "📋 步骤 2/5: 检查代理端口..."
if lsof -i -P | grep -E ":(7890|8080|1080)" > /dev/null; then
    echo "✅ 检测到代理端口活动"
else
    echo "⚠️  未检测到代理端口，请在续杯工具中开启突破地区限制功能"
fi
echo ""

# 步骤 3：备份当前配置
echo "📋 步骤 3/5: 备份当前配置..."
SETTINGS_FILE="$HOME/Library/Application Support/Cursor/User/settings.json"
BACKUP_FILE="$HOME/Library/Application Support/Cursor/User/settings.json.backup.$(date +%Y%m%d_%H%M%S)"

if [ -f "$SETTINGS_FILE" ]; then
    cp "$SETTINGS_FILE" "$BACKUP_FILE"
    echo "✅ 配置已备份到: $BACKUP_FILE"
else
    echo "⚠️  未找到配置文件，将创建新配置"
fi
echo ""

# 步骤 4：清除代理配置（恢复默认）
echo "📋 步骤 4/5: 清除代理配置..."
cat > "$SETTINGS_FILE" << 'EOF'
{
    "database-client.autoSync": true,
    "update.enableWindowsBackgroundUpdates": false,
    "update.mode": "none",
    "http.proxyAuthorization": null,
    "json.schemas": []
}
EOF
echo "✅ 代理配置已清除"
echo ""

# 步骤 5：重启 Cursor
echo "📋 步骤 5/5: 重启 Cursor..."
if pgrep -x "Cursor" > /dev/null; then
    echo "正在关闭 Cursor..."
    killall Cursor
    sleep 2
fi

echo "正在启动 Cursor..."
open -a Cursor
sleep 3
echo "✅ Cursor 已重启"
echo ""

# 完成
echo "🎉 修复完成！"
echo ""
echo "📋 下一步操作："
echo "1. ✅ 确保续杯工具的'突破地区限制'功能已开启"
echo "2. ✅ 等待 5 秒钟让代理完全启动"
echo "3. ✅ 在 Cursor 中测试 Auto 模式"
echo "4. ✅ 测试 Claude 模型"
echo ""
echo "💡 提示："
echo "   - 如果还是不行，请联系 AI 助手"
echo "   - 备份文件保存在: $BACKUP_FILE"
echo ""

