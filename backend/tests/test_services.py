import importlib
import pkg_resources
import unittest
from unittest.mock import patch, MagicMock
from services.firebase_service import FirebaseService
from services.twilio_service import TwilioService
from services.openai_service import OpenAIService
from services.stripe_service import StripeService

class TestFirebaseService(unittest.TestCase):
    @patch('firebase_admin.auth')
    @patch('firebase_admin.firestore')
    def setUp(self, mock_firestore, mock_auth):
        self.firebase_service = FirebaseService()
        self.mock_firestore = mock_firestore
        self.mock_auth = mock_auth
        
    def test_create_user(self):
        """Test creating a user in Firebase"""
        # Mock data
        user_data = {
            'name': 'Test User',
            'phone_number': '+15551234567',
            'email': 'test@example.com'
        }
        
        # Mock Firebase response
        mock_user = MagicMock()
        mock_user.uid = 'test_user_id'
        self.mock_auth.create_user.return_value = mock_user
        
        # Call method
        user_id = self.firebase_service.create_user(user_data)
        
        # Assertions
        self.assertEqual(user_id, 'test_user_id')
        self.mock_auth.create_user.assert_called_once()
        
    def test_get_user_by_phone(self):
        """Test retrieving a user by phone number"""
        # Mock Firebase response
        mock_user = MagicMock()
        mock_user.uid = 'test_user_id'
        self.mock_auth.get_user_by_phone_number.return_value = mock_user
        
        # Call method
        user = self.firebase_service.get_user_by_phone('+15551234567')
        
        # Assertions
        self.assertEqual(user.uid, 'test_user_id')
        self.mock_auth.get_user_by_phone_number.assert_called_once_with('+15551234567')
        
    def test_create_entry(self):
        """Test creating an entry in Firestore"""
        # Mock data
        entry_data = {
            'entry_id': 'test_entry_id',
            'content': 'Test content',
            'author_id': 'test_user_id'
        }
        
        # Mock Firestore document reference
        mock_doc_ref = MagicMock()
        self.mock_firestore.client.return_value.collection.return_value.document.return_value = mock_doc_ref
        
        # Call method
        self.firebase_service.create_entry(entry_data)
        
        # Assertions
        self.mock_firestore.client.return_value.collection.assert_called_once_with('entries')
        self.mock_firestore.client.return_value.collection.return_value.document.assert_called_once_with('test_entry_id')
        mock_doc_ref.set.assert_called_once_with(entry_data)
        
    def test_get_entries(self):
        """Test retrieving entries from Firestore"""
        # Mock data
        user_id = 'test_user_id'
        
        # Mock Firestore query
        mock_query = MagicMock()
        mock_docs = [MagicMock(), MagicMock()]
        mock_docs[0].to_dict.return_value = {'entry_id': '1', 'content': 'Test 1'}
        mock_docs[1].to_dict.return_value = {'entry_id': '2', 'content': 'Test 2'}
        mock_query.stream.return_value = mock_docs
        
        self.mock_firestore.client.return_value.collection.return_value.where.return_value = mock_query
        
        # Call method
        entries = self.firebase_service.get_entries(user_id)
        
        # Assertions
        self.assertEqual(len(entries), 2)
        self.assertEqual(entries[0]['entry_id'], '1')
        self.assertEqual(entries[1]['content'], 'Test 2')
        self.mock_firestore.client.return_value.collection.assert_called_once_with('entries')
        self.mock_firestore.client.return_value.collection.return_value.where.assert_called_once()

class TestTwilioService(unittest.TestCase):
    @patch('twilio.rest.Client')
    def setUp(self, mock_client):
        self.twilio_service = TwilioService()
        self.mock_client = mock_client
        
    def test_send_sms(self):
        """Test sending SMS via Twilio"""
        # Mock data
        to_number = '+15551234567'
        message = 'Test message'
        
        # Call method
        self.twilio_service.send_sms(to_number, message)
        
        # Assertions
        self.mock_client.return_value.messages.create.assert_called_once_with(
            body=message,
            from_=self.twilio_service.phone_number,
            to=to_number
        )
        
    def test_send_magic_link(self):
        """Test sending magic link via Twilio"""
        # Mock data
        to_number = '+15551234567'
        token = 'test_token'
        
        # Call method
        self.twilio_service.send_magic_link(to_number, token)
        
        # Assertions
        self.mock_client.return_value.messages.create.assert_called_once()
        # Check that the message contains the token
        args, kwargs = self.mock_client.return_value.messages.create.call_args
        self.assertIn(token, kwargs['body'])
        
    def test_send_confirmation(self):
        """Test sending confirmation after entry creation"""
        # Mock data
        to_number = '+15551234567'
        entry = {
            'entry_id': 'test_entry_id',
            'content': 'Test content'
        }
        
        # Call method
        self.twilio_service.send_confirmation(to_number, entry)
        
        # Assertions
        self.mock_client.return_value.messages.create.assert_called_once()
        # Check that the message contains confirmation text
        args, kwargs = self.mock_client.return_value.messages.create.call_args
        self.assertIn('Memory saved', kwargs['body'])

