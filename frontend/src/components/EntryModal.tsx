import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, 
  TextField, Button, Box, Typography, IconButton 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import MicIcon from '@mui/icons-material/Mic';
import EntryImageHandler from './EntryImageHandler';

// Define the JournalEntry interface (or import from types.ts)
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  images: (string | File)[];
}

// Define the props interface
interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  entry: JournalEntry | null;
}

const EntryModal: React.FC<EntryModalProps> = ({ open, onClose, entry }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [images, setImages] = useState<(string | File)[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showImageHandler, setShowImageHandler] = useState<boolean>(false);

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

  const handleSave = (): void => {
    // In a real implementation, this would save to your backend
    console.log('Saving entry:', { title, content, date, images });
    onClose();
  };

  const handleStartRecording = (): void => {
    // In a real implementation, this would start voice recording
    setIsRecording(true);
    // Mock recording for demo purposes
    setTimeout(() => {
      setIsRecording(false);
      setContent(content + " [Transcribed voice note would appear here]");
    }, 2000);
  };

  const handleImageUpload = (newImages: File[]): void => {
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
              onChange={(newDate: Date | null) => newDate && setDate(newDate)}
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="What happened?"
            multiline
            rows={6}
            fullWidth
            value={content}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
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
