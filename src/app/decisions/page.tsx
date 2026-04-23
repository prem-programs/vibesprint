"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, ArrowLeft, ArrowRight, Loader2, RotateCcw, 
  CheckCircle2, XCircle, AlertTriangle, Lightbulb 
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OptionAnalysis {
  pros: string[];
  cons: string[];
  hidden_risk: string;
}

interface DecisionResult {
  option1_analysis: OptionAnalysis;
  option2_analysis: OptionAnalysis;
  second_order_consequences: string[];
  regret_minimization: string;
  recommendation: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DecisionsDashboard({ result, option1, option2, onReset }: { result: DecisionResult; option1: string; option2: string; onReset: () => void }) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Top Banner & Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Decision Framework</h1>
            <p className="text-xs text-slate-400">Trade-offs mapped. Noise eliminated.</p>
          </div>
        </div>
        <button onClick={onReset} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" />
          New Decision
        </button>
      </div>

      {/* Primary Context Shift */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recommendation */}
        <div className="glass rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/30 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">The Verdict</h2>
          </div>
          <p className="text-xl font-light leading-relaxed text-slate-200">
            {result.recommendation}
          </p>
        </div>

        {/* Regret Minimisation */}
        <div className="glass rounded-3xl p-6 border border-slate-700/50 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Regret Minimization</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic">
            "{result.regret_minimization}"
          </p>

          <div className="mt-5 pt-5 border-t border-slate-800/60">
             <h3 className="text-[10px] uppercase font-bold text-slate-500 mb-2">Second-Order Consequences</h3>
             <ul className="space-y-2">
               {result.second_order_consequences.map((c, i) => (
                 <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 flex-shrink-0" />
                   {c}
                 </li>
               ))}
             </ul>
          </div>
        </div>

      </motion.div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Option 1 */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 border border-indigo-500/15">
          <h2 className="text-xl font-black text-white mb-6 truncate" title={option1}>{option1}</h2>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pros</h3>
              </div>
              <ul className="space-y-2">
                {result.option1_analysis.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-slate-300">{pro}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400">Cons</h3>
              </div>
              <ul className="space-y-2">
                {result.option1_analysis.cons.map((con, i) => (
                  <li key={i} className="text-sm text-slate-300">{con}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-1.5 mb-1 text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Hidden Risk</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{result.option1_analysis.hidden_risk}</p>
            </div>
          </div>
        </motion.div>

        {/* Option 2 */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 border border-teal-500/15">
          <h2 className="text-xl font-black text-white mb-6 truncate" title={option2}>{option2}</h2>
          
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pros</h3>
              </div>
              <ul className="space-y-2">
                {result.option2_analysis.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-slate-300">{pro}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400">Cons</h3>
              </div>
              <ul className="space-y-2">
                {result.option2_analysis.cons.map((con, i) => (
                  <li key={i} className="text-sm text-slate-300">{con}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-1.5 mb-1 text-yellow-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Hidden Risk</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{result.option2_analysis.hidden_risk}</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

// ─── Input Area ───────────────────────────────────────────────────────────────
function DecisionsInput({ 
  onResult 
}: { 
  onResult: (r: DecisionResult, o1: string, o2: string) => void 
}) {
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!option1 || !option2 || !context) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("option1", option1);
    formData.append("option2", option2);
    formData.append("context", context);

    try {
      const res = await fetch("http://localhost:8000/api/decisions", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      onResult(data, option1, option2);
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-6 sm:p-8 relative">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_32px_rgba(244,63,94,0.4)]">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Better Decisions.</h1>
        <p className="text-slate-400 text-sm sm:text-base">Stuck between two paths? Give us the context. Get absolute clarity.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        
        {/* Context */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">The Context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. I just got two job offers. One pays more but is boring. The other is a startup with huge upside but high stress. I want to buy a house in 2 years..."
            className="w-full h-28 bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 placeholder-slate-600 transition-all resize-none text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Option 1 */}
          <div>
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Option 1</label>
             <input
               type="text"
               value={option1}
               onChange={(e) => setOption1(e.target.value)}
               placeholder="e.g. Take the corporate tech job"
               className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-slate-600 transition-all text-sm"
             />
          </div>
          
          {/* Option 2 */}
          <div>
             <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Option 2</label>
             <input
               type="text"
               value={option2}
               onChange={(e) => setOption2(e.target.value)}
               placeholder="e.g. Join the pre-seed AI startup"
               className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 placeholder-slate-600 transition-all text-sm"
             />
          </div>
        </div>
        
        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!context || !option1 || !option2 || loading}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(244,63,94,0.25)] hover:shadow-[0_0_36px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Calculating Trade-offs…
            </>
          ) : (
            <>
              Analyze My Decision
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Main Page Wrapper ────────────────────────────────────────────────────────
export default function DecisionsPage() {
  const [result, setResult] = useState<{ res: DecisionResult, o1: string, o2: string } | null>(null);

  return (
    <div className="min-h-screen bg-[#020617] grid-pattern text-slate-100 flex flex-col items-center">
      
      {/* Universal Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-medium mr-1 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm hidden sm:block">Decisions</span>
          <span className="text-slate-700 hidden sm:block">·</span>
          <span className="text-slate-400 text-sm hidden sm:block">Logic Framework</span>
        </div>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <DecisionsDashboard 
                result={result.res} 
                option1={result.o1} 
                option2={result.o2} 
                onReset={() => setResult(null)} 
              />
            </motion.div>
          ) : (
            <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex justify-center">
              <DecisionsInput onResult={(r, o1, o2) => setResult({ res: r, o1, o2 })} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
