import React, { useState } from 'react';
import { 
  Search, 
  Video, 
  Users, 
  Clock, 
  Calendar, 
  Plus, 
  MoreVertical, 
  ExternalLink,
  Trash2,
  Play,
  CheckCircle2,
  Edit3,
  ChevronRight,
  MonitorPlay,
  Share2,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const webinars = [
  { id: 1, emoji: '🚀', title: 'Launch Your First Course', meta: '60 min · Free', status: 'Published', students: 312, revenue: 'Free', rating: '4.9', color: 'from-blue-600 to-indigo-600', starts: '21 Mar 2025, 05:30 AM', countdown: 'Starts in: 2d 7h', category: 'Entrepreneurship' },
  { id: 2, emoji: '🤖', title: 'AI Avatars for Social Media', meta: '60 min · Free', status: 'Published', students: 186, revenue: 'Free', rating: '4.8', color: 'from-emerald-500 to-teal-500', starts: '27 Apr 2025, 04:30 AM', countdown: 'Starts in: 39d 6h', category: 'AI & Tech' },
  { id: 3, emoji: '💼', title: 'Recruitment Firm Automation', meta: '90 min · Free', status: 'Ended', students: 248, revenue: 'Free', rating: '4.7', color: 'from-gray-700 to-gray-900', starts: '29 Jan 2025', countdown: 'Ended', category: 'Business' },
  { id: 4, emoji: '📈', title: 'Digital Marketing 2025', meta: '90 min · ₹299', status: 'Published', students: 144, revenue: '₹43,056', rating: '4.6', color: 'from-orange-500 to-red-500', starts: '05 Apr 2025, 06:00 PM', countdown: 'Starts in: 17d 4h', category: 'Marketing' },
];

export default function WebinarsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Webinars & Live Sessions
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">4 Active</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage your live events and interactive workshops</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C90A8]" />
            <input 
              className="w-full bg-white border border-[#E4E6EE] rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-xs" 
              placeholder="Search webinars..."
            />
          </div>
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Webinar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {webinars.map(webinar => (
          <div key={webinar.id} className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-brand/30 hover:shadow-xl transition-all group cursor-pointer shadow-sm">
            <div className={cn("w-full md:w-64 h-40 md:h-auto bg-linear-to-br flex flex-col items-center justify-center p-6 relative shrink-0", webinar.color)}>
              <div className="absolute top-4 left-4">
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5",
                  webinar.status === 'Ended' ? 'bg-gray-100 text-gray-600' : 'bg-white text-emerald-600 animate-pulse'
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", webinar.status === 'Ended' ? 'bg-gray-400' : 'bg-emerald-500')}></div>
                  {webinar.status === 'Ended' ? 'ENDED' : 'LIVE'}
                </span>
              </div>
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform drop-shadow-lg">{webinar.emoji}</div>
              <div className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">SkillBloomer</div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-brand-light text-brand border border-brand/10 shadow-xs uppercase tracking-wider">
                    {webinar.category}
                  </span>
                  <span className={cn(
                    "text-[12px] font-bold flex items-center gap-1.5",
                    webinar.status === 'Ended' ? "text-[#8C90A8]" : "text-brand"
                  )}>
                    <Clock size={14} />
                    {webinar.countdown}
                  </span>
                </div>
                <h3 className="text-[18px] font-extrabold text-[#0A0C14] mb-3 line-clamp-1 group-hover:text-brand transition-colors">{webinar.title}</h3>
                <div className="flex flex-wrap items-center gap-5 text-[13px] text-[#4A4E6A] font-medium">
                  <div className="flex items-center gap-2"><MonitorPlay size={16} className="text-brand" /> {webinar.meta.split('·')[0]} Session</div>
                  <div className="flex items-center gap-2"><Users size={16} className="text-brand" /> {webinar.students} Enrolled</div>
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-brand" /> {webinar.starts}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#F0F1F7]">
                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all flex items-center justify-center shadow-xs">
                    <Share2 size={16} />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all flex items-center justify-center shadow-xs">
                    <Edit3 size={16} />
                  </button>
                  <button className="w-9 h-9 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all flex items-center justify-center shadow-xs">
                    <Settings size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <div className="text-[14px] font-black text-[#0A0C14]">{webinar.revenue}</div>
                    <div className="text-[10px] font-bold text-[#8C90A8] uppercase tracking-wider">Revenue</div>
                  </div>
                  <button className="btn-primary py-2.5 px-6 text-[13px] font-bold rounded-xl shadow-brand/20 flex items-center gap-2">
                    {webinar.status === 'Ended' ? <Play size={14} fill="white" /> : <MonitorPlay size={14} />}
                    {webinar.status === 'Ended' ? 'View Recording' : 'Manage Event'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
