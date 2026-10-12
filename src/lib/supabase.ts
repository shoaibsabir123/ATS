import { createClient } from '@supabase/supabase-js';
import {
  ResumeData,
  ResumeAnalysisReport,
  JobMatchReport,
  CoverLetter,
  UserProfile,
  SubscriptionPlan
} from '../types/resume';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// =========================================================================
// Default Mock Data for Starter Session
// =========================================================================

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    tagline: 'Essential tools for launching your next job search.',
    priceMonthly: 0,
    priceAnnually: 0,
    currency: 'USD',
    limits: {
      resumesMax: 2,
      analysesPerMonth: 3,
      jobMatchesPerMonth: 2,
      coverLettersPerMonth: 1,
      allTemplates: false,
      docxExport: false,
      priorityAi: false,
    },
    features: [
      '2 Resume drafts',
      '3 ATS compatibility scans / month',
      '2 Job description match checks',
      'Standard PDF exports',
      'Classic & Modern templates',
      'Standard AI bullet assistant',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Pilot',
    tagline: 'Our most popular plan for active job seekers targeting competitive roles.',
    priceMonthly: 19,
    priceAnnually: 180,
    currency: 'USD',
    isPopular: true,
    limits: {
      resumesMax: 10,
      analysesPerMonth: 25,
      jobMatchesPerMonth: 20,
      coverLettersPerMonth: 15,
      allTemplates: true,
      docxExport: true,
      priorityAi: true,
    },
    features: [
      '10 Resume drafts & version history',
      '25 ATS scans with before/after fixes',
      '20 Job match tailored reports',
      '15 Custom AI cover letters',
      'All 6 ATS-compliant templates',
      'Selectable PDF & editable DOCX export',
      'Priority AI generation speeds',
      'Keyword gap analyzer',
    ],
  },
  {
    id: 'premium',
    name: 'Executive Career',
    tagline: 'High-volume applications, executive career tailoring & comprehensive support.',
    priceMonthly: 39,
    priceAnnually: 360,
    currency: 'USD',
    limits: {
      resumesMax: 50,
      analysesPerMonth: 100,
      jobMatchesPerMonth: 80,
      coverLettersPerMonth: 50,
      allTemplates: true,
      docxExport: true,
      priorityAi: true,
    },
    features: [
      '50 Tailored resumes & unlimited revisions',
      '100 ATS scans per month',
      '80 Job match analyses',
      '50 AI cover letters',
      'All current & upcoming templates',
      'Instant Word (.docx) & PDF exports',
      'Advanced executive phrasing models',
      'Priority queue & dedicated support',
    ],
  },
];

