"""
冠客 API 调用服务
封装与冠客平台的所有交互
"""
import os
import requests
from datetime import datetime, timedelta
from app.config import Config


class GuankeAPI:
    """冠客 API 客户端"""
    
    def __init__(self, username=None, password=None, api_secret=None):
        self.base_url = Config.GUANKE_BASE_URL
        self.username = username or os.getenv('GUANKE_USERNAME')
        self.password = password or os.getenv('GUANKE_PASSWORD')
        self.api_secret = api_secret or os.getenv('GUANKE_API_SECRET')
        self.token = None
        self.token_expires_at = None
    
    def get_token(self):
        """
        获取 Token
        优先使用用户名密码，其次使用密钥
        """
        if self.token and self.token_expires_at and datetime.now() < self.token_expires_at:
            return self.token
        
        # 优先使用用户名密码方式
        if self.username and self.password:
            return self._get_token_by_password()
        elif self.api_secret:
            return self._get_token_by_secret()
        else:
            raise Exception("未配置冠客 API 认证信息（需要用户名密码或密钥）")
    
    def _get_token_by_password(self):
        """通过用户名密码获取 Token"""
        url = f"{self.base_url}/token"
        params = {
            'username': self.username,
            'password': self.password
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if result.get('code') == 200:
                self.token = result.get('data', {}).get('token')
                # Token 有效期 30 天
                self.token_expires_at = datetime.now() + timedelta(days=30)
                return self.token
            else:
                raise Exception(f"Token 获取失败: {result.get('message', '未知错误')}")
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"获取 Token 失败: {str(e)}")
    
    def _get_token_by_secret(self):
        """通过密钥获取 Token"""
        url = f"{self.base_url}/token/secret"
        params = {'secret': self.api_secret}
        
        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if result.get('code') == 200:
                self.token = result.get('data', {}).get('token')
                # Token 有效期 30 天
                self.token_expires_at = datetime.now() + timedelta(days=30)
                return self.token
            else:
                raise Exception(f"Token 获取失败: {result.get('message', '未知错误')}")
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"获取 Token 失败: {str(e)}")
    
    def get_call_records(self, start_date, end_date, page=1, page_size=1000):
        """
        获取通话记录
        
        参数：
            start_date: 开始日期（YYYY-MM-DD HH:mm:ss）
            end_date: 结束日期（YYYY-MM-DD HH:mm:ss）
            page: 页码
            page_size: 每页数量（最大1000）
        """
        token = self.get_token()
        
        # 使用正确的API端点
        url = f"{self.base_url}/task/cdr/all2"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': token  # 直接使用token，不需要Bearer前缀
        }
        params = {
            'startTime': start_date,  # 注意：字段名是startTime和endTime
            'endTime': end_date,
            'page': page,
            'pageSize': page_size
        }
        
        try:
            response = requests.get(url, params=params, headers=headers, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            # 返回完整结果，包括 code 和 message
            return result
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"获取通话记录失败: {str(e)}")
    
    def get_all_call_records(self, start_date, end_date):
        """
        获取所有通话记录（自动分页，分批查询）
        
        注意：冠客API限制单次查询不超过7天，所以需要分批查询
        
        参数：
            start_date: 开始日期（YYYY-MM-DD）
            end_date: 结束日期（YYYY-MM-DD）
        
        返回：
            records: 通话记录列表
        """
        from datetime import datetime as dt, timedelta
        
        all_records = []
        
        # 转换为日期对象
        start = dt.strptime(start_date, '%Y-%m-%d').date()
        end = dt.strptime(end_date, '%Y-%m-%d').date()
        
        # 按7天一批查询（冠客API限制）
        current_start = start
        while current_start <= end:
            current_end = min(current_start + timedelta(days=6), end)  # 最多7天
            
            # 格式化日期时间
            start_datetime = f"{current_start} 00:00:00"
            end_datetime = f"{current_end} 23:59:59"
            
            print(f"  查询 {current_start} 到 {current_end}...")
            
            # 分页获取这一批的数据
            page = 1
            page_size = 1000
            
            while True:
                data = self.get_call_records(start_datetime, end_datetime, page, page_size)
                
                # 根据API响应结构获取数据
                if data.get('code') == 200:
                    page_data = data.get('data', {}).get('data', [])
                    total_count = data.get('data', {}).get('totalCount', 0)
                    
                    if not page_data:
                        break
                    
                    all_records.extend(page_data)
                    print(f"    第{page}页: 获取{len(page_data)}条 (总计: {len(all_records)}/{total_count})")
                    
                    # 检查是否还有下一页
                    if len(page_data) < page_size:
                        break
                    
                    page += 1
                else:
                    print(f"    警告: {data.get('message', '未知错误')}")
                    break
            
            # 移到下一批
            current_start = current_end + timedelta(days=1)
        
        return all_records






