import React from 'react';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  Video, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Star,
  CheckCircle2,
  Clock,
  DollarSign,
  Zap,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/src/lib/utils';

const data = [
  { name: 'Oct', revenue: 18400, students: 42, orders: 14 },
  { name: 'Nov', revenue: 22100, students: 58, orders: 18 },
  { name: 'Dec', revenue: 31500, students: 91, orders: 25 },
  { name: 'Jan', revenue: 19800, students: 67, orders: 15 },
  { name: 'Feb', revenue: 28700, students: 88, orders: 22 },
  { name: 'Mar', revenue: 34200, students: 112, orders: 28 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-tight">
            Good morning, Ankur 👋
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Thursday, March 2025 · <span className="text-emerald-600 font-semibold">Platform is live</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
            <button className="px-3 py-1.5 text-[11.5px] font-bold bg-brand text-white">7D</button>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-[#64748B] hover:bg-gray-50">30D</button>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-[#64748B] hover:bg-gray-50">90D</button>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-[#64748B] hover:bg-gray-50">YTD</button>
          </div>
          <button className="btn-secondary flex items-center gap-2 text-xs py-2">
            <ArrowUpRight size={12} strokeWidth={3} />
            Export
          </button>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 rounded-full px-5 shadow-brand/40">
            <Zap size={14} fill="white" />
            AI Studio
          </button>
        </div>
      </div>

      {/* KPI Grid - 6 cards as per HTML */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Revenue - Light Card */}
        <div className="bg-white border border-brand/20 rounded-2xl p-4 relative overflow-hidden cursor-pointer group hover:shadow-md transition-all">
          <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-brand/5"></div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-brand mb-2">Revenue</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">₹34,200</div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">↑ 19%</span>
          </div>
          <div className="absolute bottom-2.5 right-3 opacity-30">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <polyline points="0,18 8,12 16,14 24,6 32,8 40,2" stroke="#1C5FFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-all shadow-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Orders</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">11</div>
          <div className="mt-2 text-[10.5px] font-bold text-brand">11 total · 0 pending</div>
          <div className="absolute bottom-2.5 right-3 opacity-10">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <polyline points="0,14 10,10 20,12 30,4 40,6" stroke="#1C5FFF" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-all shadow-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Students</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">342</div>
          <div className="mt-2 text-[10.5px] font-bold text-emerald-600">↑ 28 this week</div>
          <div className="absolute bottom-2.5 right-3 opacity-10">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <polyline points="0,16 8,14 16,10 24,8 32,6 40,2" stroke="#00A36C" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:shadow-md transition-all shadow-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#64748B] mb-2">Courses</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">2</div>
          <div className="mt-2 text-[10.5px] font-bold text-[#64748B]">2 pending review</div>
          <div className="absolute bottom-2.5 right-3 opacity-10">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <rect x="2" y="8" width="36" height="4" rx="2" fill="#F5C518"/>
              <rect x="8" y="4" width="24" height="4" rx="2" fill="#F5C518"/>
            </svg>
          </div>
        </div>

        {/* Webinars - Yellow Card */}
        <div className="bg-[#FFFBE6] border border-[#F5E080] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="text-[9px] font-bold uppercase tracking-widest text-[#B8860B] mb-2">Webinars</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">9</div>
          <div className="mt-2 text-[10.5px] font-bold text-[#B8860B]">6 pending</div>
          <div className="absolute bottom-2.5 right-3 opacity-25">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <circle cx="20" cy="10" r="8" stroke="#F5C518" strokeWidth="2"/>
              <polyline points="16,7 16,13 24,10" fill="#F5C518"/>
            </svg>
          </div>
        </div>

        {/* CRM Pipeline - Brand Light Card */}
        <div className="bg-linear-to-br from-[#EEF3FF] to-[#E0EBFF] border border-[#C0D0FF] rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="text-[9px] font-bold uppercase tracking-widest text-brand mb-2">CRM Pipeline</div>
          <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight leading-none">₹3.2L</div>
          <div className="mt-2 text-[10.5px] font-bold text-brand flex items-center gap-1">47 active leads <ChevronRight size={10} /></div>
          <div className="absolute bottom-2.5 right-3 opacity-30">
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <polyline points="0,18 8,12 16,14 24,6 32,8 40,2" stroke="#1C5FFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Create Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-bold text-[#7880A0] uppercase tracking-wider whitespace-nowrap">Quick Create:</span>
        <button className="btn-primary py-2 px-5 rounded-full text-[12.5px] flex items-center gap-2 whitespace-nowrap shadow-brand/30">
          <Zap size={12} fill="white" /> Webinar
        </button>
        <button className="bg-white border border-gray-200 text-[#0A0C14] px-5 py-2 rounded-full text-[12.5px] font-bold flex items-center gap-2 hover:bg-gray-50 transition-all whitespace-nowrap">
          <BookOpen size={14} /> Course
        </button>
        <button className="btn-secondary py-2 px-5 rounded-full text-[12.5px] whitespace-nowrap">Live Class</button>
        <button className="btn-secondary py-2 px-5 rounded-full text-[12.5px] whitespace-nowrap">Event</button>
        <button className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-5 py-2 rounded-full text-[12.5px] font-bold hover:bg-yellow-100 transition-all whitespace-nowrap">+ Add Lead</button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#0A0C14]">Revenue Overview</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Track earnings across all products</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-[#F1F5F9] p-1 rounded-xl gap-1">
                <button className="px-3 py-1.5 text-[11px] font-bold bg-brand text-white rounded-lg">Revenue</button>
                <button className="px-3 py-1.5 text-[11px] font-semibold text-[#64748B] hover:text-brand">Students</button>
                <button className="px-3 py-1.5 text-[11px] font-semibold text-[#64748B] hover:text-brand">Orders</button>
              </div>
              <select className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold outline-hidden">
                <option>Last 6 months</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6 mb-6 pb-4 border-b border-[#F1F5F9]">
            <div>
              <div className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight">₹1,24,700</div>
              <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1">Total this period</div>
            </div>
            <div className="w-px bg-[#F1F5F9]"></div>
            <div>
              <div className="text-base font-extrabold text-emerald-600">↑ 23%</div>
              <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1">vs last period</div>
            </div>
            <div className="w-px bg-[#F1F5F9]"></div>
            <div>
              <div className="text-base font-extrabold text-[#0A0C14]">Mar 2025</div>
              <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider mt-1">Best month</div>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1C5FFF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1C5FFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px',
                    color: '#0A0C14',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  itemStyle={{ color: '#0A0C14', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1C5FFF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-3.5">
          {/* Balance Card - Light */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-brand/5"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-12 rounded-full bg-yellow-400/5"></div>
            
            <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-widest mb-3">Available Balance</div>
            <div className="text-[26px] font-extrabold text-[#0A0C14] tracking-tight">₹12,400</div>
            <div className="text-[11.5px] text-[#64748B] mt-1">
              ₹3,200 <span className="text-yellow-600 font-bold">pending</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="btn-primary py-2 rounded-xl text-xs font-bold shadow-brand/20 hover:scale-105">
                Withdraw
              </button>
              <button className="btn-secondary py-2 rounded-xl text-xs font-bold">
                History
              </button>
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 flex-1 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12.5px] font-extrabold text-[#0A0C14]">Course Completion</h3>
              <span className="text-[10.5px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">94% avg</span>
            </div>
            
            <div className="space-y-3.5">
              <ProgressItem label="Python Bootcamp" value={78} color="bg-brand" />
              <ProgressItem label="UI/UX Mastery" value={61} color="bg-purple-500" />
              <ProgressItem label="Data Science" value={45} color="bg-emerald-500" />
              <ProgressItem label="Digital Marketing" value={32} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#F1F5F9]">
              <div className="bg-[#F1F5F9] p-2.5 rounded-xl text-center">
                <div className="text-[17px] font-extrabold text-[#0A0C14]">4.8<Star size={12} className="inline ml-0.5 text-yellow-500 fill-yellow-500" /></div>
                <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-wider">Rating</div>
              </div>
              <div className="bg-[#F1F5F9] p-2.5 rounded-xl text-center">
                <div className="text-[17px] font-extrabold text-[#0A0C14]">94%</div>
                <div className="text-[9.5px] font-bold text-[#64748B] uppercase tracking-wider">Completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Recent Activity */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-extrabold text-[#0A0C14]">Recent Activity</h3>
            <div className="flex gap-1.5">
              <button className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-brand text-white">All</button>
              <button className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold text-[#64748B] border border-[#E2E8F0]">Sales</button>
            </div>
          </div>
          <div className="space-y-3.5">
            <ActivityItem 
              icon="📚" 
              title="New: Python Bootcamp" 
              meta="Rahul Sharma · 2 min ago" 
              value="+₹4,999" 
              isPositive={true} 
            />
            <ActivityItem 
              icon="🎯" 
              title="Webinar: React 2025" 
              meta="Priya Kapoor · 14 min ago" 
              value="Free" 
            />
            <ActivityItem 
              icon="💰" 
              title="Payout → HDFC ••4321" 
              meta="Yesterday · 3:42 PM" 
              value="₹8,200" 
              isPositive={true} 
            />
            <ActivityItem 
              icon="📞" 
              title="CRM Deal Won · ₹42,000" 
              meta="Deepak Joshi · Leadership" 
              value="Won 🏆" 
              isYellow={true}
            />
            <ActivityItem 
              icon="🎓" 
              title="Cert issued: UI/UX Design" 
              meta="Sneha Kapoor · 2h ago" 
              value="Cert" 
              isBrand={true}
            />
          </div>
        </div>

        {/* CRM Funnel Snapshot */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-extrabold text-[#0A0C14]">CRM Funnel</h3>
            <button className="text-[11px] font-bold text-white bg-linear-to-br from-blue-700 to-brand px-3 py-1 rounded-full shadow-md shadow-brand/20">Open CRM</button>
          </div>
          <div className="space-y-2.5">
            <FunnelStep label="New" count={2} progress={72} color="bg-brand" />
            <FunnelStep label="Contacted" count={1} progress={56} color="bg-orange-500" />
            <FunnelStep label="Qualified" count={1} progress={84} color="bg-emerald-500" />
            <FunnelStep label="Proposal" count={1} progress={42} color="bg-purple-500" />
            <FunnelStep label="Negotiation" count={1} progress={30} color="bg-yellow-500" />
            <FunnelStep label="Won" count={1} progress={100} color="bg-brand-dark" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-[#F1F5F9]">
            <div className="bg-brand-light p-3 rounded-xl">
              <div className="text-[15px] font-extrabold text-brand">₹3.2L</div>
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Pipeline</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl">
              <div className="text-[15px] font-extrabold text-yellow-600">38%</div>
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Win Rate</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-[#F1F5F9] rounded-xl">
            <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Today's Follow-ups</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-[11.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                <span className="font-bold text-[#0A0C14]">Kavya Nair</span>
                <span className="text-[#64748B]">· Negotiation</span>
              </div>
              <div className="flex items-center gap-2 text-[11.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                <span className="font-bold text-[#0A0C14]">Arjun Mehta</span>
                <span className="text-[#64748B]">· Proposal Sent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-extrabold text-[#0A0C14]">Top Students</h3>
            <select className="text-[11px] font-semibold bg-transparent border border-[#E2E8F0] rounded-lg px-2 py-1 outline-hidden cursor-pointer">
              <option>This Month</option>
            </select>
          </div>
          <div className="space-y-2.5">
            <StudentItem rank={1} name="Rahul Sharma" course="Python Bootcamp" score="98%" color="bg-brand" />
            <StudentItem rank={2} name="Sneha Kapoor" course="UI/UX Design" score="92%" color="bg-purple-500" />
            <StudentItem rank={3} name="Priya Mehta" course="Data Science" score="87%" color="bg-emerald-500" />
            <StudentItem rank={4} name="Dev Kumar" course="Python Bootcamp" score="81%" color="bg-orange-500" />
          </div>
          <div className="flex justify-between mt-5 pt-4 border-t border-[#F1F5F9]">
            <StatMini label="Total" value="342" />
            <StatMini label="New" value="28" color="text-brand" />
            <StatMini label="Active" value="94%" color="text-emerald-600" />
            <StatMini label="Rating" value="4.8★" color="text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend, subValue, isPositive, isDark, isYellow, isBrand, icon: Icon }: any) {
  return (
    <div className={cn(
      "p-4 rounded-2xl transition-all cursor-pointer relative overflow-hidden",
      isDark ? "bg-white border border-brand/20" : "bg-white border border-[#E2E8F0] hover:shadow-md",
      isYellow && "bg-[#FFFBE6] border-[#F5E080]",
      isBrand && "bg-brand-light border-brand/20"
    )}>
      <div className={cn(
        "text-[9px] font-bold uppercase tracking-widest mb-2",
        isDark ? "text-brand" : isYellow ? "text-[#B8860B]" : isBrand ? "text-brand" : "text-[#64748B]"
      )}>
        {label}
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div className="text-xl font-extrabold tracking-tight text-[#0A0C14]">{value}</div>
        {Icon && <Icon size={16} className="opacity-20 mb-1" />}
      </div>
      <div className="mt-2 relative z-10">
        {trend ? (
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          )}>
            {trend}
          </span>
        ) : (
          <span className={cn(
            "text-[10px] font-bold",
            isYellow ? "text-[#B8860B]" : isBrand ? "text-brand" : "text-[#64748B]"
          )}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}

function ProgressItem({ label, value, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold mb-1.5">
        <span className="text-[#0A0C14]">{label}</span>
        <span className={cn("font-extrabold", color.replace('bg-', 'text-'))}>{value}%</span>
      </div>
      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, meta, value, isPositive, isBrand }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-width-0">
        <div className="text-xs font-bold text-[#0A0C14] truncate">{title}</div>
        <div className="text-[10px] text-[#64748B] mt-0.5">{meta}</div>
      </div>
      <div className={cn(
        "text-xs font-extrabold",
        isPositive ? "text-emerald-600" : isBrand ? "text-brand" : "text-[#B8860B]"
      )}>
        {value}
      </div>
    </div>
  );
}

function FunnelStep({ label, count, progress, color }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-[10px] font-bold text-[#64748B] uppercase">{label}</div>
      <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="w-4 text-[11px] font-extrabold text-right">{count}</div>
    </div>
  );
}

function StudentItem({ rank, name, course, score, color }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
        rank === 1 ? "bg-yellow-400 text-black" : "bg-[#E2E8F0] text-[#64748B]"
      )}>
        {rank}
      </div>
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0", color)}>
        {name.split(' ').map((n: any) => n[0]).join('')}
      </div>
      <div className="flex-1 min-width-0">
        <div className="text-xs font-bold text-[#0A0C14] truncate">{name}</div>
        <div className="text-[10px] text-[#64748B] truncate">{course} · {score}</div>
      </div>
      {rank === 1 && <span className="text-yellow-500">🏆</span>}
    </div>
  );
}

function StatMini({ label, value, color }: any) {
  return (
    <div className="text-center">
      <div className={cn("text-sm font-black", color || "text-[#0A0C14]")}>{value}</div>
      <div className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">{label}</div>
    </div>
  );
}
