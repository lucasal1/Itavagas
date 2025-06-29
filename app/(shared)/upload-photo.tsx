import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ArrowLeft, Camera, Image as ImageIcon, Upload, Check } from 'lucide-react-native';

export default function UploadPhoto() {
  const router = useRouter();
  const { userProfile, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Web implementation using input file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setSelectedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      // Mobile implementation would use expo-image-picker
      Alert.alert('Funcionalidade', 'Seleção de imagem disponível apenas na versão mobile');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Câmera', 'Funcionalidade de câmera não disponível na web');
    } else {
      // Mobile implementation would use expo-camera
      Alert.alert('Funcionalidade', 'Câmera disponível apenas na versão mobile');
    }
  };

  const uploadPhoto = async () => {
    if (!selectedImage) {
      Alert.alert('Erro', 'Selecione uma foto primeiro');
      return;
    }

    setUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateProfile({
        profilePicture: selectedImage,
      });

      addNotification({
        title: 'Foto atualizada!',
        message: 'Sua foto de perfil foi atualizada com sucesso.',
        type: 'success',
      });

      router.back();
    } catch (error: any) {
      addNotification({
        title: 'Erro no upload',
        message: 'Não foi possível fazer upload da foto.',
        type: 'error',
      });
    } finally {
      setUploading(false);
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
        <Text style={styles.headerTitle}>Foto de Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.photoContainer}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedPhoto} />
          ) : (
            <View style={styles.placeholderPhoto}>
              <ImageIcon color="#94A3B8" size={48} />
              <Text style={styles.placeholderText}>Nenhuma foto selecionada</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <ImageIcon color="#1E40AF" size={24} />
            <Text style={styles.actionButtonText}>Escolher da Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Camera color="#1E40AF" size={24} />
            <Text style={styles.actionButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <TouchableOpacity 
            style={[styles.uploadButton, uploading && styles.disabledButton]}
            onPress={uploadPhoto}
            disabled={uploading}
          >
            {uploading ? (
              <Upload color="#FFFFFF" size={20} />
            ) : (
              <Check color="#FFFFFF" size={20} />
            )}
            <Text style={styles.uploadButtonText}>
              {uploading ? 'Enviando...' : 'Salvar Foto'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>Dicas para uma boa foto:</Text>
          <Text style={styles.tipText}>• Use uma foto recente e clara</Text>
          <Text style={styles.tipText}>• Prefira fotos com boa iluminação</Text>
          <Text style={styles.tipText}>• Evite fotos em grupo</Text>
          <Text style={styles.tipText}>• Mantenha um visual profissional</Text>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  selectedPhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
  },
  placeholderPhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 8,
  },
  actions: {
    gap: 16,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tips: {
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
});