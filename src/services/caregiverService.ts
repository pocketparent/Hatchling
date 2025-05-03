// File: src/services/caregiverService.ts
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Firestore Schema for Caregiver Invites:
 * /users/{userId}/caregivers/{inviteId}
 *  - email: string (invited email)
 *  - invitedAt: Timestamp
 *  - status: 'pending' | 'accepted' (MVP focuses on 'pending')
 *  // - acceptedAt?: Timestamp (Future)
 *  // - role?: 'admin' | 'editor' | 'viewer' (Future)
 */

export interface CaregiverInvite {
  id: string; // Firestore document ID
  email: string;
  invitedAt: Timestamp;
  status: 'pending' | 'accepted';
}

const caregiversCollection = (userId: string) =>
  collection(db, 'users', userId, 'caregivers');

/**
 * Invites a new caregiver by adding their email to the subcollection.
 * @param userId - The ID of the user sending the invite.
 * @param email - The email address of the caregiver to invite.
 */
export async function inviteCaregiver(userId: string, email: string): Promise<string> {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address provided.');
  }

  // Optional: Check if email is already invited or is the user's own email
  // const existingInvites = await getCaregivers(userId);
  // if (existingInvites.some(invite => invite.email.toLowerCase() === email.toLowerCase())) {
  //   throw new Error('This email address has already been invited.');
  // }
  // Add check for user's own email if necessary

  const docRef = await addDoc(caregiversCollection(userId), {
    email: email.toLowerCase(), // Store emails consistently
    invitedAt: Timestamp.now(),
    status: 'pending' as const,
  });
  return docRef.id;
}

/**
 * Fetches the list of caregivers invited by the user.
 * @param userId - The ID of the user whose caregivers to fetch.
 * @returns An array of CaregiverInvite objects.
 */
export async function getCaregivers(userId: string): Promise<CaregiverInvite[]> {
  const q = query(caregiversCollection(userId), orderBy('invitedAt', 'desc'));
  const snapshot = await getDocs(q);

  const caregivers: CaregiverInvite[] = [];
  snapshot.forEach((doc) => {
    caregivers.push({ id: doc.id, ...doc.data() } as CaregiverInvite);
  });

  return caregivers;
}

/**
 * Removes a caregiver invite.
 * @param userId - The ID of the user who owns the invite.
 * @param inviteId - The Firestore document ID of the invite to remove.
 */
export async function removeCaregiver(userId: string, inviteId: string): Promise<void> {
  const docRef = doc(db, 'users', userId, 'caregivers', inviteId);
  await deleteDoc(docRef);
}

