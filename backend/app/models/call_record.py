"""
通话记录模型
存储从冠客 API 同步的原始通话数据
"""
from datetime import datetime
from app import db


class CallRecord(db.Model):
    """通话记录表"""
    __tablename__ = 'call_records'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # 第三方数据
    call_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    task_id = db.Column(db.String(100), index=True)
    task_name = db.Column(db.String(200))
    agent_id = db.Column(db.String(100), index=True)
    agent_name = db.Column(db.String(100))
    
    # 通话信息
    phone = db.Column(db.String(20))
    start_time = db.Column(db.DateTime, index=True)
    end_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer, default=0)  # 通话时长（秒）
    hangup_reason = db.Column(db.String(50))
    
    # 业务标识
    is_success = db.Column(db.Boolean, default=False, index=True)
    
    # 时间戳
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    synced_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<CallRecord {self.call_id}>'
    
    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'call_id': self.call_id,
            'task_id': self.task_id,
            'task_name': self.task_name,
            'agent_id': self.agent_id,
            'agent_name': self.agent_name,
            'phone': self.phone,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'duration': self.duration,
            'hangup_reason': self.hangup_reason,
            'is_success': self.is_success,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @staticmethod
    def from_guanke_data(data):
        """
        从冠客 API 数据创建记录
        判断标准：hangupReason === 'NORMAL_CLEARING' && duration > 0
        """
        is_success = (
            data.get('hangupReason') == 'NORMAL_CLEARING' and
            (data.get('duration', 0) or 0) > 0
        )
        
        return CallRecord(
            call_id=data.get('id'),
            task_id=data.get('taskId'),
            task_name=data.get('taskName'),
            agent_id=data.get('agentId'),
            agent_name=data.get('agentName'),
            phone=data.get('phone'),
            start_time=datetime.fromisoformat(data.get('startTime').replace('Z', '+00:00')) if data.get('startTime') else None,
            end_time=datetime.fromisoformat(data.get('endTime').replace('Z', '+00:00')) if data.get('endTime') else None,
            duration=data.get('duration', 0),
            hangup_reason=data.get('hangupReason'),
            is_success=is_success,
            synced_at=datetime.utcnow()
        )

































