import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Plus, 
  Search,
  UserPlus,
  Users,
  Radio,
  Filter,
  CheckCircle2,
  Globe,
  Smile,
  Send,
  Bell,
  Home,
  Settings,
  User,
  ArrowLeft,
  Zap,
  Sparkles,
  Shuffle,
  ShieldCheck,
  Clock,
  LogOut,
  ThumbsUp,
  Repeat2,
  Bookmark,
  Briefcase,
  Newspaper,
  MoreVertical,
  ExternalLink,
  Youtube,
  Linkedin,
  MessageCircle,
  X,
  Lock
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const categories = [
  'All', 'Technology', 'Design', 'Marketing', 'Business', 'Personal Growth', 'Health'
];

const instructors = [
  { id: 1, name: 'Dr. Sarah Chen', category: 'Technology', role: 'AI Specialist', avatar: 'SC', followers: '12.4k', following: false, connected: false },
  { id: 2, name: 'Marcus Aurelius', category: 'Business', role: 'Strategy Consultant', avatar: 'MA', followers: '8.2k', following: true, connected: true },
  { id: 3, name: 'Elena Rodriguez', category: 'Design', role: 'UX Lead', avatar: 'ER', followers: '15.1k', following: false, connected: false },
  { id: 4, name: 'James Wilson', category: 'Marketing', role: 'Growth Hacker', avatar: 'JW', followers: '5.6k', following: false, connected: true },
  { id: 5, name: 'Anya Taylor', category: 'Design', role: 'Visual Artist', avatar: 'AT', followers: '3.2k', following: false, connected: false },
  { id: 6, name: 'David Miller', category: 'Technology', role: 'Cloud Architect', avatar: 'DM', followers: '9.8k', following: true, connected: false },
];

const initialPosts = [
  {
    id: 1,
    author: 'Ankur Awasthi',
    role: 'Full-stack Instructor',
    avatar: 'AA',
    time: '2 hours ago',
    content: 'Just finished recording a new module on React Server Components! Can\'t wait to share it with everyone. 🚀 #ReactJS #WebDev',
    image: 'https://picsum.photos/seed/post1/800/400',
    likes: 124,
    comments: 18,
    shares: 5
  },
  {
    id: 2,
    author: 'Dr. Sarah Chen',
    role: 'AI Specialist',
    avatar: 'SC',
    time: '5 hours ago',
    content: 'The future of AI in education is not just about automation, but about personalization at scale. We are building tools that understand student needs better than ever.',
    image: 'https://picsum.photos/seed/post2/800/400',
    likes: 856,
    comments: 42,
    shares: 12
  }
];

const reelsData = [
  {
    id: 1,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-40150-large.mp4',
    author: '@sarah_ai',
    description: 'Exploring the future of AI in 2026! 🚀 #AI #Future #Tech',
    likes: '12.4k',
    comments: '1.2k',
    shares: '450',
    avatar: 'SC'
  },
  {
    id: 2,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-laptop-40149-large.mp4',
    author: '@ankur_dev',
    description: 'Coding my first neural network. It\'s alive! 💻🧠 #Coding #DeepLearning',
    likes: '8.2k',
    comments: '890',
    shares: '210',
    avatar: 'AA'
  },
  {
    id: 3,
    video: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-coffee-shop-40148-large.mp4',
    author: '@marcus_strat',
    description: 'Strategy is about making choices. Choose wisely. 📈 #Business #Strategy',
    likes: '5.1k',
    comments: '450',
    shares: '120',
    avatar: 'MA'
  }
];

interface CommunityPageProps {
  activeTab?: string;
  onNavigate?: (page: string) => void;
}

