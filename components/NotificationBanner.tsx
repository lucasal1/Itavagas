import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, Info, X } from 'lucide-react-native';
import { useNotifications, Notification } from '@/contexts/NotificationContext';

interface NotificationBannerProps {
  notification: Notification;
}

export default function NotificationBanner({ notification }: NotificationBannerProps) {
  const { clearNotification } = useNotifications();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearNotification(notification.id);
    });
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle color="#10B981" size={20} />;
      case 'error':
        return <XCircle color="#EF4444" size={20} />;
      case 'warning':
        return <AlertCircle color="#F59E0B" size={20} />;
      case 'info':
        return <Info color="#3B82F6" size={20} />;
      default:
        return <Info color="#3B82F6" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return '#F0FDF4';
      case 'error':
        return '#FEF2F2';
      case 'warning':
        return '#FFFBEB';
      case 'info':
        return '#EFF6FF';
      default:
        return '#EFF6FF';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#3B82F6';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color="#64748B" size={18} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});