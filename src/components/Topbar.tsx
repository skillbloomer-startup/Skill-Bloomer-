import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Moon, 
  Sun, 
  Plus, 
  Zap, 
  LogOut, 
  User, 
  Settings, 
  CreditCard,
  Menu,
  X,
  Video,
  BookOpen,
  Calendar,
  MessageSquare,
  Users,
  Heart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface TopbarProps {
  activePage: string;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  openAI: () => void;
}

export default function Topbar({ activePage, isSidebarCollapsed, toggleSidebar, openAI }: TopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      'courses-all': 'All Courses',
      'courses-create': 'Create Course',
      webinars: 'Webinars',
      events: 'Events',
      live: 'Live Classes',
      podcast: 'Podcast Studio',
      scheduler: 'Scheduler',
      institutes: 'Institutes',
      marketing: 'Marketing',
      sales: 'Sales',
      'community-home': 'Community Home',
      'community-feed': 'Community Feed',
      settings: 'Settings',
      integrations: 'Integrations',
    };
    return titles[activePage] || 'Dashboard';
  };

  return (
    <header className="h-[62px] bg-white border-b border-[#E8EBF5] flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        <button 
          onClick={toggleSidebar}
          className="w-10 h-10 rounded-xl border border-[#DDE1F0] bg-[#FAFBFF] flex items-center justify-center text-[#3D4466] hover:bg-brand-light hover:text-brand transition-all shrink-0"
        >
          <Menu size={18} />
        </button>
        
        <div className="relative flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input 
            type="text" 
            placeholder="Search instructors, courses, or community..." 
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E8ECF5] bg-[#F8F9FE] text-sm focus:outline-none focus:border-brand/50 transition-all"
          />
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center font-extrabold text-white text-xs shadow-md">
            S
          </div>
          <span className="text-[#0F172A] font-extrabold text-sm tracking-tight truncate max-w-[100px]">SkillBloomer</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 ml-2">
        {/* Social Media Style Icons */}
        <div className="hidden lg:flex items-center gap-1 mr-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-gray-100 transition-all relative">
            <Users size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white"></span>
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-gray-100 transition-all relative">
            <MessageSquare size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748B] hover:bg-gray-100 transition-all">
            <Heart size={20} />
          </button>
        </div>
        {/* Quick Create */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border border-[var(--card-border)] bg-white text-[var(--text-secondary)] transition-all",
              isQuickCreateOpen && "bg-brand-light border-brand/30 text-brand"
            )}
          >
            <Plus size={14} strokeWidth={3} />
            <span className="hidden md:inline">Quick Create</span>
            <ChevronDown size={12} className={cn("transition-transform", isQuickCreateOpen && "rotate-180")} />
          </button>
          
          {isQuickCreateOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E4E7F0] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 text-[9.5px] font-bold text-[#8890B0] uppercase tracking-wider">Create New</div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2D3555] hover:bg-brand-light transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#F8F9FE] flex items-center justify-center"><Video size={14} /></div>
                Webinar
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2D3555] hover:bg-brand-light transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#F8F9FE] flex items-center justify-center"><BookOpen size={14} /></div>
                Course
              </button>
              <div className="h-px bg-[#F0F2F8] my-1"></div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2D3555] hover:bg-brand-light transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#F8F9FE] flex items-center justify-center"><Calendar size={14} /></div>
                Event
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[#E2E5F1] mx-1 hidden sm:block"></div>

        {/* AI Mode */}
        <button 
          onClick={openAI}
          className="flex items-center justify-center sm:justify-start gap-2 w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-xl bg-linear-to-br from-[#1C5FFF] to-[#5B8AFF] text-white font-bold text-[13px] shadow-lg shadow-brand/30 hover:-translate-y-0.5 transition-all"
        >
          <Zap size={14} fill="white" />
          <span className="hidden sm:inline">AI Mode</span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl border border-[#E4E6EE] bg-white flex items-center justify-center text-[#4A4E6A]">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 border-2 border-white rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="relative ml-1">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full border border-[#E8ECF5] bg-white hover:border-brand/30 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
              AA
            </div>
            <span className="text-[12.5px] font-semibold text-[#1A1A2E] hidden md:inline">Ankur Awasthi</span>
            <ChevronDown size={14} className={cn("text-[#9199B0] transition-transform hidden sm:block", isProfileOpen && "rotate-180")} />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-[#E4E7F0] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-[#F0F2F8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">AA</div>
                <div>
                  <div className="text-sm font-bold text-[#141928]">Ankur Awasthi</div>
                  <div className="text-[11px] text-[#7880A0] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Instructor
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#2D3555] hover:bg-brand-light rounded-xl transition-colors">
                  <User size={16} className="text-[#9199B0]" />
                  View Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#2D3555] hover:bg-brand-light rounded-xl transition-colors">
                  <Settings size={16} className="text-[#9199B0]" />
                  Account Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#2D3555] hover:bg-brand-light rounded-xl transition-colors">
                  <CreditCard size={16} className="text-[#9199B0]" />
                  Billing & Plans
                </button>
              </div>
              <div className="p-2 border-t border-[#F0F2F8]">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
