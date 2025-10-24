"""
健康检查路由
用于监控和部署验证
"""
from flask import Blueprint, jsonify
from datetime import datetime

bp = Blueprint('health', __name__)


@bp.route('/api/health', methods=['GET'])
def health_check():
    """
    健康检查接口
    无需认证，用于监控和负载均衡器
    """
    return jsonify({
        'status': 'healthy',
        'service': 'call-center-business-data',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0'
    }), 200


@bp.route('/', methods=['GET'])
def index():
    """根路径"""
    return jsonify({
        'message': 'Call Center Business Data API',
        'version': '2.0.0',
        'docs': '/api/health'
    }), 200

































