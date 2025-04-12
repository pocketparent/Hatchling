import React, { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import { Edit as EditIcon, FilterAlt as FilterIcon } from '@mui/icons-material';
import ImageEditor from './ImageEditor';

// This component will be integrated into EntryModal.tsx
const EntryImageHandler = ({ imageUrl, onImageUpdate }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  
  const handleOpenEditor = () => {
    setEditorOpen(true);
  };
  
  const handleCloseEditor = () => {
    setEditorOpen(false);
  };
  
  const handleSaveImage = (imageSettings) => {
    if (!imageSettings) {
      // User canceled
      handleCloseEditor();
      return;
    }
    
    // In a real implementation, this would call the backend API
    // to process the image with the selected settings
    fetch('/api/image/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageSettings.imageUrl,
        operations: [
          {
            type: 'filter',
            filter_type: imageSettings.filter === 'none' ? 'enhance' : imageSettings.filter
          },
          {
            type: 'compress',
            quality: imageSettings.quality
          }
        ]
      })
    })
    .then(response => response.json())
    .then(data => {
      // Update the parent component with the processed image URL
      if (data.results && data.results.filtered_url) {
        onImageUpdate(data.results.filtered_url);
      }
      handleCloseEditor();
    })
    .catch(error => {
      console.error('Error processing image:', error);
      handleCloseEditor();
    });
  };
  
  return (
    <Box sx={{ position: 'relative' }}>
      {imageUrl && (
        <>
          <Box 
            component="img" 
            src={imageUrl} 
            alt="Memory" 
            sx={{ 
              width: '100%', 
              borderRadius: 2,
              maxHeight: '300px',
              objectFit: 'contain'
            }} 
          />
          
          <Box sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            display: 'flex', 
            gap: 1,
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: 1,
            padding: '2px'
          }}>
            <IconButton 
              size="small" 
              onClick={handleOpenEditor}
              aria-label="Edit image"
              sx={{ backgroundColor: 'white' }}
            >
              <FilterIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={handleOpenEditor}
              aria-label="Apply filters"
              sx={{ backgroundColor: 'white' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </>
      )}
      
      {!imageUrl && (
        <Button 
          variant="outlined" 
          component="label" 
          fullWidth
          sx={{ height: '120px', borderStyle: 'dashed' }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                // In a real implementation, this would upload the file
                // and then set the returned URL
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target) {
                    onImageUpdate(event.target.result);
                  }
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </Button>
      )}
      
      <Dialog 
        open={editorOpen} 
        onClose={handleCloseEditor}
        maxWidth="sm"
        fullWidth
      >
        <ImageEditor 
          imageUrl={imageUrl} 
          onSave={handleSaveImage} 
        />
      </Dialog>
    </Box>
  );
};

export default EntryImageHandler;
