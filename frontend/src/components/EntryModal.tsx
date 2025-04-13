import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, IconButton 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import MicIcon from '@mui/icons-material/Mic';
import EntryImageHandler from './EntryImageHandler';

// Define the props interface
interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  entry: any | null; // Replace with a more specific type if available
}

const EntryModal: React.FC<EntryModalProps> = ({ open, onClose, entry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showImageHandler, setShowImageHandler] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title || '');
      setContent(entry.content || '');
      setDate(entry.date ? new Date(entry.date) : new Date());
      setImages(entry.images || []);
    } else {
      // Reset form for new entry
      setTitle('');
      setContent('');
      setDate(new Date());
      setImages([]);
    }
  }, [entry, open]);

  const handleSave = () => {
    // In a real implementation, this would save to your backend
    console.log('Saving entry:', { title, content, date, images });
    onClose();
  };

  const handleStartRecording = () => {
    // In a real implementation, this would start voice recording
    setIsRecording(true);
    // Mock recording for demo purposes
    setTimeout(() => {
      setIsRecording(false);
      setContent(content + " [Transcribed voice note would appear here]");
    }, 2000);
  };

  const handleImageUpload = (newImages) => {
    setImages([...images, ...newImages]);
    setShowImageHandler(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {entry ? 'Edit Memory' : 'New Memory'}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="What happened?"
            multiline
            rows={6}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          {images.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Images ({images.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {images.map((img, index) => (
                  <Box 
                    key={index}
                    component="img"
                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={<ImageIcon />}
              variant="outlined"
              onClick={() => setShowImageHandler(true)}
            >
              Add Images
            </Button>
            <Button
              startIcon={<MicIcon />}
              variant="outlined"
              color={isRecording ? "secondary" : "primary"}
              onClick={handleStartRecording}
              disabled={isRecording}
            >
              {isRecording ? "Recording..." : "Voice Note"}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      <EntryImageHandler 
        open={showImageHandler}
        onClose={() => setShowImageHandler(false)}
        onUpload={handleImageUpload}
      />
    </>
  );
};

export default EntryModal;
