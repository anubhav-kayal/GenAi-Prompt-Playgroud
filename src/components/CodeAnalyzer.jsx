import React, { useState } from 'react';
import { Code2, ArrowRight, Terminal, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeAnalyzer = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputCode) return;
    setIsAnalyzing(true);
    setOutputCode('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        // We hardcode the system instruction here so it acts specifically as a code reviewer
        systemInstruction: "You are an elite Senior Developer. The user will provide raw code. Your job is to refactor it for performance, readability, and modern best practices. Return the refactored code and a brief bulleted list of the changes you made."
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: inputCode }] }],
      });

      setOutputCode(result.response.text());
    } catch (error) {
      console.error(error);
      setOutputCode(`### ⚠️ Analysis Failed\nPlease check your API key in the \`.env.local\` file.\n\nError: \`${error.message}\``);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 overflow-hidden relative">
      {/* Background glowing effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      {/* Header */}
      <div className="mb-8 z-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Terminal className="text-cyan-400" size={32} />
            Code Analyzer
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">Paste messy code, and our AI will refactor and optimize it instantly.</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !inputCode}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:shadow-none"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {isAnalyzing ? 'Analyzing...' : 'Refactor Code'}
        </button>
      </div>

      {/* Split Pane */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0 z-10">
        
        {/* Left Pane: Input */}
        <div className="flex flex-col bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-950/50 p-3 border-b border-zinc-800 flex items-center gap-2">
            <Code2 size={16} className="text-zinc-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Raw Input</span>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="// Paste your JavaScript, Python, or C++ code here..."
            className="flex-1 w-full bg-transparent p-6 resize-none focus:outline-none text-zinc-300 font-mono text-sm leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Right Pane: Output */}
        <div className="flex flex-col bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="bg-zinc-950/50 p-3 border-b border-zinc-800 flex items-center gap-2">
            <ArrowRight size={16} className="text-cyan-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Refactored Output</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {outputCode ? (
              <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 w-full max-w-none text-sm">
                <ReactMarkdown
                  children={outputCode}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl overflow-hidden"
                          {...props}
                        />
                      ) : (
                        <code className={`${className} bg-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded-md text-xs`} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <Terminal size={48} className="mb-4 opacity-20" />
                <p>Awaiting code input...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodeAnalyzer;