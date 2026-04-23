"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  UploadCloud, AlertTriangle, TrendingUp, Clock, CalendarDays,
  Loader2, RotateCcw, Zap, Target, Brain, ChevronRight,
  Flame, Star, BarChart2, ArrowRight, CheckCircle2, Circle,
  Lightbulb, Shield, Rocket, Award, Activity
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RoadmapStep {
  week: string;
  focus: string;
}

interface AnalysisResult {
  delusion_score: number;
  the_roast: string;
  required_hours: number;
  adjusted_timeline: string;
  realistic_roadmap: RoadmapStep[];
  core_missing_skills?: string[];
  recommended_projects?: { title: string; description: string }[];
  top_barrier?: string;
  market_reality_check?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 80) return { text: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/30",   stroke: "#ef4444", label: "Severely Delusional", icon: Flame };
  if (score >= 60) return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", stroke: "#f97316", label: "Somewhat Delusional",  icon: AlertTriangle };
  if (score >= 40) return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", stroke: "#eab308", label: "Optimistically Challenged", icon: Star };
  return            { text: "text-emerald-400",  bg: "bg-emerald-500/10", border: "border-emerald-500/30", stroke: "#22c55e", label: "Actually Realistic",     icon: CheckCircle2 };
}

function getPhaseLabel(idx: number, total: number): { label: string; color: string } {
  const ratio = idx / total;
  if (ratio < 0.25) return { label: "Foundation",  color: "from-indigo-500 to-blue-500" };
  if (ratio < 0.5)  return { label: "Build",        color: "from-blue-500 to-cyan-500" };
  if (ratio < 0.75) return { label: "Accelerate",   color: "from-cyan-500 to-violet-500" };
  return               { label: "Advanced",    color: "from-violet-500 to-purple-500" };
}

