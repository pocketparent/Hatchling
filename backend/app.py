import os
from datetime import datetime
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import API implementations
from api.auth_implementation import implement_auth_endpoints
from api.entry import entry_bp
from api.user import user_bp
from api.stripe import stripe_bp
from api.image import image_bp

# Create Flask app
app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(entry_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(stripe_bp, url_prefix='/api/stripe')
app.register_blueprint(image_bp, url_prefix='/api/image')

# Implement auth endpoints directly on app
implement_auth_endpoints(app)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Rate limiting middleware (simple implementation)
@app.before_request
def rate_limit():
    # This would be a more sophisticated implementation in production
    # using Redis or another caching solution
    pass

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
