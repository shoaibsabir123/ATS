import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScoreGauge } from '../components/ui/ScoreGauge';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Check,
  X,
  Layers,
  HelpCircle,
  Wand2,
} from 'lucide-react';
import { triggerPrintResume } from '../utils/exportResume';

interface Props {
  analysisId?: string;
}

export const AnalysisReportPage: React.FC<Props> = ({ analysisId }) => {
  const { analyses, resumes, saveResume, addToast, navigate } = useApp();

  const report = analyses.find((a) => a.id === analysisId) || analyses[0];

  const [acceptedRewrites, setAcceptedRewrites] = useState<Record<string, 'accepted' | 'rejected' | 'pending'>>({});

  if (!report) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg">No Analysis Report Found</h3>
        <p className="text-xs text-slate-500 mt-1">Please upload or scan a resume first.</p>
        <button
          onClick={() => navigate('/dashboard/resume-analyzer')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
        >
          Go to Analyzer
        </button>
      </div>
    );
  }

  const handleRewriteAction = (exampleId: string, action: 'accepted' | 'rejected') => {
    setAcceptedRewrites((prev) => ({ ...prev, [exampleId]: action }));
    if (action === 'accepted') {
      addToast('Suggestion accepted! Updating linked resume draft.');
      if (report.resumeId) {
        const resume = resumes.find((r) => r.id === report.resumeId);
        if (resume) {
          saveResume(resume);
        }
      }
    } else {
      addToast('Suggestion rejected.', 'info');
    }
  };

  const categories = report.categoryScores || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              ATS Compatibility Diagnostic Report
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Scoring v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Document: <strong className="text-slate-800">{report.resumeTitle || report.uploadedFileName || 'Resume'}</strong> • Target: {report.jobTargetTitle || 'General'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/ats-fixer', { analysisId: report.id, resumeId: report.resumeId || '' })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Fix Score for Job Description</span>
          </button>
          <button
            onClick={triggerPrintResume}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Prominent ATS Auto-Fix Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Wand2 className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              Auto-Fix Identified Issues as per Target Job Description
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Current ATS Score: <strong>{report.overallScore}/100</strong>. Remediate missing keywords, rewrite passive verbs, and boost your score to 90+.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/ats-fixer', { analysisId: report.id, resumeId: report.resumeId || '' })}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-blue-200 via-white to-blue-200 hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Wand2 className="w-4 h-4 text-blue-800" />
          <span>Launch ATS Fixer Studio →</span>
        </button>
      </div>

      {/* Section A: Overall Score Card (Section 8-A) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estimated ATS Compatibility
            </span>
            <ScoreGauge score={report.overallScore} size="lg" />
            <span className="text-[11px] text-slate-400 mt-2 text-center">
              Product-specific heuristic benchmark
            </span>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Summary Assessment
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                {report.summaryAssessment}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              {/* Strengths */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Top Strengths
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {report.strengths?.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Top Opportunities
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {report.topImprovements?.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section B: 6 Category Rubric Scores */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Category Breakdown (100-Point Rubric)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categories).map(([key, cat]) => {
            const pct = Math.round((cat.score / cat.maxScore) * 100);
            return (
              <div key={key} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{cat.name}</span>
                  <span className="font-extrabold text-blue-700">
                    {cat.score} / {cat.maxScore} pts
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-600' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                {cat.evidence && cat.evidence.length > 0 && (
                  <p className="text-[11px] text-slate-600 italic">
                    Evidence: {cat.evidence[0]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section C: Keyword Analysis (Section 8-C) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Keyword Match & Gap Analysis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Matched */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Matched Industry Keywords ({report.matchedKeywords?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.matchedKeywords?.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs bg-white text-emerald-800 border border-emerald-300 font-medium px-2.5 py-1 rounded-lg"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Missing */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Missing High-Value Terms ({report.missingKeywords?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.missingKeywords?.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs bg-white text-rose-800 border border-rose-300 font-medium px-2.5 py-1 rounded-lg"
                >
                  ✕ {kw}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 italic pt-1">
              * Truthful guidance: Only incorporate terms you possess verified career experience in.
            </p>
          </div>
        </div>
      </div>

      {/* Section D: Actionable Prioritized Improvement Plan (Section 8-G) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Prioritized Actionable Recommendations</span>
        </h3>

        <div className="space-y-3">
          {report.recommendations?.map((rec) => {
            const priorityBadge = {
              high: 'bg-rose-100 text-rose-800 border-rose-200',
              medium: 'bg-amber-100 text-amber-800 border-amber-200',
              low: 'bg-blue-100 text-blue-800 border-blue-200',
            }[rec.priority];

            return (
              <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{rec.issue}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Section: {rec.section}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${priorityBadge}`}>
                    {rec.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Why it matters:</strong> {rec.whyItMatters}
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                  <strong className="text-blue-700 block mb-0.5">Recommended action:</strong>
                  {rec.suggestedCorrection}
                  {rec.exampleRewrite && (
                    <div className="mt-1 pt-1 border-t border-slate-100 font-mono text-[11px] text-slate-800">
                      Sample: "{rec.exampleRewrite}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section E: Before & After Rewrite Switcher (Section 8-H) */}
      {report.beforeAfterExamples && report.beforeAfterExamples.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Interactive Before & After Rewrites</span>
          </h3>
          <p className="text-xs text-slate-500">
            Review side-by-side AI enhancements. Accepting updates will prepare your draft with recruiter-optimized phrasing.
          </p>

          <div className="space-y-4">
            {report.beforeAfterExamples.map((ba) => {
              const currentStatus = acceptedRewrites[ba.id] || ba.status;

              return (
                <div key={ba.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>{ba.section}</span>
                    {currentStatus === 'accepted' ? (
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                        ✓ Accepted
                      </span>
                    ) : currentStatus === 'rejected' ? (
                      <span className="text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        Dismissed
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Original Text</div>
                      <p className="text-slate-700">{ba.originalText}</p>
                    </div>

                    <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                      <div className="text-[10px] uppercase font-bold text-blue-700 mb-1">
                        AI ATS-Optimized Rewrite
                      </div>
                      <p className="text-slate-900 font-medium">{ba.improvedText}</p>
                      <p className="text-[11px] text-blue-800 italic mt-1 pt-1 border-t border-blue-200">
                        {ba.rationale}
                      </p>
                    </div>
                  </div>

                  {currentStatus === 'pending' && (
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => handleRewriteAction(ba.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRewriteAction(ba.id, 'accepted')}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Rewrite</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
