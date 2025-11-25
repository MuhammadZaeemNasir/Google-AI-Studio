import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex-none h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md z-10 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-violet-600 p-2 rounded-xl shadow-lg border border-white/10">
            <Bot className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
            Gemini Chat
          </h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-medium">gemini-3-pro-preview</span>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs text-slate-300">Powered by Google GenAI</span>
      </div>
    </header>
  );
};

export default Header;