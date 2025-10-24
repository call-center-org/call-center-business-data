"""
生成测试 Token
用于开发环境测试 API
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.auth import generate_token

def main():
    """生成测试 Token"""
    print("=" * 60)
    print("生成测试 JWT Token")
    print("=" * 60)
    
    # 生成 Token
    token = generate_token(
        user_id=1,
        username='test_user',
        role='admin'
    )
    
    print("\n✅ Token 生成成功！\n")
    print("📋 Token 信息：")
    print(f"   - 用户ID: 1")
    print(f"   - 用户名: test_user")
    print(f"   - 角色: admin")
    print(f"   - 有效期: 24 小时")
    
    print("\n🔑 Token：")
    print(f"{token}\n")
    
    print("📝 使用方法：")
    print("在 API 请求头中添加：")
    print(f'Authorization: Bearer {token}\n')
    
    print("💡 测试示例：")
    print(f'curl -H "Authorization: Bearer {token}" \\')
    print('  http://localhost:5001/api/calls/summary?days=3')
    print("\n" + "=" * 60)

if __name__ == '__main__':
    main()

































