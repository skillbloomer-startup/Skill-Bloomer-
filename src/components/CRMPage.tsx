import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  ArrowUpDown,
  Tag,
  Flag,
  Clock,
  ChevronRight,
  User,
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const stageColors: Record<string, string> = {
  New: 'bg-blue-50 text-blue-600 border-blue-100',
  Contacted: 'bg-orange-50 text-orange-600 border-orange-100',
  Qualified: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Proposal: 'bg-purple-50 text-purple-600 border-purple-100',
  Negotiation: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  Won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Lost: 'bg-red-50 text-red-600 border-red-100',
};

const leads = [
  { id: 1, name: 'Priya Verma', email: 'priya.v@techcorp.in', phone: '+91 98100 11223', company: 'TechCorp India', role: 'Head of L&D', stage: 'Qualified', value: 72000, source: 'LinkedIn', priority: 'High', course: 'Python Bootcamp', lastContact: '2 days ago', tags: ['Enterprise', 'VIP'] },
  { id: 2, name: 'Arjun Mehta', email: 'arjun@startupxyz.com', phone: '+91 97200 44556', company: 'StartupXYZ', role: 'Co-Founder', stage: 'Proposal', value: 48000, source: 'Referral', priority: 'High', course: 'Product Management', lastContact: 'Yesterday', tags: ['Startup', 'Hot'] },
  { id: 3, name: 'Sneha Kapoor', email: 'sneha.k@gmail.com', phone: '+91 90000 77889', company: 'Designcraft Studio', role: 'Lead Designer', stage: 'Contacted', value: 14999, source: 'Organic', priority: 'Medium', course: 'UI/UX Design', lastContact: '3 days ago', tags: ['Design', 'Individual'] },
  { id: 4, name: 'Ravi Kumar', email: 'ravi@infosystems.co', phone: '+91 88001 23456', company: 'InfoSystems Co', role: 'L&D Manager', stage: 'New', value: 55000, source: 'Event', priority: 'High', course: 'Data Science Bundle', lastContact: 'Today', tags: ['Corporate', 'New'] },
  { id: 5, name: 'Kavya Nair', email: 'kavya.n@eduhub.org', phone: '+91 77002 98765', company: 'EduHub NGO', role: 'Program Manager', stage: 'Negotiation', value: 29800, source: 'Email', priority: 'Medium', course: 'Digital Marketing', lastContact: 'Today', tags: ['NGO', 'Active'] },
];

