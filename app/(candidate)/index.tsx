import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, MapPin, Clock, DollarSign } from 'lucide-react-native';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedAt: Date;
  requirements: string[];
}

export default function CandidateHome() {
  const { userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: '1',
        title: 'Desenvolvedor Frontend',
        company: 'TechVagas Ltda',
        location: 'Paulo Afonso, BA',
        salary: 'R$ 3.500 - R$ 5.000',
        type: 'CLT - Integral',
        description: 'Desenvolvedor React/React Native para atuar em projetos inovadores...',
        postedAt: new Date(),
        requirements: ['React', 'JavaScript', 'Git'],
      },
      {
        id: '2',
        title: 'Assistente Administrativo',
        company: 'Agronegócios do Sertão',
        location: 'Glória, BA',
        salary: 'R$ 1.800 - R$ 2.200',
        type: 'CLT - Integral',
        description: 'Profissional para atuar no setor administrativo da empresa...',
        postedAt: new Date(),
        requirements: ['Excel', 'Comunicação', 'Organização'],
      },
      {
        id: '3',
        title: 'Vendedor',
        company: 'Loja Regional',
        location: 'Chorrochó, BA',
        salary: 'R$ 1.500 + Comissões',
        type: 'CLT - Integral',
        description: 'Vendedor experiente para atendimento ao cliente...',
        postedAt: new Date(),
        requirements: ['Experiência em vendas', 'Proatividade'],
      },
    ];
    setJobs(mockJobs);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Olá, {userProfile?.name?.split(' ')[0] || 'Candidato'}!</Text>
          <Text style={styles.subGreeting}>Encontre sua próxima oportunidade</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell color="#64748B" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vagas Recomendadas</Text>
          <Text style={styles.sectionSubtitle}>
            {jobs.length} vagas encontradas na sua região
          </Text>
        </View>

        <View style={styles.jobsList}>
          {jobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View style={styles.jobTitleContainer}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                </View>
                <View style={styles.jobTime}>
                  <Clock color="#64748B" size={16} />
                  <Text style={styles.jobTimeText}>{formatTimeAgo(job.postedAt)}</Text>
                </View>
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.jobDetailItem}>
                  <MapPin color="#64748B" size={16} />
                  <Text style={styles.jobDetailText}>{job.location}</Text>
                </View>
                <View style={styles.jobDetailItem}>
                  <DollarSign color="#64748B" size={16} />
                  <Text style={styles.jobDetailText}>{job.salary}</Text>
                </View>
              </View>

              <Text style={styles.jobDescription} numberOfLines={2}>
                {job.description}
              </Text>

              <View style={styles.jobFooter}>
                <View style={styles.jobType}>
                  <Text style={styles.jobTypeText}>{job.type}</Text>
                </View>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Candidatar-se</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  jobsList: {
    paddingHorizontal: 24,
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
  },
  jobTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  jobDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  jobDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobType: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  applyButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});