"""
数据库初始化脚本
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import CallRecord, DailyStat

def init_database():
    """初始化数据库"""
    app = create_app('development')
    
    with app.app_context():
        # 创建所有表
        print("正在创建数据库表...")
        db.create_all()
        print("✅ 数据库表创建成功！")
        
        # 显示创建的表
        print("\n已创建的表：")
        print("- call_records (通话记录)")
        print("- daily_stats (每日统计)")
        
        print("\n数据库初始化完成！")

if __name__ == '__main__':
    init_database()

































