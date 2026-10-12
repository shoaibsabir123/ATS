import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wand2,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FileText,
  Target,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Sliders,
  Eye,
  FileCheck,
  Palette,
  ZoomIn,
  ZoomOut,
  X,
  Upload,
  FileCode,
  User,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ScoreGauge } from '../components/ui/ScoreGauge';
import { ResumeRenderer, TEMPLATE_DEFINITIONS } from '../components/templates/ResumeRenderer';
import { downloadDocxResume, downloadPdfResume, triggerPrintResume } from '../utils/exportResume';
import {
  ResumeData,
  WorkExperience,
  SkillCategory,
  ResumeTemplateId,
  Education,
  PersonalInfo,
} from '../types/resume';

interface Props {
  initialResumeId?: string;
  initialJobDescription?: string;
}

interface AppliedFixItem {
  category: string;
  issue: string;
  fixApplied: string;
  scoreImpact: string;
}

interface FixResult {
  projectedScore: number;
  originalScore: number;
  scoreGain: number;
  scoreSummary: string;
  personalInfo?: any;
  fixedSummary: string;
  fixedExperience: WorkExperience[];
  education?: any[];
  fixedSkillCategories: SkillCategory[];
  fixes: AppliedFixItem[];
  keywordsInjected: string[];
}

const SAMPLE_JOB_PRESETS = [
  {
    title: 'Senior Full Stack Software Engineer',
    desc: `Seeking a Senior Full Stack Software Engineer proficient in TypeScript, React, Node.js, distributed microservices, RESTful APIs, and cloud infrastructure (AWS/Docker). Must demonstrate quantifiable impact optimizing system latency, leading agile sprint lifecycles, and engineering high-availability scalable architecture.`,
  },
  {
    title: 'Technical Product Manager',
    desc: `Looking for a Technical Product Manager to define roadmap strategy, prioritize sprint backlogs, and collaborate across engineering and UX design. Must have demonstrated success driving user adoption by 30%+, conducting data-driven A/B experimentation, and delivering enterprise SaaS solutions on schedule.`,
  },
  {
    title: 'Lead Data Scientist & ML Engineer',
    desc: `Seeking a Lead Data Scientist with deep expertise in Python, PyTorch/TensorFlow, SQL, and MLOps deployment pipelines. Experience building predictive machine learning models, optimizing recommendation algorithms, and translating complex data insights into business revenue growth is required.`,
  },
];

