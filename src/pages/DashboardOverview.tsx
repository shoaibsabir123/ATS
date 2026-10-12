import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  ScanSearch,
  Plus,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
  Download,
  AlertCircle,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { ScoreGauge } from '../components/ui/ScoreGauge';
import { downloadDocxResume, triggerPrintResume } from '../utils/exportResume';

export const DashboardOverview: React.FC = () => {
  const { user, resumes, analyses, activePlan, navigate, duplicateResume, deleteResume, createNewResume, addToast } = useApp();

  const latestAnalysis = analyses[0];
  const latestResume = resumes[0];

  const handleCreateResume = () => {
    const newRes = createNewResume();
    navigate(`/dashboard/resume-builder/${newRes.id}`);
  };

  const handleDownloadDocx = async (e: React.MouseEvent, resData: any) => {
    e.stopPropagation();
    addToast('Generating editable Word document...', 'info');
    const res = await downloadDocxResume(resData);
    if (res.success) {
      addToast('Word document downloaded successfully!');
    } else {
      addToast(res.message || 'Failed to download Word file', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Plan: {activePlan.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Job Seeker'}!
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Targeting: <strong className="text-white">{user?.targetJobTitle || 'Software Professional'}</strong> in {user?.industry || 'Technology'}. Ready to optimize your application materials?
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={handleCreateResume}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Resume</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/ats-fixer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Fix ATS Score for Target Job</span>
            </button>
            <button
              onClick={() => navigate('/dashboard/resume-analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
            >
              <ScanSearch className="w-4 h-4 text-blue-300" />
              <span>Scan Existing Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Score Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Total Resumes</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{resumes.length}</span>
            <span className="text-xs text-slate-400">/ {activePlan.limits.resumesMax} allowed</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (resumes.length / activePlan.limits.resumesMax) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>ATS Scans Completed</span>
            <ScanSearch className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{analyses.length}</span>
            <span className="text-xs text-slate-400">/ {activePlan.limits.analysesPerMonth} mo</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (analyses.length / activePlan.limits.analysesPerMonth) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Latest Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs col-span-1 sm:col-span-2 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Latest ATS Compatibility Score
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {latestAnalysis ? (
                <span>Evaluated for <strong className="text-slate-800">{latestAnalysis.jobTargetTitle || 'Senior Role'}</strong></span>
              ) : (
                <span>No resume analyzed yet</span>
              )}
            </div>
            {latestAnalysis && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => navigate(`/dashboard/analysis/${latestAnalysis.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View Diagnostic →
                </button>
                <button
                  onClick={() => navigate('/dashboard/ats-fixer', { analysisId: latestAnalysis.id, resumeId: latestAnalysis.resumeId || '' })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3 text-amber-600" />
                  <span>Fix Score</span>
                </button>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <ScoreGauge score={latestAnalysis ? latestAnalysis.overallScore : 0} size="sm" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Resumes & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Resumes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Recent Resumes</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/my-resumes')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View all ({resumes.length})
            </button>
          </div>

          <div className="space-y-3">
            {resumes.slice(0, 4).map((resume) => (
              <div
                key={resume.id}
                onClick={() => navigate(`/dashboard/resume-builder/${resume.id}`)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{resume.title}</span>
                    {resume.lastAnalysisScore && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {resume.lastAnalysisScore}/100 ATS
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>Template: {resume.templateId}</span>
                    <span>•</span>
                    <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateResume(resume.id);
                    }}
                    title="Duplicate"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDownloadDocx(e, resume)}
                    title="Download Word (.docx)"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this resume?')) deleteResume(resume.id);
                    }}
                    title="Delete"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {resumes.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No resumes created yet</h4>
                <p className="text-xs text-slate-500 mt-1">Start building your first ATS-friendly resume draft.</p>
                <button
                  onClick={handleCreateResume}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                >
                  Create Resume Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Analysis Reports */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-indigo-600" />
              <span>Diagnostic Reports</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/resume-analyzer')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Run New Scan
            </button>
          </div>

          <div className="space-y-3">
            {analyses.slice(0, 3).map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => navigate(`/dashboard/analysis/${analysis.id}`)}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      {analysis.resumeTitle || analysis.uploadedFileName || 'Resume Scan'}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Target: {analysis.jobTargetTitle || 'General Industry Standard'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-600">
                      {analysis.overallScore}/100
                    </span>
                    <div className="text-[9px] text-slate-400">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {analysis.matchedKeywords.length} keywords matched
                  </span>
                  <span className="text-xs font-bold text-blue-600 hover:underline">
                    View Report →
                  </span>
                </div>
              </div>
            ))}

            {analyses.length === 0 && (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <ScanSearch className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No analysis reports yet</h4>
                <p className="text-xs text-slate-500 mt-1">Upload a PDF or DOCX file to get your ATS compatibility breakdown.</p>
                <button
                  onClick={() => navigate('/dashboard/resume-analyzer')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                >
                  Upload & Scan Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
