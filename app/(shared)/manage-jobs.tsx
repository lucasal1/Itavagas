import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useJobs } from '@/contexts/JobsContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Pause, 
  Play, 
  Trash2,
  Eye,
  Users
} from 'lucide-react-native';

export default function ManageJobs() {
  const router = useRouter();
  const { jobs, updateJob, deleteJob } = useJobs();
  const { addNotification } = useNotifications();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'paused': return '#F59E0B';
      case 'closed': return '#64748B';
      default: return '#64748B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'closed': return 'Encerrada';
      default: return status;
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: 'active' | 'paused' | 'closed') => {
    try {
      await updateJob(jobId, { status: newStatus });
      addNotification({
        title: 'Status atualizado',
        message: `Vaga ${getStatusText(newStatus).toLowerCase()} com sucesso.`,
        type: 'success',
      });
    } catch (error: any) {
      addNotification({
        title: 'Erro',
        message: 'Não foi possível atualizar o status da vaga.',
        type: 'error',
      });
    }
  };

  const handleDeleteJob = (jobId: string) => {
    Alert.alert(
      'Excluir Vaga',
      'Tem certeza que deseja excluir esta vaga? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJob(jobId);
              addNotification({
                title: 'Vaga excluída',
                message: 'A vaga foi excluída com sucesso.',
                type: 'success',
              });
            } catch (error: any) {
              addNotification({
                title: 'Erro',
                message: 'Não foi possível excluir a vaga.',
                type: 'error',
              });
            }
          },
        },
      ]
    );
  };

  const JobActionMenu = ({ job }: { job: any }) => (
    <View style={styles.actionMenu}>
      <TouchableOpacity
        style={styles.actionMenuItem}
        onPress={() => router.push(`/(shared)/edit-job?id=${job.id}`)}
      >
        <Edit3 color="#64748B" size={16} />
        <Text style={styles.actionMenuText}>Editar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionMenuItem}
        onPress={() => handleStatusChange(job.id, job.status === 'active' ? 'paused' : 'active')}
      >
        {job.status === 'active' ? (
          <Pause color="#F59E0B" size={16} />
        ) : (
          <Play color="#10B981" size={16} />
        )}
        <Text style={styles.actionMenuText}>
          {job.status === 'active' ? 'Pausar' : 'Ativar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionMenuItem}
        onPress={() => handleStatusChange(job.id, 'closed')}
      >
        <Text style={[styles.actionMenuText, { color: '#64748B' }]}>Encerrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionMenuItem, styles.deleteMenuItem]}
        onPress={() => handleDeleteJob(job.id)}
      >
        <Trash2 color="#EF4444" size={16} />
        <Text style={[styles.actionMenuText, { color: '#EF4444' }]}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Vagas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/(employer)/create-job')}
        >
          <Plus color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhuma vaga criada</Text>
            <Text style={styles.emptyDescription}>
              Crie sua primeira vaga para começar a receber candidaturas.
            </Text>
            <TouchableOpacity 
              style={styles.createFirstJobButton}
              onPress={() => router.push('/(employer)/create-job')}
            >
              <Plus color="#FFFFFF" size={16} />
              <Text style={styles.createFirstJobButtonText}>Criar primeira vaga</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.jobsList}>
            {jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                    <View style={styles.jobMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(job.status)}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                          {getStatusText(job.status)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.moreButton}
                    onPress={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                  >
                    <MoreVertical color="#64748B" size={20} />
                  </TouchableOpacity>
                </View>

                {selectedJob === job.id && <JobActionMenu job={job} />}

                <View style={styles.jobStats}>
                  <View style={styles.jobStat}>
                    <Users color="#64748B" size={16} />
                    <Text style={styles.jobStatText}>{job.applicants} candidatos</Text>
                  </View>
                  <View style={styles.jobStat}>
                    <Eye color="#64748B" size={16} />
                    <Text style={styles.jobStatText}>{job.views} visualizações</Text>
                  </View>
                </View>

                <View style={styles.jobActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => router.push(`/(shared)/job-details?id=${job.id}`)}
                  >
                    <Text style={styles.actionButtonText}>Ver Detalhes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.primaryActionButton}
                    onPress={() => router.push('/(employer)/candidates')}
                  >
                    <Text style={styles.primaryActionButtonText}>Candidatos</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
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
    marginBottom: 20,
  },
  createFirstJobButton: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },
  createFirstJobButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  jobsList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  jobCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deleteMenuItem: {
    borderBottomWidth: 0,
  },
  actionMenuText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  jobStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  jobStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobStatText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  jobActions: {
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
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