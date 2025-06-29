import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ArrowLeft, FileText, Upload, Download, Trash2, Eye } from 'lucide-react-native';

interface ResumeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  uploadedAt: Date;
}

export default function UploadResume() {
  const router = useRouter();
  const { userProfile, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    if (Platform.OS === 'web') {
      // Web implementation using input file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            Alert.alert('Erro', 'O arquivo deve ter no máximo 5MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const fileData = {
              name: file.name,
              size: file.size,
              mimeType: file.type,
              uri: e.target?.result as string,
            };
            uploadResume(fileData);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Mobile implementation would use expo-document-picker
      Alert.alert('Funcionalidade', 'Seleção de documentos disponível apenas na versão mobile');
    }
  };

  const uploadResume = async (file: any) => {
    setUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newResume: ResumeFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size || 0,
        type: file.mimeType || 'application/pdf',
        uri: file.uri,
        uploadedAt: new Date(),
      };

      setResumes(prev => [newResume, ...prev]);

      await updateProfile({
        resumeUrl: file.uri,
      });

      addNotification({
        title: 'Currículo enviado!',
        message: 'Seu currículo foi enviado com sucesso.',
        type: 'success',
      });
    } catch (error: any) {
      addNotification({
        title: 'Erro no upload',
        message: 'Não foi possível fazer upload do currículo.',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = (id: string) => {
    Alert.alert(
      'Excluir Currículo',
      'Tem certeza que deseja excluir este currículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setResumes(prev => prev.filter(resume => resume.id !== id));
            addNotification({
              title: 'Currículo excluído',
              message: 'O currículo foi excluído com sucesso.',
              type: 'success',
            });
          },
        },
      ]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewResume = (resume: ResumeFile) => {
    if (Platform.OS === 'web') {
      window.open(resume.uri, '_blank');
    } else {
      Alert.alert('Visualizar', 'Funcionalidade de visualização disponível apenas na web');
    }
  };

  const handleDownloadResume = (resume: ResumeFile) => {
    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = resume.uri;
      link.download = resume.name;
      link.click();
    } else {
      Alert.alert('Download', 'Funcionalidade de download disponível apenas na web');
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
        <Text style={styles.headerTitle}>Meu Currículo</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.uploadSection}>
          <TouchableOpacity 
            style={[styles.uploadButton, uploading && styles.disabledButton]}
            onPress={pickDocument}
            disabled={uploading}
          >
            <Upload color="#FFFFFF" size={24} />
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Enviando...' : 'Enviar Currículo'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.uploadHint}>
            Formatos aceitos: PDF, DOC, DOCX (máx. 5MB)
          </Text>
        </View>

        {resumes.length > 0 && (
          <View style={styles.resumesSection}>
            <Text style={styles.sectionTitle}>Currículos Enviados</Text>
            
            <View style={styles.resumesList}>
              {resumes.map((resume) => (
                <View key={resume.id} style={styles.resumeCard}>
                  <View style={styles.resumeIcon}>
                    <FileText color="#1E40AF" size={24} />
                  </View>
                  
                  <View style={styles.resumeInfo}>
                    <Text style={styles.resumeName} numberOfLines={1}>{resume.name}</Text>
                    <Text style={styles.resumeMeta}>
                      {formatFileSize(resume.size)} • {formatDate(resume.uploadedAt)}
                    </Text>
                  </View>

                  <View style={styles.resumeActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleViewResume(resume)}
                    >
                      <Eye color="#64748B" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDownloadResume(resume)}
                    >
                      <Download color="#64748B" size={16} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => deleteResume(resume.id)}
                    >
                      <Trash2 color="#EF4444" size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Dicas para um bom currículo:</Text>
          <Text style={styles.tipText}>• Mantenha as informações atualizadas</Text>
          <Text style={styles.tipText}>• Use um formato profissional e limpo</Text>
          <Text style={styles.tipText}>• Destaque suas principais qualificações</Text>
          <Text style={styles.tipText}>• Inclua experiências relevantes</Text>
          <Text style={styles.tipText}>• Revise a ortografia e gramática</Text>
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
  uploadSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  uploadHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  resumesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  resumesList: {
    gap: 12,
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resumeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  resumeMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  resumeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tips: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 32,
  },
});