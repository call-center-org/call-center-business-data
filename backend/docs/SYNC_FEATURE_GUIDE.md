# 任务同步功能使用指南

## 📋 概述

本系统实现了一套完善的任务数据自动同步机制，用于从冠客系统定时拉取任务数据并进行智能匹配。

---

## ✨ 核心功能

### 1️⃣ 自动同步策略

- **历史数据（T-3天至昨日）**
  - 每天执行 4 次：1:00, 10:00, 15:00, 21:00
  - 适用于数据补全和历史数据校正

- **今日数据（当天 0:00 至当前）**
  - 工作时间执行：9:00-23:00 每小时
  - 实时跟踪当日任务进展

### 2️⃣ 手动同步

用户可通过 API 接口手动触发同步，适用于以下场景：
- 紧急需要最新数据
- 系统刚部署需要初始化数据
- 自动同步失败后的重试

### 3️⃣ 同步锁机制

- **防止并发**：确保同一时刻只有一个同步任务在执行
- **自动过期**：锁超时时间 30 分钟，防止死锁
- **自动清理**：每 5 分钟清理一次过期锁

### 4️⃣ 重试机制

- **最多重试 3 次**
- **指数退避**：2秒 → 4秒 → 8秒
- **详细日志**：记录每次重试的原因和结果

### 5️⃣ 批量处理

- **批次大小**：50 个任务/批
- **优化性能**：适合日均 50-100 个任务
- **事务安全**：每批独立提交，失败不影响其他批次

---

## 🔌 API 接口

### 1. 手动触发历史数据同步

```http
POST /api/sync/historical/manual
```

**响应示例：**
```json
{
  "success": true,
  "record_id": 1,
  "summary": {
    "total": 85,
    "new": 12,
    "updated": 73,
    "matched": 80,
    "pending": 5,
    "failed": 0,
    "duration": 15
  }
}
```

---

### 2. 手动触发今日数据同步

```http
POST /api/sync/today/manual
```

**响应示例：**
```json
{
  "success": true,
  "record_id": 2,
  "summary": {
    "total": 28,
    "new": 5,
    "updated": 23,
    "matched": 26,
    "pending": 2,
    "failed": 0,
    "duration": 8
  }
}
```

---

### 3. 获取同步记录列表

```http
GET /api/sync/records?page=1&per_page=20&sync_type=historical
```

