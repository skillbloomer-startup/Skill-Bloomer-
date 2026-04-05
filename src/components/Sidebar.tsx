import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Home,
  UserPlus,
  BookOpen, 
  Video, 
  Calendar, 
  Mic, 
  Users, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Plus,
  Search,
  LogOut,
  Zap,
  Award,
  Share2,
  Code,
  Sparkles,
  Grid,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Globe,
  MessageSquare,
  GraduationCap,
  Building2,
  FileText,
  Briefcase
} from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onLogout: () => void;
}

export default function Sidebar({ activePage, setActivePage, isCollapsed, isMobileOpen, onCloseMobile, onLogout }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menu: string) => {
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItems = [
    { id: 'community-home', label: 'Home', icon: Home },
    { id: 'community-feed', label: 'Feed', icon: Video },
    { id: 'community-connections', label: 'Connections', icon: Users },
    { id: 'community-following', label: 'Following', icon: UserPlus },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: BookOpen,
      subItems: [
        { id: 'courses-all', label: 'All Courses' },
        { id: 'courses-create', label: 'Create Course' },
        { id: 'courses-published', label: 'Published' },
        { id: 'courses-leads', label: 'Leads' },
      ]
    },
    { 
      id: 'webinars', 
      label: 'Webinars', 
      icon: Video,
      subItems: [
        { id: 'webinars-all', label: 'All Webinars' },
        { id: 'webinars-create', label: 'Create Webinar' },
        { id: 'webinars-leads', label: 'Leads' },
      ]
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: Calendar,
      subItems: [
        { id: 'events-all', label: 'All Events' },
        { id: 'events-create', label: 'Create Event' },
        { id: 'events-leads', label: 'Leads' },
        { id: 'events-analytics', label: 'Analytics' },
        { id: 'events-settings', label: 'Settings' },
      ]
    },
    { 
      id: 'live', 
      label: 'Live Classes', 
      icon: Grid,
      subItems: [
        { id: 'live-all', label: 'All Classes' },
        { id: 'live-create', label: 'Create Class' },
        { id: 'live-leads', label: 'Leads' },
        { id: 'live-analytics', label: 'Analytics' },
        { id: 'live-settings', label: 'Settings' },
      ]
    },
    { 
      id: 'podcast', 
      label: 'Podcast', 
      icon: Mic, 
      badge: 'NEW',
      subItems: [
        { id: 'podcast-dashboard', label: 'Dashboard' },
        { id: 'podcast-episodes', label: 'All Episodes' },
        { id: 'podcast-create', label: 'Create Episode' },
        { id: 'podcast-integrations', label: 'Integrations' },
        { id: 'podcast-analytics', label: 'Analytics' },
        { id: 'podcast-settings', label: 'Settings' },
      ]
    },
    { 
      id: 'scheduler', 
      label: 'Scheduler', 
      icon: Calendar,
      subItems: [
        { id: 'scheduler-overview', label: 'Overview' },
        { id: 'scheduler-hourly', label: 'Calendar by hours' },
        { id: 'scheduler-create', label: 'Create Meeting' },
        { id: 'scheduler-ai', label: 'Meeting GeneratorAI' },
        { id: 'scheduler-manage', label: 'Manage' },
        { id: 'scheduler-leads', label: 'Leads' },
      ]
    },
    { 
      id: 'ai-tools', 
      label: 'AI Tools', 
      icon: Sparkles, 
      badge: 'NEW',
      subItems: [
        { id: 'ai-tools-directory', label: 'Directory' },
        { id: 'ai-tools-submit', label: 'Submit Tool' },
        { id: 'ai-tools-favorites', label: 'My Favorites' },
      ]
    },
    {
      id: 'college',
      label: 'College and Institute',
      icon: Building2,
      subItems: [
        { id: 'institutes', label: 'Institute Listing' },
        { id: 'masters', label: 'Masters & Higher Ed' },
        { id: 'leads', label: 'Leads & Queries' },
        { id: 'professional', label: 'Professional Program' },
        { id: 'college-forms', label: 'College Forms' },
        { id: 'college-manage', label: 'Manage' },
        { id: 'college-leads', label: 'Leads' },
      ]
    },
  ];

  const manageItems = [
    { 
      id: 'marketing', 
      label: 'Marketing', 
      icon: TrendingUp,
      subItems: [
        { id: 'marketing-announcements', label: 'Announcements' },
        { id: 'marketing-linkedin', label: 'LinkedIn' },
        { id: 'marketing-email', label: 'Email Campaign' },
        { id: 'marketing-paid', label: 'Paid Campaign' },
        { id: 'marketing-ads', label: 'ADS' },
        { id: 'marketing-utm', label: 'Link Tracker & UTM' },
        { id: 'marketing-coupons', label: 'Discount Coupons' },
        { id: 'marketing-leads', label: 'Leads' },
      ]
    },
    { 
      id: 'sales', 
      label: 'Sales', 
      icon: CreditCard,
      subItems: [
        { id: 'sales-banking', label: 'Banking Details' },
        { id: 'sales-payout', label: 'Request Payout' },
        { id: 'sales-my-sales', label: 'My Sales' },
        { id: 'sales-commission', label: 'Commission Setup' },
        { id: 'sales-crm', label: 'CRM', badge: 'NEW' },
        { id: 'sales-leads', label: 'Leads' },
      ]
    },
    { id: 'approval', label: 'Request Approval', icon: UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: 'NEW' },
  ];

  const accountItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'membership', label: 'Membership', icon: ShieldCheck, badge: 'NEW' },
    { id: 'embed', label: 'Embed Codes', icon: Code, badge: 'NEW' },
  ];

  const renderNavItem = (item: any) => {
    const isActive = activePage === item.id || activePage.startsWith(item.id + '-');
    const isExpanded = expandedMenus[item.id];

    return (
      <div key={item.id} className="mb-1">
        <div 
          className={cn(
            "ni group",
            isActive && "on",
            isCollapsed && !isMobileOpen && "lg:justify-center px-2"
          )}
          onClick={() => item.subItems ? toggleMenu(item.id) : setActivePage(item.id)}
          title={isCollapsed ? item.label : undefined}
        >
          <item.icon size={18} className={cn("shrink-0", isActive ? "text-brand" : "text-[#64748B]")} />
          {(!isCollapsed || isMobileOpen) && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full font-extrabold leading-none">
                  {item.badge}
                </span>
              )}
              {item.subItems && (
                isExpanded ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />
              )}
            </>
          )}
        </div>
        {(!isCollapsed || isMobileOpen) && item.subItems && isExpanded && (
          <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-2">
            {item.subItems.map((sub: any) => (
              <div 
                key={sub.id}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all hover:text-brand hover:bg-gray-50 flex items-center justify-between",
                  activePage === sub.id ? "text-brand bg-brand/10" : "text-[#64748B]"
                )}
                onClick={() => setActivePage(sub.id)}
              >
                <span className="truncate">{sub.label}</span>
                {sub.badge && (
                  <span className="text-[8px] bg-yellow-400 text-black px-1 rounded-full font-black leading-none ml-2">
                    {sub.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={onCloseMobile}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-50 bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-[68px]" : "w-[242px]",
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-0.5 bg-linear-to-r from-blue-600 via-blue-400 to-blue-600"></div>
        
        <div className={cn("p-5 flex flex-col gap-4", isCollapsed && !isMobileOpen && "lg:items-center")}>
          <div className="flex items-center gap-3">
            <Logo iconOnly={isCollapsed && !isMobileOpen} size="sm" />
            
            {/* Mobile Close Button */}
            {isMobileOpen && (
              <button 
                onClick={onCloseMobile}
                className="ml-auto p-1 text-gray-400 hover:text-brand lg:hidden"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
            )}
          </div>

          {(!isCollapsed || isMobileOpen) && (
            <button 
              onClick={() => setActivePage('community-create')}
              className="w-full py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Create Community
            </button>
          )}
          {isCollapsed && !isMobileOpen && (
            <button 
              onClick={() => setActivePage('community-create')}
              className="w-9 h-9 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all"
              title="Create Community"
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {(!isCollapsed || isMobileOpen) && (
          <div className="px-4 mb-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-600 outline-hidden focus:border-blue-500 transition-all placeholder:text-gray-400" 
                placeholder="Search menu..."
              />
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          <div className="space-y-1">
            {navItems.map(renderNavItem)}
          </div>

          {(!isCollapsed || isMobileOpen) && <div className="text-[9.5px] font-bold tracking-[0.13em] text-gray-400 uppercase px-3 pt-6 pb-2">Manage</div>}
          <div className="space-y-1">
            {manageItems.map(renderNavItem)}
          </div>

          {(!isCollapsed || isMobileOpen) && <div className="text-[9.5px] font-bold tracking-[0.13em] text-gray-400 uppercase px-3 pt-6 pb-2">Account</div>}
          <div className="space-y-1">
            {accountItems.map(renderNavItem)}
          </div>
        </nav>

        <div className="p-3 mt-auto">
          <button className={cn(
            "w-full flex items-center gap-3 p-3 bg-yellow-400 rounded-2xl text-black shadow-xl shadow-yellow-400/30 hover:scale-[1.02] transition-all",
            isCollapsed && !isMobileOpen && "lg:justify-center p-2"
          )}>
            <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center shrink-0">
              <Calendar size={16} />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="text-left">
                <div className="text-[12.5px] font-bold leading-tight uppercase tracking-tighter">Schedule Meeting</div>
                <div className="text-[10px] text-black/60 font-bold uppercase tracking-widest">Book a call</div>
              </div>
            )}
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-t border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              AA
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-[#0F172A] truncate">Ankur Awasthi</div>
                <div className="text-[10px] text-gray-500 truncate">a.awasthi@skillbloomer.in</div>
              </div>
            )}
          </div>
          {(!isCollapsed || isMobileOpen) && (
            <button 
              onClick={onLogout}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-brand transition-all"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
