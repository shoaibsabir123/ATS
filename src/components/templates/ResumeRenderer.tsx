import React from 'react';
import { ResumeData, TemplateDefinition } from '../../types/resume';

export const TEMPLATE_DEFINITIONS: TemplateDefinition[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    category: 'Corporate & Finance',
    description: 'Timeless, single-column serif header with clean horizontal dividers. Universally favored by traditional ATS parsers.',
    recommendedFor: 'Finance, Law, Healthcare, Corporate, and General Management',
    isAtsOptimized: true,
    badge: '100% ATS Safe',
    accentColor: '#1e293b',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'Tech & Product',
    description: 'Crisp indigo accents, modern sans-serif typography, and subtle section tags for high visual impact.',
    recommendedFor: 'Software Engineering, Product Management, Marketing, and Design',
    isAtsOptimized: true,
    badge: 'Recruiter Favorite',
    accentColor: '#2563eb',
  },
  {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    category: 'Executive & Director',
    description: 'Deep navy banner typography, high-density bullet layouts, and structured leadership highlights.',
    recommendedFor: 'VP, Director, C-Suite, and Senior Management roles',
    isAtsOptimized: true,
    badge: 'Leadership',
    accentColor: '#0f172a',
  },
  {
    id: 'technical-engineering',
    name: 'Technical & Engineering',
    category: 'Engineering & DevOps',
    description: 'Dense technical hierarchy, dedicated skills matrix categories, and project repository indicators.',
    recommendedFor: 'Full Stack, DevOps, Data Science, and Cloud Architecture',
    isAtsOptimized: true,
    badge: 'Developer Choice',
    accentColor: '#0d9488',
  },
  {
    id: 'graduate-entry',
    name: 'Graduate & Entry-Level',
    category: 'New Grads & Students',
    description: 'Prominently positions education, academic honors, relevant coursework, and internship milestones.',
    recommendedFor: 'Recent College Graduates, Interns, and Early Career Seekers',
    isAtsOptimized: true,
    badge: 'Early Career',
    accentColor: '#4f46e5',
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    category: 'Creative & Media',
    description: 'Elegant dual-toned accent styling with 100% linear text flow to preserve ATS parsability while looking stunning.',
    recommendedFor: 'UI/UX Design, Communications, Media, and Brand Strategy',
    isAtsOptimized: true,
    badge: 'Modern Aesthetic',
    accentColor: '#7c3aed',
  },
];

interface TemplateProps {
  data: ResumeData;
  scale?: number;
}

