import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { JobsProvider } from '@/contexts/JobsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import NotificationOverlay from '@/components/NotificationOverlay';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

SplashScreen.preventAutoHideAsync();

// Componente que lida com a lógica de navegação
function RootLayoutNav() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (user && userType) {
      if (inAuthGroup) {
        if (userType === 'candidate') {
          router.replace('/(candidate)');
        } else {
          router.replace('/(employer)');
        }
      }
    } else if (!user && !inAuthGroup) {
      router.replace('/auth');
    }
  }, [user, userType, loading, segments]);

  if (loading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(candidate)" />
        <Stack.Screen name="(employer)" />
        <Stack.Screen name="(shared)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <NotificationOverlay />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NotificationProvider>
      <AuthProvider>
        <JobsProvider>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </JobsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}