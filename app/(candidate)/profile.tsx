import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, FileText, CreditCard as Edit3, Upload, LogOut, Settings, Bell, CircleHelp as HelpCircle, Camera } from 'lucide-react-native';

export default function CandidateProfile() {
  const { userProfile, logout } = useAuth();
  const router = useRouter();
  const [profileComplete] = useState(75); // Mock completion percentage

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: <Edit3 color="#64748B" size={20} />,
      title: 'Editar Perfil',
      description: 'Atualize suas informações pessoais',
      onPress: () => router.push('/(shared)/edit-profile'),
    },
    {
      icon: <FileText color="#64748B" size={20} />,
      title: 'Meu Currículo',
      description: 'Visualizar e editar currículo',
      onPress: () => router.push('/(shared)/upload-resume'),
    },
    {
      icon: <Camera color="#64748B" size={20} />,
      title: 'Foto de Perfil',
      description: 'Atualizar foto do perfil',
      onPress: () => router.push('/(shared)/upload-photo'),
    },
    {
      icon: <Bell color="#64748B" size={20} />,
      title: 'Notificações',
      description: 'Configurar alertas de vagas',
      onPress: () => router.push('/(shared)/notifications'),
    },
    {
      icon: <Settings color="#64748B" size={20} />,
      title: 'Configurações',
      description: 'Privacidade e preferências',
      onPress: () => router.push('/(shared)/settings'),
    },
    {
      icon: <HelpCircle color="#64748B" size={20} />,
      title: 'Ajuda',
      description: 'Central de ajuda e suporte',
      onPress: () => {
        Alert.alert('Ajuda', 'Entre em contato conosco pelo email: suporte@itavagas.com');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {userProfile?.profilePicture ? (
                <Image source={{ uri: userProfile.profilePicture }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatar}>
                  <User color="#FFFFFF" size={32} />
                </View>
              )}
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => router.push('/(shared)/upload-photo')}
              >
                <Upload color="#1E40AF" size={16} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile?.name || 'Nome do Usuário'}</Text>
              <Text style={styles.profileEmail}>{userProfile?.email}</Text>
              
              <View style={styles.completionContainer}>
                <Text style={styles.completionText}>Perfil {profileComplete}% completo</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${profileComplete}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Mail color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>{userProfile?.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Phone color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{userProfile?.phone || 'Não informado'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <MapPin color="#64748B" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>{userProfile?.location || 'Sertão de Itaparica, BA'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && styles.menuItemBorder
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    {item.icon}
                  </View>
                  <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuDescription}>{item.description}</Text>
                  </View>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>ITAVAGAS v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 - Conectando o Sertão de Itaparica</Text>
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
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  completionContainer: {
    gap: 6,
  },
  completionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E40AF',
    borderRadius: 3,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  menuSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  menuArrow: {
    fontSize: 20,
    color: '#CBD5E1',
    fontFamily: 'Inter-Regular',
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 32,
  },
});