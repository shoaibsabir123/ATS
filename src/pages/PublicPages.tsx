import React from 'react';
import { useApp } from '../context/AppContext';
import { TEMPLATE_DEFINITIONS } from '../components/templates/ResumeRenderer';
import {
  Sparkles,
  CheckCircle2,
  FileEdit,
  ScanSearch,
  Target,
  FileCheck2,
  FileDown,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { navigate, createNewResume } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive AI Career Acceleration Suite
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Explore every feature engineered to give job seekers an unfair advantage in today's competitive hiring market.
          </p>
        </div>

        <div className="space-y-12">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FileEdit className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">AI-Powered Resume Builder</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Our multi-step guided builder takes your raw facts and organizes them into an immaculate, recruiter-preferred layout. Features debounced autosave, live split-panel rendering, and font & spacing adjustments.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant live preview in A4 and Letter formats</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI bullet polish with metric guidance</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reorderable sections and modular entries</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
              <div className="text-[10px] text-blue-600 uppercase font-bold mb-2">Live AI Assistant</div>
              <div className="p-3 bg-white rounded border border-slate-200 mb-2">
                "Spearheaded payment microservices ingestion pipeline, processing $12M+ monthly transaction volume with 99.99% uptime."
              </div>
              <div className="text-emerald-700 font-sans text-[11px]">
                ✓ Action verb prioritized • Quantifiable impact highlighted • 100% ATS readable
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <ScanSearch className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">ATS Compatibility Diagnostic Engine</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Upload any PDF or DOCX resume to receive a comprehensive diagnostic report scored from 0 to 100 based on explicit, documented criteria.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 6-category weighted rubric evaluation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched vs missing keyword breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 1-click before/after suggestions</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Scoring Rubric Breakdown</div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between"><span>Structure & Parsing Readiness</span><span className="font-bold text-slate-900">25 pts</span></div>
                <div className="flex justify-between"><span>Skills & Keyword Alignment</span><span className="font-bold text-slate-900">25 pts</span></div>
                <div className="flex justify-between"><span>Experience Relevance & Clarity</span><span className="font-bold text-slate-900">20 pts</span></div>
                <div className="flex justify-between"><span>Professional Summary Impact</span><span className="font-bold text-slate-900">15 pts</span></div>
                <div className="flex justify-between"><span>Formatting & Consistency</span><span className="font-bold text-slate-900">10 pts</span></div>
                <div className="flex justify-between"><span>Completeness of Sections</span><span className="font-bold text-slate-900">5 pts</span></div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Description Matcher</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Paste any job vacancy and compare it against your resume to uncover keyword gaps, experience relevancy, and tailored adjustments before submitting your application.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Exact & Semantic Analysis</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">TypeScript (Matched)</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">React (Matched)</span>
                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-medium">Distributed Caching (Missing)</span>
              </div>
              <p className="text-[11px] text-slate-500 italic">Separate exact keyword requirements from semantic matches without fabricated assertions.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => {
              createNewResume();
              navigate('/dashboard/resume-builder');
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
          >
            Start Building with These Features
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TemplatesPage: React.FC = () => {
  const { navigate, createNewResume } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ATS-Optimized Resume Templates
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Choose from six professionally tested templates designed for readability and maximum ATS screening success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATE_DEFINITIONS.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">{tpl.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {tpl.badge}
                  </span>
                </div>
                <div className="text-xs text-blue-600 font-semibold mb-3">{tpl.category}</div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{tpl.description}</p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800">Best for: </strong>
                  {tpl.recommendedFor}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    const res = createNewResume();
                    res.templateId = tpl.id;
                    navigate('/dashboard/resume-builder');
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  Use Template in Builder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PricingPage: React.FC = () => {
  const { navigate, plans, user } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plans & Subscriptions
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Select the plan that fits your job search velocity. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-7 border ${
                p.isPopular ? 'border-2 border-blue-600 shadow-xl' : 'border-slate-200'
              } flex flex-col justify-between`}
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.tagline}</p>

                <div className="my-6">
                  <span className="text-4xl font-extrabold text-slate-900">${p.priceMonthly}</span>
                  <span className="text-xs text-slate-500 ml-1">/ month</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (user) navigate('/dashboard/billing');
                  else navigate('/register');
                }}
                className={`mt-8 w-full py-2.5 rounded-xl text-xs font-bold ${
                  p.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {p.id === 'free' ? 'Get Started Free' : `Select ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Help Center & FAQ</h1>
          <p className="mt-2 text-sm text-slate-600">Everything you need to know about ResumePilot AI.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">What makes a resume ATS-friendly?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ATS software parses resumes using text-extraction algorithms. Multi-column tables, text inside images, headers/footers with essential contact data, and custom graphics often confuse parsers. Our templates use single-column, hierarchical linear layouts with standard headings.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">How are AI rewrites validated?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ResumePilot requires user confirmation on every AI suggested rewrite. Suggestions are shown side-by-side in our Before & After comparison tool before applying to your draft.
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Can I delete all my stored resumes?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. You have full control over your data. You can delete individual resumes, reports, or delete your entire account in the Settings panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-6">Last updated: October 2026</p>
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>ResumePilot AI is committed to safeguarding your personal data and career documents.</p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Information We Collect</h2>
          <p>We collect information you explicitly provide: your name, contact information, employment history, education, and target job postings uploaded for analysis.</p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">2. How AI Models Process Data</h2>
          <p>Your resume data is processed via secure API endpoints solely to generate resume feedback, summaries, and job match reports. We do not sell your personal data or use your private resumes to train foundation models.</p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">3. Data Retention & Deletion</h2>
          <p>You may request deletion of all stored resumes, analysis records, and account details at any time from your account settings.</p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-xs text-slate-500 mb-6">Last updated: October 2026</p>
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>Welcome to ResumePilot AI. By using our services, you agree to these Terms of Service.</p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">1. Heuristic Diagnostic Disclaimer</h2>
          <p>All compatibility scores, match percentages, and optimization suggestions are heuristic guidelines based on common applicant tracking system practices. ResumePilot AI makes no representation or guarantee that following these recommendations will guarantee employment or interviews.</p>
          <h2 className="text-sm font-bold text-slate-900 pt-2">2. Factual Accuracy Representation</h2>
          <p>You remain solely responsible for ensuring that all work experience, credentials, and achievements submitted or exported through ResumePilot AI represent true and accurate professional history.</p>
        </div>
      </div>
    </div>
  );
};
