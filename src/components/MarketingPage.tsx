import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp,
  Mail,
  Linkedin,
  Megaphone,
  Link as LinkIcon,
  Tag,
  Plus,
  BarChart3,
  Users,
  MousePointer2,
  ChevronRight,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const campaigns = [
  { id: 1, icon: Megaphone, title: 'Summer Sale 2025', type: 'Paid Campaign', reach: '45k', clicks: '2.4k', conversion: '3.2%', status: 'Active', color: 'bg-blue-600' },
  { id: 2, icon: Mail, title: 'Weekly Newsletter #42', type: 'Email Campaign', reach: '12k', clicks: '1.1k', conversion: '8.5%', status: 'Sent', color: 'bg-emerald-500' },
  { id: 3, icon: Linkedin, title: 'B2B Outreach - Q4', type: 'LinkedIn', reach: '2.5k', clicks: '450', conversion: '12%', status: 'Active', color: 'bg-indigo-600' },
  { id: 4, icon: Tag, title: 'Early Bird Discount', type: 'Coupons', reach: '—', clicks: '850 uses', conversion: '—', status: 'Active', color: 'bg-pink-500' },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">Marketing Center</h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5">Manage your campaigns, trackers, and promotions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reach" value="124k" icon={Users} color="text-blue-500" />
        <StatCard label="Total Clicks" value="8.2k" icon={MousePointer2} color="text-emerald-500" />
        <StatCard label="Avg. Conversion" value="4.8%" icon={TrendingUp} color="text-indigo-500" />
        <StatCard label="Active Ads" value="12" icon={Megaphone} color="text-orange-500" />
      </div>

      <div className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#F0F1F7] flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-[#0A0C14]">Recent Campaigns</h2>
          <button className="text-xs font-bold text-brand hover:underline">View All</button>
        </div>
        <div className="divide-y divide-[#F0F1F7]">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0", campaign.color)}>
                <campaign.icon size={18} />
              </div>
              <div className="flex-1 min-width-0">
                <h3 className="text-[14px] font-bold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{campaign.title}</h3>
                <p className="text-[11px] text-[#8C90A8] font-medium">{campaign.type}</p>
              </div>
              <div className="hidden md:flex items-center gap-8 shrink-0 px-4">
                <div className="text-center">
                  <div className="text-[14px] font-bold text-[#0A0C14]">{campaign.reach}</div>
                  <div className="text-[9px] font-bold text-[#8C90A8] uppercase tracking-wider">Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-bold text-[#0A0C14]">{campaign.clicks}</div>
                  <div className="text-[9px] font-bold text-[#8C90A8] uppercase tracking-wider">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-[14px] font-bold text-emerald-600">{campaign.conversion}</div>
                  <div className="text-[9px] font-bold text-[#8C90A8] uppercase tracking-wider">Conv.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={campaign.status} />
                <button className="p-2 text-[#8C90A8] hover:text-brand transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-[#E4E6EE] p-5 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2 rounded-xl bg-gray-50", color)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-[#0A0C14] tracking-tight">{value}</div>
      <div className="text-[11px] font-bold text-[#8C90A8] uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Sent: 'bg-blue-50 text-blue-600 border-blue-100',
    Draft: 'bg-yellow-50 text-yellow-600 border-yellow-100',
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
