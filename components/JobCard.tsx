import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, DollarSign, Clock, Users } from 'lucide-react-native';
import { Job } from '@/contexts/JobsContext';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onApply?: () => void;
  showApplyButton?: boolean;
  showStats?: boolean;
}

export default function JobCard({ 
  job, 
  onPress, 
  onApply, 
  showApplyButton = false,
  showStats = false 
}: JobCardProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Clock color="#64748B" size={16} />
          <Text style={styles.timeText}>{formatTimeAgo(job.postedAt)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MapPin color="#64748B" size={16} />
          <Text style={styles.detailText}>{job.location}</Text>
        </View>
        {job.salary && (
          <View style={styles.detailItem}>
            <DollarSign color="#64748B" size={16} />
            <Text style={styles.detailText}>{job.salary}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      {job.requirements.length > 0 && (
        <View style={styles.requirements}>
          {job.requirements.slice(0, 3).map((requirement, index) => (
            <View key={index} style={styles.requirementTag}>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
          {job.requirements.length > 3 && (
            <Text style={styles.moreRequirements}>+{job.requirements.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.leftFooter}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{job.type}</Text>
          </View>
          {showStats && (
            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Users color="#64748B" size={14} />
                <Text style={styles.statText}>{job.applicants}</Text>
              </View>
            </View>
          )}
        </View>
        
        {showApplyButton && onApply && (
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyButtonText}>Candidatar-se</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  requirementTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  moreRequirements: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#1E40AF',
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
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
});