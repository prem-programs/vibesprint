"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, ArrowLeft, ArrowRight, Zap, Loader2, RotateCcw, 
  Activity, CheckCircle2, XCircle, AlertTriangle, Lightbulb 
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DeclutterResult {
  emotional_load_score: number;
  core_themes: string[];
  prioritized_actions: { task: string; reason: string }[];
  drop_or_defer: { task: string; status: "Drop" | "Defer"; reason: string }[];
  immediate_focus: string;
  mindset_shift: string;
}

// ─── Circular Gauge ───────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  let color = "#06b6d4"; // cyan
  if (score > 60) color = "#eab308"; // yellow
  if (score > 80) color = "#ef4444"; // red

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="10" />
        <motion.circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: [0.34, 1.2, 0.64, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl font-black text-white leading-none"
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
          {score}
        </motion.span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Load</span>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function DeclutterDashboard({ result, onReset }: { result: DeclutterResult; onReset: () => void }) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Top Banner & Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Mind Decluttered</h1>
            <p className="text-xs text-slate-400">Chaos organized into signal.</p>
          </div>
        </div>
        <button onClick={onReset} className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" />
          New Dump
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Mindset & Load */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass rounded-3xl p-6 flex flex-col items-center text-center border border-cyan-500/15 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mb-6">Emotional Load</p>
            <ScoreGauge score={result.emotional_load_score} />
            <p className="text-slate-400 text-sm mt-6 leading-relaxed">
              {result.emotional_load_score > 75 ? "You are severely overwhelmed. Disconnect immediately and focus only on the absolute essentials below." : 
               result.emotional_load_score > 40 ? "You're carrying a lot of mental noise. Offloading this was a good idea." : 
               "Your mind is relatively clear, just a bit tangled. Easy fix."}
            </p>
          </motion.div>

          {/* Core Themes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="glass rounded-3xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="font-bold text-white text-sm">Core Themes Detected</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.core_themes.map((theme, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                  {theme}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Col: Actions & Mindset */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Immediate Focus */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-black text-white">Next 24 Hours</h2>
            </div>
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-slate-200 mt-2">
              {result.immediate_focus}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prioritized Actions */}
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass rounded-3xl p-6 border border-emerald-500/15">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Do This</h3>
              </div>
              <div className="space-y-4">
                {result.prioritized_actions.map((act, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/50">
                    <p className="font-bold text-slate-200 text-sm mb-1">{act.task}</p>
                    <p className="text-xs text-emerald-400/80 leading-relaxed">{act.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Drop or Defer */}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass rounded-3xl p-6 border border-rose-500/15">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white">Drop or Defer</h3>
              </div>
              <div className="space-y-4">
                {result.drop_or_defer.map((act, i) => (
                  <div key={i} className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-slate-200 text-sm truncate pr-2">{act.task}</p>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${act.status === 'Drop' ? 'bg-rose-500/20 text-rose-300' : 'bg-orange-500/20 text-orange-300'}`}>
                        {act.status}
                      </span>
                    </div>
                    <p className="text-xs text-rose-400/80 leading-relaxed">{act.reason}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Truth Bomb */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-5 border border-slate-700/50 flex gap-4 mt-auto">
            <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Mindset Shift</h4>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{result.mindset_shift}"</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

// ─── Input Area ───────────────────────────────────────────────────────────────
function DeclutterInput({ onResult }: { onResult: (r: DeclutterResult) => void }) {
  const [dump, setDump] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dump.trim().length < 10) {
      setError("Come on, write a little more. Dump the whole brain out.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("dump", dump);

    try {
      const res = await fetch("http://localhost:8000/api/declutter", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      onResult(data);
    } catch (err: any) {
      setError(err?.message || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl mx-auto glass rounded-3xl p-6 sm:p-8 relative">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-500/20 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-[0_0_32px_rgba(6,182,212,0.4)]">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">Brain Dump.</h1>
        <p className="text-slate-400 text-sm sm:text-base">Empty your head. Type every chaotic thought out. We'll find the signal in the noise.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <textarea
          value={dump}
          onChange={(e) => setDump(e.target.value)}
          placeholder="I have to finish that report by Friday, also my car needs an oil change, but I also committed to going to that networking event, and my roommate is mad at me, I haven't replied to Sarah's email in 3 days, and I feel like I'm falling behind in life..."
          className="w-full h-56 bg-slate-950/60 border border-slate-700/50 rounded-2xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-slate-600 transition-all resize-none text-sm sm:text-base leading-relaxed"
          autoFocus
        />
        
        {error && (
          <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={dump.length === 0 || loading}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(6,182,212,0.25)] hover:shadow-[0_0_36px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Untangling your thoughts…
            </>
          ) : (
            <>
              Declutter My Mind
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Main Page Wrapper ────────────────────────────────────────────────────────
export default function DeclutterPage() {
  const [result, setResult] = useState<DeclutterResult | null>(null);

  return (
    <div className="min-h-screen bg-[#020617] grid-pattern text-slate-100 flex flex-col items-center">
      
      {/* Universal Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs font-medium mr-1 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm hidden sm:block">Declutter</span>
          <span className="text-slate-700 hidden sm:block">·</span>
          <span className="text-slate-400 text-sm hidden sm:block">Mental Organization</span>
        </div>
        <div className="w-[60px]" /> {/* Spacer for centering */}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div key="dash" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <DeclutterDashboard result={result} onReset={() => setResult(null)} />
            </motion.div>
          ) : (
            <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex justify-center">
              <DeclutterInput onResult={setResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
