export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
  technologies?: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  coursework?: string[];
  honors?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  technologies: string[];
  link?: string;
}

export interface AdditionalSection {
  id: string;
  title: string;
  items: string[];
}

export interface ResumeData {
  id: string;
  title: string;
  templateId: ResumeTemplateId;
  targetJobTitle?: string;
  targetCompany?: string;
  targetJobDescription?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skillCategories: SkillCategory[];
  certifications: Certification[];
  projects: Project[];
  additionalSections: AdditionalSection[];
  fontSize?: 'sm' | 'md' | 'lg';
  spacing?: 'compact' | 'normal' | 'spacious';
  colorTheme?: string;
  createdAt: string;
  updatedAt: string;
  lastAnalysisScore?: number;
}

export type ResumeTemplateId =
  | 'classic-professional'
  | 'modern-minimal'
  | 'corporate-executive'
  | 'technical-engineering'
  | 'graduate-entry'
  | 'creative-professional';

export interface TemplateDefinition {
  id: ResumeTemplateId;
  name: string;
  category: string;
  description: string;
  recommendedFor: string;
  isAtsOptimized: boolean;
  badge?: string;
  accentColor: string;
}

export interface AnalysisCategoryScore {
  name: string;
  score: number;
  maxScore: number;
  evidence: string[];
  recommendations: string[];
}

export interface RecommendationItem {
  id: string;
  issue: string;
  whyItMatters: string;
  suggestedCorrection: string;
  exampleRewrite?: string;
  priority: 'high' | 'medium' | 'low';
  section: string;
}

export interface BeforeAfterExample {
  id: string;
  section: string;
  originalText: string;
  improvedText: string;
  rationale: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ResumeAnalysisReport {
  id: string;
  userId: string;
  resumeId?: string;
  resumeTitle?: string;
  uploadedFileName?: string;
  jobTargetTitle?: string;
  jobDescription?: string;
  overallScore: number;
  scoreBand: string;
  summaryAssessment: string;
  categoryScores: {
    structure: AnalysisCategoryScore;
    skills: AnalysisCategoryScore;
    experience: AnalysisCategoryScore;
    summary: AnalysisCategoryScore;
    formatting: AnalysisCategoryScore;
    completeness: AnalysisCategoryScore;
  };
  strengths: string[];
  topImprovements: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  partialKeywords?: string[];
  recommendations: RecommendationItem[];
  beforeAfterExamples: BeforeAfterExample[];
  createdAt: string;
}

export interface JobMatchReport {
  id: string;
  resumeId: string;
  jobTitle: string;
  companyName?: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingRequirements: string[];
  recommendedKeywords: string[];
  summaryFeedback: string;
  experienceSuggestions: string[];
  unsupportedClaimsWarnings?: string[];
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  resumeId?: string;
  jobTitle: string;
  companyName: string;
  tone: 'formal' | 'confident' | 'concise' | 'personable';
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  targetJobTitle?: string;
  industry?: string;
  experienceLevel?: string;
  preferredLanguage?: string;
  planId: 'free' | 'pro' | 'premium';
  resumesCount: number;
  analysesCount: number;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'premium';
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnually: number;
  currency: string;
  limits: {
    resumesMax: number;
    analysesPerMonth: number;
    jobMatchesPerMonth: number;
    coverLettersPerMonth: number;
    allTemplates: boolean;
    docxExport: boolean;
    priorityAi: boolean;
  };
  features: string[];
  isPopular?: boolean;
}
