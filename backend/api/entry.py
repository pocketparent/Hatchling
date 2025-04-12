from flask import Blueprint, jsonify, request, g
from models.entry import Entry
from utils.auth import token_required
from services.firebase_service import FirebaseService
from services.openai_service import OpenAIService
import os
import uuid
from datetime import datetime

entry_bp = Blueprint('entry', __name__)
firebase_service = FirebaseService()
openai_service = OpenAIService()

@entry_bp.route('/entry', methods=['POST'])
@token_required
def create_entry():
    """Create a new memory entry."""
    data = request.get_json()
    
    # Validate required fields
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    # Get user ID from auth token (set in token_required decorator)
    user_id = g.user_id
    
    # Extract fields from request
    content = data['content']
    media_url = data.get('media_url')
    transcription = data.get('transcription')
    tags = data.get('tags', [])
    date_of_memory = data.get('date_of_memory', datetime.utcnow().isoformat())
    privacy = data.get('privacy', 'private')
    source_type = data.get('source_type', 'app')
    
    # Generate entry ID
    entry_id = str(uuid.uuid4())
    
    # If no tags provided and content exists, suggest tags using OpenAI
    if not tags and content:
        suggested_tags = openai_service.suggest_tags(content)
        tags = suggested_tags
    
    # Create entry object
    entry = {
        'entry_id': entry_id,
        'content': content,
        'media_url': media_url,
        'transcription': transcription,
        'tags': tags,
        'date_of_memory': date_of_memory,
        'timestamp_created': datetime.utcnow().isoformat(),
        'author_id': user_id,
        'privacy': privacy,
        'source_type': source_type,
        'deleted_flag': False,
        'journal_id': data.get('journal_id', 'default')  # For future multi-kid support
    }
    
    # Save to Firebase
    try:
        # This is a placeholder for the actual Firebase implementation
        # firebase_service.create_entry(entry)
        
        return jsonify({
            'message': 'Entry created successfully',
            'entry_id': entry_id,
            'tags': tags
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entry_bp.route('/entries', methods=['GET'])
@token_required
def get_entries():
    """Retrieve entries for a user."""
    user_id = g.user_id
    
    # Get query parameters
    journal_id = request.args.get('journal_id', 'default')
    tag = request.args.get('tag')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = int(request.args.get('limit', 20))
    offset = int(request.args.get('offset', 0))
    
    # This would be implemented with actual Firebase queries
    # entries = firebase_service.get_entries(user_id, journal_id, tag, start_date, end_date, limit, offset)
    
    # Mock response for now
    entries = [
        {
            'entry_id': '123',
            'content': 'First steps today!',
            'tags': ['Milestone', 'First Steps'],
            'date_of_memory': '2025-04-10',
            'timestamp_created': '2025-04-10T15:30:00Z',
            'privacy': 'private'
        }
    ]
    
    return jsonify({
        'entries': entries,
        'total': len(entries),
        'limit': limit,
        'offset': offset
    }), 200

@entry_bp.route('/entry/<entry_id>', methods=['GET'])
@token_required
def get_entry(entry_id):
    """Retrieve a specific entry."""
    user_id = g.user_id
    
    # This would be implemented with actual Firebase query
    # entry = firebase_service.get_entry(entry_id, user_id)
    
    # Mock response for now
    entry = {
        'entry_id': entry_id,
        'content': 'First steps today!',
        'tags': ['Milestone', 'First Steps'],
        'date_of_memory': '2025-04-10',
        'timestamp_created': '2025-04-10T15:30:00Z',
        'privacy': 'private'
    }
    
    if not entry:
        return jsonify({'error': 'Entry not found'}), 404
    
    return jsonify(entry), 200

@entry_bp.route('/entry/<entry_id>', methods=['PATCH'])
@token_required
def update_entry(entry_id):
    """Update an existing entry."""
    user_id = g.user_id
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'No update data provided'}), 400
    
    # Validate that entry exists and belongs to user
    # entry = firebase_service.get_entry(entry_id, user_id)
    # if not entry:
    #     return jsonify({'error': 'Entry not found or access denied'}), 404
    
    # Fields that can be updated
    updateable_fields = ['content', 'tags', 'date_of_memory', 'privacy', 'media_url', 'transcription']
    update_data = {k: v for k, v in data.items() if k in updateable_fields}
    
    # Add timestamp for when updated
    update_data['timestamp_updated'] = datetime.utcnow().isoformat()
    
    # Update in Firebase
    try:
        # firebase_service.update_entry(entry_id, user_id, update_data)
        
        return jsonify({
            'message': 'Entry updated successfully',
            'entry_id': entry_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entry_bp.route('/entry/<entry_id>', methods=['DELETE'])
@token_required
def delete_entry(entry_id):
    """Soft delete an entry."""
    user_id = g.user_id
    
    # Validate that entry exists and belongs to user
    # entry = firebase_service.get_entry(entry_id, user_id)
    # if not entry:
    #     return jsonify({'error': 'Entry not found or access denied'}), 404
    
    # Soft delete in Firebase (set deleted_flag to True)
    try:
        # firebase_service.soft_delete_entry(entry_id, user_id)
        
        return jsonify({
            'message': 'Entry deleted successfully',
            'entry_id': entry_id
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@entry_bp.route('/sms/webhook', methods=['POST'])
def sms_webhook():
    """Handle incoming SMS messages from Twilio."""
    # Extract message data from Twilio webhook
    from_number = request.form.get('From')
    body = request.form.get('Body', '')
    num_media = int(request.form.get('NumMedia', 0))
    media_urls = []
    
    # Extract media URLs if present
    for i in range(num_media):
        media_url = request.form.get(f'MediaUrl{i}')
        if media_url:
            media_urls.append(media_url)
    
    try:
        # Look up user by phone number
        # user = firebase_service.get_user_by_phone(from_number)
        # if not user:
        #     # Store message for review if from unknown number
        #     firebase_service.store_unknown_sms(from_number, body, media_urls)
        #     return '', 200
        
        # Process media if present
        transcription = None
        if media_urls and any(url.endswith(('.mp3', '.wav', '.m4a')) for url in media_urls):
            # Download audio file and transcribe
            # audio_path = download_audio(media_urls[0])
            # transcription = openai_service.transcribe_audio(audio_path)
            pass
        
        # Create entry
        entry = {
            'entry_id': str(uuid.uuid4()),
            'content': body,
            'media_url': media_urls[0] if media_urls else None,
            'transcription': transcription,
            'tags': [],  # Will be processed by backend
            'date_of_memory': datetime.utcnow().isoformat(),
            'timestamp_created': datetime.utcnow().isoformat(),
            'author_id': 'user_id',  # Would be actual user ID
            'privacy': 'private',  # Default privacy
            'source_type': 'sms',
            'deleted_flag': False,
            'journal_id': 'default'
        }
        
        # Save to Firebase
        # firebase_service.create_entry(entry)
        
        # Send confirmation SMS
        # twilio_service.send_confirmation(from_number, entry)
        
        return '', 200
    except Exception as e:
        # Log error
        print(f"Error processing SMS: {e}")
        return '', 200  # Always return 200 to Twilio
