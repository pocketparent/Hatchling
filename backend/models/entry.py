class Entry:
    """
    Model class for memory entries based on the schema in the specifications.
    """
    def __init__(self, entry_id=None, content=None, media_url=None, transcription=None, 
                 tags=None, date_of_memory=None, timestamp_created=None, author_id=None, 
                 privacy="private", source_type="app", deleted_flag=False, journal_id="default"):
        """
        Initialize a new Entry object.
        
        Args:
            entry_id: Unique identifier for the entry (string, internal)
            content: Text content of the entry (string)
            media_url: URL to attached media (string, signed URL)
            transcription: Transcription of voice content (string or null)
            tags: Array of tag strings
            date_of_memory: Date the memory occurred (date)
            timestamp_created: Creation timestamp (datetime UTC)
            author_id: ID of user who created the entry (string, mapped to profile)
            privacy: Privacy setting (enum: private, shared, public)
            source_type: Source of the entry (enum: sms, app, voice)
            deleted_flag: Soft delete flag (boolean)
            journal_id: Journal identifier for multi-kid support (string)
        """
        self.entry_id = entry_id
        self.content = content
        self.media_url = media_url
        self.transcription = transcription
        self.tags = tags or []
        self.date_of_memory = date_of_memory
        self.timestamp_created = timestamp_created
        self.author_id = author_id
        self.privacy = privacy
        self.source_type = source_type
        self.deleted_flag = deleted_flag
        self.journal_id = journal_id
    
    def to_dict(self):
        """
        Convert Entry object to dictionary for Firebase storage.
        
        Returns:
            Dictionary representation of the Entry
        """
        return {
            'entry_id': self.entry_id,
            'content': self.content,
            'media_url': self.media_url,
            'transcription': self.transcription,
            'tags': self.tags,
            'date_of_memory': self.date_of_memory,
            'timestamp_created': self.timestamp_created,
            'author_id': self.author_id,
            'privacy': self.privacy,
            'source_type': self.source_type,
            'deleted_flag': self.deleted_flag,
            'journal_id': self.journal_id
        }
    
    @classmethod
    def from_dict(cls, data):
        """
        Create Entry object from dictionary.
        
        Args:
            data: Dictionary containing entry data
            
        Returns:
            Entry object
        """
        return cls(
            entry_id=data.get('entry_id'),
            content=data.get('content'),
            media_url=data.get('media_url'),
            transcription=data.get('transcription'),
            tags=data.get('tags', []),
            date_of_memory=data.get('date_of_memory'),
            timestamp_created=data.get('timestamp_created'),
            author_id=data.get('author_id'),
            privacy=data.get('privacy', 'private'),
            source_type=data.get('source_type', 'app'),
            deleted_flag=data.get('deleted_flag', False),
            journal_id=data.get('journal_id', 'default')
        )
