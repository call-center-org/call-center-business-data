"""统计数据定时同步调度器"""
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from app.services.stats_sync_service import StatsSyncService

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()


def init_stats_scheduler(app):
    """
    初始化统计数据定时同步任务
    
    双轨同步架构：
    1. 任务维度（基础数据）
       - T-10至昨日：每天 07:00
       - T-3至昨日：每天 01:00, 10:00, 15:00, 21:00
       - 今日数据：每小时（09:00-23:00）
    
    2. 话单维度（意向度数据）
       - T-10至昨日：每天 07:05
       - T-3至昨日：每天 01:05, 10:05, 15:05, 21:05
       - 今日数据：每10分钟（09:00-23:50）
    """
    
    with app.app_context():
        logger.info("=" * 60)
        logger.info("🚀 初始化统计数据定时同步调度器...")
        
        sync_service = StatsSyncService()
        
        # ==================== 任务维度同步任务 ====================
        
        # 1. T-10至昨日（每天 07:00）
        def sync_task_stats_t10():
            with app.app_context():
                logger.info("⏰ 触发【任务维度】T-10至昨日同步...")
                sync_service.sync_t10_historical()
        
        scheduler.add_job(
            func=sync_task_stats_t10,
            trigger=CronTrigger(hour=7, minute=0),
            id="sync_task_stats_t10",
            name="【任务维度】T-10至昨日",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【任务维度】T-10至昨日 [07:00]")
        
        # 2. T-3至昨日（每天 01:00, 10:00, 15:00, 21:00）
        def sync_task_stats_t3():
            with app.app_context():
                logger.info("⏰ 触发【任务维度】T-3至昨日同步...")
                sync_service.sync_t3_historical()
        
        scheduler.add_job(
            func=sync_task_stats_t3,
            trigger=CronTrigger(hour="1,10,15,21", minute=0),
            id="sync_task_stats_t3",
            name="【任务维度】T-3至昨日",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【任务维度】T-3至昨日 [01:00, 10:00, 15:00, 21:00]")
        
        # 3. 今日数据（每小时 09:00-23:00）
        def sync_task_stats_today():
            with app.app_context():
                logger.info("⏰ 触发【任务维度】今日数据同步...")
                from datetime import datetime
                # 只在 09:00-23:00 执行
                hour = datetime.now().hour
                if 9 <= hour <= 23:
                    sync_service.sync_today()
                else:
                    logger.info("  ⏸️ 当前时间不在执行范围内（09:00-23:00）")
        
        scheduler.add_job(
            func=sync_task_stats_today,
            trigger=CronTrigger(hour="9-23", minute=0),
            id="sync_task_stats_today",
            name="【任务维度】今日数据",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【任务维度】今日数据 [每小时 09:00-23:00]")
        
        # ==================== 话单维度同步任务 ====================
        
        # 1. T-10至昨日（每天 07:05，错开5分钟）
        def sync_grade_stats_t10():
            with app.app_context():
                logger.info("⏰ 触发【话单维度】T-10至昨日同步...")
                sync_service.sync_t10_historical()
        
        scheduler.add_job(
            func=sync_grade_stats_t10,
            trigger=CronTrigger(hour=7, minute=5),
            id="sync_grade_stats_t10",
            name="【话单维度】T-10至昨日",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【话单维度】T-10至昨日 [07:05]")
        
        # 2. T-3至昨日（每天 01:05, 10:05, 15:05, 21:05）
        def sync_grade_stats_t3():
            with app.app_context():
                logger.info("⏰ 触发【话单维度】T-3至昨日同步...")
                sync_service.sync_t3_historical()
        
        scheduler.add_job(
            func=sync_grade_stats_t3,
            trigger=CronTrigger(hour="1,10,15,21", minute=5),
            id="sync_grade_stats_t3",
            name="【话单维度】T-3至昨日",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【话单维度】T-3至昨日 [01:05, 10:05, 15:05, 21:05]")
        
        # 3. 今日数据（每10分钟 09:00-23:50）
        def sync_grade_stats_today():
            with app.app_context():
                logger.info("⏰ 触发【话单维度】今日数据同步...")
                from datetime import datetime
                # 只在 09:00-23:50 执行
                hour = datetime.now().hour
                if 9 <= hour <= 23:
                    sync_service.sync_today()
                else:
                    logger.info("  ⏸️ 当前时间不在执行范围内（09:00-23:50）")
        
        scheduler.add_job(
            func=sync_grade_stats_today,
            trigger=CronTrigger(hour="9-23", minute="*/10"),
            id="sync_grade_stats_today",
            name="【话单维度】今日数据",
            replace_existing=True,
            max_instances=1
        )
        logger.info("📅 已注册: 【话单维度】今日数据 [每10分钟 09:00-23:50]")
        
        # ==================== 启动调度器 ====================
        
        try:
            scheduler.start()
            logger.info("✅ 统计数据定时同步调度器已启动！")
            logger.info("=" * 60)
            
            # 打印所有已注册的任务
            logger.info("📋 已注册的定时任务:")
            for job in scheduler.get_jobs():
                logger.info(f"  - {job.name} (ID: {job.id})")
                logger.info(f"    下次执行: {job.next_run_time}")
            
        except Exception as e:
            logger.error(f"❌ 调度器启动失败: {str(e)}", exc_info=True)
    
    return scheduler


def shutdown_stats_scheduler():
    """关闭调度器"""
    try:
        if scheduler.running:
            scheduler.shutdown()
            logger.info("🛑 统计数据定时同步调度器已关闭")
    except Exception as e:
        logger.error(f"❌ 调度器关闭失败: {str(e)}")

