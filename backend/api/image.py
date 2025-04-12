import os
from flask import Blueprint, request, jsonify
from utils.image_processor import ImageProcessor
from services.firebase_service import FirebaseService

image_bp = Blueprint('image', __name__)
image_processor = ImageProcessor()
firebase_service = FirebaseService()

@image_bp.route('/process', methods=['POST'])
def process_image():
    """
    Process an image with various operations (thumbnail, compression, filters)
    
    Request body:
    {
        "image_url": "https://example.com/image.jpg",
        "operations": [
            {"type": "thumbnail", "size": [200, 200]},
            {"type": "compress", "quality": 85},
            {"type": "filter", "filter_type": "enhance"}
        ],
        "entry_id": "optional-entry-id-to-associate"
    }
    
    Returns:
        JSON with processed image URLs
    """
    data = request.json
    
    if not data or 'image_url' not in data or 'operations' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    image_url = data['image_url']
    operations = data['operations']
    entry_id = data.get('entry_id')
    
    results = {}
    
    try:
        for operation in operations:
            op_type = operation.get('type')
            
            if op_type == 'thumbnail':
                size = operation.get('size', (200, 200))
                output_path = image_processor.generate_thumbnail(image_url, size=size)
                # In a real implementation, upload to Firebase Storage
                # For now, just return the local path
                results['thumbnail_url'] = output_path
                
            elif op_type == 'compress':
                quality = operation.get('quality', 85)
                output_path = image_processor.compress_image(image_url, quality=quality)
                results['compressed_url'] = output_path
                
            elif op_type == 'filter':
                filter_type = operation.get('filter_type', 'enhance')
                output_path = image_processor.apply_filter(image_url, filter_type=filter_type)
                results['filtered_url'] = output_path
                
            elif op_type == 'exif':
                exif_data = image_processor.extract_exif_data(image_url)
                results['exif_data'] = exif_data
        
        # If entry_id is provided, update the entry with the processed images
        if entry_id:
            # In a real implementation, update the entry in Firestore
            pass
            
        return jsonify({
            'message': 'Image processed successfully',
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@image_bp.route('/upload', methods=['POST'])
def upload_image():
    """
    Upload an image file
    
    Form data:
    - image: The image file
    - entry_id: (Optional) Entry ID to associate with the image
    
    Returns:
        JSON with uploaded image URL
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
        
    image_file = request.files['image']
    entry_id = request.form.get('entry_id')
    
    if image_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
        
    try:
        # Save the file temporarily
        temp_path = os.path.join('/tmp', image_file.filename)
        image_file.save(temp_path)
        
        # In a real implementation, upload to Firebase Storage
        # For now, just return the local path
        image_url = temp_path
        
        # If entry_id is provided, update the entry with the image URL
        if entry_id:
            # In a real implementation, update the entry in Firestore
            pass
            
        return jsonify({
            'message': 'Image uploaded successfully',
            'image_url': image_url
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