class TestOpenAIService(unittest.TestCase):
    @patch('openai.Audio')
    @patch('openai.Completion')
    def setUp(self, mock_completion, mock_audio):
        self.openai_service = OpenAIService()
        self.mock_completion = mock_completion
        self.mock_audio = mock_audio
        
    def test_transcribe_audio(self):
        """Test transcribing audio with OpenAI Whisper"""
        # Mock data
        audio_path = '/path/to/audio.mp3'
        
        # Mock OpenAI response
        self.mock_audio.transcribe.return_value = {
            'text': 'This is a test transcription'
        }
        
        # Call method
        result = self.openai_service.transcribe_audio(audio_path)
        
        # Assertions
        self.assertEqual(result, 'This is a test transcription')
        self.mock_audio.transcribe.assert_called_once()
        
    def test_suggest_tags(self):
        """Test suggesting tags based on content"""
        # Mock data
        content = 'Baby took first steps today!'
        
        # Mock OpenAI response
        self.mock_completion.create.return_value = {
            'choices': [{'text': 'Milestone, First Steps, Development'}]
        }
        
        # Call method
        tags = self.openai_service.suggest_tags(content)
        
        # Assertions
        self.assertEqual(len(tags), 3)
        self.assertIn('Milestone', tags)
        self.assertIn('First Steps', tags)
        self.mock_completion.create.assert_called_once()

class TestStripeService(unittest.TestCase):
    @patch('stripe.Customer')
    @patch('stripe.Subscription')
    @patch('stripe.checkout.Session')
    def setUp(self, mock_session, mock_subscription, mock_customer):
        self.stripe_service = StripeService()
        self.mock_session = mock_session
        self.mock_subscription = mock_subscription
        self.mock_customer = mock_customer
        
    def test_create_customer(self):
        """Test creating a Stripe customer"""
        # Mock data
        user_data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+15551234567'
        }
        
        # Mock Stripe response
        self.mock_customer.create.return_value = {
            'id': 'cus_test123'
        }
        
        # Call method
        customer_id = self.stripe_service.create_customer(user_data)
        
        # Assertions
        self.assertEqual(customer_id, 'cus_test123')
        self.mock_customer.create.assert_called_once()
        
    def test_create_checkout_session(self):
        """Test creating a Stripe checkout session"""
        # Mock data
        customer_id = 'cus_test123'
        success_url = 'https://example.com/success'
        cancel_url = 'https://example.com/cancel'
        
        # Mock Stripe response
        self.mock_session.create.return_value = {
            'id': 'cs_test123',
            'url': 'https://checkout.stripe.com/test'
        }
        
        # Call method
        session = self.stripe_service.create_checkout_session(
            customer_id, success_url, cancel_url
        )
        
        # Assertions
        self.assertEqual(session['id'], 'cs_test123')
        self.assertEqual(session['url'], 'https://checkout.stripe.com/test')
        self.mock_session.create.assert_called_once()
        
    def test_handle_subscription_event(self):
        """Test handling a Stripe subscription event"""
        # Mock data
        event_data = {
            'type': 'customer.subscription.updated',
            'data': {
                'object': {
                    'customer': 'cus_test123',
                    'status': 'active'
                }
            }
        }
        
        # Call method
        result = self.stripe_service.handle_subscription_event(event_data)
        
        # Assertions
        self.assertTrue(result)
        # Additional assertions would depend on the implementation

if __name__ == '__main__':
    unittest.main()
class TestDependencyValidation(unittest.TestCase):
    """Test class to validate required dependencies are installed and have correct versions."""
    
    def test_required_backend_dependencies(self):
        """Test that all required backend dependencies are installed."""
        required_packages = [
            'flask', 'flask-cors', 'firebase-admin', 'twilio', 'openai', 
            'stripe', 'gunicorn', 'pillow', 'python-dotenv', 'pyjwt'
        ]
        
        for package in required_packages:
            try:
                pkg_resources.get_distribution(package)
            except pkg_resources.DistributionNotFound:
                self.fail(f"Required package '{package}' is not installed")
    
    def test_pillow_for_image_processing(self):
        """Test that Pillow is available for image processing."""
        try:
            # Try to import PIL modules used in the application
            from PIL import Image, ImageOps
            # Create a small test image to verify functionality
            img = Image.new('RGB', (10, 10), color='red')
            # Test basic operations
            img_gray = ImageOps.grayscale(img)
            self.assertEqual(img_gray.mode, 'L', "Grayscale conversion failed")
        except ImportError as e:
            self.fail(f"Failed to import PIL modules: {e}")
        except Exception as e:
            self.fail(f"Error using PIL: {e}")
    
    def test_firebase_configuration(self):
        """Test that Firebase configuration is properly set up."""
        # Check if firebase_admin can be imported
        try:
            import firebase_admin
            from firebase_admin import credentials
            # Check if environment variables for Firebase are set
            import os
            required_env_vars = [
                'FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID',
                'FIREBASE_STORAGE_BUCKET', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'
            ]
            missing_vars = [var for var in required_env_vars if not os.getenv(var)]
            if missing_vars:
                self.fail(f"Missing Firebase environment variables: {', '.join(missing_vars)}")
        except ImportError:
            self.fail("Failed to import firebase_admin")
