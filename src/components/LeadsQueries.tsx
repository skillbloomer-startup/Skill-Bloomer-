import React from 'react';
import { MessageSquare, Search, Filter, MoreVertical, Plus, User, Mail, Phone, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const leads = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', query: 'Interested in Python Bootcamp', status: 'New', date: '2 min ago', priority: 'High' },
  { id: 2, name: 'Sneha Kapoor', email: 'sneha.k@example.com', phone: '+91 87654 32109', query: 'Course fee for UI/UX Design', status: 'Contacted', date: '14 min ago', priority: 'Medium' },
  { id: 3, name: 'Priya Mehta', email: 'priya.m@example.com', phone: '+91 76543 21098', query: 'Scholarship availability', status: 'Qualified', date: '2h ago', priority: 'High' },
  { id: 4, name: 'Dev Kumar', email: 'dev.k@example.com', phone: '+91 65432 10987', query: 'Batch timings for Data Science', status: 'New', date: 'Yesterday', priority: 'Low' },
];

export default function LeadsQueries() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Leads & Queries
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 shadow-xs">12 New</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage and respond to student inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Filter size={16} />
            Filters
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FE] border-b border-[#E4E6EE]">
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Student</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Query</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Priority</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Date</th>
                <th className="px-6 py-4 text-[11px] font-black text-[#6878A0] uppercase tracking-[0.15em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F1F7]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand-light/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-[13.5px] font-extrabold text-[#0A0C14] leading-tight">{lead.name}</div>
                        <div className="text-[11px] text-[#8C90A8] font-medium">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] text-[#0A0C14] font-medium max-w-xs truncate">{lead.query}</div>
                    <div className="text-[11px] text-[#8C90A8] flex items-center gap-1 mt-0.5">
                      <Phone size={10} />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      lead.status === 'Contacted' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        lead.priority === 'High' ? 'bg-red-500' :
                        lead.priority === 'Medium' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}></div>
                      <span className="text-[12px] font-bold text-[#0A0C14]">{lead.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[12px] font-bold text-[#0A0C14]">{lead.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="w-8 h-8 rounded-lg border border-[#E4E6EE] flex items-center justify-center text-[#8C90A8] hover:bg-brand hover:text-white hover:border-brand transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