export default function CommunityPage({ activeTab: initialTab = 'home', onNavigate }: CommunityPageProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [youtubeEnabled, setYoutubeEnabled] = useState(false);
  const [linkedinEnabled, setLinkedinEnabled] = useState(false);
  const [isRandomConnecting, setIsRandomConnecting] = useState(false);
  const [randomMatch, setRandomMatch] = useState<any>(null);
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(`community-${tab}`);
    }
  };

  const handlePostSubmit = () => {
    if (!newPostContent.trim()) return;
    
    const newPost = {
      id: posts.length + 1,
      author: 'Ankur Awasthi',
      role: 'Full-stack Instructor',
      avatar: 'AA',
      time: 'Just now',
      content: newPostContent,
      image: 'https://picsum.photos/seed/newpost/800/400',
      likes: 0,
      comments: 0,
      shares: 0
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const startRandomConnect = () => {
    setIsRandomConnecting(true);
    setRandomMatch(null);
    
    // Simulate finding a match
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * instructors.length);
      setRandomMatch(instructors[randomIndex]);
      setIsRandomConnecting(false);
    }, 2500);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="max-w-7xl mx-auto px-0 md:px-4 py-0 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-6">
            {/* Mobile Sub-navigation for Home */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8ECF5] sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  AA
                </div>
                <h3 className="text-sm font-bold text-[#1A1A2E]">Home Feed</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleTabChange('settings')}
                  className="p-2 rounded-xl bg-gray-50 text-[#64748B] hover:bg-gray-100 transition-all"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>

            {/* Left Sidebar - Profile Summary */}
            <div className="hidden md:block md:col-span-3 space-y-4">
              <div className="card-surface overflow-hidden shadow-sm border border-[#E8ECF5]">
                <div className="h-14 bg-linear-to-r from-brand to-indigo-600"></div>
                <div className="px-4 pb-4 -mt-7 text-center">
                  <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto shadow-md">
                    <div className="w-full h-full rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                      AA
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-[#1A1A2E] hover:underline cursor-pointer">Ankur Awasthi</h3>
                    <p className="text-[10px] text-[#64748B] mt-1">Full-stack Instructor & Content Creator at SkillBloomer</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#E8ECF5] text-left space-y-2">
                    <button 
                      onClick={startRandomConnect}
                      className="w-full py-2.5 bg-brand/10 text-brand rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all shadow-sm"
                    >
                      <Shuffle size={14} />
                      Random Connect
                    </button>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#64748B] group-hover:text-brand transition-colors">Profile viewers</span>
                      <span className="text-[10px] font-bold text-brand">1,240</span>
                    </div>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#64748B] group-hover:text-brand transition-colors">Post impressions</span>
                      <span className="text-[10px] font-bold text-brand">8.5k</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#E8ECF5] text-left">
                    <button className="flex items-center gap-2 text-[10px] font-bold text-[#1A1A2E] hover:bg-gray-50 w-full p-2 rounded-lg transition-all">
                      <Bookmark size={14} className="text-[#64748B]" />
                      My items
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-surface p-4 shadow-sm border border-[#E8ECF5] sticky top-24">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-brand uppercase tracking-wider mb-3">Recent</h4>
                    <div className="space-y-2">
                      {['#ReactJS', '#WebDev', '#AI_Education'].map(tag => (
                        <div key={tag} className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 rounded-lg cursor-pointer transition-all">
                          <span className="text-gray-400">#</span> {tag.replace('#', '')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-brand uppercase tracking-wider mb-3">Groups</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 rounded-lg cursor-pointer transition-all">
                        <Users size={14} className="text-gray-400" /> Full-stack Masters
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 rounded-lg cursor-pointer transition-all">
                        <Users size={14} className="text-gray-400" /> AI Innovators
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="md:col-span-6 space-y-2 md:space-y-4">
              {/* Start a post */}
              <div className="card-surface p-3 md:p-4 shadow-sm border-b md:border border-[#E8ECF5] md:rounded-2xl">
                <div className="flex gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs md:text-sm font-bold text-white shrink-0">
                    AA
                  </div>
                  <button 
                    onClick={() => setIsLiveModalOpen(true)}
                    className="flex-1 bg-gray-50 border border-[#E8ECF5] rounded-full px-4 md:px-5 text-left text-xs md:text-sm font-bold text-[#64748B] hover:bg-gray-100 transition-all"
                  >
                    Start a post
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 px-1 md:px-2">
                  <button className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 md:p-2 rounded-lg transition-all">
                    <ImageIcon size={18} className="text-blue-500" />
                    <span className="hidden sm:inline">Media</span>
                  </button>
                  <button className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 md:p-2 rounded-lg transition-all">
                    <Video size={18} className="text-emerald-500" />
                    <span className="hidden sm:inline">Video</span>
                  </button>
                  <button className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 md:p-2 rounded-lg transition-all">
                    <Briefcase size={18} className="text-purple-500" />
                    <span className="hidden sm:inline">Job</span>
                  </button>
                  <button 
                    onClick={startRandomConnect}
                    className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-[11px] font-bold text-[#64748B] hover:bg-gray-50 p-1.5 md:p-2 rounded-lg transition-all"
                  >
                    <Shuffle size={18} className="text-brand" />
                    <span className="hidden sm:inline">Connect</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-[#E8ECF5]"></div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#64748B]">
                  Sort by: <span className="text-[#1A1A2E] flex items-center gap-1 cursor-pointer">Top <MoreHorizontal size={12} /></span>
                </div>
              </div>

              {/* Posts List */}
              <div className="space-y-2 md:space-y-4">
                {posts.map(post => {
                  const isExpanded = expandedPosts.includes(post.id);
                  const shouldTruncate = post.content.length > 150;
                  const displayContent = isExpanded || !shouldTruncate ? post.content : post.content.substring(0, 150) + '...';

                  return (
                    <div key={post.id} className="card-surface shadow-xs md:shadow-sm border-y md:border border-[#E8ECF5] md:rounded-2xl overflow-hidden">
                      <div className="p-3 md:p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-xs md:text-sm font-bold text-[#1A1A2E] shrink-0">
                              {post.avatar}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[13px] md:text-sm font-bold text-[#1A1A2E] hover:text-brand hover:underline cursor-pointer flex items-center gap-1 truncate">
                                {post.author}
                                <span className="hidden sm:inline text-[10px] font-normal text-[#64748B]">• 1st</span>
                              </h4>
                              <p className="text-[10px] md:text-[11px] text-[#64748B] truncate">{post.role}</p>
                              <p className="text-[9px] md:text-[10px] text-[#64748B] flex items-center gap-1">
                                {post.time} • <Globe size={10} />
                              </p>
                            </div>
                          </div>
                          <button className="p-1.5 md:p-2 rounded-full hover:bg-gray-50 text-[#64748B] transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        <div className="mt-2 md:mt-3 text-[13px] md:text-sm text-[#1A1A2E] leading-relaxed">
                          {displayContent}
                          {shouldTruncate && !isExpanded && (
                            <button 
                              onClick={() => toggleExpand(post.id)}
                              className="ml-1 text-brand font-bold hover:underline"
                            >
                              See more
                            </button>
                          )}
                        </div>
                      </div>
                      {post.image && (
                        <div className="relative aspect-video bg-gray-100 border-y border-[#E8ECF5]">
                          <img src={post.image} alt="Post content" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      <div className="px-3 md:px-4 py-2 flex items-center justify-between border-b border-[#E8ECF5]">
                        <div className="flex items-center -space-x-1">
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-white">
                            <ThumbsUp size={7} className="text-white fill-white" />
                          </div>
                          <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-red-500 flex items-center justify-center ring-2 ring-white">
                            <Heart size={7} className="text-white fill-white" />
                          </div>
                          <span className="ml-1.5 text-[9px] md:text-[10px] text-[#64748B] hover:text-brand hover:underline cursor-pointer">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-[#64748B]">
                          <span className="hover:text-brand hover:underline cursor-pointer">{post.comments} comments</span>
                          <span>•</span>
                          <span className="hover:text-brand hover:underline cursor-pointer">{post.shares} reposts</span>
                        </div>
                      </div>
                      <div className="px-1 md:px-2 py-0.5 md:py-1 flex items-center justify-between">
                        <button className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 md:py-3 rounded-lg text-[#64748B] hover:bg-gray-50 transition-all text-[10px] md:text-sm font-bold group">
                          <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline">Like</span>
                        </button>
                        <button className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 md:py-3 rounded-lg text-[#64748B] hover:bg-gray-50 transition-all text-[10px] md:text-sm font-bold group">
                          <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline">Comment</span>
                        </button>
                        <button className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 md:py-3 rounded-lg text-[#64748B] hover:bg-gray-50 transition-all text-[10px] md:text-sm font-bold group">
                          <Repeat2 size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline">Repost</span>
                        </button>
                        <button className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 md:py-3 rounded-lg text-[#64748B] hover:bg-gray-50 transition-all text-[10px] md:text-sm font-bold group">
                          <Send size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="hidden md:inline">Send</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Sidebar - Discovery & News */}
            <div className="hidden md:block md:col-span-3 space-y-4">
              <div className="card-surface p-4 shadow-sm border border-[#E8ECF5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1A1A2E]">Add to your feed</h3>
                  <button className="p-1 rounded-full hover:bg-gray-50 text-[#64748B]">
                    <ShieldCheck size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {instructors.slice(0, 3).map(inst => (
                    <div key={inst.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-[#1A1A2E] shrink-0">
                        {inst.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#1A1A2E] truncate">{inst.name}</h4>
                        <p className="text-[10px] text-[#64748B] line-clamp-1">{inst.role}</p>
                        <button className="mt-2 px-4 py-1.5 rounded-full border border-[#64748B] text-[#64748B] text-[11px] font-bold hover:bg-gray-50 hover:border-[#1A1A2E] transition-all flex items-center gap-1">
                          <Plus size={14} /> Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-[#64748B] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-center gap-1">
                  View all recommendations <ArrowLeft size={14} className="rotate-180" />
                </button>
              </div>

              <div className="card-surface p-4 shadow-sm border border-[#E8ECF5] sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#1A1A2E]">skillX News</h3>
                  <ShieldCheck size={16} className="text-[#64748B]" />
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'Top 10 React patterns for 2024', time: '1d ago • 1,240 readers' },
                    { title: 'AI in Education: A new frontier', time: '2d ago • 856 readers' },
                    { title: 'The rise of remote learning', time: '3d ago • 2,104 readers' },
                    { title: 'SkillBloomer reaches 1M users', time: '4d ago • 5,600 readers' }
                  ].map((news, i) => (
                    <div key={i} className="group cursor-pointer">
                      <h4 className="text-[11px] font-bold text-[#1A1A2E] group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                        • {news.title}
                      </h4>
                      <p className="text-[10px] text-[#64748B] mt-1 ml-3">{news.time}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-xs font-bold text-[#64748B] hover:bg-gray-50 rounded-lg transition-all flex items-center justify-center gap-1">
                  Show more <ArrowLeft size={14} className="rotate-180" />
                </button>
              </div>

              <div className="px-4 text-center space-y-2">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {['About', 'Accessibility', 'Help Center', 'Privacy & Terms', 'Ad Choices', 'Advertising', 'Business Services'].map(link => (
                    <button key={link} className="text-[10px] text-[#64748B] hover:text-brand hover:underline">{link}</button>
                  ))}
                </div>
                <p className="text-[10px] text-[#64748B] flex items-center justify-center gap-1 mt-4">
                  <span className="font-bold text-brand">SkillBloomer</span> Corporation © 2024
                </p>
              </div>
            </div>
          </div>
        );

      case 'feed':
        return (
          <div className="h-[calc(100vh-64px)] bg-black relative overflow-hidden flex items-center justify-center">
            {/* Futuristic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]"></div>
            </div>

            <div className="relative w-full max-w-[450px] h-full md:h-[90%] md:rounded-[40px] overflow-hidden shadow-2xl shadow-brand/20 border-x md:border border-white/10 bg-[#050505]">
              {/* Video Container */}
              <div className="absolute inset-0">
                <video 
                  key={reelsData[currentReelIndex].id}
                  src={reelsData[currentReelIndex].video}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover opacity-80"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/80"></div>
              </div>

              {/* Futuristic UI Elements */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/10">
                  <button className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-brand shadow-lg shadow-brand/40">Following</button>
                  <button className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">For You</button>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  <Search size={18} />
                </button>
              </div>

              {/* Right Side Actions - Futuristic Floating */}
              <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-brand group-hover:border-brand transition-all shadow-lg">
                    <Heart size={24} className="group-hover:fill-white" />
                  </div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{reelsData[currentReelIndex].likes}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-brand group-hover:border-brand transition-all shadow-lg">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{reelsData[currentReelIndex].comments}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-brand group-hover:border-brand transition-all shadow-lg">
                    <Repeat2 size={24} />
                  </div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">{reelsData[currentReelIndex].shares}</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white group-hover:bg-brand group-hover:border-brand transition-all shadow-lg">
                    <Bookmark size={24} />
                  </div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-tighter">Save</span>
                </div>
              </div>

              {/* Bottom Info - Futuristic Glass */}
              <div className="absolute bottom-6 left-6 right-20 z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand to-purple-600 p-[1px]">
                    <div className="w-full h-full rounded-xl bg-black flex items-center justify-center text-xs font-black text-white">
                      {reelsData[currentReelIndex].avatar}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-1">
                      {reelsData[currentReelIndex].author}
                      <CheckCircle2 size={12} className="text-brand fill-brand text-white" />
                    </h3>
                    <button className="text-[10px] font-bold text-brand uppercase tracking-widest">Follow</button>
                  </div>
                </div>
                <p className="text-[13px] text-white/90 leading-relaxed font-medium line-clamp-2 mb-4">
                  {reelsData[currentReelIndex].description}
                </p>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/5 w-fit">
                  <Sparkles size={12} className="text-brand animate-pulse" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Original Sound - AI Beats</span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                <button 
                  onClick={() => setCurrentReelIndex(prev => (prev - 1 + reelsData.length) % reelsData.length)}
                  className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all pointer-events-auto"
                >
                  <ArrowLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentReelIndex(prev => (prev + 1) % reelsData.length)}
                  className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all pointer-events-auto"
                >
                  <ArrowLeft size={20} className="rotate-180" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className="h-full bg-brand shadow-[0_0_10px_rgba(28,95,255,0.8)] w-1/3"></div>
              </div>
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">My Connections</h2>
                <p className="text-sm text-[#64748B] mt-1">Manage your professional network and pending requests</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input className="sinput w-64 pl-10 bg-white border-[#E2E8F0]" placeholder="Search connections..." />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.filter(i => i.connected).map(inst => (
                <div key={inst.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col items-center text-center space-y-4 group hover:border-brand/30 transition-all shadow-sm">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                    {inst.avatar}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1A1A2E]">{inst.name}</h4>
                    <p className="text-xs text-[#64748B]">{inst.role}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full pt-2">
                    <button className="flex-1 py-2 rounded-xl bg-brand text-white text-[11px] font-bold hover:bg-brand/90 transition-all">Message</button>
                    <button className="p-2 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-all">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">skillX Settings</h2>
              <p className="text-sm text-[#64748B] mt-1">Control your privacy and notification preferences for skillX</p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#1A1A2E] flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Privacy Controls
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A2E]">Public Profile</p>
                      <p className="text-[11px] text-[#64748B]">Allow anyone to see your skillX posts and profile</p>
                    </div>
                    <div className="w-10 h-5 bg-brand rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A2E]">Random Connect</p>
                      <p className="text-[11px] text-[#64748B]">Allow others to find and match with you randomly</p>
                    </div>
                    <div className="w-10 h-5 bg-brand rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Following Section moved into Settings */}
              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#1A1A2E] flex items-center gap-2">
                  <UserPlus size={18} className="text-purple-500" />
                  Following
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {instructors.filter(i => i.following).map(inst => (
                    <div key={inst.id} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white border border-transparent hover:border-brand/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xs font-bold text-[#1A1A2E] shrink-0 shadow-sm">
                        {inst.avatar}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-[#1A1A2E] truncate">{inst.name}</h4>
                        <p className="text-[10px] text-[#64748B] truncate">{inst.role}</p>
                      </div>
                      <button className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-red-50 hover:text-red-600 transition-all group/btn">
                        <CheckCircle2 size={14} className="group-hover/btn:hidden" />
                        <X size={14} className="hidden group-hover/btn:block" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-[#1A1A2E] flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" />
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#64748B]">New Follower Alerts</p>
                    <div className="w-10 h-5 bg-brand rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-[#64748B]">Comments on my posts</p>
                    <div className="w-10 h-5 bg-brand rounded-full relative p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn-primary py-2.5 px-8 text-sm">Save Preferences</button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] flex flex-col">
      {/* Community Toolbar */}
      <div className="h-[64px] bg-white border-b border-[#E8ECF5] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleTabChange('home')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0",
              activeTab === 'home' ? "bg-brand-light text-brand" : "text-[#64748B] hover:bg-gray-50"
            )}
          >
            <Home size={16} /> <span className="hidden xs:inline">Home</span>
          </button>
          <button 
            onClick={() => handleTabChange('feed')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0",
              activeTab === 'feed' ? "bg-brand-light text-brand" : "text-[#64748B] hover:bg-gray-50"
            )}
          >
            <Video size={16} /> <span className="hidden xs:inline">Feed</span>
          </button>
          <button 
            onClick={() => handleTabChange('connections')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0",
              activeTab === 'connections' ? "bg-brand-light text-brand" : "text-[#64748B] hover:bg-gray-50"
            )}
          >
            <Users size={16} /> <span className="hidden xs:inline">Connections</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button 
            onClick={startRandomConnect}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-brand text-white hover:bg-brand/90 transition-all text-xs font-bold shadow-lg shadow-brand/20"
          >
            <Shuffle size={16} />
            <span className="hidden lg:inline">Random Connect</span>
          </button>

          <button 
            onClick={() => setIsGoLiveModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-xs font-bold shadow-lg shadow-red-600/20"
          >
            <Radio size={16} className="animate-pulse" />
            <span className="hidden lg:inline">Go Live</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {renderTabContent()}
      </main>

      {/* Mobile Bottom Navigation for Community */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E8ECF5] flex items-center justify-around px-2 z-50">
        <button 
          onClick={() => handleTabChange('feed')}
          className={cn("flex flex-col items-center gap-1", activeTab === 'feed' ? "text-brand" : "text-[#64748B]")}
        >
          <Video size={20} />
          <span className="text-[10px] font-bold">Feed</span>
        </button>
        <button 
          onClick={() => handleTabChange('connections')}
          className={cn("flex flex-col items-center gap-1", activeTab === 'connections' ? "text-brand" : "text-[#64748B]")}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold">Network</span>
        </button>
        <button 
          onClick={() => handleTabChange('home')}
          className={cn("flex flex-col items-center gap-1", activeTab === 'home' ? "text-brand" : "text-[#64748B]")}
        >
          <Home size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
      </div>

      {/* Random Connect Modal */}
      {isRandomConnecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-brand border-t-transparent animate-spin mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shuffle size={40} className="text-brand animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Finding your match...</h2>
              <p className="text-white/60 text-sm">Searching through thousands of expert instructors</p>
            </div>
          </div>
        </div>
      )}

      {randomMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="h-32 bg-linear-to-br from-brand to-indigo-600 relative">
              <button 
                onClick={() => setRandomMatch(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-8 pb-8 -mt-16 text-center space-y-6">
              <div className="w-32 h-32 rounded-[32px] bg-white p-2 mx-auto shadow-2xl">
                <div className="w-full h-full rounded-[24px] bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                  {randomMatch.avatar}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-2xl font-black text-[#1A1A2E] tracking-tight">{randomMatch.name}</h3>
                  <CheckCircle2 size={20} className="text-blue-500 fill-blue-500/10" />
                </div>
                <p className="text-sm font-bold text-brand">{randomMatch.role}</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-black text-[#1A1A2E]">{randomMatch.followers}</p>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Followers</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="text-lg font-black text-[#1A1A2E]">98%</p>
                    <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">Match</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={startRandomConnect}
                  className="w-full py-4 bg-brand text-white rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Shuffle size={16} /> Try Again
                </button>
                <button 
                  onClick={() => setRandomMatch(null)}
                  className="w-full py-4 bg-gray-50 text-[#64748B] rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Go Live Modal (Post Creation Modal) */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[24px] w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8ECF5] pb-4">
                <h3 className="text-xl font-bold text-[#1A1A2E]">Create a post</h3>
                <button 
                  onClick={() => setIsLiveModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-[#64748B]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  AA
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A2E]">Ankur Awasthi</h4>
                  <button className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#E2E8F0] text-[#64748B] text-[10px] font-bold hover:bg-gray-50 transition-all">
                    <Globe size={12} /> Anyone <MoreHorizontal size={10} className="rotate-90" />
                  </button>
                </div>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full bg-transparent text-lg text-[#1A1A2E] placeholder:text-[#94A3B8] resize-none outline-hidden min-h-[200px]"
              />

              <div className="flex items-center gap-4 pt-4">
                <button className="p-2 rounded-full hover:bg-gray-100 text-[#64748B] transition-all" title="Add a photo">
                  <ImageIcon size={24} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-[#64748B] transition-all" title="Add a video">
                  <Video size={24} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-[#64748B] transition-all" title="Create an event">
                  <Plus size={24} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 text-[#64748B] transition-all" title="More options">
                  <MoreHorizontal size={24} />
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#E8ECF5]">
                <button 
                  onClick={() => {
                    handlePostSubmit();
                    setIsLiveModalOpen(false);
                  }}
                  disabled={!newPostContent.trim()}
                  className="px-6 py-2 bg-brand text-white rounded-full font-bold disabled:opacity-50 disabled:bg-[#E8ECF5] disabled:text-[#94A3B8] transition-all"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actual Go Live Modal */}
      {isGoLiveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-[#1A1A2E] tracking-tight">Go Live</h3>
                <button 
                  onClick={() => setIsGoLiveModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 text-[#64748B]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#64748B]">Session Title</label>
                  <input className="sinput w-full bg-white border-[#E2E8F0]" placeholder="e.g., Q&A on Modern Web Dev" />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-[#64748B]">Stream Integration</label>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-[#E8ECF5]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <Youtube size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A2E]">YouTube Live</p>
                        <p className="text-[10px] text-[#64748B]">Stream to your channel</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setYoutubeEnabled(!youtubeEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        youtubeEnabled ? "bg-red-600" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        youtubeEnabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-[#E8ECF5]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Linkedin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A1A2E]">LinkedIn Live</p>
                        <p className="text-[10px] text-[#64748B]">Stream to your network</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setLinkedinEnabled(!linkedinEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-all duration-300",
                        linkedinEnabled ? "bg-blue-600" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                        linkedinEnabled ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 border-2 border-brand bg-brand-light rounded-3xl flex flex-col items-center gap-3 cursor-pointer">
                    <Globe size={24} className="text-brand" />
                    <span className="text-xs font-bold text-brand">Public</span>
                  </div>
                  <div className="p-5 border-2 border-gray-100 rounded-3xl flex flex-col items-center gap-3 cursor-pointer hover:border-brand/20 transition-all">
                    <Lock size={24} className="text-[#64748B]" />
                    <span className="text-xs font-bold text-[#64748B]">Private</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-red-600 text-white rounded-2xl text-sm font-bold shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                <Radio size={18} className="animate-pulse" /> Start Live Stream
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
