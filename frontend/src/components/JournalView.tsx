import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, IconButton, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';

// Mock data for development
const mockEntries = [
  {
    entry_id: '1',
    content: 'First steps today! She was so excited and proud of herself.',
    tags: ['Milestone', 'First Steps'],
    date_of_memory: '2025-04-10',
    timestamp_created: '2025-04-10T15:30:00Z',
    privacy: 'private',
    media_url: null
  },
  {
    entry_id: '2',
    content: 'Laughed for the first time at the dog. It was the most beautiful sound!',
    tags: ['Milestone', 'First Laugh'],
    date_of_memory: '2025-04-08',
    timestamp_created: '2025-04-08T12:15:00Z',
    privacy: 'shared',
    media_url: 'https://example.com/photo1.jpg'
  },
  {
    entry_id: '3',
    content: 'Tried sweet potatoes for the first time. The face she made was priceless!',
    tags: ['Food', 'First Foods'],
    date_of_memory: '2025-04-05',
    timestamp_created: '2025-04-05T18:45:00Z',
    privacy: 'private',
    media_url: 'https://example.com/photo2.jpg'
  }
];

const JournalView = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from the API
    // const fetchEntries = async () => {
    //   try {
    //     const response = await api.get('/entries');
    //     setEntries(response.data.entries);
    //   } catch (error) {
    //     console.error('Error fetching entries:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    
    // Simulate API call with mock data
    setTimeout(() => {
      setEntries(mockEntries);
      setIsLoading(false);
    }, 1000);
    
    // fetchEntries();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const openEntryModal = (entry = null) => {
    // This would open the entry modal for viewing/editing an entry
    // or creating a new one if entry is null
    console.log('Open entry modal', entry);
  };

  // Filter entries based on search term and selected tags
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => entry.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Extract all unique tags from entries
  const allTags = [...new Set(entries.flatMap(entry => entry.tags))];

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return <Box p={3}><Typography>Loading journal entries...</Typography></Box>;
  }

  return (
    <Box sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
      {/* Header with search and filters */}
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1">
            Journal
          </Typography>
          <IconButton 
            color="primary" 
            aria-label="add entry"
            onClick={() => openEntryModal()}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleFilters}>
                  <FilterListIcon color={selectedTags.length > 0 ? "primary" : "inherit"} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />
        
        {/* Filter tags */}
        {showFilters && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {allTags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagClick(tag)}
                color={selectedTags.includes(tag) ? "primary" : "default"}
                variant={selectedTags.includes(tag) ? "filled" : "outlined"}
              />
            ))}
          </Box>
        )}
      </Box>
      
      {/* Entries list */}
      <Box sx={{ p: 2 }}>
        {filteredEntries.length === 0 ? (
          <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
            No entries found. Start capturing memories!
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredEntries.map(entry => (
              <Grid item xs={12} key={entry.entry_id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                  onClick={() => openEntryModal(entry)}
                >
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {formatDate(entry.date_of_memory)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {entry.content}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {entry.tags.map(tag => (
                        <Chip
                          key={`${entry.entry_id}-${tag}`}
                          label={tag}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagClick(tag);
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default JournalView;
