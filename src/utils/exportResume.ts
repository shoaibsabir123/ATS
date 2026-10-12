import { ResumeData } from '../types/resume';
import { jsPDF } from 'jspdf';

export async function downloadDocxResume(resume: ResumeData): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/documents/export-docx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resume),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to generate Word document');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = (resume.personalInfo?.fullName || resume.title || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `${cleanName}_ATS_Optimized.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 2000);

    return { success: true };
  } catch (error: any) {
    console.error('Download DOCX error:', error);
    return { success: false, message: error.message || 'Could not export Word document' };
  }
}

export function downloadPdfResume(resume: ResumeData): { success: boolean; message?: string } {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'letter',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 45;
    const contentWidth = pageWidth - margin * 2;
    let cursorY = 48;

    const checkPageBreak = (neededHeight: number) => {
      if (cursorY + neededHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
    };

    const addSectionHeader = (title: string) => {
      checkPageBreak(30);
      cursorY += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text(title.toUpperCase(), margin, cursorY);
      cursorY += 4;
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.75);
      doc.line(margin, cursorY, margin + contentWidth, cursorY);
      cursorY += 12;
    };

    // Header: Full Name
    const fullName = resume.personalInfo?.fullName || resume.title || 'Candidate Name';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(fullName, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 16;

    // Target Job Title
    if (resume.targetJobTitle) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235); // blue-600
      doc.text(resume.targetJobTitle.toUpperCase(), pageWidth / 2, cursorY, { align: 'center' });
      cursorY += 14;
    }

    // Contact info
    const contacts = [
      resume.personalInfo?.email,
      resume.personalInfo?.phone,
      resume.personalInfo?.location,
      resume.personalInfo?.linkedin,
      resume.personalInfo?.github,
    ].filter(Boolean);

    if (contacts.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(contacts.join('  •  '), pageWidth / 2, cursorY, { align: 'center' });
      cursorY += 16;
    }

    // Summary
    if (resume.summary) {
      addSectionHeader('Professional Summary');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      const summaryLines = doc.splitTextToSize(resume.summary, contentWidth);
      checkPageBreak(summaryLines.length * 12);
      doc.text(summaryLines, margin, cursorY);
      cursorY += summaryLines.length * 12 + 6;
    }

    // Work Experience
    if (resume.experience && resume.experience.length > 0) {
      addSectionHeader('Professional Experience');

      resume.experience.forEach((exp) => {
        checkPageBreak(40);
        // Position & Company
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(exp.position, margin, cursorY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const compText = ` — ${exp.company}${exp.location ? `, ${exp.location}` : ''}`;
        const posWidth = doc.getTextWidth(exp.position);
        doc.text(compText, margin + posWidth, cursorY);

        // Date on right
        const dateStr = `${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : exp.endDate || ''}`;
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(dateStr, margin + contentWidth, cursorY, { align: 'right' });
        cursorY += 12;

        // Bullets
        if (exp.bullets && exp.bullets.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);

          exp.bullets.forEach((bullet) => {
            const bulletIndent = 12;
            const bulletLines = doc.splitTextToSize(bullet, contentWidth - bulletIndent);
            checkPageBreak(bulletLines.length * 11 + 4);
            doc.text('•', margin + 3, cursorY);
            doc.text(bulletLines, margin + bulletIndent, cursorY);
            cursorY += bulletLines.length * 11 + 3;
          });
        }
        cursorY += 4;
      });
    }

    // Skills
    if (resume.skillCategories && resume.skillCategories.length > 0) {
      addSectionHeader('Skills & Competencies');
      doc.setFontSize(8.5);

      resume.skillCategories.forEach((cat) => {
        const catLabel = `${cat.category}: `;
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        const labelWidth = doc.getTextWidth(catLabel);

        const skillsStr = cat.skills.join(', ');
        const skillLines = doc.splitTextToSize(skillsStr, contentWidth - labelWidth);
        checkPageBreak(skillLines.length * 11 + 2);

        doc.text(catLabel, margin, cursorY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(skillLines, margin + labelWidth, cursorY);
        cursorY += skillLines.length * 11 + 3;
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      addSectionHeader('Education');
      resume.education.forEach((edu) => {
        checkPageBreak(25);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        const eduTitle = `${edu.degree || 'Degree'} in ${edu.fieldOfStudy || 'Field'}`;
        doc.text(eduTitle, margin, cursorY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const instText = ` — ${edu.institution}`;
        const titleWidth = doc.getTextWidth(eduTitle);
        doc.text(instText, margin + titleWidth, cursorY);

        const dateStr = `${edu.startDate || ''} – ${edu.endDate || ''}`;
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(dateStr, margin + contentWidth, cursorY, { align: 'right' });
        cursorY += 13;
      });
    }

    const cleanName = (resume.personalInfo?.fullName || resume.title || 'Resume').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${cleanName}_ATS_Optimized.pdf`;

    try {
      const blob = doc.output('blob');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 2000);
    } catch {
      doc.save(filename);
    }
    return { success: true };
  } catch (error: any) {
    console.error('Download PDF error:', error);
    return { success: false, message: error.message || 'Could not export PDF document' };
  }
}

export function triggerPrintResume(): void {
  window.print();
}
