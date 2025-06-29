import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Clock, 
  Star,
  Eye,
  MessageCircle,
  Download
} from 'lucide-react-native';

interface Candidate {
  id: string;
  name: string;
  location: string;
  experience: string;
  skills: string[];
  appliedAt: Date;
  jobTitle: string;
  rating: number;
  status: 'new' | 'viewed' | 'shortlisted' | 'rejected';
}

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [candidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'João Silva',
      location: 'Paulo Afonso, BA',
      experience: '3 anos',
      skills: ['React', 'JavaScript', 'Node.js'],
      appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      jobTitle: 'Desenvolvedor Frontend',
      rating: 4.5,
      status: 'new',
    },
    {
      id: '2',
      name: 'Maria Santos',
      location: 'Glória, BA',
      experience: '2 anos',
      skills: ['Excel', 'Administração', 'Atendimento'],
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      jobTitle: 'Assistente Administrativo',
      rating: 4.2,
      status: 'viewed',
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      location: 'Chorrochó, BA',
      experience: '5 anos',
      skills: ['Vendas', 'Relacionamento', 'Negociação'],
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      jobTitle: 'Vendedor',
      rating: 4.8,
      status: 'shortlisted',
    },
  ]);

  const filters = [
    { key: 'all', label: 'Todos', count: candidates.length },
    { key: 'new', label: 'Novos', count: candidates.filter(c => c.status === 'new').length },
    { key: 'viewed', label: 'Visualizados', count: candidates.filter(c => c.status === 'viewed').length },
    { key: 'shortlisted', label: 'Pré-selecionados', count: candidates.filter(c => c.status === 'shortlisted').length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#10B981';
      case 'viewed': return '#3B82F6';
      case 'shortlisted': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'viewed': return 'Visualizado';
      case 'shortlisted': return 'Pré-selecionado';
      case 'rejected': return 'Rejeitado';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Ontem';
    return `${diffInDays} dias atrás`;
  };

  const filteredCandidates = activeFilter === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Candidatos</Text>
        <Text style={styles.headerSubtitle}>
          {candidates.length} candidatos encontrados
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search color="#64748B" size={20} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar candidatos..."
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#1E40AF" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                activeFilter === filter.key && styles.activeFilterChip
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
        {filteredCandidates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum candidato encontrado</Text>
            <Text style={styles.emptyDescription}>
              Não há candidatos com este filtro no momento.
            </Text>
          </View>
        ) : (
          <View style={styles.candidatesList}>
            {filteredCandidates.map((candidate) => (
              <TouchableOpacity key={candidate.id} style={styles.candidateCard}>
                <View style={styles.candidateHeader}>
                  <View style={styles.candidateAvatar}>
                    <User color="#FFFFFF" size={20} />
                  </View>
                  
                  <View style={styles.candidateInfo}>
                    <View style={styles.candidateNameRow}>
                      <Text style={styles.candidateName}>{candidate.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(candidate.status)}15` }]}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(candidate.status) }]} />
                        <Text style={[styles.statusText, { color: getStatusColor(candidate.status) }]}>
                          {getStatusText(candidate.status)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.candidateDetails}>
                      <View style={styles.candidateDetail}>
                        <MapPin color="#64748B" size={14} />
                        <Text style={styles.candidateDetailText}>{candidate.location}</Text>
                      </View>
                      <View style={styles.candidateDetail}>
                        <Clock color="#64748B" size={14} />
                        <Text style={styles.candidateDetailText}>{candidate.experience}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={styles.jobTitle}>Candidato para: {candidate.jobTitle}</Text>

                <View style={styles.skillsContainer}>
                  {candidate.skills.slice(0, 3).map((skill, index) => (
                    <View key={index} style={styles.skillTag}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Text style={styles.moreSkills}>+{candidate.skills.length - 3}</Text>
                  )}
                </View>

                <View style={styles.candidateFooter}>
                  <View style={styles.ratingContainer}>
                    <Star color="#F59E0B" size={16} fill="#F59E0B" />
                    <Text style={styles.ratingText}>{candidate.rating}</Text>
                  </View>
                  
                  <Text style={styles.appliedDate}>
                    Candidatou-se {formatDate(candidate.appliedAt)}
                  </Text>
                </View>

                <View style={styles.candidateActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Eye color="#64748B" size={16} />
                    <Text style={styles.actionButtonText}>Ver Perfil</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Download color="#64748B" size={16} />
                    <Text style={styles.actionButtonText}>Currículo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.primaryActionButton}>
                    <MessageCircle color="#FFFFFF" size={16} />
                    <Text style={styles.primaryActionButtonText}>Contatar</Text>
                  </TouchableOpacity>
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 8,
  },
  activeFilterChip: {
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
  candidatesList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 16,
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  candidateHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  candidateAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E40AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  candidateName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
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
  candidateDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  candidateDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  candidateDetailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  moreSkills: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  candidateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
  },
  appliedDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  candidateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#1E40AF',
    gap: 6,
  },
  primaryActionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});