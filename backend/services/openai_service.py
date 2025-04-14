import os
from dotenv import load_dotenv

# Import the new OpenAI client
from openai import OpenAI

# Load environment variables
load_dotenv()

class OpenAIService:
    """
    Service class for OpenAI operations including voice transcription and tag suggestions.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(OpenAIService, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize OpenAI client with API key from environment variables."""
        try:
            # Get OpenAI API key from environment variables
            api_key = os.getenv("OPENAI_API_KEY")
            
            # Initialize the client with the API key
            self.client = OpenAI(api_key=api_key)
            
            print("OpenAI service initialized successfully")
        except Exception as e:
            print(f"Error initializing OpenAI service: {e}")
            self.client = None
            # In production, would use proper logging
    
    def transcribe_audio(self, audio_file_path):
        """
        Transcribe audio file using OpenAI Whisper.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Transcription text if successful, None otherwise
        """
        if not self.client:
            return None
            
        try:
            with open(audio_file_path, "rb") as audio_file:
                # Updated API call for OpenAI v1.0+
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file
                )
            
            return transcript.text
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            return None
    
    def suggest_tags(self, content):
        """
        Suggest tags for entry content using OpenAI.
        
        Args:
            content: Entry text content
            
        Returns:
            List of suggested tags if successful, empty list otherwise
        """
        if not self.client:
            return []
            
        try:
            # Define common tag categories based on specifications
            common_tags = ["Milestone", "Funny", "Sweet Moment", "Food", "Sleep", "Health", "Family", "Friends", "Outing"]
            
            # Create prompt for tag suggestion
            prompt = f"""
            Based on the following parenting memory, suggest up to 3 relevant tags from this list: {', '.join(common_tags)}.
            If none of these tags fit, suggest up to 2 custom tags that would be appropriate.
            Return only the tag names separated by commas, nothing else.
            
            Memory: {content}
            """
            
            # Updated API call for OpenAI v1.0+
            response = self.client.completions.create(
                model="gpt-3.5-turbo-instruct",  # Replacement for text-davinci-003
                prompt=prompt,
                max_tokens=50,
                temperature=0.3
            )
            
            # Parse response to get tags
            suggested_tags = response.choices[0].text.strip().split(',')
            suggested_tags = [tag.strip() for tag in suggested_tags if tag.strip()]
            
            return suggested_tags
        except Exception as e:
            print(f"Error suggesting tags: {e}")
            return []
