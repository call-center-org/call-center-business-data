"""统计数据缓存表"""
from app import db
from datetime import datetime


class TaskStatsCache(db.Model):
    """任务维度统计缓存（基础数据）"""
    __tablename__ = 'task_stats_cache'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False, index=True, comment='统计日期')
    
    # 基础统计
    total_tasks = db.Column(db.Integer, default=0, comment='任务总数')
    callout_number = db.Column(db.Integer, default=0, comment='外呼数')
    called_number = db.Column(db.Integer, default=0, comment='接通数')
    success_number = db.Column(db.Integer, default=0, comment='成功单数')
    connected_rate = db.Column(db.Float, default=0.0, comment='接通率')
    
    # 元数据
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow, comment='计算时间')
    sync_type = db.Column(db.String(20), comment='同步类型: historical/today/long_historical')
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'date': self.date.strftime('%Y-%m-%d') if self.date else None,
            'total_tasks': self.total_tasks,
            'callout_number': self.callout_number,
            'called_number': self.called_number,
            'success_number': self.success_number,
            'connected_rate': self.connected_rate,
            'calculated_at': self.calculated_at.strftime('%Y-%m-%d %H:%M:%S') if self.calculated_at else None,
            'sync_type': self.sync_type
        }
    
    def __repr__(self):
        return f'<TaskStatsCache {self.date}: 成功单={self.success_number}>'


class GradeStatsCache(db.Model):
    """话单维度统计缓存（意向度数据）"""
    __tablename__ = 'grade_stats_cache'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False, index=True, comment='统计日期')
    
    # 意向度统计
    grade_9 = db.Column(db.Integer, default=0, comment='9元单数量')
    grade_1 = db.Column(db.Integer, default=0, comment='1元单数量')
    total_success = db.Column(db.Integer, default=0, comment='总成功单数（9元+1元）')
    total_records = db.Column(db.Integer, default=0, comment='总话单数')
    
    # 元数据
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow, comment='计算时间')
    elapsed_time = db.Column(db.Float, comment='计算耗时（秒）')
    sync_type = db.Column(db.String(20), comment='同步类型: historical/today/long_historical')
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'date': self.date.strftime('%Y-%m-%d') if self.date else None,
            'grade_9': self.grade_9,
            'grade_1': self.grade_1,
            'total_success': self.total_success,
            'total_records': self.total_records,
            'calculated_at': self.calculated_at.strftime('%Y-%m-%d %H:%M:%S') if self.calculated_at else None,
            'elapsed_time': self.elapsed_time,
            'sync_type': self.sync_type
        }
    
    def __repr__(self):
        return f'<GradeStatsCache {self.date}: 9元={self.grade_9}, 1元={self.grade_1}>'

