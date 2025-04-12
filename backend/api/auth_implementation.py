from flask import request, jsonify, g
from functools import wraps
from services.firebase_service import FirebaseService
from services.auth_service import AuthService
from services.twilio_service import TwilioService
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize services
firebase_service = FirebaseService()
auth_service = AuthService()
twilio_service = TwilioService()

# Base URL for magic links
base_url = os.getenv("BASE_URL", "https://myhatchling.ai")

def implement_auth_endpoints(app):
    """
    Implement authentication endpoints for the Flask app.
    
    Args:
        app: Flask application instance
    """
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """Generate and send magic link for login."""
        data = request.get_json()
        
        if not data or 'phone_number' not in data:
            return jsonify({'message': 'Phone number is required'}), 400
        
        phone_number = data['phone_number']
        
        # Generate magic link token
        token = auth_service.generate_magic_link_token(phone_number)
        if not token:
            return jsonify({'message': 'Failed to generate login link'}), 500
        
        # Create magic link URL
        magic_link = f"{base_url}/auth/verify?token={token}"
        
        # Send magic link via SMS
        message_sid = twilio_service.send_magic_link(phone_number, magic_link)
        if not message_sid:
            return jsonify({'message': 'Failed to send login link'}), 500
        
        return jsonify({
            'message': 'Login link sent successfully',
            'phone_number': phone_number
        }), 200
    
    @app.route('/api/auth/verify', methods=['GET'])
    def verify_token():
        """Verify magic link token and create user session."""
        token = request.args.get('token')
        
        if not token:
            return jsonify({'message': 'Token is required'}), 400
        
        # Verify token
        payload = auth_service.verify_token(token)
        if not payload or payload.get('type') != 'magic_link':
            return jsonify({'message': 'Invalid or expired token'}), 401
        
        phone_number = payload.get('phone_number')
        
        # Check if user exists
        user_exists = False  # This would be a Firebase query in the real implementation
        
        if user_exists:
            # Generate auth token for existing user
            user_id = "user_123"  # This would be the actual user ID from Firebase
            auth_token = auth_service.generate_auth_token(user_id)
            
            return jsonify({
                'message': 'Login successful',
                'token': auth_token,
                'user_id': user_id,
                'is_new_user': False
            }), 200
        else:
            # Return indication that account creation is needed
            return jsonify({
                'message': 'Account creation required',
                'phone_number': phone_number,
                'is_new_user': True
            }), 200
    
    @app.route('/api/auth/create-account', methods=['POST'])
    def create_account():
        """Create a new user account after magic link verification."""
        data = request.get_json()
        
        required_fields = ['name', 'phone_number']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'{field} is required'}), 400
        
        name = data['name']
        phone_number = data['phone_number']
        
        # Optional fields
        avatar = data.get('avatar')
        default_privacy = data.get('default_privacy', 'private')
        nudge_opt_in = data.get('nudge_opt_in', True)
        nudge_frequency = data.get('nudge_frequency', 'occasionally')
        
        # Create user in Firebase (placeholder implementation)
        user_id = "user_" + phone_number.replace('+', '').replace(' ', '')
        
        # Generate auth token
        auth_token = auth_service.generate_auth_token(user_id)
        
        return jsonify({
            'message': 'Account created successfully',
            'token': auth_token,
            'user_id': user_id
        }), 201
