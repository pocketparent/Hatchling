import unittest
from app import app
from models.entry import Entry
from models.user import User
from datetime import datetime
import json

class TestEntryAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        # Mock authentication for testing
        self.headers = {'Authorization': 'Bearer test-token'}
        
    def test_create_entry(self):
        """Test creating a new entry"""
        test_entry = {
            'content': 'Test memory entry',
            'tags': ['Test', 'Memory'],
            'date_of_memory': datetime.utcnow().isoformat(),
            'privacy': 'private',
            'source_type': 'app'
        }
        
        response = self.app.post(
            '/api/entry',
            data=json.dumps(test_entry),
            content_type='application/json',
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('entry_id', data)
        self.assertIn('message', data)
        
    def test_get_entries(self):
        """Test retrieving entries"""
        response = self.app.get(
            '/api/entries',
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('entries', data)
        self.assertIn('total', data)
        
    def test_get_entry(self):
        """Test retrieving a specific entry"""
        # First create an entry
        test_entry = {
            'content': 'Test memory for retrieval',
            'tags': ['Test', 'Retrieval'],
            'date_of_memory': datetime.utcnow().isoformat(),
            'privacy': 'private'
        }
        
        create_response = self.app.post(
            '/api/entry',
            data=json.dumps(test_entry),
            content_type='application/json',
            headers=self.headers
        )
        
        entry_id = json.loads(create_response.data)['entry_id']
        
        # Now retrieve it
        response = self.app.get(
            f'/api/entry/{entry_id}',
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['entry_id'], entry_id)
        self.assertEqual(data['content'], test_entry['content'])
        
    def test_update_entry(self):
        """Test updating an entry"""
        # First create an entry
        test_entry = {
            'content': 'Test memory for update',
            'tags': ['Test', 'Update'],
            'date_of_memory': datetime.utcnow().isoformat(),
            'privacy': 'private'
        }
        
        create_response = self.app.post(
            '/api/entry',
            data=json.dumps(test_entry),
            content_type='application/json',
            headers=self.headers
        )
        
        entry_id = json.loads(create_response.data)['entry_id']
        
        # Now update it
        update_data = {
            'content': 'Updated test memory',
            'tags': ['Test', 'Update', 'Modified']
        }
        
        response = self.app.patch(
            f'/api/entry/{entry_id}',
            data=json.dumps(update_data),
            content_type='application/json',
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['entry_id'], entry_id)
        self.assertIn('message', data)
        
    def test_delete_entry(self):
        """Test deleting an entry"""
        # First create an entry
        test_entry = {
            'content': 'Test memory for deletion',
            'tags': ['Test', 'Delete'],
            'date_of_memory': datetime.utcnow().isoformat(),
            'privacy': 'private'
        }
        
        create_response = self.app.post(
            '/api/entry',
            data=json.dumps(test_entry),
            content_type='application/json',
            headers=self.headers
        )
        
        entry_id = json.loads(create_response.data)['entry_id']
        
        # Now delete it
        response = self.app.delete(
            f'/api/entry/{entry_id}',
            headers=self.headers
        )
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['entry_id'], entry_id)
        self.assertIn('message', data)
        
    def test_sms_webhook(self):
        """Test SMS webhook endpoint"""
        test_data = {
            'From': '+15551234567',
            'Body': 'Test SMS memory entry',
            'NumMedia': '0'
        }
        
        response = self.app.post(
            '/api/sms/webhook',
            data=test_data
        )
        
        self.assertEqual(response.status_code, 200)

class TestEntryModel(unittest.TestCase):
    def test_entry_creation(self):
        """Test Entry model creation"""
        entry = Entry(
            entry_id='test123',
            content='Test memory',
            tags=['Test'],
            date_of_memory='2025-04-12',
            timestamp_created='2025-04-12T12:00:00Z',
            author_id='user123',
            privacy='private',
            source_type='app'
        )
        
        self.assertEqual(entry.entry_id, 'test123')
        self.assertEqual(entry.content, 'Test memory')
        self.assertEqual(entry.tags, ['Test'])
        self.assertEqual(entry.privacy, 'private')
        
    def test_entry_to_dict(self):
        """Test Entry model to_dict method"""
        entry = Entry(
            entry_id='test123',
            content='Test memory',
            tags=['Test'],
            date_of_memory='2025-04-12',
            timestamp_created='2025-04-12T12:00:00Z',
            author_id='user123',
            privacy='private',
            source_type='app'
        )
        
        entry_dict = entry.to_dict()
        
        self.assertIsInstance(entry_dict, dict)
        self.assertEqual(entry_dict['entry_id'], 'test123')
        self.assertEqual(entry_dict['content'], 'Test memory')
        self.assertEqual(entry_dict['tags'], ['Test'])
        
    def test_entry_from_dict(self):
        """Test Entry model from_dict method"""
        entry_data = {
            'entry_id': 'test123',
            'content': 'Test memory',
            'tags': ['Test'],
            'date_of_memory': '2025-04-12',
            'timestamp_created': '2025-04-12T12:00:00Z',
            'author_id': 'user123',
            'privacy': 'private',
            'source_type': 'app'
        }
        
        entry = Entry.from_dict(entry_data)
        
        self.assertIsInstance(entry, Entry)
        self.assertEqual(entry.entry_id, 'test123')
        self.assertEqual(entry.content, 'Test memory')
        self.assertEqual(entry.tags, ['Test'])

class TestUserModel(unittest.TestCase):
    def test_user_creation(self):
        """Test User model creation"""
        user = User(
            user_id='user123',
            name='Test User',
            phone_number='+15551234567',
            email='test@example.com',
            role='parent',
            permissions=['edit'],
            default_privacy='private',
            nudge_opt_in=True,
            nudge_frequency='occasionally'
        )
        
        self.assertEqual(user.user_id, 'user123')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.phone_number, '+15551234567')
        self.assertEqual(user.role, 'parent')
        
    def test_user_to_dict(self):
        """Test User model to_dict method"""
        user = User(
            user_id='user123',
            name='Test User',
            phone_number='+15551234567',
            email='test@example.com',
            role='parent',
            permissions=['edit'],
            default_privacy='private',
            nudge_opt_in=True,
            nudge_frequency='occasionally'
        )
        
        user_dict = user.to_dict()
        
        self.assertIsInstance(user_dict, dict)
        self.assertEqual(user_dict['user_id'], 'user123')
        self.assertEqual(user_dict['name'], 'Test User')
        self.assertEqual(user_dict['phone_number'], '+15551234567')
        
    def test_user_from_dict(self):
        """Test User model from_dict method"""
        user_data = {
            'user_id': 'user123',
            'name': 'Test User',
            'phone_number': '+15551234567',
            'email': 'test@example.com',
            'role': 'parent',
            'permissions': ['edit'],
            'default_privacy': 'private',
            'nudge_opt_in': True,
            'nudge_frequency': 'occasionally'
        }
        
        user = User.from_dict(user_data)
        
        self.assertIsInstance(user, User)
        self.assertEqual(user.user_id, 'user123')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.phone_number, '+15551234567')

if __name__ == '__main__':
    unittest.main()
