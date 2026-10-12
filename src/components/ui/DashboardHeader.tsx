import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Plus, ScanSearch, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { currentRoute, navigate, resumes, activePlan, checkQuota } = useApp();

  const getPageTitle = () => {
    if (currentRoute === '/dashboard') return 'Dashboard Overview';
    if (currentRoute.startsWith('/dashboard/resume-builder')) return 'AI Resume Builder';
    if (currentRoute.startsWith('/dashboard/resume-analyzer') || currentRoute.startsWith('/dashboard/analysis'))
      return 'ATS Resume Analyzer';
    if (currentRoute.startsWith('/dashboard/ats-fixer')) return 'AI ATS Score Fixer';
    if (currentRoute.startsWith('/dashboard/my-resumes')) return 'My Resumes';
    if (currentRoute.startsWith('/dashboard/job-matcher')) return 'Job Description Matcher';
    if (currentRoute.startsWith('/dashboard/cover-letters')) return 'Cover Letter Generator';
    if (currentRoute.startsWith('/dashboard/templates')) return 'Resume Templates';
    if (currentRoute.startsWith('/dashboard/job-targets')) return 'Saved Job Targets';
    if (currentRoute.startsWith('/dashboard/billing')) return 'Subscription & Billing';
    if (currentRoute.startsWith('/dashboard/profile')) return 'Profile & Career Goals';
    if (currentRoute.startsWith('/dashboard/settings')) return 'Settings';
    if (currentRoute.startsWith('/admin')) return 'Administrator Console';
    return 'ResumePilot AI';
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate('/dashboard/resume-analyzer')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors"
        >
          <ScanSearch className="w-3.5 h-3.5 text-blue-600" />
          Analyze Resume
        </button>

        <button
          onClick={() => navigate('/dashboard/resume-builder')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>New Resume</span>
        </button>
      </div>
    </header>
  );
};
