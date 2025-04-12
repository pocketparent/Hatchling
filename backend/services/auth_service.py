import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class AuthService:
    """
    Service class for authentication operations including JWT token generation and validation.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize authentication service with JWT secret from environment variables."""
        try:
            # Get JWT secret from environment variables
            self.jwt_secret = os.getenv("JWT_SECRET")
            self.token_expiry = 60 * 10  # 10 minutes for magic links
            
            print("Auth service initialized successfully")
        except Exception as e:
            print(f"Error initializing Auth service: {e}")
            # In production, would use proper logging
    
    def generate_magic_link_token(self, phone_number):
        """
        Generate JWT token for magic link authentication.
        
        Args:
            phone_number: User's phone number
            
        Returns:
            JWT token if successful, None otherwise
        """
        try:
            # Set token expiration time
            exp_time = datetime.utcnow() + timedelta(seconds=self.token_expiry)
            
            # Create token payload
            payload = {
                "phone_number": phone_number,
                "exp": exp_time,
                "iat": datetime.utcnow(),
                "type": "magic_link"
            }
            
            # Generate token
            token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
            
            return token
        except Exception as e:
            print(f"Error generating magic link token: {e}")
            return None
    
    def verify_token(self, token):
        """
        Verify JWT token.
        
        Args:
            token: JWT token to verify
            
        Returns:
            Token payload if valid, None otherwise
        """
        try:
            # Decode and verify token
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            
            return payload
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return None
        except jwt.InvalidTokenError as e:
            print(f"Invalid token: {e}")
            return None
    
    def generate_auth_token(self, user_id, role="parent"):
        """
        Generate JWT token for authenticated user.
        
        Args:
            user_id: User ID
            role: User role
            
        Returns:
            JWT token if successful, None otherwise
        """
        try:
            # Set token expiration time (24 hours)
            exp_time = datetime.utcnow() + timedelta(days=1)
            
            # Create token payload
            payload = {
                "user_id": user_id,
                "role": role,
                "exp": exp_time,
                "iat": datetime.utcnow(),
                "type": "auth"
            }
            
            # Generate token
            token = jwt.encode(payload, self.jwt_secret, algorithm="HS256")
            
            return token
        except Exception as e:
            print(f"Error generating auth token: {e}")
            return None
