"""
呼出数据路由
处理外呼数据的查询和同步
"""
from flask import Blueprint, jsonify, request
from app.core.auth import require_auth
from app.services.data_processor import DataProcessor
from datetime import datetime, timedelta

bp = Blueprint('calls', __name__, url_prefix='/api/calls')


@bp.route('/summary', methods=['GET'])
@require_auth
def get_summary():
    """
    获取外呼数据概览
    查询参数：
        - days: 统计天数，默认 3 天
    """
    try:
        days = int(request.args.get('days', 3))
        
        # 调用数据处理服务
        processor = DataProcessor()
        summary = processor.get_call_summary(days)
        
        return jsonify({
            'success': True,
            'data': summary
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/daily', methods=['GET'])
@require_auth
def get_daily_stats():
    """
    获取每日明细数据
    查询参数：
        - start_date: 开始日期（YYYY-MM-DD）
        - end_date: 结束日期（YYYY-MM-DD）
    """
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        processor = DataProcessor()
        daily_stats = processor.get_daily_stats(start_date, end_date)
        
        return jsonify({
            'success': True,
            'data': daily_stats
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@bp.route('/sync', methods=['POST'])
@require_auth
def sync_data():
    """
    手动触发数据同步
    从冠客 API 同步最新数据
    """
    try:
        days = int(request.json.get('days', 1))
        
        processor = DataProcessor()
        result = processor.sync_from_guanke(days)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

































