# API配置指南 - 智能外呼机器人

## 🎉 API已自动配置完成！

基于您提供的API文档，系统已自动配置好所有接口参数。

---

## 📋 快速开始：3步完成配置

### 第一步：填写认证信息

打开 `src/utils/apiConfig.js` 文件，填写您的登录凭证：

```javascript
// 用户凭证（用于获取Token）
CREDENTIALS: {
  username: '您的用户名',  // ⚠️ 请填写
  password: '您的密码',    // ⚠️ 请填写
  // 或者使用密钥（二选一）
  secret: '您的密钥',      // ⚠️ 如果有密钥，填写这个
}
```

**认证方式说明：**
1. **用户名密码方式**：填写 `username` 和 `password`
2. **密钥方式**（推荐）：只填写 `secret`

系统会自动获取并管理Token（有效期30天）。

---

### 第二步：选择平台

在 `apiConfig.js` 中确认平台地址：

```javascript
BASE_URL: 'https://open-api.gooki.com',  // 冠客平台（默认）
// 或
BASE_URL: 'https://api-open.zhizeliming.cn',  // 智语平台
```

---

### 第三步：测试连接

1. 打开浏览器访问 http://localhost:3001
2. 点击 **"呼出统计"** 标签
3. 点击 **"测试连接"** 按钮
4. 看到 ✅ 连接成功提示即可

---

## 🔧 已自动配置的功能

### ✅ API端点
- `/token` - 获取Token（账号密码）
- `/token/secret` - 获取Token（密钥）
- `/task/cdr/all2` - 获取话单记录 ⭐ **MVP使用**
- `/task/list/v2` - 获取任务列表
- `/scene/external/list` - 获取话术列表
- `/device/list` - 获取线路列表
- `/extension/agent/stat` - 获取统计数据

### ✅ 字段映射
- `callTime` - 拨打时间（时间戳）
- `duration` - 通话时长（秒）
- `grade` - 意向度/评级
- `hangupReason` - 挂机原因
- `TaskName` - 任务名称
- `deviceName` - 设备名称
- `phone` - 手机号
- 等30+字段...

### ✅ Token自动管理
- 自动获取Token
- 自动刷新Token（30天有效期）
- Token过期自动重新获取
- 本地缓存Token

---

### 第三步：测试连接

1. 访问 http://localhost:3001
2. 点击"呼出统计"标签
3. 点击"测试连接"按钮
4. 查看控制台输出（F12打开开发者工具）

如果连接失败，请检查：
- API URL是否正确
- Token是否有效
- 接口路径是否正确
- 网络是否可访问

---

### 第四步：加载数据

连接成功后：
1. 选择统计天数（默认3天）
2. 点击"加载数据"按钮
3. 查看统计结果

---

## 🔍 需要提供的信息示例

### 示例1：API响应格式
```json
{
  "code": 0,
  "data": [
    {
      "call_id": "123456",
      "call_time": "2024-01-15 10:30:00",
      "agent_id": "001",
      "agent_name": "张三",
      "status": "success",
      "duration": 120
    }
  ]
}
```

### 示例2：认证方式
```
Authorization: Bearer your-token-here
```
或
```
X-API-Key: your-api-key-here
```

---

## 🚀 下一步

完成MVP后，我们可以继续开发：
- 更详细的数据分析
- 实时数据监控
- 坐席绩效排行
- 数据可视化图表
- 自动定时采集

---

## ❓ 常见问题

**Q: 找不到API文档中的接口？**
A: 请提供API文档的文本内容，我会帮您找到对应的接口。

**Q: API需要特殊的请求头？**
A: 在 `apiClient.js` 中的请求拦截器添加自定义请求头。

**Q: 响应数据结构不匹配？**
A: 在 `callApi.js` 中调整数据解析逻辑。
