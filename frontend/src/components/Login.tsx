import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Container,
  CircularProgress
} from '@mui/material';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // In a real implementation, this would call the API
      // const response = await api.post('/auth/login', { phone_number: phoneNumber });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessageSent(true);
      localStorage.setItem('pendingVerification', phoneNumber);
    } catch (err) {
      setError('Failed to send login link. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    setError('');
  };

  const handleTryDifferent = () => {
    setMessageSent(false);
    setPhoneNumber('');
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Hatchling
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Parenthood is wild. We'll help you remember it.
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          {!messageSent ? (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" gutterBottom>
                Sign in or create an account
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone_number"
                label="Phone Number"
                name="phone_number"
                autoComplete="tel"
                autoFocus
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                error={!!error}
                helperText={error}
                disabled={isSubmitting}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send Login Link'
                )}
              </Button>
              
              <Typography variant="body2" color="text.secondary" align="center">
                We'll text you a secure login link that's valid for 10 minutes
              </Typography>
            </Box>
          ) : (
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom>
                Check your phone
              </Typography>
              
              <Typography variant="body1" paragraph>
                We've sent a login link to {phoneNumber}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                The link will expire in 10 minutes
              </Typography>
              
              <Button 
                variant="outlined"
                onClick={handleTryDifferent}
                sx={{ mt: 2 }}
              >
                Try a different number
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
