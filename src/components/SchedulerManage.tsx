import React from 'react';
import { Settings, Clock, Globe, Calendar, ChevronRight, Plus, MoreVertical, CheckCircle2, AlertCircle, Trash2, Edit2, Copy } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const meetingTypes = [
  { id: 1, title: '15 Minute Meeting', desc: 'A quick 15 minute discovery call.', duration: '15 min', color: 'bg-blue-500', active: true },
  { id: 2, title: '30 Minute Meeting', desc: 'A standard 30 minute consultation.', duration: '30 min', color: 'bg-purple-500', active: true },
  { id: 3, title: '60 Minute Meeting', desc: 'A deep dive 60 minute session.', duration: '60 min', color: 'bg-emerald-500', active: false },
];

export default function SchedulerManage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Manage Scheduler
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">3 Meeting Types</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Configure your availability and meeting types</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Meeting Type
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
            <h3 className="text-[15px] font-extrabold text-[#0A0C14] mb-6">Active Meeting Types</h3>
            <div className="space-y-4">
              {meetingTypes.map(type => (
                <div key={type.id} className="p-5 rounded-2xl border border-[#E4E6EE] hover:border-brand/30 transition-all group flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-3 h-3 rounded-full", type.color)}></div>
                    <div>
                      <div className="text-[15px] font-extrabold text-[#0A0C14] group-hover:text-brand transition-colors">{type.title}</div>
                      <div className="text-[12px] text-[#8C90A8] font-medium mt-0.5">{type.duration} · Video Call</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg border border-[#E4E6EE] text-[#8C90A8] hover:bg-brand hover:text-white hover:border-brand transition-all">
                      <Copy size={14} />
                    </button>
                    <button className="p-2 rounded-lg border border-[#E4E6EE] text-[#8C90A8] hover:bg-brand hover:text-white hover:border-brand transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-2 rounded-lg border border-[#E4E6EE] text-[#8C90A8] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
            <h3 className="text-[15px] font-extrabold text-[#0A0C14] mb-6">Availability Settings</h3>
            <div className="space-y-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FE] border border-[#F0F2F8]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-[14px] font-extrabold text-[#0A0C14]">{day}</div>
                      <div className="text-[11px] text-[#8C90A8] font-medium">9:00 AM — 5:00 PM</div>
                    </div>
                  </div>
                  <button className="text-[12px] font-bold text-brand hover:underline">Edit</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0A0C14] mb-5">Global Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-[#0A0C14]">Timezone</div>
                <div className="text-[11px] font-bold text-brand bg-brand-light px-2 py-1 rounded-lg">IST (UTC+5:30)</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-[#0A0C14]">Buffer Time</div>
                <div className="text-[11px] font-bold text-brand bg-brand-light px-2 py-1 rounded-lg">15 min</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-[#0A0C14]">Minimum Notice</div>
                <div className="text-[11px] font-bold text-brand bg-brand-light px-2 py-1 rounded-lg">4 hours</div>
              </div>
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-brand/20 text-brand text-[13px] font-bold hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2">
              <Settings size={14} />
              Advanced Settings
            </button>
          </div>

          <div className="bg-linear-to-br from-brand to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-brand/30">
            <h4 className="text-[15px] font-extrabold mb-1">Connect Calendar</h4>
            <p className="text-[12px] text-white/80 mb-4">Sync your Google or Outlook calendar to prevent double bookings.</p>
            <button className="w-full py-2.5 rounded-xl bg-white text-brand text-[13px] font-bold hover:bg-gray-100 transition-all">
              Connect Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
