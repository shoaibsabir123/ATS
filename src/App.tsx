import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/ui/Navbar';
import { DashboardSidebar } from './components/ui/DashboardSidebar';
import { DashboardHeader } from './components/ui/DashboardHeader';
import { ToastContainer } from './components/ui/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import {
  FeaturesPage,
  TemplatesPage,
  PricingPage,
  FaqPage,
  PrivacyPage,
  TermsPage,
} from './pages/PublicPages';
import { AuthPage } from './pages/AuthPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { AnalysisReportPage } from './pages/AnalysisReportPage';
import { JobMatcherPage } from './pages/JobMatcherPage';
import { MyResumesPage } from './pages/MyResumesPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { JobTargetsPage } from './pages/JobTargetsPage';
import { BillingPage } from './pages/BillingPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AtsScoreFixerPage } from './pages/AtsScoreFixerPage';

const AppRouter: React.FC = () => {
  const { currentRoute, user, navigate } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Parse path and params
  const isDashboardRoute = currentRoute.startsWith('/dashboard') || currentRoute.startsWith('/admin');

  // Handle parameterized routes
  const resumeBuilderMatch = currentRoute.match(/^\/dashboard\/resume-builder(?:\/(.+))?$/);
  const analysisReportMatch = currentRoute.match(/^\/dashboard\/analysis(?:\/(.+))?$/);

  let pageComponent = <LandingPage />;

  if (currentRoute === '/') {
    pageComponent = <LandingPage />;
  } else if (currentRoute === '/features') {
    pageComponent = <FeaturesPage />;
  } else if (currentRoute === '/templates') {
    pageComponent = <TemplatesPage />;
  } else if (currentRoute === '/pricing') {
    pageComponent = <PricingPage />;
  } else if (currentRoute === '/faq') {
    pageComponent = <FaqPage />;
  } else if (currentRoute === '/privacy') {
    pageComponent = <PrivacyPage />;
  } else if (currentRoute === '/terms') {
    pageComponent = <TermsPage />;
  } else if (currentRoute === '/login') {
    pageComponent = <AuthPage initialMode="login" />;
  } else if (currentRoute === '/register') {
    pageComponent = <AuthPage initialMode="register" />;
  } else if (currentRoute === '/forgot-password') {
    pageComponent = <AuthPage initialMode="forgot-password" />;
  } else if (currentRoute === '/dashboard') {
    pageComponent = <DashboardOverview />;
  } else if (resumeBuilderMatch) {
    const resumeId = resumeBuilderMatch[1];
    pageComponent = <ResumeBuilderPage resumeId={resumeId} />;
  } else if (currentRoute === '/dashboard/resume-analyzer') {
    pageComponent = <ResumeAnalyzerPage />;
  } else if (currentRoute === '/dashboard/ats-fixer') {
    pageComponent = <AtsScoreFixerPage />;
  } else if (analysisReportMatch) {
    const analysisId = analysisReportMatch[1];
    pageComponent = <AnalysisReportPage analysisId={analysisId} />;
  } else if (currentRoute === '/dashboard/job-matcher') {
    pageComponent = <JobMatcherPage />;
  } else if (currentRoute === '/dashboard/my-resumes') {
    pageComponent = <MyResumesPage />;
  } else if (currentRoute === '/dashboard/templates') {
    pageComponent = <TemplatesPage />;
  } else if (currentRoute === '/dashboard/cover-letters') {
    pageComponent = <CoverLetterPage />;
  } else if (currentRoute === '/dashboard/job-targets') {
    pageComponent = <JobTargetsPage />;
  } else if (currentRoute === '/dashboard/billing') {
    pageComponent = <BillingPage />;
  } else if (currentRoute === '/dashboard/profile') {
    pageComponent = <ProfilePage />;
  } else if (currentRoute === '/dashboard/settings') {
    pageComponent = <SettingsPage />;
  } else if (currentRoute.startsWith('/admin')) {
    pageComponent = <AdminDashboard />;
  }

  // Dashboard layout with persistent desktop sidebar
  if (isDashboardRoute) {
    return (
      <div className="min-h-screen bg-slate-50 flex">
        <DashboardSidebar
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <div className="flex-1 md:pl-64 flex flex-col min-w-0">
          <DashboardHeader onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {pageComponent}
          </main>
        </div>
        <ToastContainer />
      </div>
    );
  }

  // Public Marketing Layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">{pageComponent}</main>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
