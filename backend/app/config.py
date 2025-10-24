"""
配置文件
包含开发、生产环境配置
"""

import os
from datetime import timedelta


class Config:
    """基础配置"""

    # Flask 密钥
    SECRET_KEY = os.getenv("SECRET_KEY", "call-center-business-data-secret-key-dev")

    # JWT 配置（与组织统一标准一致）
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "call-center-secret-key-2024-change-in-production"
    )
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRE_HOURS = 24

    # 数据库配置
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    # 冠客 API 配置
    GUANKE_BASE_URL = os.getenv("GUANKE_BASE_URL", "https://open-api.gooki.com")
    GUANKE_API_SECRET = os.getenv("GUANKE_API_SECRET", "")

    # 数据同步配置
    SYNC_INTERVAL_HOURS = 1  # 每小时同步一次


class DevelopmentConfig(Config):
    """开发环境配置"""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///business_data.db")
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """生产环境配置"""

    DEBUG = False

    # 生产环境必须配置环境变量
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    # PostgreSQL 数据库
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    # 冠客 API（生产环境）
    GUANKE_API_SECRET = os.getenv("GUANKE_API_SECRET")

    def __init__(self):
        """初始化时验证"""
        if not all(
            [self.SECRET_KEY, self.JWT_SECRET_KEY, self.SQLALCHEMY_DATABASE_URI]
        ):
            raise ValueError(
                "生产环境必须配置 SECRET_KEY、JWT_SECRET_KEY 和 DATABASE_URL"
            )
