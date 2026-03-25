"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import FooterV2 from "@/components/FooterV2";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, Layers, FileText, Download, 
  Database, Plus, Sparkles, ArrowRight, Settings, 
  User, LayoutTemplate, Zap, Image, Ruler, Calculator,
  ShieldCheck, Lock, Binary, Cpu
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "PDF to Excel",
    description: "Convert tables from PDF to Excel spreadsheets.",
    icon: <FileSpreadsheet className="w-8 h-8 text-emerald-400" />,
    href: "/tool/pdf-to-excel",
    glow: "bg-emerald-500/10",
    badge: "Popular",
    colSpan: "md:col-span-2"
  },
  {
    title: "PDF to Word",
    description: "Convert your PDFs to editable DOCX files.",
    icon: <FileText className="w-8 h-8 text-indigo-400" />,
    href: "/tool/pdf-to-word",
    glow: "bg-indigo-500/10",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files or reorder pages.",
    icon: <Layers className="w-8 h-8 text-blue-400" />,
    href: "/tool/merge-pdf",
    glow: "bg-blue-500/10",
    badge: "New"
  },
  {
    title: "Material Calculator",
    description: "High-precision estimation for Bricks, Concrete, Tiles.",
    icon: <Calculator className="w-8 h-8 text-purple-400" />,
    href: "/tool/material-calculator",
    glow: "bg-purple-500/20",
    badge: "Precision",
    colSpan: "md:col-span-2"
  },
  {
    title: "CAD to PDF",
    description: "Professional DXF/DWG conversion.",
    icon: <Settings className="w-8 h-8 text-amber-500" />,
    href: "/tool/cad-to-pdf",
    glow: "bg-amber-500/10",
  },
  {
    title: "Neural OCR",
    description: "AI-based extraction for complex data.",
    icon: <Binary className="w-8 h-8 text-cyan-400" />,
    href: "/tool/ai-enhancer",
    glow: "bg-cyan-500/10",
    colSpan: "md:col-span-1"
  },
  {
    title: "Length Converter",
    icon: <Ruler className="w-8 h-8 text-indigo-400" />,
    description: "Engineering unit system.",
    href: "/tool/unit-converter?category=Length",
    glow: "bg-indigo-500/20",
  },
  {
    title: "Compress PDF",
    description: "Reduce file size without losing quality.",
    icon: <Download className="w-8 h-8 text-rose-400" />,
    href: "/tool/compress-pdf",
    glow: "bg-rose-500/10",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#020202] text-white flex overflow-hidden font-sans">
      <DashboardSidebar />
      
      <div className="flex-1 h-screen overflow-hidden relative">
        <Navbar />
        
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[160px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[160px] animate-pulse delay-700" />
        </div>

        <div className="relative pt-24 pb-8 px-6 max-w-7xl mx-auto z-10 w-full h-full flex flex-col justify-between">
            
          {/* Header Section - Compact */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 px-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-inner">
                    <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-500">System.Console.v11.4</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-2">
                Precision <br />
                <span className="text-gradient uppercase">Catalog.</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-medium tracking-wide max-w-xs uppercase">
                AI document intelligence and engineering workspace.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex flex-col gap-4"
            >
               <div className="glass-card flex items-center gap-4 !p-4 border-indigo-500/20 bg-indigo-500/5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Cpu size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">Compute Load</h3>
                    <p className="text-lg font-black tracking-tighter">0.05ms</p>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Bento Tool Grid - Scrollable if needed but compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-y-auto custom-scrollbar pr-2">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`${tool.colSpan || "col-span-1"}`}
              >
                <Link 
                  href={tool.href}
                  className={`group relative block h-full p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden backdrop-blur-sm`}
                >
                  <div className={`absolute -top-10 -right-10 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 blur-[40px] ${tool.glow}`} />
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all duration-500">
                                {tool.icon}
                            </div>
                            {tool.badge && (
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 group-hover:text-indigo-400 transition-all">
                                    {tool.badge}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-indigo-400 transition-colors uppercase">{tool.title}</h3>
                        <p className="text-gray-500 text-[10px] font-medium leading-tight max-w-[200px] group-hover:text-gray-400 transition-colors">
                            {tool.description}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-400/0 group-hover:text-indigo-400/100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                        <span>Initiate Protocol</span>
                        <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <FooterV2 />
        </div>
      </div>
    </main>
  );
}
