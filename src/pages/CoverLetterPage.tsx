import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MailCheck,
  Sparkles,
  Copy,
  Save,
  Trash2,
  FileText,
  Check,
  Send,
} from 'lucide-react';
import { CoverLetter } from '../types/resume';

export const CoverLetterPage: React.FC = () => {
  const { resumes, coverLetters, saveCoverLetter, deleteCoverLetter, addToast, user } = useApp();

  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');
  const [jobTitle, setJobTitle] = useState<string>('Senior Software Engineer');
  const [companyName, setCompanyName] = useState<string>('Stripe');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tone, setTone] = useState<'formal' | 'confident' | 'concise' | 'personable'>('confident');
  const [content, setContent] = useState<string>(() => coverLetters[0]?.content || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const handleGenerate = async () => {
    setIsGenerating(true);
    addToast('Drafting tailored cover letter with Gemini AI...', 'info');

    try {
      const highlights = selectedResume
        ? selectedResume.experience.map((e) => `${e.position} at ${e.company}: ${e.bullets[0] || ''}`)
        : [];

      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeSummary: selectedResume?.summary,
          experienceHighlights: highlights,
          jobDescription,
          jobTitle,
          companyName,
          tone,
        }),
      });

      if (!response.ok) throw new Error('Cover letter generation failed');

      const data = await response.json();
      if (data.success && data.data?.content) {
        setContent(data.data.content);
        addToast('Cover letter generated!');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to draft cover letter', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;
    const newLetter: CoverLetter = {
      id: `cl-${Date.now()}`,
      userId: user?.id || 'guest',
      resumeId: selectedResumeId,
      jobTitle: jobTitle || 'Position',
      companyName: companyName || 'Company',
      tone,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCoverLetter(newLetter);
    addToast('Cover letter saved to library!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    addToast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Cover Letter Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Generate persuasive, tailored cover letters calibrated to company culture and role requirements without fake assertions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Base Resume Achievements
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google, Stripe..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Staff Engineer"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Writing Tone
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['confident', 'formal', 'concise', 'personable'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`py-2 px-3 rounded-lg border font-semibold capitalize transition-all cursor-pointer ${
                    tone === t
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Job Description (Optional)
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting duties to align relevant points..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 leading-relaxed"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Crafting Cover Letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tailored Cover Letter</span>
              </>
            )}
          </button>
        </div>

        {/* Live Editable Letter Document (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 text-sm">Cover Letter Editor</span>
              <span className="text-[11px] text-slate-400 block">
                {content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <textarea
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Generated cover letter content will appear here..."
            className="w-full text-xs sm:text-sm p-4 bg-slate-50/50 rounded-xl border border-slate-200 leading-relaxed font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>
    </div>
  );
};