// 1. Classic Professional Template
export const ClassicProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skillCategories, certifications, projects, additionalSections } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      {/* Header */}
      <div className="text-center border-b-2 border-slate-800 pb-5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-wider text-slate-900 mb-2">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {data.targetJobTitle && (
          <p className="text-sm font-medium tracking-wide uppercase text-slate-600 mb-2">
            {data.targetJobTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>• <a href={personalInfo.linkedin} className="text-blue-700 hover:underline">LinkedIn</a></span>
          )}
          {personalInfo.github && (
            <span>• <a href={personalInfo.github} className="text-blue-700 hover:underline">GitHub</a></span>
          )}
          {personalInfo.portfolio && (
            <span>• <a href={personalInfo.portfolio} className="text-blue-700 hover:underline">Portfolio</a></span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-normal text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3 font-serif">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-baseline mb-1">
                  <div>
                    <span className="font-bold text-xs sm:text-[13px] text-slate-900">{exp.position}</span>
                    <span className="text-xs sm:text-[13px] text-slate-700">, {exp.company}</span>
                    {exp.location && <span className="text-xs text-slate-500 italic"> — {exp.location}</span>}
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-normal">{bullet}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    Technologies: {exp.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
            Skills & Competencies
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {skillCategories.map((cat, i) => (
              <div key={i} className="flex flex-wrap gap-1">
                <span className="font-bold text-slate-800">{cat.category}:</span>
                <span>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3 font-serif">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-xs sm:text-[13px] text-slate-900">
                      {edu.degree} in {edu.fieldOfStudy}
                    </span>
                    <span className="text-xs text-slate-700">, {edu.institution}</span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                {(edu.gpa || edu.honors) && (
                  <p className="text-xs text-slate-600 italic">
                    {[edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' • ')}
                  </p>
                )}
                {edu.coursework && edu.coursework.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Coursework: {edu.coursework.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
            Certifications
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span>
                  <strong className="text-slate-800">{cert.name}</strong> — {cert.issuer}
                </span>
                <span className="text-slate-500">{cert.issueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-3 font-serif">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-slate-900">{proj.title}</span>
                  {proj.link && <a href={proj.link} className="text-xs text-blue-700 hover:underline">Link</a>}
                </div>
                <p className="text-xs text-slate-700 leading-normal">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional */}
      {additionalSections && additionalSections.map((sec) => (
        <div key={sec.id} className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-2 font-serif">
            {sec.title}
          </h2>
          <p className="text-xs text-slate-700">{sec.items.join(' • ')}</p>
        </div>
      ))}
    </div>
  );
};

// 2. Modern Minimal Template
export const ModernMinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skillCategories, certifications, projects } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      {/* Header */}
      <div className="border-l-4 border-blue-600 pl-4 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        {data.targetJobTitle && (
          <p className="text-sm font-semibold text-blue-600 mt-0.5 tracking-wide">
            {data.targetJobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} className="text-blue-600 hover:underline">GitHub</a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded inline-block mb-2">
            Summary
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded inline-block mb-3">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-xs sm:text-[13px] text-slate-900">
                    {exp.position} <span className="text-blue-600 font-normal">@ {exp.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <div className="text-[11px] text-slate-400 mb-1">{exp.location}</div>}
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700 mt-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded inline-block mb-2">
            Key Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            {skillCategories.map((cat, i) => (
              <div key={i} className="p-2.5 rounded border border-slate-100 bg-slate-50/50">
                <span className="font-bold text-slate-800 block mb-1 text-[11px] uppercase tracking-wider">
                  {cat.category}
                </span>
                <span className="text-slate-600">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded inline-block mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-semibold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-500"> — {edu.institution}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Projects */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded inline-block mb-2">
            Certifications
          </h2>
          <div className="text-xs text-slate-700 space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between">
                <span><strong>{cert.name}</strong> • {cert.issuer}</span>
                <span className="text-slate-500 font-mono text-[11px]">{cert.issueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Corporate Executive Template
export const CorporateExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skillCategories, certifications } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      <div className="border-b-4 border-slate-900 pb-5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div className="text-sm font-semibold tracking-wide text-slate-700 uppercase mt-1">
          {data.targetJobTitle || 'Executive Leadership'}
        </div>
        <div className="flex flex-wrap gap-x-3 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.location && <span>| {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>| <a href={personalInfo.linkedin} className="text-slate-900 hover:underline">LinkedIn</a></span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white bg-slate-900 px-2 py-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white bg-slate-900 px-2 py-1 mb-3">
            Career Experience & Leadership
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-xs sm:text-[13px] text-slate-900 uppercase">
                    {exp.position} — {exp.company}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white bg-slate-900 px-2 py-1 mb-2">
            Core Competencies & Governance
          </h2>
          <div className="space-y-1 text-xs text-slate-800">
            {skillCategories.map((c, i) => (
              <div key={i}><span className="font-bold">{c.category}: </span>{c.skills.join(' • ')}</div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white bg-slate-900 px-2 py-1 mb-2">
            Education & Credentials
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between">
                <span><strong>{e.degree} in {e.fieldOfStudy}</strong>, {e.institution}</span>
                <span className="text-slate-600">{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Technical & Engineering Template
export const TechnicalEngineeringTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      <div className="border-b border-teal-600 pb-4 mb-6">
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs font-mono font-semibold text-teal-700 mt-1">
              &gt; {data.targetJobTitle || 'Software Engineer'}
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone}</div>
            <div>{personalInfo.location}</div>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-mono text-teal-700 mt-2">
          {personalInfo.github && <a href={personalInfo.github} className="hover:underline">github.com</a>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="hover:underline">linkedin.com</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} className="hover:underline">portfolio</a>}
        </div>
      </div>

      {/* Skills Matrix Prominent for Technical roles */}
      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-6 bg-slate-50 p-3 rounded border border-slate-200">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 mb-2">
            // Technical Skill Matrix
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skillCategories.map((c, i) => (
              <div key={i}>
                <span className="font-mono font-bold text-slate-700 text-[11px] block">{c.category}:</span>
                <span className="text-slate-600 font-sans">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">
            // Profile Summary
          </h2>
          <p className="text-xs text-slate-700">{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-3">
            // Work History
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">{exp.position} @ {exp.company}</span>
                  <span className="text-slate-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs text-slate-700">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="text-[11px] font-mono text-teal-700 mt-1">
                    Stack: {exp.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">
            // Open Source & Projects
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold">{p.title}</span>
                  {p.link && <a href={p.link} className="text-teal-700 hover:underline">Link</a>}
                </div>
                <p className="text-xs text-slate-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-800 border-b border-slate-200 pb-1 mb-2">
            // Education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between">
                <span><strong>{e.degree} in {e.fieldOfStudy}</strong>, {e.institution}</span>
                <span className="font-mono text-slate-500">{e.startDate} - {e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Graduate & Entry-Level Template
export const GraduateEntryTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, education, experience, skillCategories, projects, certifications } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      <div className="text-center border-b border-indigo-200 pb-5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-950">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div className="text-xs font-semibold text-indigo-700 tracking-wide mt-1">
          {data.targetJobTitle || 'Graduate Candidate'}
        </div>
        <div className="flex justify-center flex-wrap gap-3 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• <a href={personalInfo.linkedin} className="text-indigo-600 hover:underline">LinkedIn</a></span>}
        </div>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Career Objective
          </h2>
          <p className="text-xs text-slate-700">{summary}</p>
        </div>
      )}

      {/* Education First for Graduates */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
            Education & Academic Honors
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-600">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">{edu.institution}</div>
                {(edu.gpa || edu.honors) && (
                  <p className="text-xs text-indigo-800 italic mt-0.5">
                    {[edu.gpa ? `GPA: ${edu.gpa}` : '', edu.honors].filter(Boolean).join(' • ')}
                  </p>
                )}
                {edu.coursework && edu.coursework.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Relevant Coursework: {edu.coursework.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-3">
            Experience & Internships
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="font-bold text-slate-900">{exp.position}, {exp.company}</span>
                  <span className="text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Academic & Capstone Projects
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">{p.title}</span>
                  {p.technologies?.length ? <span className="text-slate-500 italic text-[11px]">{p.technologies.join(', ')}</span> : null}
                </div>
                <p className="text-xs text-slate-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Skills & Tools
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {skillCategories.map((c, i) => (
              <div key={i}><span className="font-bold">{c.category}:</span> {c.skills.join(', ')}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Creative Professional Template (ATS safe linear flow with distinct purple accent)
export const CreativeProfessionalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skillCategories, projects, certifications } = data;

  return (
    <div className="font-sans text-slate-900 leading-relaxed max-w-[800px] mx-auto p-8 sm:p-12 bg-white">
      <div className="border-b-2 border-purple-500 pb-5 mb-7">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div className="text-sm font-bold text-purple-700 tracking-wider uppercase mt-1">
          {data.targetJobTitle || 'Creative Leader'}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} className="text-purple-700 font-semibold hover:underline">Portfolio</a>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="text-purple-700 font-semibold hover:underline">LinkedIn</a>}
        </div>
      </div>

      {summary && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-900 border-l-2 border-purple-600 pl-2 mb-2">
            Statement & Vision
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-900 border-l-2 border-purple-600 pl-2 mb-3">
            Selected Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="font-bold text-slate-900">{exp.position} — <span className="text-purple-800">{exp.company}</span></span>
                  <span className="text-slate-500 font-mono text-[11px]">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillCategories && skillCategories.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-900 border-l-2 border-purple-600 pl-2 mb-2">
            Core Disciplines & Software
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skillCategories.map((c, i) => (
              <div key={i} className="bg-purple-50/40 p-2 rounded">
                <span className="font-bold text-purple-950 block text-[11px] uppercase">{c.category}</span>
                <span className="text-slate-700">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && (
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-900 border-l-2 border-purple-600 pl-2 mb-2">
            Key Projects & Case Studies
          </h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900">{p.title}</span>
                  {p.link && <a href={p.link} className="text-purple-700 hover:underline">Link</a>}
                </div>
                <p className="text-xs text-slate-700">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-purple-900 border-l-2 border-purple-600 pl-2 mb-2">
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between">
                <span><strong>{e.degree} in {e.fieldOfStudy}</strong>, {e.institution}</span>
                <span className="text-slate-500 font-mono text-[11px]">{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Dispatcher Component
export const ResumeRenderer: React.FC<TemplateProps> = ({ data, scale = 1 }) => {
  const templateId = data.templateId || 'classic-professional';

  let Component = ClassicProfessionalTemplate;
  switch (templateId) {
    case 'modern-minimal':
      Component = ModernMinimalTemplate;
      break;
    case 'corporate-executive':
      Component = CorporateExecutiveTemplate;
      break;
    case 'technical-engineering':
      Component = TechnicalEngineeringTemplate;
      break;
    case 'graduate-entry':
      Component = GraduateEntryTemplate;
      break;
    case 'creative-professional':
      Component = CreativeProfessionalTemplate;
      break;
    default:
      Component = ClassicProfessionalTemplate;
  }

  return (
    <div
      id="printable-resume-node"
      className="resume-paper bg-white shadow-xl rounded-lg border border-slate-200 overflow-hidden transition-all duration-200"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      <Component data={data} scale={scale} />
    </div>
  );
};
