import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Filter, MapPin, DollarSign, Clock, X } from 'lucide-react-native';
import { useJobs } from '@/contexts/JobsContext';
import JobCard from '@/components/JobCard';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/contexts/NotificationContext';

export default function SearchJobs() {
  const router = useRouter();
  const { jobs, applyToJob, incrementJobViews } = useJobs();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSalary, setSelectedSalary] = useState<string>('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    'Presencial',
    'Remoto',
    'Híbrido',
    'CLT',
    'PJ',
    'Estágio',
    'Freelance',
  ];

  const locations = [
    'Paulo Afonso, BA',
    'Glória, BA', 
    'Chorrochó, BA',
    'Macururé, BA',
    'Rodelas, BA',
  ];

  const salaryRanges = [
    'Até R$ 2.000',
    'R$ 2.000 - R$ 4.000',
    'R$ 4.000 - R$ 6.000',
    'Acima de R$ 6.000',
    'A combinar'
  ];

  const recentSearches = [
    'Desenvolvedor',
    'Vendedor Paulo Afonso',
    'Assistente Administrativo',
    'Técnico',
    'Operador'
  ];

  useEffect(() => {
    filterJobs();
  }, [searchQuery, activeFilters, selectedLocation, selectedSalary, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    // Filtro por texto de busca
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtro por tipo de vaga
    if (activeFilters.length > 0) {
      filtered = filtered.filter(job =>
        activeFilters.some(filter =>
          job.type.toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Filtro por localização
    if (selectedLocation) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filtro por salário
    if (selectedSalary && selectedSalary !== 'A combinar') {
      filtered = filtered.filter(job => {
        if (!job.salary) return selectedSalary === 'A combinar';
        
        const salary = job.salary.toLowerCase();
        switch (selectedSalary) {
          case 'Até R$ 2.000':
            return salary.includes('1.') || salary.includes('2.000') || salary.includes('até');
          case 'R$ 2.000 - R$ 4.000':
            return salary.includes('2.') || salary.includes('3.') || salary.includes('4.000');
          case 'R$ 4.000 - R$ 6.000':
            return salary.includes('4.') || salary.includes('5.') || salary.includes('6.000');
          case 'Acima de R$ 6.000':
            return salary.includes('6.') || salary.includes('7.') || salary.includes('8.') || 
                   salary.includes('9.') || salary.includes('10.');
          default:
            return true;
        }
      });
    }

    setFilteredJobs(filtered);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSelectedLocation('');
    setSelectedSalary('');
    setSearchQuery('');
  };

  const handleJobPress = (jobId: string) => {
    incrementJobViews(jobId);
    router.push(`/(shared)/job-details?id=${jobId}`);
  };

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      addNotification({
        title: 'Candidatura enviada!',
        message: 'Sua candidatura foi enviada com sucesso.',
        type: 'success',
      });
    } catch (error: any) {
      addNotification({
        title: 'Erro na candidatura',
        message: error.message || 'Não foi possível enviar sua candidatura.',
        type: 'error',
      });
    }
  };

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Vagas</Text>
        <Text style={styles.headerSubtitle}>
          {filteredJobs.length} vagas encontradas
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <SearchIcon color="#64748B" size={20} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cargo, empresa ou palavra-chave"
              placeholderTextColor="#94A3B8"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.filterButton, showFilters && styles.activeFilterButton]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter color={showFilters ? "#FFFFFF" : "#1E40AF"} size={20} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersPanel}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filtros</Text>
              <TouchableOpacity onPress={clearAllFilters}>
                <Text style={styles.clearFilters}>Limpar tudo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filtersSection}>
              <Text style={styles.sectionTitle}>Tipo de Vaga</Text>
              <View style={styles.filtersContainer}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      activeFilters.includes(filter) && styles.activeFilterChip
                    ]}
                    onPress={() => toggleFilter(filter)}
                  >
                    <Text style={[
                      styles.filterText,
                      activeFilters.includes(filter) && styles.activeFilterText
                    ]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filtersSection}>
              <Text style={styles.sectionTitle}>Localização</Text>
              <View style={styles.locationsContainer}>
                {locations.map((location) => (
                  <TouchableOpacity 
                    key={location} 
                    style={[
                      styles.locationItem,
                      selectedLocation === location && styles.selectedLocationItem
                    ]}
                    onPress={() => setSelectedLocation(selectedLocation === location ? '' : location)}
                  >
                    <MapPin color={selectedLocation === location ? "#1E40AF" : "#64748B"} size={16} />
                    <Text style={[
                      styles.locationText,
                      selectedLocation === location && styles.selectedLocationText
                    ]}>
                      {location}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filtersSection}>
              <Text style={styles.sectionTitle}>Faixa Salarial</Text>
              <View style={styles.salaryRanges}>
                {salaryRanges.map((range) => (
                  <TouchableOpacity 
                    key={range} 
                    style={[
                      styles.salaryItem,
                      selectedSalary === range && styles.selectedSalaryItem
                    ]}
                    onPress={() => setSelectedSalary(selectedSalary === range ? '' : range)}
                  >
                    <DollarSign color={selectedSalary === range ? "#1E40AF" : "#64748B"} size={16} />
                    <Text style={[
                      styles.salaryText,
                      selectedSalary === range && styles.selectedSalaryText
                    ]}>
                      {range}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {searchQuery.length === 0 && activeFilters.length === 0 && !selectedLocation && !selectedSalary && (
          <View style={styles.recentSearches}>
            <Text style={styles.sectionTitle}>Buscas Populares</Text>
            <View style={styles.recentSearchesContainer}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearch(search)}
                >
                  <Clock color="#64748B" size={16} />
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {filteredJobs.length > 0 ? (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {filteredJobs.length} vaga{filteredJobs.length !== 1 ? 's' : ''} encontrada{filteredJobs.length !== 1 ? 's' : ''}
            </Text>
            <View style={styles.jobsList}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onPress={() => handleJobPress(job.id)}
                  onApply={() => handleApply(job.id)}
                  showApplyButton={true}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.noResults}>
            <SearchIcon color="#94A3B8" size={48} />
            <Text style={styles.noResultsTitle}>Nenhuma vaga encontrada</Text>
            <Text style={styles.noResultsDescription}>
              Tente ajustar os filtros ou usar palavras-chave diferentes
            </Text>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
              <Text style={styles.clearFiltersButtonText}>Limpar filtros</Text>
            </TouchableOpacity>
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
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterButton: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filtersPanel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F1F5F9',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  clearFilters: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  locationsContainer: {
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedLocationItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E40AF',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  selectedLocationText: {
    color: '#1E40AF',
    fontFamily: 'Inter-Medium',
  },
  salaryRanges: {
    gap: 8,
  },
  salaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSalaryItem: {
    backgroundColor: '#EFF6FF',
    borderColor: '#1E40AF',
  },
  salaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  selectedSalaryText: {
    color: '#1E40AF',
    fontFamily: 'Inter-Medium',
  },
  recentSearches: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  recentSearchesContainer: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  resultsSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  jobsList: {
    gap: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  clearFiltersButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 20,
  },
});