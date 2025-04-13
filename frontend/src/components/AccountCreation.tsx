import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Link, CircularProgress, Alert, Stepper,
  Step, StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// No empty interface - use React.FC directly
const AccountCreation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();
  const steps = ['Account Details', 'Contact Information', 'Review'];
  
  const handleNext = (): void => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = (): void => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleCreateAccount = async (): Promise<void> => {
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would call your authentication API
      // For demo purposes, just simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const getStepContent = (step: number): JSX.Element => {
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
              helperText={password !== confirmPassword ? "Passwords don&apos;t match" : ""}
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
              We&apos;ll use this number to send you SMS reminders to log memories.
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
              You&apos;re all set to start capturing precious memories with Hatchling!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {email}<br />
              {phoneNumber && `Phone: ${phoneNumber}`}
            </Typography>
          </Box>
        );
      default:
        return <Typography>Unknown step</Typography>;
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
