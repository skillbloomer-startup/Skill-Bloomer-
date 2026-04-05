import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Users, 
  Mic,
  Play,
  Clock,
  Trash2,
  ExternalLink,
  Edit3,
  ChevronRight,
  Headphones,
  Share2,
  TrendingUp,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const episodes = [
  { id: 1, emoji: '🎙️', title: 'The Future of AI in Education', date: 'Oct 15, 2025', duration: '45 min', listeners: '1.2k', status: 'Published', color: 'bg-purple-600' },
  { id: 2, emoji: '🎧', title: 'Building a SaaS in 2025', date: 'Nov 02, 2025', duration: '32 min', listeners: '850', status: 'Published', color: 'bg-indigo-500' },
  { id: 3, emoji: '💡', title: 'Marketing Strategies for Creators', date: 'Dec 10, 2025', duration: '28 min', listeners: '0', status: 'Draft', color: 'bg-pink-500' },
  { id: 4, emoji: '🔥', title: 'The Power of Personal Branding', date: 'Jan 20, 2026', duration: '40 min', listeners: '2.4k', status: 'Published', color: 'bg-orange-500' },
];

export default function PodcastPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">Podcast Management</h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5">Manage your audio content and episodes</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Create Episode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Episodes" value="12" icon={Mic} color="text-purple-500" />
        <StatCard label="Total Listeners" value="4.5k" icon={Headphones} color="text-emerald-500" />
        <StatCard label="Downloads" value="8.2k" icon={Download} color="text-indigo-500" />
        <StatCard label="Growth" value="+12%" icon={TrendingUp} color="text-orange-500" />
      </div>

      <div className="space-y-3">
        {episodes.map(episode => (
          <div key={episode.id} className="bg-white border border-[#E4E6EE] rounded-2xl p-4 flex items-center gap-5 hover:border-brand/40 hover:shadow-lg transition-all group cursor-pointer">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg relative overflow-hidden", episode.color)}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {episode.emoji}
            </div>
            <div className="flex-1 min-width-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[15px] font-extrabold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{episode.title}</h3>
                <StatusBadge status={episode.status} />
              </div>
              <div className="flex items-center gap-4 text-[12px] text-[#8C90A8] font-medium">
                <span className="flex items-center gap-1.5"><Clock size={12} /> {episode.duration}</span>
                <span className="flex items-center gap-1.5"><Users size={12} /> {episode.listeners} listeners</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> {episode.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="p-2.5 rounded-xl bg-brand-light text-brand hover:bg-brand hover:text-white transition-all border border-brand/10">
                <Play size={16} fill="currentColor" />
              </button>
              <button className="p-2.5 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-[#E4E6EE] transition-all">
                <Edit3 size={16} />
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
    Published: 'bg-emerald-50 text-emerald-600 border-emerald-100',
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
