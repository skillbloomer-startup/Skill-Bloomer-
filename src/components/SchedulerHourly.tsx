import React from 'react';
import { Clock, ChevronLeft, ChevronRight, Plus, MoreVertical } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const hours = Array.from({ length: 12 }, (_, i) => `${i + 9}:00 AM`);
const days = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27'];

const appointments = [
  { day: 0, hour: 1, title: 'Discovery Call', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { day: 2, hour: 3, title: 'Mentorship', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { day: 4, hour: 0, title: 'Team Sync', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
];

export default function SchedulerHourly() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Hourly Calendar
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">Week View</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Detailed hourly breakdown of your schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Clock size={16} />
            Today
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Event
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-[#F0F2F8]">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[15px] font-bold text-[#0A0C14]">Mar 23 — Mar 27, 2025</span>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex bg-[#F2F3F7] p-1 rounded-xl gap-1 border border-[#E4E6EE]">
            <button className="px-4 py-1.5 rounded-lg text-[12px] font-bold text-[#8C90A8]">Day</button>
            <button className="px-4 py-1.5 rounded-lg text-[12px] font-bold bg-white text-brand shadow-sm">Week</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[80px_repeat(5,1fr)] border-b border-[#F0F2F8]">
              <div className="p-4"></div>
              {days.map((day, i) => (
                <div key={i} className="p-4 text-center border-l border-[#F0F2F8]">
                  <div className="text-[11px] font-black text-[#6878A0] uppercase tracking-wider">{day.split(' ')[0]}</div>
                  <div className="text-[18px] font-black text-[#0A0C14] leading-none mt-1">{day.split(' ')[1]}</div>
                </div>
              ))}
            </div>

            <div className="relative">
              {hours.map((hour, hIdx) => (
                <div key={hIdx} className="grid grid-cols-[80px_repeat(5,1fr)] h-20 border-b border-[#F0F2F8]">
                  <div className="p-2 text-[11px] font-bold text-[#8C90A8] text-right pr-4">{hour}</div>
                  {Array.from({ length: 5 }).map((_, dIdx) => {
                    const appt = appointments.find(a => a.day === dIdx && a.hour === hIdx);
                    return (
                      <div key={dIdx} className="border-l border-[#F0F2F8] p-1 relative group cursor-pointer hover:bg-brand-light/10 transition-colors">
                        {appt && (
                          <div className={cn(
                            "absolute inset-1 rounded-xl p-2 border flex flex-col justify-between shadow-xs transition-transform group-hover:scale-[1.02]",
                            appt.color
                          )}>
                            <div className="text-[11px] font-bold leading-tight truncate">{appt.title}</div>
                            <div className="text-[9px] font-medium opacity-70">45 min</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
