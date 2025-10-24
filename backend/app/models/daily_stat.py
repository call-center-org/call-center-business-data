"""
每日统计模型
用于加速查询，避免每次实时计算
"""
from datetime import datetime, date
from app import db


class DailyStat(db.Model):
    """每日统计表"""
    __tablename__ = 'daily_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # 统计日期
    stat_date = db.Column(db.Date, unique=True, nullable=False, index=True)
    
    # 呼出统计
    total_calls = db.Column(db.Integer, default=0)
    success_calls = db.Column(db.Integer, default=0)
    failed_calls = db.Column(db.Integer, default=0)
    
    # 比率
    success_rate = db.Column(db.Float, default=0.0)
    
    # 通话时长
    total_duration = db.Column(db.Integer, default=0)  # 总时长（秒）
    avg_duration = db.Column(db.Float, default=0.0)    # 平均时长（秒）
    
    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<DailyStat {self.stat_date}>'
    
    def to_dict(self):
        """转换为字典"""
        return {
            'stat_date': self.stat_date.isoformat(),
            'total_calls': self.total_calls,
            'success_calls': self.success_calls,
            'failed_calls': self.failed_calls,
            'success_rate': round(self.success_rate, 4),
            'avg_duration': round(self.avg_duration, 2),
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def calculate_from_records(stat_date, records):
        """
        从通话记录计算每日统计
        """
        total_calls = len(records)
        success_calls = sum(1 for r in records if r.is_success)
        failed_calls = total_calls - success_calls
        success_rate = success_calls / total_calls if total_calls > 0 else 0.0
        
        total_duration = sum(r.duration for r in records if r.duration)
        avg_duration = total_duration / total_calls if total_calls > 0 else 0.0
        
        return DailyStat(
            stat_date=stat_date,
            total_calls=total_calls,
            success_calls=success_calls,
            failed_calls=failed_calls,
            success_rate=success_rate,
            total_duration=total_duration,
            avg_duration=avg_duration,
            updated_at=datetime.utcnow()
        )

































