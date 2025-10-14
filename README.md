# 外呼坐席数据获取系统

基于智能外呼机器人API的数据采集和分析平台 - 快速统计呼出数据

## ✨ 功能特性

### MVP功能
- 📊 **呼出统计** - 统计近N天的外呼数据（1/3/7/15/30天）
- 🔐 **智能认证** - 支持密钥和账号密码两种认证方式
- 📈 **数据可视化** - 实时展示总呼出量、成功率、失败率、日均呼出
- 📅 **每日明细** - 查看每日呼出详细数据

### 技术特性
- ⚡ 自动Token管理（30天有效期）
- 🔄 Token过期自动刷新
- 💾 本地缓存Token
- 🎨 现代化UI设计

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:3001

### 3. 配置API认证

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

## 📖 API文档

完整的API文档请查看：
- `API_DOCUMENTATION.md` - API接口文档摘要
- `API_SETUP_GUIDE.md` - 详细配置指南

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

### MVP ✅
- [x] Token自动管理
- [x] 呼出数据统计
- [x] 每日明细展示
- [x] 成功率计算

### 下一步计划
- [ ] 数据图表可视化
- [ ] 任务列表查询
- [ ] 坐席绩效分析
- [ ] 数据导出功能
- [ ] 实时数据监控

## ❓ 常见问题

**Q: Token获取失败？**
A: 检查用户名/密码/密钥是否正确，确认平台URL是否正确

**Q: 数据加载失败？**
A: 检查Token是否有效，查看浏览器控制台的错误信息

**Q: 如何切换平台？**
A: 修改 `apiConfig.js` 中的 `BASE_URL`

## 📞 技术支持

如有问题，请查看浏览器控制台（F12）的详细日志。
