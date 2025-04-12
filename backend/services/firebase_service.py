import firebase_admin
from firebase_admin import credentials, firestore, storage
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class FirebaseService:
    """
    Service class for Firebase operations including authentication, Firestore, and Storage.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize Firebase with credentials from environment variables."""
        try:
            # Use environment variables for Firebase configuration
            firebase_credentials = {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
            }
            
            # Initialize Firebase Admin SDK
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred, {
                'storageBucket': os.getenv("FIREBASE_STORAGE_BUCKET")
            })
            
            # Initialize Firestore and Storage clients
            self.db = firestore.client()
            self.bucket = storage.bucket()
            
            print("Firebase initialized successfully")
        except Exception as e:
            print(f"Error initializing Firebase: {e}")
            # In production, would use proper logging
            self.db = None
            self.bucket = None
    
    def get_entry(self, entry_id):
        """Retrieve an entry from Firestore by ID."""
        if not self.db:
            return None
        
        try:
            entry_ref = self.db.collection('entries').document(entry_id)
            entry = entry_ref.get()
            return entry.to_dict() if entry.exists else None
        except Exception as e:
            print(f"Error retrieving entry: {e}")
            return None
    
    def create_entry(self, entry_data):
        """Create a new entry in Firestore."""
        if not self.db:
            return None
        
        try:
            entry_ref = self.db.collection('entries').document()
            entry_data['entry_id'] = entry_ref.id
            entry_ref.set(entry_data)
            return entry_data
        except Exception as e:
            print(f"Error creating entry: {e}")
            return None
    
    def update_entry(self, entry_id, entry_data):
        """Update an existing entry in Firestore."""
        if not self.db:
            return False
        
        try:
            entry_ref = self.db.collection('entries').document(entry_id)
            entry_ref.update(entry_data)
            return True
        except Exception as e:
            print(f"Error updating entry: {e}")
            return False
    
    def delete_entry(self, entry_id):
        """Soft-delete an entry by setting deleted_flag to True."""
        if not self.db:
            return False
        
        try:
            entry_ref = self.db.collection('entries').document(entry_id)
            entry_ref.update({'deleted_flag': True})
            return True
        except Exception as e:
            print(f"Error deleting entry: {e}")
            return False
    
    def get_entries(self, journal_id, filters=None):
        """
        Retrieve entries by journal ID with optional filtering.
        
        Args:
            journal_id: The journal ID to filter by
            filters: Optional dictionary of additional filters
                     e.g., {'tag': 'Milestone', 'author_id': 'user_123'}
        """
        if not self.db:
            return []
        
        try:
            query = self.db.collection('entries').where('journal_id', '==', journal_id)
            query = query.where('deleted_flag', '==', False)
            
            if filters:
                if 'tag' in filters:
                    query = query.where('tags', 'array_contains', filters['tag'])
                if 'author_id' in filters:
                    query = query.where('author_id', '==', filters['author_id'])
            
            # Apply sorting if specified
            if filters and 'sort' in filters:
                direction = firestore.Query.DESCENDING
                if filters['sort'] == 'asc':
                    direction = firestore.Query.ASCENDING
                query = query.order_by('timestamp_created', direction=direction)
            else:
                # Default to descending (newest first)
                query = query.order_by('timestamp_created', direction=firestore.Query.DESCENDING)
            
            entries = query.stream()
            return [entry.to_dict() for entry in entries]
        except Exception as e:
            print(f"Error retrieving entries: {e}")
            return []
    
    def upload_media(self, file_data, file_name, content_type):
        """
        Upload media file to Firebase Storage.
        
        Args:
            file_data: Binary data of the file
            file_name: Name to save the file as
            content_type: MIME type of the file
        
        Returns:
            URL of the uploaded file or None if upload failed
        """
        if not self.bucket:
            return None
        
        try:
            blob = self.bucket.blob(f"media/{file_name}")
            blob.upload_from_string(file_data, content_type=content_type)
            blob.make_public()
            return blob.public_url
        except Exception as e:
            print(f"Error uploading media: {e}")
            return None
