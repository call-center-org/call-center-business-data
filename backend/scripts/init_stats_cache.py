"""
初始化统计缓存表

用途：
1. 创建 task_stats_cache 表（任务维度统计缓存）
2. 创建 grade_stats_cache 表（话单维度统计缓存）

使用方法：
cd backend
source venv/bin/activate
python scripts/init_stats_cache.py
"""

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.stats_cache import TaskStatsCache, GradeStatsCache

def init_stats_cache_tables():
    """初始化统计缓存表"""
    print("=" * 60)
    print("🚀 开始初始化统计缓存表...")
    print("=" * 60)
    
    # 创建应用上下文
    app = create_app('development')
    
    with app.app_context():
        try:
            # 检查表是否已存在
            inspector = db.inspect(db.engine)
            existing_tables = inspector.get_table_names()
            
            print(f"\n📋 当前数据库中的表: {existing_tables}")
            
            # 创建统计缓存表
            print("\n🔨 创建统计缓存表...")
            db.create_all()
            
            # 再次检查表
            inspector = db.inspect(db.engine)
            updated_tables = inspector.get_table_names()
            
            print(f"\n✅ 更新后的表: {updated_tables}")
            
            # 显示新增的表
            new_tables = set(updated_tables) - set(existing_tables)
            if new_tables:
                print(f"\n🎉 成功创建新表: {new_tables}")
            else:
                print("\n✅ 统计缓存表已存在，无需重复创建")
            
            # 显示表结构
            print("\n" + "=" * 60)
            print("📊 表结构信息:")
            print("=" * 60)
            
            if 'task_stats_cache' in updated_tables:
                print("\n✅ task_stats_cache (任务维度统计缓存)")
                print("   - id: 主键")
                print("   - date: 统计日期（唯一索引）")
                print("   - total_tasks: 任务总数")
                print("   - callout_number: 外呼数")
                print("   - called_number: 接通数")
                print("   - success_number: 成功单数")
                print("   - connected_rate: 接通率")
                print("   - calculated_at: 计算时间")
                print("   - sync_type: 同步类型")
            
            if 'grade_stats_cache' in updated_tables:
                print("\n✅ grade_stats_cache (话单维度统计缓存)")
                print("   - id: 主键")
                print("   - date: 统计日期（唯一索引）")
                print("   - grade_9: 9元单数量")
                print("   - grade_1: 1元单数量")
                print("   - total_success: 总成功单数")
                print("   - total_records: 总话单数")
                print("   - calculated_at: 计算时间")
                print("   - elapsed_time: 计算耗时")
                print("   - sync_type: 同步类型")
            
            print("\n" + "=" * 60)
            print("✅ 统计缓存表初始化完成！")
            print("=" * 60)
            
            print("\n📝 下一步：")
            print("1. 启动后端服务: python run.py")
            print("2. 定时任务会自动开始同步数据")
            print("3. 手动触发同步: POST /api/stats/grade-stats/refresh")
            
        except Exception as e:
            print(f"\n❌ 初始化失败: {str(e)}")
            import traceback
            traceback.print_exc()
            sys.exit(1)


if __name__ == '__main__':
    init_stats_cache_tables()

