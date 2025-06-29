import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Building, ArrowLeft } from 'lucide-react-native';

export default function UserTypeSelection() {
  const router = useRouter();

  const handleUserTypeSelect = (userType: 'candidate' | 'employer') => {
    router.push(`/auth/register?userType=${userType}`);
  };

  return (
    <LinearGradient
      colors={['#1E40AF', '#3B82F6']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Como você quer usar o ITAVAGAS?</Text>
          <Text style={styles.subtitle}>
            Escolha o tipo de perfil que melhor se adequa ao seu objetivo
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={() => handleUserTypeSelect('candidate')}
          >
            <View style={styles.optionIcon}>
              <User color="#1E40AF" size={32} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Sou Candidato</Text>
              <Text style={styles.optionDescription}>
                Procuro oportunidades de emprego na região
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={() => handleUserTypeSelect('employer')}
          >
            <View style={styles.optionIcon}>
              <Building color="#1E40AF" size={32} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Sou Empregador</Text>
              <Text style={styles.optionDescription}>
                Quero contratar profissionais qualificados
              </Text>
            </View>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  options: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
  },
});