import React from 'react';
import { Plus, Video, Users, Clock, Globe, Calendar, ChevronRight, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const meetingTypes = [
  { id: 1, title: '15 Minute Meeting', desc: 'A quick 15 minute discovery call.', duration: '15 min', color: 'bg-blue-500' },
  { id: 2, title: '30 Minute Meeting', desc: 'A standard 30 minute consultation.', duration: '30 min', color: 'bg-purple-500' },
  { id: 3, title: '60 Minute Meeting', desc: 'A deep dive 60 minute session.', duration: '60 min', color: 'bg-emerald-500' },
];

export default function MeetingCreate() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Create Meeting
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">New Type</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Set up new ways for people to book time with you</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs">View All Types</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-8 shadow-sm">
            <h3 className="text-[16px] font-extrabold text-[#0A0C14] mb-6">Meeting Details</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-[#6878A0] uppercase tracking-wider mb-2">Meeting Name</label>
                <input 
                  className="w-full bg-[#F8F9FE] border border-[#E4E6EE] rounded-2xl py-3.5 px-5 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all" 
                  placeholder="e.g. Discovery Call"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-[#6878A0] uppercase tracking-wider mb-2">Duration</label>
                  <select className="w-full bg-[#F8F9FE] border border-[#E4E6EE] rounded-2xl py-3.5 px-5 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all cursor-pointer">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#6878A0] uppercase tracking-wider mb-2">Location</label>
                  <select className="w-full bg-[#F8F9FE] border border-[#E4E6EE] rounded-2xl py-3.5 px-5 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all cursor-pointer">
                    <option>Google Meet</option>
                    <option>Zoom</option>
                    <option>Phone Call</option>
                    <option>In-person</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-[#6878A0] uppercase tracking-wider mb-2">Description / Instructions</label>
                <textarea 
                  rows={4}
                  className="w-full bg-[#F8F9FE] border border-[#E4E6EE] rounded-2xl py-3.5 px-5 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all resize-none" 
                  placeholder="Tell your invitees what this meeting is about..."
                />
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#F0F2F8] flex justify-end gap-3">
              <button className="px-6 py-3 rounded-xl text-[13px] font-bold text-[#8C90A8] hover:bg-gray-100 transition-all">Cancel</button>
              <button className="btn-primary px-8 py-3 rounded-full text-[13px] shadow-lg shadow-brand/30">Create Meeting Type</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
            <h3 className="text-[14px] font-extrabold text-[#0A0C14] mb-5">Popular Templates</h3>
            <div className="space-y-3">
              {meetingTypes.map(type => (
                <div key={type.id} className="p-4 rounded-2xl border border-[#E4E6EE] hover:border-brand/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-2 h-2 rounded-full", type.color)}></div>
                    <div className="text-[13px] font-bold text-[#0A0C14] group-hover:text-brand transition-colors">{type.title}</div>
                  </div>
                  <div className="text-[11px] text-[#8C90A8] font-medium mb-3">{type.desc}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#6878A0] bg-[#F8F9FE] px-2 py-1 rounded-lg">
                      <Clock size={12} />
                      {type.duration}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#6878A0] bg-[#F8F9FE] px-2 py-1 rounded-lg">
                      <Video size={12} />
                      Video Call
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <Globe size={20} />
            </div>
            <h4 className="text-[15px] font-extrabold text-emerald-900 leading-tight mb-2">Booking Page URL</h4>
            <p className="text-[12px] text-emerald-700 mb-4">Your public booking page is active and ready to share.</p>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-2">
              <div className="text-[11px] font-bold text-emerald-800 truncate">skillbloomer.in/ankur</div>
              <button className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:underline">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
