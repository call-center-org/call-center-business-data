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
    获取按意向度分类的统计数据
    查询参数：
        - date: 日期（YYYY-MM-DD）
    返回：
        - grade_9: 9元成功单数量
        - grade_1: 1元成功单数量
        - total_success: 总成功单数量
    """
    try:
        from app.services.guanke_api import GuankeAPI

        # 获取日期参数
        date = request.args.get("date")
        if not date:
            return jsonify({"success": False, "error": "缺少日期参数"}), 400

        # 初始化冠客API客户端
        guanke = GuankeAPI()

        # 获取该日期的话单明细
        start_datetime = f"{date} 00:00:00"
        end_datetime = f"{date} 23:59:59"

        # 初始化计数器
        grade_9_count = 0
        grade_1_count = 0
        total_success = 0

        # 分页获取所有话单
        page = 1
        page_size = 1000

        while True:
            result = guanke.get_call_records(
                start_datetime, end_datetime, page, page_size
            )

            if result.get("code") != 200:
                break

            records = result.get("data", {}).get("data", [])
            if not records:
                break

            # 统计意向度
            for record in records:
                grade = record.get("grade", "")

                # 判断是否为成功单（根据意向度包含"9元"或"1元"）
                if "9元" in grade or "9" in grade:
                    grade_9_count += 1
                    total_success += 1
                elif "1元" in grade or grade == "1":
                    grade_1_count += 1
                    total_success += 1

            # 检查是否还有下一页
            if len(records) < page_size:
                break

            page += 1

        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "date": date,
                        "grade_9": grade_9_count,
                        "grade_1": grade_1_count,
                        "total_success": total_success,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
