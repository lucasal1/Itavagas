import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Filter, MapPin, DollarSign, Clock } from 'lucide-react-native';

export default function SearchJobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buscar Vagas</Text>
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
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#1E40AF" size={20} />
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
              <TouchableOpacity key={location} style={styles.locationItem}>
                <MapPin color="#64748B" size={16} />
                <Text style={styles.locationText}>{location}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Faixa Salarial</Text>
          <View style={styles.salaryRanges}>
            {[
              'Até R$ 2.000',
              'R$ 2.000 - R$ 4.000',
              'R$ 4.000 - R$ 6.000',
              'Acima de R$ 6.000',
              'A combinar'
            ].map((range) => (
              <TouchableOpacity key={range} style={styles.salaryItem}>
                <DollarSign color="#64748B" size={16} />
                <Text style={styles.salaryText}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchButton}>
          <TouchableOpacity style={styles.primaryButton}>
            <SearchIcon color="#FFFFFF" size={20} />
            <Text style={styles.primaryButtonText}>Buscar Vagas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSearches}>
          <Text style={styles.sectionTitle}>Buscas Recentes</Text>
          <View style={styles.recentItem}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.recentText}>Desenvolvedor</Text>
          </View>
          <View style={styles.recentItem}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.recentText}>Vendedor Paulo Afonso</Text>
          </View>
          <View style={styles.recentItem}>
            <Clock color="#64748B" size={16} />
            <Text style={styles.recentText}>Assistente Administrativo</Text>
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
  },
  content: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  filtersSection: {
    paddingHorizontal: 24,
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
    backgroundColor: '#FFFFFF',
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
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  salaryRanges: {
    gap: 12,
  },
  salaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
  },
  salaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
  },
  searchButton: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  recentSearches: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  recentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  bottomPadding: {
    height: 20,
  },
});