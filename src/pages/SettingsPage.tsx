import React from 'react';
import { useApp } from '../context/AppContext';
import { Download, Trash2, Shield, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, resumes, analyses, logout, addToast } = useApp();

  const handleExportData = () => {
    const data = {
      user,
      resumes,
      analyses,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResumePilot_Data_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('All personal data exported in JSON format!');
  };

  const handleDeleteAccount = () => {
    if (confirm('WARNING: Are you sure you want to permanently delete your account and all associated resumes and reports? This action cannot be undone.')) {
      localStorage.clear();
      logout();
      addToast('Account and all associated records deleted permanently.', 'info');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account & Privacy Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Manage data export, retention policies, and account security.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Data Portability</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Download a full archive of your profile, resume versions, and ATS analysis diagnostic reports.
          </p>
          <button
            onClick={handleExportData}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download Archive (JSON)</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h3 className="font-bold text-rose-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Danger Zone</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Permanently purge all resume drafts, uploaded files, and your profile from the database.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge All Data & Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
