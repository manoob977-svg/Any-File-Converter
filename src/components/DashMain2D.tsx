"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Ruler, LayoutTemplate, FileText, 
  Layers, ArrowRight, Sparkles, Zap, Shield,
  TrendingUp, Clock, Star, ShieldCheck,
  ChevronRight, Activity, Globe, Lock
} from "lucide-react";
import Link from "next/link";

const leftLink = {
  title: "TOOLS CATALOG",
  description: "Access the complete suite of high-fidelity engineering utilities and AI processors.",
  icon: <LayoutTemplate className="w-10 h-10 text-white" />,
  href: "/dashboard",
  cta: "EXPLORE CATALOG"
};

const rightLinks = [
  {
    title: "ESTIMATE HUB",
    description: "INDUSTRIAL-GRADE PROJECT COST AND MATERIAL ESTIMATION ENGINE.",
    icon: <Calculator className="w-5 h-5 text-indigo-600" />,
    href: "/estimate",
    badge: "ENTERPRISE",
  },
  {
    title: "DRAWING HUB",
    description: "2D & 3D CAD BLUEPRINT MANAGEMENT SYSTEM.",
    icon: <Layers className="w-5 h-5 text-blue-600" />,
    href: "/drawing",
  },
  {
    title: "MATERIAL CALCULATOR",
    description: "STRUCTURAL LOAD AND MATERIAL REQUIREMENT PROCESSOR.",
    icon: <Zap className="w-5 h-5 text-amber-600" />,
    href: "/tool/material-calculator",
  },
  {
    title: "UNIT CONVERTER",
    description: "PRECISION CONVERSION FOR GLOBAL ENGINEERING STANDARDS.",
    icon: <Ruler className="w-5 h-5 text-purple-600" />,
    href: "/tool/unit-converter",
  }
];

export default function DashMain2D() {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Spacer for clean top entry */}
        <div className="h-4" />

        {/* Bento Grid 2D - Specific Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Left Side: Large vertical card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            <Link 
              href={leftLink.href}
              className="group flex flex-col justify-between h-full min-h-[600px] p-12 bg-[#e8eef6] border-[3px] border-slate-950 rounded-[2.5rem] hover:shadow-[8px_8px_0px_rgba(15,23,42,1)] transition-all duration-300"
            >
              <div>
                <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center mb-16 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                  {leftLink.icon}
                </div>
                <h2 className="text-6xl font-black tracking-tighter mb-8 leading-[0.9] text-slate-950">
                  TOOLS <br/> CATALOG
                </h2>
                <p className="text-slate-600 font-bold text-xl leading-relaxed max-w-sm">
                  {leftLink.description}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-12 text-indigo-600 font-black text-sm uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                <span>{leftLink.cta}</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </motion.div>

          {/* Right Side: 4 vertical-stacked horizontal cards */}
          <div className="flex flex-col gap-4 h-full">
            {rightLinks.map((link, i) => (
              <motion.div 
                key={link.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex-1"
              >
                <Link 
                  href={link.href}
                  className="group flex flex-col justify-center h-full min-h-[145px] p-8 bg-[#e8eef6] border-[3px] border-slate-950 rounded-[2.2rem] hover:shadow-[6px_6px_0px_rgba(15,23,42,1)] transition-all duration-300"
                >
                  <div className="flex gap-6 items-center">
                    {/* Icon Box */}
                    <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center shrink-0 group-hover:border-indigo-400 group-hover:scale-105 transition-all">
                      {link.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                         <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase">{link.title}</h3>
                         {link.badge && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded-lg bg-white">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-black leading-tight uppercase tracking-wider">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Footer Info */}
        <footer className="flex flex-col md:flex-row items-center justify-between pt-12 border-t-2 border-slate-950/10">
           <div className="flex gap-10 mb-6 md:mb-0 opacity-40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-950" />
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
