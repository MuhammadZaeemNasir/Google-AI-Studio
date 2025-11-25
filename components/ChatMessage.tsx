import React, { useMemo } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '../types';
import { cn } from '../utils/cn';

interface ChatMessageProps {
  message: Message;
}

// Simple parser to handle code blocks and paragraphs
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = useMemo(() => {
    // Split by code blocks
    const split = text.split(/(```[\s\S]*?```)/g);
    return split.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const content = part.slice(3, -3).replace(/^.*\n/, ''); // Try to remove lang line
        return (
          <div key={index} className="my-4 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/50">
            <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-xs text-slate-400 border-b border-slate-800">
              <span>Code</span>
            </div>
            <pre className="overflow-x-auto p-4 text-sm font-mono text-slate-200">
              <code>{content.trim()}</code>
            </pre>
          </div>
        );
      }
      // Handle bold text and paragraphs
      return (
        <div key={index} className="whitespace-pre-wrap leading-7">
          {part.split('\n').map((line, i) => (
             <React.Fragment key={i}>
                {line.split(/(\*\*.*?\*\*)/g).map((segment, j) => {
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={j} className="font-bold text-white">{segment.slice(2, -2)}</strong>;
                    }
                    return segment;
                })}
                {i < part.split('\n').length - 1 && <br />}
             </React.Fragment>
          ))}
        </div>
      );
    });
  }, [text]);

  return <>{parts}</>;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex w-full gap-4 px-4 py-6 sm:px-6 hover:bg-slate-800/20 transition-colors",
        isModel ? "bg-slate-900/30" : "bg-transparent"
      )}
    >
      <div className="flex-none flex flex-col items-center gap-1">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/10",
            isModel
              ? "bg-indigo-600 text-white"
              : "bg-slate-700 text-slate-200"
          )}
        >
          {isModel ? <Bot size={18} /> : <User size={18} />}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">
            {isModel ? 'Gemini' : 'You'}
          </span>
          {isModel && !message.isStreaming && !message.isError && (
             <button
               onClick={handleCopy}
               className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
               title="Copy response"
             >
                {copied ? <Check size={14} /> : <Copy size={14} />}
             </button>
          )}
        </div>

        <div className={cn("text-base text-slate-300 font-light", message.isError && "text-red-400")}>
           {message.text ? (
             <FormattedText text={message.text} />
           ) : (
             <span className="inline-block w-2 h-4 bg-indigo-500 animate-pulse rounded"/>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
