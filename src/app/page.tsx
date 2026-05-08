"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import PillNav from "@/components/PillNav";
import Aurora from "@/components/Aurora";
import {
  Zap, Brain, Target, Sparkles, ArrowRight,
  ChevronRight, Star, Users, TrendingUp, Lock, CircuitBoard
} from "lucide-react";

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const total = 60;
    const timer = setInterval(() => {
      frame++;
      setCount(Math.round(to * (frame / total)));
      if (frame === total) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [started, to]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Magnetic card ─────────────────────────────────────────────────────────────
function FeatureCard({
  href, icon: Icon, label, tag, title, description,
  gradient, glowColor, accentColor, index, comingSoon
}: {
  href: string; icon: any; label: string; tag: string;
  title: string; description: string; gradient: string;
  glowColor: string; accentColor: string; index: number;
  comingSoon?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-6, 6]), { stiffness: 200, damping: 30 });
  const glowX = useSpring(useTransform(mouseX, [-150, 150], [0, 100]), { stiffness: 200, damping: 30 });
  const glowY = useSpring(useTransform(mouseY, [-150, 150], [0, 100]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const content = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 + 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden cursor-pointer group h-full"
    >
      {/* Card bg */}
      <div className={`absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl transition-all duration-500 group-hover:border-opacity-80`}
        style={{ borderColor: hovered ? `${glowColor}40` : undefined }} />

      {/* Spotlight glow on hover */}
      {hovered && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
          style={{
            background: `radial-gradient(circle at ${glowX.get()}% ${glowY.get()}%, ${glowColor}18 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} rounded-t-3xl`} />

      {/* Content */}
      <div className="relative p-8 flex flex-col h-full" style={{ transform: "translateZ(20px)" }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}
            style={{ boxShadow: `0 8px 24px ${glowColor}40` }}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border`}
            style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}10` }}>
            {tag}
          </span>
        </div>

        {/* Label */}
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
          {label}
        </p>

        {/* Title */}
        <h3 className="text-2xl font-black text-white mb-3 leading-tight">{title}</h3>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed flex-1">{description}</p>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-between">
          <div className={`flex items-center gap-2 font-semibold text-sm transition-all duration-300`}
            style={{ color: accentColor }}>
            {comingSoon ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Coming Soon</span>
              </>
            ) : (
              <>
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </div>
          {!comingSoon && (
            <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}30` }}>
              <ChevronRight className="w-4 h-4" style={{ color: accentColor }} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (comingSoon) {
    return <div className="h-full">{content}</div>;
  }

  return (
    <Link href={href} className="h-full block">
      {content}
    </Link>
  );
}

// ─── Floating orb ─────────────────────────────────────────────────────────────
function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
      animate={{ y: [0, -30, 0], scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

// ─── Animated word ─────────────────────────────────────────────────────────────
const ROTATING_WORDS = ["Brutally Honest.", "Actually Useful.", "Beautifully Clear.", "Truly Insightful."];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="inline-block relative h-[1.2em] overflow-hidden">
      <AnimatePresenceShim word={ROTATING_WORDS[index]} />
    </span>
  );
}

function AnimatePresenceShim({ word }: { word: string }) {
  return (
    <motion.span
      key={word}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="gradient-text block"
    >
      {word}
    </motion.span>
  );
}

// ─── Features data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    href: "/reality-check",
    icon: Zap,
    label: "Feature 01",
    tag: "Live",
    title: "Reality Check",
    description: "Upload your resume and career goal. Get a delusion score, brutal roast, skill gap analysis, recommended projects, and a week-by-week roadmap grounded in reality.",
    gradient: "from-indigo-500 to-violet-600",
    glowColor: "#6366f1",
    accentColor: "#818cf8",
    comingSoon: false,
  },
  {
    href: "/declutter",
    icon: Brain,
    label: "Feature 02",
    tag: "Live",
    title: "Declutter Your Mind",
    description: "Brain dump everything overwhelming you. Our AI organises the chaos into clear priorities, surfaces what actually matters, and helps you offload the mental noise — guilt-free.",
    gradient: "from-cyan-500 to-teal-500",
    glowColor: "#06b6d4",
    accentColor: "#22d3ee",
    comingSoon: false,
  },
  {
    href: "/decisions",
    icon: Target,
    label: "Feature 03",
    tag: "Live",
    title: "Better Decision Plan",
    description: "Stuck on a tough call? Describe your dilemma and get a structured decision framework with trade-off analysis, second-order consequences, and a clear recommendation backed by reasoning.",
    gradient: "from-rose-500 to-pink-600",
    glowColor: "#f43f5e",
    accentColor: "#fb7185",
    comingSoon: false,
  },
];

// ─── Homepage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-pattern" />
        <Aurora
          colorStops={["#4f46e5", "#06b6d4", "#a855f7"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <FloatingOrb className="w-[600px] h-[600px] bg-indigo-600/20 top-[-200px] left-[-100px]" delay={0} />
        <FloatingOrb className="w-[500px] h-[500px] bg-violet-600/15 top-[20%] right-[-150px]" delay={2} />
        <FloatingOrb className="w-[400px] h-[400px] bg-cyan-600/10 bottom-[10%] left-[20%]" delay={4} />
      </div>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-50 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)", boxShadow: "0 0 22px rgba(124,58,237,0.45), 0 0 8px rgba(6,182,212,0.3)" }}>
            <Brain className="w-5 h-5 absolute" style={{ color: "#e0e7ff" }} />
        
          </div>
          <span className="font-black text-2xl tracking-tighter"
                style={{ background: "linear-gradient(90deg, #818cf8 0%, #a78bfa 40%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            ThinkOS
          </span>
        </div>

        <div className="flex items-center justify-center relative z-[100]">
          <PillNav
            items={[
              { label: "Reality Check", href: "/reality-check" },
              { label: "Declutter", href: "/declutter" },
              { label: "Decisions", href: "/decisions" }
            ]}
            baseColor="rgba(30, 41, 59, 0.4)" /* Slate-800 mostly transparent */
            pillColor="rgba(51, 65, 85, 0.5)" /* Slate-700 mostly transparent */
            hoveredPillTextColor="#fff"
            pillTextColor="#cbd5e1"
            className="backdrop-blur-md"
          />
        </div>

      </motion.nav>

      {/* ── Hero (Above the fold) ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-3"
        >
          <span className="text-white block">AI that's</span>
          <RotatingWord />
        </motion.h1>
      </section>

      {/* ── Features (Below the fold) ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-24 text-center">
        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          Three powerful AI tools to audit your career, declutter your mental bandwidth,
          and make smarter decisions — no fluff, no filters.
        </motion.p>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left perspective-[1200px]">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.label} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            No hand-holding. Just <span className="gradient-text">clarity.</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Each tool is designed to cut through noise and deliver something most apps won't: the truth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Give it context", body: "Upload your resume, brain dump your thoughts, or describe your decision. Raw input is fine." },
            { step: "02", title: "AI thinks hard", body: "Gemini analyses your context against reality — no sugar-coating, no flattery. Just signal." },
            { step: "03", title: "Get a clear plan", body: "Walk away with a structured, actionable output you can act on today, not someday." },
          ].map(({ step, title, body }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300"
            >
              <span className="absolute top-4 right-5 text-6xl font-black text-slate-800/60 select-none">{step}</span>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-purple-600/20 backdrop-blur-xl border border-indigo-500/25 rounded-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <div className="relative p-10 sm:p-14 text-center">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Start with Reality Check →
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Upload your resume and tell us your wildest career goal. Get a full dashboard with your delusion score, skill gaps, roadmap, and more.
            </p>
            <Link
              href="/reality-check"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg transition-all shadow-[0_0_36px_rgba(99,102,241,0.4)] hover:shadow-[0_0_48px_rgba(99,102,241,0.55)] hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5" />
              Try Reality Check — Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/60 py-8 text-center text-xs text-slate-600">
        <p>ThinkOS · AI tools for people who can handle the truth · Built with Gemini API</p>
      </footer>
    </div>
  );
}
