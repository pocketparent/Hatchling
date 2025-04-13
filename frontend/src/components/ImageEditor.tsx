import React, { useState } from 'react';
import { Box, Button, Slider, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

// Define interfaces for props and other types
interface ImageEditorProps {
  imageUrl: string;
  onSave: (result: ImageEditResult | null) => void;
}

interface ImageEditResult {
  filter: string;
  quality: number;
  imageUrl: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave }) => {
  const [filter, setFilter] = useState<string>('none');
  const [quality, setQuality] = useState<number>(85);
  const [preview, setPreview] = useState<string>(imageUrl);

  // This would be replaced with actual API calls in production
  const applyFilter = (filterType: string): void => {
    // In a real implementation, this would call the backend API
    // For demo purposes, we're just updating the state
    setFilter(filterType);
    setPreview(`${imageUrl}?filter=${filterType}`);
  };

  const handleFilterChange = (event: SelectChangeEvent): void => {
    const newFilter = event.target.value;
    applyFilter(newFilter);
  };

  const handleQualityChange = (_event: Event, newValue: number | number[]): void => {
    setQuality(newValue as number);
  };

  const handleSave = (): void => {
    // In a real implementation, this would send the settings to the backend
    onSave({
      filter,
      quality,
      imageUrl
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Edit Image
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <img 
          src={preview} 
          alt="Preview" 
          style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
        />
      </Box>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="filter-select-label">Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          id="filter-select"
          value={filter}
          label="Filter"
          onChange={handleFilterChange}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="enhance">Enhance</MenuItem>
          <MenuItem value="grayscale">Grayscale</MenuItem>
          <MenuItem value="sepia">Sepia</MenuItem>
        </Select>
      </FormControl>
      
      <Box sx={{ mb: 3 }}>
        <Typography id="quality-slider" gutterBottom>
          Image Quality: {quality}%
        </Typography>
        <Slider
          aria-labelledby="quality-slider"
          value={quality}
          onChange={handleQualityChange}
          min={10}
          max={100}
          step={5}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={() => onSave(null)}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ImageEditor;
