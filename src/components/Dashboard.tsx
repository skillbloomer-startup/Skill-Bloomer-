import React from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Zap,
  ChevronRight,
  Star,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Good morning, Ankur
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Thursday, March 2025 · <span className="text-emerald-600 font-medium">Platform is live</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white">7D</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">30D</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">90D</button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50">YTD</button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpRight size={12} />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <Zap size={12} fill="white" />
            AI Studio
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Revenue" value="₹34,200" change="+19%" positive />
        <KPICard label="Orders" value="11" subtitle="0 pending" />
        <KPICard label="Students" value="342" change="+28" positive />
        <KPICard label="Courses" value="2" subtitle="2 pending review" />
        <KPICard label="Webinars" value="9" subtitle="6 pending" />
        <KPICard label="CRM Pipeline" value="₹3.2L" subtitle="47 active leads" />
      </div>

      {/* Quick Create */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Quick:</span>
        <QuickButton label="Webinar" primary icon={<Zap size={12} fill="white" />} />
        <QuickButton label="Course" icon={<BookOpen size={13} />} />
        <QuickButton label="Live Class" />
        <QuickButton label="Event" />
        <QuickButton label="+ Add Lead" accent />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500 mt-0.5">Track earnings across all products</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 p-0.5 rounded-lg gap-0.5">
                <button className="px-2.5 py-1 text-[11px] font-medium bg-blue-600 text-white rounded-md">Revenue</button>
                <button className="px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 rounded-md">Students</button>
                <button className="px-2.5 py-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 rounded-md">Orders</button>
              </div>
              <select className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-[11px] font-medium text-gray-600 outline-hidden">
                <option>Last 6 months</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6 mb-5 pb-4 border-b border-gray-100">
            <div>
              <div className="text-lg font-bold text-gray-900">₹1,24,700</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Total this period</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <div className="text-sm font-bold text-emerald-600">+23%</div>
              <div className="text-[11px] text-gray-500 mt-0.5">vs last period</div>
            </div>
            <div className="w-px bg-gray-100" />
            <div>
              <div className="text-sm font-bold text-gray-900">Mar 2025</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Best month</div>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#111827', fontWeight: 500 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Balance Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">Available Balance</div>
            <div className="text-2xl font-bold text-gray-900">₹12,400</div>
            <div className="text-xs text-gray-500 mt-1">
              ₹3,200 <span className="text-amber-600 font-medium">pending</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Withdraw
              </button>
              <button className="py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                History
              </button>
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Course Completion</h3>
              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">94% avg</span>
            </div>
            <div className="space-y-3">
              <ProgressItem label="Python Bootcamp" value={78} color="bg-blue-600" />
              <ProgressItem label="UI/UX Mastery" value={61} color="bg-purple-500" />
              <ProgressItem label="Data Science" value={45} color="bg-emerald-500" />
              <ProgressItem label="Digital Marketing" value={32} color="bg-amber-500" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 p-2.5 rounded-lg text-center">
                <div className="text-base font-bold text-gray-900">4.8<Star size={11} className="inline ml-0.5 text-amber-500 fill-amber-500" /></div>
                <div className="text-[10px] font-medium text-gray-500 mt-0.5">Rating</div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-lg text-center">
                <div className="text-base font-bold text-gray-900">94%</div>
                <div className="text-[10px] font-medium text-gray-500 mt-0.5">Completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
            <div className="flex gap-1">
              <button className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-600 text-white">All</button>
              <button className="px-2.5 py-1 rounded-md text-[11px] font-medium text-gray-500 border border-gray-200">Sales</button>
            </div>
          </div>
          <div className="space-y-3">
            <ActivityItem icon="📚" title="New: Python Bootcamp" meta="Rahul Sharma · 2 min ago" value="+₹4,999" positive />
            <ActivityItem icon="🎯" title="Webinar: React 2025" meta="Priya Kapoor · 14 min ago" value="Free" />
            <ActivityItem icon="💰" title="Payout → HDFC ••4321" meta="Yesterday · 3:42 PM" value="₹8,200" positive />
            <ActivityItem icon="📞" title="CRM Deal Won · ₹42,000" meta="Deepak Joshi · Leadership" value="Won" />
            <ActivityItem icon="🎓" title="Cert issued: UI/UX Design" meta="Sneha Kapoor · 2h ago" value="Cert" />
          </div>
        </div>

        {/* CRM Funnel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">CRM Funnel</h3>
            <button className="text-[11px] font-medium text-white bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
              Open CRM
            </button>
          </div>
          <div className="space-y-2">
            <FunnelStep label="New" count={2} progress={72} color="bg-blue-600" />
            <FunnelStep label="Contacted" count={1} progress={56} color="bg-orange-500" />
            <FunnelStep label="Qualified" count={1} progress={84} color="bg-emerald-500" />
            <FunnelStep label="Proposal" count={1} progress={42} color="bg-purple-500" />
            <FunnelStep label="Negotiation" count={1} progress={30} color="bg-amber-500" />
            <FunnelStep label="Won" count={1} progress={100} color="bg-blue-800" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-bold text-blue-600">₹3.2L</div>
              <div className="text-[10px] font-medium text-gray-500 mt-0.5">Pipeline</div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-sm font-bold text-amber-600">38%</div>
              <div className="text-[10px] font-medium text-gray-500 mt-0.5">Win Rate</div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-[11px] font-medium text-gray-500 mb-2">Today's Follow-ups</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="font-medium text-gray-900">Kavya Nair</span>
                <span className="text-gray-500">· Negotiation</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-medium text-gray-900">Arjun Mehta</span>
                <span className="text-gray-500">· Proposal Sent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Top Students</h3>
            <select className="text-[11px] font-medium bg-transparent border border-gray-200 rounded-lg px-2 py-1 outline-hidden text-gray-600 cursor-pointer">
              <option>This Month</option>
            </select>
          </div>
          <div className="space-y-2">
            <StudentItem rank={1} name="Rahul Sharma" course="Python Bootcamp" score="98%" color="bg-blue-600" />
            <StudentItem rank={2} name="Sneha Kapoor" course="UI/UX Design" score="92%" color="bg-purple-500" />
            <StudentItem rank={3} name="Priya Mehta" course="Data Science" score="87%" color="bg-emerald-500" />
            <StudentItem rank={4} name="Dev Kumar" course="Python Bootcamp" score="81%" color="bg-orange-500" />
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
            <StatMini label="Total" value="342" />
            <StatMini label="New" value="28" color="text-blue-600" />
            <StatMini label="Active" value="94%" color="text-emerald-600" />
            <StatMini label="Rating" value="4.8" color="text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, subtitle, positive }: {
  label: string;
  value: string;
  change?: string;
  subtitle?: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
      <div className="text-[11px] font-medium text-gray-500 mb-1.5">{label}</div>
      <div className="text-xl font-bold text-gray-900 leading-none">{value}</div>
      <div className="mt-2">
        {change ? (
          <span className={cn(
            'text-[11px] font-medium px-1.5 py-0.5 rounded',
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          )}>
            {change}
          </span>
        ) : (
          <span className="text-[11px] text-gray-500">{subtitle}</span>
        )}
      </div>
    </div>
  );
}

function QuickButton({ label, primary, accent, icon }: {
  label: string;
  primary?: boolean;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button className={cn(
      'px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors',
      primary
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : accent
          ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
    )}>
      {icon}
      {label}
    </button>
  );
}

function ProgressItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={cn('font-semibold', color.replace('bg-', 'text-'))}>{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-1000', color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, meta, value, positive }: {
  icon: string;
  title: string;
  meta: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">{title}</div>
        <div className="text-[11px] text-gray-500 mt-0.5">{meta}</div>
      </div>
      <div className={cn(
        'text-xs font-semibold',
        positive ? 'text-emerald-600' : 'text-gray-500'
      )}>
        {value}
      </div>
    </div>
  );
}

function FunnelStep({ label, count, progress, color }: {
  label: string;
  count: number;
  progress: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-[11px] font-medium text-gray-500">{label}</div>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${progress}%` }} />
      </div>
      <div className="w-4 text-xs font-semibold text-gray-700 text-right">{count}</div>
    </div>
  );
}

function StudentItem({ rank, name, course, score, color }: {
  rank: number;
  name: string;
  course: string;
  score: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0',
        rank === 1 ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-500'
      )}>
        {rank}
      </div>
      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0', color)}>
        {name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900 truncate">{name}</div>
        <div className="text-[11px] text-gray-500 truncate">{course} · {score}</div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="text-center">
      <div className={cn('text-sm font-bold', color || 'text-gray-900')}>{value}</div>
      <div className="text-[10px] font-medium text-gray-500">{label}</div>
    </div>
  );
}
