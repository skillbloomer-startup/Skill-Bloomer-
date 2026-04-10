import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
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
  Menu,
  X
} from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { PUBLISHED_CONTENT, COMMUNITY_GROUPS } from '@/src/lib/content';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
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
      }, 1500);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `The user is searching for: "${searchQuery}" on SkillBloomer.com.
        Based on our platform's content (courses, webinars, events, live classes, podcasts, news, colleges, masters programs, and more), provide a helpful summary and recommend specific items.
        Available items: ${JSON.stringify(PUBLISHED_CONTENT.map(i => ({ id: i.id, title: i.title, type: i.type, category: i.category })))}
        
        Return a JSON object with:
        1. "summary": A concise, encouraging AI response in Markdown format.
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

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col font-sans">
      {/* Background Decorations - Subtle Blue */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/[0.02] rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/[0.02] rounded-full blur-[120px]"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between max-w-[1440px] mx-auto w-full bg-white/90 backdrop-blur-md border-b border-blue-600/10">
        <div className="flex flex-col items-start">
          <Logo className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <button 
            onClick={onLoginClick}
            className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mt-1 hover:underline ml-1"
          >
            Create Community
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="h-12 px-10 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-40 pb-20 relative z-10">
        <div className="max-w-4xl w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shadow-lg shadow-yellow-400/20">
              <Sparkles size={12} className="fill-black" />
              AI-First Learning Ecosystem
            </div>
            <h1 className="text-5xl md:text-8xl font-bold text-slate-900 leading-[1] tracking-tighter uppercase">
              <span className="text-blue-600 relative inline-block">
                Master
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/10 -z-10"></span>
              </span> your <br />
              <span className="text-blue-600 relative inline-block">
                future
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-600/10 -z-10"></span>
              </span> today.
            </h1>
            <p className="text-lg text-slate-500 font-normal max-w-2xl mx-auto leading-relaxed">
              Experience a minimal, AI-driven educational platform. Search for any skill or career path and let our intelligence guide your journey.
            </p>
          </motion.div>

          {/* AI Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-2xl mx-auto"
          >
            <form 
              onSubmit={handleAiSearch}
              className="relative bg-white border-2 border-black p-1 flex items-center gap-2 shadow-xl shadow-black/5"
            >
              <div className="flex-1 relative flex items-center">
                <Search className="absolute left-4 text-blue-600" size={20} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything... 'How to become a developer?'"
                  className="w-full h-14 pl-12 pr-4 bg-transparent text-lg font-medium focus:outline-none placeholder:text-slate-300"
                />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="h-14 px-10 bg-yellow-400 text-black font-bold flex items-center gap-2 hover:bg-yellow-500 transition-all disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    <span className="text-xs uppercase tracking-widest">Processing...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span className="text-xs uppercase tracking-widest">Search</span>
                  </>
                )}
              </button>
            </form>

            {/* Trending Tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Trending:</span>
              {['Next.js', 'AI Internships', 'UI Design', 'Python', 'SaaS'].map((tag) => (
                <button 
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setTimeout(() => handleAiSearch(), 0);
                  }}
                  className="px-4 py-1.5 border border-blue-600/20 text-[11px] font-bold text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all bg-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>

          {/* AI Response Area */}
          <AnimatePresence mode="wait">
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-2xl mx-auto mt-12 p-12 bg-white border-2 border-blue-600 text-center space-y-8 shadow-2xl shadow-blue-600/10"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-2 border-blue-600 animate-ping"></div>
                  <div className="relative w-20 h-20 bg-blue-600 flex items-center justify-center text-white">
                    <Bot size={40} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest">{thinkingSteps[thinkingStep]}</h3>
                  <div className="flex justify-center gap-2">
                    {thinkingSteps.map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1 transition-all duration-500",
                          i === thinkingStep ? "w-12 bg-blue-600" : "w-4 bg-blue-100"
                        )}
                      ></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!isSearching && aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mt-12 space-y-12"
              >
                {/* AI Insight Card */}
                <div className="bg-white p-10 border-2 border-blue-600 relative overflow-hidden shadow-2xl shadow-blue-600/5">
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-14 h-14 bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <Bot size={28} />
                    </div>
                    <div className="space-y-6 text-left">
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">AI Insights</h3>
                      <p className="text-slate-600 text-xl leading-relaxed font-normal">
                        {aiResponse}
                      </p>
                      <button 
                        onClick={onLoginClick}
                        className="inline-flex items-center gap-3 text-blue-600 font-bold hover:gap-5 transition-all uppercase text-xs tracking-widest border-b-2 border-blue-600 pb-1"
                      >
                        Get full roadmap
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aiSearchResults.map((result, idx) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={onLoginClick}
                      className="group p-6 bg-white border border-blue-600/10 hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center gap-6 text-left shadow-sm"
                    >
                      <div className="w-20 h-20 bg-blue-50 shrink-0 overflow-hidden border border-blue-600/10">
                        <img 
                          src={result.thumbnail} 
                          alt={result.title} 
                          className="w-full h-full object-cover transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                            {result.type}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {result.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                          {result.author || result.company}
                        </p>
                      </div>
                      <ChevronRight className="text-blue-600 group-hover:translate-x-2 transition-all" size={20} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured Communities Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-7xl mx-auto mt-32 space-y-16"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase">Communities</h2>
              <p className="text-sm text-slate-500 font-normal max-w-xl">
                Join specialized groups to collaborate with peers and experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {COMMUNITY_GROUPS.map((group, idx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  onClick={onLoginClick}
                  className="group bg-white border border-blue-600/10 overflow-hidden hover:border-blue-600 hover:bg-blue-50 transition-all cursor-pointer flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-600/5"
                >
                  <div className="aspect-[16/9] relative overflow-hidden border-b border-blue-600/10">
                    <img 
                      src={group.image} 
                      alt={group.name} 
                      className="w-full h-full object-cover transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest">
                        {group.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Users size={12} />
                        {group.members}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                    <div className="pt-6 mt-auto flex items-center justify-between border-t border-blue-600/5">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border border-white bg-blue-50 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${group.id + i}`} alt="member" referrerPolicy="no-referrer" />
                          </div>
                        ))}
                      </div>
                      <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
                        View Group
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center pt-12">
              <button 
                onClick={onLoginClick}
                className="px-10 py-4 border-2 border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest shadow-lg shadow-blue-600/10"
              >
                Browse All
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / Stats */}
      <footer className="relative z-10 px-6 py-20 border-t border-blue-600/10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-16">
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-blue-600 tracking-tighter">50K+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Learners</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-blue-600 tracking-tighter">1.2K+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Courses</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-4xl font-bold text-blue-600 tracking-tighter">98%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Success</div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-blue-50 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Join the movement</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
