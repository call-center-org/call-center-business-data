"""
JWT 认证模块
与组织统一标准保持一致
"""
import jwt
from flask import request, jsonify
from functools import wraps
from datetime import datetime
from app.config import Config


def require_auth(f):
    """
    装饰器：要求 JWT Token 认证
    与组织统一标准一致
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 获取 Token
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.replace('Bearer ', '')
        
        try:
            # 验证 Token
            payload = jwt.decode(
                token,
                Config.JWT_SECRET_KEY,
                algorithms=[Config.JWT_ALGORITHM]
            )
            
            # 将用户信息添加到请求上下文
            request.current_user = payload
            
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    
    return decorated_function


def generate_token(user_id, username, role='user'):
    """
    生成 JWT Token
    （实际上 Token 由 ERP 系统生成，这里仅供测试使用）
    """
    from datetime import timedelta
    
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'exp': datetime.utcnow() + timedelta(hours=Config.JWT_EXPIRE_HOURS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm=Config.JWT_ALGORITHM)
    return token

































