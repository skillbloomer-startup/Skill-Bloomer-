import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Check, 
  Users, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Crown,
  Star,
  Gem,
  CheckCircle2,
  Info,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const plans = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: '₹499', 
    period: '/mo', 
    members: '680', 
    icon: Star,
    color: 'text-slate-500 bg-slate-50', 
    features: ['5 Course Seats', 'Email Support', 'Basic Analytics', 'skillX Access', 'Standard Hosting'] 
  },
  { 
    id: 'pro', 
    name: 'Pro', 
    price: '₹1,499', 
    period: '/mo', 
    members: '1,240', 
    icon: Crown,
    color: 'text-brand bg-brand-light/30', 
    badge: 'Most Popular',
    features: ['Unlimited Courses', 'Priority Support', 'Advanced Analytics', 'Custom Branding', 'AI Tools Access', 'Premium Hosting'] 
  },
  { 
    id: 'elite', 
    name: 'Elite', 
    price: '₹2,999', 
    period: '/mo', 
    members: '620', 
    icon: Gem,
    color: 'text-purple-600 bg-purple-50', 
    features: ['Everything in Pro', 'White-label Portal', 'API Access', 'Dedicated Manager', 'Custom Domain', 'Enterprise Security'] 
  },
];

export default function MembershipPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#0A0C14] tracking-tight">Membership Plans</h1>
          <p className="text-[14px] text-[#8C90A8] mt-0.5 font-medium">Manage subscription plans, member benefits, and billing cycles</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#F2F4F7] p-1 rounded-xl shadow-inner">
            <button className="px-5 py-2 rounded-lg text-[12px] font-bold bg-white text-[#141928] shadow-sm transition-all">Monthly</button>
            <button className="px-5 py-2 rounded-lg text-[12px] font-bold text-[#7880A0] hover:text-[#141928] transition-all flex items-center gap-1.5">
              Yearly <span className="text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-md">-20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatMini label="Active Members" value="2,840" trend="+124" color="text-purple-600" icon={Users} />
        <StatMini label="MRR" value="₹8.4L" trend="+18%" color="text-brand" icon={TrendingUp} />
        <StatMini label="ARR" value="₹1.01Cr" trend="On track" color="text-emerald-600" icon={ShieldCheck} />
        <StatMini label="Renewals" value="186" sub="Next 30d" color="text-orange-500" icon={CreditCard} />
        <StatMini label="Churn" value="3.2%" trend="-0.8%" color="text-red-600" icon={Info} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        {plans.map(plan => (
          <div key={plan.id} className={cn(
            "bg-white border border-[#E4E6EE] p-8 rounded-[32px] flex flex-col relative transition-all hover:-translate-y-2 hover:shadow-2xl group",
            plan.badge && "border-brand ring-4 ring-brand/5 shadow-brand/10"
          )}>
            {plan.badge && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white text-[11px] font-black px-5 py-1.5 rounded-full shadow-lg shadow-brand/30 uppercase tracking-widest">
                {plan.badge}
              </div>
            )}
            
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform", plan.color)}>
              <plan.icon size={28} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-[20px] font-extrabold text-[#141928] mb-1 group-hover:text-brand transition-colors">{plan.name}</h3>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className={cn("text-[36px] font-black tracking-tighter", plan.id === 'pro' ? "text-brand" : "text-[#141928]")}>
                {plan.price}
              </span>
              <span className="text-[14px] text-[#7880A0] font-bold">{plan.period}</span>
            </div>

            <div className="bg-[#F8F9FE] rounded-2xl p-4 mb-8 flex items-center justify-between border border-[#F0F1F7] group-hover:border-brand/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs">
                  <Users size={18} className="text-brand" />
                </div>
                <div>
                  <div className={cn("text-[18px] font-black leading-none", plan.id === 'pro' ? "text-brand" : "text-[#141928]")}>{plan.members}</div>
                  <div className="text-[10px] text-[#7880A0] font-black uppercase tracking-wider mt-0.5">Active Members</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-[#C8D5F0]" />
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3.5 text-[13px] font-semibold text-[#4A4E6A]">
                  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-xs", plan.id === 'pro' ? "bg-brand text-white" : "bg-emerald-50 text-emerald-600")}>
                    <Check size={12} strokeWidth={4} />
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <button className={cn(
              "w-full py-4 rounded-2xl text-[14px] font-black transition-all flex items-center justify-center gap-2 group/btn shadow-lg",
              plan.id === 'pro' 
                ? "bg-brand text-white hover:bg-brand-dark shadow-brand/20" 
                : "bg-[#F2F4F7] text-[#141928] hover:bg-[#E4E6EE]"
            )}>
              Select {plan.name} Plan
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatMini({ label, value, trend, sub, color, icon: Icon }: any) {
  return (
    <div className="bg-white border border-[#E4E6EE] p-5 rounded-2xl shadow-xs hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-black text-[#7880A0] uppercase tracking-widest">{label}</div>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity", color.replace('text-', 'bg-').replace('600', '50').replace('brand', 'brand-light/30'))}>
          <Icon size={16} />
        </div>
      </div>
      <div className={cn("text-[22px] font-black tracking-tight", color)}>{value}</div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
          {trend || sub}
        </span>
        <span className="text-[10px] text-[#8C90A8] font-medium">vs last month</span>
      </div>
    </div>
  );
}
