"""
数据库模型导入
"""

from app.models.call_record import CallRecord
from app.models.daily_stat import DailyStat
from app.models.sync_record import SyncRecord, SyncLock

__all__ = ["CallRecord", "DailyStat", "SyncRecord", "SyncLock"]
