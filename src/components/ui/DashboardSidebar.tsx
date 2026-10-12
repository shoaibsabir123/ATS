import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileEdit,
  ScanSearch,
  FolderKanban,
  Target,
  MailCheck,
  Palette,
  Briefcase,
  CreditCard,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  Sparkles,
  ChevronRight,
  Wand2,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const DashboardSidebar: React.FC<SidebarProps> = ({ isOpenMobile = false, onCloseMobile }) => {
  const { currentRoute, navigate, user, logout, activePlan } = useApp();

  const navigationItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Resume Builder', path: '/dashboard/resume-builder', icon: FileEdit, badge: 'AI' },
    { label: 'Resume Analyzer', path: '/dashboard/resume-analyzer', icon: ScanSearch, badge: 'ATS' },
    { label: 'ATS Score Fixer', path: '/dashboard/ats-fixer', icon: Wand2, badge: 'FIX' },
    { label: 'My Resumes', path: '/dashboard/my-resumes', icon: FolderKanban },
    { label: 'Job Description Matcher', path: '/dashboard/job-matcher', icon: Target },
    { label: 'Cover Letters', path: '/dashboard/cover-letters', icon: MailCheck },
    { label: 'Resume Templates', path: '/dashboard/templates', icon: Palette },
    { label: 'Saved Job Targets', path: '/dashboard/job-targets', icon: Briefcase },
    { label: 'Billing & Plan', path: '/dashboard/billing', icon: CreditCard },
    { label: 'Profile & Career Goals', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
          <div
            onClick={() => handleNav('/dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-blue-100" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">
                Resume<span className="text-blue-400">Pilot</span>
              </span>
              <span className="text-[10px] text-blue-400 font-bold ml-1 uppercase">AI</span>
            </div>
          </div>
        </div>

        {/* Plan Status Widget */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Plan</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {activePlan.name}
            </div>
          </div>
          <button
            onClick={() => handleNav('/dashboard/billing')}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Manage
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navigationItems.map((item) => {
            const isActive = currentRoute === item.path || currentRoute.startsWith(`${item.path}/`);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin link */}
          <div className="pt-3 mt-3 border-t border-slate-800">
            <button
              onClick={() => handleNav('/admin')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                currentRoute.startsWith('/admin')
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-amber-400/90 hover:bg-slate-800 hover:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Console</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                PORTAL
              </span>
            </button>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
