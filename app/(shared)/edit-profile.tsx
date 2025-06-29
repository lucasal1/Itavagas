import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from 'lucide-react-native';

export default function EditProfile() {
  const router = useRouter();
  const { userProfile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: '',
    location: 'Sertão de Itaparica, BA',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        profileComplete: true,
      });
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <User color="#64748B" size={20} />
              <Text style={styles.inputLabel}>Nome Completo</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Mail color="#64748B" size={20} />
              <Text style={styles.inputLabel}>E-mail</Text>
            </View>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.email}
              editable={false}
              placeholder="E-mail não pode ser alterado"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <Phone color="#64748B" size={20} />
              <Text style={styles.inputLabel}>Telefone</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputHeader}>
              <MapPin color="#64748B" size={20} />
              <Text style={styles.inputLabel}>Localização</Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              placeholder="Sua cidade"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },
  actions: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});