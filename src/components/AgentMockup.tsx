import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown,
  PlusCircle,
  BookOpen, 
  Video, 
  Briefcase, 
  Globe,
  Zap,
  ShieldCheck,
  Users,
  TrendingUp,
  Cpu,
  MessageSquare,
  Bot,
  Plus,
  ArrowUpRight,
  Command,
  Layout,
  Layers,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Star,
  Clock,
  CheckCircle2,
  Share2,
  Radio,
  GraduationCap,
  Target,
  Calendar,
  Mic,
  Newspaper,
  Award,
  Sun,
  Moon,
  LayoutGrid,
  Palette,
  Code,
  Trophy,
  UserPlus,
  DollarSign,
  ShoppingBag,
  BarChart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import Markdown from 'react-markdown';
import { PUBLISHED_CONTENT, COMMUNITY_GROUPS } from '@/src/lib/content';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

interface AgentMockupProps {
  onLoginClick: () => void;
}

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
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Cert Tracker', desc: 'Manage professional licenses' },
  { icon: <Zap className="w-4 h-4" />, label: 'Market Trends', desc: 'Daily industry briefings' },
];

export default function AgentMockup({ onLoginClick }: AgentMockupProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  const thinkingSteps = [
    "Analyzing your intent...",
    "Scanning global educational databases...",
    "Synthesizing personalized recommendations...",
    "Finalizing your AI-powered roadmap..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      setThinkingStep(0);
      interval = setInterval(() => {
        setThinkingStep(prev => (prev + 1) % thinkingSteps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setAiResponse(null);
    setSearchResults([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Prepare content summary for AI context - sample from each type to ensure diversity
      const types = [...new Set(PUBLISHED_CONTENT.map(i => i.type))];
      const sampledContent = types.flatMap(type => 
        PUBLISHED_CONTENT.filter(i => i.type === type).slice(0, 5)
      ).map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        category: item.category,
        author: item.author
      })).slice(0, 60); // Slightly larger but diverse context

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are SkillBloomer AI, a career and learning assistant. 
              
              Search through our ecosystem for: "${searchQuery}".
              
              Our platform offers:
              - Courses & Programs (Masters, Executive, etc.)
              - Live Classes & Webinars
              - Events & Workshops
              - Colleges & Universities
              - AI Tools & Prompts
              - Jobs & Career Opportunities
              - Podcasts & News
              - Community Groups
              
              Context (Sampled Items): ${JSON.stringify(sampledContent)}
              
              Tasks:
              1. Provide a helpful, encouraging summary of what you found or recommend. Use Markdown.
              2. Identify the IDs of the most relevant items from the context provided.
              
              Return your response in JSON format with the following structure:
              {
                "explanation": "Your markdown formatted explanation here",
                "relevantIds": [number, number, ...]
              }`
            }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              explanation: { type: Type.STRING },
              relevantIds: { 
                type: Type.ARRAY,
                items: { type: Type.INTEGER }
              }
            },
            required: ["explanation", "relevantIds"]
          }
        }
      });

      const result = JSON.parse(response.text);
      setAiResponse(result.explanation);
      
      const foundItems = PUBLISHED_CONTENT.filter(item => result.relevantIds.includes(item.id));
      setSearchResults(foundItems);
      
      setSearchHistory(prev => [searchQuery, ...prev].slice(0, 5));
    } catch (error) {
      console.error("AI Search Error:", error);
      setAiResponse("I couldn't find exactly what you were looking for in our database, but I can still help you build a roadmap. What's your primary goal?");
    } finally {
      setIsSearching(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen size={12} />;
      case 'webinar': return <Video size={12} />;
      case 'live-class': return <Radio size={12} />;
      case 'college': return <GraduationCap size={12} />;
      case 'program': return <Target size={12} />;
      case 'event': return <Calendar size={12} />;
      case 'podcast': return <Mic size={12} />;
      case 'news': return <Newspaper size={12} />;
      case 'job': return <Briefcase size={12} />;
      case 'ai-tool': return <Cpu size={12} />;
      case 'prompt': return <MessageSquare size={12} />;
      case 'masters': return <Award size={12} />;
      default: return <Layers size={12} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center font-sans text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden relative transition-colors duration-500">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Top Navigation */}
      <header className="w-full p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto z-50 sticky top-0">
        <div className="flex items-center gap-8 bg-background/5 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 shadow-2xl">
          <Logo variant="glass" size="md" />
          
          <div className="hidden md:block relative">
            <button 
              onClick={() => setIsDiscoverOpen(!isDiscoverOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold hover:bg-foreground transition-all uppercase tracking-widest border border-primary shadow-lg shadow-primary/20"
            >
              <Plus size={16} />
              Discover
              <ChevronDown size={14} className={cn("transition-transform duration-300", isDiscoverOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isDiscoverOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDiscoverOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-72 bg-card border-2 border-primary shadow-2xl z-20 overflow-hidden rounded-2xl"
                  >
                    <div className="p-4 bg-primary/5 border-b border-border">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Explore SkillBloomer</p>
                    </div>
                    <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {[
                        { icon: <PlusCircle className="w-4 h-4" />, label: 'Create Community', desc: 'Start your own learning group' },
                        { icon: <Users className="w-4 h-4" />, label: 'Discover Communities', desc: 'Find groups that match your interests' },
                        { icon: <BookOpen className="w-4 h-4" />, label: 'Browse Courses', desc: 'Expert-led premium learning' },
                        { icon: <Video className="w-4 h-4" />, label: 'Upcoming Webinars', desc: 'Live industry insights' },
                        { icon: <Radio className="w-4 h-4" />, label: 'Live Classes', desc: 'Interactive real-time learning' },
                        { icon: <GraduationCap className="w-4 h-4" />, label: 'Top Colleges', desc: 'Explore world-class institutions' },
                      ].map((item, i) => (
                        <button
                          key={i}
                          className="w-full flex items-start gap-4 px-5 py-4 hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="mt-0.5 p-2 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all rounded-lg">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight mt-0.5">{item.desc}</p>
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
              className="flex items-center gap-2 px-5 py-2.5 bg-background text-muted-foreground rounded-full text-[10px] font-bold hover:bg-muted transition-all uppercase tracking-widest border border-border"
            >
              <LayoutGrid size={16} />
              Apps
              <ChevronDown size={14} className={cn("transition-transform duration-300", isAppsOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isAppsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsAppsOpen(false)}></div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-4 w-[640px] bg-card border-2 border-primary shadow-2xl z-20 overflow-hidden rounded-2xl"
                  >
                    <div className="p-4 bg-primary/5 border-b border-border flex items-center justify-between">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">SkillBloomer Ecosystem</p>
                      <span className="text-[9px] font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full uppercase">20 Apps Available</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[480px] overflow-y-auto custom-scrollbar">
                      {APPS.map((app, i) => (
                        <button
                          key={i}
                          className="flex items-start gap-3 p-3 hover:bg-primary/5 transition-all text-left group rounded-xl"
                        >
                          <div className="mt-0.5 p-2 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all rounded-lg">
                            {app.icon}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors line-clamp-1">{app.label}</p>
                            <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-tight mt-0.5 line-clamp-1">{app.desc}</p>
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
              className="flex items-center gap-2 px-4 py-2 bg-background text-muted-foreground rounded-full text-[10px] font-bold hover:bg-muted transition-all uppercase tracking-widest border border-border"
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
                    className="absolute top-full right-0 mt-4 w-40 bg-card border-2 border-foreground shadow-2xl z-20 py-2 rounded-xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLanguage(lang.name);
                          setIsLanguageOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-primary/5 text-foreground hover:text-primary transition-colors flex items-center justify-between"
                      >
                        {lang.name}
                        {currentLanguage === lang.name && <CheckCircle2 size={12} className="text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={onLoginClick}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 transition-all uppercase tracking-widest shadow-lg shadow-primary/20"
          >
            Log in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "w-full flex flex-col items-center text-center transition-all duration-700 relative overflow-hidden",
        aiResponse ? "pt-8 pb-16" : "pt-12 pb-24"
      )}>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-50/50 -z-10 blur-[120px] rounded-full opacity-50"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-yellow-50/30 -z-10 blur-[100px] rounded-full"></div>
        
        <div className="w-full max-w-7xl px-6 flex flex-col items-center">
          {/* Heading & Subtitle */}
          <div className={cn("space-y-3 transition-all duration-700", aiResponse ? "mb-6" : "mb-8")}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className={cn(
                "font-extrabold tracking-tighter text-foreground transition-all duration-700 uppercase leading-[1.1]",
                aiResponse ? "text-xl md:text-2xl" : "text-4xl md:text-7xl"
              )}
            >
            {aiResponse ? (
              "Search Results"
            ) : (
              <>
                Learn <span className="text-primary relative inline-block">
                  Skills
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10"></span>
                </span> That Make <br className="hidden md:block" />
                You <span className="text-primary relative inline-block">
                  Stand Out
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10"></span>
                </span>.
              </>
            )}
          </motion.h1>
          {!aiResponse && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xs md:text-sm text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed"
            >
              The AI-powered ecosystem for creators, developers, and learners to build the future together.
            </motion.p>
          )}
        </div>

        {/* Centered Form */}
        <motion.div 
          layout
          className="w-full max-w-3xl space-y-6 relative"
        >
          <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full -z-10 opacity-50"></div>
          <form onSubmit={handleSearch} className="flex items-center gap-3">
            <div className="flex-1 relative group">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask SkillBloomer AI anything..."
                className="w-full h-14 px-8 bg-card border-2 border-border rounded-[16px] text-base font-medium focus:outline-none focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/50 shadow-2xl shadow-primary/10 text-foreground"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-muted border border-border rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Command size={10} />
                  K
                </span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="w-36 h-14 bg-primary text-primary-foreground font-bold text-base rounded-2xl hover:bg-foreground transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98] shrink-0"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  <span>{aiResponse ? "New" : "Search"}</span>
                  <Sparkles size={18} />
                </>
              )}
            </button>
          </form>

          {/* Category Quick Filters */}
          {!aiResponse && !isSearching && (
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {['All', 'Courses', 'Webinars', 'Live Classes', 'Colleges', 'Masters', 'Jobs', 'AI Tools'].map((cat) => (
                <button 
                  key={cat}
                  className="px-5 py-2 bg-card text-muted-foreground text-[10px] font-bold rounded-full border border-border hover:border-primary hover:text-primary transition-all uppercase tracking-widest shadow-sm"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Suggestions Section */}
          {!aiResponse && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 space-y-24 md:space-y-32 pb-24 w-full max-w-[1440px] px-4 md:px-8"
            >
              {/* Communities */}
              <div className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
                    <Users size={24} className="text-primary" />
                    Featured <span className="text-primary">Communities</span>
                  </h3>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                  {COMMUNITY_GROUPS.slice(0, 4).map((group, idx) => (
                    <div 
                      key={group.id} 
                      className="glass-card glow-blue rounded-[2rem] p-6 md:p-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all group cursor-pointer text-left flex flex-col sm:flex-row gap-6 md:gap-8"
                    >
                      <div className="w-full sm:w-40 md:w-48 aspect-square rounded-2xl md:rounded-3xl overflow-hidden shrink-0 bg-muted">
                        <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-1">
                        <div>
                          <div className="flex items-center justify-between mb-3 md:mb-4">
                            <span className="text-[9px] md:text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-widest">{group.category}</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users size={12} className="text-primary" />
                              <span className="text-[9px] md:text-[10px] font-bold text-foreground">{group.members}</span>
                            </div>
                          </div>
                          <h4 className="font-bold text-foreground text-lg md:text-xl mb-2 md:mb-3 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{group.name}</h4>
                          <p className="text-[11px] md:text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed font-medium">{group.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                          <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-primary">
                                {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                          </div>
                          <ArrowUpRight size={18} className="text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Webinars & Live Classes */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                    <Video size={16} className="text-primary" />
                    Upcoming Webinars & Live Classes
                  </h3>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  {(PUBLISHED_CONTENT.filter(i => i.type === 'webinar' || i.type === 'live-class') as any[]).slice(0, 2).map(item => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-6 md:gap-8 glass-card glow-blue rounded-[2rem] p-6 md:p-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all group cursor-pointer text-left">
                      <div className="w-full md:w-64 aspect-video rounded-2xl overflow-hidden shrink-0 bg-muted">
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-1">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-primary text-primary-foreground text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">{item.type}</span>
                            <span className="w-1 h-1 bg-border rounded-full" />
                            <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.category}</span>
                          </div>
                          <h4 className="font-bold text-foreground text-xl md:text-2xl leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{item.title}</h4>
                          <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed max-w-2xl font-medium">Join this exclusive session to deep dive into {item.title.toLowerCase()} with industry experts. Learn practical strategies and gain hands-on experience in real-time.</p>
                        </div>
                        <div className="flex items-center justify-between mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-full flex items-center justify-center text-[10px] font-bold border border-border">{item.authorAvatar}</div>
                            <div className="flex flex-col">
                              <span className="text-[11px] md:text-xs font-bold text-foreground">{item.author}</span>
                              <span className="text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Expert Instructor</span>
                            </div>
                          </div>
                          <button className="px-5 py-2.5 md:px-6 md:py-3 bg-primary/5 text-primary font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all rounded-full">Register Now</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Courses */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    Popular Courses
                  </h3>
                  <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                  {(PUBLISHED_CONTENT.filter(i => i.type === 'course') as any[]).slice(0, 4).map(course => (
                    <div key={course.id} className="glass-card glow-blue rounded-[2rem] p-6 md:p-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all group cursor-pointer text-left flex flex-col">
                      <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden mb-6 md:mb-8 bg-muted shadow-inner">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                          <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">{course.category}</span>
                          <div className="flex items-center gap-1.5 text-accent-yellow">
                            <Star size={12} fill="currentColor" />
                            <span className="text-[11px] md:text-xs font-bold text-foreground">{course.rating}</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-foreground text-xl md:text-2xl mb-3 md:mb-4 leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">{course.title}</h4>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Users size={12} />
                            <span className="text-[11px] md:text-xs font-bold">{course.students} Students</span>
                          </div>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock size={12} />
                            <span className="text-[11px] md:text-xs font-bold">{course.duration}</span>
                          </div>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-4 md:pt-6 border-t border-border">
                          <div className="flex flex-col">
                            <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Course Fee</span>
                            <span className="text-xl md:text-2xl font-bold text-foreground">{course.price}</span>
                          </div>
                          <button className="px-6 py-3 md:px-8 md:py-4 bg-primary text-primary-foreground font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-foreground transition-all shadow-lg shadow-primary/20 rounded-xl md:rounded-2xl flex items-center gap-2">
                            Enroll Now <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Join Strip */}
              <div className="w-full py-16 bg-primary border-y border-primary/10 overflow-hidden relative rounded-[3rem] my-12">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-12 px-6">
                      <span className="text-3xl md:text-5xl font-black text-primary-foreground/20 uppercase italic tracking-tighter">CEO</span>
                      <span className="text-3xl md:text-5xl font-black text-primary-foreground/20 uppercase italic tracking-tighter">CXO</span>
                      <span className="text-3xl md:text-5xl font-black text-primary-foreground/20 uppercase italic tracking-tighter">TRAINER</span>
                      <span className="text-3xl md:text-5xl font-black text-primary-foreground/20 uppercase italic tracking-tighter">CREATOR</span>
                      <div className="flex items-center gap-4 px-8 py-3 bg-primary-foreground/10 rounded-full border border-primary-foreground/20 backdrop-blur-md">
                        <span className="text-xs md:text-sm font-bold text-primary-foreground uppercase tracking-widest">Join Community</span>
                        <ArrowRight size={16} className="text-primary-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Response Display */}
          <AnimatePresence mode="wait">
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full text-left bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">SkillBloomer AI</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Research Assistant</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:list-disc prose-li:text-muted-foreground">
                  <Markdown>{aiResponse}</Markdown>
                </div>

                <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Scanned</span>
                    <span className="text-xs font-bold text-foreground">{PUBLISHED_CONTENT.length} Resources</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Modules</span>
                    <span className="text-xs font-bold text-foreground">12+ Global</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Accuracy</span>
                    <span className="text-xs font-bold text-foreground">99.9% AI-Powered</span>
                  </div>
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-10 space-y-6">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                      <Layers size={16} className="text-primary" />
                      Recommended Resources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id}
                          className="group bg-card border border-border rounded-2xl p-4 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer"
                        >
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                              <img 
                                src={item.thumbnail} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                  {getIconForType(item.type)}
                                  {item.type}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-medium">
                                  {item.category}
                                </span>
                              </div>
                              <h5 className="font-bold text-foreground text-xs line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {item.title}
                              </h5>
                              <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                                {item.author}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-border flex flex-wrap gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">
                    <Plus size={14} />
                    Add to Roadmap
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors">
                    <Share2 size={14} />
                    Share Results
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small Secondary Buttons Below */}
          {!aiResponse && (
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { label: 'Browse Templates', icon: Layout },
                { label: 'AI Roadmap', icon: Sparkles },
                { label: 'Community Feed', icon: Users },
                { label: 'Explore Jobs', icon: Briefcase }
              ].map((item, idx) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + (idx * 0.05) }}
                  className="px-4 py-2 bg-muted border border-border rounded-full text-xs font-bold text-muted-foreground hover:bg-muted/80 hover:border-muted-foreground/30 transition-all flex items-center gap-2 uppercase tracking-widest"
                >
                  <item.icon size={14} />
                  {item.label}
                </motion.button>
              ))}
            </div>
          )}
      </main>

      {/* Footer (Minimal) */}
      <footer className="w-full p-8 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-[9px] font-bold uppercase tracking-[0.2em] max-w-7xl mx-auto mt-auto">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <span>© 2026 SkillBloomer.com</span>
          <span className="w-1 h-1 bg-border rounded-full"></span>
          <span>Built with AI</span>
        </div>
      </footer>

      {/* Background with Grid and Dynamic Animation */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Dynamic Animated Gradients */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[150px] opacity-40"
        ></motion.div>
        
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, -40, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] opacity-40"
        ></motion.div>

        <motion.div 
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-accent-yellow/5 rounded-full blur-[120px] opacity-30"
        ></motion.div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, "-20%"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
