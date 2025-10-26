"""
Gunicorn 配置文件（生产环境可选）
使用方式：gunicorn -c gunicorn.conf.py run:app
"""

import multiprocessing
import os

# 监听地址和端口
bind = f"0.0.0.0:{os.getenv('PORT', 5001)}"

# Worker 进程数（推荐：CPU 核心数 * 2 + 1）
workers = min(multiprocessing.cpu_count() * 2 + 1, 4)

# Worker 类型
worker_class = "sync"

# 每个 worker 的线程数
threads = 2

# 超时时间（秒）
timeout = 30

# 保持连接超时
keepalive = 2

# 日志
accesslog = "-"  # 输出到 stdout
errorlog = "-"  # 输出到 stderr
loglevel = "info"

# 进程名称
proc_name = "call-center-backend"

# 优雅重启
graceful_timeout = 30
