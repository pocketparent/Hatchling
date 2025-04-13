import React, { useState } from 'react';
import { 
  Box, Typography, Switch, FormControlLabel, 
  TextField, Button, Paper, Select,
  MenuItem, FormControl, InputLabel, Alert,
  SelectChangeEvent
} from '@mui/material';

// Use React.FC directly without empty interface
const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [reminderFrequency, setReminderFrequency] = useState<string>('weekly');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSaveSettings = (): void => {
    // In a real implementation, this would save to your backend
    console.log('Saving settings:', {
      notificationsEnabled,
      reminderFrequency,
      phoneNumber
    });
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotificationsEnabled(e.target.checked)}
              color="primary"
            />
          }
          label="Enable reminder notifications"
        />
        
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth disabled={!notificationsEnabled}>
            <InputLabel>Reminder Frequency</InputLabel>
            <Select
              value={reminderFrequency}
              onChange={(e: SelectChangeEvent) => setReminderFrequency(e.target.value)}
              label="Reminder Frequency"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography>
        <TextField
          label="Phone Number"
          fullWidth
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
          placeholder="For SMS notifications"
          margin="normal"
        />
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
          Change Password
        </Button>
        <Button variant="outlined" color="error">
          Delete Account
        </Button>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </Box>
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Settings saved successfully!
        </Alert>
      )}
    </Box>
  );
};

export default Settings;
