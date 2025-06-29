import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Briefcase, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function AuthWelcome() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ITAVAGAS</Text>
          </View>
          <Text style={styles.subtitle}>
            A plataforma que conecta talentos e oportunidades no Sertão de Itaparica
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Users color="#FFFFFF" size={32} />
            <Text style={styles.featureText}>Conecte-se com empresas locais</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Briefcase color="#FFFFFF" size={32} />
            <Text style={styles.featureText}>Encontre oportunidades na sua região</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.push('/auth/user-type')}
          >
            <Text style={styles.primaryButtonText}>Começar Agora</Text>
            <ArrowRight color="#1E40AF" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
  },
  features: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});