// src/screens/TodayView/TimelineScreen.tsx
import React, { useState, useCallback } from 'react';
import TimelineView, { TimelineViewProps } from './TimelineView';
import { Activity, ActivityType } from '../../models/types';
import { useFocusEffect } from '@react-navigation/native';
import { fetchTodaysActivities } from '../../services/activityService'; 
// ← replace with however you actually load your data

export function TimelineScreen() {
  // local state for pull-to-refresh, etc.
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchTodaysActivities();
    setActivities(data);
    setRefreshing(false);
  }, []);

  // reload whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        setRefreshing(true);
        const data = await fetchTodaysActivities();
        if (isActive) {
          setActivities(data);
          setRefreshing(false);
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleRefresh = useCallback(() => {
    load();
  }, [load]);

  const handleItemPress = useCallback(
    (type: ActivityType, activity?: Activity) => {
      // e.g. navigation.navigate('Edit' + type, { activity })
      console.log('pressed', type, activity);
    },
    []
  );

  return (
    <TimelineView
      activities={activities}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onItemPress={handleItemPress}
    />
  );
}
