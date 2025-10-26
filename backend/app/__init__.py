"""
外呼数据系统后端
Flask 应用初始化
"""

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# 初始化扩展
db = SQLAlchemy()
migrate = Migrate()


def create_app(config_name="development"):
    """应用工厂函数"""
    app = Flask(__name__)

    # 加载配置
    if config_name == "development":
        app.config.from_object("app.config.DevelopmentConfig")
    elif config_name == "production":
        app.config.from_object("app.config.ProductionConfig")
    else:
        app.config.from_object("app.config.Config")

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)

    # 配置 CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3001",
                    "http://127.0.0.1:3001",
                    "http://localhost:8080",
                    "https://cloud1-6gt5ulxm10210d0f.ap-shanghai.app.tcloudbase.com",
                    "https://call-center-business-data.zeabur.app",
                ],
                "allow_headers": ["Authorization", "Content-Type"],
                "methods": ["GET", "POST", "PUT", "DELETE"],
            }
        },
    )

    # 注册蓝图
    from app.routes import health, calls, stats

    app.register_blueprint(health.bp)
    app.register_blueprint(calls.bp)
    app.register_blueprint(stats.bp)

    return app
