// src/TodayView/index.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { NLInputBar } from '../../components/common/NLInputBar';
import TimelineView from './TimelineView';
import ScheduleView from './ScheduleView';
import CardView from './CardView';
import { Activity, ActivityType, mockActivities } from './types';

const quickActions: {
  type: Exclude<ActivityType, 'health'>;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
}[] = [
  { type: 'sleep', icon: 'moon', color: '#D8D3E8', label: 'Sleep' },
  { type: 'feeding', icon: 'restaurant', color: '#E8DFD1', label: 'Feed' },
  { type: 'diaper', icon: 'water', color: '#D8E5E2', label: 'Diaper' },
  { type: 'milestone', icon: 'trophy', color: '#7D7A89', label: 'Milestone' },
];

export default function TodayView() {
  const [view, setView] = useState<'Activity Log' | 'Schedule' | 'Highlights'>(
    'Activity Log'
  );
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [refreshing, setRefreshing] = useState(false);
  const [modalType, setModalType] = useState<
    Exclude<ActivityType, 'health'> | null
  >(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{
    type: 'sleep' | 'feeding';
    start: Date;
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const openModal = (type: Exclude<ActivityType, 'health'>) => {
    setModalType(type);
    setFabOpen(false);
  };
  const closeModal = () => {
    setModalType(null);
  };

  const startTimer = (type: 'sleep' | 'feeding') => {
    if (activeTimer) return;
    setActiveTimer({ type, start: new Date() });
    // scheduleNotification...
  };
  const stopTimer = () => {
    clearInterval(timerRef.current!);
    setActiveTimer(null);
  };

  let Content: JSX.Element;
  if (view === 'Activity Log') {
    Content = (
      <TimelineView
        activities={activities}
        refreshing={refreshing}
        onRefresh={() => {}}
        onItemPress={() => {}}
      />
    );
  } else if (view === 'Schedule') {
    Content = <ScheduleView />;
  } else {
    Content = (
      <CardView
        activities={activities}
        refreshing={refreshing}
        onRefresh={() => {}}
        onItemPress={() => {}}
      />
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(['Activity Log', 'Schedule', 'Highlights'] as const).map((v) => (
          <TouchableOpacity
            key={v}
            onPress={() => setView(v)}
            style={view === v ? styles.tabActive : styles.tab}
          >
            <Text
              style={view === v ? styles.tabTextActive : styles.tabText}
            >
              {v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>{Content}</View>

      {/* FAB + quick actions */}
      {/* ... */}

      {modalType && (
        <Modal transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modal}>
              <Text>{modalType} Entry</Text>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  title: { fontSize: 20, fontWeight: '600' },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    padding: 8,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#F7F5F2',
  },
  tabActive: {
    padding: 8,
    margin: 4,
    borderRadius: 16,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  tabText: { color: '#666' },
  tabTextActive: { color: '#333' },

  content: { flex: 1 },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
});
