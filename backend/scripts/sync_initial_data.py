"""
首次数据同步脚本
用于初始化数据库，从冠客 API 同步历史数据
"""
import sys
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.services.data_processor import DataProcessor

def sync_initial_data(days=30):
    """
    同步初始数据
    
    参数：
        days: 同步最近 N 天的数据（默认 30 天）
    """
    app = create_app('development')
    
    with app.app_context():
        print("=" * 60)
        print(f"开始同步最近 {days} 天的数据...")
        print("=" * 60)
        
        try:
            processor = DataProcessor()
            result = processor.sync_from_guanke(days)
            
            print("\n✅ 数据同步成功！")
            print(f"   - 时间范围: {result['start_date']} 到 {result['end_date']}")
            print(f"   - 总记录数: {result['total_records']}")
            print(f"   - 新增记录: {result['new_count']}")
            print(f"   - 更新记录: {result['updated_count']}")
            print(f"   - 同步时间: {result['synced_at']}")
            
            print("\n" + "=" * 60)
            print("数据同步完成！可以启动前端进行测试。")
            print("=" * 60)
            
        except Exception as e:
            print(f"\n❌ 数据同步失败: {str(e)}")
            print("\n请检查：")
            print("1. 冠客 API 密钥是否正确（.env 文件中的 GUANKE_API_SECRET）")
            print("2. 网络是否能访问冠客 API")
            print("3. 查看详细错误信息")
            sys.exit(1)

if __name__ == '__main__':
    # 获取命令行参数
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 30
    sync_initial_data(days)






