import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar, 
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AccountCreation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    default_privacy: 'private',
    nudge_opt_in: true,
    nudge_frequency: 'occasionally'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get phone number from URL query params or localStorage
  const queryParams = new URLSearchParams(window.location.search);
  const phoneNumber = queryParams.get('phone') || localStorage.getItem('verifiedPhone') || '';

  // Set phone number in form data if available
  useState(() => {
    if (phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phone_number: phoneNumber
      }));
    }
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real implementation, this would call the API
      // const response = await api.post('/auth/create-account', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store auth token and redirect to journal
      // localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authToken', 'mock-token');
      window.location.href = '/';
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Account creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Your Hatchling Account
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mt: 1, mb: 3 }}>
          Parenthood is wild. We'll help you remember it.
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!error && !formData.name}
              helperText={!formData.name && error ? 'Name is required' : ''}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone_number"
              label="Phone Number"
              name="phone_number"
              autoComplete="tel"
              value={formData.phone_number}
              onChange={handleChange}
              disabled={!!phoneNumber}
              error={!!error && !formData.phone_number}
              helperText={!formData.phone_number && error ? 'Phone number is required' : ''}
            />
            
            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Default Privacy Setting
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                name="default_privacy"
                value={formData.default_privacy}
                onChange={handleChange}
              >
                <FormControlLabel 
                  value="private" 
                  control={<Radio />} 
                  label="Private (Only me)" 
                />
                <FormControlLabel 
                  value="shared" 
                  control={<Radio />} 
                  label="Shared (Co-parents & caregivers)" 
                />
                <FormControlLabel 
                  value="public" 
                  control={<Radio />} 
                  label="Public (Anyone with link)" 
                />
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="nudge_opt_in"
                    checked={formData.nudge_opt_in}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Send me occasional reminders to log memories"
              />
            </Box>
            
            {formData.nudge_opt_in && (
              <FormControl component="fieldset" sx={{ mt: 1, ml: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  How often?
                </Typography>
                <RadioGroup
                  name="nudge_frequency"
                  value={formData.nudge_frequency}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value="daily" 
                    control={<Radio size="small" />} 
                    label="Daily" 
                  />
                  <FormControlLabel 
                    value="weekly" 
                    control={<Radio size="small" />} 
                    label="Weekly" 
                  />
                  <FormControlLabel 
                    value="occasionally" 
                    control={<Radio size="small" />} 
                    label="Occasionally" 
                  />
                </RadioGroup>
              </FormControl>
            )}
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccountCreation;
