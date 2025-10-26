"""
健康检查路由
用于监控和部署验证
"""

from flask import Blueprint, jsonify
from datetime import datetime

bp = Blueprint("health", __name__)


@bp.route("/api/health", methods=["GET"])
def health_check():
    """
    健康检查接口
    无需认证，用于监控和负载均衡器
    """
    return (
        jsonify(
            {
                "status": "healthy",
                "service": "call-center-business-data",
                "timestamp": datetime.utcnow().isoformat(),
                "version": "2.0.0",
            }
        ),
        200,
    )


@bp.route("/", methods=["GET"])
def index():
    """根路径"""
    return (
        jsonify(
            {
                "message": "Call Center Business Data API",
                "version": "2.0.0",
                "docs": "/api/health",
            }
        ),
        200,
    )


@bp.route("/api/db/migrate", methods=["POST"])
def migrate_database():
    """
    数据库迁移接口
    用于手动创建缺失的数据库表
    """
    try:
        from app import db
        from app.models.stats_cache import TaskStatsCache, GradeStatsCache

        # 获取当前表列表
        inspector = db.inspect(db.engine)
        tables_before = set(inspector.get_table_names())

        # 创建所有表
        db.create_all()

        # 获取更新后的表列表
        inspector = db.inspect(db.engine)
        tables_after = set(inspector.get_table_names())

        # 计算新增的表
        new_tables = tables_after - tables_before

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "数据库迁移完成",
                    "tables_before": list(tables_before),
                    "tables_after": list(tables_after),
                    "new_tables": list(new_tables),
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
