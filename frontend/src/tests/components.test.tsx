import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JournalView from '../components/JournalView';
import EntryModal from '../components/EntryModal';
import Login from '../components/Login';
import AccountCreation from '../components/AccountCreation';
import Settings from '../components/Settings';

// Mock data
const mockEntries = [
  {
    entry_id: '1',
    content: 'First steps today!',
    tags: ['Milestone', 'First Steps'],
    date_of_memory: '2025-04-10',
    timestamp_created: '2025-04-10T15:30:00Z',
    privacy: 'private'
  },
  {
    entry_id: '2',
    content: 'Laughed for the first time at the dog.',
    tags: ['Milestone', 'First Laugh'],
    date_of_memory: '2025-04-08',
    timestamp_created: '2025-04-08T12:15:00Z',
    privacy: 'shared'
  }
];

// Mock functions
const mockOpenEntryModal = jest.fn();
const mockCloseEntryModal = jest.fn();

// JournalView Tests
describe('JournalView Component', () => {
  beforeEach(() => {
    // Mock implementation to provide entries
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ entries: mockEntries, total: mockEntries.length }),
        ok: true
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders journal title', () => {
    render(<JournalView onOpenEntryModal={mockOpenEntryModal} />);
    expect(screen.getByText('Journal')).toBeInTheDocument();
  });

  test('displays entries when loaded', async () => {
    render(<JournalView onOpenEntryModal={mockOpenEntryModal} />);
    
    // Wait for entries to load
    await waitFor(() => {
      expect(screen.getByText('First steps today!')).toBeInTheDocument();
      expect(screen.getByText('Laughed for the first time at the dog.')).toBeInTheDocument();
    });
  });

  test('filters entries when searching', async () => {
    render(<JournalView onOpenEntryModal={mockOpenEntryModal} />);
    
    // Wait for entries to load
    await waitFor(() => {
      expect(screen.getByText('First steps today!')).toBeInTheDocument();
    });
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search memories...');
    fireEvent.change(searchInput, { target: { value: 'laugh' } });
    
    // Check that only matching entry is shown
    expect(screen.queryByText('First steps today!')).not.toBeInTheDocument();
    expect(screen.getByText('Laughed for the first time at the dog.')).toBeInTheDocument();
  });

  test('calls onOpenEntryModal when add button is clicked', async () => {
    render(<JournalView onOpenEntryModal={mockOpenEntryModal} />);
    
    // Click add button
    const addButton = screen.getByLabelText('add entry');
    fireEvent.click(addButton);
    
    expect(mockOpenEntryModal).toHaveBeenCalled();
  });
});

// EntryModal Tests
describe('EntryModal Component', () => {
  test('renders correctly for new entry', () => {
    render(
      <EntryModal 
        open={true} 
        onClose={mockCloseEntryModal} 
        entry={null} 
      />
    );
    
    expect(screen.getByText('New Memory')).toBeInTheDocument();
    expect(screen.getByLabelText('What happened?')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  test('renders correctly for existing entry', () => {
    render(
      <EntryModal 
        open={true} 
        onClose={mockCloseEntryModal} 
        entry={mockEntries[0]} 
      />
    );
    
    expect(screen.getByText('Edit Memory')).toBeInTheDocument();
    expect(screen.getByLabelText('What happened?')).toHaveValue('First steps today!');
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <EntryModal 
        open={true} 
        onClose={mockCloseEntryModal} 
        entry={null} 
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockCloseEntryModal).toHaveBeenCalled();
  });
});

// Login Tests
describe('Login Component', () => {
  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome to Hatchling')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Send Login Link')).toBeInTheDocument();
  });

  test('shows error when submitting empty form', () => {
    render(<Login />);
    
    const submitButton = screen.getByText('Send Login Link');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter your phone number')).toBeInTheDocument();
  });

  test('shows confirmation when login link is sent', async () => {
    render(<Login />);
    
    // Fill in phone number
    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: '5551234567' } });
    
    // Submit form
    const submitButton = screen.getByText('Send Login Link');
    fireEvent.click(submitButton);
    
    // Wait for confirmation message
    await waitFor(() => {
      expect(screen.getByText('Check your phone')).toBeInTheDocument();
      expect(screen.getByText(/We've sent a login link to/)).toBeInTheDocument();
    });
  });
});

// AccountCreation Tests
describe('AccountCreation Component', () => {
  test('renders account creation form', () => {
    render(<AccountCreation />);
    
    expect(screen.getByText('Create Your Hatchling Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  test('shows error when submitting without name', () => {
    render(<AccountCreation />);
    
    // Submit form without filling name
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  });

  test('handles form submission with valid data', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    render(<AccountCreation />);
    
    // Fill form
    const nameInput = screen.getByLabelText('Your Name');
    const phoneInput = screen.getByLabelText('Phone Number');
    
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(phoneInput, { target: { value: '5551234567' } });
    
    // Submit form
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', expect.any(String));
    });
  });
});

// Settings Tests
describe('Settings Component', () => {
  test('renders settings tabs', () => {
    render(<Settings />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Co-Parents & Caregivers')).toBeInTheDocument();
    expect(screen.getByText('Subscription')).toBeInTheDocument();
  });

  test('displays profile information', () => {
    render(<Settings />);
    
    // Profile tab should be active by default
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('switches to co-parents tab when clicked', () => {
    render(<Settings />);
    
    // Click on co-parents tab
    const coParentsTab = screen.getByText('Co-Parents & Caregivers');
    fireEvent.click(coParentsTab);
    
    expect(screen.getByText('Invite')).toBeInTheDocument();
  });

  test('switches to subscription tab when clicked', () => {
    render(<Settings />);
    
    // Click on subscription tab
    const subscriptionTab = screen.getByText('Subscription');
    fireEvent.click(subscriptionTab);
    
    expect(screen.getByText('Current Plan')).toBeInTheDocument();
  });

  test('opens invite dialog when invite button is clicked', () => {
    render(<Settings />);
    
    // Click on co-parents tab
    const coParentsTab = screen.getByText('Co-Parents & Caregivers');
    fireEvent.click(coParentsTab);
    
    // Click invite button
    const inviteButton = screen.getByText('Invite');
    fireEvent.click(inviteButton);
    
    expect(screen.getByText('Invite Co-Parent or Caregiver')).toBeInTheDocument();
  });
});
