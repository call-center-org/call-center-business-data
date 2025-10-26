"""
外呼数据系统后端启动文件
"""
import os
from app import create_app, db

# 获取环境变量，默认开发环境
config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

# 确保数据库表存在（自动创建缺失的表）
with app.app_context():
    # 显式导入模型以确保表结构被注册
    from app.models.stats_cache import TaskStatsCache, GradeStatsCache
    db.create_all()
    print("✅ 数据库表初始化完成")

# 初始化统计数据定时同步调度器
from app.tasks.stats_scheduler import init_stats_scheduler
init_stats_scheduler(app)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=(config_name == 'development')
    )

































