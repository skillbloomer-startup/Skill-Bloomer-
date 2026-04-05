import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserCircle2, 
  ArrowRight, 
  Mail, 
  Lock, 
  Github, 
  Chrome,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/src/lib/utils';

interface AuthPageProps {
  onLogin: (role: 'instructor' | 'learner') => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [role, setRole] = useState<'instructor' | 'learner'>('learner');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[1000px] bg-white rounded-[32px] shadow-2xl shadow-brand/10 border border-[#E8ECF5] overflow-hidden flex flex-col md:flex-row min-h-[600px] relative z-10">
        {/* Left Side - Branding & Info */}
        <div className="w-full md:w-[45%] bg-linear-to-br from-brand to-indigo-700 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-12">
              <Logo size="lg" className="text-white" />
            </div>

            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                {role === 'instructor' ? 'Empower the next generation.' : 'Unlock your full potential.'}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                {role === 'instructor' 
                  ? 'Join thousands of expert instructors and build your digital teaching empire with AI-powered tools.' 
                  : 'Access world-class courses, join a vibrant community, and learn from the best in the industry.'}
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-black"><Zap size={16} /></div>
              <span className="text-sm font-bold">AI-Powered Learning Experience</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Globe size={16} /></div>
              <span className="text-sm font-bold">Global Community of Experts</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#1A1A2E] tracking-tight mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-sm text-[#64748B] font-medium">
                Please select your role to continue
              </p>
            </div>

            {/* Role Selector */}
            <div className="flex bg-[#F0F2F8] p-1 rounded-2xl mb-8">
              <button 
                onClick={() => setRole('learner')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  role === 'learner' ? "bg-white text-brand shadow-sm" : "text-[#64748B] hover:text-brand"
                )}
              >
                <GraduationCap size={18} />
                Learner
              </button>
              <button 
                onClick={() => setRole('instructor')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all",
                  role === 'instructor' ? "bg-white text-brand shadow-sm" : "text-[#64748B] hover:text-brand"
                )}
              >
                <UserCircle2 size={18} />
                Instructor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-12 pl-12 pr-4 bg-[#F8F9FE] border border-[#E8ECF5] rounded-2xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-12 pr-4 bg-[#F8F9FE] border border-[#E8ECF5] rounded-2xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-bold text-brand hover:underline">Forgot password?</button>
                </div>
              )}

              <button 
                type="submit"
                className="w-full h-12 bg-brand text-white rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8ECF5]"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-[#94A3B8] font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="h-12 border border-[#E8ECF5] rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A2E]">
                <Chrome size={18} />
                Google
              </button>
              <button className="h-12 border border-[#E8ECF5] rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-all font-bold text-sm text-[#1A1A2E]">
                <Github size={18} />
                GitHub
              </button>
            </div>

            <p className="text-center mt-8 text-sm text-[#64748B] font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-brand font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
