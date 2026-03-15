'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ children, ...props }: any) {
  const [isCopied, setIsCopied] = useState(false);

  // Extract the raw code string if children is a React element
  const getCodeString = () => {
    if (typeof children === 'string') return children;
    if (children?.props?.children) {
      if (typeof children.props.children === 'string') return children.props.children;
    }
    return '';
  };

  const copyToClipboard = async () => {
    const codeString = getCodeString();
    if (!codeString) return;
    
    await navigator.clipboard.writeText(codeString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Determine language from children props if available (e.g. className="language-csharp")
  const className = children?.props?.className || '';
  const language = className.replace('language-', '');

  return (
    <div className="relative group my-8 rounded-xl bg-[#1e2329] border border-neutral-800 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#161b22]">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          {language && (
            <span className="text-xs font-mono text-neutral-400 lowercase tracking-wider">{language}</span>
          )}
        </div>
        
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-1.5 text-xs font-medium"
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-neutral-300 font-mono" {...props}>
        {children}
      </pre>
    </div>
  );
}
