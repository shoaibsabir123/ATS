import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Target,
  FileText,
  Search,
} from 'lucide-react';
import { JobTarget } from '../lib/supabase';

export const JobTargetsPage: React.FC = () => {
  const { jobTargets, saveJobTarget, deleteJobTarget, resumes, navigate, addToast } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [associatedResumeId, setAssociatedResumeId] = useState(resumes[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !jobTitle || !jobDescription) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    const newTarget: JobTarget = {
      id: `target-${Date.now()}`,
      userId: 'user',
      companyName,
      jobTitle,
      jobDescription,
      associatedResumeId,
      matchPercentage: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveJobTarget(newTarget);
    setShowAddModal(false);
    setCompanyName('');
    setJobTitle('');
    setJobDescription('');
    addToast('Target job saved!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Job Targets
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Keep track of open positions, associated tailored resumes, and estimated match scores.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Target</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobTargets.map((target) => {
          const linkedResume = resumes.find((r) => r.id === target.associatedResumeId);

          return (
            <div
              key={target.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{target.jobTitle}</h3>
                    <div className="text-xs font-semibold text-blue-600">{target.companyName}</div>
                  </div>
                  {target.matchPercentage && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {target.matchPercentage}% Match
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                  {target.jobDescription}
                </p>

                {linkedResume && (
                  <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500">Linked Resume:</span>
                    <button
                      onClick={() => navigate(`/dashboard/resume-builder/${linkedResume.id}`)}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {linkedResume.title} →
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px]">
                  Added {new Date(target.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/dashboard/job-matcher')}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Analyze Match
                  </button>
                  <button
                    onClick={() => deleteJobTarget(target.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Add New Job Target</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Amazon, Spotify"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Associated Resume</label>
                <select
                  value={associatedResumeId}
                  onChange={(e) => setAssociatedResumeId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Job Description</label>
                <textarea
                  rows={4}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste requirements..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
