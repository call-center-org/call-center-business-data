// API配置文件
// 根据智能外呼机器人API文档配置

export const API_CONFIG = {
  // API基础URL - 冠客平台
  BASE_URL: 'https://open-api.gooki.com', // 或使用智语平台: https://api-open.zhizeliming.cn
  
  // 认证信息
  AUTH: {
    type: 'Bearer', // 使用Bearer Token认证
    token: '', // ⚠️ 请填写您的Token（通过 /token 接口获取）
    // Token获取方式：
    // 1. 通过账号密码: GET /token?username=xxx&password=xxx
    // 2. 通过密钥: GET /token/secret?secret=xxx
  },
  
  // 用户凭证（用于获取Token）
  CREDENTIALS: {
    username: '江苏职场', // 您的用户名
    password: 'Rodin310#', // 您的密码
    // 或者使用密钥
    secret: '', // 您的密钥
  },
  
  // API端点
  ENDPOINTS: {
    // 获取Token
    getToken: '/token',
    getTokenBySecret: '/token/secret',
    // 获取呼出记录（话单）
    getOutboundCalls: '/task/cdr/all2',
    // 获取任务列表
    getTaskList: '/task/list/v2',
    // 获取话术列表
    getSceneList: '/scene/external/list',
    // 获取线路列表
    getDeviceList: '/device/list',
    // 获取外呼统计数据（账号维度）
    getStatistics: '/extension/agent/stat',
  },
  
  // 请求超时时间（毫秒）
  TIMEOUT: 30000,
}

// 数据字段映射（根据实际API响应格式）
export const FIELD_MAPPING = {
  // 呼出时间字段（时间戳）
  callTime: 'callTime',
  // 任务名称
  taskName: 'TaskName',
  // 设备ID（坐席设备）
  deviceId: 'deviceId',
  // 设备名称
  deviceName: 'deviceName',
  // 用户ID
  userId: 'userId',
  // 通话时长字段（秒）
  duration: 'duration',
  // 客户电话字段
  customerPhone: 'phone',
  // 意向度/评级
  grade: 'grade',
  // 挂机原因
  hangupReason: 'hangupReason',
  // 通话录音
  audio: 'audio',
  // 地区
  city: 'city',
  province: 'province',
  // 任务ID
  taskId: 'taskId',
  // 是否呼叫（1=已呼叫）
  isCall: 'isCall',
}
