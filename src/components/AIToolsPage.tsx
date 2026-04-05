import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Sparkles, 
  ExternalLink, 
  Star, 
  Zap, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Code, 
  Globe,
  MoreVertical,
  Cpu
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const aiTools = [
  { 
    id: 1, 
    name: 'Gemini Pro', 
    category: 'LLM', 
    description: 'Google\'s most capable model for highly complex tasks.', 
    rating: 4.9, 
    status: 'Active', 
    icon: Sparkles, 
    color: 'bg-blue-600',
    tags: ['Multimodal', 'Reasoning']
  },
  { 
    id: 2, 
    name: 'Midjourney V6', 
    category: 'Image Generation', 
    description: 'State-of-the-art AI image generation with incredible detail.', 
    rating: 4.8, 
    status: 'Active', 
    icon: ImageIcon, 
    color: 'bg-purple-600',
    tags: ['Art', 'Design']
  },
  { 
    id: 3, 
    name: 'GitHub Copilot', 
    category: 'Coding', 
    description: 'Your AI pair programmer that helps you write code faster.', 
    rating: 4.7, 
    status: 'Active', 
    icon: Code, 
    color: 'bg-slate-900',
    tags: ['Programming', 'Efficiency']
  },
  { 
    id: 4, 
    name: 'ElevenLabs', 
    category: 'Audio', 
    description: 'Prime AI Text to Speech. Generate top-quality lifelike audio.', 
    rating: 4.9, 
    status: 'Active', 
    icon: Zap, 
    color: 'bg-orange-500',
    tags: ['Voice', 'TTS']
  },
  { 
    id: 5, 
    name: 'Runway Gen-2', 
    category: 'Video', 
    description: 'Multi-motion AI video generation from text or images.', 
    rating: 4.6, 
    status: 'Beta', 
    icon: Video, 
    color: 'bg-pink-600',
    tags: ['Video', 'Creative']
  },
  { 
    id: 6, 
    name: 'Perplexity AI', 
    category: 'Search', 
    description: 'AI-powered search engine that provides direct answers with citations.', 
    rating: 4.8, 
    status: 'Active', 
    icon: Globe, 
    color: 'bg-emerald-600',
    tags: ['Research', 'Search']
  }
];

export default function AIToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = aiTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0A0C14] tracking-tight flex items-center gap-3">
            AI Tools Directory
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              {aiTools.length} Tools
            </span>
          </h1>
          <p className="text-[13px] text-[#8C90A8] mt-0.5 font-medium">Explore and manage cutting-edge AI tools for your workflow</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="btn-secondary text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-xl shadow-xs flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden xs:inline">Filters</span>
          </button>
          <button className="btn-primary flex items-center gap-2 text-[12px] sm:text-[13px] py-2 sm:py-2.5 px-3 sm:px-5 rounded-full shadow-brand/30">
            <Plus size={16} strokeWidth={3} />
            <span className="hidden xs:inline">Submit Tool</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C90A8]" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-[#E4E6EE] rounded-2xl py-4 pl-12 pr-4 text-[14px] text-[#0A0C14] outline-hidden focus:border-brand transition-all shadow-sm placeholder:text-[#8C90A8]" 
          placeholder="Search AI tools by name, category, or features..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-[#E4E6EE] rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg", tool.color)}>
                <tool.icon size={24} />
              </div>
              <button className="p-1.5 text-[#8C90A8] hover:text-brand transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[16px] font-extrabold text-[#0A0C14] group-hover:text-brand transition-colors">{tool.name}</h3>
                {tool.status === 'Beta' && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 uppercase">Beta</span>
                )}
              </div>
              <p className="text-[12px] text-[#8C90A8] font-medium line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {tool.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#F0F1F7]">
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[12px] font-bold text-[#0A0C14]">{tool.rating}</span>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-bold text-brand hover:underline">
                Visit Site
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
            <Cpu size={40} />
          </div>
          <h3 className="text-lg font-bold text-[#0A0C14]">No tools found</h3>
          <p className="text-sm text-[#8C90A8]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
