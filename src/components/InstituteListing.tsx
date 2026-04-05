import React from 'react';
import { Building2, Search, Filter, MapPin, Star, MoreVertical, Plus, Sparkles } from 'lucide-react';

const institutes = [
  { id: 1, name: 'Indian Institute of Technology, Bombay', location: 'Mumbai, Maharashtra', rating: 4.9, type: 'Technical', students: '12k+', image: 'https://picsum.photos/seed/iitb/400/200' },
  { id: 2, name: 'Indian Institute of Management, Ahmedabad', location: 'Ahmedabad, Gujarat', rating: 4.8, type: 'Management', students: '5k+', image: 'https://picsum.photos/seed/iima/400/200' },
  { id: 3, name: 'National Institute of Design', location: 'Ahmedabad, Gujarat', rating: 4.7, type: 'Design', students: '2k+', image: 'https://picsum.photos/seed/nid/400/200' },
  { id: 4, name: 'All India Institute of Medical Sciences', location: 'New Delhi', rating: 4.9, type: 'Medical', students: '8k+', image: 'https://picsum.photos/seed/aiims/400/200' },
];

export default function InstituteListing() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Institute Listing
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">420 Institutes</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Manage and browse educational institutions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden xs:inline">Filters</span>
          </button>
          <button className="flex items-center gap-2 text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            <span className="hidden xs:inline">Create with AI</span>
          </button>
          <button className="btn-primary flex items-center gap-2 text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            <span className="hidden xs:inline">Add Institute</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C90A8]" />
        <input 
          className="w-full bg-white border border-[#E4E6EE] rounded-2xl py-4 pl-12 pr-4 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-sm placeholder:text-[#8C90A8]" 
          placeholder="Search by name, location, or type..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {institutes.map((inst) => (
          <div key={inst.id} className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-40 relative overflow-hidden">
              <img src={inst.image} alt={inst.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3">
                <button className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#0A0C14] shadow-sm">
                  <MoreVertical size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 rounded-lg bg-brand text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-brand/20">
                  {inst.type}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-1.5">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[11px] font-bold text-[#0A0C14]">{inst.rating}</span>
                <span className="text-[11px] text-[#8C90A8] font-medium">(120+ reviews)</span>
              </div>
              <h3 className="text-[15px] font-extrabold text-[#0A0C14] leading-tight mb-2 line-clamp-2">{inst.name}</h3>
              <div className="flex items-center gap-1.5 text-[#8C90A8] mb-4">
                <MapPin size={14} />
                <span className="text-[12px] font-medium">{inst.location}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#F0F1F7]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#8C90A8] uppercase tracking-wider">Students</span>
                  <span className="text-[13px] font-extrabold text-[#0A0C14]">{inst.students}</span>
                </div>
                <button className="text-[12px] font-bold text-brand hover:underline">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
