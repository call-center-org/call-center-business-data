# CloudBase 命令行部署指南

## 🚀 使用CloudBase CLI快速部署

### 步骤1：安装CloudBase CLI

```bash
npm install -g @cloudbase/cli
```

### 步骤2：登录

```bash
cloudbase login
```
会打开浏览器进行授权登录

### 步骤3：初始化项目

```bash
cd /Users/tomnice/outbound-agent-data
cloudbase init
```

选择：
- 环境ID：`cloud1-6gt5Jxm10210d0f`（从控制台复制）
- 功能：选择"静态网站托管"

### 步骤4：部署

```bash
cloudbase hosting deploy dist -e cloud1-6gt5Jxm10210d0f
```

### 步骤5：查看访问地址

部署成功后，访问：
```
https://cloud1-6gt5Jxm10210d0f-1300255017.tcloudbaseapp.com
```

---

## 📝 或者使用网页直接上传

在CloudBase控制台页面：
1. 找到"文件管理"或"上传文件"
2. 将dist文件夹中的所有文件上传
3. 包括：
   - index.html
   - assets/ 文件夹

---

**两种方式都可以，选择您觉得方便的！**

