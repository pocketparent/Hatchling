import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Fab, IconButton, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

// Add this interface for the component props
interface JournalViewProps {
  onOpenEntryModal: (entry?: any) => void;
}

// Update the component definition to use the interface
const JournalView: React.FC<JournalViewProps> = ({ onOpenEntryModal }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    // Fetch entries from API
    const fetchEntries = async () => {
      try {
        // In a real implementation, this would fetch from your backend
        // For demo purposes, using mock data
        const mockEntries = [
          {
            id: '1',
            title: 'First steps!',
            content: 'Baby took their first steps today!',
            date: new Date(2023, 3, 15),
            images: [],
          },
          {
            id: '2',
            title: 'New word',
            content: 'Baby said "mama" for the first time!',
            date: new Date(2023, 3, 10),
            images: [],
          },
          {
            id: '3',
            title: 'Park visit',
            content: 'We went to the park and baby loved the swings.',
            date: new Date(2023, 3, 5),
            images: [],
          },
        ];
        
        setEntries(mockEntries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, []);

  const handleMenuOpen = (event, entry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  const handleEditEntry = () => {
    onOpenEntryModal(selectedEntry);
    handleMenuClose();
  };

  const handleDeleteEntry = () => {
    // In a real implementation, this would call your backend API
    setEntries(entries.filter(entry => entry.id !== selectedEntry.id));
    handleMenuClose();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Hatchling Journal
      </Typography>
      
      {loading ? (
        <Typography>Loading entries...</Typography>
      ) : (
        <Grid container spacing={3}>
          {entries.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <Card>
                <CardActionArea onClick={() => onOpenEntryModal(entry)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="h2">
                        {entry.title}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuOpen(e, entry);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </Typography>
                    <Typography variant="body1">
                      {entry.content.length > 100 
                        ? `${entry.content.substring(0, 100)}...` 
                        : entry.content}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => onOpenEntryModal()}
      >
        <AddIcon />
      </Fab>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditEntry}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteEntry}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default JournalView;
