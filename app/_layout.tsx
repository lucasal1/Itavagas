import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

// Componente que lida com a lógica de navegação
function RootLayoutNav() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Espera até que o estado de autenticação seja carregado
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';

    if (user && userType) {
      // O utilizador está logado e tem um perfil.
      // Se ele estiver no grupo de autenticação, redireciona-o para a página principal.
      if (inAuthGroup) {
        if (userType === 'candidate') {
          router.replace('/(candidate)');
        } else {
          router.replace('/(employer)');
        }
      }
    } else if (!user) {
      // O utilizador não está logado.
      // Se ele não estiver no grupo de autenticação, redireciona-o para lá.
      if (!inAuthGroup) {
        router.replace('/auth');
      }
    }
  }, [user, userType, loading, segments]);

  // Enquanto o estado de autenticação está a ser carregado, o ecrã de carregamento (app/index.tsx) é exibido.
  // Não renderizamos nada aqui para evitar piscar.
  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(candidate)" />
      <Stack.Screen name="(employer)" />
      <Stack.Screen name="(shared)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

// Layout raiz que envolve toda a aplicação
export default function RootLayout() {
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
    <AuthProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
