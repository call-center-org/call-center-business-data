# 阿里云OSS跨域(CORS)配置说明

## 配置步骤

在阿里云OSS控制台 → Bucket配置 → 跨域设置 → 创建规则，按以下内容填写：

### 1. 来源（必填）
```
*
```
或者更安全的方式，填写您的API域名：
```
https://open-api.gooki.com
```

### 2. 允许 Methods（勾选以下所有选项）
- ✅ GET
- ✅ POST
- ✅ PUT
- ✅ DELETE
- ✅ HEAD

### 3. 允许 Headers（必填）
```
*
```
或者具体填写：
```
Content-Type
Authorization
X-Requested-With
Accept
Origin
```

### 4. 暴露 Headers（可选，建议填写）
```
*
```
或者：
```
ETag
Content-Length
```

### 5. 缓存时间（秒）
```
3600
```

### 6. 返回 Vary: Origin
建议勾选

## 配置完成后

点击"确定"保存，规则会在15分钟内生效。

## 为什么需要CORS配置？

当您的前端页面（托管在OSS）需要访问外部API时，浏览器会进行跨域检查。
配置CORS后，浏览器允许您的页面访问指定的API服务。

## 验证CORS配置

配置完成后，在浏览器打开您的网站：
http://outbound-agent-data-tomnice.oss-cn-beijing.aliyuncs.com

打开浏览器开发者工具（F12），查看Console和Network标签，
如果没有CORS错误，说明配置成功。

