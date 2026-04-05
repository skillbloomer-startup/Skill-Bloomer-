import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Plus,
  Search,
  LogOut,
  Zap,
  Award,
  Code,
  Sparkles,
  Grid,
  CreditCard,
  UserCheck,
  ShieldCheck,
  Bell,
  User,
  Menu,
  X,
  MessageSquare,
  Heart,
  Building2,
} from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/src/lib/utils';

interface TopNavProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  openAI: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: { id: string; label: string; badge?: string }[];
}

function DropdownMenu({
  label,
  icon: Icon,
  items,
  activePage,
  setActivePage,
  onClose,
}: {
  label: string;
  icon: React.ElementType;
  items: NavItem[];
  activePage: string;
  setActivePage: (page: string) => void;
  onClose: () => void;
}) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="relative">
      <div className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 max-h-[70vh] overflow-y-auto">
        {items.map((item) => {
          const isActive = activePage === item.id || activePage.startsWith(item.id + '-');
          const ItemIcon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSubOpen = openSub === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    setOpenSub(isSubOpen ? null : item.id);
                  } else {
                    setActivePage(item.id);
                    onClose();
                  }
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <ItemIcon size={16} className={cn('shrink-0', isActive ? 'text-blue-600' : 'text-gray-400')} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full font-bold leading-none">
                    {item.badge}
                  </span>
                )}
                {hasSubItems && (
                  <ChevronDown
                    size={13}
                    className={cn('text-gray-400 transition-transform', isSubOpen && 'rotate-180')}
                  />
                )}
              </button>
              {hasSubItems && isSubOpen && (
                <div className="py-0.5">
                  {item.subItems!.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setActivePage(sub.id);
                        onClose();
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 pl-10 pr-3.5 py-1.5 text-[12.5px] font-medium transition-colors',
                        activePage === sub.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <span className="truncate">{sub.label}</span>
                      {sub.badge && (
                        <span className="text-[8px] bg-yellow-400 text-black px-1 rounded-full font-bold leading-none ml-auto">
                          {sub.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TopNav({ activePage, setActivePage, onLogout, openAI }: TopNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileExpandedMenus, setMobileExpandedMenus] = useState<Record<string, boolean>>({});

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activePage]);

  const communityItems: NavItem[] = [
    { id: 'community-home', label: 'Home', icon: Home },
    { id: 'community-feed', label: 'Feed', icon: Video },
    { id: 'community-connections', label: 'Connections', icon: Users },
    { id: 'community-following', label: 'Following', icon: UserPlus },
  ];

  const contentItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'courses', label: 'Courses', icon: BookOpen,
      subItems: [
        { id: 'courses-all', label: 'All Courses' },
        { id: 'courses-create', label: 'Create Course' },
        { id: 'courses-published', label: 'Published' },
        { id: 'courses-leads', label: 'Leads' },
      ],
    },
    {
      id: 'webinars', label: 'Webinars', icon: Video,
      subItems: [
        { id: 'webinars-all', label: 'All Webinars' },
        { id: 'webinars-create', label: 'Create Webinar' },
        { id: 'webinars-leads', label: 'Leads' },
      ],
    },
    {
      id: 'events', label: 'Events', icon: Calendar,
      subItems: [
        { id: 'events-all', label: 'All Events' },
        { id: 'events-create', label: 'Create Event' },
        { id: 'events-leads', label: 'Leads' },
        { id: 'events-analytics', label: 'Analytics' },
        { id: 'events-settings', label: 'Settings' },
      ],
    },
    {
      id: 'live', label: 'Live Classes', icon: Grid,
      subItems: [
        { id: 'live-all', label: 'All Classes' },
        { id: 'live-create', label: 'Create Class' },
        { id: 'live-leads', label: 'Leads' },
        { id: 'live-analytics', label: 'Analytics' },
        { id: 'live-settings', label: 'Settings' },
      ],
    },
    {
      id: 'podcast', label: 'Podcast', icon: Mic, badge: 'NEW',
      subItems: [
        { id: 'podcast-dashboard', label: 'Dashboard' },
        { id: 'podcast-episodes', label: 'All Episodes' },
        { id: 'podcast-create', label: 'Create Episode' },
        { id: 'podcast-integrations', label: 'Integrations' },
        { id: 'podcast-analytics', label: 'Analytics' },
        { id: 'podcast-settings', label: 'Settings' },
      ],
    },
    {
      id: 'scheduler', label: 'Scheduler', icon: Calendar,
      subItems: [
        { id: 'scheduler-overview', label: 'Overview' },
        { id: 'scheduler-hourly', label: 'Calendar by hours' },
        { id: 'scheduler-create', label: 'Create Meeting' },
        { id: 'scheduler-ai', label: 'Meeting GeneratorAI' },
        { id: 'scheduler-manage', label: 'Manage' },
        { id: 'scheduler-leads', label: 'Leads' },
      ],
    },
    {
      id: 'ai-tools', label: 'AI Tools', icon: Sparkles, badge: 'NEW',
      subItems: [
        { id: 'ai-tools-directory', label: 'Directory' },
        { id: 'ai-tools-submit', label: 'Submit Tool' },
        { id: 'ai-tools-favorites', label: 'My Favorites' },
      ],
    },
    {
      id: 'college', label: 'College & Institute', icon: Building2,
      subItems: [
        { id: 'institutes', label: 'Institute Listing' },
        { id: 'masters', label: 'Masters & Higher Ed' },
        { id: 'leads', label: 'Leads & Queries' },
        { id: 'professional', label: 'Professional Program' },
        { id: 'college-forms', label: 'College Forms' },
        { id: 'college-manage', label: 'Manage' },
        { id: 'college-leads', label: 'Leads' },
      ],
    },
  ];

  const manageItems: NavItem[] = [
    {
      id: 'marketing', label: 'Marketing', icon: TrendingUp,
      subItems: [
        { id: 'marketing-announcements', label: 'Announcements' },
        { id: 'marketing-linkedin', label: 'LinkedIn' },
        { id: 'marketing-email', label: 'Email Campaign' },
        { id: 'marketing-paid', label: 'Paid Campaign' },
        { id: 'marketing-ads', label: 'ADS' },
        { id: 'marketing-utm', label: 'Link Tracker & UTM' },
        { id: 'marketing-coupons', label: 'Discount Coupons' },
        { id: 'marketing-leads', label: 'Leads' },
      ],
    },
    {
      id: 'sales', label: 'Sales', icon: CreditCard,
      subItems: [
        { id: 'sales-banking', label: 'Banking Details' },
        { id: 'sales-payout', label: 'Request Payout' },
        { id: 'sales-my-sales', label: 'My Sales' },
        { id: 'sales-commission', label: 'Commission Setup' },
        { id: 'sales-crm', label: 'CRM', badge: 'NEW' },
        { id: 'sales-leads', label: 'Leads' },
      ],
    },
    { id: 'approval', label: 'Request Approval', icon: UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Award, badge: 'NEW' },
  ];

  const accountItems: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'membership', label: 'Membership', icon: ShieldCheck, badge: 'NEW' },
    { id: 'embed', label: 'Embed Codes', icon: Code, badge: 'NEW' },
  ];

  const navSections = [
    { id: 'community', label: 'Community', icon: Users, items: communityItems },
    { id: 'content', label: 'Content', icon: BookOpen, items: contentItems },
    { id: 'manage', label: 'Manage', icon: TrendingUp, items: manageItems },
    { id: 'account', label: 'Account', icon: Settings, items: accountItems },
  ];

  const toggleMobileMenu = (id: string) => {
    setMobileExpandedMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render mobile nav items
  const renderMobileNavSection = (section: { id: string; label: string; items: NavItem[] }) => (
    <div key={section.id} className="py-2">
      <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {section.label}
      </div>
      {section.items.map((item) => {
        const isActive = activePage === item.id || activePage.startsWith(item.id + '-');
        const ItemIcon = item.icon;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = mobileExpandedMenus[item.id];

        return (
          <div key={item.id}>
            <button
              onClick={() => {
                if (hasSubItems) {
                  toggleMobileMenu(item.id);
                } else {
                  setActivePage(item.id);
                }
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors',
                isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <ItemIcon size={17} className={cn('shrink-0', isActive ? 'text-blue-600' : 'text-gray-400')} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
              {hasSubItems && (
                <ChevronDown size={14} className={cn('text-gray-400 transition-transform', isExpanded && 'rotate-180')} />
              )}
            </button>
            {hasSubItems && isExpanded && (
              <div className="bg-gray-50/50">
                {item.subItems!.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActivePage(sub.id)}
                    className={cn(
                      'w-full flex items-center gap-2 pl-12 pr-4 py-2 text-[12.5px] font-medium transition-colors',
                      activePage === sub.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                    )}
                  >
                    <span>{sub.label}</span>
                    {sub.badge && (
                      <span className="text-[8px] bg-yellow-400 text-black px-1 rounded-full font-bold ml-auto">
                        {sub.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-50">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors mr-1"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mr-4 shrink-0 cursor-pointer" onClick={() => setActivePage('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-extrabold text-white text-sm shadow-sm">
              S
            </div>
            <span className="text-gray-900 font-bold text-[15px] tracking-tight hidden sm:block">SkillBloomer</span>
          </div>

          {/* Desktop Dropdown Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navSections.map((section) => {
              const SectionIcon = section.icon;
              const isOpen = openDropdown === section.id;
              const isActiveSection = section.items.some(
                (item) => activePage === item.id || activePage.startsWith(item.id + '-')
              );

              return (
                <div key={section.id} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : section.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors',
                      isOpen
                        ? 'bg-gray-100 text-gray-900'
                        : isActiveSection
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <span>{section.label}</span>
                    <ChevronDown size={13} className={cn('transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <DropdownMenu
                      label={section.label}
                      icon={SectionIcon}
                      items={section.items}
                      activePage={activePage}
                      setActivePage={setActivePage}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search (desktop) */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search..."
              className="w-44 h-8 pl-8 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* AI Mode */}
          <button
            onClick={openAI}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-blue-600 text-white text-[12px] font-semibold shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Zap size={13} fill="white" />
            <span className="hidden sm:inline">AI</span>
          </button>

          {/* Notifications */}
          <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative ml-0.5">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                AA
              </div>
              <ChevronDown size={13} className={cn('text-gray-400 hidden sm:block transition-transform', isProfileOpen && 'rotate-180')} />
            </button>

            {isProfileOpen && (
              <div className="absolute top-full right-0 mt-1.5 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="p-3.5 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">AA</div>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-900">Ankur Awasthi</div>
                    <div className="text-[11px] text-gray-500">Instructor</div>
                  </div>
                </div>
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                    <User size={15} className="text-gray-400" /> View Profile
                  </button>
                  <button
                    onClick={() => { setActivePage('settings'); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={15} className="text-gray-400" /> Settings
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors">
                    <CreditCard size={15} className="text-gray-400" /> Billing & Plans
                  </button>
                </div>
                <div className="border-t border-gray-100 py-1.5">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Down Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 bottom-0 bg-white z-40 lg:hidden overflow-y-auto">
            {/* Mobile Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-gray-400"
                />
              </div>
            </div>

            {navSections.map(renderMobileNavSection)}

            {/* Mobile Logout */}
            <div className="border-t border-gray-100 p-3 mt-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
