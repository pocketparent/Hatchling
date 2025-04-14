import os
from twilio.rest import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TwilioService:
    """
    Service class for Twilio operations including SMS/MMS sending and receiving.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TwilioService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Twilio client with credentials from environment variables."""
        try:
            # Get Twilio credentials from environment variables
            self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
            self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
            self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
            
            # Initialize Twilio client
            self.client = Client(self.account_sid, self.auth_token)
            
            print("Twilio service initialized successfully")
        except Exception as e:
            print(f"Error initializing Twilio service: {e}")
            # In production, would use proper logging
            self.client = None
    
    def send_sms(self, to_number, message):
        """
        Send SMS message using Twilio.
        
        Args:
            to_number: Recipient phone number
            message: Message content
            
        Returns:
            Message SID if successful, None otherwise
        """
        if not self.client:
            return None
        
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return None
    
    def send_magic_link(self, to_number, link):
        """
        Send magic link for authentication via SMS.
        
        Args:
            to_number: Recipient phone number
            link: Magic link URL
            
        Returns:
            Message SID if successful, None otherwise
        """
        if not self.client:
            return None
        
        try:
            message_body = f"Your Hatchling login link is here: {link} (valid for 10 minutes)"
            message = self.client.messages.create(
                body=message_body,
                from_=self.phone_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Error sending magic link: {e}")
            return None
    
    # Added both method names to maintain backward compatibility
    def send_confirmation(self, to_number, entry):
        """
        Send confirmation message after entry creation.
        
        Args:
            to_number: Recipient phone number
            entry: Journal entry object
            
        Returns:
            Message SID if successful, None otherwise
        """
        # Determine if entry has media
        has_media = bool(entry.get('images', []))
        has_text = bool(entry.get('content', '').strip())
        
        return self.send_entry_confirmation(to_number, has_media, has_text)
    
    def send_entry_confirmation(self, to_number, has_media=False, has_text=True):
        """
        Send confirmation message after receiving an entry.
        
        Args:
            to_number: Recipient phone number
            has_media: Whether the entry included media
            has_text: Whether the entry included text
            
        Returns:
            Message SID if successful, None otherwise
        """
        if not self.client:
            return None
        
        try:
            # Customize message based on entry content
            if has_media and not has_text:
                message_body = "Added to your memory jar 🍃 Want to add a note?"
            else:
                message_body = "Added to your memory jar 🍃"
                
            message = self.client.messages.create(
                body=message_body,
                from_=self.phone_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Error sending confirmation: {e}")
            return None
    
    def send_nudge(self, to_number, nudge_type="general"):
        """
        Send nudge reminder based on user preferences.
        
        Args:
            to_number: Recipient phone number
            nudge_type: Type of nudge to send (general, milestone, etc.)
            
        Returns:
            Message SID if successful, None otherwise
        """
        if not self.client:
            return None
        
        try:
            # Different nudge messages based on type
            nudge_messages = {
                "general": "How's your day going? Send a quick update to Hatchling!",
                "milestone": "Any milestones to capture today? Hatchling is ready when you are!",
                "weekly": "Looking back on your week - any special moments to remember?"
            }
            
            message_body = nudge_messages.get(nudge_type, nudge_messages["general"])
            
            message = self.client.messages.create(
                body=message_body,
                from_=self.phone_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Error sending nudge: {e}")
            return None
