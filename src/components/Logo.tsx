import React from 'react';
import { Infinity, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  variant?: 'default' | 'text-only' | 'glass';
}

export default function Logo({ className, iconOnly = false, size = 'md', onClick, variant = 'default' }: LogoProps) {
  const sizes = {
    sm: { text: 'text-lg', icon: 16, box: 'w-8 h-8 rounded-lg' },
    md: { text: 'text-2xl', icon: 20, box: 'w-10 h-10 rounded-xl' },
    lg: { text: 'text-3xl', icon: 24, box: 'w-12 h-12 rounded-2xl' },
    xl: { text: 'text-5xl', icon: 40, box: 'w-20 h-20 rounded-[32px]' },
  };

  const currentSize = sizes[size];

  if (variant === 'text-only') {
    return (
      <div 
        onClick={onClick}
        className={cn("font-display font-black tracking-tighter text-primary cursor-pointer", currentSize.text, className)}
      >
        Skill<span className="text-foreground">Bloomer</span>
      </div>
    );
  }

  if (variant === 'glass') {
    return (
      <div 
        onClick={onClick}
        className={cn("flex items-center gap-3 group cursor-pointer", className)}
      >
        <div className={cn(
          "relative flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg]",
          currentSize.box,
          "bg-background/10 backdrop-blur-xl border border-border shadow-2xl shadow-primary/20"
        )}>
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-primary/30 to-primary/20 opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.5),_transparent)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]"></div>
          <Infinity size={currentSize.icon + 4} className="text-white stroke-[2.5px] relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
          <Sparkles size={currentSize.icon / 2} className="absolute top-1 right-1 text-accent-yellow animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className={cn("font-display font-black tracking-tighter flex items-center", currentSize.text)}>
          <span className="text-foreground group-hover:text-primary transition-colors duration-500">Skill</span>
          <span className="text-primary ml-1 group-hover:text-foreground transition-colors duration-500">Bloomer</span>
        </div>
      </div>
    );
  }

  if (iconOnly) {
    return (
      <div 
        onClick={onClick}
        className={cn(
        "bg-primary flex items-center justify-center font-black text-primary-foreground shadow-2xl shadow-primary/40 cursor-pointer relative overflow-hidden group",
        currentSize.box,
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/80 to-primary/70 opacity-80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),_transparent)]"></div>
        <Infinity size={currentSize.icon} className="text-primary-foreground stroke-[3px] relative z-10 group-hover:scale-110 transition-transform duration-500" />
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn("flex items-center gap-3 group cursor-pointer", className)}
    >
      <div className={cn(
        "bg-primary flex items-center justify-center font-black text-primary-foreground shadow-2xl shadow-primary/40 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[15deg] relative overflow-hidden",
        currentSize.box
      )}>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/80 to-primary/70 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),_transparent)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <Infinity size={currentSize.icon + 4} className="text-primary-foreground stroke-[3px] relative z-10 drop-shadow-lg" />
      </div>
      <div className={cn("font-display font-black tracking-tighter flex items-center", currentSize.text)}>
        <span className="text-foreground group-hover:text-primary transition-colors duration-500">Skill</span>
        <span className="text-primary ml-1 group-hover:text-foreground transition-colors duration-500">Bloomer</span>
      </div>
    </div>
  );
}
