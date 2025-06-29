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
  Timestamp,
  limit 
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
  employerId: string;
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

  // Otimizar carregamento de vagas com limite
  useEffect(() => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }

    let q;
    if (userType === 'employer') {
      q = query(
        collection(db, 'jobs'),
        where('employerId', '==', user.uid),
        orderBy('postedAt', 'desc'),
        limit(20) // Limitar para melhor performance
      );
    } else {
      q = query(
        collection(db, 'jobs'),
        where('status', '==', 'active'),
        orderBy('postedAt', 'desc'),
        limit(50) // Limitar vagas ativas
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
      
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error loading jobs:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, userType]);

  // Otimizar carregamento de candidaturas
  useEffect(() => {
    if (!user) {
      setApplications([]);
      return;
    }

    let q;
    if (userType === 'candidate') {
      q = query(
        collection(db, 'applications'),
        where('candidateId', '==', user.uid),
        orderBy('appliedAt', 'desc'),
        limit(30) // Limitar candidaturas
      );
    } else if (userType === 'employer') {
      q = query(
        collection(db, 'applications'),
        where('employerId', '==', user.uid),
        orderBy('appliedAt', 'desc'),
        limit(50) // Limitar candidaturas recebidas
      );
    } else {
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
    } catch (error) {
      console.error('❌ Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can update jobs');
    }

    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('❌ Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can delete jobs');
    }

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      throw error;
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!user || userType !== 'candidate' || !userProfile) {
      throw new Error('Only candidates can apply to jobs');
    }

    try {
      const existingApplication = applications.find(app => app.jobId === jobId);
      if (existingApplication) {
        throw new Error('Você já se candidatou a esta vaga');
      }

      const job = jobs.find(j => j.id === jobId);
      if (!job) {
        throw new Error('Vaga não encontrada');
      }

      const applicationData = {
        jobId,
        candidateId: user.uid,
        candidateName: userProfile.name,
        candidateEmail: userProfile.email,
        employerId: job.employerId,
        status: 'pending' as const,
        appliedAt: Timestamp.now(),
        jobTitle: job.title,
        company: job.company,
      };

      await addDoc(collection(db, 'applications'), applicationData);

      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, {
        applicants: job.applicants + 1,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('❌ Error applying to job:', error);
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status'], message?: string) => {
    if (!user || userType !== 'employer') {
      throw new Error('Only employers can update application status');
    }

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
    } catch (error) {
      console.error('❌ Error updating application status:', error);
      throw error;
    }
  };

  const incrementJobViews = async (jobId: string) => {
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