// ─── Circular Gauge ───────────────────────────────────────────────────────────
function DelusionGauge({ score, color }: { score: number; color: string }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        {/* Track */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="10" />
        {/* Fill */}
        <motion.circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.34, 1.2, 0.64, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black text-white leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-500 font-medium mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, delay = 0 }: {
  icon: any; label: string; value: string; sub?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-4 flex items-center gap-3 group hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/25 transition-colors">
        <Icon className="w-5 h-5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-white font-bold text-sm truncate">{value}</p>
        {sub && <p className="text-[11px] text-slate-600 truncate">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Roadmap Item ─────────────────────────────────────────────────────────────
function RoadmapItem({ step, idx, total, delay }: {
  step: RoadmapStep; idx: number; total: number; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const phase = getPhaseLabel(idx, total);
  const isLast = idx === total - 1;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="relative flex gap-4"
    >
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${phase.color} shadow-lg`}>
          <span className="text-white text-xs font-bold">{idx + 1}</span>
        </div>
        {!isLast && (
          <motion.div
            className="w-0.5 bg-gradient-to-b from-indigo-500/40 to-transparent flex-1 mt-1"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: delay * 0.1 + 0.3, duration: 0.4 }}
            style={{ minHeight: "32px" }}
          />
        )}
      </div>

      {/* Content */}
      <div className={`glass rounded-2xl p-4 mb-4 flex-1 hover:border-indigo-500/20 transition-all duration-300 group ${isLast ? "mb-0" : ""}`}>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full phase-badge`}>
              {phase.label}
            </span>
            <span className="text-xs text-slate-500 font-medium">Week {step.week}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">{step.focus}</p>
      </div>
    </motion.div>
  );
}

// ─── Timeline Bar ─────────────────────────────────────────────────────────────
function TimelineBar({ steps, timeline }: { steps: RoadmapStep[]; timeline: string }) {
  const phases = [
    { label: "Foundation", color: "bg-indigo-500", glow: "shadow-indigo-500/50" },
    { label: "Build",      color: "bg-blue-500",   glow: "shadow-blue-500/50" },
    { label: "Accelerate", color: "bg-cyan-500",   glow: "shadow-cyan-500/50" },
    { label: "Advanced",   color: "bg-violet-500", glow: "shadow-violet-500/50" },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-white">Timeline Overview</h3>
        <span className="ml-auto text-sm text-indigo-300 font-semibold">{timeline}</span>
      </div>

      {/* Bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            className={`${p.color} flex-1 first:rounded-l-full last:rounded-r-full`}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Legends */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {phases.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className={`w-2 h-2 rounded-full ${p.color} flex-shrink-0`} />
            <span>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Week markers */}
      {steps.length > 0 && (
        <div className="mt-4 border-t border-slate-800 pt-4">
          <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">Key Milestones</p>
          <div className="space-y-1.5">
            {[0, Math.floor(steps.length / 3), Math.floor(steps.length * 2 / 3), steps.length - 1]
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .map((idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-400">Week {steps[idx].week}:</span>
                  <span className="text-slate-300 truncate">{steps[idx].focus.split(".")[0]}.</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
function InsightCard({ icon: Icon, title, body, color = "indigo", delay = 0 }: {
  icon: any; title: string; body: string; color?: string; delay?: number;
}) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber:  "bg-amber-500/10  text-amber-400  border-amber-500/20",
    emerald:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass rounded-2xl p-5 border ${colors[color]} hover:scale-[1.01] transition-transform duration-200`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
    </motion.div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function Dashboard({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const sc = getScoreColor(result.delusion_score);
  const ScoreIcon = sc.icon;
  const totalWeeks = result.realistic_roadmap.reduce((acc, s) => {
    const parts = String(s.week).split("-");
    return Math.max(acc, parseInt(parts[parts.length - 1]) || 0);
  }, 0);
  const monthsNeeded = Math.ceil(totalWeeks / 4);

  // Derive "gap score" = how many key skills are possibly missing (rough proxy)
  const gapPercent = Math.min(100, Math.round((result.required_hours / 100) * 1.2));

  const insightData = [
    {
      icon: Brain,
      title: "Skill Gap Analysis",
      body: result.delusion_score >= 70
        ? "Your current skillset has significant gaps relative to your stated goal. The roadmap below is designed to close those systematically."
        : "Your skillset shows decent alignment with your goal. Some targeted upskilling will bridge the remaining gaps efficiently.",
      color: "violet",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      body: result.delusion_score >= 70
        ? "High execution risk. The timeline assumes 3–4 focused hours daily. Part-time learning will extend this significantly."
        : "Moderate risk if approached inconsistently. Following the weekly plan with discipline makes this very achievable.",
      color: "amber",
    },
    {
      icon: Rocket,
      title: "Acceleration Tips",
      body: "Prioritize project-based learning over passive consumption. Every 10 hours of hands-on practice is worth 30 hours of tutorials.",
      color: "indigo",
    },
    {
      icon: Award,
      title: "Success Probability",
      body: `At your current pace, the probability of hitting the goal in the stated timeline is approx. ${Math.max(5, 100 - result.delusion_score)}%. Stick to the roadmap to improve this dramatically.`,
      color: "emerald",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] grid-pattern text-slate-100">

      {/* ── Ambient glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      {/* ── Top Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass border-b border-slate-800/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">Reality Check</span>
            <span className="text-slate-700 hidden sm:block">·</span>
            <span className="text-slate-400 text-sm hidden sm:block">Career Audit Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${sc.bg} ${sc.border} border ${sc.text}`}>
              <ScoreIcon className="w-3.5 h-3.5" />
              {sc.label}
            </div>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Check</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* ── Hero row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`glass rounded-3xl p-6 flex flex-col items-center text-center ${sc.bg} border ${sc.border} pulse-glow`}
          >
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${sc.text}`}>Delusion Score</p>
            <DelusionGauge score={result.delusion_score} color={sc.stroke} />
            <div className={`mt-4 flex items-center gap-1.5 text-sm font-semibold ${sc.text}`}>
              <ScoreIcon className="w-4 h-4" />
              {sc.label}
            </div>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              {result.delusion_score >= 70
                ? "Significant calibration needed. But every expert was once a beginner."
                : result.delusion_score >= 40
                ? "You're optimistic — but with effort, this can work. Stay consistent."
                : "You have a realistic shot. Execute the plan and you'll get there."}
            </p>
          </motion.div>

          {/* Roast / verdict */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="lg:col-span-2 glass rounded-3xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-400" />
                <h2 className="font-bold text-white">The Verdict</h2>
                <span className="ml-auto text-xs text-slate-600 font-medium">AI Career Coach</span>
              </div>
              <blockquote className="text-xl sm:text-2xl font-light leading-relaxed text-slate-200 relative pl-4">
                <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                "{result.the_roast}"
              </blockquote>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
              <div className="bg-slate-800/60 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Hours Required</p>
                <p className="text-2xl font-black text-white mt-0.5">{result.required_hours.toLocaleString()}</p>
                <p className="text-[10px] text-slate-600">total hours</p>
              </div>
              <div className="bg-slate-800/60 rounded-2xl p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Realistic Timeline</p>
                <p className="text-2xl font-black text-white mt-0.5">{result.adjusted_timeline}</p>
                <p className="text-[10px] text-slate-600">if consistent</p>
              </div>
              <div className="bg-slate-800/60 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Weeks Planned</p>
                <p className="text-2xl font-black text-white mt-0.5">{totalWeeks > 0 ? totalWeeks : result.realistic_roadmap.length}</p>
                <p className="text-[10px] text-slate-600">in your roadmap</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard icon={Clock}        label="Commitment" value={`${Math.ceil(result.required_hours / (totalWeeks || 12) / 7)} hrs/day`} sub="to meet timeline"  delay={0.1} />
          <StatCard icon={CalendarDays} label="Deadline"   value={result.adjusted_timeline}                                               sub="realistic target"   delay={0.15} />
          <StatCard icon={Target}       label="Goal Steps"  value={`${result.realistic_roadmap.length} Milestones`}                        sub="structured roadmap" delay={0.2} />
          <StatCard icon={BarChart2}    label="Effort Score" value={`${Math.min(100, gapPercent)}%`}                                       sub="of effort needed"   delay={0.25} />
        </div>

        {/* ── Two-col section: Roadmap + Insights ── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">

          {/* ── Roadmap (3/5 cols) ── */}
          <div className="xl:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Realistic Roadmap</h2>
              <span className="ml-auto text-xs text-slate-500">{result.realistic_roadmap.length} steps</span>
            </div>

            <div>
              {result.realistic_roadmap.map((step, idx) => (
                <RoadmapItem
                  key={idx}
                  step={step}
                  idx={idx}
                  total={result.realistic_roadmap.length}
                  delay={idx}
                />
              ))}
            </div>
          </div>

          {/* ── Right col: Timeline + Insights ── */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Timeline bar */}
            <TimelineBar steps={result.realistic_roadmap} timeline={result.adjusted_timeline} />

            {/* Effort breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-5 h-5 text-violet-400" />
                <h3 className="font-bold text-white text-sm">Effort Breakdown</h3>
              </div>

              {[
                { label: "Learning & Study",   pct: 40, color: "bg-indigo-500" },
                { label: "Hands-on Projects",  pct: 30, color: "bg-violet-500" },
                { label: "Portfolio Building", pct: 20, color: "bg-cyan-500" },
                { label: "Networking / Apply", pct: 10, color: "bg-emerald-500" },
              ].map(({ label, pct, color }) => (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Motivational pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-4 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 border border-indigo-500/15 text-center"
            >
              <Lightbulb className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">Pro tip:</span> People who work in public (
                GitHub, LinkedIn, Twitter) achieve their goals <span className="text-indigo-300 font-semibold">2.4× faster</span> due to accountability and serendipitous opportunities.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── Market Reality & Core Gaps ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Core Missing Skills */}
          {result.core_missing_skills && result.core_missing_skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-6 border border-indigo-500/15"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-white">Core Missing Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.core_missing_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              {result.top_barrier && (
                <div className="mt-5 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-start gap-2 text-orange-200">
                    <Shield className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-1">Top Barrier</p>
                      <p className="text-sm leading-relaxed">{result.top_barrier}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Recommended Projects & Market Reality */}
          <div className="flex flex-col gap-6">
            {result.recommended_projects && result.recommended_projects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-3xl p-6 border border-violet-500/15"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-bold text-white">Recommended Projects</h2>
                </div>
                <div className="space-y-4">
                  {result.recommended_projects.map((proj, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="font-bold text-violet-300 mb-1">{proj.title}</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {result.market_reality_check && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass rounded-3xl p-6 border border-red-500/15 bg-gradient-to-br from-red-500/5 to-transparent"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-bold text-white">Market Reality</h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{result.market_reality_check}"
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Full Insights Grid ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Full Insights</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insightData.map((item, i) => (
              <InsightCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                body={item.body}
                color={item.color as any}
                delay={0.1 * i}
              />
            ))}
          </div>
        </div>

        {/* ── CTA Footer ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/15"
        >
          <div>
            <h3 className="font-bold text-white mb-1">Ready to challenge another goal?</h3>
            <p className="text-slate-400 text-sm">Upload a new resume or tweak your goal to get a fresh audit.</p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold transition-all shadow-[0_0_24px_rgba(99,102,241,0.3)] hover:shadow-[0_0_36px_rgba(99,102,241,0.4)] hover:scale-[1.02] flex-shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Try Another Goal
          </button>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Input Screen ─────────────────────────────────────────────────────────────
function InputScreen({
  onResult,
}: {
  onResult: (r: AnalysisResult) => void;
}) {
  const [file, setFile]       = useState<File | null>(null);
  const [goal, setGoal]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !goal) return;
    setLoading(true); setError(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("goal", goal);

    try {
      const res = await fetch("http://localhost:8000/api/reality-check", {
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
      setError(err?.message || "An error occurred during analysis.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] grid-pattern flex items-center justify-center p-4">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/8 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Career Reality Audit
          </span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            <span className="text-white">The </span>
            <span className="gradient-text">Reality</span>
            <span className="text-white"> Check</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Upload your resume, state your wildest career goal, and let AI ruthlessly audit your timeline with a full dashboard breakdown.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Goal */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Your Career Goal
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Become a Staff Engineer at Google in 6 months..."
                className="w-full h-28 bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-slate-600 transition-all resize-none text-sm"
                required
              />
            </div>

            {/* File upload */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Resume (PDF)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  dragging
                    ? "border-indigo-400 bg-indigo-500/10"
                    : file
                    ? "border-indigo-500/50 bg-indigo-500/5"
                    : "border-slate-700 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-indigo-500/5"
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    <span className="text-indigo-300 font-medium text-sm">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400 text-sm">
                      Drop your PDF here or <span className="text-indigo-400 font-medium">browse</span>
                    </p>
                  </>
                )}
                <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="submit-btn"
              type="submit"
              disabled={!file || !goal || loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_36px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing your delusions…
                </>
              ) : (
                <>
                  Give it to me straight
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-slate-600 text-xs mt-4">
          Your data stays local — nothing is stored or shared.
        </p>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function RealityCheckPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard result={result} onReset={() => setResult(null)} />
        </motion.div>
      ) : (
        <motion.div
          key="input"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <InputScreen onResult={setResult} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
