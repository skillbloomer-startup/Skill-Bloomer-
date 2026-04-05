import React from 'react';
import { GraduationCap, Search, Filter, MapPin, Star, MoreVertical, Plus, BookOpen, Clock, Users, Sparkles } from 'lucide-react';

const programs = [
  { id: 1, name: 'Master of Science in Data Science', university: 'Stanford University', duration: '2 Years', rating: 4.9, type: 'Full-time', students: '1.2k+', image: 'https://picsum.photos/seed/msds/400/200' },
  { id: 2, name: 'MBA in Strategic Management', university: 'Harvard Business School', duration: '18 Months', rating: 4.8, type: 'Executive', students: '3.5k+', image: 'https://picsum.photos/seed/mba/400/200' },
  { id: 3, name: 'MA in International Relations', university: 'Oxford University', duration: '1 Year', rating: 4.7, type: 'Full-time', students: '2.1k+', image: 'https://picsum.photos/seed/mair/400/200' },
  { id: 4, name: 'M.Tech in Artificial Intelligence', university: 'IIT Delhi', duration: '2 Years', rating: 4.9, type: 'Research', students: '800+', image: 'https://picsum.photos/seed/mtech/400/200' },
];

export default function MastersHigherEd() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Masters & Higher Ed
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">150+ Programs</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage and browse advanced degree programs</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Add Program
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-48 relative overflow-hidden">
              <img src={prog.image} alt={prog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3">
                <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#0A0C14] shadow-sm">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20">
                  {prog.type}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-1.5">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[11px] font-bold text-[#0A0C14]">{prog.rating}</span>
                <span className="text-[11px] text-[#8C90A8] font-medium">(450+ reviews)</span>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#0A0C14] leading-tight mb-1 line-clamp-2">{prog.name}</h3>
              <div className="flex items-center gap-1.5 text-[#8C90A8] mb-4">
                <GraduationCap size={14} />
                <span className="text-[12px] font-medium">{prog.university}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#F0F1F7]">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#8C90A8]" />
                  <span className="text-[12px] font-bold text-[#0A0C14]">{prog.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-[#8C90A8]" />
                  <span className="text-[12px] font-bold text-[#0A0C14]">{prog.students}</span>
                </div>
              </div>
              <button className="w-full mt-5 py-2.5 rounded-xl bg-brand/5 text-brand text-[13px] font-bold hover:bg-brand hover:text-white transition-all">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
