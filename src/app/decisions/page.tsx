"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, ArrowLeft, ArrowRight, Loader2, RotateCcw, 
  GitFork, CheckCircle2, XCircle, AlertTriangle, Lightbulb, Activity, ArrowDown
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OptionAnalysis {
  pros: string[];
  cons: string[];
  hidden_traps: string[];
  regret_score: number;
}

interface DecisionResult {
  summary: string;
  option_1_analysis: OptionAnalysis;
  option_2_analysis: OptionAnalysis;
  second_order_consequences: string[];
  recommendation: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DecisionsDashboard({ result, d1, d2, onReset }: { result: DecisionResult; d1: string; d2: string; onReset: () => void }) {
  
  const getRegretColor = (score: number) => {
    if (score < 30) return "text-emerald-400";
    if (score < 60) return "text-yellow-400";
    return "text-rose-400";
  };

  const OptionCard = ({ title, data, delay }: { title: string; data: OptionAnalysis; delay: number }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} className="glass rounded-3xl p-6 border border-slate-700/50 flex flex-col relative overflow-hidden group">
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-bold text-white text-lg pr-4">{title}</h3>
        <div className="flex flex-col items-end text-right shrink-0">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Regret Score</span>
          <span className={`text-2xl font-black ${getRegretColor(data.regret_score)} leading-none`}>{data.regret_score}</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pros</span>
          </div>
          <ul className="space-y-1.5">
            {data.pros.map((p, i) => (
              <li key={i} className="text-sm text-slate-400 leading-relaxed pl-5 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-emerald-500/50 before:rounded-full">{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Cons</span>
          </div>
          <ul className="space-y-1.5">
            {data.cons.map((c, i) => (
              <li key={i} className="text-sm text-slate-400 leading-relaxed pl-5 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-rose-500/50 before:rounded-full">{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {data.hidden_traps.length > 0 && (
        <div className="mt-auto bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-300 uppercase tracking-widest">Hidden Traps</span>
          </div>
          <ul className="space-y-1">
            {data.hidden_traps.map((t, i) => (
              <li key={i} className="text-sm text-orange-200/90 leading-relaxed">{t}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Top Banner & Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Decision Framework</h1>
            <p className="text-xs text-slate-400">Logic applied to your dilemma.</p>
          </div>
        </div>
        <button onClick={onReset} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" />
          New Decision
        </button>
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 border border-slate-700/50 text-center mb-6 relative overflow-hidden bg-gradient-to-b from-transparent to-rose-500/5">
        <GitFork className="w-8 h-8 text-rose-400 mx-auto mb-3" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">The True Conflict</p>
        <p className="text-lg text-slate-200 leading-relaxed max-w-3xl mx-auto">{result.summary}</p>
      </motion.div>

      {/* Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <OptionCard title={d1} data={result.option_1_analysis} delay={0.1} />
        <OptionCard title={d2} data={result.option_2_analysis} delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Second Order Consequences */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass rounded-3xl p-6 border border-slate-700/50 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-white">Ripple Effects</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Second-order consequences of this decision space:</p>
          <div className="space-y-3">
            {result.second_order_consequences.map((c, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 flex gap-3 text-sm text-slate-300 leading-relaxed">
                <ArrowDown className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/30 lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest text-shadow">The Verdict</h2>
          </div>
          <p className="text-xl sm:text-2xl font-light leading-relaxed text-slate-200 border-l-2 border-rose-500 pl-5 ml-2 mt-2">
            {result.recommendation}
          </p>
        </motion.div>
      </div>

    </div>
  );
}

// ─── Input Area ───────────────────────────────────────────────────────────────
function DecisionsInput({ onResult }: { onResult: (r: DecisionResult, d1: string, d2: string) => void }) {
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d1.trim() || !d2.trim() || context.trim().length < 10) {
      setError("Please fill out both options and provide enough context to analyze.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("decision_1", d1);
    formData.append("decision_2", d2);
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
      onResult(data, d1, d2);
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-3xl mx-auto glass rounded-3xl p-6 sm:p-8 relative">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_32px_rgba(244,63,94,0.4)]">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Better Decisions.</h1>
        <p className="text-slate-400 text-sm sm:text-base">Stuck between two paths? Lay out the options and the context. Logic will prevail.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2 pl-1">Option 1</label>
            <input 
              value={d1} onChange={(e) => setD1(e.target.value)} placeholder="e.g. Quit my job"
              className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-sm placeholder-slate-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2 pl-1">Option 2</label>
            <input 
              value={d2} onChange={(e) => setD2(e.target.value)} placeholder="e.g. Try to negotiate a raise"
              className="w-full bg-slate-950/60 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-sm placeholder-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2 pl-1">Context</label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="I'm severely burned out and my manager is toxic, but the pay is good and I rely on it... (Provide all the messy context here)"
            className="w-full h-40 bg-slate-950/60 border border-slate-700/50 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder-slate-600 resize-none text-sm leading-relaxed"
          />
        </div>
        
        {error && (
          <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!d1 || !d2 || !context || loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(244,63,94,0.25)] hover:shadow-[0_0_36px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Applying cold logic…
            </>
          ) : (
            <>
              Resolve Dilemma
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
  const [result, setResult] = useState<{data: DecisionResult, d1: string, d2: string} | null>(null);

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
          <span className="text-slate-400 text-sm hidden sm:block">Logic Engine</span>
        </div>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <DecisionsDashboard result={result.data} d1={result.d1} d2={result.d2} onReset={() => setResult(null)} />
            </motion.div>
          ) : (
            <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex justify-center">
              <DecisionsInput onResult={(data, d1, d2) => setResult({ data, d1, d2 })} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
