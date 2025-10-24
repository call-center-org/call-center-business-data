"""
数据处理服务
负责数据同步、计算、统计等业务逻辑
"""
from datetime import datetime, timedelta, date
from app import db
from app.models import CallRecord, DailyStat
from app.services.guanke_api import GuankeAPI


class DataProcessor:
    """数据处理器"""
    
    def __init__(self):
        self.guanke_api = GuankeAPI()
    
    def sync_from_guanke(self, days=1):
        """
        从冠客 API 同步数据
        
        参数：
            days: 同步最近 N 天的数据
        
        返回：
            同步结果统计
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        # 获取数据
        records = self.guanke_api.get_all_call_records(
            start_date.isoformat(),
            end_date.isoformat()
        )
        
        # 保存到数据库
        new_count = 0
        updated_count = 0
        
        for record_data in records:
            call_id = record_data.get('id')
            existing = CallRecord.query.filter_by(call_id=call_id).first()
            
            if existing:
                # 更新现有记录
                # TODO: 根据需要决定是否更新
                updated_count += 1
            else:
                # 创建新记录
                call_record = CallRecord.from_guanke_data(record_data)
                db.session.add(call_record)
                new_count += 1
        
        db.session.commit()
        
        # 更新每日统计
        self._update_daily_stats(start_date, end_date)
        
        return {
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'total_records': len(records),
            'new_count': new_count,
            'updated_count': updated_count,
            'synced_at': datetime.utcnow().isoformat()
        }
    
    def _update_daily_stats(self, start_date, end_date):
        """更新每日统计数据"""
        current_date = start_date
        
        while current_date <= end_date:
            # 获取当天的所有通话记录
            records = CallRecord.query.filter(
                db.func.date(CallRecord.start_time) == current_date
            ).all()
            
            if records:
                # 计算统计数据
                stat = DailyStat.calculate_from_records(current_date, records)
                
                # 检查是否已存在
                existing = DailyStat.query.filter_by(stat_date=current_date).first()
                if existing:
                    # 更新
                    existing.total_calls = stat.total_calls
                    existing.success_calls = stat.success_calls
                    existing.failed_calls = stat.failed_calls
                    existing.success_rate = stat.success_rate
                    existing.total_duration = stat.total_duration
                    existing.avg_duration = stat.avg_duration
                    existing.updated_at = datetime.utcnow()
                else:
                    # 新增
                    db.session.add(stat)
            
            current_date += timedelta(days=1)
        
        db.session.commit()
    
    def get_call_summary(self, days=3):
        """
        获取外呼数据概览
        
        参数：
            days: 统计最近 N 天
        
        返回：
            概览统计数据
        """
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        # 查询每日统计
        daily_stats = DailyStat.query.filter(
            DailyStat.stat_date >= start_date,
            DailyStat.stat_date <= end_date
        ).order_by(DailyStat.stat_date).all()
        
        if not daily_stats:
            return self._empty_summary(days)
        
        # 汇总
        total_calls = sum(s.total_calls for s in daily_stats)
        success_calls = sum(s.success_calls for s in daily_stats)
        failed_calls = sum(s.failed_calls for s in daily_stats)
        success_rate = success_calls / total_calls if total_calls > 0 else 0.0
        
        avg_per_day = total_calls / days if days > 0 else 0.0
        
        return {
            'days': days,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'total_calls': total_calls,
            'success_calls': success_calls,
            'failed_calls': failed_calls,
            'success_rate': round(success_rate, 4),
            'avg_per_day': round(avg_per_day, 2),
            'daily_breakdown': [s.to_dict() for s in daily_stats]
        }
    
    def get_daily_stats(self, start_date=None, end_date=None):
        """
        获取每日统计数据
        
        参数：
            start_date: 开始日期（YYYY-MM-DD）
            end_date: 结束日期（YYYY-MM-DD）
        """
        if not start_date:
            start_date = (date.today() - timedelta(days=7)).isoformat()
        if not end_date:
            end_date = date.today().isoformat()
        
        # 转换为日期对象
        start = datetime.fromisoformat(start_date).date()
        end = datetime.fromisoformat(end_date).date()
        
        # 查询
        stats = DailyStat.query.filter(
            DailyStat.stat_date >= start,
            DailyStat.stat_date <= end
        ).order_by(DailyStat.stat_date).all()
        
        return {
            'start_date': start_date,
            'end_date': end_date,
            'stats': [s.to_dict() for s in stats]
        }
    
    def _empty_summary(self, days):
        """返回空的概览数据"""
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        return {
            'days': days,
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'total_calls': 0,
            'success_calls': 0,
            'failed_calls': 0,
            'success_rate': 0.0,
            'avg_per_day': 0.0,
            'daily_breakdown': []
        }

































