// File: src/components/modals/EntryModal/index.tsx
import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Button } from '../../common/Button'
import { colors } from '../../../theme/colors'

interface EntryModalProps {
  title: string
  accent: string
  onClose: () => void
  onSave: () => void
  children: React.ReactNode
}

export const EntryModal: React.FC<EntryModalProps> = ({
  title,
  accent,
  onClose,
  onSave,
  children,
}) => (
  <Modal transparent animationType="fade">
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay} />
    </TouchableWithoutFeedback>
    <View style={styles.modal}>
      <View style={[styles.headerBar, { backgroundColor: accent, borderBottomColor: accent }]}>
        <Text style={[styles.headerTitle, { color: '#fff' }]}>{title}</Text>
      </View>
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContainer}>
        {children}
      </ScrollView>
      <View style={[styles.footer, { borderTopColor: accent }]}>
        <Button title="Cancel" onPress={onClose} color={accent} />
        <Button title="Save" onPress={onSave} color={accent} />
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    marginHorizontal: 20,
    marginTop: '20%',
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    alignSelf: 'center',
    elevation: 5,
  },
  headerBar: {
    borderBottomWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  bodyContainer: {
    paddingBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
  },
})
