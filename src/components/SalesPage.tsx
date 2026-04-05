import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  BarChart3,
  Users,
  ChevronRight,
  MoreVertical,
  Edit3,
  Trash2,
  FileText,
  Building2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const transactions = [
  { id: 1, type: 'Sale', item: 'Python Bootcamp 2025', amount: '+₹4,999', date: 'Today, 10:24 AM', status: 'Completed', color: 'text-emerald-600' },
  { id: 2, type: 'Payout', item: 'Bank Withdrawal', amount: '-₹12,000', date: 'Yesterday, 04:15 PM', status: 'Processing', color: 'text-red-500' },
  { id: 3, type: 'Sale', item: 'React Workshop', amount: '+₹2,999', date: 'Oct 20, 2025', status: 'Completed', color: 'text-emerald-600' },
  { id: 4, type: 'Commission', item: 'Affiliate Sale', amount: '+₹450', date: 'Oct 18, 2025', status: 'Completed', color: 'text-emerald-600' },
];

export default function SalesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">Sales & Finance</h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5">Track your revenue, payouts, and commissions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-primary flex items-center gap-2 text-[13px] py-2.5 px-5 rounded-full shadow-brand/30">
            <ArrowDownLeft size={16} strokeWidth={3} />
            Request Payout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="₹4.2L" icon={DollarSign} color="text-emerald-500" />
        <StatCard label="Available Balance" value="₹84,200" icon={Wallet} color="text-blue-500" />
        <StatCard label="Pending Payouts" value="₹12,000" icon={CreditCard} color="text-orange-500" />
        <StatCard label="Sales Growth" value="+24%" icon={TrendingUp} color="text-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E4E6EE] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-5 border-b border-[#F0F1F7] flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-[#0A0C14]">Recent Transactions</h2>
              <button className="text-xs font-bold text-brand hover:underline">View All</button>
            </div>
            <div className="divide-y divide-[#F0F1F7]">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", 
                    tx.type === 'Sale' ? "bg-emerald-50 text-emerald-600" : 
                    tx.type === 'Payout' ? "bg-red-50 text-red-50" : 
                    "bg-blue-50 text-blue-600"
                  )}>
                    {tx.type === 'Sale' ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div className="flex-1 min-width-0">
                    <h3 className="text-[14px] font-bold text-[#0A0C14] truncate group-hover:text-brand transition-colors">{tx.item}</h3>
                    <p className="text-[11px] text-[#8C90A8] font-medium">{tx.type} · {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-[14px] font-extrabold", tx.color)}>{tx.amount}</div>
                    <div className="text-[10px] font-bold text-[#8C90A8] uppercase tracking-wider">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#E4E6EE] p-5 rounded-2xl shadow-xs">
            <h2 className="text-[15px] font-extrabold text-[#0A0C14] mb-4">Banking Details</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-[#E4E6EE] bg-[#F8F9FE]">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 size={16} className="text-brand" />
                  <span className="text-[13px] font-bold text-[#0A0C14]">HDFC Bank</span>
                </div>
                <div className="text-[12px] text-[#8C90A8] font-medium">Account: **** 4582</div>
                <div className="text-[12px] text-[#8C90A8] font-medium">IFSC: HDFC0001245</div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-dashed border-brand/40 text-brand text-[12px] font-bold hover:bg-brand-light transition-all">
                Update Bank Details
              </button>
            </div>
          </div>

          <div className="bg-linear-to-br from-indigo-600 to-blue-500 p-5 rounded-2xl shadow-xl shadow-indigo-600/20 text-white">
            <h2 className="text-[15px] font-extrabold mb-1">Commission Setup</h2>
            <p className="text-[11px] text-white/70 mb-4">Configure your affiliate and referral rates</p>
            <div className="text-3xl font-extrabold mb-4">15% <span className="text-sm font-normal text-white/60">avg. rate</span></div>
            <button className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[12px] font-bold transition-all">
              Manage Rates
            </button>
          </div>
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
