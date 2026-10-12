import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ResumeData,
  ResumeAnalysisReport,
  UserProfile,
  SubscriptionPlan,
  CoverLetter,
  ResumeTemplateId,
} from '../types/resume';
import {
  getCurrentUser,
  saveCurrentUser,
  getStoredResumes,
  saveResume as dbSaveResume,
  deleteResume as dbDeleteResume,
  duplicateResume as dbDuplicateResume,
  getStoredAnalyses,
  saveAnalysis as dbSaveAnalysis,
  deleteAnalysis as dbDeleteAnalysis,
  getStoredJobTargets,
  saveJobTarget as dbSaveJobTarget,
  deleteJobTarget as dbDeleteJobTarget,
  getStoredCoverLetters,
  saveCoverLetter as dbSaveCoverLetter,
  deleteCoverLetter as dbDeleteCoverLetter,
  DEFAULT_PLANS,
  JobTarget,
  recordAuditLog,
} from '../lib/supabase';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: UserProfile | null;
  plans: SubscriptionPlan[];
  activePlan: SubscriptionPlan;
  resumes: ResumeData[];
  analyses: ResumeAnalysisReport[];
  jobTargets: JobTarget[];
  coverLetters: CoverLetter[];
  currentRoute: string;
  routeParams: Record<string, string>;
  toasts: ToastMessage[];
  // Navigation
  navigate: (path: string, params?: Record<string, string | undefined>) => void;
  // Auth
  login: (email: string, role?: 'user' | 'admin') => void;
  register: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  // Resumes
  saveResume: (resume: ResumeData) => ResumeData;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => ResumeData | null;
  createNewResume: (targetJobTitle?: string) => ResumeData;
  // Analyses
  saveAnalysis: (report: ResumeAnalysisReport) => ResumeAnalysisReport;
  deleteAnalysis: (id: string) => void;
  // Job Targets
  saveJobTarget: (target: JobTarget) => JobTarget;
  deleteJobTarget: (id: string) => void;
  // Cover Letters
  saveCoverLetter: (letter: CoverLetter) => CoverLetter;
  deleteCoverLetter: (id: string) => void;
  // Plan / Billing
  upgradePlan: (planId: 'free' | 'pro' | 'premium') => void;
  checkQuota: (feature: 'resumes' | 'analyses' | 'jobMatches' | 'coverLetters') => boolean;
  // Toast
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [resumes, setResumes] = useState<ResumeData[]>(() => getStoredResumes());
  const [analyses, setAnalyses] = useState<ResumeAnalysisReport[]>(() => getStoredAnalyses());
  const [jobTargets, setJobTargets] = useState<JobTarget[]>(() => getStoredJobTargets());
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>(() => getStoredCoverLetters());
  const [plans] = useState<SubscriptionPlan[]>(DEFAULT_PLANS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Simple client-side routing
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '/' ? path : '/';
    }
    return '/';
  });
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, params: Record<string, string | undefined> = {}) => {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) cleanParams[k] = v;
    });
    setRouteParams(cleanParams);
    setCurrentRoute(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activePlan = plans.find((p) => p.id === (user?.planId || 'free')) || plans[0];

  const checkQuota = (feature: 'resumes' | 'analyses' | 'jobMatches' | 'coverLetters'): boolean => {
    if (!user) return false;
    const limits = activePlan.limits;
    switch (feature) {
      case 'resumes':
        return resumes.length < limits.resumesMax;
      case 'analyses':
        return analyses.length < limits.analysesPerMonth;
      case 'jobMatches':
        return jobTargets.length < limits.jobMatchesPerMonth;
      case 'coverLetters':
        return coverLetters.length < limits.coverLettersPerMonth;
      default:
        return true;
    }
  };

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      role,
      planId: role === 'admin' ? 'premium' : 'pro',
      resumesCount: resumes.length,
      analysesCount: analyses.length,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveCurrentUser(newUser);
    recordAuditLog('USER_LOGIN', 'auth', `User signed in: ${email}`);
    addToast(`Welcome back, ${newUser.fullName}!`);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  const register = (email: string, name: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: name || email.split('@')[0],
      role: 'user',
      planId: 'free',
      resumesCount: 0,
      analysesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    saveCurrentUser(newUser);
    recordAuditLog('USER_REGISTERED', 'auth', `New user registered: ${email}`);
    addToast('Account created successfully! Welcome to ResumePilot AI.');
    navigate('/dashboard');
  };

  const logout = () => {
    recordAuditLog('USER_LOGOUT', 'auth', `User signed out: ${user?.email}`);
    setUser(null);
    saveCurrentUser(null);
    addToast('You have signed out.', 'info');
    navigate('/');
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...profileData };
    setUser(updated);
    saveCurrentUser(updated);
    addToast('Profile updated successfully.');
  };

  const upgradePlan = (planId: 'free' | 'pro' | 'premium') => {
    if (!user) return;
    const updated = { ...user, planId };
    setUser(updated);
    saveCurrentUser(updated);
    recordAuditLog('PLAN_UPGRADED', 'billing', `Upgraded to plan: ${planId}`);
    addToast(`Successfully switched to ${plans.find((p) => p.id === planId)?.name}!`);
  };

  const saveResume = (resume: ResumeData): ResumeData => {
    const saved = dbSaveResume(resume);
    setResumes(getStoredResumes());
    return saved;
  };

  const deleteResume = (id: string) => {
    dbDeleteResume(id);
    setResumes(getStoredResumes());
    recordAuditLog('RESUME_DELETED', 'resume', `Deleted resume: ${id}`);
    addToast('Resume deleted successfully.', 'info');
  };

  const duplicateResume = (id: string): ResumeData | null => {
    const dup = dbDuplicateResume(id);
    if (dup) {
      setResumes(getStoredResumes());
      addToast('Resume duplicated successfully.');
    }
    return dup;
  };

  const createNewResume = (targetJobTitle = ''): ResumeData => {
    const newResume: ResumeData = {
      id: `resume-${Date.now()}`,
      title: targetJobTitle ? `${targetJobTitle} Resume` : 'My Professional Resume',
      templateId: 'classic-professional',
      targetJobTitle: targetJobTitle || user?.targetJobTitle || '',
      personalInfo: {
        fullName: user?.fullName || 'Full Name',
        email: user?.email || '',
        phone: '',
        location: '',
      },
      summary: '',
      experience: [],
      education: [],
      skillCategories: [
        { category: 'Technical Skills', skills: [] },
        { category: 'Core Competencies', skills: [] },
      ],
      certifications: [],
      projects: [],
      additionalSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveResume(newResume);
    recordAuditLog('RESUME_CREATED', 'resume', `Created resume: ${newResume.id}`);
    return newResume;
  };

  const saveAnalysis = (report: ResumeAnalysisReport): ResumeAnalysisReport => {
    const saved = dbSaveAnalysis(report);
    setAnalyses(getStoredAnalyses());
    setResumes(getStoredResumes());
    return saved;
  };

  const deleteAnalysis = (id: string) => {
    dbDeleteAnalysis(id);
    setAnalyses(getStoredAnalyses());
    addToast('Analysis report deleted.', 'info');
  };

  const saveJobTarget = (target: JobTarget): JobTarget => {
    const saved = dbSaveJobTarget(target);
    setJobTargets(getStoredJobTargets());
    return saved;
  };

  const deleteJobTarget = (id: string) => {
    dbDeleteJobTarget(id);
    setJobTargets(getStoredJobTargets());
    addToast('Job target removed.', 'info');
  };

  const saveCoverLetter = (letter: CoverLetter): CoverLetter => {
    const saved = dbSaveCoverLetter(letter);
    setCoverLetters(getStoredCoverLetters());
    return saved;
  };

  const deleteCoverLetter = (id: string) => {
    dbDeleteCoverLetter(id);
    setCoverLetters(getStoredCoverLetters());
    addToast('Cover letter deleted.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        plans,
        activePlan,
        resumes,
        analyses,
        jobTargets,
        coverLetters,
        currentRoute,
        routeParams,
        toasts,
        navigate,
        login,
        register,
        logout,
        updateProfile,
        saveResume,
        deleteResume,
        duplicateResume,
        createNewResume,
        saveAnalysis,
        deleteAnalysis,
        saveJobTarget,
        deleteJobTarget,
        saveCoverLetter,
        deleteCoverLetter,
        upgradePlan,
        checkQuota,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
