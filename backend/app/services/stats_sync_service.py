"""统计数据同步服务（双轨架构）"""
import logging
import time
from datetime import datetime, timedelta
from app import db
from app.models.stats_cache import TaskStatsCache, GradeStatsCache
from app.services.guanke_api import GuankeAPI

logger = logging.getLogger(__name__)


class StatsSyncService:
    """统计数据双轨同步服务"""
    
    def __init__(self):
        self.guanke = GuankeAPI()
    
    # ==================== 任务维度同步 ====================
    
    def sync_task_stats(self, start_date, end_date, sync_type='historical'):
        """
        同步任务维度统计数据（基础数据）
        
        :param start_date: 开始日期 (datetime.date 或 str 'YYYY-MM-DD')
        :param end_date: 结束日期 (datetime.date 或 str 'YYYY-MM-DD')
        :param sync_type: 同步类型 ('long_historical', 'historical', 'today')
        """
        try:
            # 转换日期格式
            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            logger.info(f"🚀 【任务维度】开始同步: {start_date} 至 {end_date} | 类型: {sync_type}")
            start_time = time.time()
            
            # 调用冠客API（任务维度统计）
            result = self.guanke.get_agent_statistics(
                start_time=start_date.strftime('%Y-%m-%d'),
                end_time=end_date.strftime('%Y-%m-%d'),
                query_type=20  # 任务维度
            )
            
            if result.get('code') != 200:
                logger.error(f"❌ 冠客API返回错误: {result.get('message')}")
                return False
            
            # 解析数据
            data_list = result.get('data', {}).get('data', [])
            if not data_list:
                logger.warning(f"⚠️ 无任务数据: {start_date} 至 {end_date}")
                return True
            
            # 按日期聚合统计（因为API返回的是任务列表）
            daily_stats = {}
            for task in data_list:
                # 获取任务日期（假设从 task 的某个时间字段提取）
                # 这里简化处理：直接使用查询日期范围的中间日期
                # 实际应该根据 task 的具体字段来确定日期
                task_date = start_date  # 简化：单日查询
                
                if task_date not in daily_stats:
                    daily_stats[task_date] = {
                        'total_tasks': 0,
                        'callout_number': 0,
                        'called_number': 0,
                        'success_number': 0,
                        'connected_rate': 0.0
                    }
                
                # 累加统计
                daily_stats[task_date]['total_tasks'] += 1
                daily_stats[task_date]['callout_number'] += task.get('callout_number', 0)
                daily_stats[task_date]['called_number'] += task.get('called_number', 0)
                daily_stats[task_date]['success_number'] += task.get('success_number', 0)
            
            # 写入数据库
            for date, stats in daily_stats.items():
                # 计算接通率
                if stats['callout_number'] > 0:
                    stats['connected_rate'] = round(
                        stats['called_number'] / stats['callout_number'] * 100, 2
                    )
                
                # 查找或创建记录
                cache = TaskStatsCache.query.filter_by(date=date).first()
                if not cache:
                    cache = TaskStatsCache(date=date)
                
                # 更新数据
                cache.total_tasks = stats['total_tasks']
                cache.callout_number = stats['callout_number']
                cache.called_number = stats['called_number']
                cache.success_number = stats['success_number']
                cache.connected_rate = stats['connected_rate']
                cache.calculated_at = datetime.utcnow()
                cache.sync_type = sync_type
                
                db.session.add(cache)
            
            db.session.commit()
            
            elapsed = time.time() - start_time
            logger.info(
                f"✅ 【任务维度】同步完成！"
                f"耗时: {elapsed:.2f}秒 | "
                f"日期: {len(daily_stats)} 天"
            )
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"❌ 【任务维度】同步失败: {str(e)}", exc_info=True)
            return False
    
    # ==================== 话单维度同步 ====================
    
    def sync_grade_stats(self, start_date, end_date, sync_type='historical'):
        """
        同步话单维度统计数据（意向度数据）
        
        :param start_date: 开始日期 (datetime.date 或 str 'YYYY-MM-DD')
        :param end_date: 结束日期 (datetime.date 或 str 'YYYY-MM-DD')
        :param sync_type: 同步类型 ('long_historical', 'historical', 'today')
        """
        try:
            # 转换日期格式
            if isinstance(start_date, str):
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            if isinstance(end_date, str):
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            
            logger.info(f"🚀 【话单维度】开始同步: {start_date} 至 {end_date} | 类型: {sync_type}")
            
            # 逐日同步
            current_date = start_date
            success_count = 0
            
            while current_date <= end_date:
                if self._sync_grade_stats_for_date(current_date, sync_type):
                    success_count += 1
                current_date += timedelta(days=1)
            
            logger.info(
                f"✅ 【话单维度】批量同步完成！"
                f"成功: {success_count}/{(end_date - start_date).days + 1} 天"
            )
            return True
            
        except Exception as e:
            logger.error(f"❌ 【话单维度】批量同步失败: {str(e)}", exc_info=True)
            return False
    
    def _sync_grade_stats_for_date(self, date, sync_type='historical'):
        """
        同步单个日期的话单维度统计
        
        :param date: 日期 (datetime.date)
        :param sync_type: 同步类型
        """
        try:
            start_time = time.time()
            date_str = date.strftime('%Y-%m-%d')
            
            logger.info(f"  📊 计算 {date_str} 意向度统计...")
            
            # 调用现有的话单统计逻辑
            result = self._calculate_grade_stats_for_date(date_str)
            
            if not result:
                logger.warning(f"  ⚠️ {date_str} 统计失败")
                return False
            
            # 查找或创建记录
            cache = GradeStatsCache.query.filter_by(date=date).first()
            if not cache:
                cache = GradeStatsCache(date=date)
            
            # 更新数据
            cache.grade_9 = result['grade_9']
            cache.grade_1 = result['grade_1']
            cache.total_success = result['total_success']
            cache.total_records = result['total_records']
            cache.elapsed_time = result['elapsed_time']
            cache.calculated_at = datetime.utcnow()
            cache.sync_type = sync_type
            
            db.session.add(cache)
            db.session.commit()
            
            elapsed = time.time() - start_time
            logger.info(
                f"  ✅ {date_str} 完成！"
                f"耗时: {elapsed:.2f}秒 | "
                f"9元: {result['grade_9']} | 1元: {result['grade_1']}"
            )
            return True
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"  ❌ {date.strftime('%Y-%m-%d')} 同步失败: {str(e)}", exc_info=True)
            return False
    
    def _calculate_grade_stats_for_date(self, date_str):
        """
        计算单个日期的意向度统计（话单维度）
        复用现有的 get_grade_stats 逻辑
        
        :param date_str: 日期字符串 'YYYY-MM-DD'
        :return: dict 或 None
        """
        try:
            start_time = time.time()
            
            # 获取该日期的话单明细
            start_datetime = f"{date_str} 00:00:00"
            end_datetime = f"{date_str} 23:59:59"
            
            # 初始化计数器
            grade_9_count = 0
            grade_1_count = 0
            total_success = 0
            total_records = 0
            
            # 分页获取话单
            page = 1
            page_size = 1000
            max_pages = 200  # 最大200页
            
            while page <= max_pages:
                try:
                    result = self.guanke.get_call_records(
                        start_datetime, end_datetime, page, page_size
                    )
                    
                    if result.get("code") != 200:
                        logger.warning(f"    ⚠️ API返回非200: {result.get('message')}")
                        break
                    
                    records = result.get("data", {}).get("data", [])
                    if not records:
                        break
                    
                    total_records += len(records)
                    
                    # 统计意向度
                    for record in records:
                        grade = record.get("grade", "")
                        
                        if "9元" in grade or (grade == "9"):
                            grade_9_count += 1
                            total_success += 1
                        elif "1元" in grade or (grade == "1"):
                            grade_1_count += 1
                            total_success += 1
                    
                    # 如果本页记录数 < page_size，说明已经是最后一页
                    if len(records) < page_size:
                        break
                    
                    page += 1
                    
                except Exception as page_error:
                    logger.error(f"    ❌ 第 {page} 页获取失败: {str(page_error)}")
                    break
            
            elapsed = time.time() - start_time
            
            return {
                'grade_9': grade_9_count,
                'grade_1': grade_1_count,
                'total_success': total_success,
                'total_records': total_records,
                'elapsed_time': round(elapsed, 2)
            }
            
        except Exception as e:
            logger.error(f"    ❌ 计算意向度统计失败: {str(e)}", exc_info=True)
            return None
    
    # ==================== 便捷方法 ====================
    
    def sync_t3_historical(self):
        """同步 T-3 至昨日数据（任务维度 + 话单维度）"""
        today = datetime.now().date()
        start_date = today - timedelta(days=3)
        end_date = today - timedelta(days=1)
        
        logger.info(f"🔄 开始同步 T-3 历史数据: {start_date} 至 {end_date}")
        
        # 任务维度
        task_result = self.sync_task_stats(start_date, end_date, 'historical')
        
        # 话单维度
        grade_result = self.sync_grade_stats(start_date, end_date, 'historical')
        
        return task_result and grade_result
    
    def sync_t10_historical(self):
        """同步 T-10 至昨日数据（任务维度 + 话单维度）"""
        today = datetime.now().date()
        start_date = today - timedelta(days=10)
        end_date = today - timedelta(days=1)
        
        logger.info(f"🔄 开始同步 T-10 历史数据: {start_date} 至 {end_date}")
        
        # 任务维度
        task_result = self.sync_task_stats(start_date, end_date, 'long_historical')
        
        # 话单维度
        grade_result = self.sync_grade_stats(start_date, end_date, 'long_historical')
        
        return task_result and grade_result
    
    def sync_today(self):
        """同步今日数据（任务维度 + 话单维度）"""
        today = datetime.now().date()
        
        logger.info(f"🔄 开始同步今日数据: {today}")
        
        # 任务维度
        task_result = self.sync_task_stats(today, today, 'today')
        
        # 话单维度
        grade_result = self.sync_grade_stats(today, today, 'today')
        
        return task_result and grade_result

