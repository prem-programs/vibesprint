"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, AlertTriangle, TrendingUp, Clock, CalendarDays, Loader2 } from "lucide-react";

export default function RealityCheckPage() {
  const [step, setStep] = useState<"input" | "loading" | "result">("input");
  
  const [file, setFile] = useState<File | null>(null);
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !goal) return;

    setStep("loading");
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("goal", goal);

    try {
      const res = await fetch("http://localhost:8000/api/reality-check", {
        method: "POST",
        body: formData,
      });

      let errorMessage = "An error occurred during analysis.";
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const backendError = errData?.detail || errData?.error;
        throw new Error(backendError || `Failed to process request (Status ${res.status})`);
      }

      const data = await res.json();
      setResult(data);
      setStep("result");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An error occurred during analysis.");
      setStep("input");
    }
  };

  const reset = () => {
    setStep("input");
    setFile(null);
    setGoal("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-white">
                  The Reality Check
                </h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                  Upload your resume, state your wildest career goal, and let AI ruthlessly audit your delusions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Your Target Goal</label>
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Become a Staff Engineer at Google in 6 months..."
                    className="w-full h-32 bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 transition-all resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Your Current Resume (PDF)</label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors bg-slate-950/50 rounded-xl p-8 text-center cursor-pointer group"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <UploadCloud className="w-10 h-10 mx-auto text-slate-500 group-hover:text-indigo-400 mb-3 transition-colors" />
                    {file ? (
                      <p className="text-indigo-400 font-medium">{file.name}</p>
                    ) : (
                      <p className="text-slate-400 text-sm">
                        Drag and drop your PDF here, or <span className="text-indigo-400">browse</span>
                      </p>
                    )}
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={!file || !goal}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.3)] shadow-indigo-500/20"
                >
                  Give it to me straight
                </button>
              </form>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-20 relative z-10"
            >
              <div className="relative">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping" />
                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10 m-4" />
              </div>
              <h2 className="text-2xl font-bold mt-8 mb-2">Analyzing your delusions...</h2>
              <p className="text-slate-400">Comparing your resume against reality.</p>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <button 
                onClick={reset}
                className="text-sm text-slate-400 hover:text-white mb-6 transition-colors"
              >
                ← Try another delusion
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Score Panel */}
                <div className="md:col-span-1 space-y-6">
                  <div className={`p-8 rounded-2xl border ${result.delusion_score > 70 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/50 border-slate-700'} text-center flex flex-col items-center justify-center`}>
                    <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${result.delusion_score > 70 ? 'text-red-400' : 'text-slate-400'}`}>
                      Delusion Score
                    </p>
                    <div className="flex items-baseline space-x-1">
                      <span className={`text-6xl font-black ${result.delusion_score > 70 ? 'text-red-500' : 'text-white'}`}>
                        {result.delusion_score}
                      </span>
                      <span className="text-slate-500 text-xl">/100</span>
                    </div>
                    {result.delusion_score > 70 && (
                      <div className="mt-4 flex items-center space-x-2 text-red-400 text-sm font-medium bg-red-500/10 py-1.5 px-3 rounded-full">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Highly Delusional</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center space-x-3 text-slate-300">
                      <Clock className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Est. Hours</p>
                        <p className="font-medium">{result.required_hours} hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-300">
                      <CalendarDays className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Realistic Timeline</p>
                        <p className="font-medium">{result.adjusted_timeline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Panel */}
                <div className="md:col-span-2 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500 rounded-full" />
                    <blockquote className="pl-6 text-2xl font-light leading-relaxed text-slate-200">
                      "{result.the_roast}"
                    </blockquote>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-indigo-400" />
                      <span>The Realistic Roadmap</span>
                    </h3>
                    <div className="space-y-4">
                      {result.realistic_roadmap.map((step: any, idx: number) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                        >
                          <div className="flex-shrink-0 w-24 text-sm font-bold text-indigo-400">
                            Week {step.week}
                          </div>
                          <div className="text-slate-300">
                            {step.focus}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
