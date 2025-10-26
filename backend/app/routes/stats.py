"""
统计数据路由
提供各类数据统计接口
"""

from flask import Blueprint, jsonify, request
from app.core.auth import require_auth

bp = Blueprint("stats", __name__, url_prefix="/api/stats")


@bp.route("/overview", methods=["GET"])
@require_auth
def get_overview():
    """
    获取数据概览（昨日 + 本月）
    用于主 Dashboard 展示
    """
    try:
        # TODO: 实现完整的统计逻辑
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "yesterday": {
                            "total_calls": 0,
                            "success_calls": 0,
                            "success_rate": 0.0,
                        },
                        "month": {
                            "total_calls": 0,
                            "success_calls": 0,
                            "success_rate": 0.0,
                        },
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/trend", methods=["GET"])
@require_auth
def get_trend():
    """
    获取趋势数据
    查询参数：
        - start_date: 开始日期
        - end_date: 结束日期
    """
    try:
        # TODO: 实现趋势数据查询
        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "dates": [],
                        "total_calls": [],
                        "success_calls": [],
                        "success_rate": [],
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/grade-stats", methods=["GET"])
# @require_auth  # 暂时禁用认证，方便开发测试
def get_grade_stats():
    """
    获取按意向度分类的统计数据（话单维度）
    
    v2.0 双轨架构：
    - 今日数据：实时计算（每10分钟后台更新缓存）
    - 历史数据：从缓存读取（极快，<1秒）
    
    查询参数：
        - date: 日期（YYYY-MM-DD）
    返回：
        - grade_9: 9元成功单数量
        - grade_1: 1元成功单数量
        - total_success: 总成功单数量
        - from_cache: 是否来自缓存（true/false）
    """
    import time
    from datetime import datetime
    from flask import current_app
    from app.models.stats_cache import GradeStatsCache
    from app.services.stats_sync_service import StatsSyncService

    start_time = time.time()

    try:
        # 获取日期参数
        date_str = request.args.get("date")
        if not date_str:
            current_app.logger.error("❌ 缺少日期参数")
            return jsonify({"success": False, "error": "缺少日期参数"}), 400

        # 解析日期
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        today = datetime.now().date()
        
        current_app.logger.info(f"📊 获取 {date_str} 的意向度统计...")

        # 判断是今日还是历史数据
        if date == today:
            # 今日数据：先尝试从缓存读取，如果没有则实时计算
            current_app.logger.info(f"  🔄 今日数据，尝试从缓存读取...")
            cache = GradeStatsCache.query.filter_by(date=date).first()
            
            if cache:
                elapsed = time.time() - start_time
                current_app.logger.info(
                    f"  ✅ 从缓存读取成功！耗时: {elapsed:.2f}秒 | "
                    f"9元单: {cache.grade_9} | 1元单: {cache.grade_1}"
                )
                return (
                    jsonify(
                        {
                            "success": True,
                            "data": {
                                "date": date_str,
                                "grade_9": cache.grade_9,
                                "grade_1": cache.grade_1,
                                "total_success": cache.total_success,
                                "total_records": cache.total_records,
                                "calculated_at": cache.calculated_at.strftime('%Y-%m-%d %H:%M:%S'),
                                "from_cache": True,
                                "elapsed_time": round(elapsed, 2),
                            },
                        }
                    ),
                    200,
                )
            else:
                # 缓存不存在，触发同步
                current_app.logger.info(f"  🔄 缓存不存在，触发实时同步...")
                sync_service = StatsSyncService()
                success = sync_service.sync_grade_stats(date, date, 'today')
                
                if success:
                    cache = GradeStatsCache.query.filter_by(date=date).first()
                    if cache:
                        elapsed = time.time() - start_time
                        return (
                            jsonify(
                                {
                                    "success": True,
                                    "data": {
                                        "date": date_str,
                                        "grade_9": cache.grade_9,
                                        "grade_1": cache.grade_1,
                                        "total_success": cache.total_success,
                                        "total_records": cache.total_records,
                                        "calculated_at": cache.calculated_at.strftime('%Y-%m-%d %H:%M:%S'),
                                        "from_cache": False,
                                        "elapsed_time": round(elapsed, 2),
                                    },
                                }
                            ),
                            200,
                        )
                
                return jsonify({"success": False, "error": "同步失败"}), 500
                
        else:
            # 历史数据：必须从缓存读取
            current_app.logger.info(f"  📦 历史数据，从缓存读取...")
            cache = GradeStatsCache.query.filter_by(date=date).first()
            
            if cache:
                elapsed = time.time() - start_time
                current_app.logger.info(
                    f"  ✅ 从缓存读取成功！耗时: {elapsed:.2f}秒 | "
                    f"9元单: {cache.grade_9} | 1元单: {cache.grade_1}"
                )
                return (
                    jsonify(
                        {
                            "success": True,
                            "data": {
                                "date": date_str,
                                "grade_9": cache.grade_9,
                                "grade_1": cache.grade_1,
                                "total_success": cache.total_success,
                                "total_records": cache.total_records,
                                "calculated_at": cache.calculated_at.strftime('%Y-%m-%d %H:%M:%S'),
                                "from_cache": True,
                                "elapsed_time": round(elapsed, 2),
                            },
                        }
                    ),
                    200,
                )
            else:
                current_app.logger.warning(f"  ⚠️ 缓存不存在: {date_str}")
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": f"历史数据未同步，请等待后台同步完成（每天 01:05, 07:05, 10:05, 15:05, 21:05）"
                        }
                    ),
                    404,
                )

    except Exception as e:
        elapsed = time.time() - start_time
        current_app.logger.error(
            f"❌ 意向度统计失败: {str(e)} | 耗时: {elapsed:.2f}秒", exc_info=True
        )
        return jsonify({"success": False, "error": str(e)}), 500


@bp.route("/grade-stats/refresh", methods=["POST"])
# @require_auth  # 暂时禁用认证，方便开发测试
def refresh_grade_stats():
    """
    手动刷新意向度统计缓存
    
    请求体：
        - date: 日期（YYYY-MM-DD）
    返回：
        - success: 是否成功
        - message: 结果消息
    """
    from datetime import datetime
    from flask import current_app
    from app.services.stats_sync_service import StatsSyncService

    try:
        data = request.get_json() or {}
        date_str = data.get("date")
        
        if not date_str:
            return jsonify({"success": False, "error": "缺少日期参数"}), 400

        # 解析日期
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        
        current_app.logger.info(f"🔄 手动刷新 {date_str} 的意向度统计...")

        # 触发同步
        sync_service = StatsSyncService()
        success = sync_service.sync_grade_stats(date, date, 'manual')
        
        if success:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": f"{date_str} 的意向度统计已刷新"
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "刷新失败，请查看日志"
                    }
                ),
                500,
            )

    except Exception as e:
        current_app.logger.error(f"❌ 手动刷新失败: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500
