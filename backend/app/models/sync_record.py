"""
同步记录模型
"""

from app import db
from datetime import datetime


class SyncRecord(db.Model):
    __tablename__ = "sync_records"

    id = db.Column(db.Integer, primary_key=True)
    sync_type = db.Column(
        db.String(20), nullable=False, comment="历史数据(historical)或今日数据(today)"
    )
    trigger_type = db.Column(
        db.String(20), nullable=False, comment="自动(auto)或手动(manual)"
    )

    # 状态相关
    status = db.Column(
        db.String(20), nullable=False, comment="running/success/failed/partial"
    )
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    duration = db.Column(db.Integer, comment="执行耗时（秒）")

    # 同步统计
    tasks_total = db.Column(db.Integer, default=0, comment="冠客返回的任务总数")
    tasks_new = db.Column(db.Integer, default=0, comment="新增任务数")
    tasks_updated = db.Column(db.Integer, default=0, comment="更新任务数")
    tasks_matched = db.Column(db.Integer, default=0, comment="自动匹配成功数")
    tasks_pending = db.Column(db.Integer, default=0, comment="待匹配数")
    tasks_failed = db.Column(db.Integer, default=0, comment="失败数")

    # 错误信息
    error_message = db.Column(db.Text, comment="主要错误信息")
    error_details = db.Column(db.JSON, comment="详细错误列表（任务级别）")

    # 重试相关
    retry_count = db.Column(db.Integer, default=0, comment="已重试次数")
    max_retries = db.Column(db.Integer, default=3, comment="最大重试次数")

    # 红点提示（全局，不关联用户）
    is_read = db.Column(db.Boolean, default=False, comment="是否已读")
    read_at = db.Column(db.DateTime, comment="阅读时间")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    def to_dict(self, include_details=False):
        data = {
            "id": self.id,
            "sync_type": self.sync_type,
            "sync_type_label": (
                "历史数据" if self.sync_type == "historical" else "今日数据"
            ),
            "trigger_type": self.trigger_type,
            "trigger_type_label": "自动" if self.trigger_type == "auto" else "手动",
            "status": self.status,
            "status_label": self._get_status_label(),
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "duration": self.duration,
            "tasks_total": self.tasks_total,
            "tasks_new": self.tasks_new,
            "tasks_updated": self.tasks_updated,
            "tasks_matched": self.tasks_matched,
            "tasks_pending": self.tasks_pending,
            "tasks_failed": self.tasks_failed,
            "retry_count": self.retry_count,
            "max_retries": self.max_retries,
            "is_read": self.is_read,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

        if include_details:
            data["error_message"] = self.error_message
            data["error_details"] = self.error_details

        return data

    def _get_status_label(self):
        labels = {
            "running": "进行中",
            "success": "成功",
            "failed": "失败",
            "partial": "部分成功",
        }
        return labels.get(self.status, self.status)


class SyncLock(db.Model):
    __tablename__ = "sync_locks"

    id = db.Column(db.Integer, primary_key=True)
    sync_type = db.Column(
        db.String(20), unique=True, nullable=False, comment="历史数据或今日数据"
    )
    locked_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    locked_by = db.Column(db.String(100), comment="进程ID或主机名")
    expires_at = db.Column(db.DateTime, nullable=False, comment="锁过期时间")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
