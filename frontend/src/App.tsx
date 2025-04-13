import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';

// Components
import JournalView from './components/JournalView';
import EntryModal from './components/EntryModal';
import Login from './components/Login';
import AccountCreation from './components/AccountCreation';
import Settings from './components/Settings';

// Theme configuration based on UI style guide
const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green from the spec
      light: '#80E27E',
      dark: '#087F23',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFC107', // Amber from the spec
      light: '#FFF350',
      dark: '#C79100',
      contrastText: '#000000',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Rounded buttons
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      // In a real implementation, this would verify the token with Firebase
      const token = localStorage.getItem('authToken');
      
      // For demo purposes, just check if token exists
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleOpenEntryModal = (entry = null) => {
    setCurrentEntry(entry);
    setShowEntryModal(true);
  };

  const handleCloseEntryModal = () => {
    setShowEntryModal(false);
    setCurrentEntry(null);
  };

  // Protected route component
  const ProtectedRoute = ({ children }: { children: ReactNode }): JSX.Element => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <>{children}</>;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/create-account" element={
            isAuthenticated ? <Navigate to="/" /> : <AccountCreation />
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <JournalView onOpenEntryModal={handleOpenEntryModal} />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Entry Modal (shown when needed) */}
        <EntryModal 
          open={showEntryModal} 
          onClose={handleCloseEntryModal} 
          entry={currentEntry} 
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;
