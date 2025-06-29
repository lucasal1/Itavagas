import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Eye, 
  Users, 
  Clock, 
  MoreVertical,
  TrendingUp,
  UserCheck,
  FileText 
} from 'lucide-react-native';

interface JobPosting {
  id: string;
  title: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  views: number;
  postedAt: Date;
}

export default function EmployerDashboard() {
  const { userProfile } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);

  useEffect(() => {
    // Mock data
    const mockJobs: JobPosting[] = [
      {
        id: '1',
        title: 'Desenvolvedor Frontend',
        status: 'active',
        applicants: 12,
        views: 45,
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        title: 'Assistente Administrativo',
        status: 'active',
        applicants: 8,
        views: 32,
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        title: 'Vendedor',
        status: 'paused',
        applicants: 15,
        views: 67,
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
    setJobs(mockJobs);
  }, []);

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplicants: jobs.reduce((sum, job) => sum + job.applicants, 0),
    totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
  };

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Olá, {userProfile?.name || 'Empresa'}!
          </Text>
          <Text style={styles.subGreeting}>Gerencie suas vagas e candidatos</Text>
        </View>
        <TouchableOpacity style={styles.createButton}>
          <Plus color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <FileText color="#1E40AF" size={24} />
              </View>
              <Text style={styles.statValue}>{stats.totalJobs}</Text>
              <Text style={styles.statLabel}>Vagas Totais</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <TrendingUp color="#10B981" size={24} />
              </View>
              <Text style={styles.statValue}>{stats.activeJobs}</Text>
              <Text style={styles.statLabel}>Vagas Ativas</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <UserCheck color="#F59E0B" size={24} />
              </View>
              <Text style={styles.statValue}>{stats.totalApplicants}</Text>
              <Text style={styles.statLabel}>Candidaturas</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Eye color="#8B5CF6" size={24} />
              </View>
              <Text style={styles.statValue}>{stats.totalViews}</Text>
              <Text style={styles.statLabel}>Visualizações</Text>
            </View>
          </View>
        </View>

        <View style={styles.jobsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suas Vagas</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jobsList}>
            {jobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.jobMeta}>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(job.status)}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(job.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                          {getStatusText(job.status)}
                        </Text>
                      </View>
                      <Text style={styles.jobDate}>Publicada em {formatDate(job.postedAt)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <MoreVertical color="#64748B" size={20} />
                  </TouchableOpacity>
                </View>

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
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Ver Candidatos</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryActionButton}>
                    <Text style={styles.primaryActionButtonText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Plus color="#1E40AF" size={32} />
              <Text style={styles.actionCardTitle}>Nova Vaga</Text>
              <Text style={styles.actionCardDescription}>Publique uma nova oportunidade</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Users color="#10B981" size={32} />
              <Text style={styles.actionCardTitle}>Candidatos</Text>
              <Text style={styles.actionCardDescription}>Gerencie candidaturas</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  jobsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  jobsList: {
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
    marginBottom: 8,
  },
  jobMeta: {
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
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
  jobDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
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
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  actionCardDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});