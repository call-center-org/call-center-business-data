#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// 修复 HTML 文件中的路径
function fixPaths() {
  const htmlFile = path.join(__dirname, "dist", "index.html");
  
  if (!fs.existsSync(htmlFile)) {
    console.log("❌ dist/index.html 不存在");
    return;
  }
  
  let content = fs.readFileSync(htmlFile, "utf8");
  
  // 替换绝对路径为相对路径
  content = content.replace(/src="\/assets\//g, "src=\"./assets/");
  content = content.replace(/href="\/assets\//g, "href=\"./assets/");
  content = content.replace(/href="\/vite\.svg/g, "href=\"./vite.svg");
  
  fs.writeFileSync(htmlFile, content);
  console.log("✅ 已修复 HTML 文件中的路径");
}

fixPaths();
