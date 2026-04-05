import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Users, 
  DollarSign, 
  Star,
  Trash2,
  ExternalLink,
  Edit3,
  ChevronRight,
  BookOpen,
  Clock,
  Play,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const courses = [
  { id: 1, emoji: '🐍', title: 'Python Bootcamp 2025', meta: '6 weeks · 18 modules', price: '₹4,999', status: 'Published', students: 89, revenue: '₹31,200', rating: '4.8', color: 'bg-blue-600' },
  { id: 2, emoji: '⚛️', title: 'React Workshop — Advanced Hooks', meta: '2 days · 8 modules', price: '₹2,999', status: 'Published', students: 42, revenue: '₹14,700', rating: '4.7', color: 'bg-cyan-500' },
  { id: 3, emoji: '📊', title: 'Data Science & ML Bundle', meta: '8 weeks · 24 modules', price: '₹7,999', status: 'Published', students: 64, revenue: '₹28,400', rating: '4.9', color: 'bg-indigo-500' },
  { id: 4, emoji: '🟢', title: 'Node.js Advanced — Streams & Clusters', meta: '4 weeks · 12 modules', price: '₹3,999', status: 'Draft', students: 0, revenue: '—', rating: '—', color: 'bg-orange-500' },
  { id: 5, emoji: '🎨', title: 'UI/UX Design Mastery', meta: '6 weeks · 20 modules', price: '₹5,499', status: 'Published', students: 38, revenue: '₹12,600', rating: '4.8', color: 'bg-pink-500' },
  { id: 6, emoji: '☁️', title: 'Cloud Computing — AWS & GCP', meta: '10 weeks · 30 modules', price: '₹8,999', status: 'Pending', students: 0, revenue: '—', rating: '—', color: 'bg-orange-600' },
];

export default function CoursesPage() {
  const [view, setView] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">All Courses</h1>
          <p className="text-[13px] text-[#64748B] mt-0.5">Manage and track your educational content</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input 
              className="w-full bg-white border border-[#E2E8F0] rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-xs" 
              placeholder="Search courses by name or tag..."
            />
          </div>
          <select className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-[13px] font-semibold outline-hidden shadow-xs">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Pending</option>
          </select>
          <div className="flex bg-white border border-[#E2E8F0] p-1 rounded-xl gap-1 shadow-xs">
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-lg transition-all", view === 'list' ? "bg-brand text-white shadow-md shadow-brand/20" : "text-[#64748B] hover:bg-brand-light")}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setView('grid')}
              className={cn("p-1.5 rounded-lg transition-all", view === 'grid' ? "bg-brand text-white shadow-md shadow-brand/20" : "text-[#64748B] hover:bg-brand-light")}
            >
              <Grid size={16} />
            </button>
          </div>
          <button className="flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all font-bold">
            <Sparkles size={16} fill="white" />
            Create with AI
          </button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Course
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 flex items-center gap-5 hover:border-brand/40 hover:shadow-lg transition-all group cursor-pointer shadow-sm">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg relative overflow-hidden", course.color)}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {course.emoji}
              </div>
              <div className="flex-1 min-width-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1.5">
                  <h3 className="text-[15px] font-extrabold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={course.status} />
                    <span className="sm:hidden font-bold text-brand text-[12px]">{course.price}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#64748B] font-medium">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {course.meta.split(' · ')[0]}</span>
                  <span className="flex items-center gap-1.5"><BookOpen size={12} /> {course.meta.split(' · ')[1]}</span>
                  <span className="hidden sm:inline font-bold text-brand">{course.price}</span>
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-10 shrink-0 px-6 border-x border-[#F1F5F9]">
                <div className="text-center">
                  <div className="text-[17px] font-extrabold text-[#0A0C14]">{course.students || '—'}</div>
                  <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-wider">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-[17px] font-extrabold text-emerald-600">{course.revenue}</div>
                  <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-wider">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-[17px] font-extrabold text-yellow-500">{course.rating !== '—' ? `⭐ ${course.rating}` : '—'}</div>
                  <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-wider">Rating</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-2.5 rounded-xl bg-brand-light text-brand hover:bg-brand hover:text-white transition-all border border-brand/10">
                  <Edit3 size={16} />
                </button>
                <button className="p-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-all">
                  <ExternalLink size={16} />
                </button>
                <button className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => (
            <div key={course.id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all group cursor-pointer flex flex-col shadow-sm">
              <div className={cn("h-36 flex items-center justify-center relative", course.color)}>
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 z-10">
                  <StatusBadge status={course.status} />
                </div>
                <div className="text-5xl group-hover:scale-110 transition-transform duration-500 z-10 drop-shadow-lg">{course.emoji}</div>
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/30">
                    {course.price}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[15px] font-extrabold text-[#0A0C14] mb-1.5 line-clamp-1 group-hover:text-brand transition-colors">{course.title}</h3>
                <p className="text-[12px] text-[#64748B] mb-5 font-medium flex items-center gap-2">
                  <Clock size={12} /> {course.meta.split(' · ')[0]} · <BookOpen size={12} /> {course.meta.split(' · ')[1]}
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="text-center p-2.5 bg-[#F8F9FE] rounded-xl border border-[#E2E8F0]">
                    <div className="text-[15px] font-extrabold text-[#0A0C14]">{course.students || '0'}</div>
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Students</div>
                  </div>
                  <div className="text-center p-2.5 bg-[#F8F9FE] rounded-xl border border-[#E2E8F0]">
                    <div className="text-[15px] font-extrabold text-emerald-600">{course.revenue === '—' ? '₹0' : course.revenue}</div>
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Revenue</div>
                  </div>
                  <div className="text-center p-2.5 bg-[#F8F9FE] rounded-xl border border-[#E2E8F0]">
                    <div className="text-[15px] font-extrabold text-yellow-500">{course.rating !== '—' ? course.rating : '0.0'}</div>
                    <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Rating</div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 py-2.5 rounded-xl bg-brand text-white text-[12px] font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-2">
                    <Play size={12} fill="white" /> Manage
                  </button>
                  <button className="p-2.5 rounded-xl bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] transition-all">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Published: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Draft: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    Pending: 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return (
    <span className={cn(
      "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs",
      styles[status] || 'bg-gray-50 text-gray-600 border-gray-100'
    )}>
      {status}
    </span>
  );
}
