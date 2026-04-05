import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, Plus, Calendar, Clock, Video, MoreVertical, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const mockMessages = [
  { role: 'assistant', content: 'Hello! I am your AI Meeting Assistant. I can help you generate meeting agendas, suggest optimal times, and even draft follow-up emails. How can I assist you today?' },
  { role: 'user', content: 'I need to schedule a discovery call with a potential student interested in the Python Bootcamp. Can you help me draft an agenda?' },
  { role: 'assistant', content: 'Certainly! Here is a suggested agenda for a 30-minute discovery call for the Python Bootcamp:\n\n1. **Introduction (5 min)**: Brief intro and icebreaker.\n2. **Student Goals (10 min)**: Understand their background and what they hope to achieve.\n3. **Bootcamp Overview (10 min)**: Key features, curriculum, and outcomes.\n4. **Q&A & Next Steps (5 min)**: Address concerns and discuss enrollment.' },
];

export default function MeetingGeneratorAI() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'That sounds like a great plan! I can also help you set up a recurring meeting for this if you like.' }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Meeting Generator AI
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">Beta</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Use AI to optimize your meetings and follow-ups</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Calendar size={16} />
            View Schedule
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 bg-white border border-[#E4E6EE] rounded-3xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#F0F2F8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[14px] font-extrabold text-[#0A0C14]">AI Assistant</div>
              <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  msg.role === 'assistant' ? "bg-purple-600 text-white" : "bg-brand text-white"
                )}>
                  {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-[13.5px] leading-relaxed font-medium shadow-xs",
                  msg.role === 'assistant' ? "bg-[#F8F9FE] text-[#0A0C14] rounded-tl-none" : "bg-brand text-white rounded-tr-none"
                )}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#F0F2F8]">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-[#F2F3F7] border border-[#E4E6EE] rounded-2xl py-4 pl-5 pr-14 text-[14px] text-[#0A0C14] outline-hidden focus:border-purple-500 transition-all placeholder:text-[#8C90A8]" 
                placeholder="Ask AI to draft an agenda, suggest times..."
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-purple-600/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Suggestions */}
        <div className="w-80 space-y-6 hidden xl:block">
          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-5 shadow-sm">
            <h3 className="text-[13px] font-extrabold text-[#0A0C14] mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              AI Suggestions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-2xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-all group">
                <div className="text-[12px] font-bold text-purple-700">Draft Follow-up</div>
                <div className="text-[10px] text-purple-600/70 mt-0.5">For your last discovery call</div>
              </button>
              <button className="w-full text-left p-3 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all group">
                <div className="text-[12px] font-bold text-blue-700">Optimize Schedule</div>
                <div className="text-[10px] text-blue-600/70 mt-0.5">Find gaps for deep work</div>
              </button>
              <button className="w-full text-left p-3 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all group">
                <div className="text-[12px] font-bold text-emerald-700">Meeting Summary</div>
                <div className="text-[10px] text-emerald-600/70 mt-0.5">Generate notes from transcript</div>
              </button>
            </div>
          </div>

          <div className="bg-linear-to-br from-purple-600 to-indigo-700 rounded-3xl p-5 text-white shadow-xl shadow-purple-600/30">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Zap size={20} />
            </div>
            <h4 className="text-[15px] font-extrabold leading-tight mb-2">Pro AI Features</h4>
            <p className="text-[12px] text-white/80 mb-4">Unlock advanced AI capabilities for your entire team.</p>
            <button className="w-full py-2.5 rounded-xl bg-white text-purple-700 text-[13px] font-bold hover:bg-gray-100 transition-all">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
