import { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLayout, AdminSection } from './layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { HeroManager } from './pages/HeroManager';
import { AboutManager } from './pages/AboutManager';
import { SkillsManager } from './pages/SkillsManager';
import { ProjectsManager } from './pages/ProjectsManager';
import { JourneyManager } from './pages/JourneyManager';
import { ConnectManager } from './pages/ConnectManager';
import { VisitorsManager } from './pages/VisitorsManager';
import { MessagesManager } from './pages/MessagesManager';
import { SettingsPage } from './pages/SettingsPage';
import { RefreshCw } from 'lucide-react';

function AdminAppContent() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070c18] flex items-center justify-center text-amber-400 font-mono text-xs gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Verifying Admin Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AdminLayout activeSection={activeSection} onSelectSection={setActiveSection}>
      {activeSection === 'overview' && <DashboardOverview onNavigate={setActiveSection} />}
      {activeSection === 'hero' && <HeroManager />}
      {activeSection === 'about' && <AboutManager />}
      {activeSection === 'skills' && <SkillsManager />}
      {activeSection === 'projects' && <ProjectsManager />}
      {activeSection === 'journey' && <JourneyManager />}
      {activeSection === 'connect' && <ConnectManager />}
      {activeSection === 'visitors' && <VisitorsManager />}
      {activeSection === 'messages' && <MessagesManager />}
      {activeSection === 'settings' && <SettingsPage />}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminAppContent />
    </AdminAuthProvider>
  );
}
