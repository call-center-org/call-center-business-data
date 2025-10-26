# 外呼坐席数据获取系统

> **Call Center Organization** 的子系统 - 外呼数据采集与分析
> 
> **版本**: v2.0（前后端分离架构）

---

## 🏠 项目定位

本系统是 [Call Center Organization](https://github.com/call-center-org) 微服务架构中的**数据采集系统**。

**⚠️ 如果你是第一次接触本项目或打开新的对话窗口**，建议先阅读：
- 📚 [Organization README](https://github.com/call-center-org) - 了解整体架构和所有子系统
- 📖 然后回到本 README 了解外呼数据系统的具体信息

**🤖 如果你是 AI 助手**，请先阅读 workspace 根目录的 `ORGANIZATION_README.md` 和本仓库的 `.cursorrules` 文件。

---

## 🎯 架构升级（v2.0）

**从 MVP 静态页面升级为前后端分离架构！**

| 项目 | v1.0（MVP） | v2.0（当前） |
|------|-----------|------------|
| 架构 | 纯前端（静态页面） | 前后端分离 |
| 后端 | ❌ 无 | ✅ Flask + SQLAlchemy |
| 数据库 | ❌ localStorage | ✅ PostgreSQL / SQLite |
| 认证 | 冠客 Token | JWT Token（组织统一） |
| 数据存储 | 前端临时 | 数据库持久化 |

**📖 迁移指南**：查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

## 📋 系统简介

基于智能外呼机器人API的数据采集和分析平台 - 前后端分离架构

**生产环境** ✅ 已上线运行：
- 前端: https://call-center-business-data.zeabur.app
- 后端: https://call-center-business-api.zeabur.app
- 部署方式: Docker + Zeabur 自动 CI/CD

## ✨ 功能特性

### 核心功能（已上线 ✅）
- 📊 **数据统计** - 当日/昨日/本月外呼数据统计
- 📈 **数据可视化** - 实时展示总呼出量、接通数、成功单、日均数据
- 👥 **坐席统计** - 自动过滤非坐席账号，准确统计坐席数量
- 📅 **每日明细** - 查看每日呼出详细数据表格
- 💰 **意向度统计** - 9元单/1元单统计（有性能问题待优化）
- 🔐 **JWT认证** - 统一的组织认证标准

### 技术特性
- ⚡ 自动Token管理（JWT 24小时有效期）
- 🔄 前后端分离架构
- 💾 数据库持久化存储（SQLite）
- 🐳 Docker 部署支持
- 🎨 现代化UI设计

---

## 🔧 MCP 支持

本项目支持 **MCP（Model Context Protocol）**，可让 AI 助手访问在线文档（飞书、Google Sheets）。

### 使用场景
- 📊 **自动生成数据报表** - "生成本周的外呼数据报表，写入飞书文档"
- 📈 **数据导出** - "把最近 7 天的数据导出到 Google Sheets"
- 🔄 **数据同步** - "每天把新的外呼数据同步到团队共享表格"

### 配置文档
- 🚀 [MCP 快速开始](../call-center-docs/mcp-setup/在线文档MCP-快速开始.md)
- 📖 [完整配置指引](../call-center-docs/mcp-setup/README-MCP配置完整指引.md)
- 💡 [使用示例](../call-center-docs/mcp-setup/在线文档MCP使用示例.md)

> 💡 **提示**：MCP 在 org workspace（`../call-center-org.code-workspace`）级别配置，配置一次即可在所有子项目中使用。

---

## 🚀 快速开始（v2.0 前后端分离）

### 方式 1：完整开发环境（前后端都启动）

#### 1. 启动后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量（复制 .env.example 为 .env 并编辑）
cp .env.example .env

# 初始化数据库
python scripts/init_db.py

# 启动后端服务
python run.py
```

后端启动在 http://localhost:5001

#### 2. 启动前端

```bash
# 在项目根目录
npm install

# 创建环境变量文件（项目根目录）
echo "VITE_BACKEND_URL=http://localhost:5001" > .env.development

# 启动前端
npm run dev
```

前端访问：http://localhost:3001

#### 3. 测试

打开浏览器控制台，应该能看到前端调用后端的 API 请求日志。

**详细步骤**：查看 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

### 方式 2：仅前端（使用旧的 MVP 模式）

如果只想测试前端（不启动后端），仍然可以使用旧的直连模式：

```bash
npm install
npm run dev
```

访问: http://localhost:3001

**注意**：这种方式会直接调用冠客 API，需要在 `src/utils/apiConfig.js` 中配置用户名密码或密钥。

---

### 构建生产版本

```bash
# 前端
npm run build

# 后端（无需构建，直接运行）
cd backend
python run.py
```

## ☁️ 部署

### 🐳 方式1：Docker 部署（推荐 ⭐）

**适合场景**：快速部署、团队协作、容器化环境

#### 快速开始

```bash
# 一键部署（推荐）
./快速部署Docker.sh

# 或手动部署
docker-compose up -d
```

#### 详细文档
- 📖 [Docker 部署完整指南](./DOCKER_DEPLOYMENT.md) - **推荐阅读**
- 🚀 支持 Docker Compose 一键部署
- 🔄 支持生产环境配置
- 📦 前后端完整容器化

---

### ⚡ 方式2：Zeabur 部署（国内推荐 ⭐⭐⭐）

**适合场景**：中国大陆用户、快速上线、自动 CI/CD

#### 优势
- ✅ 国内访问快（有中国节点）
- ✅ 自动 CI/CD（Git push 自动部署）
- ✅ 简单易用（无需配置服务器）
- ✅ 免费额度（小项目完全够用）

#### 快速部署

```bash
# 使用脚本部署（推荐）
./部署到Zeabur.sh

# 或使用 Zeabur CLI
npm install -g @zeabur/cli
zeabur auth login
zeabur deploy
```

#### 详细文档
- 📖 [Zeabur 快速开始](./Zeabur快速开始.md)
- 📖 [Zeabur CLI 使用指南](./Zeabur_CLI使用指南.md)
- 📖 [Docker 部署指南](./DOCKER_DEPLOYMENT.md) - 包含完整 Zeabur 配置

---

### ☁️ 方式3：腾讯云 CloudBase

详细步骤请查看：
- `CloudBase-GitHub自动部署配置指南.md`
- `CloudBase命令行部署.md`
- `CloudBase-Framework部署方案.md`

---

### 📊 部署方式对比

| 方式 | 适用场景 | 国内访问 | 难度 | 费用 |
|------|---------|---------|------|------|
| **Docker** | 本地开发、云服务器 | ⭐⭐⭐ | 中 | 自选 |
| **Zeabur** | 快速上线、中国用户 | ⭐⭐⭐⭐⭐ | 低 | 免费额度 |
| **CloudBase** | 腾讯云生态 | ⭐⭐⭐⭐ | 中 | 按量计费 |

## ⚙️ 使用说明

### 1. 配置API认证

首次访问时会显示认证配置界面，选择以下任一方式：

#### 方式1：密钥认证（推荐）
1. 登录外呼平台
2. 获取API密钥
3. 在配置界面输入密钥
4. 点击"获取Token"

#### 方式2：账号密码认证
1. 在配置界面选择"账号密码"
2. 输入用户名和密码
3. 点击"获取Token"

### 4. 开始使用
1. Token获取成功后自动进入统计界面
2. 选择统计天数（默认3天）
3. 点击"加载数据"查看统计

## 📁 项目结构

```
src/
├── components/
│   ├── Header.jsx          # 页头组件
│   ├── CallStatistics.jsx  # 呼出统计组件（MVP核心）
│   ├── TokenConfig.jsx     # Token配置组件
│   ├── Dashboard.jsx       # 数据概览
│   └── Analytics.jsx       # 数据分析
├── utils/
│   ├── apiConfig.js        # API配置（已自动配置）
│   ├── apiClient.js        # HTTP客户端
│   ├── tokenManager.js     # Token管理器
│   └── callApi.js          # 呼出数据API
├── App.jsx
└── main.jsx
```

## 🔧 API配置

### 已自动配置
- API基础URL: `https://open-api.gooki.com` (冠客平台)
- 备用平台: `https://api-open.zhizeliming.cn` (智语平台)
- 所有API端点已配置
- 所有字段映射已完成

### 手动配置（可选）
如需修改配置，编辑 `src/utils/apiConfig.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://open-api.gooki.com',
  CREDENTIALS: {
    secret: '您的密钥', // 或使用 username + password
  }
}
```

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **HTTP客户端**: Axios
- **图标库**: Lucide React
- **通知提示**: React Hot Toast

## 📊 数据统计说明

### 统计指标
- **总呼出量**: 选定时间范围内的总呼叫次数
- **成功呼出**: 接通且正常挂机的呼叫数
- **失败呼出**: 未接通或异常挂机的呼叫数
- **日均呼出**: 平均每天的呼叫量
- **成功率**: 成功呼出 / 总呼出量

### 判断标准
- **成功**: `hangupReason === 'NORMAL_CLEARING' && duration > 0`
- **失败**: 其他情况

## 🔐 安全说明

- Token存储在浏览器LocalStorage中
- Token有效期30天，过期自动刷新
- 建议使用密钥认证而非账号密码
- 密钥只显示一次，请妥善保管

## 📝 开发计划

### MVP ✅ 已完成
- [x] Token自动管理
- [x] 呼出数据统计
- [x] 每日明细展示
- [x] 成功率计算

### v2.0 ✅ 已完成
- [x] 前后端分离架构
- [x] Docker 部署配置
- [x] Zeabur 生产环境部署
- [x] 坐席统计（自动过滤）
- [x] 意向度统计功能

### v2.1 🔄 进行中
- [ ] 修复意向度统计性能问题 🔴 优先级高
- [ ] 添加 Redis 缓存
- [ ] 定时任务（自动数据同步）
- [ ] 数据图表可视化

### 未来规划
- [ ] 任务维度统计
- [ ] 坐席绩效分析
- [ ] 数据导出功能（Excel/CSV）
- [ ] 实时数据监控

## ❓ 常见问题

**Q: Token获取失败？**
A: 检查用户名/密码/密钥是否正确，确认平台URL是否正确

**Q: 数据加载失败？**
A: 检查Token是否有效，查看浏览器控制台的错误信息

**Q: 意向度统计显示为0？**
A: 这是已知问题，后端API有性能问题。临时解决方案：前端会显示警告但不影响主功能

**Q: 如何切换平台？**
A: 修改 `apiConfig.js` 中的 `BASE_URL`

---

## ⚠️ 已知问题（2025-10-26）

### 意向度统计 API 性能问题

**问题描述**: `/api/stats/grade-stats` 接口在有数据的日期会返回 500 错误或超时

**影响范围**: 9元单/1元单统计无法正常显示

**临时解决方案**: 
- 前端添加了 10 秒超时处理
- 失败时不会阻塞页面显示
- 主要功能不受影响

**修复计划**: 
1. 添加调试日志定位问题
2. 实现缓存机制
3. 优化数据处理逻辑

**相关文档**: 查看 `当前开发状态_2025-10-26.md`

---

## 📞 技术支持

如有问题，请查看：
1. 浏览器控制台（F12）的详细日志
2. Zeabur 后端日志（服务页面 → 日志标签）
3. 当前开发状态文档：`当前开发状态_2025-10-26.md`

**生产环境**:
- 前端: https://call-center-business-data.zeabur.app
- 后端: https://call-center-business-api.zeabur.app

**最后更新**: 2025-10-26  
**版本**: v2.1  
**状态**: ✅ 生产运行中
