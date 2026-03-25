"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Ruler, LayoutTemplate, FileText, 
  Layers, ArrowRight, Sparkles, Zap, Shield,
  TrendingUp, Clock, Star, ShieldCheck,
  ChevronRight, Activity, Globe, Lock
} from "lucide-react";
import Link from "next/link";

const mainLinks = [
  {
    title: "Estimate Hub",
    description: "Industrial-grade project cost and material estimation engine.",
    icon: <Calculator className="w-6 h-6 text-indigo-600" />,
    href: "/estimate",
    badge: "Enterprise",
    colSpan: "md:col-span-2",
    bg: "bg-indigo-50/50"
  },
  {
    title: "Drawing Hub",
    description: "2D & 3D CAD blueprint management system.",
    icon: <Layers className="w-6 h-6 text-blue-600" />,
    href: "/drawing",
    bg: "bg-blue-50/50"
  },
  {
    title: "Tools Catalog",
    description: "Complete repository of engineering utilities and processors.",
    icon: <LayoutTemplate className="w-6 h-6 text-slate-700" />,
    href: "/dashboard",
    badge: "v4.0",
    bg: "bg-slate-50"
  },
  {
    title: "Unit Converter",
    description: "Precision conversion for global engineering standards.",
    icon: <Ruler className="w-6 h-6 text-purple-600" />,
    href: "/tool/unit-converter",
    bg: "bg-purple-50/50",
    colSpan: "md:col-span-2"
  },
  {
    title: "Material Calculator",
    description: "Structural load and material requirement processor.",
    icon: <Zap className="w-6 h-6 text-amber-600" />,
    href: "/tool/material-calculator",
    bg: "bg-amber-50/50"
  }
];

const stats = [
  { label: "Active Nodes", value: "1,204", icon: <Globe className="w-3 h-3" /> },
  { label: "System Load", value: "12%", icon: <Activity className="w-3 h-3" /> },
  { label: "Secured", value: "AES-256", icon: <Lock className="w-3 h-3" /> },
];

export default function DashMain2D() {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Structural Grid Decor */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10">
        
        {/* Spacer for clean top entry */}
        <div className="h-12" />

        {/* Bento Grid 2D */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          
          {/* Featured: Tools Catalog */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 md:row-span-2"
          >
            <Link 
              href="/dashboard"
              className="group flex flex-col justify-between h-full p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:border-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
            >
              <div>
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                  <LayoutTemplate className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">TOOLS <br/> CATALOG</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm">
                  Access the complete suite of high-fidelity engineering utilities and AI processors.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-10 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                <span>Explore Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>

          {/* Secondary Links */}
          {mainLinks.filter(l => l.title !== "Tools Catalog").map((link, i) => (
            <motion.div 
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className={link.colSpan || "col-span-1"}
            >
              <Link 
                href={link.href}
                className={`group flex flex-col justify-between h-full p-8 ${link.bg} border border-slate-100 rounded-[2rem] hover:bg-white hover:border-indigo-600/20 hover:shadow-xl transition-all duration-500`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm group-hover:border-indigo-200 group-hover:scale-110 transition-all">
                    {link.icon}
                  </div>
                  {link.badge && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded-lg bg-white">
                      {link.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{link.title}</h3>
                  <p className="text-[11px] text-slate-500 font-bold leading-snug uppercase tracking-wider">{link.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <footer className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-slate-100 opacity-60">
           <div className="flex gap-10 mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">Low Latency Compute</span>
              </div>
           </div>
           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
             © 2026 Engineering Hub Global
           </div>
        </footer>

      </div>
    </div>
  );
}
