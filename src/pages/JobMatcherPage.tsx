import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Check,
  Wand2,
} from 'lucide-react';
import { JobMatchReport } from '../types/resume';

export const JobMatcherPage: React.FC = () => {
  const { resumes, saveJobTarget, addToast, navigate } = useApp();

  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isMatching, setIsMatching] = useState<boolean>(false);
  const [report, setReport] = useState<JobMatchReport | null>(null);

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleMatch = async () => {
    if (!jobDescription || !jobDescription.trim()) {
      addToast('Please enter or paste the target job description.', 'error');
      return;
    }
    if (!selectedResume) {
      addToast('Please select a resume to match against.', 'error');
      return;
    }

    setIsMatching(true);
    addToast('Comparing resume credentials with job posting...', 'info');

    try {
      const resumePlainText = `
Title: ${selectedResume.title}
Candidate: ${selectedResume.personalInfo.fullName}
Summary: ${selectedResume.summary}
Experience: ${selectedResume.experience.map((e) => `${e.position} at ${e.company}: ${e.bullets.join('. ')}`).join('\n')}
Skills: ${selectedResume.skillCategories.map((c) => `${c.category}: ${c.skills.join(', ')}`).join('\n')}
`;

      const response = await fetch('/api/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumePlainText,
          jobDescription,
          jobTitle: jobTitle || selectedResume.targetJobTitle,
          companyName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run job comparison');
      }

      const resJson = await response.json();
      const matchReport: JobMatchReport = {
        ...resJson.data,
        id: `match-${Date.now()}`,
        resumeId: selectedResume.id,
        jobTitle: jobTitle || 'Target Role',
        companyName,
        createdAt: new Date().toISOString(),
      };

      setReport(matchReport);
      addToast('Job match analysis complete!');
    } catch (err: any) {
      addToast(err.message || 'Job matcher encountered an error', 'error');
    } finally {
      setIsMatching(false);
    }
  };

  const handleSaveJobTarget = () => {
    if (!jobDescription) return;
    saveJobTarget({
      id: `target-${Date.now()}`,
      userId: 'user',
      companyName: companyName || 'Company',
      jobTitle: jobTitle || 'Position',
      jobDescription,
      associatedResumeId: selectedResumeId,
      matchPercentage: report?.matchPercentage || 75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    addToast('Saved to your Job Targets library!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Job Description Matcher
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Paste any job posting to discover exact keyword matches, missing prerequisites, and tailored bullet point suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Select Resume to Compare
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.templateId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Backend Engineer"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Stripe, Netflix..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Job Description (Requirements & Responsibilities)
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleMatch}
              disabled={isMatching || !jobDescription}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
            >
              {isMatching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Matching Qualifications...</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4" />
                  <span>Match Against Resume</span>
                </>
              )}
            </button>
            <button
              onClick={handleSaveJobTarget}
              disabled={!jobDescription}
              className="px-4 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Save Job Target"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Panel: Match Results */}
        <div className="lg:col-span-6 space-y-4">
          {report ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {/* Match Score Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-blue-50/80 border border-blue-200 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    Estimated Match Rate
                  </span>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {report.jobTitle} {report.companyName ? `@ ${report.companyName}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-blue-700">
                    {report.matchPercentage}%
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/ats-fixer', { resumeId: report.resumeId, jobTitle: report.jobTitle, jobDescription })}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto-Fix Resume →</span>
                  </button>
                </div>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matching Qualifications
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.matchingSkills?.map((skill, i) => (
                    <span key={i} className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-medium">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Missing or Unclear Requirements
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.missingRequirements?.map((skill, i) => (
                    <span key={i} className="text-xs bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg font-medium">
                      ✕ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary Tailoring Advice */}
              {report.summaryFeedback && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <strong className="text-slate-800 block mb-1">Recommended Summary Angle:</strong>
                  <p className="text-slate-600 leading-relaxed">{report.summaryFeedback}</p>
                </div>
              )}

              {/* Experience Suggestions */}
              {report.experienceSuggestions && report.experienceSuggestions.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Tailored Bullet Suggestions:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {report.experienceSuggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="text-blue-600 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Target className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">No Job Comparison Ran Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Paste the job requirements on the left to analyze how your resume stacks up against the posting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
