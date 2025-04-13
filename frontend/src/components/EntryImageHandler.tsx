import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, IconButton, Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Define the props interface
interface EntryImageHandlerProps {
  open: boolean;
  onClose: () => void;
  onUpload: (images: File[]) => void;
}

const EntryImageHandler: React.FC<EntryImageHandlerProps> = ({ open, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Add cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Revoke all object URLs when component unmounts
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files) as File[];
      setSelectedFiles([...selectedFiles, ...filesArray]);
      
      // Create previews
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number): void => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleUpload = (): void => {
    onUpload(selectedFiles);
    // Clear selected files after upload
    setSelectedFiles([]);
    // Revoke object URLs to avoid memory leaks
    previews.forEach(preview => URL.revokeObjectURL(preview));
    setPreviews([]);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Add Images
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ py: 5 }}
          >
            Select Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
        
        {previews.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Selected Images ({previews.length})
            </Typography>
            <Grid container spacing={2}>
              {previews.map((preview, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={preview}
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleUpload} 
          variant="contained" 
          color="primary"
          disabled={selectedFiles.length === 0}
        >
          Add to Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EntryImageHandler;
