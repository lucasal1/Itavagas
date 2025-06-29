import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  FileText, 
  Users,
  Plus,
  X
} from 'lucide-react-native';

export default function CreateJob() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'CLT - Integral',
    description: '',
    requirements: [''],
  });
  
  const [loading, setLoading] = useState(false);

  const jobTypes = [
    'CLT - Integral',
    'CLT - Meio Período',
    'PJ',
    'Estágio',
    'Freelance',
    'Temporário',
  ];

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      }));
    }
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }));
  };

  const handlePublish = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      // Here you would typically save to Firebase/database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      Alert.alert('Sucesso', 'Vaga publicada com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível publicar a vaga');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nova Vaga</Text>
        <Text style={styles.headerSubtitle}>Preencha os dados da oportunidade</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações Básicas</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Briefcase color="#64748B" size={20} />
                <Text style={styles.inputLabel}>Título da Vaga *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Ex: Desenvolvedor Frontend"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <MapPin color="#64748B" size={20} />
                <Text style={styles.inputLabel}>Localização *</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="Ex: Paulo Afonso, BA"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <DollarSign color="#64748B" size={20} />
                <Text style={styles.inputLabel}>Salário</Text>
              </View>
              <TextInput
                style={styles.input}
                value={formData.salary}
                onChangeText={(text) => setFormData(prev => ({ ...prev, salary: text }))}
                placeholder="Ex: R$ 3.000 - R$ 5.000"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <Clock color="#64748B" size={20} />
                <Text style={styles.inputLabel}>Tipo de Contrato</Text>
              </View>
              <View style={styles.typeSelector}>
                {jobTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      formData.type === type && styles.selectedType
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, type }))}
                  >
                    <Text style={[
                      styles.typeText,
                      formData.type === type && styles.selectedTypeText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição da Vaga</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputHeader}>
                <FileText color="#64748B" size={20} />
                <Text style={styles.inputLabel}>Descrição *</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Descreva as responsabilidades, benefícios e informações importantes sobre a vaga..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.inputHeader}>
                <Users color="#64748B" size={20} />
                <Text style={styles.sectionTitle}>Requisitos</Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
                <Plus color="#1E40AF" size={16} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {formData.requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementContainer}>
                <TextInput
                  style={[styles.input, styles.requirementInput]}
                  value={requirement}
                  onChangeText={(text) => updateRequirement(index, text)}
                  placeholder={`Requisito ${index + 1}`}
                  placeholderTextColor="#94A3B8"
                />
                {formData.requirements.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeRequirement(index)}
                  >
                    <X color="#EF4444" size={16} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.draftButton}
            onPress={() => router.back()}
          >
            <Text style={styles.draftButtonText}>Salvar Rascunho</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.publishButton, loading && styles.disabledButton]} 
            onPress={handlePublish}
            disabled={loading}
          >
            <Text style={styles.publishButtonText}>
              {loading ? 'Publicando...' : 'Publicar Vaga'}
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
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
  textArea: {
    minHeight: 120,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedType: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  selectedTypeText: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  requirementInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  draftButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  publishButton: {
    flex: 1,
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  publishButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});