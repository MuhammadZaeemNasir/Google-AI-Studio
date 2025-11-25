import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md border-t border-slate-800">
      <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-xl shadow-lg ring-1 ring-white/5 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 min-h-[56px] max-h-[200px] py-4 pl-4 pr-12 resize-none focus:outline-none leading-relaxed rounded-xl scrollbar-hide"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2">
            <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={cn(
                "p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center",
                input.trim() && !isLoading
                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            )}
            >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Send size={20} className={cn(input.trim() && "ml-0.5")} />
            )}
            </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="text-xs text-slate-500">
            Gemini can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;