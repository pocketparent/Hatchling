import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import { format } from 'date-fns';

// Common tags based on specifications
const commonTags = [
  'Milestone', 
  'Funny', 
  'Sweet Moment', 
  'Food', 
  'Sleep', 
  'Health', 
  'Family', 
  'Friends', 
  'Outing'
];

interface EntryModalProps {
  open: boolean;
  onClose: () => void;
  entry?: any; // In a real implementation, this would be properly typed
}

const EntryModal: React.FC<EntryModalProps> = ({ open, onClose, entry }) => {
  const isNewEntry = !entry;
  const [formData, setFormData] = useState({
    content: '',
    tags: [],
    date_of_memory: new Date(),
    privacy: 'private',
    media_url: null,
    transcription: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    if (entry) {
      setFormData({
        content: entry.content || '',
        tags: entry.tags || [],
        date_of_memory: entry.date_of_memory ? new Date(entry.date_of_memory) : new Date(),
        privacy: entry.privacy || 'private',
        media_url: entry.media_url || null,
        transcription: entry.transcription || null
      });
    } else {
      // Reset form for new entry
      setFormData({
        content: '',
        tags: [],
        date_of_memory: new Date(),
        privacy: 'private',
        media_url: null,
        transcription: null
      });
    }
  }, [entry, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date_of_memory: date
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setCustomTag('');
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call the API
      // const response = isNewEntry 
      //   ? await api.post('/entry', formData)
      //   : await api.patch(`/entry/${entry.entry_id}`, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (error) {
      console.error('Error saving entry:', error);
      // Would show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !entry.entry_id) return;
    
    if (window.confirm('Are you sure you want to delete this memory? This cannot be undone.')) {
      try {
        // In a real implementation, this would call the API
        // await api.delete(`/entry/${entry.entry_id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onClose();
      } catch (error) {
        console.error('Error deleting entry:', error);
        // Would show error message to user
      }
    }
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'private':
        return <LockIcon fontSize="small" />;
      case 'shared':
        return <PeopleIcon fontSize="small" />;
      case 'public':
        return <PublicIcon fontSize="small" />;
      default:
        return <LockIcon fontSize="small" />;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {isNewEntry ? 'New Memory' : 'Edit Memory'}
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* Date picker */}
            <DatePicker
              label="Date of Memory"
              value={formData.date_of_memory}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
            />
            
            {/* Content textarea */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="content"
              label="What happened?"
              name="content"
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
            />
            
            {/* Media preview if available */}
            {formData.media_url && (
              <Box mt={2} textAlign="center">
                {formData.media_url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img 
                    src={formData.media_url} 
                    alt="Memory" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                  />
                ) : formData.media_url.match(/\.(mp4|mov|avi)$/i) ? (
                  <video 
                    controls 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                  >
                    <source src={formData.media_url} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Media attached (not previewable)
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Tags section */}
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagRemove(tag)}
                  />
                ))}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Autocomplete
                    freeSolo
                    options={commonTags.filter(tag => !formData.tags.includes(tag))}
                    inputValue={customTag}
                    onInputChange={(event, newValue) => {
                      setCustomTag(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Add a tag"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button 
                    variant="outlined" 
                    onClick={() => handleTagAdd(customTag)}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {/* Privacy setting */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="privacy-label">Privacy</InputLabel>
              <Select
                labelId="privacy-label"
                id="privacy"
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
                startAdornment={getPrivacyIcon(formData.privacy)}
              >
                <MenuItem value="private">Private (Only you)</MenuItem>
                <MenuItem value="shared">Shared (Co-parents & caregivers)</MenuItem>
                <MenuItem value="public">Public (Anyone with link)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
          {!isNewEntry && (
            <Button 
              onClick={handleDelete} 
              color="error" 
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={!formData.content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EntryModal;
