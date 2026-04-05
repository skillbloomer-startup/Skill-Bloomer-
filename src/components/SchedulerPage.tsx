import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Video, 
  Users, 
  CheckCircle2,
  Globe,
  Settings,
  Sparkles,
  MoreVertical,
  CalendarDays,
  VideoIcon,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const meetings = [
  { id: 1, date: '17 Mar', title: 'Discovery Call — Priya Sharma', time: '10:00 AM', dur: '30 min', platform: 'Zoom', type: 'Free', color: 'border-blue-500 bg-blue-50/50' },
  { id: 2, date: '18 Mar', title: 'Mentorship Session — Rahul Kumar', time: '2:00 PM', dur: '60 min', platform: 'Google Meet', type: '₹999', color: 'border-purple-500 bg-purple-50/50' },
  { id: 3, date: '19 Mar', title: 'Course Consultation — Amit Mishra', time: '11:00 AM', dur: '30 min', platform: 'Zoom', type: '₹499', color: 'border-orange-500 bg-orange-50/50' },
  { id: 4, date: '21 Mar', title: 'Team Session — TechCorp India Ltd', time: '4:00 PM', dur: '60 min', platform: 'Teams', type: 'Custom', color: 'border-emerald-500 bg-emerald-50/50' },
];

export default function SchedulerPage() {
  const [currentMonth, setCurrentMonth] = useState('March 2025');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Scheduler
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">8 Bookings</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage your availability and upcoming appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs">Availability Settings</button>
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Meeting Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E4E6EE] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E4E7F0] hover:bg-brand-light hover:text-brand transition-all shadow-xs">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-[17px] font-black text-[#1A1A2E] min-w-[140px] text-center tracking-tight">
                  {currentMonth}
                </span>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E4E7F0] hover:bg-brand-light hover:text-brand transition-all shadow-xs">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex bg-[#F2F3F7] p-1 rounded-xl gap-1 border border-[#E4E6EE] shadow-xs">
                <button className="px-5 py-1.5 rounded-lg text-[12px] font-bold bg-white text-brand shadow-md shadow-brand/10">Month</button>
                <button className="px-5 py-1.5 rounded-lg text-[12px] font-bold text-[#8C90A8] hover:text-brand transition-colors">Week</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-[#F0F2F8] rounded-2xl overflow-hidden border border-[#F0F2F8] shadow-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-[#F8F9FE] py-3 text-center text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2; // Offset to start on correct day for March 2025
                const isToday = day === 23;
                const isCurrentMonth = day > 0 && day <= 31;
                const hasEvent = [17, 18, 19, 21].includes(day);

                return (
                  <div key={i} className={cn(
                    "bg-white min-h-[100px] p-3 transition-all cursor-pointer hover:bg-brand-light/20 group",
                    !isCurrentMonth && "opacity-30 bg-gray-50",
                    isToday && "bg-blue-50/50"
                  )}>
                    <div className={cn(
                      "text-[13px] font-extrabold w-7 h-7 flex items-center justify-center rounded-xl mb-2 transition-all group-hover:scale-110",
                      isToday ? "bg-brand text-white shadow-lg shadow-brand/30" : "text-[#374151]"
                    )}>
                      {isCurrentMonth ? day : (day <= 0 ? 28 + day : day - 31)}
                    </div>
                    {hasEvent && (
                      <div className="space-y-1.5">
                        <div className="text-[9px] font-black bg-blue-50 text-brand px-2 py-1 rounded-lg truncate border border-blue-100 shadow-xs">
                          10:00 AM Call
                        </div>
                        {day === 21 && (
                          <div className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg truncate border border-emerald-100 shadow-xs">
                            4:00 PM Team
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E4E6EE] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[14px] font-extrabold text-[#1A1A2E] tracking-tight">Upcoming Meetings</h3>
              <button className="text-[11px] font-bold text-brand hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {meetings.map(m => (
                <div key={m.id} className={cn("p-4 rounded-2xl border-l-4 shadow-xs hover:shadow-md transition-all group cursor-pointer", m.color)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[10px] font-black text-brand uppercase tracking-widest">{m.date}</div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{m.type}</span>
                  </div>
                  <div className="text-[13px] font-bold text-[#1A1A2E] mb-2 group-hover:text-brand transition-colors">{m.title}</div>
                  <div className="text-[11px] text-[#8C90A8] flex items-center gap-3 font-medium">
                    <div className="flex items-center gap-1.5"><Clock size={12} className="text-brand" /> {m.time}</div>
                    <div className="flex items-center gap-1.5"><Video size={12} className="text-brand" /> {m.platform}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E4E6EE] rounded-2xl p-5 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#1A1A2E] mb-5 tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-linear-to-br from-brand to-blue-400 rounded-2xl text-white text-[13px] font-bold shadow-lg shadow-brand/20 hover:scale-[1.02] transition-all">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <CalendarIcon size={16} />
                </div>
                Schedule Meeting Now
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-brand-light border border-brand/20 rounded-2xl text-brand text-[13px] font-bold hover:bg-brand/10 transition-all">
                <div className="w-8 h-8 rounded-xl bg-brand/10 flex items-center justify-center">
                  <Plus size={16} />
                </div>
                Create Meeting Type
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-600 text-[13px] font-bold hover:bg-purple-100 transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                AI Meeting Generator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
