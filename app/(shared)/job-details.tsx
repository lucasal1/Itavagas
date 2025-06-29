import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users,
  Eye,
  Share,
  Bookmark
} from 'lucide-react-native';

export default function JobDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { jobs, applyToJob, applications } = useJobs();
  const { userType } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  const job = jobs.find(j => j.id === id);
  const hasApplied = applications.some(app => app.jobId === id);

  useEffect(() => {
    if (!job) {
      router.back();
    }
  }, [job]);

  if (!job) {
    return null;
  }

  const handleApply = async () => {
    if (hasApplied) {
      addNotification({
        title: 'Já candidatado',
        message: 'Você já se candidatou a esta vaga.',
        type: 'info',
      });
      return;
    }

    setLoading(true);
    try {
      await applyToJob(job.id);
      addNotification({
        title: 'Candidatura enviada!',
        message: 'Sua candidatura foi enviada com sucesso. A empresa será notificada.',
        type: 'success',
      });
    } catch (error: any) {
      addNotification({
        title: 'Erro na candidatura',
        message: error.message || 'Não foi possível enviar sua candidatura.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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
        <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Share color="#64748B" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark color="#64748B" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.jobHeader}>
          <View style={styles.companyIcon}>
            <Building color="#1E40AF" size={24} />
          </View>
          <View style={styles.jobTitleContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
          </View>
        </View>

        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <MapPin color="#64748B" size={16} />
            <Text style={styles.metaText}>{job.location}</Text>
          </View>
          {job.salary && (
            <View style={styles.metaItem}>
              <DollarSign color="#64748B" size={16} />
              <Text style={styles.metaText}>{job.salary}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.metaText}>{job.type}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Users color="#64748B" size={16} />
            <Text style={styles.statText}>{job.applicants} candidatos</Text>
          </View>
          <View style={styles.statItem}>
            <Eye color="#64748B" size={16} />
            <Text style={styles.statText}>{job.views} visualizações</Text>
          </View>
          <View style={styles.statItem}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.statText}>Publicada em {formatDate(job.postedAt)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição da Vaga</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {job.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requisitos</Text>
            <View style={styles.requirementsList}>
              {job.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.requirementBullet} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {userType === 'candidate' && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.applyButton,
              (hasApplied || loading) && styles.disabledButton
            ]}
            onPress={handleApply}
            disabled={hasApplied || loading}
          >
            <Text style={styles.applyButtonText}>
              {loading ? 'Enviando...' : hasApplied ? 'Já Candidatado' : 'Candidatar-se'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  companyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  jobMeta: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 8,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E40AF',
    marginTop: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  applyButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});