export default function CRMPage() {
  const [view, setView] = useState<'kanban' | 'table'>('table');
  const [localLeads, setLocalLeads] = useState(leads);

  const updateLeadStage = (id: number, newStage: string) => {
    setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            CRM Pipeline
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">25 active leads</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage leads and track your sales funnel progress</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white border border-[#E4E6EE] p-1 rounded-xl gap-1 shadow-xs">
            <button 
              onClick={() => setView('kanban')}
              className={cn("px-5 py-2 rounded-lg text-[12px] font-bold transition-all", view === 'kanban' ? "bg-brand text-white shadow-md shadow-brand/20" : "text-[#8C90A8] hover:bg-brand-light")}
            >
              Kanban
            </button>
            <button 
              onClick={() => setView('table')}
              className={cn("px-5 py-2 rounded-lg text-[12px] font-bold transition-all", view === 'table' ? "bg-brand text-white shadow-md shadow-brand/20" : "text-[#8C90A8] hover:bg-brand-light")}
            >
              Table
            </button>
          </div>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Add Lead
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Leads" value="25" trend="+12 this month" isDark />
        <StatCard label="Pipeline" value="₹3.2L" sub="active deals" isBrand />
        <StatCard label="Won" value="₹1.3L" sub="6 deals" isSuccess />
        <StatCard label="Win Rate" value="38%" trend="↑ 5% vs last" isYellow />
        <StatCard label="Avg Deal" value="₹22k" sub="per closed deal" />
        <StatCard label="Follow Today" value="5" sub="due today" isDanger />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C90A8]" />
          <input 
            className="w-full bg-white border border-[#E4E6EE] rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-xs" 
            placeholder="Search by name, company, email, course..."
          />
        </div>
        <select className="bg-white border border-[#E4E6EE] rounded-xl px-4 py-2.5 text-[13px] font-semibold outline-hidden shadow-xs">
          <option>All Stages</option>
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="bg-white border border-[#E4E6EE] rounded-xl px-4 py-2.5 text-[13px] font-semibold outline-hidden shadow-xs">
          <option>All Sources</option>
          <option>LinkedIn</option>
          <option>Referral</option>
          <option>Organic</option>
          <option>Event</option>
          <option>Email</option>
        </select>
        <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs">Reset Filters</button>
      </div>

      {view === 'table' ? (
        <div className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FE] border-b border-[#E4E6EE]">
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider">Lead Information</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider">Company & Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider">Pipeline Stage</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider">Deal Value</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#6878A0] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F1F7]">
                {localLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-[#F8F9FE] transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-light text-brand flex items-center justify-center text-[12px] font-bold uppercase border border-brand/10 group-hover:bg-brand group-hover:text-white transition-all">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-[#141928] group-hover:text-brand transition-colors">{lead.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lead.tags.map(tag => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold uppercase tracking-tighter border border-gray-200">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-[#1A2035]">
                        <Building2 size={12} className="text-brand" />
                        {lead.company}
                      </div>
                      <div className="text-[11px] text-[#7880A0] font-medium ml-5">{lead.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={lead.stage}
                        onChange={(e) => updateLeadStage(lead.id, e.target.value)}
                        className={cn(
                          "text-[10px] font-bold px-3 py-1 rounded-full border shadow-xs outline-hidden cursor-pointer transition-all",
                          stageColors[lead.stage]
                        )}
                      >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] font-extrabold text-[#141928]">₹{lead.value.toLocaleString()}</div>
                      <div className="text-[10px] text-[#7880A0] font-bold uppercase tracking-wider">{lead.source}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full shadow-xs", lead.priority === 'High' ? 'bg-red-500 shadow-red-500/50' : 'bg-yellow-500 shadow-yellow-500/50')}></div>
                        <span className="text-[12px] font-bold text-[#3D4466]">{lead.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton icon={Calendar} color="text-purple-600 bg-purple-50 hover:bg-purple-600 hover:text-white" title="Schedule Meeting" />
                        <ActionButton icon={Phone} color="text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white" />
                        <ActionButton icon={Mail} color="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white" />
                        <ActionButton icon={MoreVertical} color="text-gray-400 hover:bg-gray-100" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-none">
          {stages.map(stage => (
            <div key={stage} className="w-[300px] shrink-0 space-y-4">
              <div className={cn("flex items-center justify-between p-4 rounded-2xl border shadow-sm", stageColors[stage])}>
                <span className="text-[11px] font-extrabold uppercase tracking-widest">{stage}</span>
                <span className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-black">{localLeads.filter(l => l.stage === stage).length}</span>
              </div>
              <div className="space-y-3.5">
                {localLeads.filter(l => l.stage === stage).map(lead => (
                  <div key={lead.id} className="bg-white border border-[#E4E6EE] p-4 rounded-2xl space-y-4 hover:border-brand hover:shadow-xl transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center text-[12px] font-bold uppercase border border-brand/10 group-hover:bg-brand group-hover:text-white transition-all">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-width-0">
                        <div className="text-[13px] font-bold text-[#141928] truncate group-hover:text-brand transition-colors">{lead.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.tags.map(tag => (
                            <span key={tag} className="text-[8px] px-1 py-0.5 bg-gray-50 text-gray-500 rounded-md font-bold uppercase tracking-tighter border border-gray-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[16px] font-black text-[#141928] tracking-tight">₹{lead.value.toLocaleString()}</div>
                      <div className="flex gap-1.5">
                        {lead.priority === 'High' && <Flag size={14} className="text-red-500 fill-red-500" />}
                        <Tag size={14} className="text-brand" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#F0F1F7]">
                      <div className="text-[10.5px] text-[#8C90A8] font-bold flex items-center gap-1.5">
                        <Clock size={12} className="text-brand" /> {lead.lastContact}
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all" title="Schedule Meeting"><Calendar size={14} /></button>
                        <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><Phone size={14} /></button>
                        <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"><Mail size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-[#C8D5F0] rounded-2xl text-[12px] text-[#9199B0] font-bold hover:bg-brand-light hover:text-brand hover:border-brand transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Add New Lead
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, trend, sub, isDark, isBrand, isSuccess, isYellow, isDanger }: any) {
  return (
    <div className={cn(
      "p-4 rounded-2xl transition-all relative overflow-hidden shadow-xs",
      isDark ? "bg-white border border-brand/20" : "bg-white border border-[#E4E6EE]",
      isBrand && "bg-brand-light border-brand/20",
      isSuccess && "bg-emerald-50 border-emerald-100",
      isYellow && "bg-yellow-50 border-yellow-100",
      isDanger && "bg-red-50 border-red-100"
    )}>
      <div className={cn(
        "text-[9px] font-bold uppercase tracking-widest mb-2",
        isDark ? "text-brand" : isBrand ? "text-brand" : isSuccess ? "text-emerald-600" : isYellow ? "text-yellow-600" : isDanger ? "text-red-600" : "text-[#8C90A8]"
      )}>
        {label}
      </div>
      <div className="text-[22px] font-black tracking-tight leading-none text-[#0A0C14]">{value}</div>
      <div className={cn(
        "text-[10.5px] font-bold mt-2",
        isDark ? "text-emerald-600" : isBrand ? "text-brand" : isSuccess ? "text-emerald-600" : isYellow ? "text-yellow-600" : isDanger ? "text-red-600" : "text-[#8C90A8]"
      )}>
        {trend || sub}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, color, title }: any) {
  return (
    <button className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-xs", color)} title={title}>
      <Icon size={14} />
    </button>
  );
}
