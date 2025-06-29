import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle, XCircle, Eye, MessageCircle } from 'lucide-react-native';

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: Date;
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'hired';
  statusMessage?: string;
}

export default function Applications() {
  const [applications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Desenvolvedor Frontend',
      company: 'TechVagas Ltda',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'interview',
      statusMessage: 'Empresa entrou em contato para entrevista'
    },
    {
      id: '2',
      jobTitle: 'Assistente Administrativo',
      company: 'Agronegócios do Sertão',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'viewed',
      statusMessage: 'Currículo visualizado pela empresa'
    },
    {
      id: '3',
      jobTitle: 'Vendedor',
      company: 'Loja Regional',
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
    },
    {
      id: '4',
      jobTitle: 'Analista de Marketing',
      company: 'Marketing Digital BA',
      appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      status: 'rejected',
      statusMessage: 'Perfil não atende aos requisitos no momento'
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock color="#F59E0B" size={20} />;
      case 'viewed':
        return <Eye color="#3B82F6" size={20} />;
      case 'interview':
        return <MessageCircle color="#10B981" size={20} />;
      case 'rejected':
        return <XCircle color="#EF4444" size={20} />;
      case 'hired':
        return <CheckCircle color="#10B981" size={20} />;
      default:
        return <Clock color="#F59E0B" size={20} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Enviada';
      case 'viewed':
        return 'Visualizada';
      case 'interview':
        return 'Em Processo';
      case 'rejected':
        return 'Não Selecionado';
      case 'hired':
        return 'Contratado';
      default:
        return 'Enviada';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'viewed':
        return '#3B82F6';
      case 'interview':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      case 'hired':
        return '#10B981';
      default:
        return '#F59E0B';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const getFilteredApplications = (status?: string) => {
    if (!status) return applications;
    return applications.filter(app => app.status === status);
  };

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { key: 'all', label: 'Todas', count: applications.length },
    { key: 'pending', label: 'Pendentes', count: getFilteredApplications('pending').length },
    { key: 'viewed', label: 'Visualizadas', count: getFilteredApplications('viewed').length },
    { key: 'interview', label: 'Em Processo', count: getFilteredApplications('interview').length },
  ];

  const filteredApplications = activeFilter === 'all' ? applications : getFilteredApplications(activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Candidaturas</Text>
        <Text style={styles.headerSubtitle}>
          {applications.length} candidaturas realizadas
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
              <View style={[
                styles.filterBadge,
                activeFilter === filter.key && styles.activeFilterBadge
              ]}>
                <Text style={[
                  styles.filterBadgeText,
                  activeFilter === filter.key && styles.activeFilterBadgeText
                ]}>
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredApplications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma candidatura encontrada</Text>
            <Text style={styles.emptyDescription}>
              {activeFilter === 'all' 
                ? 'Você ainda não se candidatou a nenhuma vaga.'
                : 'Nenhuma candidatura com este status.'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.applicationsList}>
            {filteredApplications.map((application) => (
              <TouchableOpacity key={application.id} style={styles.applicationCard}>
                <View style={styles.applicationHeader}>
                  <View style={styles.applicationTitleContainer}>
                    <Text style={styles.applicationTitle}>{application.jobTitle}</Text>
                    <Text style={styles.applicationCompany}>{application.company}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(application.status)}15` }]}>
                    {getStatusIcon(application.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
                      {getStatusText(application.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.applicationDate}>
                  Candidatura enviada em {formatDate(application.appliedAt)}
                </Text>

                {application.statusMessage && (
                  <View style={styles.statusMessage}>
                    <Text style={styles.statusMessageText}>{application.statusMessage}</Text>
                  </View>
                )}

                <View style={styles.applicationActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                  
                  {application.status === 'interview' && (
                    <TouchableOpacity style={styles.primaryActionButton}>
                      <MessageCircle color="#FFFFFF" size={16} />
                      <Text style={styles.primaryActionButtonText}>Chat</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filters: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#475569',
  },
  activeFilterBadgeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  applicationsList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicationTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  applicationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  applicationCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  applicationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 12,
  },
  statusMessage: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  statusMessageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    gap: 6,
  },
  primaryActionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});