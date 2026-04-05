import React from 'react';
import { Briefcase, Search, Filter, MoreVertical, Plus, Award, Clock, Users, Zap, CheckCircle2, Star, Sparkles } from 'lucide-react';

const programs = [
  { id: 1, name: 'Full Stack Web Development', company: 'SkillBloomer Academy', duration: '6 Months', rating: 4.9, type: 'Certification', students: '2.5k+', image: 'https://picsum.photos/seed/fsd/400/200' },
  { id: 2, name: 'Digital Marketing Specialist', company: 'Google Partner', duration: '3 Months', rating: 4.8, type: 'Professional', students: '5.2k+', image: 'https://picsum.photos/seed/dm/400/200' },
  { id: 3, name: 'Data Science & Analytics', company: 'IBM Partner', duration: '9 Months', rating: 4.7, type: 'Certification', students: '1.8k+', image: 'https://picsum.photos/seed/ds/400/200' },
  { id: 4, name: 'UI/UX Design Masterclass', company: 'Adobe Partner', duration: '4 Months', rating: 4.9, type: 'Professional', students: '3.1k+', image: 'https://picsum.photos/seed/uiux/400/200' },
];

export default function ProfessionalProgram() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Professional Program
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 shadow-xs">8 Active</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage and browse professional certification programs</p>
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
            New Program
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div key={prog.id} className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row">
            <div className="sm:w-48 h-48 sm:h-auto relative overflow-hidden shrink-0">
              <img src={prog.image} alt={prog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-purple-600/20">
                  {prog.type}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-bold text-[#0A0C14]">{prog.rating}</span>
                  </div>
                  <button className="text-[#8C90A8] hover:text-brand transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h3 className="text-[16px] font-extrabold text-[#0A0C14] leading-tight mb-1">{prog.name}</h3>
                <div className="flex items-center gap-1.5 text-[#8C90A8] mb-4">
                  <Briefcase size={14} />
                  <span className="text-[12px] font-medium">{prog.company}</span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6878A0] bg-[#F8F9FE] px-2 py-1 rounded-lg">
                    <Clock size={12} />
                    {prog.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6878A0] bg-[#F8F9FE] px-2 py-1 rounded-lg">
                    <Users size={12} />
                    {prog.students}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <Award size={12} />
                    Job Guaranteed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-brand text-white text-[13px] font-bold hover:shadow-lg hover:shadow-brand/30 transition-all">
                  Enroll Now
                </button>
                <button className="px-4 py-2.5 rounded-xl border border-[#E4E6EE] text-[#0A0C14] text-[13px] font-bold hover:bg-gray-50 transition-all">
                  Syllabus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
