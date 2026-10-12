import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Upload,
  FileText,
  ScanSearch,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  X,
  Target,
  Wand2,
} from 'lucide-react';
import { ResumeAnalysisReport } from '../types/resume';

export const ResumeAnalyzerPage: React.FC = () => {
  const { resumes, saveAnalysis, navigate, addToast, user } = useApp();

  const [uploadMethod, setUploadMethod] = useState<'upload' | 'select'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(resumes[0]?.id || '');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [targetTitle, setTargetTitle] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      addToast('Please upload a valid PDF or Word (.docx) document.', 'error');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      addToast('File exceeds 10MB maximum limit.', 'error');
      return;
    }
    setFile(f);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      let extractedResumeText = '';
      let analyzedResumeTitle = 'Uploaded Resume';
      let linkedResumeId: string | undefined = undefined;

      if (uploadMethod === 'upload') {
        if (!file) {
          addToast('Please select or upload a resume file.', 'error');
          setIsAnalyzing(false);
          return;
        }

        setAnalysisStep('1/4 Extracting document text securely...');
        const formData = new FormData();
        formData.append('file', file);

        const extractRes = await fetch('/api/documents/extract-text', {
          method: 'POST',
          body: formData,
        });

        if (!extractRes.ok) {
          const errData = await extractRes.json();
          throw new Error(errData.error || 'Failed to extract text from document');
        }

        const extractData = await extractRes.json();
        extractedResumeText = extractData.text;
        analyzedResumeTitle = file.name;
      } else {
        // From existing saved resume
        const targetResume = resumes.find((r) => r.id === selectedResumeId);
        if (!targetResume) {
          addToast('Selected resume not found.', 'error');
          setIsAnalyzing(false);
          return;
        }
        analyzedResumeTitle = targetResume.title;
        linkedResumeId = targetResume.id;
        extractedResumeText = `
Name: ${targetResume.personalInfo.fullName}
Email: ${targetResume.personalInfo.email} | Phone: ${targetResume.personalInfo.phone}
Location: ${targetResume.personalInfo.location}
Summary: ${targetResume.summary}

Experience:
${targetResume.experience.map((e) => `${e.position} at ${e.company} (${e.startDate} - ${e.isCurrent ? 'Present' : e.endDate}):\n${e.bullets.join('\n')}`).join('\n\n')}

Education:
${targetResume.education.map((ed) => `${ed.degree} in ${ed.fieldOfStudy}, ${ed.institution}`).join('\n')}

Skills:
${targetResume.skillCategories.map((c) => `${c.category}: ${c.skills.join(', ')}`).join('\n')}
`;
      }

      setAnalysisStep('2/4 Auditing structural parsing & layout rules...');
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep('3/4 Matching keywords against applicant benchmarks...');
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedResumeText,
          jobDescription,
          targetTitle: targetTitle || user?.targetJobTitle || 'Software Professional',
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Failed to complete AI diagnostic');
      }

      setAnalysisStep('4/4 Synthesizing 100-point compatibility score...');
      const analysisJson = await response.json();

      const newReport: ResumeAnalysisReport = {
        ...analysisJson.data,
        id: `analysis-${Date.now()}`,
        userId: user?.id || 'guest',
        resumeId: linkedResumeId,
        resumeTitle: analyzedResumeTitle,
        uploadedFileName: file?.name,
        jobTargetTitle: targetTitle || 'General Industry Standard',
        jobDescription: jobDescription || undefined,
        createdAt: new Date().toISOString(),
      };

      saveAnalysis(newReport);
      addToast('ATS Scan complete! Opening diagnostic report...');
      navigate(`/dashboard/analysis/${newReport.id}`);
    } catch (err: any) {
      console.error('Scan error:', err);
      addToast(err.message || 'An error occurred during resume analysis.', 'error');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI ATS Resume Compatibility Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Evaluate structural readability, identify missing critical keywords, and receive an estimated ATS compatibility score out of 100.
        </p>
      </div>

      {/* Upload card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Source Switcher */}
        <div className="flex border-b border-slate-200 pb-3 gap-4 text-xs font-bold">
          <button
            onClick={() => setUploadMethod('upload')}
            className={`pb-2 transition-colors cursor-pointer ${
              uploadMethod === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload PDF or Word Document
          </button>
          <button
            onClick={() => setUploadMethod('select')}
            className={`pb-2 transition-colors cursor-pointer ${
              uploadMethod === 'select'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Select from Saved Resumes ({resumes.length})
          </button>
        </div>

        {uploadMethod === 'upload' ? (
          <div>
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  Drag and drop your resume file here
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Supports PDF or Word (.docx, .doc) up to 10MB
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-colors">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{file.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • Ready for AI extraction
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Choose Saved Resume
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.templateId})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Optional Target Job Info */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Target Job Description (Optional but Highly Recommended)</span>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="e.g. Senior Product Manager, Lead Cloud Architect"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Paste Job Description
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the requirements section of the job posting to analyze keyword matching..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 leading-relaxed"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing || (uploadMethod === 'upload' && !file)}
            className="flex-1 py-3.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{analysisStep || 'Analyzing Document...'}</span>
              </>
            ) : (
              <>
                <ScanSearch className="w-4 h-4" />
                <span>Run Full ATS Compatibility Scan</span>
              </>
            )}
          </button>
          <button
            onClick={() =>
              navigate('/dashboard/ats-fixer', {
                resumeId: uploadMethod === 'select' ? selectedResumeId : undefined,
                jobTitle: targetTitle,
                jobDescription,
              })
            }
            className="py-3.5 px-5 rounded-xl text-xs font-bold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Jump to ATS Score Fixer & Rewriter Studio"
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Open ATS Score Fixer Studio</span>
          </button>
        </div>

        {/* Disclaimer Notice (Section 8) */}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed">
          * Note: The compatibility score is an application-specific heuristic based on recognized ATS parsing rules and recruiter screening standards. It does not represent an official or universal score used by all employers.
        </p>
      </div>
    </div>
  );
};
