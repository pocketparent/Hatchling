from flask import Blueprint, jsonify, request, g
from functools import wraps
from services.auth_service import AuthService
import jwt

auth_service = AuthService()

def token_required(f):
    """Decorator to require valid JWT token for protected routes."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Verify token
            payload = auth_service.verify_token(token)
            if not payload or payload.get('type') != 'auth':
                return jsonify({'message': 'Invalid token'}), 401
            
            # Store user info in Flask's g object for use in the route
            g.user_id = payload.get('user_id')
            g.role = payload.get('role')
            
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    
    return decorated
