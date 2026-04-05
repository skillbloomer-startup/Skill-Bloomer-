import React from 'react';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Globe, 
  Database,
  CheckCircle2,
  Plus,
  ArrowRight,
  Settings2,
  ShieldCheck,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const integrations = [
  { id: 1, name: 'Gmail', type: 'Email Automation', desc: 'Automate welcome emails, reminders, and follow-ups via your Gmail account.', icon: Mail, color: 'text-red-500 bg-red-50', connected: true },
  { id: 2, name: 'WhatsApp', type: 'Messaging', desc: 'Send class reminders and support messages directly to student WhatsApp numbers.', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-50', connected: true },
  { id: 3, name: 'LinkedIn', type: 'Social Sharing', desc: 'Share new courses and capture leads from your LinkedIn audience automatically.', icon: Linkedin, color: 'text-blue-600 bg-blue-50', connected: false },
  { id: 4, name: 'Instagram', type: 'Content', desc: 'Auto-post course promotions and student testimonials to your Instagram account.', icon: Instagram, color: 'text-pink-500 bg-pink-50', connected: false },
  { id: 5, name: 'OpenAI', type: 'AI Assistant', desc: 'Power your AI content generator and student chatbot with GPT-4o.', icon: Zap, color: 'text-purple-600 bg-purple-50', connected: true },
  { id: 6, name: 'YouTube', type: 'Video Hosting', desc: 'Upload and manage your course video content directly on YouTube.', icon: Youtube, color: 'text-red-600 bg-red-50', connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            Integrations
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xs">3 Connected</span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Connect your favourite tools and platforms to supercharge SkillBloomer</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-[13px] py-2.5 px-5 rounded-xl shadow-xs">API Documentation</button>
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            Add Custom Webhook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map(item => (
          <div key={item.id} className={cn(
            "bg-white border border-[#E4E6EE] p-6 rounded-2xl flex flex-col justify-between transition-all hover:-translate-y-1.5 hover:shadow-xl group",
            item.connected && "border-emerald-200 shadow-emerald-500/5"
          )}>
            <div>
              <div className="flex items-start justify-between mb-5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform", item.color)}>
                  <item.icon size={28} />
                </div>
                {item.connected ? (
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 shadow-xs uppercase tracking-wider">
                    <ShieldCheck size={12} /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-black px-3 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-100 uppercase tracking-wider">
                    Not connected
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-extrabold text-[#1A1A2E] mb-1 group-hover:text-brand transition-colors">{item.name}</h3>
              <p className="text-[10px] font-black text-brand uppercase tracking-[0.15em] mb-4">{item.type}</p>
              <p className="text-[13px] text-[#8C90A8] leading-relaxed font-medium line-clamp-3">{item.desc}</p>
            </div>
            
            <div className="mt-8 pt-5 border-t border-[#F0F1F7] flex items-center justify-between">
              <button className={cn(
                "px-5 py-2 rounded-xl text-[12px] font-bold transition-all shadow-xs",
                item.connected 
                  ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white" 
                  : "bg-brand text-white hover:bg-brand-dark shadow-md shadow-brand/20"
              )}>
                {item.connected ? 'Disconnect' : 'Connect Now'}
              </button>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg bg-[#F2F3F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all flex items-center justify-center shadow-xs">
                  <Settings2 size={14} />
                </button>
                <button className="w-8 h-8 rounded-lg bg-[#F2F3F7] text-[#4A4E6A] hover:bg-brand-light hover:text-brand transition-all flex items-center justify-center shadow-xs">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-white border-2 border-dashed border-[#C8D5F0] p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[260px] hover:bg-brand-light/20 hover:border-brand transition-all cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl bg-[#F8F9FE] flex items-center justify-center text-[#C8D5F0] group-hover:bg-brand group-hover:text-white transition-all shadow-xs">
            <Plus size={32} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight">Request Integration</h3>
            <p className="text-[12px] text-[#8C90A8] mt-1.5 font-medium">Tell us what tools you use and we'll build it for you!</p>
          </div>
          <button className="text-[12px] font-bold text-brand flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
            Submit Request <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
