import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotifications } from '@/contexts/NotificationContext';
import NotificationBanner from './NotificationBanner';

export default function NotificationOverlay() {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SafeAreaView style={styles.container} pointerEvents="box-none">
        <View style={styles.notificationsContainer}>
          {notifications.slice(0, 3).map((notification) => (
            <NotificationBanner
              key={notification.id}
              notification={notification}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  container: {
    flex: 1,
  },
  notificationsContainer: {
    paddingTop: 8,
  },
});