import os

# Bind to the port provided by Render
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"

# Worker configuration
workers = 4  # Number of worker processes
threads = 2  # Threads per worker
timeout = 120  # Seconds before timing out a worker
worker_class = "gthread"  # Use threads for async operations

# Logging configuration
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log errors to stdout
loglevel = "info"

# Recommended for production
preload_app = True
