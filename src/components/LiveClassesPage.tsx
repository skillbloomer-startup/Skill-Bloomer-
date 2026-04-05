import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Users, 
  Video,
  Clock,
  Trash2,
  ExternalLink,
  Edit3,
  ChevronRight,
  Monitor,
  Share2,
  Calendar,
  Play,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const liveClasses = [
  { id: 1, emoji: '💻', title: 'Advanced React Patterns', date: 'Today', time: '06:00 PM', duration: '90 min', instructor: 'Ankur Awasthi', status: 'Upcoming', registered: 45, color: 'bg-blue-600' },
  { id: 2, emoji: '🎨', title: 'UI Design Fundamentals', date: 'Tomorrow', time: '11:00 AM', duration: '60 min', instructor: 'Sarah J.', status: 'Upcoming', registered: 28, color: 'bg-pink-500' },
  { id: 3, emoji: '📊', title: 'Data Analysis with Python', date: 'Oct 25, 2025', time: '04:00 PM', duration: '120 min', instructor: 'Mike R.', status: 'Published', registered: 112, color: 'bg-indigo-500' },
  { id: 4, emoji: '🚀', title: 'SaaS Architecture 101', date: 'Oct 28, 2025', time: '07:00 PM', duration: '90 min', instructor: 'Ankur Awasthi', status: 'Draft', registered: 0, color: 'bg-orange-500' },
];

export default function LiveClassesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">Live Classes</h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5">Schedule and host real-time interactive sessions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Live Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Classes Today" value="2" icon={Monitor} color="text-blue-500" />
        <StatCard label="Total Students" value="840" icon={Users} color="text-emerald-500" />
        <StatCard label="Avg. Attendance" value="82%" icon={Video} color="text-indigo-500" />
        <StatCard label="Total Hours" value="124" icon={Clock} color="text-orange-500" />
      </div>

      <div className="space-y-3">
        {liveClasses.map(liveClass => (
          <div key={liveClass.id} className="bg-white border border-[#E4E6EE] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hover:border-brand/40 hover:shadow-lg transition-all group cursor-pointer">
            <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 shadow-lg relative overflow-hidden", liveClass.color)}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {liveClass.emoji}
            </div>
            <div className="flex-1 min-width-0 w-full">
              <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{liveClass.title}</h3>
                <StatusBadge status={liveClass.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-[12px] text-[#8C90A8] font-medium">
                <span className="flex items-center gap-1.5 font-bold text-brand"><Calendar size={12} /> {liveClass.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> {liveClass.time} ({liveClass.duration})</span>
                <span className="flex items-center gap-1.5"><Users size={12} /> {liveClass.registered} registered</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0F1F7]">
              {liveClass.status === 'Upcoming' && liveClass.date === 'Today' ? (
                <button className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 text-white text-[11px] sm:text-[12px] font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <Play size={12} fill="white" /> Start Class
                </button>
              ) : (
                <button className="p-2 sm:p-2.5 rounded-xl bg-brand-light text-brand hover:bg-brand hover:text-white transition-all border border-brand/10">
                  <Edit3 size={16} />
                </button>
              )}
              <button className="p-2 sm:p-2.5 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-[#E4E6EE] transition-all">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-[#E4E6EE] p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-xl bg-gray-50", color)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-[#0A0C14] tracking-tight">{value}</div>
      <div className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Upcoming: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Published: 'bg-blue-50 text-blue-600 border-blue-100',
    Draft: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  };
  return (
    <span className={cn(
      "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs",
      styles[status] || 'bg-gray-50 text-gray-600 border-gray-100'
    )}>
      {status}
    </span>
  );
}
