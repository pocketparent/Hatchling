import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import {
  inviteCaregiver,
  getCaregivers,
  removeCaregiver,
  CaregiverInvite,
} from '../caregiverService';

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(), // Mock 'where' if you add checks later
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ seconds: 1234567890, nanoseconds: 0 })),
    fromDate: jest.fn((date) => ({ toDate: () => date })),
  },
  orderBy: jest.fn(),
  getFirestore: jest.fn(() => ({})), // Mock getFirestore if needed by db import
}));

// Mock the db import
jest.mock('../../config/firebase', () => ({
  db: {}, // Provide a mock db object
}));

describe('caregiverService', () => {
  const mockUserId = 'test-user-id';
  const mockCaregiverEmail = 'caregiver@example.com';
  const mockInviteId = 'test-invite-id';
  const mockCaregiversCollectionRef = { id: 'caregivers', path: `users/${mockUserId}/caregivers` };
  const mockCaregiverDocRef = { id: mockInviteId, path: `users/${mockUserId}/caregivers/${mockInviteId}` };

  beforeEach(() => {
    // Reset mocks before each test
    (collection as jest.Mock).mockClear();
    (addDoc as jest.Mock).mockClear();
    (query as jest.Mock).mockClear();
    (getDocs as jest.Mock).mockClear();
    (deleteDoc as jest.Mock).mockClear();
    (doc as jest.Mock).mockClear();
    (Timestamp.now as jest.Mock).mockClear();
    (orderBy as jest.Mock).mockClear();

    // Setup default mock implementations
    (collection as jest.Mock).mockReturnValue(mockCaregiversCollectionRef);
    (doc as jest.Mock).mockImplementation((db, path, id) => {
      if (path === 'users' && id === mockUserId) { // Simplified mock for doc path
        return { id: mockUserId, path: `users/${mockUserId}` };
      }
      if (id === mockInviteId) {
        return mockCaregiverDocRef;
      }
      return { id: 'unknown', path: 'unknown/path' };
    });
    (addDoc as jest.Mock).mockResolvedValue({ id: mockInviteId });
    (query as jest.Mock).mockImplementation((ref, ...constraints) => ({ ref, constraints })); // Return structure for verification
    (orderBy as jest.Mock).mockImplementation((field, direction) => ({ field, direction })); // Return structure for verification
  });

  describe('inviteCaregiver', () => {
    it('should call addDoc with correct parameters', async () => {
      const expectedTimestamp = { seconds: 1234567890, nanoseconds: 0 };
      (Timestamp.now as jest.Mock).mockReturnValue(expectedTimestamp);

      const resultId = await inviteCaregiver(mockUserId, mockCaregiverEmail);

      expect(collection).toHaveBeenCalledWith({}, 'users', mockUserId, 'caregivers');
      expect(addDoc).toHaveBeenCalledWith(mockCaregiversCollectionRef, {
        email: mockCaregiverEmail.toLowerCase(),
        invitedAt: expectedTimestamp,
        status: 'pending',
      });
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(resultId).toBe(mockInviteId);
    });

    it('should throw error for invalid email', async () => {
      await expect(inviteCaregiver(mockUserId, 'invalid-email')).rejects.toThrow(
        'Invalid email address provided.'
      );
      expect(addDoc).not.toHaveBeenCalled();
    });

    // Add test for already invited email if that check is implemented
  });

  describe('getCaregivers', () => {
    it('should call query and getDocs, then return formatted data', async () => {
      const mockTimestamp = { toDate: () => new Date() };
      const mockDocs = [
        {
          id: 'invite1',
          data: () => ({
            email: 'test1@example.com',
            invitedAt: mockTimestamp,
            status: 'pending',
          }),
        },
        {
          id: 'invite2',
          data: () => ({
            email: 'test2@example.com',
            invitedAt: mockTimestamp,
            status: 'accepted',
          }),
        },
      ];
      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs, forEach: mockDocs.forEach.bind(mockDocs) });

      const result = await getCaregivers(mockUserId);

      expect(collection).toHaveBeenCalledWith({}, 'users', mockUserId, 'caregivers');
      expect(orderBy).toHaveBeenCalledWith('invitedAt', 'desc');
      expect(query).toHaveBeenCalledWith(mockCaregiversCollectionRef, { field: 'invitedAt', direction: 'desc' });
      expect(getDocs).toHaveBeenCalledWith({ ref: mockCaregiversCollectionRef, constraints: [{ field: 'invitedAt', direction: 'desc' }] });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 'invite1', email: 'test1@example.com', invitedAt: mockTimestamp, status: 'pending' });
      expect(result[1]).toEqual({ id: 'invite2', email: 'test2@example.com', invitedAt: mockTimestamp, status: 'accepted' });
    });

    it('should return an empty array if no caregivers found', async () => {
      const mockDocs: any[] = [];
      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs, forEach: mockDocs.forEach.bind(mockDocs) });

      const result = await getCaregivers(mockUserId);

      expect(getDocs).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('removeCaregiver', () => {
    it('should call deleteDoc with the correct document reference', async () => {
      await removeCaregiver(mockUserId, mockInviteId);

      expect(doc).toHaveBeenCalledWith({}, 'users', mockUserId, 'caregivers', mockInviteId);
      expect(deleteDoc).toHaveBeenCalledWith(mockCaregiverDocRef);
      expect(deleteDoc).toHaveBeenCalledTimes(1);
    });
  });
});

