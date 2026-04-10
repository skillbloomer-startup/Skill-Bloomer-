import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import CoursesPage from './components/CoursesPage';
import CRMPage from './components/CRMPage';
import WebinarsPage from './components/WebinarsPage';
import SchedulerPage from './components/SchedulerPage';
import SettingsPage from './components/SettingsPage';
import IntegrationsPage from './components/IntegrationsPage';
import MembershipPage from './components/MembershipPage';
import EmbedCodesPage from './components/EmbedCodesPage';
import SchedulerHourly from './components/SchedulerHourly';
import MeetingCreate from './components/MeetingCreate';
import MeetingGeneratorAI from './components/MeetingGeneratorAI';
import SchedulerManage from './components/SchedulerManage';
import InstituteListing from './components/InstituteListing';
import MastersHigherEd from './components/MastersHigherEd';
import LeadsQueries from './components/LeadsQueries';
import ProfessionalProgram from './components/ProfessionalProgram';
import CollegeForms from './components/CollegeForms';
import CollegeManage from './components/CollegeManage';
import EventsPage from './components/EventsPage';
import PodcastPage from './components/PodcastPage';
import MarketingPage from './components/MarketingPage';
import LiveClassesPage from './components/LiveClassesPage';
import SalesPage from './components/SalesPage';
import AIToolsPage from './components/AIToolsPage';
import AIStudio from './components/AIStudio';
import CommunityPage from './components/CommunityPage';
import AuthPage from './components/AuthPage';
import StudentPlatform from './components/StudentPlatform';
import LandingPage from './components/LandingPage';
import AgentMockup from './components/AgentMockup';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { cn } from './lib/utils';
import { LayoutDashboard, BookOpen, MessageSquare, Calendar, Settings } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userRole, setUserRole] = useState<'instructor' | 'learner' | null>(null);
  const [activePage, setActivePage] = useState('community-home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses-all':
      case 'courses':
        return <CoursesPage />;
      case 'webinars-all':
      case 'webinars':
        return <WebinarsPage />;
      case 'scheduler':
      case 'scheduler-overview':
        return <SchedulerPage />;
      case 'scheduler-hourly':
        return <SchedulerHourly />;
      case 'scheduler-create':
        return <MeetingCreate />;
      case 'scheduler-ai':
        return <MeetingGeneratorAI />;
      case 'scheduler-manage':
        return <SchedulerManage />;
      case 'events-all':
      case 'events':
      case 'events-create':
      case 'events-analytics':
      case 'events-settings':
        return <EventsPage />;
      case 'live-all':
      case 'live':
      case 'live-create':
      case 'live-analytics':
      case 'live-settings':
        return <LiveClassesPage />;
      case 'podcast':
      case 'podcast-dashboard':
      case 'podcast-episodes':
      case 'podcast-create':
      case 'podcast-integrations':
      case 'podcast-analytics':
      case 'podcast-settings':
        return <PodcastPage />;
      case 'marketing':
      case 'marketing-announcements':
      case 'marketing-linkedin':
      case 'marketing-email':
      case 'marketing-paid':
      case 'marketing-ads':
      case 'marketing-utm':
      case 'marketing-coupons':
        return <MarketingPage />;
      case 'sales-crm':
        return <CRMPage />;
      case 'sales':
      case 'sales-banking':
      case 'sales-payout':
      case 'sales-my-sales':
      case 'sales-commission':
        return <SalesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'membership':
        return <MembershipPage />;
      case 'embed':
        return <EmbedCodesPage />;
      case 'institutes':
        return <InstituteListing />;
      case 'masters':
        return <MastersHigherEd />;
      case 'leads':
      case 'courses-leads':
      case 'webinars-leads':
      case 'scheduler-leads':
      case 'college-leads':
      case 'marketing-leads':
      case 'sales-leads':
      case 'events-leads':
      case 'live-leads':
        return <LeadsQueries />;
      case 'ai-tools':
      case 'ai-tools-directory':
      case 'ai-tools-submit':
      case 'ai-tools-favorites':
        return <AIToolsPage />;
      case 'professional':
        return <ProfessionalProgram />;
      case 'college-forms':
        return <CollegeForms />;
      case 'college-manage':
        return <CollegeManage />;
      case 'community':
      case 'community-home':
      case 'community-feed':
      case 'community-connections':
      case 'community-following':
      case 'community-settings':
        return (
          <CommunityPage 
            activeTab={activePage.replace('community-', '') === 'community' ? 'home' : activePage.replace('community-', '')} 
            onNavigate={setActivePage}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl shadow-inner">
              🚧
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight">Under Construction</h2>
              <p className="text-sm text-[#8C90A8] mt-1 max-w-xs mx-auto">
                The {activePage} module is currently being built. Check back soon for updates!
              </p>
            </div>
            <button 
              onClick={() => setActivePage('dashboard')}
              className="btn-secondary text-xs"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  const isCommunityPage = activePage.startsWith('community');

  if (!isAuthenticated) {
    if (showAuth) {
      return (
        <ThemeProvider>
          <ToastProvider>
            <AuthPage onLogin={(role) => {
              setUserRole(role);
              setIsAuthenticated(true);
              setShowAuth(false);
            }} />
          </ToastProvider>
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <ToastProvider>
          <AgentMockup onLoginClick={() => setShowAuth(true)} />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  if (userRole === 'learner') {
    return (
      <ThemeProvider>
        <ToastProvider>
          <StudentPlatform onLogout={() => {
            setIsAuthenticated(false);
            setUserRole(null);
          }} />
        </ToastProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground flex overflow-x-hidden relative">
          {/* Atmospheric Background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 flex w-full">
            <Sidebar 
              activePage={activePage} 
              setActivePage={(page) => {
                setActivePage(page);
                setIsMobileSidebarOpen(false);
              }} 
              isCollapsed={isSidebarCollapsed}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onLogout={() => {
                setIsAuthenticated(false);
                setUserRole(null);
              }}
            />
            
            <div className={cn(
              "flex-1 flex flex-col transition-all duration-300 min-w-0",
              isSidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-[242px]"
            )}>
              <Topbar 
                activePage={activePage}
                isSidebarCollapsed={isSidebarCollapsed}
                toggleSidebar={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileSidebarOpen(!isMobileSidebarOpen);
                  } else {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }}
                openAI={() => setIsAIStudioOpen(true)}
              />
              
              <main className={cn(
                "flex-1 w-full",
                isCommunityPage ? "p-0" : "p-4 md:p-8 max-w-7xl mx-auto"
              )}>
                {renderPage()}
              </main>

              {/* Mobile Bottom Navigation */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 z-40">
                  <button 
                    onClick={() => setActivePage('dashboard')}
                    className={cn("flex flex-col items-center gap-1", activePage === 'dashboard' ? "text-primary" : "text-muted-foreground")}
                  >
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-medium">Home</span>
                  </button>
                  <button 
                    onClick={() => setActivePage('courses')}
                    className={cn("flex flex-col items-center gap-1", activePage.startsWith('courses') ? "text-primary" : "text-muted-foreground")}
                  >
                    <BookOpen size={20} />
                    <span className="text-[10px] font-medium">Courses</span>
                  </button>
                  <button 
                    onClick={() => setActivePage('community-home')}
                    className={cn("flex flex-col items-center gap-1", activePage.startsWith('community') ? "text-primary" : "text-muted-foreground")}
                  >
                    <MessageSquare size={20} />
                    <span className="text-[10px] font-medium">skillX</span>
                  </button>
                  <button 
                    onClick={() => setActivePage('scheduler')}
                    className={cn("flex flex-col items-center gap-1", activePage.startsWith('scheduler') ? "text-primary" : "text-muted-foreground")}
                  >
                    <Calendar size={20} />
                    <span className="text-[10px] font-medium">Scheduler</span>
                  </button>
                  <button 
                    onClick={() => setActivePage('settings')}
                    className={cn("flex flex-col items-center gap-1", activePage === 'settings' ? "text-primary" : "text-muted-foreground")}
                  >
                    <Settings size={20} />
                    <span className="text-[10px] font-medium">Settings</span>
                  </button>
                </div>
              
              {/* Add padding at bottom for mobile nav */}
              <div className="h-16 lg:hidden" />
            </div>
          </div>

          <AIStudio 
            isOpen={isAIStudioOpen} 
            onClose={() => setIsAIStudioOpen(false)} 
          />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
