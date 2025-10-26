#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 rclone Google Drive 配置向导"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "请按照提示操作："
echo ""
echo "1. 输入名称时，请输入：gdrive"
echo "2. 选择存储类型时，输入对应 Google Drive 的数字"
echo "3. Client ID 和 Secret 直接按回车（使用默认）"
echo "4. Scope 选择 1（完全访问）"
echo "5. 其他选项都按回车使用默认"
echo "6. 最后会打开浏览器进行 Google 授权"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

rclone config
