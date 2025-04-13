import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Link, CircularProgress, Alert, Stepper,
  Step, StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define the props interface (if needed)
interface AccountCreationProps {
  // Add any props if needed
}

const AccountCreation: React.FC<AccountCreationProps> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const steps = ['Account Details', 'Contact Information', 'Confirmation'];

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call your registration API
      // For demo purposes, just simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store auth token (in a real app, this would come from your backend)
      localStorage.setItem('authToken', 'demo-token');
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={password !== confirmPassword}
              helperText={password !== confirmPassword ? "Passwords don't match" : ""}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="For SMS notifications (optional)"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              We'll use this number to send you SMS reminders to log memories.
              This is optional but recommended for the best experience.
            </Typography>
          </>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ready to Create Your Account
            </Typography>
            <Typography variant="body1" paragraph>
              You're all set to start capturing precious memories with Hatchling!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {email}<br />
              {phoneNumber && `Phone: ${phoneNumber}`}
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%', 
          maxWidth: 500,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create Account
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <form>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateAccount}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Account'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </form>
        
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
            underline="hover"
          >
            Already have an account? Sign in
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountCreation;
