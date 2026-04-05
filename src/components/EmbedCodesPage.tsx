import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  Globe, 
  Shield, 
  Zap,
  ExternalLink,
  BookOpen,
  FileCode,
  Layout,
  Settings2,
  RefreshCw,
  Eye,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const modules = [
  { id: 'courses', label: 'Courses', icon: '📚', color: 'text-blue-600 bg-blue-50', desc: 'Embed a live course catalogue or individual course pages.' },
  { id: 'webinar', label: 'Webinar', icon: '🎙️', color: 'text-purple-600 bg-purple-50', desc: 'Embed upcoming webinar listings or registration forms.' },
  { id: 'events', label: 'Events', icon: '📅', color: 'text-orange-600 bg-orange-50', desc: 'Display events calendar or RSVP widget on any page.' },
  { id: 'podcast', label: 'Podcast', icon: '🎧', color: 'text-red-600 bg-red-50', desc: 'Embed a podcast player or episode list on your site.' },
];

export default function EmbedCodesPage() {
  const [activeModule, setActiveModule] = useState('courses');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('embed');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#0A0C14] tracking-tight">Embed Codes & API</h1>
          <p className="text-[14px] text-[#8C90A8] mt-0.5 font-medium">Copy ready-to-use embed codes and API snippets for your website</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-xl shadow-xs">
            <BookOpen size={16} />
            Full API Docs
          </button>
        </div>
      </div>

      {/* API Key Card */}
      <div className="bg-white border border-gray-200 rounded-[32px] p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Shield size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Global API Key</div>
              <h3 className="text-[#0A0C14] text-[16px] font-bold tracking-tight">Authenticate all SkillBloomer API calls</h3>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-mono text-[13px] text-brand break-all flex items-center justify-between group hover:bg-gray-100 transition-all">
              <span className="opacity-80 group-hover:opacity-100">sk_live_sb_a7f3d9e2b1c8m4n5o6p7q8r9s0t1u2v3w4x5y6z7</span>
              <RefreshCw size={14} className="text-gray-300 hover:text-brand cursor-pointer transition-colors" />
            </div>
            <button 
              onClick={handleCopy}
              className="bg-brand text-white font-black py-4 px-8 rounded-2xl shrink-0 flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-lg shadow-brand/30 active:scale-95"
            >
              {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
              {copied ? 'Copied to Clipboard' : 'Copy API Key'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge label="Active" color="bg-emerald-50 text-emerald-600 border border-emerald-100" />
            <Badge label="Rate limit: 10k/hr" color="bg-gray-50 text-gray-500 border border-gray-200" />
            <Badge label="REST + WS" color="bg-gray-50 text-gray-500 border border-gray-200" />
            <Badge label="Auto-rotate: Off" color="bg-gray-50 text-gray-500 border border-gray-200" />
          </div>
        </div>
      </div>

      {/* Module Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {modules.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModule(m.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-2xl text-[14px] font-black transition-all whitespace-nowrap border-2",
              activeModule === m.id 
                ? "bg-brand border-brand text-white shadow-xl shadow-brand/20" 
                : "bg-white border-[#E2E5F1] text-[#7880A0] hover:border-brand/30"
            )}
          >
            <span className="text-[18px]">{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Code Panel */}
      <div className="bg-white border border-[#E4E6EE] rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="p-8 border-b border-[#F0F2F9] flex flex-col sm:flex-row sm:items-center gap-6">
          <div className={cn("w-16 h-16 rounded-[20px] flex items-center justify-center text-[32px] shadow-sm", modules.find(m => m.id === activeModule)?.color)}>
            {modules.find(m => m.id === activeModule)?.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-black text-[#141928] tracking-tight">
              {modules.find(m => m.id === activeModule)?.label} Module Integration
            </h3>
            <p className="text-[14px] text-[#8C90A8] font-medium mt-1">
              {modules.find(m => m.id === activeModule)?.desc}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-xl bg-[#F2F4F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all shadow-xs">
              <Settings2 size={18} />
            </button>
            <button className="p-3 rounded-xl bg-[#F2F4F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all shadow-xs">
              <Eye size={18} />
            </button>
          </div>
        </div>

        <div className="bg-[#F8F9FE] px-8 py-4 flex border-b border-[#F0F2F9] gap-6">
          <TabButton active={activeTab === 'embed'} onClick={() => setActiveTab('embed')} label="Embed Code" icon={Layout} />
          <TabButton active={activeTab === 'script'} onClick={() => setActiveTab('script')} label="Script Tag" icon={FileCode} />
          <TabButton active={activeTab === 'api'} onClick={() => setActiveTab('api')} label="API Endpoint" icon={Terminal} />
        </div>

        <div className="relative group">
          <div className="absolute top-6 right-8 flex items-center gap-2">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white/50 transition-colors">HTML / JavaScript</span>
            <button 
              onClick={handleCopy}
              className="p-3 bg-white/10 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-brand hover:scale-110 shadow-lg"
            >
              {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
            </button>
          </div>
          <pre className="p-10 bg-[#0E1117] text-brand font-mono text-[14px] leading-relaxed overflow-x-auto min-h-[240px] flex items-center">
{`<!-- SkillBloomer: ${activeModule.charAt(0).toUpperCase() + activeModule.slice(1)} Widget -->
<div id="sb-${activeModule}"
     data-api-key="sk_live_sb_a7f3d9..."
     data-layout="grid"
     data-limit="12"
     data-theme="light">
</div>`}
          </pre>
        </div>
        
        <div className="p-6 bg-[#F8F9FE] border-t border-[#F0F2F9] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#8C90A8]">
            <Info size={14} />
            <span>Need help with integration?</span>
          </div>
          <button className="text-[12px] font-black text-brand flex items-center gap-1 hover:translate-x-1 transition-transform">
            View Implementation Guide <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, color }: any) {
  return (
    <span className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider", color)}>
      {label}
    </span>
  );
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 py-2 text-[13px] font-black transition-all border-b-2 -mb-[17px]",
        active 
          ? "text-brand border-brand" 
          : "text-[#7880A0] border-transparent hover:text-[#141928]"
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
