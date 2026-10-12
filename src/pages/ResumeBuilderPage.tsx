import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ResumeData,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  Certification,
  ResumeTemplateId,
} from '../types/resume';
import { ResumeRenderer, TEMPLATE_DEFINITIONS } from '../components/templates/ResumeRenderer';
import { downloadDocxResume, triggerPrintResume } from '../utils/exportResume';
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  Printer,
  FileText,
  Save,
  Check,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Target,
  Wand2,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  resumeId?: string;
}

export const ResumeBuilderPage: React.FC<Props> = ({ resumeId }) => {
  const { resumes, saveResume, addToast, navigate, user } = useApp();

  // Find or create resume
  const existing = resumeId ? resumes.find((r) => r.id === resumeId) : resumes[0];

  const [resume, setResume] = useState<ResumeData>(() => {
    if (existing) return JSON.parse(JSON.stringify(existing));
    return {
      id: `resume-${Date.now()}`,
      title: 'Software Engineer Resume',
      templateId: 'classic-professional',
      targetJobTitle: 'Full Stack Engineer',
      personalInfo: {
        fullName: user?.fullName || 'Full Name',
        email: user?.email || 'email@example.com',
        phone: '+1 (555) 012-3456',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/myprofile',
        github: 'https://github.com/myprofile',
        portfolio: 'https://myportfolio.com',
      },
      summary: 'Experienced and detail-oriented professional with a strong track record of designing scalable solutions and leading cross-functional projects to successful completion.',
      experience: [
        {
          id: 'exp-1',
          company: 'Acme Technologies',
          position: 'Software Engineer',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          startDate: '2022-01',
          endDate: '',
          isCurrent: true,
          bullets: [
            'Spearheaded development of core web application features, improving user engagement by 25%.',
            'Optimized API queries and database indexing, decreasing average latency by 35%.',
          ],
          technologies: ['React', 'TypeScript', 'Node.js'],
        },
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2017-09',
          endDate: '2021-05',
          gpa: '3.8',
          coursework: ['Data Structures', 'Algorithms', 'Distributed Systems'],
        },
      ],
      skillCategories: [
        {
          category: 'Technical Skills',
          skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
        },
        {
          category: 'Core Competencies',
          skills: ['System Design', 'Agile/Scrum', 'Code Review', 'Web Performance'],
        },
      ],
      certifications: [],
      projects: [],
      additionalSections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [activeTab, setActiveTab] = useState<'info' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'target'>('info');
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [summaryTone, setSummaryTone] = useState<'professional' | 'technical' | 'leadership' | 'entry-level'>('professional');
  const autosaveTimer = useRef<any>(null);

  // Autosave debouncing
  useEffect(() => {
    setSaveStatus('saving');
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    autosaveTimer.current = setTimeout(() => {
      saveResume(resume);
      setSaveStatus('saved');
    }, 1200);

    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [resume]);

  const updatePersonalInfo = (field: string, val: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val },
    }));
  };

  // AI Summary Generator
  const handleGenerateAiSummary = async () => {
    setAiLoading(true);
    addToast('Generating tailored professional summary...', 'info');
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience: resume.experience.map((e) => `${e.position} at ${e.company}`),
          skills: resume.skillCategories.flatMap((c) => c.skills),
          targetJobTitle: resume.targetJobTitle,
          tone: summaryTone,
        }),
      });
      const data = await response.json();
      if (data.success && data.data?.summary) {
        setResume((prev) => ({ ...prev, summary: data.data.summary }));
        addToast('Professional summary updated with AI!');
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (err: any) {
      addToast(err.message || 'AI request failed. Please check network.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Bullet Point Polish
  const handleImproveBullet = async (expIndex: number, bulletIndex: number) => {
    const currentBullet = resume.experience[expIndex].bullets[bulletIndex];
    if (!currentBullet) return;

    setAiLoading(true);
    addToast('Optimizing bullet point with executive action verbs...', 'info');
    try {
      const response = await fetch('/api/ai/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: currentBullet,
          targetRole: resume.targetJobTitle,
        }),
      });
      const data = await response.json();
      if (data.success && data.data?.improved) {
        setResume((prev) => {
          const nextExp = [...prev.experience];
          nextExp[expIndex].bullets[bulletIndex] = data.data.improved;
          return { ...prev, experience: nextExp };
        });
        addToast('Bullet point upgraded!');
      } else {
        throw new Error(data.error || 'Failed to improve bullet');
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to improve bullet', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      position: 'Role Title',
      location: 'City, Country',
      startDate: '2023-01',
      endDate: '',
      isCurrent: true,
      bullets: ['Describe your core accomplishment and impact.'],
      technologies: [],
    };
    setResume((prev) => ({ ...prev, experience: [newExp, ...prev.experience] }));
  };

  const removeExperience = (index: number) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addExperienceBullet = (expIndex: number) => {
    setResume((prev) => {
      const nextExp = [...prev.experience];
      nextExp[expIndex].bullets.push('Spearheaded milestone deliverable, achieving measurable improvements.');
      return { ...prev, experience: nextExp };
    });
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    setResume((prev) => {
      const nextExp = [...prev.experience];
      nextExp[expIndex].bullets = nextExp[expIndex].bullets.filter((_, i) => i !== bulletIndex);
      return { ...prev, experience: nextExp };
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: 'University / College',
      degree: 'Degree Title',
      fieldOfStudy: 'Major / Field',
      startDate: '2019-09',
      endDate: '2023-05',
    };
    setResume((prev) => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const removeEducation = (index: number) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Skills handlers
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      category: 'New Category',
      skills: ['Skill 1', 'Skill 2'],
    };
    setResume((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  };

  const handleDownloadDocx = async () => {
    addToast('Generating editable Word document...', 'info');
    const res = await downloadDocxResume(resume);
    if (res.success) {
      addToast('Word document (.docx) downloaded successfully!');
    } else {
      addToast(res.message || 'Failed to download Word file', 'error');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action control bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            className="text-base font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 rounded"
          />
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            {saveStatus === 'saving' ? (
              <span className="flex items-center gap-1 text-amber-600">
                <RefreshCw className="w-3 h-3 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Template Selector & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Template selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Template:</span>
            <select
              value={resume.templateId}
              onChange={(e) => setResume({ ...resume, templateId: e.target.value as ResumeTemplateId })}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-600"
            >
              {TEMPLATE_DEFINITIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={triggerPrintResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Download PDF or Print"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>PDF / Print</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
            title="Download editable Microsoft Word document"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Step Navigation & Section Forms (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold bg-slate-50/60 p-1 gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'info' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Contact
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'summary' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Summary
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'experience' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Experience
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'education' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Education
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'skills' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5. Skills
            </button>
            <button
              onClick={() => setActiveTab('target')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'target' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6. Target Job
            </button>
          </div>

          {/* Tab Content Form */}
          <div className="p-5 max-h-[750px] overflow-y-auto space-y-4">
            {/* Tab 1: Personal Info */}
            {activeTab === 'info' && (
              <div className="space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Contact & Personal Information
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Location (City, Country)</label>
                  <input
                    type="text"
                    value={resume.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={resume.personalInfo.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">GitHub / Code</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={resume.personalInfo.portfolio || ''}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Professional Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Professional Summary
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={summaryTone}
                      onChange={(e: any) => setSummaryTone(e.target.value)}
                      className="text-[11px] bg-slate-100 border border-slate-200 rounded px-2 py-1 font-medium"
                    >
                      <option value="professional">Professional</option>
                      <option value="technical">Technical</option>
                      <option value="leadership">Leadership</option>
                      <option value="entry-level">Entry-Level</option>
                    </select>
                    <button
                      onClick={handleGenerateAiSummary}
                      disabled={aiLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>{aiLoading ? 'Drafting...' : 'AI Generate'}</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  placeholder="3-4 sentences outlining your experience, core competencies, and career value proposition..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-1 focus:ring-blue-600 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 italic">
                  Tip: Front-load high-demand keywords from your target job to help applicant tracking algorithms match your qualifications.
                </p>
              </div>
            )}

            {/* Tab 3: Work Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employment History ({resume.experience.length})
                  </span>
                  <button
                    onClick={addExperience}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                {resume.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const next = [...resume.experience];
                            next[expIdx].position = e.target.value;
                            setResume({ ...resume, experience: next });
                          }}
                          placeholder="Job Title"
                          className="text-xs font-bold p-2 bg-white rounded border border-slate-300"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const next = [...resume.experience];
                            next[expIdx].company = e.target.value;
                            setResume({ ...resume, experience: next });
                          }}
                          placeholder="Company"
                          className="text-xs p-2 bg-white rounded border border-slate-300"
                        />
                      </div>
                      <button
                        onClick={() => removeExperience(expIdx)}
                        className="text-slate-400 hover:text-rose-600 p-1.5"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const next = [...resume.experience];
                            next[expIdx].startDate = e.target.value;
                            setResume({ ...resume, experience: next });
                          }}
                          placeholder="YYYY-MM"
                          className="w-full text-xs p-1.5 bg-white rounded border border-slate-300"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500">End Date</label>
                        <input
                          type="text"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? 'Present' : exp.endDate}
                          onChange={(e) => {
                            const next = [...resume.experience];
                            next[expIdx].endDate = e.target.value;
                            setResume({ ...resume, experience: next });
                          }}
                          placeholder="YYYY-MM"
                          className="w-full text-xs p-1.5 bg-white rounded border border-slate-300 disabled:bg-slate-100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`curr-${exp.id}`}
                        checked={exp.isCurrent}
                        onChange={(e) => {
                          const next = [...resume.experience];
                          next[expIdx].isCurrent = e.target.checked;
                          setResume({ ...resume, experience: next });
                        }}
                      />
                      <label htmlFor={`curr-${exp.id}`} className="text-xs text-slate-700">
                        I currently work here
                      </label>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">Key Accomplishments & Bullets:</span>
                        <button
                          onClick={() => addExperienceBullet(expIdx)}
                          className="text-[11px] text-blue-600 font-bold hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="space-y-1">
                          <div className="flex gap-1.5">
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) => {
                                const next = [...resume.experience];
                                next[expIdx].bullets[bIdx] = e.target.value;
                                setResume({ ...resume, experience: next });
                              }}
                              className="flex-1 text-xs p-2 bg-white rounded border border-slate-300 focus:ring-1 focus:ring-blue-600"
                            />
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleImproveBullet(expIdx, bIdx)}
                                title="Enhance with AI"
                                disabled={aiLoading}
                                className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                              >
                                <Wand2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeExperienceBullet(expIdx, bIdx)}
                                title="Remove Bullet"
                                className="p-1.5 rounded text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Education</span>
                  <button
                    onClick={addEducation}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Degree
                  </button>
                </div>

                {resume.education.map((edu, eduIdx) => (
                  <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const next = [...resume.education];
                          next[eduIdx].degree = e.target.value;
                          setResume({ ...resume, education: next });
                        }}
                        placeholder="Degree (e.g. Bachelor of Science)"
                        className="text-xs font-bold p-2 bg-white rounded border border-slate-300 flex-1 mr-2"
                      />
                      <button onClick={() => removeEducation(eduIdx)} className="text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const next = [...resume.education];
                          next[eduIdx].fieldOfStudy = e.target.value;
                          setResume({ ...resume, education: next });
                        }}
                        placeholder="Field of Study (e.g. Computer Science)"
                        className="text-xs p-2 bg-white rounded border border-slate-300"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const next = [...resume.education];
                          next[eduIdx].institution = e.target.value;
                          setResume({ ...resume, education: next });
                        }}
                        placeholder="University Name"
                        className="text-xs p-2 bg-white rounded border border-slate-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Skill Categories</span>
                  <button
                    onClick={addSkillCategory}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>

                {resume.skillCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => {
                          const next = [...resume.skillCategories];
                          next[catIdx].category = e.target.value;
                          setResume({ ...resume, skillCategories: next });
                        }}
                        placeholder="Category Name"
                        className="text-xs font-bold p-1.5 bg-white rounded border border-slate-300"
                      />
                      <button
                        onClick={() => {
                          const next = resume.skillCategories.filter((_, i) => i !== catIdx);
                          setResume({ ...resume, skillCategories: next });
                        }}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={cat.skills.join(', ')}
                      onChange={(e) => {
                        const next = [...resume.skillCategories];
                        next[catIdx].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setResume({ ...resume, skillCategories: next });
                      }}
                      placeholder="Comma separated skills (e.g. React, Node.js, SQL)"
                      className="w-full text-xs p-2 bg-white rounded border border-slate-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Tab 6: Target Job Info */}
            {activeTab === 'target' && (
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Job Alignment
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={resume.targetJobTitle || ''}
                    onChange={(e) => setResume({ ...resume, targetJobTitle: e.target.value })}
                    placeholder="Senior Full Stack Software Engineer"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Company (Optional)</label>
                  <input
                    type="text"
                    value={resume.targetCompany || ''}
                    onChange={(e) => setResume({ ...resume, targetCompany: e.target.value })}
                    placeholder="Stripe, Google, Amazon..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Target Job Description (for AI tailoring)</label>
                  <textarea
                    rows={6}
                    value={resume.targetJobDescription || ''}
                    onChange={(e) => setResume({ ...resume, targetJobDescription: e.target.value })}
                    placeholder="Paste the requirements from the job posting..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 leading-relaxed"
                  />
                </div>
                <button
                  onClick={() => navigate('/dashboard/job-matcher')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Target className="w-4 h-4" />
                  <span>Open Job Matcher with this Description</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Resume Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-col items-center min-h-[750px]">
          {/* Zoom & Page Controls */}
          <div className="w-full flex justify-between items-center mb-3 px-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Document Preview (A4 / Letter)
            </span>
            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => setZoomScale((prev) => Math.max(0.6, prev - 0.1))}
                className="hover:text-blue-600 p-0.5 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold w-12 text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
                className="hover:text-blue-600 p-0.5 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rendered Resume Document */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <ResumeRenderer data={resume} scale={zoomScale} />
          </div>
        </div>
      </div>
    </div>
  );
};
