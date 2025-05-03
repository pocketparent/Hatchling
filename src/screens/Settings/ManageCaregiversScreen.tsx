// File: src/screens/Settings/ManageCaregiversScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import {
  inviteCaregiver,
  getCaregivers,
  removeCaregiver,
  CaregiverInvite,
} from '../../services/caregiverService';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ManageCaregiversScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [caregivers, setCaregivers] = useState<CaregiverInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCaregivers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedCaregivers = await getCaregivers(user.uid);
      setCaregivers(fetchedCaregivers);
    } catch (err: any) {
      console.error('Error fetching caregivers:', err);
      setError('Failed to load caregivers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCaregivers();
  }, [fetchCaregivers]);

  const handleInvite = async () => {
    if (!user) return;
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setInviting(true);
    setError(null);
    try {
      await inviteCaregiver(user.uid, email.trim());
      setEmail(''); // Clear input on success
      await fetchCaregivers(); // Refresh the list
      Alert.alert('Success', 'Caregiver invited successfully.');
    } catch (err: any) {
      console.error('Error inviting caregiver:', err);
      setError(err.message || 'Failed to invite caregiver. Please try again.');
      Alert.alert('Invite Failed', err.message || 'Could not invite caregiver.');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (inviteId: string) => {
    if (!user) return;

    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this caregiver invite?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemovingId(inviteId);
            setError(null);
            try {
              await removeCaregiver(user.uid, inviteId);
              await fetchCaregivers(); // Refresh the list
              Alert.alert('Success', 'Caregiver removed.');
            } catch (err: any) {
              console.error('Error removing caregiver:', err);
              setError('Failed to remove caregiver. Please try again.');
              Alert.alert('Removal Failed', 'Could not remove caregiver.');
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: CaregiverInvite }) => (
    <View style={styles.caregiverItem}>
      <View style={styles.caregiverInfo}>
        <Text style={styles.emailText}>{item.email}</Text>
        <Text style={styles.statusText}>
          Status: {item.status} (Invited:{' '}
          {item.invitedAt?.toDate().toLocaleDateString()})
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
        disabled={removingId === item.id}
      >
        {removingId === item.id ? (
          <ActivityIndicator size="small" color={colors.error} />
        ) : (
          <Text style={styles.removeButtonText}>Remove</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Caregivers</Text>

      <View style={styles.inviteSection}>
        <TextInput
          style={styles.input}
          placeholder="Enter caregiver email to invite"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />
        <Button
          title={inviting ? 'Inviting...' : 'Invite Caregiver'}
          onPress={handleInvite}
          loading={inviting}
          disabled={inviting || loading}
          style={styles.inviteButton}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : caregivers.length === 0 ? (
        <Text style={styles.emptyText}>No caregivers invited yet.</Text>
      ) : (
        <FlatList
          data={caregivers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.lg,
    marginBottom: spacing.md,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  inviteSection: {
    marginBottom: spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    backgroundColor: colors.card,
  },
  inviteButton: {
    // Add specific styles if Button component doesn't handle it
  },
  loader: {
    marginTop: spacing.xl,
  },
  list: {
    flex: 1,
  },
  caregiverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  caregiverInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  emailText: {
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  statusText: {
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  removeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    // backgroundColor: colors.errorLight, // Optional background
    borderRadius: 4,
  },
  removeButtonText: {
    color: colors.error,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.sm,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: typography.fonts.regular,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.md,
  },
});

