import React from 'react';
import { Settings, Building2, GraduationCap, MessageSquare, Briefcase, FileText, Plus, MoreVertical, ChevronRight, Search, Filter } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const stats = [
  { label: 'Total Institutes', value: '420', icon: Building2, color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Programs', value: '150+', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
  { label: 'New Leads', value: '1,240', icon: MessageSquare, color: 'text-orange-600 bg-orange-50' },
  { label: 'Form Submissions', value: '5.2k', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
];

const activities = [
  { id: 1, type: 'Institute', name: 'IIT Bombay', action: 'Updated profile', time: '2h ago' },
  { id: 2, type: 'Lead', name: 'Rahul Sharma', action: 'Responded to query', time: '4h ago' },
  { id: 3, type: 'Form', name: 'Admission 2025', action: 'New submission', time: '5h ago' },
  { id: 4, type: 'Program', name: 'Data Science', action: 'Added new batch', time: 'Yesterday' },
];

export default function CollegeManage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            College & Institute Management
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">Admin View</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Centralized control for all educational modules</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Settings size={16} />
            Global Settings
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Add New Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-[#E4E6EE] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">{stat.value}</div>
            <div className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-extrabold text-[#0A0C14]">Recent Management Activity</h3>
            <button className="text-[12px] font-bold text-brand hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F9FE] border border-[#F0F2F8] hover:border-brand/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand shadow-sm">
                    {act.type === 'Institute' ? <Building2 size={18} /> : 
                     act.type === 'Lead' ? <MessageSquare size={18} /> : 
                     act.type === 'Form' ? <FileText size={18} /> : <GraduationCap size={18} />}
                  </div>
                  <div>
                    <div className="text-[14px] font-extrabold text-[#0A0C14]">{act.name}</div>
                    <div className="text-[11px] text-[#8C90A8] font-medium">{act.action}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[11px] font-bold text-[#8C90A8]">{act.time}</div>
                  <ChevronRight size={16} className="text-[#8C90A8] group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E4E6EE] rounded-3xl p-6 shadow-sm">
          <h3 className="text-[15px] font-extrabold text-[#0A0C14] mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E4E6EE] hover:bg-brand hover:text-white hover:border-brand transition-all group">
              <div className="flex items-center gap-3">
                <Plus size={18} />
                <span className="text-[13px] font-bold">Bulk Import Institutes</span>
              </div>
              <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E4E6EE] hover:bg-brand hover:text-white hover:border-brand transition-all group">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span className="text-[13px] font-bold">Export Lead Data</span>
              </div>
              <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#E4E6EE] hover:bg-brand hover:text-white hover:border-brand transition-all group">
              <div className="flex items-center gap-3">
                <Settings size={18} />
                <span className="text-[13px] font-bold">Form Configuration</span>
              </div>
              <ChevronRight size={16} className="opacity-50 group-hover:opacity-100" />
            </button>
          </div>
          <div className="mt-8 p-5 bg-linear-to-br from-brand to-blue-700 rounded-2xl text-white shadow-xl shadow-brand/30">
            <h4 className="text-[14px] font-extrabold mb-1">Need Help?</h4>
            <p className="text-[11px] text-white/80 mb-4">Check our documentation for advanced management tips.</p>
            <button className="w-full py-2 rounded-xl bg-white text-brand text-[12px] font-bold hover:bg-gray-100 transition-all">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
