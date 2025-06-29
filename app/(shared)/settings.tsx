import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  ArrowLeft, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock,
  Trash2,
  Download,
  ChevronRight
} from 'lucide-react-native';

export default function Settings() {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const { addNotification } = useNotifications();
  
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    addNotification({
      title: 'Configuração atualizada',
      message: `Notificações ${value ? 'ativadas' : 'desativadas'} com sucesso.`,
      type: 'success',
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    addNotification({
      title: 'Privacidade atualizada',
      message: 'Suas configurações de privacidade foram atualizadas.',
      type: 'success',
    });
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão enviados por email em até 24 horas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            addNotification({
              title: 'Solicitação enviada',
              message: 'Você receberá seus dados por email em breve.',
              type: 'success',
            });
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirmar Exclusão',
              'Digite "EXCLUIR" para confirmar a exclusão da sua conta.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Confirmar',
                  style: 'destructive',
                  onPress: () => {
                    addNotification({
                      title: 'Conta excluída',
                      message: 'Sua conta foi excluída com sucesso.',
                      type: 'success',
                    });
                    logout();
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Notificações',
      icon: <Bell color="#64748B" size={20} />,
      items: [
        {
          title: 'Alertas de Vagas',
          description: 'Receba notificações sobre novas vagas',
          type: 'switch',
          value: notifications.jobAlerts,
          onToggle: (value: boolean) => handleNotificationChange('jobAlerts', value),
        },
        {
          title: 'Atualizações de Candidaturas',
          description: 'Notificações sobre status das candidaturas',
          type: 'switch',
          value: notifications.applicationUpdates,
          onToggle: (value: boolean) => handleNotificationChange('applicationUpdates', value),
        },
        {
          title: 'Notificações por Email',
          description: 'Receber emails sobre atividades importantes',
          type: 'switch',
          value: notifications.emailNotifications,
          onToggle: (value: boolean) => handleNotificationChange('emailNotifications', value),
        },
        {
          title: 'Notificações Push',
          description: 'Notificações no dispositivo',
          type: 'switch',
          value: notifications.pushNotifications,
          onToggle: (value: boolean) => handleNotificationChange('pushNotifications', value),
        },
      ],
    },
    {
      title: 'Privacidade',
      icon: <Shield color="#64748B" size={20} />,
      items: [
        {
          title: 'Perfil Visível',
          description: 'Permitir que empresas vejam seu perfil',
          type: 'switch',
          value: privacy.profileVisible,
          onToggle: (value: boolean) => handlePrivacyChange('profileVisible', value),
        },
        {
          title: 'Mostrar Email',
          description: 'Exibir email no perfil público',
          type: 'switch',
          value: privacy.showEmail,
          onToggle: (value: boolean) => handlePrivacyChange('showEmail', value),
        },
        {
          title: 'Mostrar Telefone',
          description: 'Exibir telefone no perfil público',
          type: 'switch',
          value: privacy.showPhone,
          onToggle: (value: boolean) => handlePrivacyChange('showPhone', value),
        },
      ],
    },
    {
      title: 'Conta',
      icon: <Lock color="#64748B" size={20} />,
      items: [
        {
          title: 'Alterar Senha',
          description: 'Atualizar sua senha de acesso',
          type: 'action',
          onPress: () => {
            Alert.alert('Em breve', 'Funcionalidade de alteração de senha em desenvolvimento');
          },
        },
        {
          title: 'Exportar Dados',
          description: 'Baixar uma cópia dos seus dados',
          type: 'action',
          onPress: handleExportData,
        },
        {
          title: 'Excluir Conta',
          description: 'Remover permanentemente sua conta',
          type: 'action',
          danger: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
    {
      title: 'Sobre',
      icon: <Globe color="#64748B" size={20} />,
      items: [
        {
          title: 'Termos de Uso',
          description: 'Leia nossos termos e condições',
          type: 'action',
          onPress: () => {
            Alert.alert('Termos de Uso', 'Funcionalidade em desenvolvimento');
          },
        },
        {
          title: 'Política de Privacidade',
          description: 'Como tratamos seus dados',
          type: 'action',
          onPress: () => {
            Alert.alert('Política de Privacidade', 'Funcionalidade em desenvolvimento');
          },
        },
        {
          title: 'Versão do App',
          description: 'ITAVAGAS v1.0.0',
          type: 'info',
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              {section.icon}
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <View 
                  key={itemIndex} 
                  style={[
                    styles.settingItem,
                    itemIndex !== section.items.length - 1 && styles.settingItemBorder
                  ]}
                >
                  <View style={styles.settingInfo}>
                    <Text style={[
                      styles.settingTitle,
                      item.danger && styles.dangerText
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={styles.settingDescription}>
                      {item.description}
                    </Text>
                  </View>

                  <View style={styles.settingControl}>
                    {item.type === 'switch' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#1E40AF' }}
                        thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
                      />
                    )}
                    {item.type === 'action' && (
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={item.onPress}
                      >
                        <ChevronRight color="#94A3B8" size={20} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  dangerText: {
    color: '#EF4444',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 18,
  },
  settingControl: {
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  bottomPadding: {
    height: 32,
  },
});