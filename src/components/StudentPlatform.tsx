import React, { useState } from 'react';
import Logo from './Logo';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Users, 
  Compass, 
  PlayCircle, 
  Clock, 
  Star, 
  Filter,
  ChevronRight,
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  CheckCircle2,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Briefcase,
  User,
  LogOut,
  Shield,
  Radio,
  Calendar,
  Smartphone,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Layout,
  Play,
  Pause,
  Volume2,
  VolumeX,
  UserPlus,
  CreditCard,
  Target,
  BarChart3,
  ShoppingCart,
  History,
  AppWindow,
  CheckSquare,
  PlusCircle,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  ShoppingBag,
  GraduationCap,
  Video,
  Layers,
  LayoutGrid,
  Code,
  Palette,
  Settings,
  Flame,
  Trophy,
  Check,
  MapPin,
  DollarSign,
  Plus,
  Newspaper,
  Bot,
  Cpu,
  Lock,
  ArrowUpRight,
  Coffee,
  FileText,
  PieChart,
  BarChart,
  Mic
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES, PUBLISHED_CONTENT, COMMUNITY_GROUPS } from '@/src/lib/content';
import { GoogleGenAI, Type } from "@google/genai";
import { useTheme } from '@/src/context/ThemeContext';
import { GlassCard } from './ui/glass/card';
import { GlassButton } from './ui/glass/button';
import { GlassInput } from './ui/glass/input';
import { GlassBadge } from './ui/glass/badge';
import { GlassDialog, GlassDialogContent, GlassDialogHeader, GlassDialogTitle, GlassDialogTrigger } from './ui/glass/dialog';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface StudentPlatformProps {
  onLogout: () => void;
}

const REELS_CONTENT = [
  {
    id: 1,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4',
    title: 'How to master React in 30 days',
    author: 'Ankur Awasthi',
    likes: '12k',
    comments: '450'
  },
  {
    id: 2,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-1740-large.mp4',
    title: 'The secret to clean code',
    author: 'Sarah Chen',
    likes: '8k',
    comments: '230'
  },
  {
    id: 3,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-studying-at-home-with-a-laptop-42655-large.mp4',
    title: 'MBA Admissions: 3 Tips for Success',
    author: 'Prof. Robert Wilson',
    likes: '15k',
    comments: '890'
  }
];

const NEWS_CONTENT = [
  {
    id: 1,
    title: 'AI Revolution in Education: What Students Need to Know',
    summary: 'New AI tools are transforming how students learn and research. Experts predict a shift towards personalized AI tutors.',
    category: 'Technology',
    date: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/news1/800/450'
  },
  {
    id: 2,
    title: 'Top 10 Skills for 2026 Job Market',
    summary: 'Soft skills and AI literacy top the list of most desirable traits for employers this year.',
    category: 'Career',
    date: '5 hours ago',
    thumbnail: 'https://picsum.photos/seed/news2/800/450'
  },
  {
    id: 3,
    title: 'Global Student Exchange Programs Rebound',
    summary: 'International travel for education is back to pre-pandemic levels with new scholarship opportunities.',
    category: 'Education',
    date: '1 day ago',
    thumbnail: 'https://picsum.photos/seed/news3/800/450'
  }
];

const EXPERTS = [
  { id: 1, name: 'Ankur Awasthi', role: 'Full-stack Expert', avatar: 'AA', followers: '120k' },
  { id: 2, name: 'Sarah Chen', role: 'UI/UX Design Lead', avatar: 'SC', followers: '85k' },
  { id: 3, name: 'Prof. Robert Wilson', role: 'MBA Consultant', avatar: 'RW', followers: '45k' },
  { id: 4, name: 'Dr. Michael Brown', role: 'Data Science PhD', avatar: 'MB', followers: '200k' },
  { id: 5, name: 'Gary Vaynerchuk', role: 'Marketing Guru', avatar: 'GV', followers: '10M' }
];

const APPS = [
  { icon: <Bot className="w-4 h-4" />, label: 'SkillBloomer AI', desc: 'Personal learning assistant' },
  { icon: <Newspaper className="w-4 h-4" />, label: 'Resume Builder', desc: 'Create professional resumes' },
  { icon: <MessageSquare className="w-4 h-4" />, label: 'Mock Interviews', desc: 'Practice with AI' },
  { icon: <Palette className="w-4 h-4" />, label: 'Portfolio Creator', desc: 'Showcase your work' },
  { icon: <Code className="w-4 h-4" />, label: 'Code Editor', desc: 'Online IDE for practice' },
  { icon: <Calendar className="w-4 h-4" />, label: 'Study Planner', desc: 'Organize your schedule' },
  { icon: <Users className="w-4 h-4" />, label: 'Networking Hub', desc: 'Connect with peers' },
  { icon: <Briefcase className="w-4 h-4" />, label: 'Internship Tracker', desc: 'Manage applications' },
  { icon: <Trophy className="w-4 h-4" />, label: 'Scholarship Finder', desc: 'Find financial aid' },
  { icon: <UserPlus className="w-4 h-4" />, label: 'Alumni Connect', desc: 'Mentorship network' },
  { icon: <Layout className="w-4 h-4" />, label: 'Project Dashboard', desc: 'Manage professional tasks' },
  { icon: <Mic className="w-4 h-4" />, label: 'AI Meeting Notes', desc: 'Transcribe & summarize' },
  { icon: <ShoppingBag className="w-4 h-4" />, label: 'Freelance Gigs', desc: 'Find side projects' },
  { icon: <TrendingUp className="w-4 h-4" />, label: 'Career Path AI', desc: 'Personalized growth roadmap' },
  { icon: <BarChart className="w-4 h-4" />, label: 'Salary Insights', desc: 'Market rate comparisons' },
  { icon: <Award className="w-4 h-4" />, label: 'Leadership Lab', desc: 'Management coaching' },
  { icon: <DollarSign className="w-4 h-4" />, label: 'Tax & Finance', desc: 'Wealth management' },
  { icon: <Globe className="w-4 h-4" />, label: 'Remote Hub', desc: 'Best tools for WFH' },
  { icon: <Shield className="w-4 h-4" />, label: 'Cert Tracker', desc: 'Manage professional licenses' },
  { icon: <Zap className="w-4 h-4" />, label: 'Market Trends', desc: 'Daily industry briefings' },
];

