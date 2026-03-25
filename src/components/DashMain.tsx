"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Ruler, LayoutTemplate, FileText, 
  Layers, ArrowRight, Sparkles, Zap, Shield,
  TrendingUp, Clock, Star, ShieldCheck
} from "lucide-react";
import Link from "next/link";

const mainLinks = [
  {
    title: "Estimate",
    description: "Project cost and material estimation engine.",
    icon: <Calculator className="w-8 h-8 text-emerald-400" />,
    href: "/estimate",
    glow: "bg-emerald-500/10",
    badge: "Pro",
    colSpan: "md:col-span-2"
  },
  {
    title: "Drawing",
    description: "CAD and blueprint management system.",
    icon: <Layers className="w-8 h-8 text-blue-400" />,
    href: "/drawing",
    glow: "bg-blue-500/10",
  },
  {
    title: "Tools Catalog",
    description: "Comprehensive suite of document utilities.",
    icon: <LayoutTemplate className="w-8 h-8 text-indigo-400" />,
    href: "/dashboard",
    glow: "bg-indigo-500/10",
    badge: "Most Used"
  },
  {
    title: "Unit Converter",
    description: "High-precision engineering unit systems.",
    icon: <Ruler className="w-8 h-8 text-purple-400" />,
    href: "/tool/unit-converter",
    glow: "bg-purple-500/20",
    colSpan: "md:col-span-2"
  },
  {
    title: "Material",
    description: "Structural material requirement calculator.",
    icon: <Zap className="w-8 h-8 text-amber-500" />,
    href: "/tool/material-calculator",
    glow: "bg-amber-500/10",
  }
];

const trendingItems = [
  { title: "Floor Tiles Pro", category: "Calculator", status: "Updated", icon: <TrendingUp className="w-3 h-3" /> },
  { title: "DXF to PDF Hub", category: "Drawing", status: "Latest", icon: <Clock className="w-3 h-3" /> },
  { title: "Beam Load Sync", category: "Analysis", status: "New", icon: <Star className="w-3 h-3" /> },
];

export default function DashMain() {
  return (
    <div className="h-full w-full flex flex-col px-6 py-8 overflow-hidden bg-black relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between py-6">
        
        {/* Top Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Systems Active</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">v11.4.0-Stable</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
            >
              Engineering <br />
              <span className="text-gradient">Command.</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:flex flex-col items-end gap-2"
          >
             <div className="flex items-center gap-4">
               <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Sign In</Link>
               <Link href="/signup" className="btn-primary !py-2 !px-6 scale-90">Join Hub</Link>
             </div>
             <p className="text-[8px] font-medium text-gray-600 uppercase tracking-widest mt-2">Ready for deployment</p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 max-h-[600px]">
          {/* Main Hero Card for Tools Catalog */}
          <div className="md:col-span-2 md:row-span-2">
             <Link 
              href="/dashboard"
              className="group relative block h-full p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-indigo-500/50 transition-all duration-700 overflow-hidden backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 p-8">
                <Sparkles className="w-12 h-12 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
              </div>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                    <LayoutTemplate className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-4xl font-black tracking-tighter mb-4 group-hover:text-indigo-400 transition-colors">TOOLS CATALOG</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                    Access the complete high-fidelity suite of engineering utilities and AI processors.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 group-hover:gap-6 transition-all duration-700">
                  <span>Enter Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>

          {/* Other Grid Items */}
          {mainLinks.filter(l => l.href !== "/dashboard").map((link, i) => (
            <div key={link.title} className={link.colSpan || "col-span-1"}>
              <Link 
                href={link.href}
                className="group relative block h-full p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity ${link.glow}`} />
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      {link.icon}
                    </div>
                    {link.badge && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight mb-1 uppercase group-hover:text-white transition-colors">{link.title}</h3>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight group-hover:text-gray-400 transition-colors">{link.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* Trending / Latest Section */}
          <div className="md:col-span-2 bg-white/[0.01] border border-white/5 rounded-[1.5rem] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Active Protocols</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500/40" />
            </div>
            <div className="space-y-3">
              {trendingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 group-hover:text-white transition-colors">{item.title}</p>
                      <p className="text-[8px] text-gray-600 font-medium uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400/60">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Section Branding */}
        <div className="mt-8 flex items-center justify-between px-2 opacity-40">
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encryption</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">Neural Processing</span>
             </div>
           </div>
           <span className="text-[8px] font-medium uppercase tracking-[0.4em]">Integrated Intelligence</span>
        </div>

      </div>
    </div>
  );
}
