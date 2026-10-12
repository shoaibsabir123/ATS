import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Copy,
  Trash2,
  Download,
  Printer,
  ScanSearch,
  ExternalLink,
  SlidersHorizontal,
  Wand2,
} from 'lucide-react';
import { downloadDocxResume } from '../utils/exportResume';

export const MyResumesPage: React.FC = () => {
  const { resumes, createNewResume, duplicateResume, deleteResume, navigate, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'updated' | 'score' | 'title'>('updated');

  const filtered = resumes
    .filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.targetJobTitle || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTemplate = templateFilter === 'all' || r.templateId === templateFilter;
      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'score') return (b.lastAnalysisScore || 0) - (a.lastAnalysisScore || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const handleDownloadDocx = async (e: React.MouseEvent, resData: any) => {
    e.stopPropagation();
    addToast('Generating editable Word file...', 'info');
    const res = await downloadDocxResume(resData);
    if (res.success) {
      addToast('Word document downloaded!');
    } else {
      addToast(res.message || 'Download failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Resume Library
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Manage your tailored resume variations, export files, or run instant ATS scans.
          </p>
        </div>
        <button
          onClick={() => {
            const newRes = createNewResume();
            navigate(`/dashboard/resume-builder/${newRes.id}`);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Resume</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes by title or job target..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="all">All Templates</option>
            <option value="classic-professional">Classic Professional</option>
            <option value="modern-minimal">Modern Minimal</option>
            <option value="corporate-executive">Corporate Executive</option>
            <option value="technical-engineering">Technical & Engineering</option>
            <option value="graduate-entry">Graduate & Entry-Level</option>
            <option value="creative-professional">Creative Professional</option>
          </select>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
          >
            <option value="updated">Recently Updated</option>
            <option value="score">Highest ATS Score</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((resume) => (
          <div
            key={resume.id}
            onClick={() => navigate(`/dashboard/resume-builder/${resume.id}`)}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                  {resume.title}
                </h3>
                {resume.lastAnalysisScore ? (
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {resume.lastAnalysisScore}/100
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
                    Unscanned
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 space-y-1 mb-4">
                <div>Target: <strong className="text-slate-700">{resume.targetJobTitle || 'General'}</strong></div>
                <div>Template: <span className="font-mono text-[11px] text-slate-600">{resume.templateId}</span></div>
                <div>Modified: {new Date(resume.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/dashboard/resume-analyzer');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  title="Scan with ATS Analyzer"
                >
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/dashboard/ats-fixer', { resumeId: resume.id, jobTitle: resume.targetJobTitle || '' });
                  }}
                  className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  title="Fix ATS Score for Target Job Description"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Fix ATS</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateResume(resume.id);
                  }}
                  title="Duplicate Resume"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDownloadDocx(e, resume)}
                  title="Download Word (.docx)"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${resume.title}"?`)) {
                      deleteResume(resume.id);
                    }
                  }}
                  title="Delete Resume"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No matching resumes found</h4>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or create a fresh draft.</p>
        </div>
      )}
    </div>
  );
};
