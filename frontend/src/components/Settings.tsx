import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Switch, 
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('co_parent');
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'Jane Smith',
    phone_number: '+1 (555) 123-4567',
    email: 'jane@example.com',
    default_privacy: 'private',
    nudge_opt_in: true,
    nudge_frequency: 'occasionally',
    subscription_status: 'trial',
    trial_end_date: '2025-04-26'
  });

  // Mock caregivers
  const [caregivers, setCaregivers] = useState([
    { id: '1', name: 'John Smith', role: 'co_parent', phone: '+1 (555) 987-6543' },
    { id: '2', name: 'Mary Johnson', role: 'caregiver', phone: '+1 (555) 456-7890' }
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserDataChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveProfile = () => {
    // In a real implementation, this would call the API
    console.log('Saving profile:', userData);
    // Show success message
  };

  const handleOpenInviteDialog = () => {
    setInviteDialogOpen(true);
  };

  const handleCloseInviteDialog = () => {
    setInviteDialogOpen(false);
    setInvitePhone('');
    setInviteRole('co_parent');
  };

  const handleSendInvite = () => {
    // In a real implementation, this would call the API
    console.log('Sending invite to:', invitePhone, 'with role:', inviteRole);
    handleCloseInviteDialog();
    // Show success message
  };

  const handleRemoveCaregiver = (id) => {
    // In a real implementation, this would call the API
    setCaregivers(caregivers.filter(caregiver => caregiver.id !== id));
  };

  const handleOpenDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(true);
  };

  const handleCloseDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(false);
  };

  const handleDeleteAccount = () => {
    // In a real implementation, this would call the API
    console.log('Deleting account');
    handleCloseDeleteAccountDialog();
    // Redirect to login page
  };

  const handleManageSubscription = () => {
    // In a real implementation, this would redirect to Stripe customer portal
    console.log('Redirecting to subscription management');
  };

  const formatTrialEndDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        
        <Paper sx={{ mt: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Profile" />
            <Tab label="Co-Parents & Caregivers" />
            <Tab label="Subscription" />
          </Tabs>
          
          {/* Profile Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Profile
              </Typography>
              
              <TextField
                margin="normal"
                fullWidth
                label="Name"
                name="name"
                value={userData.name}
                onChange={handleUserDataChange}
              />
              
              <TextField
                margin="normal"
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={userData.phone_number}
                disabled
                helperText="Phone number cannot be changed"
              />
              
              <TextField
                margin="normal"
                fullWidth
                label="Email (optional)"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="default-privacy-label">Default Privacy Setting</InputLabel>
                <Select
                  labelId="default-privacy-label"
                  name="default_privacy"
                  value={userData.default_privacy}
                  onChange={handleUserDataChange}
                >
                  <MenuItem value="private">Private (Only me)</MenuItem>
                  <MenuItem value="shared">Shared (Co-parents & caregivers)</MenuItem>
                  <MenuItem value="public">Public (Anyone with link)</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="nudge_opt_in"
                      checked={userData.nudge_opt_in}
                      onChange={handleUserDataChange}
                      color="primary"
                    />
                  }
                  label="Send me reminders to log memories"
                />
              </Box>
              
              {userData.nudge_opt_in && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="nudge-frequency-label">Reminder Frequency</InputLabel>
                  <Select
                    labelId="nudge-frequency-label"
                    name="nudge_frequency"
                    value={userData.nudge_frequency}
                    onChange={handleUserDataChange}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="occasionally">Occasionally</MenuItem>
                  </Select>
                </FormControl>
              )}
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleOpenDeleteAccountDialog}
                >
                  Delete Account
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Co-Parents & Caregivers Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Co-Parents & Caregivers
                </Typography>
                
                <Button 
                  variant="contained" 
                  startIcon={<PersonAddIcon />}
                  onClick={handleOpenInviteDialog}
                >
                  Invite
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Invite people to view and contribute to your child's memories.
              </Typography>
              
              <List>
                {caregivers.map((person) => (
                  <React.Fragment key={person.id}>
                    <ListItem>
                      <ListItemText
                        primary={person.name}
                        secondary={
                          <>
                            {person.phone}
                            <br />
                            {person.role === 'co_parent' ? 'Co-Parent (can edit)' : 'Caregiver (view only)'}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleRemoveCaregiver(person.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
              
              {caregivers.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  No co-parents or caregivers added yet
                </Typography>
              )}
            </Box>
          )}
          
          {/* Subscription Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Subscription
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Current Plan
                </Typography>
                
                <Typography variant="h5" color="primary" gutterBottom>
                  {userData.subscription_status === 'trial' ? 'Free Trial' : 
                   userData.subscription_status === 'active' ? 'Premium' : 'Inactive'}
                </Typography>
                
                {userData.subscription_status === 'trial' && (
                  <Typography variant="body2" color="text.secondary">
                    Your trial ends on {formatTrialEndDate(userData.trial_end_date)}
                  </Typography>
                )}
              </Paper>
              
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                onClick={handleManageSubscription}
              >
                {userData.subscription_status === 'trial' ? 'Subscribe Now' : 'Manage Subscription'}
              </Button>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {userData.subscription_status === 'trial' 
                  ? 'Subscribe to continue using Hatchling after your trial ends.' 
                  : 'Manage your subscription, payment methods, and billing information.'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
      
      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onClose={handleCloseInviteDialog}>
        <DialogTitle>Invite Co-Parent or Caregiver</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the phone number of the person you'd like to invite.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Phone Number"
            type="tel"
            fullWidth
            variant="outlined"
            value={invitePhone}
            onChange={(e) => setInvitePhone(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="invite-role-label">Role</InputLabel>
            <Select
              labelId="invite-role-label"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <MenuItem value="co_parent">Co-Parent (can edit)</MenuItem>
              <MenuItem value="caregiver">Caregiver (view only)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog}>Cancel</Button>
          <Button 
            onClick={handleSendInvite} 
            variant="contained"
            disabled={!invitePhone.trim()}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog
        open={deleteAccountDialogOpen}
        onClose={handleCloseDeleteAccountDialog}
      >
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your account and all your data. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteAccountDialog}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
