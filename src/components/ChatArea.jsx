import React, { useState } from 'react';
import { Send, Sparkles, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatArea = ({ config }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setResponse("### System Operational\nYour UI upgrade is complete. Waiting for Gemini API connection to process live prompts.\n\n```javascript\nconsole.log('Nexus AI is ready.');\n```");
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col relative h-full">
      {/* Response Display Area */}
      <div className="flex-1 overflow-y-auto p-8 pb-40">
        {response ? (
          <div className="max-w-4xl mx-auto flex gap-6 mt-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
              <Bot size={24} className="text-white" />
            </div>
            <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:shadow-xl w-full max-w-none">
              <ReactMarkdown
                children={response}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        children={String(children).replace(/\n$/, '')}
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl overflow-hidden text-sm"
                        {...props}
                      />
                    ) : (
                      <code className={`${className} bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded-md text-sm`} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-[100px] opacity-10 rounded-full"></div>
              <Sparkles size={64} className="mb-6 opacity-30 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-300 mb-2">How can I help you today?</h2>
            <p className="text-sm">Adjust parameters on the left and enter a prompt below.</p>
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-8 inset-x-0 mx-auto max-w-4xl px-8 w-full">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-20 group-focus-within:opacity-50 blur transition duration-500"></div>
          <div className="relative bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-2xl shadow-2xl flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Nexus AI..."
              className="w-full bg-transparent p-5 max-h-48 resize-none focus:outline-none text-zinc-100 placeholder:text-zinc-500 leading-relaxed"
              rows={3}
            />
            <div className="flex justify-between items-center px-4 pb-4">
              <span className="text-xs text-zinc-500 font-medium px-2">Press 'Generate' to start</span>
              <button
                onClick={handleGenerate}
                disabled={loading || !input}
                className="bg-zinc-100 hover:bg-white text-zinc-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Thinking...' : 'Generate'}
                <Send size={16} className={input ? "text-cyan-600" : "text-zinc-500"} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;