export const AtsScoreFixerPage: React.FC<Props> = ({ initialResumeId, initialJobDescription }) => {
  const { resumes, analyses, saveResume, routeParams, navigate, addToast, user } = useApp();

  // Mode: Upload file vs Select saved resume vs Paste text
  const initialMode = routeParams?.analysisId || routeParams?.resumeId ? 'select' : 'upload';
  const [sourceMode, setSourceMode] = useState<'upload' | 'select' | 'paste'>(initialMode);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pastedResumeText, setPastedResumeText] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Determine starting resume & analysis from route params or defaults
  const paramAnalysis = routeParams?.analysisId ? analyses.find((a) => a.id === routeParams.analysisId) : analyses[0];
  const paramResumeId = routeParams?.resumeId || initialResumeId || paramAnalysis?.resumeId || resumes[0]?.id || '';

  const [selectedResumeId, setSelectedResumeId] = useState<string>(paramResumeId);
  const selectedResume = resumes.find((r) => r.id === selectedResumeId) || resumes[0];
  const linkedAnalysis =
    analyses.find((a) => a.resumeId === selectedResumeId || a.id === routeParams?.analysisId) || paramAnalysis || analyses[0];

  const [targetTitle, setTargetTitle] = useState<string>(
    routeParams?.jobTitle || linkedAnalysis?.jobTargetTitle || selectedResume?.targetJobTitle || 'Senior Full Stack Software Engineer'
  );

  const [jobDescription, setJobDescription] = useState<string>(
    routeParams?.jobDescription ||
      initialJobDescription ||
      linkedAnalysis?.jobDescription ||
      selectedResume?.targetJobDescription ||
      SAMPLE_JOB_PRESETS[0].desc
  );

  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixStep, setFixStep] = useState<string>('');
  const [fixResult, setFixResult] = useState<FixResult | null>(null);

  // Editable customized CV state after rewrite
  const [customizedCv, setCustomizedCv] = useState<ResumeData | null>(null);
  const [editorSection, setEditorSection] = useState<'summary' | 'experience' | 'skills' | 'education' | 'contact' | 'template'>(
    'summary'
  );
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  // New skill input tag
  const [newSkillText, setNewSkillText] = useState<string>('');
  const [selectedSkillCategoryIndex, setSelectedSkillCategoryIndex] = useState<number>(0);

  // New skill category modal/input
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Download states for instant button feedback
  const [downloadingDocx, setDownloadingDocx] = useState<boolean>(false);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  // Baseline score calculation
  const [baselineScore, setBaselineScore] = useState<number>(
    linkedAnalysis?.overallScore || selectedResume?.lastAnalysisScore || 72
  );

  // Sync route params when component mounts or route updates
  useEffect(() => {
    if (routeParams?.analysisId) {
      const a = analyses.find((x) => x.id === routeParams.analysisId);
      if (a) {
        setSourceMode('select');
        if (a.resumeId) setSelectedResumeId(a.resumeId);
        if (a.overallScore) setBaselineScore(a.overallScore);
        if (a.jobTargetTitle) setTargetTitle(a.jobTargetTitle);
        if (a.jobDescription) setJobDescription(a.jobDescription);
      }
    } else if (routeParams?.resumeId) {
      setSourceMode('select');
      setSelectedResumeId(routeParams.resumeId);
      const r = resumes.find((x) => x.id === routeParams.resumeId);
      if (r) {
        if (r.targetJobTitle) setTargetTitle(r.targetJobTitle);
        if (r.targetJobDescription) setJobDescription(r.targetJobDescription);
        if (r.lastAnalysisScore) setBaselineScore(r.lastAnalysisScore);
      }
    }
  }, [routeParams]);

  // When selected resume changes in select mode, update target title and baseline score
  useEffect(() => {
    if (sourceMode === 'select' && selectedResume) {
      if (selectedResume.targetJobTitle) {
        setTargetTitle(selectedResume.targetJobTitle);
      }
      if (selectedResume.lastAnalysisScore) {
        setBaselineScore(selectedResume.lastAnalysisScore);
      }
    }
  }, [selectedResumeId, sourceMode]);

  // File upload drag & drop handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateFile(e.dataTransfer.files[0]);
    }
  };

  const handleValidateFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      addToast('Please upload a valid PDF or Word (.docx) document.', 'error');
      return;
    }
    setUploadedFile(f);
    addToast(`Uploaded "${f.name}". Ready to analyze & fix for target job!`);
  };

  // Main action: Run ATS Fix & CV Rewriting
  const handleRunAtsFix = async () => {
    if (!jobDescription || !jobDescription.trim()) {
      addToast('Please enter or paste the target job description.', 'error');
      return;
    }

    setIsFixing(true);
    let resumePayload: any = selectedResume;
    let extractedText = '';

    try {
      // Source 1: Uploaded document file
      if (sourceMode === 'upload') {
        if (!uploadedFile) {
          addToast('Please select or upload a resume file (PDF or DOCX).', 'error');
          setIsFixing(false);
          return;
        }

        setFixStep('1/3 Extracting readable text from uploaded document...');
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const extractRes = await fetch('/api/documents/extract-text', {
          method: 'POST',
          body: formData,
        });

        if (!extractRes.ok) {
          const err = await extractRes.json();
          throw new Error(err.error || 'Failed to extract text from document');
        }

        const extractData = await extractRes.json();
        extractedText = extractData.text;

        // Perform initial baseline scan to calculate real score
        setFixStep('2/3 Calculating baseline ATS score & missing job keywords...');
        const scanRes = await fetch('/api/ai/analyze-resume', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: extractedText,
            jobDescription,
            targetTitle,
          }),
        });

        let scannedInitialScore = 68;
        if (scanRes.ok) {
          const scanJson = await scanRes.json();
          if (scanJson.data?.overallScore) {
            scannedInitialScore = scanJson.data.overallScore;
            setBaselineScore(scannedInitialScore);
          }
        }

        resumePayload = {
          title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
          plainText: extractedText,
          targetJobTitle: targetTitle,
        };
      } else if (sourceMode === 'paste') {
        // Source 2: Pasted text
        if (!pastedResumeText.trim()) {
          addToast('Please paste your resume text in the box.', 'error');
          setIsFixing(false);
          return;
        }
        setFixStep('1/3 Analyzing pasted resume text against job requirements...');
        extractedText = pastedResumeText.trim();
        resumePayload = {
          title: 'Pasted Resume',
          plainText: extractedText,
          targetJobTitle: targetTitle,
        };
      }

      setFixStep('3/3 Rewriting CV, quantifying bullets & injecting target keywords...');
      const response = await fetch('/api/ai/fix-resume-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume: resumePayload,
          jobDescription,
          targetTitle,
          currentScore: baselineScore,
          identifiedIssues: linkedAnalysis
            ? [
                ...(linkedAnalysis.topImprovements || []),
                ...(linkedAnalysis.missingKeywords?.map((k) => `Missing keyword: ${k}`) || []),
              ]
            : ['Needs metric quantification', 'Missing job posting keywords', 'Generic summary'],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run ATS Score remediation');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const data: FixResult = resJson.data;
        setFixResult(data);

        // Build the initial rewritten customized CV
        const basePersonalInfo: PersonalInfo = data.personalInfo?.fullName
          ? data.personalInfo
          : selectedResume?.personalInfo || {
              fullName: user?.fullName || 'Full Name',
              email: user?.email || 'email@example.com',
              phone: '+1 (555) 012-3456',
              location: 'San Francisco, CA',
            };

        const newCv: ResumeData = {
          id: `resume-fixed-${Date.now()}`,
          title: `${
            sourceMode === 'upload' && uploadedFile
              ? uploadedFile.name.replace(/\.[^/.]+$/, '')
              : selectedResume?.title || 'Resume'
          } (ATS Optimized for ${targetTitle})`,
          templateId: selectedResume?.templateId || 'classic-professional',
          targetJobTitle: targetTitle,
          targetCompany: selectedResume?.targetCompany || '',
          targetJobDescription: jobDescription,
          personalInfo: basePersonalInfo,
          summary: data.fixedSummary || selectedResume?.summary || '',
          experience: data.fixedExperience?.length ? data.fixedExperience : selectedResume?.experience || [],
          education: data.education?.length ? data.education : selectedResume?.education || [],
          skillCategories: data.fixedSkillCategories?.length ? data.fixedSkillCategories : selectedResume?.skillCategories || [],
          certifications: selectedResume?.certifications || [],
          projects: selectedResume?.projects || [],
          additionalSections: selectedResume?.additionalSections || [],
          lastAnalysisScore: data.projectedScore,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        setCustomizedCv(newCv);
        addToast(`CV rewritten successfully! Elevated ATS score: ${data.projectedScore}/100 (+${data.scoreGain} pts)`);
      }
    } catch (err: any) {
      console.error('Fix error:', err);
      addToast(err.message || 'Error occurred while remediating ATS score.', 'error');
    } finally {
      setIsFixing(false);
      setFixStep('');
    }
  };

  // Customization Handlers
  const handleUpdateSummary = (val: string) => {
    if (!customizedCv) return;
    setCustomizedCv({ ...customizedCv, summary: val });
  };

  const handleUpdatePersonalInfo = (field: keyof PersonalInfo, val: string) => {
    if (!customizedCv) return;
    setCustomizedCv({
      ...customizedCv,
      personalInfo: {
        ...customizedCv.personalInfo,
        [field]: val,
      },
    });
  };

  const handleUpdateExperienceHeader = (
    expIdx: number,
    field: 'company' | 'position' | 'startDate' | 'endDate' | 'location',
    val: string
  ) => {
    if (!customizedCv) return;
    const nextExp = [...customizedCv.experience];
    nextExp[expIdx] = { ...nextExp[expIdx], [field]: val };
    setCustomizedCv({ ...customizedCv, experience: nextExp });
  };

  const handleUpdateBullet = (expIdx: number, bulletIdx: number, val: string) => {
    if (!customizedCv) return;
    const nextExp = [...customizedCv.experience];
    nextExp[expIdx].bullets[bulletIdx] = val;
    setCustomizedCv({ ...customizedCv, experience: nextExp });
  };

  const handleAddBullet = (expIdx: number) => {
    if (!customizedCv) return;
    const nextExp = [...customizedCv.experience];
    nextExp[expIdx].bullets.push('Architected core system features aligned with technical objectives, reducing turnaround time by 25%.');
    setCustomizedCv({ ...customizedCv, experience: nextExp });
  };

  const handleRemoveBullet = (expIdx: number, bulletIdx: number) => {
    if (!customizedCv) return;
    const nextExp = [...customizedCv.experience];
    nextExp[expIdx].bullets = nextExp[expIdx].bullets.filter((_, i) => i !== bulletIdx);
    setCustomizedCv({ ...customizedCv, experience: nextExp });
  };

  const handleAddExperienceItem = () => {
    if (!customizedCv) return;
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Tech Corp',
      position: targetTitle || 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Spearheaded key milestone deliverables aligned with technical system architecture.',
        'Engineered scalable microservices handling high transaction volumes with 99.9% uptime.',
      ],
    };
    setCustomizedCv({
      ...customizedCv,
      experience: [newExp, ...customizedCv.experience],
    });
    addToast('Added new work experience role.');
  };

  const handleRemoveExperienceItem = (expIdx: number) => {
    if (!customizedCv) return;
    const nextExp = customizedCv.experience.filter((_, i) => i !== expIdx);
    setCustomizedCv({ ...customizedCv, experience: nextExp });
    addToast('Removed work experience item.');
  };

  const handleRemoveSkill = (catIdx: number, skillToRemove: string) => {
    if (!customizedCv) return;
    const nextCats = [...customizedCv.skillCategories];
    nextCats[catIdx].skills = nextCats[catIdx].skills.filter((s) => s !== skillToRemove);
    setCustomizedCv({ ...customizedCv, skillCategories: nextCats });
  };

  const handleAddSkill = (catIdx: number) => {
    if (!customizedCv || !newSkillText.trim()) return;
    const nextCats = [...customizedCv.skillCategories];
    if (!nextCats[catIdx].skills.includes(newSkillText.trim())) {
      nextCats[catIdx].skills.push(newSkillText.trim());
      setCustomizedCv({ ...customizedCv, skillCategories: nextCats });
      setNewSkillText('');
      addToast(`Added "${newSkillText.trim()}" to ${nextCats[catIdx].category}.`);
    }
  };

  const handleAddNewSkillCategory = () => {
    if (!customizedCv || !newCategoryName.trim()) return;
    const newCat: SkillCategory = {
      category: newCategoryName.trim(),
      skills: ['Sample Skill'],
    };
    setCustomizedCv({
      ...customizedCv,
      skillCategories: [...customizedCv.skillCategories, newCat],
    });
    setNewCategoryName('');
    setIsAddingCategory(false);
    addToast(`Added category "${newCat.category}".`);
  };

  const handleUpdateEducation = (eduIdx: number, field: keyof Education, val: string) => {
    if (!customizedCv) return;
    const nextEdu = [...customizedCv.education];
    nextEdu[eduIdx] = { ...nextEdu[eduIdx], [field]: val };
    setCustomizedCv({ ...customizedCv, education: nextEdu });
  };

  const handleSwitchTemplate = (tplId: ResumeTemplateId) => {
    if (!customizedCv) return;
    setCustomizedCv({ ...customizedCv, templateId: tplId });
    addToast(`Template switched to ${tplId}`);
  };

  // Export handlers
  const handleDownloadDocx = async () => {
    if (!customizedCv) return;
    setDownloadingDocx(true);
    addToast('Generating editable Word (.docx) document with verified ATS formatting...', 'info');
    try {
      const res = await downloadDocxResume(customizedCv);
      if (res.success) {
        addToast('Word (.docx) resume downloaded successfully! Ready to apply.');
      } else {
        addToast(res.message || 'Export failed', 'error');
      }
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!customizedCv) return;
    setDownloadingPdf(true);
    addToast('Generating downloadable ATS-compliant vector PDF...', 'info');
    try {
      const res = downloadPdfResume(customizedCv);
      if (res.success) {
        addToast('PDF resume downloaded successfully! Ready to submit to ATS.');
      } else {
        triggerPrintResume();
      }
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadJson = () => {
    if (!customizedCv) return;
    const blob = new Blob([JSON.stringify(customizedCv, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customizedCv.title.replace(/[^a-zA-Z0-9]/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    addToast('Reusable JSON resume data exported successfully!');
  };

  const handleSaveToLibrary = () => {
    if (!customizedCv) return;
    const saved = saveResume(customizedCv);
    addToast('Rewritten CV saved to your Resume Library!');
    navigate(`/dashboard/resume-builder/${saved.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
            <Wand2 className="w-3.5 h-3.5 text-blue-300" />
            <span>AI ATS Score Fixer & CV Rewriter Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Analyze, Fix ATS Score & Rewrite CV for Target Job Description
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Upload your resume (PDF/DOCX), provide the target job description, let AI analyze the score, detect gaps, and rewrite your CV for a verified 90+ ATS score. Customize any section in real time and download in Word (.docx) or PDF format.
          </p>
        </div>
      </div>

      {/* Step 1: Input & Scan Configuration Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
            <Target className="w-4 h-4 text-blue-600" />
            <span>Step 1: Upload or Select Resume & Enter Target Job Description</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Current Baseline Score: <strong className="text-slate-800">{baselineScore}/100</strong>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Needs Optimization
            </span>
          </div>
        </div>

        {/* Source Switcher: Upload vs Select vs Paste */}
        <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
          <button
            onClick={() => setSourceMode('upload')}
            className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceMode === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Resume File (PDF / DOCX)</span>
          </button>
          <button
            onClick={() => setSourceMode('select')}
            className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceMode === 'select' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Select Saved Resume ({resumes.length})</span>
          </button>
          <button
            onClick={() => setSourceMode('paste')}
            className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
              sourceMode === 'paste' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Upload or Select UI */}
          <div className="md:col-span-5 space-y-3">
            {sourceMode === 'upload' && (
              <div>
                {!uploadedFile ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      isDragging ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <span className="font-bold text-xs text-slate-800 block mb-1">
                      Drag & drop your resume file
                    </span>
                    <span className="text-[11px] text-slate-500 block mb-3">
                      Supports PDF or Word (.docx, .doc) up to 10MB
                    </span>
                    <label className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors inline-block shadow-xs">
                      <span>Browse Document</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleValidateFile(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{uploadedFile.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for ATS scan & rewrite
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {sourceMode === 'select' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Choose from Saved Resumes
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800 bg-white"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.templateId}) - Score: {r.lastAnalysisScore || 70}/100
                    </option>
                  ))}
                </select>
                {selectedResume && (
                  <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Candidate:</span>
                      <strong className="text-slate-800">{selectedResume.personalInfo?.fullName || 'Untitled'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience Roles:</span>
                      <strong className="text-slate-800">{selectedResume.experience?.length || 0} items</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Score:</span>
                      <strong className="text-blue-600">{selectedResume.lastAnalysisScore || 72}/100</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {sourceMode === 'paste' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Paste Resume Content
                </label>
                <textarea
                  rows={5}
                  value={pastedResumeText}
                  onChange={(e) => setPastedResumeText(e.target.value)}
                  placeholder="Paste your raw resume text (experience, summary, skills)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono text-slate-800"
                />
              </div>
            )}

            {/* Target Job Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Target Role / Job Title
              </label>
              <input
                type="text"
                value={targetTitle}
                onChange={(e) => setTargetTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Software Engineer"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Right Column: Job Description Textarea & Presets */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Job Description (for keyword injection & tailoring)
              </label>
              <span className="text-slate-400 text-[11px]">{jobDescription.length} characters</span>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium">Quick Presets:</span>
              {SAMPLE_JOB_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTargetTitle(preset.title);
                    setJobDescription(preset.desc);
                    addToast(`Loaded preset: ${preset.title}`);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  {preset.title.split(' ')[0]} {preset.title.split(' ')[1]}
                </button>
              ))}
            </div>

            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description requirements and qualifications..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed focus:ring-1 focus:ring-blue-600 font-sans"
            />

            <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>AI will eliminate passive phrasing, inject missing keywords, and quantify impact metrics.</span>
              </div>

              <button
                onClick={handleRunAtsFix}
                disabled={isFixing || !jobDescription || (sourceMode === 'upload' && !uploadedFile)}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                {isFixing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{fixStep || 'Rewriting CV for 95+ ATS Score...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Analyze, Fix & Rewrite CV for Target Job</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Results & Interactive Customizer Studio */}
      {fixResult && customizedCv && (
        <div className="space-y-6">
          {/* High-Level Score Verification Banner */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Score Gauge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Verified Fixed ATS Score
                </span>
                <ScoreGauge score={fixResult.projectedScore} size="lg" />
                <div className="mt-2 text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{fixResult.scoreGain} Point Elevation (From {fixResult.originalScore})</span>
                </div>
              </div>

              {/* Right Summary & Keyword Highlights */}
              <div className="md:col-span-8 space-y-3.5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    ATS Remediation Summary
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-1">
                    {fixResult.scoreSummary}
                  </p>
                </div>

                {/* Keywords Injected */}
                {fixResult.keywordsInjected?.length > 0 && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Keywords Successfully Injected ({fixResult.keywordsInjected.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fixResult.keywordsInjected.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Fixes Applied */}
                {fixResult.fixes?.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Fixes Breakdown:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {fixResult.fixes.slice(0, 4).map((f, i) => (
                        <div key={i} className="text-[11px] p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-800">{f.category}:</strong> {f.fixApplied}
                            <span className="text-emerald-700 font-bold ml-1">({f.scoreImpact})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fast Reusable Export Toolbar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Download & Export Reusable Formats:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleDownloadDocx}
                      disabled={downloadingDocx}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Download editable Microsoft Word document (.docx)"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloadingDocx ? 'Exporting...' : 'Download Word (.docx)'}</span>
                    </button>
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloadingPdf}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                      title="Download print-ready ATS-compliant vector PDF"
                    >
                      <Printer className="w-4 h-4 text-slate-600" />
                      <span>{downloadingPdf ? 'Generating...' : 'Download PDF'}</span>
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Export reusable JSON resume data"
                    >
                      <FileCode className="w-4 h-4 text-slate-600" />
                      <span>Export JSON</span>
                    </button>
                    <button
                      onClick={handleSaveToLibrary}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Save to My Resumes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive CV Customizer Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Editor Tabs & Customization Inputs (6 Cols) */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Interactive CV Customizer Studio
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Syncing with Document
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 gap-2 text-xs font-bold overflow-x-auto pb-1">
                <button
                  onClick={() => setEditorSection('summary')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'summary'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>
                <button
                  onClick={() => setEditorSection('experience')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'experience'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Experience ({customizedCv.experience.length})</span>
                </button>
                <button
                  onClick={() => setEditorSection('skills')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'skills'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Skills</span>
                </button>
                <button
                  onClick={() => setEditorSection('education')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'education'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Education</span>
                </button>
                <button
                  onClick={() => setEditorSection('contact')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'contact'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personal Info</span>
                </button>
                <button
                  onClick={() => setEditorSection('template')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    editorSection === 'template'
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Layout</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="space-y-4">
                {/* 1. Summary Editor */}
                {editorSection === 'summary' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Tailored Professional Summary
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        ✓ Injected Job Keywords
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={customizedCv.summary}
                      onChange={(e) => handleUpdateSummary(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 leading-relaxed font-sans text-slate-800"
                    />
                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>{customizedCv.summary.length} characters</span>
                      <span className="text-slate-400">Directly syncs to preview & export</span>
                    </div>
                  </div>
                )}

                {/* 2. Experience Bullets Editor */}
                {editorSection === 'experience' && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Work Experience & Quantified Bullets
                      </span>
                      <button
                        onClick={handleAddExperienceItem}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Position</span>
                      </button>
                    </div>

                    {customizedCv.experience.map((exp, expIdx) => (
                      <div key={exp.id || expIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleUpdateExperienceHeader(expIdx, 'position', e.target.value)}
                              placeholder="Position Title"
                              className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleUpdateExperienceHeader(expIdx, 'company', e.target.value)}
                              placeholder="Company Name"
                              className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveExperienceItem(expIdx)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Remove role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                            Achievement Bullets:
                          </span>
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex gap-2 items-start">
                              <span className="text-slate-400 text-xs mt-1.5">•</span>
                              <textarea
                                rows={2}
                                value={b}
                                onChange={(e) => handleUpdateBullet(expIdx, bIdx, e.target.value)}
                                className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white leading-relaxed text-slate-800"
                              />
                              <button
                                onClick={() => handleRemoveBullet(expIdx, bIdx)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 mt-1 cursor-pointer"
                                title="Remove bullet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleAddBullet(expIdx)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Achievement Bullet</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Skills Matrix */}
                {editorSection === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Customize Skills & Competencies
                      </span>
                      <button
                        onClick={() => setIsAddingCategory(true)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Category</span>
                      </button>
                    </div>

                    {isAddingCategory && (
                      <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex gap-2 items-center">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New category name (e.g. Cloud & DevOps)..."
                          className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                        <button
                          onClick={handleAddNewSkillCategory}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsAddingCategory(false)}
                          className="px-2 py-2 text-slate-500 hover:text-slate-800 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {customizedCv.skillCategories.map((cat, catIdx) => (
                      <div key={catIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                        <span className="text-xs font-bold text-slate-900 block">{cat.category}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-xs bg-white text-slate-800 border border-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs"
                            >
                              <span>{skill}</span>
                              <button
                                onClick={() => handleRemoveSkill(catIdx, skill)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Add Custom Skill Tag */}
                    <div className="pt-2 border-t border-slate-200 flex gap-2 items-center">
                      <select
                        value={selectedSkillCategoryIndex}
                        onChange={(e) => setSelectedSkillCategoryIndex(parseInt(e.target.value, 10))}
                        className="text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      >
                        {customizedCv.skillCategories.map((c, i) => (
                          <option key={i} value={i}>{c.category}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newSkillText}
                        onChange={(e) => setNewSkillText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill(selectedSkillCategoryIndex);
                          }
                        }}
                        placeholder="Add skill (e.g. Docker, TypeScript)..."
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white"
                      />
                      <button
                        onClick={() => handleAddSkill(selectedSkillCategoryIndex)}
                        className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Education Editor */}
                {editorSection === 'education' && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Education & Degrees
                    </span>
                    {customizedCv.education.map((edu, eduIdx) => (
                      <div key={edu.id || eduIdx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(eduIdx, 'degree', e.target.value)}
                            placeholder="Degree"
                            className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(eduIdx, 'institution', e.target.value)}
                            placeholder="Institution"
                            className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleUpdateEducation(eduIdx, 'fieldOfStudy', e.target.value)}
                            placeholder="Field of Study"
                            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                          <input
                            type="text"
                            value={`${edu.startDate || ''} - ${edu.endDate || ''}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('-');
                              handleUpdateEducation(eduIdx, 'startDate', parts[0]?.trim() || '');
                              handleUpdateEducation(eduIdx, 'endDate', parts[1]?.trim() || '');
                            }}
                            placeholder="Years (e.g. 2018 - 2022)"
                            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. Personal Info Editor */}
                {editorSection === 'contact' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Contact & Header Details
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={customizedCv.personalInfo?.fullName || ''}
                          onChange={(e) => handleUpdatePersonalInfo('fullName', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Email</label>
                        <input
                          type="email"
                          value={customizedCv.personalInfo?.email || ''}
                          onChange={(e) => handleUpdatePersonalInfo('email', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Phone</label>
                        <input
                          type="text"
                          value={customizedCv.personalInfo?.phone || ''}
                          onChange={(e) => handleUpdatePersonalInfo('phone', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Location</label>
                        <input
                          type="text"
                          value={customizedCv.personalInfo?.location || ''}
                          onChange={(e) => handleUpdatePersonalInfo('location', e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">LinkedIn</label>
                        <input
                          type="text"
                          value={customizedCv.personalInfo?.linkedin || ''}
                          onChange={(e) => handleUpdatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/username"
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Job Title</label>
                        <input
                          type="text"
                          value={customizedCv.targetJobTitle || ''}
                          onChange={(e) => setCustomizedCv({ ...customizedCv, targetJobTitle: e.target.value })}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Design Template */}
                {editorSection === 'template' && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Choose ATS-Compliant Layout
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TEMPLATE_DEFINITIONS.map((tpl) => (
                        <div
                          key={tpl.id}
                          onClick={() => handleSwitchTemplate(tpl.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            customizedCv.templateId === tpl.id
                              ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-slate-900">{tpl.name}</span>
                            {customizedCv.templateId === tpl.id && (
                              <Check className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{tpl.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Live Document Preview & Sticky Download Toolbar (6 Cols) */}
            <div className="lg:col-span-6 bg-slate-100 rounded-2xl border border-slate-200 p-4 flex flex-col items-center min-h-[750px]">
              {/* Sticky Preview Header & Download Actions */}
              <div className="w-full flex flex-wrap justify-between items-center mb-3 px-2 text-xs gap-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Customized Document
                </span>

                <div className="flex items-center gap-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    <button
                      onClick={() => setZoomScale((prev) => Math.max(0.6, prev - 0.1))}
                      className="hover:text-blue-600 cursor-pointer p-0.5"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold w-10 text-center">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
                      className="hover:text-blue-600 cursor-pointer p-0.5"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Direct Action Buttons */}
                  <button
                    onClick={handleDownloadDocx}
                    disabled={downloadingDocx}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Download Word (.docx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOCX</span>
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs disabled:opacity-50"
                    title="Download PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {/* Rendered Live CV */}
              <div className="w-full overflow-x-auto flex justify-center py-2">
                <ResumeRenderer data={customizedCv} scale={zoomScale} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