export const SAMPLE_RESUME: ResumeData = {
  id: 'sample-resume-1',
  title: 'Senior Full Stack Engineer Resume',
  templateId: 'classic-professional',
  targetJobTitle: 'Senior Full Stack Software Engineer',
  targetCompany: 'Stripe',
  targetJobDescription: 'Seeking a Senior Full Stack Engineer with strong TypeScript, React, Node.js, and cloud systems expertise to architect scalable payment APIs and intuitive UI workflows.',
  personalInfo: {
    fullName: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/alexvance-dev',
    github: 'https://github.com/alexvance',
    portfolio: 'https://alexvance.io',
  },
  summary: 'Performance-driven Senior Full Stack Engineer with 6+ years of experience architecting high-throughput web applications and scalable cloud microservices. Adept at modern TypeScript, React, and Node.js architectures, with a track record of driving 35% latency reductions and leading cross-functional engineering teams.',
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Technologies',
      position: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      startDate: '2022-03',
      endDate: '',
      isCurrent: true,
      bullets: [
        'Architected high-throughput payment ingestion pipeline processing $12M+ monthly transaction volume with 99.99% uptime.',
        'Spearheaded migration of legacy frontend to React and Tailwind CSS, reducing First Contentful Paint by 42% across 150K active users.',
        'Mentored 5 junior and mid-level software engineers through structured code reviews, pair programming, and architectural design workshops.',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    },
    {
      id: 'exp-2',
      company: 'MetricFlow SaaS',
      position: 'Software Engineer',
      location: 'Austin, TX',
      employmentType: 'Full-time',
      startDate: '2019-06',
      endDate: '2022-02',
      isCurrent: false,
      bullets: [
        'Built real-time telemetry dashboards utilizing WebSockets and Redis caching, cutting database load by 28%.',
        'Implemented automated CI/CD deployment pipelines using GitHub Actions, reducing release cycle time from 4 days to 45 minutes.',
        'Collaborated with product designers to implement accessibility (WCAG 2.1 AA) standards across all core client portals.',
      ],
      technologies: ['TypeScript', 'Express', 'React', 'Redis', 'Jest', 'GitHub Actions'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of Texas at Austin',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.82',
      honors: 'Dean\'s Honor List, Cum Laude',
      coursework: ['Distributed Systems', 'Data Structures & Algorithms', 'Database Management', 'Cloud Computing'],
    },
  ],
  skillCategories: [
    {
      category: 'Languages & Frameworks',
      skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Next.js', 'Python', 'HTML5/CSS3', 'Tailwind CSS'],
    },
    {
      category: 'Databases & Backend',
      skills: ['PostgreSQL', 'Redis', 'RESTful APIs', 'GraphQL', 'Prisma', 'MongoDB'],
    },
    {
      category: 'DevOps & Cloud',
      skills: ['Docker', 'AWS (ECS, S3, RDS)', 'CI/CD Pipelines', 'Git', 'Linux'],
    },
    {
      category: 'Core Competencies',
      skills: ['System Architecture', 'Agile/Scrum', 'Code Review', 'Web Performance Optimization', 'Unit & E2E Testing'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2023-04',
      expiryDate: '2026-04',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'OpenTelemetry Distributed Tracer',
      description: 'Open-source distributed request tracing middleware for Node.js microservices with Prometheus export.',
      bullets: [
        'Star count exceeded 850+ on GitHub with 12 external contributors.',
        'Reduced debugging time for distributed microservice failures by 60% across 14 enterprise adopters.',
      ],
      technologies: ['TypeScript', 'Node.js', 'OpenTelemetry', 'Prometheus'],
      link: 'https://github.com/alexvance/node-tracer',
    },
  ],
  additionalSections: [
    {
      id: 'sec-lang',
      title: 'Languages',
      items: ['English (Native)', 'Spanish (Professional Working Proficiency)'],
    },
  ],
  fontSize: 'md',
  spacing: 'normal',
  colorTheme: '#2563eb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastAnalysisScore: 88,
};

export const SAMPLE_ANALYSIS: ResumeAnalysisReport = {
  id: 'sample-analysis-1',
  userId: 'demo-user-1',
  resumeId: 'sample-resume-1',
  resumeTitle: 'Senior Full Stack Engineer Resume',
  jobTargetTitle: 'Senior Full Stack Software Engineer at Stripe',
  overallScore: 88,
  scoreBand: 'Strong ATS Compatibility (85–100)',
  summaryAssessment: 'Your resume features robust single-column ATS structure, strong quantifiable accomplishments ($12M+ volume, 42% FCP reduction), and solid alignment with senior engineering requisites. Applying key keyword enhancements in cloud architecture will maximize screening conversion.',
  categoryScores: {
    structure: {
      name: 'Resume Structure & Parsing Readiness',
      score: 24,
      maxScore: 25,
      evidence: [
        'Single-column linear hierarchy ensures 100% text parser readability.',
        'Standard industry section headings (Summary, Experience, Education, Skills) correctly detected.',
        'Selectable text without complex multi-column floating boxes or icons as text substitutes.',
      ],
      recommendations: [
        'Maintain single-column consistency across all printed pages.',
      ],
    },
    skills: {
      name: 'Relevant Skills & Keyword Alignment',
      score: 22,
      maxScore: 25,
      evidence: [
        'Matched core competencies: TypeScript, React, Node.js, PostgreSQL, Docker, AWS.',
        'Strong overlap with target job description technical stack.',
      ],
      recommendations: [
        'Include "API Architecture", "Microservices", and "Payment Processing" more explicitly in skills matrix.',
      ],
    },
    experience: {
      name: 'Experience Relevance & Clarity',
      score: 18,
      maxScore: 20,
      evidence: [
        'Action verbs prominently lead every bullet point (Architected, Spearheaded, Mentored).',
        'Strong quantifiable metrics: "$12M+ monthly", "42% reduction", "150K active users".',
      ],
      recommendations: [
        'Add specific dollar impact or latency numbers to the MetricFlow entry bullet #3.',
      ],
    },
    summary: {
      name: 'Professional Summary & Content Quality',
      score: 13,
      maxScore: 15,
      evidence: [
        'Concise 3-line overview highlighting years of experience, core tech stack, and leadership impact.',
      ],
      recommendations: [
        'Integrate your target role keyword explicitly in the first sentence.',
      ],
    },
    formatting: {
      name: 'Formatting & Consistency',
      score: 9,
      maxScore: 10,
      evidence: [
        'Consistent date formats (YYYY-MM to Present) throughout.',
        'Uniform typography and clear contact information with reachable links.',
      ],
      recommendations: [
        'Ensure bullet point punctuation is uniform (end every bullet point with a period).',
      ],
    },
    completeness: {
      name: 'Completeness of Relevant Sections',
      score: 5,
      maxScore: 5,
      evidence: [
        'Contact details, summary, experience, education, skills, and certifications all present.',
      ],
      recommendations: [],
    },
  },
  strengths: [
    'Exceptional quantifiable impact: concrete metrics ($12M+, 42%, 28%) clearly validate career success.',
    'Flawless ATS parsing layout with clean standard headings and chronological timeline.',
    'High technical relevance aligning directly with senior frontend and backend engineering qualifications.',
  ],
  topImprovements: [
    'Incorporate explicit keywords: "Microservices", "RESTful API Design", and "Payment Systems".',
    'Add quantifiable metrics to the accessibility and design collaboration bullet points.',
    'Harmonize punctuation across all experience bullet entries.',
  ],
  matchedKeywords: [
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'Full Stack',
    'Scalability',
    'CI/CD Pipelines',
    'System Architecture',
  ],
  missingKeywords: [
    'Microservices',
    'Payment Systems',
    'RESTful API Architecture',
    'Unit Testing (Jest/Mocha)',
    'High Availability',
  ],
  partialKeywords: [
    'Telemetry / Monitoring',
    'Database Optimization',
  ],
  recommendations: [
    {
      id: 'rec-1',
      issue: 'Missing High-Value Domain Keyword: "Microservices"',
      whyItMatters: 'ATS scanners for senior backend/full-stack postings filter specifically for architectural paradigms.',
      suggestedCorrection: 'Mention microservices architecture in your Apex Cloud or MetricFlow role overview.',
      exampleRewrite: 'Architected high-throughput microservices handling $12M+ monthly transaction volume with 99.99% uptime.',
      priority: 'high',
      section: 'Work Experience',
    },
    {
      id: 'rec-2',
      issue: 'Unquantified Achievement in Junior Engineer Mentorship',
      whyItMatters: 'Quantified leadership examples stand out dramatically to both AI filters and hiring directors.',
      suggestedCorrection: 'Include the promotion rate or onboarding time reduction resulting from your mentorship.',
      exampleRewrite: 'Mentored 5 engineers through structured design workshops, accelerating new hire ramp-up time by 30%.',
      priority: 'medium',
      section: 'Work Experience',
    },
    {
      id: 'rec-3',
      issue: 'Punctuation inconsistency in experience bullets',
      whyItMatters: 'Grammar and formatting consistency demonstrates meticulous attention to detail in technical roles.',
      suggestedCorrection: 'Ensure every bullet ends with a period.',
      priority: 'low',
      section: 'Formatting',
    },
  ],
  beforeAfterExamples: [
    {
      id: 'ba-1',
      section: 'Apex Cloud Technologies - Bullet 1',
      originalText: 'Architected high-throughput payment ingestion pipeline processing $12M+ monthly transaction volume with 99.99% uptime.',
      improvedText: 'Architected scalable microservices payment ingestion pipeline processing $12M+ monthly transaction volume with 99.99% SLA uptime.',
      rationale: 'Injects key ATS phrases "scalable microservices" and "SLA uptime" without altering truthful history.',
      status: 'pending',
    },
    {
      id: 'ba-2',
      section: 'Professional Summary',
      originalText: 'Performance-driven Senior Full Stack Engineer with 6+ years of experience architecting high-throughput web applications and scalable cloud microservices.',
      improvedText: 'Results-driven Senior Full Stack Engineer with 6+ years specializing in high-throughput microservices, React web applications, and resilient cloud architectures.',
      rationale: 'Front-loads primary role keywords for automated applicant screening algorithms.',
      status: 'pending',
    },
  ],
  createdAt: new Date().toISOString(),
};

// =========================================================================
// Storage / Repository Implementation
// =========================================================================

const STORAGE_KEYS = {
  USER: 'rp_user',
  RESUMES: 'rp_resumes',
  ANALYSES: 'rp_analyses',
  JOB_TARGETS: 'rp_job_targets',
  COVER_LETTERS: 'rp_cover_letters',
  PLANS: 'rp_plans',
  SUBSCRIPTIONS: 'rp_subscription',
  AUDIT_LOGS: 'rp_audit_logs',
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// Ensure initial demo data exists in local persistence
function initStorage() {
  const existingResumes = getStored<ResumeData[]>(STORAGE_KEYS.RESUMES, []);
  if (existingResumes.length === 0) {
    setStored(STORAGE_KEYS.RESUMES, [SAMPLE_RESUME]);
  }

  const existingAnalyses = getStored<ResumeAnalysisReport[]>(STORAGE_KEYS.ANALYSES, []);
  if (existingAnalyses.length === 0) {
    setStored(STORAGE_KEYS.ANALYSES, [SAMPLE_ANALYSIS]);
  }
}

if (typeof window !== 'undefined') {
  initStorage();
}

// Current User State Helper
export function getCurrentUser(): UserProfile | null {
  return getStored<UserProfile | null>(STORAGE_KEYS.USER, {
    id: 'demo-user-1',
    email: 'rizwansabirksa1990@gmail.com',
    fullName: 'Rizwan Sabir',
    role: 'user',
    targetJobTitle: 'Senior Full Stack Software Engineer',
    industry: 'Software & Technology',
    experienceLevel: 'Senior Level',
    preferredLanguage: 'English',
    planId: 'pro',
    resumesCount: 1,
    analysesCount: 1,
    createdAt: new Date().toISOString(),
  });
}

export function saveCurrentUser(user: UserProfile | null): void {
  setStored(STORAGE_KEYS.USER, user);
}

// Resumes Operations
export function getStoredResumes(): ResumeData[] {
  return getStored<ResumeData[]>(STORAGE_KEYS.RESUMES, [SAMPLE_RESUME]);
}

export function getResumeById(id: string): ResumeData | undefined {
  const list = getStoredResumes();
  return list.find((r) => r.id === id);
}

export function saveResume(resume: ResumeData): ResumeData {
  const list = getStoredResumes();
  const index = list.findIndex((r) => r.id === resume.id);
  const now = new Date().toISOString();
  const updatedResume: ResumeData = {
    ...resume,
    updatedAt: now,
    createdAt: resume.createdAt || now,
  };

  if (index >= 0) {
    list[index] = updatedResume;
  } else {
    list.unshift(updatedResume);
  }

  setStored(STORAGE_KEYS.RESUMES, list);

  // Update profile resume count
  const user = getCurrentUser();
  if (user) {
    user.resumesCount = list.length;
    saveCurrentUser(user);
  }

  return updatedResume;
}

export function deleteResume(id: string): void {
  const list = getStoredResumes();
  const filtered = list.filter((r) => r.id !== id);
  setStored(STORAGE_KEYS.RESUMES, filtered);

  const user = getCurrentUser();
  if (user) {
    user.resumesCount = filtered.length;
    saveCurrentUser(user);
  }
}

export function duplicateResume(id: string): ResumeData | null {
  const original = getResumeById(id);
  if (!original) return null;

  const duplicated: ResumeData = {
    ...original,
    id: `resume-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveResume(duplicated);
}

// Analyses Operations
export function getStoredAnalyses(): ResumeAnalysisReport[] {
  return getStored<ResumeAnalysisReport[]>(STORAGE_KEYS.ANALYSES, [SAMPLE_ANALYSIS]);
}

export function getAnalysisById(id: string): ResumeAnalysisReport | undefined {
  const list = getStoredAnalyses();
  return list.find((a) => a.id === id);
}

export function saveAnalysis(analysis: ResumeAnalysisReport): ResumeAnalysisReport {
  const list = getStoredAnalyses();
  const index = list.findIndex((a) => a.id === analysis.id);
  if (index >= 0) {
    list[index] = analysis;
  } else {
    list.unshift(analysis);
  }
  setStored(STORAGE_KEYS.ANALYSES, list);

  // Update linked resume score if linked
  if (analysis.resumeId) {
    const resume = getResumeById(analysis.resumeId);
    if (resume) {
      resume.lastAnalysisScore = analysis.overallScore;
      saveResume(resume);
    }
  }

  const user = getCurrentUser();
  if (user) {
    user.analysesCount = list.length;
    saveCurrentUser(user);
  }

  return analysis;
}

export function deleteAnalysis(id: string): void {
  const list = getStoredAnalyses();
  const filtered = list.filter((a) => a.id !== id);
  setStored(STORAGE_KEYS.ANALYSES, filtered);
}

// Job Targets Operations
export interface JobTarget {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  associatedResumeId?: string;
  matchPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

export function getStoredJobTargets(): JobTarget[] {
  return getStored<JobTarget[]>(STORAGE_KEYS.JOB_TARGETS, [
    {
      id: 'job-target-1',
      userId: 'demo-user-1',
      companyName: 'Stripe',
      jobTitle: 'Senior Full Stack Software Engineer',
      jobDescription: 'Seeking an experienced Senior Full Stack Engineer proficient with TypeScript, React, Node.js, distributed databases, and high-availability payment microservices.',
      associatedResumeId: 'sample-resume-1',
      matchPercentage: 88,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
}

export function saveJobTarget(target: JobTarget): JobTarget {
  const list = getStoredJobTargets();
  const index = list.findIndex((t) => t.id === target.id);
  if (index >= 0) {
    list[index] = { ...target, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({ ...target, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  setStored(STORAGE_KEYS.JOB_TARGETS, list);
  return target;
}

export function deleteJobTarget(id: string): void {
  const list = getStoredJobTargets().filter((t) => t.id !== id);
  setStored(STORAGE_KEYS.JOB_TARGETS, list);
}

// Cover Letters Operations
export function getStoredCoverLetters(): CoverLetter[] {
  return getStored<CoverLetter[]>(STORAGE_KEYS.COVER_LETTERS, [
    {
      id: 'cl-1',
      userId: 'demo-user-1',
      resumeId: 'sample-resume-1',
      jobTitle: 'Senior Full Stack Software Engineer',
      companyName: 'Stripe',
      tone: 'confident',
      content: `Dear Hiring Team at Stripe,

I am writing to express my enthusiastic interest in the Senior Full Stack Software Engineer role at Stripe. Having spent the past six years architecting high-throughput distributed systems and intuitive client-side applications, I have long admired Stripe's benchmark for developer experience and infrastructure reliability.

At Apex Cloud Technologies, I led the architecture of our core payment ingestion pipeline, handling upwards of $12M in monthly transaction volume with 99.99% uptime. Additionally, I spearheaded the frontend modernization to React, which reduced First Contentful Paint by 42% for over 150,000 active users.

Stripe's commitment to building economic infrastructure for the internet resonates deeply with my dedication to building resilient, performant software. I welcome the opportunity to discuss how my expertise in TypeScript, React, and cloud systems can contribute directly to your team's upcoming initiatives.

Sincerely,
Alex Vance`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
}

export function saveCoverLetter(cl: CoverLetter): CoverLetter {
  const list = getStoredCoverLetters();
  const index = list.findIndex((c) => c.id === cl.id);
  if (index >= 0) {
    list[index] = { ...cl, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({ ...cl, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  setStored(STORAGE_KEYS.COVER_LETTERS, list);
  return cl;
}

export function deleteCoverLetter(id: string): void {
  const list = getStoredCoverLetters().filter((c) => c.id !== id);
  setStored(STORAGE_KEYS.COVER_LETTERS, list);
}

// Audit Logs & Admin
export interface AdminAuditLog {
  id: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  timestamp: string;
  details: string;
}

export function getStoredAuditLogs(): AdminAuditLog[] {
  return getStored<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
    {
      id: 'log-1',
      actorUserId: 'admin-1',
      actorEmail: 'admin@resumepilot.ai',
      action: 'SYSTEM_BOOT',
      targetType: 'system',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      details: 'ResumePilot AI platform services initialized with Gemini 3.8 Flash model.',
    },
    {
      id: 'log-2',
      actorUserId: 'demo-user-1',
      actorEmail: 'rizwansabirksa1990@gmail.com',
      action: 'ATS_SCAN_COMPLETED',
      targetType: 'resume_analysis',
      targetId: 'sample-analysis-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      details: 'Completed comprehensive ATS scan: Score 88/100.',
    },
  ]);
}

export function recordAuditLog(action: string, targetType: string, details: string, targetId?: string): void {
  const logs = getStoredAuditLogs();
  const user = getCurrentUser();
  logs.unshift({
    id: `log-${Date.now()}`,
    actorUserId: user?.id || 'anonymous',
    actorEmail: user?.email || 'anonymous',
    action,
    targetType,
    targetId,
    timestamp: new Date().toISOString(),
    details,
  });
  setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
}