export default function StudentPlatform({ onLogout }: StudentPlatformProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiSearchResults, setAiSearchResults] = useState<any[]>([]);
  const [thinkingStep, setThinkingStep] = useState(0);

  const thinkingSteps = [
    "Analyzing your intent...",
    "Scanning global educational databases...",
    "Synthesizing personalized recommendations...",
    "Finalizing your AI-powered roadmap..."
  ];

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAiResponse(null);
    setAiSearchResults([]);
    setThinkingStep(0);

    try {
      // Simulate AI "thinking" steps
      const thinkingInterval = setInterval(() => {
        setThinkingStep(prev => (prev + 1) % thinkingSteps.length);
      }, 1000);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is searching for: "${searchQuery}". 
        Based on our platform's content (courses, webinars, jobs, AI tools), provide a helpful summary and recommend specific items.
        Available items: ${JSON.stringify(PUBLISHED_CONTENT.map(i => ({ id: i.id, title: i.title, type: i.type, category: i.category })))}
        
        Return a JSON object with:
        1. "summary": A concise, encouraging AI response (max 2 sentences).
        2. "recommendedIds": An array of up to 4 item IDs from the provided list that best match the query.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              recommendedIds: { 
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
              }
            },
            required: ["summary", "recommendedIds"]
          }
        }
      });

      clearInterval(thinkingInterval);
      
      const result = JSON.parse(response.text);
      const recommendedItems = PUBLISHED_CONTENT.filter(item => result.recommendedIds.includes(item.id));
      
      setAiResponse(result.summary);
      setAiSearchResults(recommendedItems);
    } catch (error) {
      console.error("AI Search Error:", error);
      setAiResponse("I encountered an error while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languages = [
    { name: 'English', code: 'EN' },
    { name: 'Hindi', code: 'HI' },
    { name: 'Spanish', code: 'ES' },
    { name: 'French', code: 'FR' }
  ];
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      title: 'Master React & Next.js', 
      type: 'learning',
      targetDate: '2024-12-30', 
      progress: 45, 
      category: 'Development', 
      status: 'active',
      milestones: [
        { id: 1, title: 'Learn Hooks', completed: true, xp: 100 },
        { id: 2, title: 'Master SSR/SSG', completed: true, xp: 150 },
        { id: 3, title: 'Build a Portfolio', completed: false, xp: 300 }
      ],
      linkedJob: 'Frontend Developer (React)'
    },
    { 
      id: 2, 
      title: 'Senior Frontend Developer at Google', 
      type: 'job',
      targetDate: '2024-11-15', 
      progress: 72, 
      category: 'Career', 
      status: 'active',
      milestones: [
        { id: 1, title: 'System Design', completed: true, xp: 100 },
        { id: 2, title: 'Algorithms', completed: true, xp: 200 },
        { id: 3, title: 'Mock Interviews', completed: false, xp: 200 }
      ],
      linkedJob: 'Senior Frontend Developer'
    }
  ]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', targetDate: '', category: 'Development', type: 'learning' as 'learning' | 'job' });
  const [userStats, setUserStats] = useState({
    xp: 2450,
    level: 12,
    streak: 5,
    badges: [
      { id: 1, name: 'Early Bird', icon: '🌅', color: 'bg-amber-100 text-amber-600' },
      { id: 2, name: 'Code Ninja', icon: '🥷', color: 'bg-slate-100 text-slate-600' },
      { id: 3, name: 'Goal Crusher', icon: '🏆', color: 'bg-emerald-100 text-emerald-600' }
    ]
  });

  const completeMilestone = (goalId: number, milestoneId: number) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: true } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        
        const milestone = goal.milestones.find(m => m.id === milestoneId);
        if (milestone && !milestone.completed) {
          setUserStats(prev => ({ ...prev, xp: prev.xp + milestone.xp }));
        }

        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const handlePurchase = (item: any) => {
    const newPurchase = {
      ...item,
      purchaseId: `SB-${Math.floor(Math.random() * 1000000)}`,
      purchasedAt: new Date().toISOString()
    };
    setPurchaseHistory([newPurchase, ...purchaseHistory]);
    setSelectedItem(null);
    alert(`Successfully purchased: ${item.title}`);
  };

  const addGoal = async () => {
    if (!newGoal.title) return;
    
    setIsSearching(true);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a structured learning path for the goal: "${newGoal.title}" (Type: ${newGoal.type}).
        Return a JSON object with:
        1. "milestones": An array of 3-5 objects with "title" and "xp" (50-300).
        2. "bucket": An object with "topics" (array of 4 strings), "tools" (array of 3 strings), and "tags" (array of 3 strings).
        3. "linkedJob": A string representing a relevant job title.
        4. "category": A string representing the category (e.g., Development, Design, Business).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              milestones: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    xp: { type: Type.NUMBER }
                  },
                  required: ["title", "xp"]
                }
              },
              bucket: {
                type: Type.OBJECT,
                properties: {
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["topics", "tools", "tags"]
              },
              linkedJob: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["milestones", "bucket", "linkedJob", "category"]
          }
        }
      });

      const result = JSON.parse(response.text);
      
      const goal = {
        id: Date.now(),
        title: newGoal.title,
        type: newGoal.type,
        targetDate: newGoal.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: result.category || newGoal.category,
        progress: 0,
        status: 'active',
        milestones: result.milestones.map((m: any, idx: number) => ({ ...m, id: idx + 1, completed: false })),
        linkedJob: result.linkedJob,
        bucket: result.bucket
      };

      setGoals([goal, ...goals]);
      setNewGoal({ title: '', targetDate: '', category: 'Development', type: 'learning' });
      setIsGoalModalOpen(false);
    } catch (error) {
      console.error("Error generating goal:", error);
      const fallbackGoal = {
        id: Date.now(),
        title: newGoal.title,
        type: newGoal.type,
        targetDate: newGoal.targetDate || '2024-12-31',
        category: newGoal.category,
        progress: 0,
        status: 'active',
        milestones: [
          { id: 1, title: 'Getting Started', completed: false, xp: 50 },
          { id: 2, title: 'Core Learning', completed: false, xp: 150 },
          { id: 3, title: 'Final Project', completed: false, xp: 300 }
        ],
        linkedJob: newGoal.type === 'job' ? 'Career Goal' : 'Learning Path',
        bucket: {
          topics: ['Fundamentals', 'Advanced Concepts', 'Best Practices', 'Real-world Projects'],
          tools: ['AI Assistant', 'Skill Tracker', 'Community Forum'],
          tags: ['Latest 2026', 'Trending', 'Career Boost']
        }
      };
      setGoals([fallbackGoal, ...goals]);
      setNewGoal({ title: '', targetDate: '', category: 'Development', type: 'learning' });
      setIsGoalModalOpen(false);
    } finally {
      setIsSearching(false);
    }
  };
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [reelsViewMode, setReelsViewMode] = useState<'reels' | 'grid'>('reels');
  const [reelsSearchQuery, setReelsSearchQuery] = useState('');
  const [registeringCollege, setRegisteringCollege] = useState<any>(null);

  const filteredContent = PUBLISHED_CONTENT.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextReel = () => {
    setCurrentReelIndex((prev) => (prev + 1) % REELS_CONTENT.length);
  };

  const prevReel = () => {
    setCurrentReelIndex((prev) => (prev - 1 + REELS_CONTENT.length) % REELS_CONTENT.length);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
      case 'webinars':
      case 'live-classes':
      case 'events':
      case 'news':
        const filteredContent = activeTab === 'news' 
          ? NEWS_CONTENT 
          : PUBLISHED_CONTENT.filter(item => {
              if (activeTab === 'courses') return item.type === 'course';
              if (activeTab === 'webinars') return item.type === 'webinar';
              if (activeTab === 'live-classes') return item.type === 'live-class';
              if (activeTab === 'events') return item.type === 'event';
              return false;
            });

        const tabHeader = {
          'courses': { title: 'Premium Courses', desc: 'Master new skills with our expert-led courses.' },
          'webinars': { title: 'Expert Webinars', desc: 'Learn from industry leaders in real-time.' },
          'live-classes': { title: 'Live Interactive Classes', desc: 'Join live sessions and interact with instructors.' },
          'events': { title: 'Upcoming Events', desc: 'Don\'t miss out on these educational events.' },
          'news': { title: 'Latest News', desc: 'Stay updated with the latest in education and tech.' }
        }[activeTab as keyof typeof tabHeader];

        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 grid-bg p-8">
            <div className="px-4 border-l-4 border-blue-600">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">{tabHeader?.title}</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em]">{tabHeader?.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredContent.map((item: any) => (
                <GlassCard 
                  key={item.id} 
                  className="transition-all duration-500 group cursor-pointer flex flex-col shadow-sm hover:shadow-xl hover:y-[-10px] overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden border-b border-slate-100">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-110" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                        {item.category || item.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    {item.date && <p className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">{item.date}</p>}
                    <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 uppercase tracking-tight group-hover:text-blue-600 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-8 leading-relaxed font-medium">
                      {item.summary || item.description || `Explore this premium ${item.type} and enhance your professional knowledge base.`}
                    </p>
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <button className="text-[11px] font-black text-blue-600 hover:underline flex items-center gap-2 uppercase tracking-widest">
                        View Details <ArrowRight size={16} />
                      </button>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'order-history':
      case 'enrolled-courses':
      case 'enrolled-webinars':
      case 'enrolled-batches':
      case 'enrolled-events':
      case 'reviews':
        const tabInfo = {
          'order-history': { title: 'Order History', desc: 'View your past purchases and receipts.' },
          'enrolled-courses': { title: 'Enrolled Courses', desc: 'Manage and continue your active courses.' },
          'enrolled-webinars': { title: 'Enrolled Webinars', desc: 'Upcoming and past webinars you registered for.' },
          'enrolled-batches': { title: 'Enrolled Batches', desc: 'Track your progress in cohort-based batches.' },
          'enrolled-events': { title: 'Enrolled Events', desc: 'Your registered events and workshops.' },
          'reviews': { title: 'My Reviews', desc: 'Manage reviews you have written for courses and experts.' }
        }[activeTab as keyof typeof tabInfo];

        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase">{tabInfo?.title}</h2>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{tabInfo?.desc}</p>
            </div>
            
            <div className="glass-card glow-blue p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 flex items-center justify-center text-blue-300 border border-blue-600/5">
                {activeTab === 'order-history' && <ShoppingBag size={40} />}
                {activeTab === 'enrolled-courses' && <GraduationCap size={40} />}
                {activeTab === 'enrolled-webinars' && <Video size={40} />}
                {activeTab === 'enrolled-batches' && <Layers size={40} />}
                {activeTab === 'enrolled-events' && <Calendar size={40} />}
                {activeTab === 'reviews' && <Star size={40} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No data found</h3>
                <p className="text-xs text-slate-500 font-medium">You haven't added anything here yet. Explore our library to get started!</p>
              </div>
              <button 
                onClick={() => setActiveTab('feed')}
                className="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                Explore Library
              </button>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tighter text-slate-900 uppercase">Jobs & Internships</h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Find your next career opportunity</p>
              </div>
              <div className="flex items-center gap-2 bg-card p-1 border border-border overflow-x-auto">
                {['All', 'Development', 'Design', 'Business', 'Marketing'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-bold transition-all whitespace-nowrap uppercase tracking-widest",
                      categoryFilter === cat ? "bg-blue-600 text-white" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PUBLISHED_CONTENT.filter(item => item.type === 'job' && (categoryFilter === 'All' || item.category === categoryFilter)).map(job => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedItem(job)}
                  className="bg-card border border-border hover:border-primary transition-all duration-500 group cursor-pointer flex flex-col h-full"
                >
                  <div className="aspect-square relative overflow-hidden border-b border-slate-100">
                    <img 
                      src={job.thumbnail} 
                      alt={job.title} 
                      className="w-full h-full object-cover transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
                        {(job as any).type_job}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs border border-blue-600/5">
                        {(job as any).company[0]}
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{(job as any).company}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:underline transition-all leading-tight uppercase tracking-tight">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-blue-600/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <MapPin size={12} className="text-blue-600" />
                        {(job as any).location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                        <DollarSign size={12} className="text-blue-600" />
                        {(job as any).salary}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'colleges':
      case 'ai-tools':
      case 'prompts':
        const typeMap: Record<string, string> = {
          'courses': 'course',
          'webinars': 'webinar',
          'live-classes': 'live-class',
          'events': 'event',
          'colleges': 'college',
          'ai-tools': 'ai-tool',
          'prompts': 'prompt'
        };
        const typeFilter = typeMap[activeTab];
        const filteredByType = PUBLISHED_CONTENT.filter(item => 
          (item.type === typeFilter) &&
          (selectedCategory === 'All' || item.category === selectedCategory) &&
          (item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tighter uppercase">{activeTab.replace('-', ' ')}</h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Explore premium {activeTab.replace('-', ' ')} curated for your growth.</p>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold whitespace-nowrap transition-all border uppercase tracking-widest",
                      selectedCategory === cat 
                        ? "bg-blue-600 text-white border-blue-600" 
                        : "bg-card text-muted-foreground border-border hover:border-primary"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredByType.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredByType.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="bg-card border border-border overflow-hidden hover:border-primary transition-all group cursor-pointer shadow-sm"
                  >
                    <div className="aspect-video relative overflow-hidden border-b border-blue-600/5">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-600/5">
                          {item.authorAvatar}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.author}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight group-hover:underline transition-all line-clamp-2 uppercase tracking-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-slate-900 tracking-tighter">{(item as any).price || (item.type === 'prompt' ? 'Free' : (item.type === 'ai-tool' ? 'Premium' : 'N/A'))}</span>
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-600/10 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 bg-card border border-dashed border-border">
                <div className="w-16 h-16 bg-neutral-50 flex items-center justify-center text-neutral-300 border border-black/5">
                  <Search size={32} />
                </div>
                <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">No {activeTab} found matching your criteria.</p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="px-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">Settings</h1>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Manage your profile, micro-apps, and purchase history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Skill Bloomer Micro Apps */}
                <div className="bg-card border border-border p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground">
                      <LayoutGrid size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Skill Bloomer Micro Apps</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {[
                      { name: 'AI Tutor', icon: Sparkles },
                      { name: 'Code Lab', icon: Code },
                      { name: 'Design Studio', icon: Palette },
                      { name: 'Career Path', icon: Briefcase },
                      { name: 'Jobs', icon: Briefcase },
                      { name: 'Skill Tracker', icon: Target },
                      { name: 'Community', icon: Users }
                    ].map((app, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 p-4 border border-border hover:border-primary transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <app.icon size={24} />
                        </div>
                        <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase History */}
                <div className="bg-card border border-border p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground">
                      <History size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">Purchase History</h3>
                  </div>
                  {purchaseHistory.length > 0 ? (
                    <div className="space-y-4">
                      {purchaseHistory.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-secondary border border-border">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 overflow-hidden border border-border">
                              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-foreground uppercase tracking-tight">{item.title}</p>
                              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{item.purchaseId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{item.price || 'Free'}</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(item.purchasedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-secondary border border-dashed border-border">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">No purchases yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-card border border-border p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Profile Info</h3>
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-24 h-24 bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
                      JD
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-foreground uppercase tracking-tight">John Doe</h4>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Learner Pro</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full py-3 bg-secondary text-primary border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
                      Edit Profile
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full py-3 bg-card text-foreground border border-primary text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-10 animate-in fade-in duration-700 pb-20 relative">
            {/* Gamification Header */}
            <GlassCard className="bg-blue-600 text-white p-8 border border-blue-600 shadow-xl shadow-blue-600/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <GlassBadge variant="secondary" className="bg-card text-primary text-[9px] font-bold uppercase tracking-widest">Level 12</GlassBadge>
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Master Learner</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter uppercase">Your Learning Journey</h2>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Zap size={14} className="text-white" />
                      <span>2,450 XP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Flame size={14} className="text-white" />
                      <span>12 Day Streak</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center">
                      <Trophy size={20} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span>Progress to Level 13</span>
                  <span>75%</span>
                </div>
                <div className="h-1 bg-white/20">
                  <div className="h-full bg-white w-[75%]" />
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Goals Area */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Active Goals</h3>
                  <GlassButton 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    + New Goal
                  </GlassButton>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {goals.map((goal, i) => (
                    <GlassCard key={goal.id} className="p-8 hover:border-blue-600 transition-all group shadow-lg">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "w-12 h-12 flex items-center justify-center shrink-0 border border-current/10",
                            goal.type === 'job' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {goal.type === 'job' ? <Trophy size={24} /> : <GraduationCap size={24} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{goal.category}</span>
                              <GlassBadge variant={goal.type === 'job' ? 'warning' : 'primary'} className="text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest">
                                {goal.type === 'job' ? 'Job Goal' : 'Learning Goal'}
                              </GlassBadge>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{goal.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Target: {goal.linkedJob}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-50 uppercase tracking-widest block">Deadline</span>
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{goal.targetDate}</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            <span>Overall Progress</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="h-2 bg-blue-50 overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${goal.progress}%` }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {goal.milestones.map((milestone) => (
                            <div 
                              key={milestone.id}
                              className={cn(
                                "p-4 border transition-all flex items-center justify-between group/milestone",
                                milestone.completed 
                                  ? "bg-emerald-50/50 border-emerald-600/20" 
                                  : "bg-card border-border hover:border-primary/30"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-6 h-6 flex items-center justify-center border",
                                  milestone.completed 
                                    ? "bg-emerald-600 text-white border-emerald-600" 
                                    : "bg-transparent text-slate-300 border-slate-200 group-hover/milestone:border-blue-600/50"
                                )}>
                                  {milestone.completed ? <Check size={14} /> : <div className="w-1 h-1 bg-current" />}
                                </div>
                                <div>
                                  <p className={cn(
                                    "text-[11px] font-bold uppercase tracking-tight",
                                    milestone.completed ? "text-emerald-700 line-through opacity-60" : "text-slate-900"
                                  )}>
                                    {milestone.title}
                                  </p>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">+{milestone.xp} XP</span>
                                </div>
                              </div>
                              {!milestone.completed && (
                                <button 
                                  onClick={() => completeMilestone(goal.id, milestone.id)}
                                  className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline opacity-0 group-hover/milestone:opacity-100 transition-opacity"
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>

                {/* AI Learning Buckets */}
                <GlassCard className="bg-slate-50 border border-blue-600/5 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={20} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">AI Generated Buckets</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'Fast Track: Frontend', items: 12, time: '4 Weeks' },
                      { name: 'Deep Dive: Backend', items: 24, time: '8 Weeks' }
                    ].map((bucket, i) => (
                      <GlassCard key={i} className="p-5 hover:border-blue-600 transition-all cursor-pointer shadow-sm">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1 group-hover:text-blue-600">{bucket.name}</h4>
                        <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>{bucket.items} Items</span>
                          <span>•</span>
                          <span>{bucket.time}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-8">
                <GlassCard className="p-8">
                  <h3 className="text-lg font-bold text-foreground mb-6 uppercase tracking-tight">Leaderboard</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Alex R.', xp: '12.4k', rank: 1 },
                      { name: 'Sarah M.', xp: '11.2k', rank: 2 },
                      { name: 'You', xp: '2.4k', rank: 42, isMe: true }
                    ].map((user, i) => (
                      <div key={i} className={cn(
                        "flex items-center justify-between p-3 border",
                        user.isMe ? "bg-blue-600 text-white border-blue-600" : "bg-slate-50 border-blue-600/5"
                      )}>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold w-4">{user.rank}</span>
                          <span className="text-[11px] font-bold uppercase tracking-tight">{user.name}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{user.xp} XP</span>
                      </div>
                    ))}
                  </div>
                  <GlassButton className="w-full mt-6 py-3 border border-blue-600 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                    View Full Rankings
                  </GlassButton>
                </GlassCard>

                <GlassCard className="p-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Expert Feedback</h3>
                  <div className="p-4 bg-blue-50 border-l-2 border-blue-600 italic text-xs text-slate-600 leading-relaxed">
                    "Your consistency in React is impressive. Focus on state management next to reach Level 13."
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">— Prof. Sarah Chen</p>
                </GlassCard>
              </div>
            </div>
          </div>
        );

      case 'reels':
        const filteredReels = REELS_CONTENT.filter(reel => 
          reel.title.toLowerCase().includes(reelsSearchQuery.toLowerCase()) ||
          reel.author.toLowerCase().includes(reelsSearchQuery.toLowerCase())
        );

        return (
          <div className="h-[calc(100vh-120px)] flex flex-col bg-background border border-border overflow-hidden relative group">
            {/* View Toggle & Search Bar */}
            <div className="absolute top-6 left-6 right-6 z-50 flex items-center justify-between gap-4">
              <div className="flex bg-background/80 backdrop-blur-md p-1 border border-border shadow-sm">
                <button 
                  onClick={() => setReelsViewMode('reels')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-widest",
                    reelsViewMode === 'reels' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-blue-600"
                  )}
                >
                  <Smartphone size={16} /> Reels
                </button>
                <button 
                  onClick={() => setReelsViewMode('grid')}
                  className={cn(
                    "px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-widest",
                    reelsViewMode === 'grid' ? "bg-blue-600 text-white" : "text-slate-400 hover:text-blue-600"
                  )}
                >
                  <LayoutGrid size={16} /> Grid
                </button>
              </div>

              {reelsViewMode === 'grid' && (
                <div className="flex-1 max-w-md relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search reels..."
                    value={reelsSearchQuery}
                    onChange={(e) => setReelsSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all font-bold uppercase tracking-widest text-xs"
                  />
                </div>
              )}
            </div>

            {reelsViewMode === 'reels' ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                <video 
                  key={REELS_CONTENT[currentReelIndex].id}
                  src={REELS_CONTENT[currentReelIndex].videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  className="h-full w-auto object-cover opacity-80"
                />
                
                {/* Reel Info */}
                <div className="absolute bottom-8 left-8 right-20 text-white space-y-2 drop-shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-bold">
                      {REELS_CONTENT[currentReelIndex].author[0]}
                    </div>
                    <span className="font-bold uppercase tracking-tight">{REELS_CONTENT[currentReelIndex].author}</span>
                    <button className="px-4 py-1 bg-card text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all">Follow</button>
                  </div>
                  <p className="text-sm font-bold uppercase tracking-tight leading-tight">{REELS_CONTENT[currentReelIndex].title}</p>
                </div>

                {/* Reel Actions */}
                <div className="absolute right-6 bottom-8 flex flex-col gap-6 text-white drop-shadow-lg">
                  <button className="flex flex-col items-center gap-1 group/btn">
                    <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                      <Heart size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{REELS_CONTENT[currentReelIndex].likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group/btn">
                    <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                      <MessageSquare size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{REELS_CONTENT[currentReelIndex].comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group/btn">
                    <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                      <Share2 size={24} />
                    </div>
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                </div>

                {/* Navigation Controls */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={prevReel}
                    className="p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-blue-600 transition-all hover:text-white"
                  >
                    <ChevronUp size={24} />
                  </button>
                  <button 
                    onClick={nextReel}
                    className="p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full hover:bg-blue-600 transition-all hover:text-white"
                  >
                    <ChevronDown size={24} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-8 pt-24 no-scrollbar bg-background">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredReels.map((reel, index) => (
                    <div 
                      key={reel.id}
                      onClick={() => {
                        setCurrentReelIndex(REELS_CONTENT.findIndex(r => r.id === reel.id));
                        setReelsViewMode('reels');
                      }}
                      className="aspect-[9/16] bg-blue-50 overflow-hidden relative group cursor-pointer border border-blue-600/10 hover:border-blue-600 transition-all"
                    >
                      <video 
                        src={reel.videoUrl}
                        className="w-full h-full object-cover transition-all"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-blue-900/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-bold text-white line-clamp-2 mb-2 uppercase tracking-tight">{reel.title}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-white/20 flex items-center justify-center text-[8px] font-bold text-white border border-white/30">
                            {reel.author[0]}
                          </div>
                          <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest">{reel.author}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-blue-600 text-white border border-white/10">
                        <Play size={10} fill="currentColor" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">{reel.likes}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredReels.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Search size={48} className="opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">No reels found matching "{reelsSearchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'feed':
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-1000 pb-32 relative overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none opacity-30"></div>
            
            {/* Dynamic Mesh Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-100/20 rounded-full blur-[100px]"></div>
            <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-blue-200/10 rounded-full blur-[80px] animate-bounce duration-[15000ms]"></div>
            
            {/* Premium AI Search Hero */}
            <div className="relative w-full max-w-5xl px-4 flex flex-col items-center text-center space-y-12 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -z-10 animate-pulse"></div>
              
              <div className="space-y-6 max-w-3xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest border border-blue-600 glow-sm"
                >
                  <Sparkles size={14} className="animate-pulse" />
                  <span>Next-Gen AI Search</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                  className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tighter leading-[1.1] uppercase"
                >
                  What do you want to <br />
                  <span className="text-blue-600 relative inline-block">
                    learn today?
                    <span className="absolute bottom-1 left-0 w-full h-2 bg-blue-600/10 -z-10"></span>
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-2xl mx-auto leading-relaxed"
                >
                  Search across courses, webinars, jobs, and AI tools with our advanced neural engine.
                </motion.p>
              </div>

              {/* AI Search Bar - Advanced Design */}
              <div className="w-full max-w-4xl relative group px-4">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <GlassCard className="relative p-2 flex items-center shadow-2xl shadow-blue-600/10 glow-md group-hover:glow-lg transition-all border-2 border-blue-600">
                  <div className="pl-4 pr-2 text-blue-600">
                    <Search size={22} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ask AI: 'Find top MBA colleges in USA' or 'Best React courses'..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-base font-bold text-slate-900 placeholder:text-slate-300 py-3 uppercase tracking-tight"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <GlassButton 
                    onClick={handleAiSearch}
                    className="hidden md:flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold hover:bg-black transition-all uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20"
                  >
                    <Sparkles size={14} />
                    <span>AI Search</span>
                  </GlassButton>
                  <button 
                    onClick={handleAiSearch}
                    className="md:hidden p-3.5 bg-blue-600 text-white"
                  >
                    <Search size={20} />
                  </button>
                </GlassCard>
                
                {/* AI Search Results */}
                <AnimatePresence>
                  {(isSearching || aiResponse) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-12 w-full max-w-4xl"
                    >
                      <GlassCard className="p-8 md:p-12 relative overflow-hidden border border-blue-600">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                        
                        {isSearching ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-6">
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-full animate-pulse"></div>
                              <Sparkles size={40} className="text-blue-600 animate-bounce" />
                            </div>
                            <div className="space-y-2 text-center">
                              <p className="text-lg font-bold text-slate-900 uppercase tracking-widest animate-pulse">SkillBloomer AI is thinking...</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mapping your future with precision.</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            <div className="flex items-start gap-6">
                              <div className="w-14 h-14 bg-blue-50 border border-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
                                <Sparkles size={28} />
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">AI Recommendations</h3>
                                <p className="text-sm text-neutral-600 font-medium leading-relaxed italic">
                                  "{aiResponse}"
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                              {aiSearchResults.map((result) => (
                                <GlassCard 
                                  key={result.id}
                                  onClick={() => setSelectedItem(result)}
                                  className="flex items-center justify-between p-6 bg-blue-50/50 hover:bg-blue-600 hover:text-white border border-blue-600/5 hover:border-blue-600 transition-all group cursor-pointer"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 border border-blue-600/10 flex items-center justify-center group-hover:border-white/20">
                                      {result.type === 'course' ? <BookOpen size={20} /> :
                                       result.type === 'webinar' ? <Video size={20} /> :
                                       result.type === 'job' ? <Briefcase size={20} /> :
                                       <Sparkles size={20} />}
                                    </div>
                                    <div className="text-left">
                                      <p className="text-[9px] font-bold text-slate-400 group-hover:text-white/60 uppercase tracking-widest">{result.type}</p>
                                      <p className="text-sm font-bold uppercase tracking-tight line-clamp-1">{result.title}</p>
                                    </div>
                                  </div>
                                  <ChevronRight size={20} className="text-blue-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </GlassCard>
                              ))}
                            </div>
                            
                            <button 
                              onClick={() => setAiResponse(null)}
                              className="w-full py-4 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                            >
                              Clear AI Insights
                            </button>
                          </div>
                        )}
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
                
            {/* Trending Tags */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-400">
              <span className="uppercase tracking-widest opacity-60">Trending:</span>
              {['Next.js 15', 'UI Design Systems', 'MBA Admissions', 'AI Internships'].map(tag => (
                <button 
                  key={tag} 
                  onClick={() => {
                    setSearchQuery(tag);
                    setTimeout(() => handleAiSearch(), 0);
                  }}
                  className="hover:text-blue-600 transition-colors uppercase tracking-widest"
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Recommended Communities Section */}
            <div className="w-full mt-24 space-y-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">Recommended Communities</h2>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest max-w-xl">
                  Join specialized groups to collaborate with peers and industry experts.
                </p>
                <button 
                  onClick={() => alert('Community Creation coming soon!')}
                  className="mt-4 px-8 py-3 bg-background border border-primary text-primary font-bold text-[10px] hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 uppercase tracking-widest"
                >
                  <Plus size={16} /> Create Your Own Community
                </button>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {COMMUNITY_GROUPS.map((group, idx) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.1 }}
                    onClick={() => setActiveTab('community')}
                    className="group glass-card glow-blue hover:border-blue-600 transition-all cursor-pointer flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-600/5"
                  >
                    <div className="w-full md:w-[450px] aspect-video md:aspect-auto relative overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={group.image} 
                        alt={group.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                          {group.category}
                        </span>
                      </div>
                      {group.isPrivate && (
                        <div className="absolute top-6 right-6">
                          <div className="p-3 bg-card/90 backdrop-blur-md text-primary shadow-xl">
                            <Lock size={18} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-10 flex flex-col flex-1 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="text-3xl font-bold text-slate-900 group-hover:text-blue-600 transition-all uppercase tracking-tighter leading-none">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                              <Users size={14} />
                              {group.members} Active Members
                            </div>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <Globe size={14} />
                              Global Community
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex -space-x-3">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-10 h-10 border-4 border-white bg-blue-50 overflow-hidden shadow-sm">
                              <img src={`https://i.pravatar.cc/100?u=${group.id + i}`} alt="member" referrerPolicy="no-referrer" />
                            </div>
                          ))}
                          <div className="w-10 h-10 border-4 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">
                            +1k
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
                          {group.description} Join our elite circle of professionals and enthusiasts to share insights, collaborate on projects, and stay ahead of the curve in {group.category.toLowerCase()}.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {['Live Workshops', 'Resource Library', 'Expert Mentorship', 'Job Board'].slice(0, 3 + (idx % 2)).map(tag => (
                            <span key={tag} className="text-[9px] font-bold text-slate-400 border border-slate-100 px-3 py-1 uppercase tracking-widest bg-slate-50/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 mt-auto flex items-center justify-between border-t border-blue-600/5">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Active</span>
                            <span className="text-xs font-bold text-slate-900">2 mins ago</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Weekly Growth</span>
                            <span className="text-xs font-bold text-green-600">+12%</span>
                          </div>
                        </div>
                        <button className="px-10 py-4 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3">
                          Join Community <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setActiveTab('community')}
                  className="px-10 py-4 bg-background border border-primary text-primary font-bold text-xs hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-primary/10"
                >
                  Explore All Communities
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
              </div>
            </div>
          </div>
        );
      
      case 'community':
        return (
          <div className="space-y-12 animate-in fade-in duration-700 pb-20 relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 dark:bg-blue-400/5 blur-[100px] -z-10 rounded-full"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-slate-900 tracking-tighter uppercase"
                >
                  Learning Communities
                </motion.h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Join groups of like-minded students and grow together.</p>
              </div>
              <button 
                onClick={() => alert('Create Community feature coming soon!')}
                className="px-8 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all glow-sm flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Start a Community
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COMMUNITY_GROUPS.map((group, i) => (
                <motion.div 
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card glow-blue overflow-hidden group hover:border-blue-600 transition-all flex flex-col"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={group.image} 
                      alt={group.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-all"></div>
                    <div className="absolute top-4 left-4 px-3 py-1 bg-card text-primary text-[9px] font-bold uppercase tracking-widest border border-border">
                      {group.category}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight group-hover:underline">{group.name}</h3>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 uppercase tracking-widest font-bold">{group.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-blue-600/5 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="w-8 h-8 rounded-none border-2 border-white bg-blue-50 overflow-hidden">
                              <img src={`https://i.pravatar.cc/100?u=${group.id}${j}`} alt="User" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.members.toLocaleString()} Members</span>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                        Join
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="space-y-12 animate-in fade-in duration-700 pb-20 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 dark:bg-blue-400/10 blur-[100px] -z-10 rounded-full"></div>
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-slate-900 tracking-tighter uppercase"
                >
                  Student Dashboard
                </motion.h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Track your progress and manage your learning journey.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest border border-blue-600 glow-sm">
                  Learner Pro
                </div>
                <div className="px-5 py-2.5 bg-card text-primary text-[10px] font-bold uppercase tracking-widest border border-border">
                  Verified Student
                </div>
              </div>
            </div>

            {/* Professional Community Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden group rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-600 to-indigo-900 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative z-10 px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">Exclusive</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                    CEO, CXO, Trainers & Creators
                  </h2>
                  <p className="text-blue-100 text-sm font-medium max-w-2xl leading-relaxed">
                    Join our elite network of industry leaders and educators. Share insights, mentor the next generation, and build your professional legacy.
                  </p>
                </div>
                <button className="group relative px-10 py-5 bg-card text-foreground font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95">
                  <span className="relative z-10">Join Elite Community</span>
                  <div className="absolute inset-0 bg-blue-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-600/10 rounded-full blur-xl group-hover:scale-150 transition-all"></div>
                </button>
              </div>
              
              {/* Animated background elements */}
              <motion.div 
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full"
              />
              <motion.div 
                animate={{ 
                  x: [0, -100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.5, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/20 blur-[100px] rounded-full"
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Stats & Learning */}
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[
                    { label: 'Active Courses', value: '4', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', darkBg: '' },
                    { label: 'Certificates', value: '12', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', darkBg: '' },
                    { label: 'Skill Points', value: '850', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', darkBg: '' }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-card border-2 border-border p-10 flex flex-col gap-8 hover:border-primary transition-all group glow-md hover:glow-lg"
                    >
                      <div className={cn("w-16 h-16 flex items-center justify-center border border-blue-600/5 group-hover:bg-blue-600 group-hover:text-white transition-all", stat.bg, stat.darkBg, stat.color)}>
                        <stat.icon size={28} />
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-card border-2 border-border overflow-hidden glow-sm hover:glow-md transition-all">
                  <div className="p-8 border-b border-blue-600/10 flex items-center justify-between bg-blue-50/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white">
                        <PlayCircle size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Continue Learning</h3>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View All Courses</button>
                  </div>
                  <div className="divide-y divide-blue-600/10 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {[1, 2].map(i => (
                      <div key={i} className="p-8 flex flex-col sm:flex-row items-center gap-8 hover:bg-blue-50 transition-all group cursor-pointer">
                        <div className="w-full sm:w-56 aspect-video overflow-hidden shrink-0 border-2 border-blue-600/5 group-hover:border-blue-600 transition-all">
                          <img 
                            src={`https://picsum.photos/seed/learn${i}/400/225`} 
                            alt="Course" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 space-y-5">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest">In Progress</span>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 group-hover:underline transition-all uppercase tracking-tight leading-tight">
                            {i === 1 ? 'Mastering React & Next.js 14' : 'Advanced UI/UX Design Patterns'}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <span>Progress: {i === 1 ? '45%' : '72%'}</span>
                              <span>{i === 1 ? '12/24' : '18/25'} Lessons</span>
                            </div>
                            <div className="w-full h-2.5 bg-blue-50 overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
                                style={{ width: i === 1 ? '45%' : '72%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <button className="p-5 bg-card border-2 border-border text-primary hover:bg-primary hover:text-primary-foreground transition-all glow-sm">
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar: Settings & Social */}
              <div className="space-y-8">
                <div className="bg-card border-2 border-border p-8 glow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-8 uppercase tracking-tight">Settings & Social</h3>
                  <div className="space-y-3">
                    {[
                      { icon: <User size={18} />, label: 'Profile Settings' },
                      { icon: <Users size={18} />, label: 'Following List', count: 3 },
                      { icon: <History size={18} />, label: 'Purchase History', count: purchaseHistory.length },
                      { icon: <AppWindow size={18} />, label: 'SkillBloomer Micro App' },
                      { icon: <Bell size={18} />, label: 'Notifications', count: 5 },
                      { icon: <Shield size={18} />, label: 'Privacy & Security' },
                      { icon: <CreditCard size={18} />, label: 'Subscriptions' },
                      { icon: <LogOut size={18} />, label: 'Logout', onClick: onLogout, danger: true }
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={item.onClick}
                        className={cn(
                          "w-full flex items-center justify-between p-4 transition-all group border-2 border-transparent",
                          item.danger ? "text-slate-400 hover:text-red-600 hover:border-red-600/10" : "text-slate-500 hover:text-blue-600 hover:border-blue-600/10 hover:bg-blue-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-11 h-11 flex items-center justify-center transition-all border border-blue-600/5",
                            item.danger ? "bg-red-50" : "bg-blue-50 group-hover:bg-blue-600 group-hover:text-white"
                          )}>
                            {item.icon}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.count && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold">
                              {item.count}
                            </span>
                          )}
                          <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-600 p-10 text-white relative overflow-hidden group glow-md shadow-xl shadow-blue-600/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/10 flex items-center justify-center mb-8 border border-white/10">
                      <Zap size={28} className="text-white animate-pulse" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4 uppercase tracking-tight">Premium Access</h4>
                    <p className="text-xs text-neutral-400 mb-10 leading-relaxed uppercase tracking-widest font-bold">Unlock all courses, live sessions, and expert mentorship.</p>
                    <button className="w-full py-5 bg-card text-primary font-bold uppercase tracking-widest hover:bg-secondary transition-all glow-sm border border-border">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 relative overflow-hidden font-sans",
      "bg-[#F8FAFC] text-slate-900"
    )}>
      {/* Global Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="h-20 bg-background/40 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 sm:px-12 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all rounded-lg border border-blue-100 shadow-sm group"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu size={20} className={cn("transition-transform duration-500", isSidebarCollapsed ? "rotate-180" : "rotate-0")} />
            </button>
            <Logo variant="glass" className="cursor-pointer" onClick={() => setActiveTab('home')} />

          <div className="hidden md:block relative ml-4">
            <button 
              onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold hover:bg-black transition-all uppercase tracking-widest border border-blue-600 shadow-lg shadow-blue-600/20"
            >
              <Plus size={14} />
              Discover
              <ChevronDown size={12} className={cn("transition-transform duration-300", isDiscoverOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isDiscoverOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDiscoverOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-card border-2 border-primary shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="p-4 bg-blue-50 border-b border-blue-600/10">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Explore SkillBloomer</p>
                    </div>
                    <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {[
                        { icon: <PlusCircle className="w-4 h-4 text-blue-600" />, label: 'Create Community', desc: 'Start your own learning group' },
                        { icon: <Users className="w-4 h-4 text-blue-600" />, label: 'Discover Communities', desc: 'Find groups that match your interests' },
                        { icon: <BookOpen className="w-4 h-4 text-blue-600" />, label: 'Browse Courses', desc: 'Expert-led premium learning' },
                        { icon: <Video className="w-4 h-4 text-blue-600" />, label: 'Upcoming Webinars', desc: 'Live industry insights' },
                        { icon: <Radio className="w-4 h-4 text-blue-600" />, label: 'Live Classes', desc: 'Interactive real-time learning' },
                        { icon: <GraduationCap className="w-4 h-4 text-blue-600" />, label: 'Top Colleges', desc: 'Explore world-class institutions' },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-start gap-4 px-5 py-4 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="mt-0.5 p-2 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">{item.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:block relative">
            <button 
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-200"
            >
              <LayoutGrid size={14} />
              Apps
              <ChevronDown size={12} className={cn("transition-transform duration-300", isAppsOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isAppsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsAppsOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-[640px] bg-card border-2 border-primary shadow-2xl z-20 overflow-hidden"
                  >
                    <div className="p-4 bg-blue-50 border-b border-blue-600/10 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SkillBloomer Ecosystem</p>
                      <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">20 Apps Available</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[480px] overflow-y-auto custom-scrollbar">
                      {APPS.map((app, i) => (
                        <button
                          key={i}
                          className="flex items-start gap-3 p-3 hover:bg-blue-50 transition-all text-left group rounded-lg"
                        >
                          <div className="mt-0.5 p-2 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {app.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{app.label}</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tight mt-0.5 line-clamp-1">{app.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <button 
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-[10px] font-bold hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-200"
            >
              <Globe size={14} />
              {currentLanguage}
              <ChevronDown size={12} className={cn("transition-transform duration-300", isLanguageOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isLanguageOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLanguageOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-40 bg-card border-2 border-primary shadow-2xl z-20 py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.name);
                          setIsLanguageOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                      >
                        {lang.name}
                        {currentLanguage === lang.name && <CheckCircle2 size={12} className="text-blue-600" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <div 
              className="flex items-center gap-5 pl-2 group cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-900 group-hover:text-blue-600 transition-all uppercase tracking-tight">Ankur Awasthi</p>
                <div className="flex items-center justify-end gap-1">
                  <Zap size={10} className="text-yellow-500 fill-yellow-500" />
                  <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-[0.2em]">Learner Pro</p>
                </div>
              </div>
              <button 
                className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center text-sm font-black hover:bg-blue-700 transition-all border border-blue-600/10"
              >
                AA
              </button>
            </div>

            <AnimatePresence>
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-card border-2 border-primary shadow-xl z-20 py-2"
                  >
                    {[
                      { icon: <User size={16} />, label: 'My Profile', tab: 'settings' },
                      { icon: <BookOpen size={16} />, label: 'My Courses', tab: 'enrolled-courses' },
                      { icon: <History size={16} />, label: 'Order History', tab: 'order-history' },
                      { icon: <Settings size={16} />, label: 'Settings', tab: 'settings' },
                      { icon: <LogOut size={16} />, label: 'Logout', onClick: onLogout, danger: true }
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (item.onClick) item.onClick();
                          else if (item.tab) setActiveTab(item.tab);
                          setIsUserMenuOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                          item.danger ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed inset-y-0 left-0 bg-card border-r border-border z-40 transform transition-all duration-500 md:relative md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}>
          <div className="p-6 flex flex-col h-full">
            {/* Create Community Option - Below Logo Area */}
            <div className="mb-8">
              <button 
                onClick={() => alert('Create Community feature coming soon!')}
                className={cn(
                  "w-full flex items-center gap-3 p-4 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-600/20 glow-sm hover:glow-md",
                  isSidebarCollapsed ? "justify-center px-0" : ""
                )}
              >
                <PlusCircle size={20} />
                {!isSidebarCollapsed && <span>Create Community</span>}
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 space-y-8">
              {/* Main Section */}
              <div className="space-y-1">
                {!isSidebarCollapsed && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 px-4">Main Menu</p>}
                {[
                  { id: 'feed', icon: <Search size={22} />, label: 'AI Search' },
                  { id: 'home', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
                  { id: 'community', icon: <Users size={22} />, label: 'Community' },
                  { id: 'reels', icon: <Play size={22} />, label: 'Skill Reels' },
                  { id: 'goals', icon: <Target size={22} />, label: 'My Goals' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 transition-all duration-300 group relative",
                      activeTab === item.id 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" 
                        : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    )}
                  >
                    <div className={cn(
                      "transition-transform duration-500",
                      activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                    )}>
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Explore Section */}
              <div className="space-y-1">
                {!isSidebarCollapsed && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 px-4">Explore</p>}
                {[
                  { id: 'courses', icon: <BookOpen className="w-5 h-5 md:w-6 md:h-6" />, label: 'Courses' },
                  { id: 'webinars', icon: <Video className="w-5 h-5 md:w-6 md:h-6" />, label: 'Webinars' },
                  { id: 'live-classes', icon: <Radio className="w-5 h-5 md:w-6 md:h-6" />, label: 'Live Classes' },
                  { id: 'jobs', icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />, label: 'Jobs & Interns' },
                  { id: 'colleges', icon: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />, label: 'Colleges' },
                  { id: 'ai-tools', icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />, label: 'AI Tools' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 transition-all duration-300 group",
                      activeTab === item.id 
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" 
                        : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    )}
                  >
                    <div className={cn(
                      "transition-transform duration-500",
                      activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                    )}>
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Creator Section */}
              <div className="space-y-1">
                {!isSidebarCollapsed && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 px-4">Creator</p>}
                {[
                  { id: 'instructor', icon: <UserPlus className="w-5 h-5 md:w-6 md:h-6" />, label: 'Instructor Hub' },
                  { id: 'create-community', icon: <PlusCircle className="w-5 h-5 md:w-6 md:h-6" />, label: 'New Community' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { alert(`${item.label} feature coming soon!`); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-4 p-4 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300 group"
                  >
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 space-y-1">
              {[
                { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
                { id: 'logout', icon: <LogOut size={20} />, label: 'Logout', onClick: onLogout },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick || (() => { setActiveTab(item.id); setIsMobileMenuOpen(false); })}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 transition-all duration-300 group",
                    activeTab === item.id 
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600" 
                      : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  )}
                >
                  <div className={cn(
                    "transition-transform duration-500",
                    activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                  )}>
                    {item.icon}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border flex items-center justify-around px-2 z-50">
        {[
          { id: 'reels', icon: <PlayCircle size={20} />, label: 'Reels' },
          { id: 'feed', icon: <Compass size={20} />, label: 'Feed' },
          { id: 'home', icon: <Home size={20} />, label: 'Home' },
          { id: 'goals', icon: <Target size={20} />, label: 'Goals' },
          { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
            )}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-4xl max-h-[90vh] border-2 border-primary overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative border-b md:border-b-0 md:border-r border-blue-600 dark:border-white/10">
              <img 
                src={selectedItem.thumbnail} 
                alt={selectedItem.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 left-6 w-10 h-10 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all md:hidden"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">
                  {selectedItem.category}
                </span>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:flex w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-600/10 dark:border-white/10"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight tracking-tighter uppercase">{selectedItem.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 border border-blue-600/10 dark:border-white/10">
                    {selectedItem.authorAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedItem.author}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedItem.authorRole}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-600/5 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedItem.duration || selectedItem.readTime || 'N/A'}</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-600/5 dark:border-white/5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Star size={14} className="text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" /> {selectedItem.rating || '4.8'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">What you'll learn</h4>
                <ul className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <span>Comprehensive understanding of {selectedItem.category} principles and advanced techniques.</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-blue-600/10 dark:border-white/10 flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                    {selectedItem.type === 'prompt' ? 'Access' : (selectedItem.type === 'ai-tool' ? 'Status' : 'Price')}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tighter">
                    {selectedItem.price || (selectedItem.type === 'prompt' ? 'Free' : (selectedItem.type === 'ai-tool' ? 'Premium' : 'Free'))}
                  </p>
                </div>
                {selectedItem.type === 'college' ? (
                  <button 
                    onClick={() => { setRegisteringCollege(selectedItem); setSelectedItem(null); }}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                    <Globe size={20} />
                    Register
                  </button>
                ) : selectedItem.type === 'ai-tool' ? (
                  <button 
                    onClick={() => { window.open(selectedItem.url, '_blank'); }}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                    <Zap size={20} />
                    Visit Tool
                  </button>
                ) : selectedItem.type === 'prompt' ? (
                  <button 
                    onClick={() => { navigator.clipboard.writeText(selectedItem.content); alert('Prompt copied to clipboard!'); }}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                    <Sparkles size={20} />
                    Copy Prompt
                  </button>
                ) : (
                  <button 
                    onClick={() => handlePurchase(selectedItem)}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                  >
                    <ShoppingCart size={20} />
                    {selectedItem.price ? 'Purchase' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goal Modal */}
      <GlassDialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <GlassDialogContent className="max-w-md p-8">
          <GlassDialogHeader>
            <GlassDialogTitle className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Set New Goal</GlassDialogTitle>
          </GlassDialogHeader>
          
          <div className="space-y-8 mt-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Goal Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setNewGoal({ ...newGoal, type: 'learning' })}
                  className={cn(
                    "py-4 px-4 border-2 transition-all flex flex-col items-center gap-3",
                    newGoal.type === 'learning' 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                      : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-blue-600/30"
                  )}
                >
                  <GraduationCap size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Learning Goal</span>
                </button>
                <button 
                  onClick={() => setNewGoal({ ...newGoal, type: 'job' })}
                  className={cn(
                    "py-4 px-4 border-2 transition-all flex flex-col items-center gap-3",
                    newGoal.type === 'job' 
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600" 
                      : "border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-blue-600/30"
                  )}
                >
                  <Trophy size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Job Goal</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">What is your goal?</label>
              <GlassInput 
                placeholder={newGoal.type === 'job' ? "e.g. Senior Frontend Developer at Google" : "e.g. Master React Hooks"}
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="text-base font-bold uppercase tracking-tight"
              />
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest italic">AI will auto-generate topics, tools, and learning buckets for you.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Target Date (Optional)</label>
              <GlassInput 
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="text-sm font-bold"
              />
            </div>

            <GlassButton 
              onClick={addGoal}
              disabled={isSearching}
              className="w-full py-5 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-black dark:hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="animate-spin" />
                  <span>Generating roadmap...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  <span>Generate Goal with AI</span>
                </div>
              )}
            </GlassButton>
          </div>
        </GlassDialogContent>
      </GlassDialog>

      {/* College Registration Modal */}
      {registeringCollege && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setRegisteringCollege(null)}></div>
          <div className="relative bg-card border-2 border-primary w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setRegisteringCollege(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="text-center space-y-4 mb-10">
              <div className="w-16 h-16 bg-blue-600 flex items-center justify-center text-white mx-auto">
                <Globe size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">College Registration</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Apply for {registeringCollege.title}</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setRegisteringCollege(null); alert('Application submitted successfully!'); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Full Name</label>
                <input type="text" required className="w-full px-4 py-3 bg-secondary border border-border text-sm font-bold focus:border-primary focus:bg-background transition-all" placeholder="Enter your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</label>
                <input type="email" required className="w-full px-4 py-3 bg-secondary border border-border text-sm font-bold focus:border-primary focus:bg-background transition-all" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Phone Number</label>
                <input type="tel" required className="w-full px-4 py-3 bg-secondary border border-border text-sm font-bold focus:border-primary focus:bg-background transition-all" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Preferred Program</label>
                <select className="w-full px-4 py-3 bg-secondary border border-border text-sm font-bold focus:border-primary focus:bg-background transition-all">
                  <option>Full-time MBA</option>
                  <option>Executive MBA</option>
                  <option>Part-time MBA</option>
                  <option>Masters in Management</option>
                </select>
              </div>
              
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all mt-4">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
