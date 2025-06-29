import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  employerId: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  views: number;
  postedAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  employerId: string; // Added employerId for better querying
  status: 'pending' | 'viewed' | 'interview' | 'rejected' | 'hired';
  appliedAt: Date;
  statusMessage?: string;
  jobTitle: string;
  company: string;
}

interface JobsContextType {
  jobs: Job[];
  applications: Application[];
  loading: boolean;
  createJob: (jobData: Omit<Job, 'id' | 'employerId' | 'applicants' | 'views' | 'postedAt' | 'updatedAt'>) => Promise<void>;
  updateJob: (jobId: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: Application['status'], message?: string) => Promise<void>;
  incrementJobViews: (jobId: string) => Promise<void>;
}

const JobsContext = createContext<JobsContextType>({
  jobs: [],
  applications: [],
  loading: true,
  createJob: async () => {},
  updateJob: async () => {},
  deleteJob: async () => {},
  applyToJob: async () => {},
  updateApplicationStatus: async () => {},
  incrementJobViews: async () => {},
});

export const useJobs = () => {
  return useContext(JobsContext);
};

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsProvider = ({ children }: JobsProviderProps) => {
  const { user, userType, userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen to jobs
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    console.log('🔄 Setting up jobs listener');
    
    let q;
    if (userType === 'employer') {
      // Employers see only their jobs
      q = query(
        collection(db, 'jobs'),
        where('employerId', '==', user.uid),
        orderBy('postedAt', 'desc')
      );
    } else {
      // Candidates see all active jobs
      q = query(
        collection(db, 'jobs'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: Job[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        jobsData.push({
          id: doc.id,
          title: data.title,
          company: data.company,
          location: data.location,
          salary: data.salary,
          type: data.type,
          description: data.description,
          requirements: data.requirements || [],
          employerId: data.employerId,
          status: data.status,
          applicants: data.applicants || 0,
          views: data.views || 0,
          postedAt: data.postedAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      
      console.log('✅ Jobs loaded:', jobsData.length);
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error loading jobs:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, userType]);

  // Listen to applications
  useEffect(() => {
    if (!user) {
      setApplications([]);
      return;
    }

    console.log('🔄 Setting up applications listener');
    
    let q;
    if (userType === 'candidate') {
      // Candidates see their applications
      q = query(
        collection(db, 'applications'),
        where('candidateId', '==', user.uid),
        orderBy('appliedAt', 'desc')
      );
    } else if (userType === 'employer') {
      // Employers see applications to their jobs
      q = query(
        collection(db, 'applications'),
        where('employerId', '==', user.uid),
        orderBy('appliedAt', 'desc')
      );
    } else {
      // No valid user type, return empty
      setApplications([]);
      return;
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const applicationsData: Application[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        applicationsData.push({
          id: docSnap.id,
          jobId: data.jobId,
          candidateId: data.candidateId,
          candidateName: data.candidateName,
          candidateEmail: data.candidateEmail,
          employerId: data.employerId,
          status: data.status,
          appliedAt: data.appliedAt?.toDate() || new Date(),
          statusMessage: data.statusMessage,
          jobTitle: data.jobTitle,
          company: data.company,
        });
      });
      
      console.log('✅ Applications loaded:', applicationsData.length);
      setApplications(applicationsData);
    }, (error) => {
      console.error('❌ Error loading applications:', error);
    });

    return unsubscribe;
  }, [user, userType]);

  const createJob = async (jobData: Omit<Job, 'id' | 'employerId' | 'applicants' | 'views' | 'postedAt' | 'updatedAt'>) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can create jobs');
    }

    console.log('📝 Creating new job');
    
    try {
      const newJob = {
        ...jobData,
        employerId: user.uid,
        applicants: 0,
        views: 0,
        postedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'jobs'), newJob);
      console.log('✅ Job created successfully');
    } catch (error) {
      console.error('❌ Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can update jobs');
    }

    console.log('📝 Updating job:', jobId);
    
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Job updated successfully');
    } catch (error) {
      console.error('❌ Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can delete jobs');
    }

    console.log('🗑️ Deleting job:', jobId);
    
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      console.log('✅ Job deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      throw error;
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user || userType !== 'candidate' || !userProfile) {
      throw new Error('Only candidates can apply to jobs');
    }

    console.log('📝 Applying to job:', jobId);
    
    try {
      // Check if already applied
      const existingApplication = applications.find(app => app.jobId === jobId);
      if (existingApplication) {
        throw new Error('Você já se candidatou a esta vaga');
      }

      // Get job details
      const job = jobs.find(j => j.id === jobId);
      if (!job) {
        throw new Error('Vaga não encontrada');
      }

      // Create application with employerId
      const applicationData = {
        jobId,
        candidateId: user.uid,
        candidateName: userProfile.name,
        candidateEmail: userProfile.email,
        employerId: job.employerId, // Include employerId for better querying
        status: 'pending' as const,
        appliedAt: Timestamp.now(),
        jobTitle: job.title,
        company: job.company,
      };

      await addDoc(collection(db, 'applications'), applicationData);

      // Increment job applicants count
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        applicants: job.applicants + 1,
        updatedAt: Timestamp.now(),
      });

      console.log('✅ Application submitted successfully');
    } catch (error) {
      console.error('❌ Error applying to job:', error);
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status'], message?: string) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can update application status');
    }

    console.log('📝 Updating application status:', applicationId, status);
    
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      const updates: any = {
        status,
        updatedAt: Timestamp.now(),
      };

      if (message) {
        updates.statusMessage = message;
      }

      await updateDoc(applicationRef, updates);
      console.log('✅ Application status updated successfully');
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      throw error;
    }
  };

  const incrementJobViews = async (jobId: string) => {
    console.log('👁️ Incrementing job views:', jobId);
    
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        views: job.views + 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('❌ Error incrementing job views:', error);
    }
  };

  const value = {
    jobs,
    applications,
    loading,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    updateApplicationStatus,
    incrementJobViews,
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};