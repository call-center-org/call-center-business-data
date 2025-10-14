# 智能外呼机器人接口文档

## 接口前缀

- **冠客平台**: https://open-api.gooki.com (https)
- **智语平台**: https://api-open.zhizeliming.cn (https)

## 一、获取用户token(账号密码)

### 基本信息
- Path: `/token`
- Method: GET

### 接口描述
通过用户名和密码取用户身份令牌token，用于用户身份校验，默认有效期30天。
特殊字符使用url加密

### 请求参数
- username: 用户名
- password: 密码

### 返回数据
```json
{
    "code": 200,
    "message": "OK",
    "data": {
        "token": "xxx"
    }
}
```

## 十六、获取话单接口

### 基本信息
- Path: `/task/cdr/all2`
- Method: GET

### 接口描述
话单列表，按照日期获取数据

### 请求参数
- page (int, 必填): 页码
- pageSize (int, 可选): 每页数量，大于1000没有返回值
- startTime (string, 必填): 开始时间，如 2023-04-26 00:00:00 (时间需要url编码)
- endTime (string, 必填): 结束时间，如 2023-04-26 59:59:59 (时间需要url编码)
- phone (string, 可选): 手机号
- callState (int, 可选): 0:未拨打, 1:未接通, 2:已接通
- taskId (int, 可选): 任务ID

### 响应格式
```json
{
    "code": 200,
    "message": "OK",
    "data": {
        "data": [...],
        "end": 1682524799,
        "only": "",
        "page": 1,
        "start": 1682352000,
        "totalCount": 3
    }
}
```

### 话单字段说明
- TaskName: 任务名称
- audio: 通话录音URL
- callTime: 拨打时间(时间戳)
- ccId: 跟进用户ID
- city: 地区
- companyId: 公司ID
- deviceId: 设备ID
- deviceName: 设备名称
- duration: 通话时长(秒)
- ext: 话术中设置的采集节点
- grade: 意向度、评级
- hangupReason: 挂机原因
- id: 话单ID
- isCall: 是否呼叫
- isFollow: 是否跟进
- params: 客户侧自定义的参数回传
- phone: 手机号
- province: 省份
- realPhone: 真实手机号
- remark: 备注
- taskId: 任务ID
- userId: 用户ID

