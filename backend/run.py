"""
外呼数据系统后端启动文件
"""
import os
from app import create_app

# 获取环境变量，默认开发环境
config_name = os.getenv('FLASK_ENV', 'development')
app = create_app(config_name)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=(config_name == 'development')
    )

































