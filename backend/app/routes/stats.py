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

    ⚠️ 经测试验证：任务维度统计接口无法提供意向度标签（9元、1元）的详细统计
    - intention_number = called_number (接通数)
    - intention_number2 = 0 (无数据)
    必须使用话单接口逐条统计 grade 字段

    查询参数：
        - date: 日期（YYYY-MM-DD）
    返回：
        - grade_9: 9元成功单数量
        - grade_1: 1元成功单数量
        - total_success: 总成功单数量
    """
    import time
    from flask import current_app

    start_time = time.time()

    try:
        from app.services.guanke_api import GuankeAPI

        # 获取日期参数
        date = request.args.get("date")
        if not date:
            current_app.logger.error("❌ 缺少日期参数")
            return jsonify({"success": False, "error": "缺少日期参数"}), 400

        current_app.logger.info(f"📊 开始获取 {date} 的意向度统计...")

        # 初始化冠客API客户端
        guanke = GuankeAPI()

        # 获取该日期的话单明细
        start_datetime = f"{date} 00:00:00"
        end_datetime = f"{date} 23:59:59"

        # 初始化计数器
        grade_9_count = 0
        grade_1_count = 0
        total_success = 0
        total_records = 0

        # 分页获取话单
        page = 1
        page_size = 1000
        max_pages = 200  # ⚠️ 增加到 200 页（20万条），确保数据完整性

        current_app.logger.info(f"🔍 开始分页获取话单数据...")

        while page <= max_pages:
            page_start = time.time()

            try:
                result = guanke.get_call_records(
                    start_datetime, end_datetime, page, page_size
                )

                page_elapsed = time.time() - page_start
                current_app.logger.info(f"  第 {page} 页请求耗时: {page_elapsed:.2f}秒")

                if result.get("code") != 200:
                    error_msg = result.get("message", "未知错误")
                    current_app.logger.warning(f"⚠️ API返回非200: {error_msg}")
                    break

                records = result.get("data", {}).get("data", [])
                if not records:
                    current_app.logger.info(f"✅ 第 {page} 页无数据，分页结束")
                    break

                total_records += len(records)
                current_app.logger.info(
                    f"  第 {page} 页: 获取到 {len(records)} 条记录（累计: {total_records}）"
                )

                # 统计意向度
                for record in records:
                    grade = record.get("grade", "")

                    # 判断是否为成功单（根据意向度包含"9元"或"1元"）
                    if "9元" in grade or (grade == "9"):
                        grade_9_count += 1
                        total_success += 1
                    elif "1元" in grade or (grade == "1"):
                        grade_1_count += 1
                        total_success += 1

                # 如果本页记录数 < page_size，说明已经是最后一页
                if len(records) < page_size:
                    current_app.logger.info(
                        f"✅ 第 {page} 页记录数 < {page_size}，分页结束"
                    )
                    break

                page += 1

            except Exception as page_error:
                current_app.logger.error(f"❌ 第 {page} 页获取失败: {str(page_error)}")
                break

        elapsed = time.time() - start_time
        current_app.logger.info(
            f"✅ 意向度统计完成！耗时: {elapsed:.2f}秒 | "
            f"总记录: {total_records} | 9元单: {grade_9_count} | 1元单: {grade_1_count}"
        )

        return (
            jsonify(
                {
                    "success": True,
                    "data": {
                        "date": date,
                        "grade_9": grade_9_count,
                        "grade_1": grade_1_count,
                        "total_success": total_success,
                        "total_records": total_records,
                        "elapsed_time": round(elapsed, 2),
                    },
                }
            ),
            200,
        )

    except Exception as e:
        elapsed = time.time() - start_time
        current_app.logger.error(
            f"❌ 意向度统计失败: {str(e)} | 耗时: {elapsed:.2f}秒", exc_info=True
        )
        return jsonify({"success": False, "error": str(e)}), 500
