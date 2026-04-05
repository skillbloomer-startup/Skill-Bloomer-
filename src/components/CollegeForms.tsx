import React from 'react';
import { FileText, Search, Filter, MoreVertical, Plus, Calendar, CheckCircle2, Clock, AlertCircle, Download, Eye, Trash2 } from 'lucide-react';

const forms = [
  { id: 1, name: 'Admission Form 2025-26', college: 'IIT Bombay', submissions: 1240, status: 'Active', date: '12 Mar 2025', type: 'Admission' },
  { id: 2, name: 'Scholarship Application', college: 'IIM Ahmedabad', submissions: 850, status: 'Active', date: '15 Mar 2025', type: 'Scholarship' },
  { id: 3, name: 'Hostel Registration', college: 'BITS Pilani', submissions: 420, status: 'Closed', date: '10 Mar 2025', type: 'Registration' },
  { id: 4, name: 'Entrance Exam Form', college: 'AIIMS Delhi', submissions: 3100, status: 'Active', date: '18 Mar 2025', type: 'Exam' },
];

export default function CollegeForms() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            College Forms
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">24 Active</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage and track college application forms</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Filter size={16} />
            Filters
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Create Form
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {forms.map((form) => (
          <div key={form.id} className="bg-white border border-[#E4E6EE] rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                form.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'
              }`}>
                <FileText size={20} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-lg text-[#8C90A8] hover:bg-brand hover:text-white transition-all">
                  <Eye size={14} />
                </button>
                <button className="p-1.5 rounded-lg text-[#8C90A8] hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h3 className="text-[15px] font-extrabold text-[#0A0C14] leading-tight mb-1">{form.name}</h3>
            <div className="text-[12px] text-[#8C90A8] font-medium mb-4">{form.college}</div>
            <div className="space-y-3 pt-4 border-t border-[#F0F1F7]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider">Submissions</span>
                <span className="text-[13px] font-extrabold text-[#0A0C14]">{form.submissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider">Status</span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  form.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-600 border border-gray-100'
                }`}>
                  {form.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider">Deadline</span>
                <span className="text-[12px] font-bold text-[#0A0C14]">{form.date}</span>
              </div>
            </div>
            <button className="w-full mt-5 py-2.5 rounded-xl border border-brand/20 text-brand text-[13px] font-bold hover:bg-brand hover:text-white transition-all flex items-center justify-center gap-2">
              <Download size={14} />
              Download Data
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
