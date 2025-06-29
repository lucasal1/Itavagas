import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { user, userType, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user && userType) {
          // User is authenticated, redirect to appropriate dashboard
          if (userType === 'candidate') {
            router.replace('/(candidate)');
          } else if (userType === 'employer') {
            router.replace('/(employer)');
          }
        } else {
          // User is not authenticated, go to auth flow
          router.replace('/auth');
        }
      }, 2000); // Increased delay to ensure proper loading

      return () => clearTimeout(timer);
    }
  }, [user, userType, loading, router]);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA']}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>ITA</Text>
            </View>
            <Text style={styles.appName}>ITAVAGAS</Text>
            <Text style={styles.tagline}>Conectando talentos do Sertão de Itaparica</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  // Show redirecting state
  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6', '#60A5FA']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>ITA</Text>
          </View>
          <Text style={styles.appName}>ITAVAGAS</Text>
          <Text style={styles.tagline}>Conectando talentos do Sertão de Itaparica</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.loadingText}>
            {user && userType ? 'Redirecionando...' : 'Iniciando...'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});