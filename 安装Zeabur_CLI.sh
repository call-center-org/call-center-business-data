#!/bin/bash

echo "🚀 安装 Zeabur CLI"
echo ""

# 检查是否已安装
if command -v zeabur >/dev/null 2>&1; then
  echo "✅ Zeabur CLI 已安装"
  zeabur --version
  echo ""
  echo "如需更新，请运行："
  echo "  brew upgrade zeabur    # 如果使用 Homebrew"
  echo "  或"
  echo "  curl -fsSL https://cli.zeabur.com/install.sh | bash"
  echo ""
  exit 0
fi

echo "❌ Zeabur CLI 未安装"
echo ""
echo "================================"
echo "选择安装方式："
echo "================================"
echo ""
echo "1️⃣  使用 Homebrew（推荐 macOS）"
echo "2️⃣  使用 npm"
echo "3️⃣  使用 curl（直接下载）"
echo ""

# 检查可用的包管理器
HAS_BREW=false
HAS_NPM=false

if command -v brew >/dev/null 2>&1; then
  HAS_BREW=true
fi

if command -v npm >/dev/null 2>&1; then
  HAS_NPM=true
fi

echo "你的系统："
if [ "$HAS_BREW" = true ]; then
  echo "  ✅ Homebrew 可用"
else
  echo "  ❌ Homebrew 未安装"
fi

if [ "$HAS_NPM" = true ]; then
  echo "  ✅ npm 可用"
else
  echo "  ❌ npm 未安装"
fi
echo ""

# 推荐安装方式
if [ "$HAS_BREW" = true ]; then
  echo "================================"
  echo "推荐：使用 Homebrew 安装"
  echo "================================"
  echo ""
  echo "运行以下命令："
  echo ""
  echo "  brew tap zeabur/tap"
  echo "  brew install zeabur"
  echo ""
  read -p "是否现在安装？(y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在安装..."
    brew tap zeabur/tap
    brew install zeabur
    
    if command -v zeabur >/dev/null 2>&1; then
      echo ""
      echo "✅ 安装成功！"
      zeabur --version
      echo ""
      echo "下一步：登录 Zeabur"
      echo "  zeabur auth login"
    else
      echo ""
      echo "❌ 安装失败，请尝试其他方式"
    fi
  fi
elif [ "$HAS_NPM" = true ]; then
  echo "================================"
  echo "推荐：使用 npm 安装"
  echo "================================"
  echo ""
  echo "运行以下命令："
  echo ""
  echo "  npm install -g @zeabur/cli"
  echo ""
  read -p "是否现在安装？(y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在安装..."
    npm install -g @zeabur/cli
    
    if command -v zeabur >/dev/null 2>&1; then
      echo ""
      echo "✅ 安装成功！"
      zeabur --version
      echo ""
      echo "下一步：登录 Zeabur"
      echo "  zeabur auth login"
    else
      echo ""
      echo "❌ 安装失败，请尝试其他方式"
    fi
  fi
else
  echo "================================"
  echo "推荐：使用 curl 直接安装"
  echo "================================"
  echo ""
  echo "运行以下命令："
  echo ""
  echo "  curl -fsSL https://cli.zeabur.com/install.sh | bash"
  echo ""
  read -p "是否现在安装？(y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在安装..."
    curl -fsSL https://cli.zeabur.com/install.sh | bash
    
    # 重新加载 PATH
    export PATH="$HOME/.zeabur/bin:$PATH"
    
    if command -v zeabur >/dev/null 2>&1; then
      echo ""
      echo "✅ 安装成功！"
      zeabur --version
      echo ""
      echo "⚠️  重要：请重新加载 shell 配置"
      echo "  source ~/.zshrc"
      echo ""
      echo "下一步：登录 Zeabur"
      echo "  zeabur auth login"
    else
      echo ""
      echo "❌ 安装可能失败，请重新加载 shell 后检查"
      echo "  source ~/.zshrc"
      echo "  zeabur --version"
    fi
  fi
fi

echo ""
echo "================================"
echo "手动安装说明"
echo "================================"
echo ""
echo "如果自动安装失败，可以手动操作："
echo ""
echo "方法 1：Homebrew"
echo "  brew tap zeabur/tap"
echo "  brew install zeabur"
echo ""
echo "方法 2：npm"
echo "  npm install -g @zeabur/cli"
echo ""
echo "方法 3：直接下载"
echo "  curl -fsSL https://cli.zeabur.com/install.sh | bash"
echo "  source ~/.zshrc"
echo ""
echo "安装后验证："
echo "  zeabur --version"
echo ""
echo "登录："
echo "  zeabur auth login"
echo ""

