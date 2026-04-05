import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Lock,
  ChevronRight,
  Camera,
  CheckCircle,
  GraduationCap,
  Briefcase,
  MapPin,
  Share2,
  Calendar,
  Key,
  Trash2,
  Globe,
  Mail,
  Phone,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Plus,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  Cpu,
  Database,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type SettingsTab = 
  | 'profile' 
  | 'verification' 
  | 'biography' 
  | 'education' 
  | 'location' 
  | 'social' 
  | 'scheduler' 
  | 'password' 
  | 'ai-config'
  | 'ai-knowledge'
  | 'smtp'
  | 'delete';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Profile Settings</h3>
              <p className="text-xs text-[#64748B]">Update your basic account information and avatar</p>
            </div>
            
            <div className="flex items-center gap-6 p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                  AA
                </div>
                <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button className="btn-primary py-2 px-4 text-xs">Upload New</button>
                  <button className="px-4 py-2 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-gray-100 transition-all">Remove</button>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-medium">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">First Name</label>
                <input className="sinput w-full" defaultValue="Ankur" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Last Name</label>
                <input className="sinput w-full" defaultValue="Awasthi" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Email Address</label>
                <input className="sinput w-full" defaultValue="a.awasthi@skillbloomer.in" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Phone Number</label>
                <input className="sinput w-full" defaultValue="+91 98765 43210" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Save Profile</button>
            </div>
          </div>
        );

      case 'biography':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Biography</h3>
              <p className="text-xs text-[#64748B]">Tell the world about yourself and your expertise</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#475569]">Short Headline</label>
              <input className="sinput w-full" defaultValue="Full-stack instructor specializing in Python and React." />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#475569]">Detailed Bio</label>
              <textarea 
                className="sinput w-full min-h-[200px] resize-none" 
                defaultValue="I have over 10 years of experience in software development and education. I've helped thousands of students transition into tech careers through my courses and mentorship programs. My focus is on practical, project-based learning." 
              />
              <p className="text-[10px] text-[#94A3B8] text-right">0 / 1000 characters</p>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Update Biography</button>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Profile Verification</h3>
              <p className="text-xs text-[#64748B]">Verify your identity to build trust with your students</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Identity Verified</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Your profile was verified on March 15, 2025. You have the "Verified Instructor" badge.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Verification Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-[#E2E8F0] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                      <Shield size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A0C14]">Government ID</p>
                      <p className="text-[10px] text-[#64748B]">Aadhar Card / Passport</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Approved</span>
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center">
                      <Globe size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0A0C14]">Professional Link</p>
                      <p className="text-[10px] text-[#64748B]">LinkedIn / Portfolio</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Approved</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-gray-100 transition-all">Request Re-verification</button>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Education & Experience</h3>
                <p className="text-xs text-[#64748B]">Showcase your academic background and professional journey</p>
              </div>
              <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                <Plus size={14} /> Add New
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={14} className="text-brand" /> Education
                </h4>
                <div className="space-y-3">
                  <EducationItem 
                    school="Indian Institute of Technology, Delhi" 
                    degree="M.Tech in Computer Science" 
                    period="2012 - 2014" 
                  />
                  <EducationItem 
                    school="Delhi Technological University" 
                    degree="B.Tech in Software Engineering" 
                    period="2008 - 2012" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={14} className="text-brand" /> Experience
                </h4>
                <div className="space-y-3">
                  <ExperienceItem 
                    company="SkillBloomer India" 
                    role="Founder & Lead Instructor" 
                    period="2020 - Present" 
                  />
                  <ExperienceItem 
                    company="TechCorp Solutions" 
                    role="Senior Software Engineer" 
                    period="2015 - 2020" 
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Location</h3>
              <p className="text-xs text-[#64748B]">Set your primary location and timezone</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Country</label>
                <select className="sinput w-full">
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">City</label>
                <input className="sinput w-full" defaultValue="New Delhi" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#475569]">Timezone</label>
                <select className="sinput w-full">
                  <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                  <option>(GMT+00:00) London</option>
                  <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Save Location</button>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Social Links</h3>
              <p className="text-xs text-[#64748B]">Connect your social profiles to your public page</p>
            </div>

            <div className="space-y-4">
              <SocialInput icon={Globe} label="Website" placeholder="https://yourwebsite.com" />
              <SocialInput icon={Linkedin} label="LinkedIn" placeholder="https://linkedin.com/in/username" />
              <SocialInput icon={Twitter} label="Twitter" placeholder="https://twitter.com/username" />
              <SocialInput icon={Github} label="GitHub" placeholder="https://github.com/username" />
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Update Links</button>
            </div>
          </div>
        );

      case 'scheduler':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Schedule Meeting Settings</h3>
              <p className="text-xs text-[#64748B]">Configure your availability and booking preferences</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]">
                <div>
                  <p className="text-sm font-bold text-[#0A0C14]">Accept New Bookings</p>
                  <p className="text-[10px] text-[#64748B]">Allow students to book new meetings with you</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-brand relative p-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-white absolute right-1 shadow-sm"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">Default Meeting Duration</label>
                  <select className="sinput w-full">
                    <option>30 Minutes</option>
                    <option>45 Minutes</option>
                    <option>60 Minutes</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569]">Buffer Time Between Meetings</label>
                  <select className="sinput w-full">
                    <option>None</option>
                    <option>15 Minutes</option>
                    <option>30 Minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Save Settings</button>
            </div>
          </div>
        );

      case 'ai-config':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">AI Configuration</h3>
              <p className="text-xs text-[#64748B]">Configure your AI API keys and brand identity for AI generation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">AI API Key</label>
                <input className="sinput w-full" type="password" placeholder="sk-••••••••••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Pass Key</label>
                <input className="sinput w-full" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Brand Assets</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0A0C14]">Brand Logo</p>
                    <button className="text-[10px] font-bold text-brand">Upload</button>
                  </div>
                  <div className="w-full h-24 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-300" />
                  </div>
                </div>
                <div className="p-4 border border-[#E2E8F0] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#0A0C14]">Reference Images</p>
                    <button className="text-[10px] font-bold text-brand">Upload</button>
                  </div>
                  <div className="w-full h-24 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E2E8F0] flex items-center justify-center">
                    <Plus size={24} className="text-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Save AI Config</button>
            </div>
          </div>
        );

      case 'ai-knowledge':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">AI Knowledge Base</h3>
                <p className="text-xs text-[#64748B]">Train your AI with your own documents, videos, and texts</p>
              </div>
              <button className="btn-primary py-2 px-4 text-xs flex items-center gap-2">
                <Plus size={14} /> Add Resource
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <KnowledgeCard icon={FileText} title="Documents" count="12 Files" desc="PDF, DOCX, TXT files for AI training" />
              <KnowledgeCard icon={Globe} title="Text Content" count="45 Articles" desc="Blog posts and course transcripts" />
              <KnowledgeCard icon={Video} title="Videos" count="8 Videos" desc="Recorded lectures and tutorials" />
              <KnowledgeCard icon={Camera} title="Avatar Videos" count="2 Videos" desc="Reference videos for AI avatar generation" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-xs text-blue-700 font-medium">
                Tip: The more quality data you provide, the more accurate your AI assistant will be in representing your teaching style.
              </p>
            </div>
          </div>
        );

      case 'smtp':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">SMTP Settings</h3>
              <p className="text-xs text-[#64748B]">Configure your custom email server for outgoing communications</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">SMTP Host</label>
                <input className="sinput w-full" placeholder="smtp.example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">SMTP Port</label>
                <input className="sinput w-full" placeholder="587" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">SMTP Username</label>
                <input className="sinput w-full" placeholder="user@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">SMTP Password</label>
                <input className="sinput w-full" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#475569]">Encryption</label>
                <select className="sinput w-full">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Save SMTP</button>
              <button className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#64748B] hover:bg-gray-100 transition-all">Test Connection</button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-[#0A0C14] mb-1">Change Password</h3>
              <p className="text-xs text-[#64748B]">Ensure your account is using a long, random password to stay secure</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Current Password</label>
                <input className="sinput w-full" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">New Password</label>
                <input className="sinput w-full" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">Confirm New Password</label>
                <input className="sinput w-full" type="password" placeholder="••••••••" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9]">
              <button className="btn-primary py-2.5 px-8 text-sm">Update Password</button>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="bg-white border border-red-100 rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
            <div>
              <h3 className="text-base font-extrabold text-red-600 mb-1">Delete Account</h3>
              <p className="text-xs text-[#64748B]">Once your account is deleted, all of its resources and data will be permanently deleted.</p>
            </div>

            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-xs text-red-700 font-medium">
                Warning: This action is irreversible. Please download any data you wish to keep before proceeding.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569]">To confirm, type "DELETE" below</label>
                <input className="sinput w-full border-red-200 focus:border-red-500" placeholder="DELETE" />
              </div>
            </div>

            <div className="pt-4 border-t border-red-100">
              <button className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                Permanently Delete Account
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="gpage-hdr">
        <h1 className="text-xl font-extrabold text-[#0A0C14] tracking-tight">Manage Account</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Manage your profile, security, and personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          <SettingsNavItem 
            icon={User} 
            label="Profile Settings" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <SettingsNavItem 
            icon={CheckCircle} 
            label="Profile Verification" 
            active={activeTab === 'verification'} 
            onClick={() => setActiveTab('verification')} 
          />
          <SettingsNavItem 
            icon={Lock} 
            label="Biography" 
            active={activeTab === 'biography'} 
            onClick={() => setActiveTab('biography')} 
          />
          <SettingsNavItem 
            icon={GraduationCap} 
            label="Education & Experience" 
            active={activeTab === 'education'} 
            onClick={() => setActiveTab('education')} 
          />
          <SettingsNavItem 
            icon={MapPin} 
            label="Location" 
            active={activeTab === 'location'} 
            onClick={() => setActiveTab('location')} 
          />
          <SettingsNavItem 
            icon={Share2} 
            label="Social" 
            active={activeTab === 'social'} 
            onClick={() => setActiveTab('social')} 
          />
          <SettingsNavItem 
            icon={Calendar} 
            label="Schedule Meeting" 
            active={activeTab === 'scheduler'} 
            onClick={() => setActiveTab('scheduler')} 
          />
          <div className="h-px bg-[#E2E8F0] my-4"></div>
          <h4 className="px-4 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">Integrations</h4>
          <SettingsNavItem 
            icon={Cpu} 
            label="AI Configuration" 
            active={activeTab === 'ai-config'} 
            onClick={() => setActiveTab('ai-config')} 
          />
          <SettingsNavItem 
            icon={Database} 
            label="AI Knowledge Base" 
            active={activeTab === 'ai-knowledge'} 
            onClick={() => setActiveTab('ai-knowledge')} 
          />
          <SettingsNavItem 
            icon={Send} 
            label="SMTP Settings" 
            active={activeTab === 'smtp'} 
            onClick={() => setActiveTab('smtp')} 
          />
          <div className="h-px bg-[#E2E8F0] my-4"></div>
          <SettingsNavItem 
            icon={Key} 
            label="Password" 
            active={activeTab === 'password'} 
            onClick={() => setActiveTab('password')} 
          />
          <SettingsNavItem 
            icon={Trash2} 
            label="Delete Account" 
            active={activeTab === 'delete'} 
            onClick={() => setActiveTab('delete')} 
            danger
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all group",
        active 
          ? "bg-brand text-white shadow-lg shadow-brand/20 translate-x-1" 
          : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0A0C14]"
      )}
    >
      <Icon size={18} className={cn(
        "transition-transform group-hover:scale-110",
        active ? "text-white" : danger ? "text-red-500" : "text-[#94A3B8]"
      )} />
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight size={14} className={cn(
        "transition-opacity",
        active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
      )} />
    </button>
  );
}

