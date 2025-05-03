import { doc, setDoc } from 'firebase/firestore';
import { updateSettings } from '../settingsService';
import { Timestamp } from 'firebase/firestore';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getFirestore: jest.fn(() => ({})), // Mock getFirestore if needed by db import
  Timestamp: {
    fromDate: jest.fn((date) => ({ // Mock Timestamp.fromDate
      toDate: () => date, // Mock toDate method for verification if needed
      // Add other Timestamp properties/methods if your code uses them
    })),
  },
}));

// Mock the db import if it's complex, otherwise the above might be enough
jest.mock('../../config/firebase', () => ({
  db: {}, // Provide a mock db object
}));

describe('settingsService', () => {
  const mockUid = 'test-user-123';
  const mockPrefsDocRef = { id: 'prefs', path: `users/${mockUid}/settings/prefs` };

  beforeEach(() => {
    // Reset mocks before each test
    (doc as jest.Mock).mockClear();
    (setDoc as jest.Mock).mockClear();
    (Timestamp.fromDate as jest.Mock).mockClear();

    // Setup default mock return values
    (doc as jest.Mock).mockReturnValue(mockPrefsDocRef);
  });

  describe('updateSettings', () => {
    it('should call setDoc with correct parameters and merge option', async () => {
      const settingsData = {
        childFirstName: 'Test Baby',
        childSex: 'girl' as const,
      };

      await updateSettings(mockUid, settingsData);

      // Check if doc was called correctly to get the document reference
      expect(doc).toHaveBeenCalledWith({}, 'users', mockUid, 'settings', 'prefs'); // Assuming db is the first arg

      // Check if setDoc was called correctly
      expect(setDoc).toHaveBeenCalledWith(mockPrefsDocRef, settingsData, { merge: true });
      expect(setDoc).toHaveBeenCalledTimes(1);
    });

    it('should handle Timestamp conversion correctly', async () => {
      const testDate = new Date(2024, 5, 15);
      const mockTimestamp = { seconds: 1718409600, nanoseconds: 0 }; // Example timestamp
      (Timestamp.fromDate as jest.Mock).mockReturnValue(mockTimestamp);

      const settingsData = {
        childDOB: testDate, // Pass Date object
      };

      // Cast settingsData to Partial<UserSettings> if needed by updateSettings signature
      await updateSettings(mockUid, settingsData as any);

      expect(Timestamp.fromDate).toHaveBeenCalledWith(testDate);
      expect(setDoc).toHaveBeenCalledWith(
        mockPrefsDocRef,
        { childDOB: mockTimestamp }, // Expect the mocked Timestamp object
        { merge: true }
      );
      expect(setDoc).toHaveBeenCalledTimes(1);
    });
  });

  // Add tests for getSettings if needed
});

