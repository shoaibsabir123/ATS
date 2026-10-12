import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ScanSearch,
  FileEdit,
  Target,
  FileCheck2,
  FileDown,
  Layers,
  ShieldCheck,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileText,
} from 'lucide-react';
import { ScoreGauge } from '../components/ui/ScoreGauge';
import { TEMPLATE_DEFINITIONS, ResumeRenderer } from '../components/templates/ResumeRenderer';
import { SAMPLE_RESUME } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const { navigate, user, plans, createNewResume } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeTemplatePreview, setActiveTemplatePreview] = useState<string>('classic-professional');

  const faqs = [
    {
      q: 'How does the ATS compatibility scoring work?',
      a: 'ResumePilot AI evaluates your resume across six core heuristic criteria: resume parsing readiness (single-column hierarchy), technical keyword coverage, experience clarity & quantifiable achievements, professional summary impact, formatting consistency, and essential section completeness. The final estimated score out of 100 provides a transparent guide to optimize recruiter screening conversion.',
    },
    {
      q: 'Does ResumePilot fabricate or fake resume facts?',
      a: 'Never. Our AI guidelines strictly forbid fabricating employment dates, employers, certifications, or false metrics. Instead, our AI acts as an executive career coach: converting passive responsibilities into active achievement statements and prompting you to provide genuine metrics where beneficial.',
    },
    {
      q: 'Can I export both PDF and Word (.docx) files?',
      a: 'Yes! You can download selectable-text PDFs formatted for print and standard ATS parsing, or download fully editable Microsoft Word (.docx) documents compatible with Microsoft 365 and Google Docs.',
    },
    {
      q: 'Can I analyze my existing PDF or Word resume?',
      a: 'Absolutely. Upload any standard PDF or DOCX file to our ATS Resume Analyzer. The engine extracts the text securely, evaluates its structural readability, and returns prioritized recommendations and before/after rewrites in seconds.',
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. All user documents are stored with Row Level Security (RLS) policies. We do not sell your personal data or use your private resumes to train public models.',
    },
  ];

  const handleStartBuilding = () => {
    if (user) {
      navigate('/dashboard/resume-builder');
    } else {
      navigate('/register');
    }
  };

  const handleStartAnalyzing = () => {
    if (user) {
      navigate('/dashboard/resume-analyzer');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen AI ATS Career Intelligence Engine</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Your Next Job Starts With a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Better Resume.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create ATS-friendly resumes, analyze your resume against job descriptions, and discover exactly how to improve your application with AI.
            </p>

            {/* Call To Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleStartBuilding}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Build My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleStartAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all cursor-pointer"
              >
                <ScanSearch className="w-4 h-4 text-blue-600" />
                <span>Analyze My Resume</span>
              </button>
            </div>

            {/* Trust bullet indicators */}
            <div className="mt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Selectable Text Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Fabricated Claims
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real Word (.docx) & PDF Downloads
              </span>
            </div>
          </div>

          {/* Interactive Live Product Dashboard Preview (Illustrative) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-white p-3 sm:p-5 shadow-2xl border border-slate-200/90 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="ml-2 text-xs font-semibold text-slate-500">
                  ResumePilot AI Diagnostic Console (Sample Demonstration)
                </span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Live Interactive Sample
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: ATS Score & Diagnostics */}
              <div className="lg:col-span-5 bg-slate-50/70 rounded-xl p-5 border border-slate-200/60 space-y-5">
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Estimated ATS Compatibility Score
                  </div>
                  <ScoreGauge score={88} size="md" />
                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    Calculated against 6 transparent parsing & semantic rubrics
                  </p>
                </div>

                {/* Category mini breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Structure & Parsing Readiness</span>
                    <span className="font-bold text-slate-900">24 / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-[96%]"></div>
                  </div>

                  <div className="flex justify-between items-center text-slate-700 pt-1">
                    <span>Skills & Keyword Alignment</span>
                    <span className="font-bold text-slate-900">22 / 25</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-1.5 rounded-full w-[88%]"></div>
                  </div>

                  <div className="flex justify-between items-center text-slate-700 pt-1">
                    <span>Experience Clarity & Metrics</span>
                    <span className="font-bold text-slate-900">18 / 20</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-1.5 rounded-full w-[90%]"></div>
                  </div>
                </div>

                {/* Keywords preview */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Target Role Match: Senior Full Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                      ✓ TypeScript
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                      ✓ React 19
                    </span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded">
                      ✓ Node.js
                    </span>
                    <span className="text-[11px] bg-rose-100 text-rose-800 font-medium px-2 py-0.5 rounded">
                      ✕ Microservices (Missing)
                    </span>
                    <span className="text-[11px] bg-rose-100 text-rose-800 font-medium px-2 py-0.5 rounded">
                      ✕ SLA Metrics (Missing)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Resume Preview */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs max-h-[460px] overflow-hidden relative">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex justify-between items-center">
                  <span>Resume Preview • Classic Professional</span>
                  <span className="text-emerald-600 font-bold">Linear ATS Safe</span>
                </div>
                <div className="scale-75 origin-top-left w-[133%] pointer-events-none select-none">
                  <ResumeRenderer data={SAMPLE_RESUME} scale={0.8} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-4">
                  <button
                    onClick={() => navigate('/dashboard/resume-builder')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow transition-all cursor-pointer"
                  >
                    Open Full Interactive Editor →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (Section 4) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From blank page or old file to recruiter-ready in minutes.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-5">
                01
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Create or Upload Your Resume</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your genuine work facts using our step-by-step wizard, or simply drag-and-drop your existing PDF or Word (.docx) document.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-5">
                02
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Let AI Evaluate & Benchmark</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our Gemini-powered engine audits ATS parsing readiness, checks target job keywords, and highlights missing metrics without making up facts.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-5">
                03
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Improve & Export Polished Versions</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accept tailored bullet point rewrites with 1 click, choose from 6 ATS-tested templates, and download clean PDFs and editable Word files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase (Section 4) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Comprehensive Career Toolkit
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for serious career growth
            </h3>
            <p className="text-sm text-slate-600 mt-3">
              Everything job seekers need to stand out from hundreds of applicants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <FileEdit className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">AI Resume Builder</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-step guided wizard that structures raw facts into clean, professional resume sections with live autosave.
              </p>
            </div>

            {/* 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">ATS Compatibility Analyzer</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Objective 100-point heuristic scoring across structure, keywords, experience, and formatting consistency.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">Job Description Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any job posting to see exact vs semantic keyword overlap, missing prerequisites, and tailored tailoring advice.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">AI Bullet Point Coach</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transform passive duties into achievement-driven statements with metric guidance without inventing numbers.
              </p>
            </div>

            {/* 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">Professional Templates</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                6 carefully crafted designs from Classic to Tech and Executive, all engineered to parse cleanly through ATS software.
              </p>
            </div>

            {/* 6 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">AI Cover Letter Generator</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate tailored, tone-calibrated cover letters connected directly to your resume achievements and target job.
              </p>
            </div>

            {/* 7 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <FileDown className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">Word (.docx) & PDF Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate genuine Microsoft Word (.docx) files and crisp printable PDFs with 100% selectable vector text.
              </p>
            </div>

            {/* 8 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1.5">Multi-Version Management</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain multiple customized resume variants tailored to different industries, roles, and job descriptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase (Section 4) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              ATS-Optimized Templates
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for recruiters. Built for ATS parsers.
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Clean single-column typography, recognized standard headers, and zero unreadable graphical traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATE_DEFINITIONS.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{tpl.name}</h4>
                      <span className="text-xs text-slate-500 font-medium">{tpl.category}</span>
                    </div>
                    {tpl.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tpl.description}
                  </p>
                  <div className="text-[11px] text-slate-500 font-medium bg-white p-2.5 rounded-lg border border-slate-200 mb-4">
                    <strong className="text-slate-700">Recommended for:</strong> {tpl.recommendedFor}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newRes = createNewResume();
                    newRes.templateId = tpl.id;
                    navigate('/dashboard/resume-builder');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                >
                  Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section (Section 4 & 12) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Transparent Pricing
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Invest in your career. Get hired faster.
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Start free today and upgrade as you scale your job applications.
            </p>

            {/* Monthly / Annual toggle */}
            <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-slate-200/80">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  billingCycle === 'annually' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Annual Billing <span className="text-[10px] text-emerald-600 font-extrabold">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((plan) => {
              const price = billingCycle === 'monthly' ? plan.priceMonthly : Math.round(plan.priceAnnually / 12);
              const isPopular = plan.isPopular;

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-white border-2 border-blue-600 shadow-xl relative scale-105 z-10'
                      : 'bg-white border border-slate-200 shadow-xs'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.tagline}</p>

                    <div className="my-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-slate-900">${price}</span>
                        <span className="text-xs text-slate-500 font-medium">/ month</span>
                      </div>
                      {billingCycle === 'annually' && plan.priceAnnually > 0 && (
                        <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                          Billed annually at ${plan.priceAnnually}/year
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) navigate('/register');
                      else navigate('/dashboard/billing');
                    }}
                    className={`mt-8 w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {plan.id === 'free' ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Clear answers to common questions
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex justify-between items-center text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer (Section 4) */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-white text-base">ResumePilot AI</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-3">
                Build Better Resumes. Get Hired Faster. The AI career acceleration platform trusted by professionals worldwide.
              </p>
              <div className="text-[11px] text-slate-500">
                © {new Date().getFullYear()} ResumePilot AI. All rights reserved.
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Product</h5>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/dashboard/resume-builder')} className="hover:text-white">AI Resume Builder</button></li>
                <li><button onClick={() => navigate('/dashboard/resume-analyzer')} className="hover:text-white">ATS Resume Analyzer</button></li>
                <li><button onClick={() => navigate('/dashboard/job-matcher')} className="hover:text-white">Job Description Matcher</button></li>
                <li><button onClick={() => navigate('/templates')} className="hover:text-white">ATS Resume Templates</button></li>
                <li><button onClick={() => navigate('/pricing')} className="hover:text-white">Pricing & Plans</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Resources</h5>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/features')} className="hover:text-white">All Features</button></li>
                <li><button onClick={() => navigate('/faq')} className="hover:text-white">Help & FAQs</button></li>
                <li><button onClick={() => navigate('/dashboard/cover-letters')} className="hover:text-white">Cover Letter Tool</button></li>
                <li><button onClick={() => navigate('/admin')} className="text-amber-400 hover:text-amber-300">Admin Console</button></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Legal & Privacy</h5>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy Policy</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms of Service</button></li>
                <li><span className="text-slate-500">Contact: support@resumepilot.ai</span></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            Disclaimer: ATS compatibility scores and matching metrics provided by ResumePilot AI are illustrative heuristics designed to guide resume optimization and do not guarantee an interview or employment offer from any specific employer.
          </div>
        </div>
      </footer>
    </div>
  );
};