function KnowledgeCard({ icon: Icon, title, count, desc }: any) {
  return (
    <div className="p-4 border border-[#E2E8F0] rounded-2xl group hover:border-brand/30 transition-all cursor-pointer bg-white">
      <div className="flex items-center gap-4 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-gray-400 group-hover:bg-brand/10 group-hover:text-brand transition-all">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A0C14]">{title}</p>
          <p className="text-[11px] text-brand font-bold">{count}</p>
        </div>
      </div>
      <p className="text-[11px] text-[#64748B] leading-relaxed">{desc}</p>
    </div>
  );
}

function EducationItem({ school, degree, period }: any) {
  return (
    <div className="p-4 border border-[#E2E8F0] rounded-2xl flex items-center justify-between group hover:border-brand/30 transition-all bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-gray-400 group-hover:bg-brand/10 group-hover:text-brand transition-all">
          <GraduationCap size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A0C14]">{school}</p>
          <p className="text-[11px] text-[#64748B] font-medium">{degree}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[11px] font-bold text-brand">{period}</p>
        <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[10px] font-bold text-[#94A3B8] hover:text-brand">Edit</button>
          <button className="text-[10px] font-bold text-[#94A3B8] hover:text-red-500">Remove</button>
        </div>
      </div>
    </div>
  );
}

function ExperienceItem({ company, role, period }: any) {
  return (
    <div className="p-4 border border-[#E2E8F0] rounded-2xl flex items-center justify-between group hover:border-brand/30 transition-all bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-gray-400 group-hover:bg-brand/10 group-hover:text-brand transition-all">
          <Briefcase size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#0A0C14]">{company}</p>
          <p className="text-[11px] text-[#64748B] font-medium">{role}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[11px] font-bold text-brand">{period}</p>
        <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-[10px] font-bold text-[#94A3B8] hover:text-brand">Edit</button>
          <button className="text-[10px] font-bold text-[#94A3B8] hover:text-red-500">Remove</button>
        </div>
      </div>
    </div>
  );
}

function SocialInput({ icon: Icon, label, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-[#475569]">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
          <Icon size={16} />
        </div>
        <input className="sinput w-full pl-10" placeholder={placeholder} />
      </div>
    </div>
  );
}
