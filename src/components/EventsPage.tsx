import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  Trash2,
  ExternalLink,
  Edit3,
  ChevronRight,
  Ticket,
  Share2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const events = [
  { id: 1, emoji: '🎤', title: 'Tech Summit 2025', date: 'Oct 15, 2025', time: '10:00 AM', location: 'Bangalore, India', price: '₹1,499', status: 'Upcoming', attendees: 450, revenue: '₹6,74,550', color: 'bg-indigo-600' },
  { id: 2, emoji: '💻', title: 'React Developers Meetup', date: 'Nov 02, 2025', time: '04:00 PM', location: 'Online', price: 'Free', status: 'Upcoming', attendees: 120, revenue: '₹0', color: 'bg-cyan-500' },
  { id: 3, emoji: '🎨', title: 'Design Thinking Workshop', date: 'Dec 10, 2025', time: '11:00 AM', location: 'Mumbai, India', price: '₹999', status: 'Draft', attendees: 0, revenue: '₹0', color: 'bg-pink-500' },
  { id: 4, emoji: '🚀', title: 'Startup Pitch Day', date: 'Jan 20, 2026', time: '09:00 AM', location: 'Delhi, India', price: '₹2,499', status: 'Published', attendees: 85, revenue: '₹2,12,415', color: 'bg-orange-500' },
];

export default function EventsPage() {
  const [view, setView] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">Events Management</h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5">Create and manage your offline and online events</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] sm:min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C90A8]" />
            <input 
              className="w-full bg-white border border-[#E4E6EE] rounded-xl py-2 sm:py-2.5 pl-10 pr-4 text-[13px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-xs" 
              placeholder="Search events..."
            />
          </div>
          <button className="flex items-center gap-2 text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            <span className="hidden xs:inline">Create with AI</span>
          </button>
          <button className="btn-primary flex items-center gap-2 text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            <span className="hidden xs:inline">New Event</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard label="Total Events" value="24" icon={Calendar} color="text-blue-500" />
          <StatCard label="Total Attendees" value="1,240" icon={Users} color="text-emerald-500" />
          <StatCard label="Revenue" value="₹8.4L" icon={Ticket} color="text-indigo-500" />
          <StatCard label="Pending Leads" value="42" icon={Users} color="text-orange-500" />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#F0F1F7] pb-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView('list')}
            className={cn("text-[13px] font-bold flex items-center gap-2 transition-all pb-4 -mb-[17px] border-b-2", view === 'list' ? "text-brand border-brand" : "text-[#8C90A8] border-transparent hover:text-[#0A0C14]")}
          >
            <List size={16} />
            List View
          </button>
          <button 
            onClick={() => setView('grid')}
            className={cn("text-[13px] font-bold flex items-center gap-2 transition-all pb-4 -mb-[17px] border-b-2", view === 'grid' ? "text-brand border-brand" : "text-[#8C90A8] border-transparent hover:text-[#0A0C14]")}
          >
            <Grid size={16} />
            Grid View
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-[#E4E6EE] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 hover:border-brand/40 hover:shadow-lg transition-all group cursor-pointer">
              <div className={cn("w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-lg relative overflow-hidden", event.color)}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {event.emoji}
              </div>
              <div className="flex-1 min-width-0 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3 mb-1.5">
                  <h3 className="text-[14px] sm:text-[15px] font-extrabold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{event.title}</h3>
                  <StatusBadge status={event.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-[12px] text-[#8C90A8] font-medium">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {event.time}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={12} /> {event.location}</span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-6 lg:gap-10 shrink-0 px-4 lg:px-6 border-x border-[#F0F1F7]">
                <div className="text-center">
                  <div className="text-[15px] lg:text-[17px] font-extrabold text-[#0A0C14]">{event.attendees}</div>
                  <div className="text-[9px] lg:text-[9.5px] font-bold text-[#8C90A8] uppercase tracking-wider">Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-[15px] lg:text-[17px] font-extrabold text-emerald-600">{event.revenue}</div>
                  <div className="text-[9px] lg:text-[9.5px] font-bold text-[#8C90A8] uppercase tracking-wider">Revenue</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0F1F7]">
                <button className="p-2 sm:p-2.5 rounded-xl bg-brand-light text-brand hover:bg-brand hover:text-white transition-all border border-brand/10">
                  <Edit3 size={16} />
                </button>
                <button className="p-2 sm:p-2.5 rounded-xl bg-[#F2F3F7] text-[#4A4E6A] hover:bg-[#E4E6EE] transition-all">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white border border-[#E4E6EE] rounded-3xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className={cn("h-40 flex items-center justify-center text-5xl relative overflow-hidden", event.color)}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 drop-shadow-2xl">{event.emoji}</div>
                <div className="absolute top-4 right-4">
                  <StatusBadge status={event.status} />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-[18px] font-extrabold text-[#0A0C14] mb-3 group-hover:text-brand transition-colors">{event.title}</h3>
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center gap-2.5 text-[13px] text-[#8C90A8] font-medium">
                    <Calendar size={14} className="text-brand" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-[#8C90A8] font-medium">
                    <MapPin size={14} className="text-brand" />
                    {event.location}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-[#F0F1F7]">
                  <div>
                    <div className="text-[17px] font-extrabold text-[#0A0C14]">{event.attendees}</div>
                    <div className="text-[10px] font-bold text-[#8C90A8] uppercase tracking-wider">Attendees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[17px] font-extrabold text-emerald-600">{event.revenue}</div>
                    <div className="text-[10px] font-bold text-[#8C90A8] uppercase tracking-wider">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
    Draft: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    Published: 'bg-blue-50 text-blue-600 border-blue-100',
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
