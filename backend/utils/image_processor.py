import os
import requests
from io import BytesIO
import logging

# Add proper error handling for PIL import
try:
    from PIL import Image, ImageOps
except ImportError:
    logging.warning("Failed to import PIL modules. Please install with: pip install pillow")
    # Create placeholder classes to prevent crashes
    class Image:
        @staticmethod
        def open(*args, **kwargs):
            raise ImportError("PIL is not installed. Please install with: pip install pillow")
    
    class ImageOps:
        @staticmethod
        def grayscale(*args, **kwargs):
            raise ImportError("PIL is not installed. Please install with: pip install pillow")
        
        @staticmethod
        def autocontrast(*args, **kwargs):
            raise ImportError("PIL is not installed. Please install with: pip install pillow")

class ImageProcessor:
    """
    Utility class for image processing operations including resizing, compression, and filters.
    """
    
    def __init__(self, storage_path=None):
        """
        Initialize the image processor with a storage path.
        
        Args:
            storage_path: Directory to store processed images (optional)
        """
        self.storage_path = storage_path or os.path.join(os.getcwd(), 'processed_images')
        
        # Create storage directory if it doesn't exist
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)
    
    def resize_image(self, image_path, size=(800, 800), output_path=None):
        """
        Resize an image while maintaining aspect ratio.
        
        Args:
            image_path: Local file path or URL of the image
            size: Tuple of (width, height) for the resized image
            output_path: Path to save the resized image (optional)
            
        Returns:
            Path to the resized image
        """
        # Determine if image_path is a URL or local file
        if image_path.startswith(('http://', 'https://') ):
            response = requests.get(image_path)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path)
        
        # Resize image while maintaining aspect ratio
        img.thumbnail(size)
        
        # Determine output path if not provided
        if not output_path:
            filename = os.path.basename(image_path)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(self.storage_path, f"{name}_resized{ext}")
        
        # Save resized image
        img.save(output_path, optimize=True)
        
        return output_path
    
    def create_thumbnail(self, image_path, size=(200, 200), output_path=None):
        """
        Create a thumbnail of an image.
        
        Args:
            image_path: Local file path or URL of the image
            size: Tuple of (width, height) for the thumbnail
            output_path: Path to save the thumbnail (optional)
            
        Returns:
            Path to the thumbnail
        """
        # Determine if image_path is a URL or local file
        if image_path.startswith(('http://', 'https://') ):
            response = requests.get(image_path)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path)
        
        # Create thumbnail
        img.thumbnail(size)
        
        # Determine output path if not provided
        if not output_path:
            filename = os.path.basename(image_path)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(self.storage_path, f"{name}_thumb{ext}")
        
        # Save thumbnail
        img.save(output_path, optimize=True)
        
        return output_path
    
    def compress_image(self, image_path, quality=85, output_path=None):
        """
        Compress an image to reduce file size
        
        Args:
            image_path: Local file path or URL of the image
            quality: JPEG quality (1-100)
            output_path: Path to save the compressed image (optional)
            
        Returns:
            Path to the compressed image
        """
        # Determine if image_path is a URL or local file
        if image_path.startswith(('http://', 'https://') ):
            response = requests.get(image_path)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path)
        
        # Determine output path if not provided
        if not output_path:
            filename = os.path.basename(image_path)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(self.storage_path, f"{name}_compressed{ext}")
        
        # Convert to RGB if RGBA (remove alpha channel)
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        
        # Save with compression
        img.save(output_path, 'JPEG', quality=quality, optimize=True)
        
        return output_path
    
    def extract_exif_data(self, image_path):
        """
        Extract EXIF metadata from an image
        
        Args:
            image_path: Local file path or URL of the image
            
        Returns:
            Dictionary of EXIF data
        """
        # Determine if image_path is a URL or local file
        if image_path.startswith(('http://', 'https://') ):
            response = requests.get(image_path)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path)
        
        # Extract EXIF data
        exif_data = {}
        if hasattr(img, '_getexif') and img._getexif() is not None:
            exif = img._getexif()
            # EXIF tags reference: https://exiv2.org/tags.html
            exif_tags = {
                36867: 'DateTimeOriginal',
                36868: 'DateTimeDigitized',
                37521: 'SubsecTimeOriginal',
                40962: 'PixelXDimension',
                40963: 'PixelYDimension',
                271: 'Make',
                272: 'Model',
                34853: 'GPSInfo'
            }
            
            for tag_id, tag_name in exif_tags.items() :
                if tag_id in exif:
                    exif_data[tag_name] = exif[tag_id]
        
        return exif_data
    
    def apply_filter(self, image_path, filter_type='enhance', output_path=None):
        """
        Apply a filter to an image
        
        Args:
            image_path: Local file path or URL of the image
            filter_type: Type of filter to apply ('enhance', 'grayscale', 'sepia')
            output_path: Path to save the filtered image (optional)
            
        Returns:
            Path to the filtered image
        """
        # Determine if image_path is a URL or local file
        if image_path.startswith(('http://', 'https://') ):
            response = requests.get(image_path)
            img = Image.open(BytesIO(response.content))
        else:
            img = Image.open(image_path)
        
        # Apply selected filter
        if filter_type == 'grayscale':
            img = ImageOps.grayscale(img)
        elif filter_type == 'sepia':
            # Simple sepia implementation
            img = img.convert('RGB')
            w, h = img.size
            pixels = img.load()
            for i in range(w):
                for j in range(h):
                    r, g, b = pixels[i, j]
                    tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                    tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                    tb = int(0.272 * r + 0.534 * g + 0.131 * b)
                    pixels[i, j] = (min(tr, 255), min(tg, 255), min(tb, 255))
        elif filter_type == 'enhance':
            # Simple enhancement (increase contrast and brightness)
            img = ImageOps.autocontrast(img)
        
        # Determine output path if not provided
        if not output_path:
            filename = os.path.basename(image_path)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(self.storage_path, f"{name}_{filter_type}{ext}")
        
        # Save filtered image
        img.save(output_path, optimize=True)
        
        return output_path
