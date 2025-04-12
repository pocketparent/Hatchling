from flask import Blueprint

# Create blueprint for API routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Import routes
from .entry import entry_bp

# Register blueprints
api_bp.register_blueprint(entry_bp, url_prefix='')
