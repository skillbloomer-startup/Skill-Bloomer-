import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Paperclip, 
  Image as ImageIcon, 
  Globe, 
  Database, 
  TrendingUp, 
  Zap,
  Plus,
  History,
  Settings,
  Sparkles,
  BookOpen,
  Video,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  time: string;
  card?: any;
  extra?: string;
}

interface AIStudioProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: string;
}

export default function AIStudio({ isOpen, onClose, initialMode = 'create' }: AIStudioProps) {
  const [mode, setMode] = useState(initialMode);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: `I've processed your request for "${userMsg.text}". Here's what I can do for you in ${mode} mode.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: {
          title: "Action Completed",
          status: "Success",
          items: [
            ["Task", "Content Generation"],
            ["Status", "Ready to Publish"],
            ["Module", mode.charAt(0).toUpperCase() + mode.slice(1)]
          ],
          acts: ["View Details", "Edit", "Publish"]
        }
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#F0F2F8] animate-in fade-in duration-300">
      {/* Sidebar */}
      <aside className="w-[256px] bg-white border-r border-[#E4E7F0] flex flex-col shadow-xl shadow-brand/5">
        <div className="p-5 border-b border-[#EEF0F6]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-700 via-blue-500 to-blue-400 flex items-center justify-center shadow-lg shadow-brand/40">
              <Zap size={22} fill="white" className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#1A1A2E]">SkillBloomer AI</span>
                <span className="text-[9px] bg-brand-light text-brand px-1.5 py-0.5 rounded-full font-bold border border-brand/20">Pro</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([])}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-[#F5F7FE] border border-dashed border-[#C0CFEE] rounded-xl text-brand text-[12.5px] font-semibold hover:bg-brand-light transition-all"
          >
            <Plus size={14} />
            New conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-4 py-2 text-[9.5px] font-bold text-[#B0B5C8] uppercase tracking-widest">Modes</div>
          <div className="space-y-0.5 px-2">
            <ModeItem icon={Plus} label="Create content" active={mode === 'create'} onClick={() => setMode('create')} badge="4" />
            <ModeItem icon={Globe} label="Web search" active={mode === 'search'} onClick={() => setMode('search')} />
            <ModeItem icon={Database} label="Student database" active={mode === 'database'} onClick={() => setMode('database')} />
            <ModeItem icon={TrendingUp} label="Sales & reports" active={mode === 'reports'} onClick={() => setMode('reports')} />
            <ModeItem icon={Sparkles} label="Generate creative" active={mode === 'generate'} onClick={() => setMode('generate')} />
          </div>

          <div className="mt-6 px-4 py-2 text-[9.5px] font-bold text-[#B0B5C8] uppercase tracking-widest">History</div>
          <div className="space-y-0.5 px-2">
            <HistoryItem label="Python bootcamp creation" />
            <HistoryItem label="March sales analysis" />
            <HistoryItem label="Student contact search" />
          </div>
        </div>

        <div className="p-4 bg-[#FAFBFF] border-t border-[#EEF0F6] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-400 flex items-center justify-center text-[11px] font-bold text-white">AA</div>
          <div>
            <div className="text-xs font-bold text-[#1A1A2E]">Ankur Awasthi</div>
            <div className="text-[10.5px] text-[#9999AA]">a.awasthi@skillbloomer.in</div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <div className="h-[58px] bg-white border-b border-[#E4E7F0] flex items-center justify-between px-6 shadow-xs shrink-0">
          <div className="flex bg-[#F0F2F8] p-1 rounded-xl gap-1">
            {['Create', 'Search', 'Database', 'Reports', 'Generate'].map(t => (
              <button 
                key={t}
                onClick={() => setMode(t.toLowerCase())}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  mode === t.toLowerCase() ? "bg-white text-brand shadow-sm" : "text-[#9199B0] hover:text-brand"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold hover:bg-red-100 transition-all"
            >
              <LogOut size={14} />
              Exit AI Mode
            </button>
            <button className="w-9 h-9 rounded-lg border border-[#E4E7F0] flex items-center justify-center text-[#9199B0] hover:bg-brand-light hover:text-brand transition-all">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-8">
          <div className="max-w-3xl mx-auto px-6 space-y-8">
            {messages.length === 0 ? (
              <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand/40">
                  <Zap size={40} fill="white" className="text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight mb-3">What can I help you build?</h1>
                <p className="text-[#9199B0] text-sm max-w-md mx-auto mb-10">Create courses, webinars, events & batches — search students, pull reports, and generate content.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  <SuggestionCard 
                    icon="📚" 
                    title="Create a course" 
                    desc="Syllabus, modules, quizzes via API" 
                    onClick={() => setInput('Create a 6-week Python bootcamp with quizzes and assignments')}
                  />
                  <SuggestionCard 
                    icon="🎙️" 
                    title="Schedule a webinar" 
                    desc="Date, seats, registration link" 
                    onClick={() => setInput('Schedule a live webinar on React for next Friday')}
                  />
                  <SuggestionCard 
                    icon="📊" 
                    title="Sales report" 
                    desc="Revenue, orders, growth trends" 
                    onClick={() => setInput('Show me the sales report for this month')}
                  />
                  <SuggestionCard 
                    icon="🔍" 
                    title="Search students" 
                    desc="Name, email, course, status" 
                    onClick={() => setInput('Find contact details of students enrolled in Python course')}
                  />
                </div>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={cn("flex gap-4", m.type === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                    m.type === 'ai' ? "bg-linear-to-br from-blue-600 to-blue-400 text-white shadow-lg shadow-brand/30" : "bg-[#E8ECF5] text-[#6B7280]"
                  )}>
                    {m.type === 'ai' ? 'A' : 'AA'}
                  </div>
                  <div className={cn("flex-1 max-w-[85%]", m.type === 'user' && "flex flex-col items-end")}>
                    <div className={cn(
                      "p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xs",
                      m.type === 'ai' ? "bg-white text-[#1A1A2E] border border-[#E8ECF5] rounded-tl-none" : "bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none"
                    )}>
                      {m.text}
                    </div>
                    {m.card && (
                      <div className="mt-3 bg-white border border-[#E8ECF5] rounded-2xl p-4 shadow-lg shadow-brand/5">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold text-[#B0B5C8] uppercase tracking-widest">{m.card.title}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">{m.card.status}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {m.card.items.map((it: any, i: number) => (
                            <div key={i} className="bg-[#F8F9FE] border border-[#EEF0F8] rounded-xl p-2.5">
                              <div className="text-[9px] font-bold text-[#B0B5C8] uppercase mb-1">{it[0]}</div>
                              <div className="text-xs font-bold text-[#1A1A2E] truncate">{it[1]}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.card.acts.map((a: string, i: number) => (
                            <button key={i} className={cn(
                              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                              i === 0 ? "bg-brand-light text-brand border border-brand/20 hover:bg-brand/10" : "bg-white border border-[#E4E7F0] text-[#6B7280] hover:bg-[#F4F5FA]"
                            )}>
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-[10px] text-[#B0B5C8] mt-2 font-medium">
                      {m.time} {m.type === 'ai' && '· via Platform API'}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-lg shadow-brand/30">A</div>
                <div className="bg-white border border-[#E8ECF5] p-4 rounded-2xl rounded-tl-none shadow-xs">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand/30 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand/30 animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand/30 animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-6 shrink-0 bg-[#F0F2F8]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-[#E4E7F0] rounded-2xl shadow-2xl shadow-brand/10 focus-within:border-brand transition-all overflow-hidden">
              <div className="p-4 flex items-end gap-3">
                <textarea 
                  className="flex-1 bg-transparent border-none outline-hidden text-sm text-[#1A1A2E] placeholder:text-[#C4C9D8] resize-none min-h-[24px] max-h-32 py-1"
                  placeholder="Ask me anything — create, search, analyze..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                  rows={1}
                />
              </div>
              <div className="px-4 pb-4 flex items-center justify-between">
                <div className="flex gap-1">
                  <IconButton icon={Mic} active />
                  <IconButton icon={Paperclip} />
                  <IconButton icon={ImageIcon} />
                  <IconButton icon={Globe} />
                </div>
                <div className="flex items-center gap-3">
                  <select className="bg-[#F8F9FE] border border-[#E4E7F0] rounded-lg px-2 py-1 text-[11px] font-bold text-[#9199B0] outline-hidden">
                    <option>GPT-4o</option>
                    <option>Claude 3.5</option>
                  </select>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-brand/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center text-[10px] text-[#C4C9D8] mt-3 font-medium">
              AI can make mistakes. Verify important information before pushing to platform.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ModeItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-medium cursor-pointer transition-all",
        active ? "bg-brand/10 text-brand font-bold" : "text-[#6B7280] hover:bg-[#F4F5FA] hover:text-[#1A1A2E]"
      )}
    >
      <Icon size={16} strokeWidth={active ? 2.5 : 2} />
      <span className="flex-1">{label}</span>
      {badge && <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
    </div>
  );
}

function HistoryItem({ label }: any) {
  return (
    <div className="px-3 py-1.5 rounded-lg text-[12px] text-[#9199B0] hover:bg-[#F4F5FA] hover:text-[#1A1A2E] cursor-pointer transition-all truncate">
      {label}
    </div>
  );
}

function SuggestionCard({ icon, title, desc, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white border border-[#E8ECF5] rounded-2xl p-4 text-left hover:border-brand hover:shadow-xl hover:shadow-brand/5 hover:-translate-y-1 transition-all group"
    >
      <div className="text-xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-[13px] font-bold text-[#1A1A2E] mb-0.5">{title}</div>
      <div className="text-[11px] text-[#9199B0] leading-snug">{desc}</div>
    </button>
  );
}

function IconButton({ icon: Icon, active }: any) {
  return (
    <button className={cn(
      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
      active ? "bg-brand-light text-brand" : "text-[#C4C9D8] hover:bg-[#F4F5FA] hover:text-[#6B7280]"
    )}>
      <Icon size={16} />
    </button>
  );
}