**参数：**
- `page`: 页码（默认 1）
- `per_page`: 每页数量（默认 20）
- `sync_type`: 类型过滤（`historical` 或 `today`）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "sync_type": "historical",
        "sync_type_label": "历史数据",
        "trigger_type": "auto",
        "trigger_type_label": "自动",
        "status": "success",
        "status_label": "成功",
        "start_time": "2025-10-24T10:00:00",
        "end_time": "2025-10-24T10:00:15",
        "duration": 15,
        "tasks_total": 85,
        "tasks_new": 12,
        "tasks_updated": 73,
        "tasks_matched": 80,
        "tasks_pending": 5,
        "tasks_failed": 0,
        "is_read": false
      }
    ],
    "total": 100,
    "page": 1,
    "per_page": 20,
    "pages": 5,
    "unread_count": 3
  }
}
```

---

### 4. 获取同步记录详情

```http
GET /api/sync/records/1
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sync_type": "historical",
    "status": "partial",
    "tasks_total": 85,
    "tasks_new": 12,
    "tasks_updated": 73,
    "tasks_failed": 2,
    "error_message": null,
    "error_details": [
      {
        "task_id": "12345",
        "task_name": "测试任务-P1",
        "error": "数据包不存在"
      }
    ]
  }
}
```

---

### 5. 标记为已读

```http
POST /api/sync/records/1/read
```

**响应示例：**
```json
{
  "success": true,
  "message": "已标记为已读"
}
```

---

### 6. 标记所有为已读

```http
POST /api/sync/records/read-all
```

**响应示例：**
```json
{
  "success": true,
  "message": "已标记所有记录为已读"
}
```

---

### 7. 获取同步状态

```http
GET /api/sync/status
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "historical": {
      "syncing": false,
      "locked_by": null,
      "last_sync": {
        "id": 1,
        "status": "success",
        "start_time": "2025-10-24T10:00:00",
        "tasks_total": 85
      }
    },
    "today": {
      "syncing": true,
      "locked_by": "MacBook-Pro.local-12345",
      "last_sync": {
        "id": 2,
        "status": "running",
        "start_time": "2025-10-24T14:00:00"
      }
    }
  }
}
```

---

## 📊 数据库表结构

### `sync_records` - 同步记录表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| sync_type | VARCHAR(20) | 同步类型（historical/today） |
| trigger_type | VARCHAR(20) | 触发类型（auto/manual） |
| status | VARCHAR(20) | 状态（running/success/failed/partial） |
| start_time | DATETIME | 开始时间 |
| end_time | DATETIME | 结束时间 |
| duration | INTEGER | 耗时（秒） |
| tasks_total | INTEGER | 总任务数 |
| tasks_new | INTEGER | 新增数 |
| tasks_updated | INTEGER | 更新数 |
| tasks_matched | INTEGER | 匹配数 |
| tasks_pending | INTEGER | 待匹配数 |
| tasks_failed | INTEGER | 失败数 |
| error_message | TEXT | 错误信息 |
| error_details | JSON | 详细错误列表 |
| retry_count | INTEGER | 重试次数 |
| max_retries | INTEGER | 最大重试次数 |
| is_read | BOOLEAN | 是否已读 |
| read_at | DATETIME | 阅读时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### `sync_locks` - 同步锁表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| sync_type | VARCHAR(20) | 同步类型（UNIQUE） |
| locked_at | DATETIME | 锁定时间 |
| locked_by | VARCHAR(100) | 锁定者（主机名-进程ID） |
| expires_at | DATETIME | 过期时间 |
| created_at | DATETIME | 创建时间 |

---

## 🛠️ 故障排查

### 问题 1：同步失败

**可能原因：**
1. 冠客 API 连接失败
2. Token 过期
3. 数据格式错误

**解决方法：**
1. 检查网络连接
2. 刷新 Token
3. 查看 `error_details` 字段获取详细错误信息

---

### 问题 2：同步锁冲突

**错误提示：**
```json
{
  "success": false,
  "error": "同步任务正在进行中，请稍后再试\n锁定者：MacBook-Pro.local-12345\n锁定时间：2025-10-24 10:00:00",
  "error_type": "lock_conflict"
}
```

**解决方法：**
- 等待当前同步完成（一般 10-30 秒）
- 如果长时间锁定，系统会自动清理（30 分钟后）

---

### 问题 3：定时任务未执行

**检查步骤：**
1. 确认后端服务正在运行
2. 查看日志是否有错误信息
3. 检查 APScheduler 是否正常启动

**日志查看：**
```bash
# 启动后端时会显示：
# ✅ 定时任务调度器已启动
# 📅 已注册定时任务: 历史数据同步 [1:00, 10:00, 15:00, 21:00]
# 📅 已注册定时任务: 今日数据同步 [9:00-23:00 每小时]
```

---

## 📝 最佳实践

### 1. 监控同步记录

定期检查 `sync_records` 表：
```sql
SELECT 
  sync_type,
  status,
  tasks_total,
  tasks_failed,
  created_at
FROM sync_records
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### 2. 清理历史记录

定期清理 30 天前的记录：
```sql
DELETE FROM sync_records
WHERE created_at < DATE('now', '-30 days');
```

### 3. 红点提示前端实现

```javascript
// 获取未读数量
const response = await fetch('/api/sync/records?page=1&per_page=1');
const { unread_count } = response.data;

// 显示红点
if (unread_count > 0) {
  showBadge(unread_count);
}
```

---

## 🔧 配置参数

可在 `backend/app/services/sync_service.py` 中调整：

```python
class SyncService:
    BATCH_SIZE = 50  # 批次大小
    MAX_RETRIES = 3  # 最大重试次数
    LOCK_TIMEOUT_MINUTES = 30  # 锁超时时间
```

可在 `backend/app/tasks/scheduler.py` 中调整定时任务：

```python
# 历史数据同步时间
scheduler.add_job(
    func=sync_historical,
    trigger=CronTrigger(hour='1,10,15,21', minute=0),
    ...
)

# 今日数据同步时间
scheduler.add_job(
    func=sync_today,
    trigger=CronTrigger(hour='9-23', minute=0),
    ...
)
```

---

## 📞 技术支持

如有问题，请查看：
1. 系统日志：`backend/logs/`
2. 同步记录详情：`GET /api/sync/records/<id>`
3. 同步状态：`GET /api/sync/status`

---

## 🎯 下一步计划（前端开发）

后端功能已全部完成，接下来可以开发前端页面：

1. **同步管理页面**
   - 显示同步记录列表
   - 手动触发同步按钮
   - 查看同步详情和错误信息

2. **红点提示功能**
   - 顶部导航栏显示未读数量
   - 点击后跳转到同步记录页面

3. **数据可视化**
   - 同步成功率图表
   - 任务匹配率统计
   - 同步耗时趋势

---

**实施日期**: 2025-10-24  
**实施版本**: v1.0  
**状态**: ✅ 已完成并测试通过

