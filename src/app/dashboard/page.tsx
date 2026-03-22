"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  FileSpreadsheet, Layers, FileText, Download, 
  Database, Plus, Sparkles, ArrowRight, Settings, 
  User, LayoutTemplate, Zap, Image, Ruler, Calculator
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    title: "PDF to Excel",
    description: "Convert tables from PDF to Excel spreadsheets.",
    icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
    href: "/tool/pdf-to-excel",
    glow: "bg-emerald-500/10",
    border: "hover:border-emerald-500/20",
    badge: "Popular"
  },
  {
    title: "PDF to Word",
    description: "Convert your PDFs to editable DOCX files.",
    icon: <FileText className="w-6 h-6 text-indigo-400" />,
    href: "/tool/pdf-to-word",
    glow: "bg-indigo-500/10",
    border: "hover:border-indigo-500/20",
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files or reorder pages.",
    icon: <Layers className="w-6 h-6 text-blue-400" />,
    href: "/tool/merge-pdf",
    glow: "bg-blue-500/10",
    border: "hover:border-blue-500/20",
    badge: "New"
  },
  {
    title: "Compress PDF",
    description: "Reduce file size without losing quality.",
    icon: <Download className="w-6 h-6 text-purple-400" />,
    href: "/tool/compress-pdf",
    glow: "bg-purple-500/10",
    border: "hover:border-purple-500/20",
  },
  {
    title: "Word to PDF",
    description: "Fast Word to PDF conversion.",
    icon: <FileText className="w-6 h-6 text-blue-400" />,
    href: "/tool/word-to-pdf",
    glow: "bg-blue-500/10",
    border: "hover:border-blue-500/20",
  },
  {
    title: "Excel to PDF",
    description: "Spreadsheets to PDF format.",
    icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
    href: "/tool/excel-to-pdf",
    glow: "bg-emerald-500/10",
    border: "hover:border-emerald-500/20",
  },
  {
    title: "Image to PDF",
    description: "Convert photos to high-quality PDF.",
    icon: <Plus className="w-6 h-6 text-rose-400" />,
    href: "/tool/image-to-pdf",
    glow: "bg-rose-500/10",
    border: "hover:border-rose-500/20",
  },
  {
    title: "CAD to PDF",
    description: "Professional DXF/DWG conversion.",
    icon: <Settings className="w-6 h-6 text-amber-500" />,
    href: "/tool/cad-to-pdf",
    glow: "bg-amber-500/10",
    border: "hover:border-amber-500/20",
  },
  {
    title: "AI Enhancer",
    description: "Sharpen and enhance image quality.",
    icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
    href: "/tool/ai-enhancer",
    glow: "bg-cyan-500/10",
    border: "hover:border-cyan-500/20",
  },
  {
    title: "PDF to Image",
    description: "Extract PDF pages as high-quality PNGs.",
    icon: <Image className="w-8 h-8 text-emerald-400" />,
    href: "/tool/pdf-to-image",
    glow: "bg-emerald-500/20",
    border: "group-hover:border-emerald-500/50",
    badge: "NEW",
  },
  {
    title: "Length Converter",
    description: "Precision engineering length conversion tool.",
    icon: <Ruler className="w-8 h-8 text-indigo-400" />,
    href: "/tool/unit-converter?category=Length",
    glow: "bg-indigo-500/20",
    border: "group-hover:border-indigo-500/50",
    badge: "ACTIVE",
  },
  {
    title: "Material Calculator",
    description: "Estimate construction materials for Bricks, Concrete, Tiles & more.",
    icon: <Calculator className="w-8 h-8 text-purple-400" />,
    href: "/tool/material-calculator",
    glow: "bg-purple-500/20",
    border: "group-hover:border-purple-500/50",
    badge: "NEW",
  },
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 selection:text-white overflow-hidden">
      <Navbar />
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <LayoutTemplate className="w-4 h-4 text-gray-400" />
               </div>
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Available Plugins</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight">
              Tools <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Catalog.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
             <button className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <Settings className="w-5 h-5 text-gray-400" />
             </button>
             <Link href="#" className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-xs uppercase tracking-widest opacity-60">Profile</span>
             </Link>
          </motion.div>
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20 border-b border-white/5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                href={tool.href}
                className={`group relative block h-full p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 ${tool.border} transition-all duration-500 overflow-hidden`}
              >
                {/* Tool Ambient Light */}
                <div className={`absolute -top-20 -right-20 w-60 h-60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] ${tool.glow}`} />
                
                {/* Tool Content */}
                <div className="relative z-10 flex items-center gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-500">
                    <div className="group-hover:text-white transition-colors duration-500">
                      {tool.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-black tracking-tight">{tool.title}</h3>
                          {tool.badge && (
                             <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-transparent border border-white/20 text-white opacity-80 decoration-white">
                               {tool.badge}
                             </span>
                          )}
                      </div>
                      <p className="text-gray-500 text-sm font-medium pr-10">
                          {tool.description}
                      </p>
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Stats */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6"
        >
            <div className="md:col-span-8 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="flex items-start gap-5">
                    <div className="mt-1">
                      <Zap className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-3">Power Usage</h3>
                      <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                        You are currently on the free tier. Your files are automatically cleaned for security upon every exit.
                      </p>
                    </div>
                </div>
                <button className="flex-shrink-0 px-10 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-indigo-500/20">
                    Upgrade to Pro
                </button>
            </div>

            <div className="md:col-span-4 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center">
                 <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Cloud Health</div>
                 <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <Database className="w-6 h-6 text-gray-400" />
                    </div>
                    <span className="text-5xl font-black italic tracking-tighter">82%</span>
                 </div>
            </div>
        </motion.div>

      </div>
    </main>
  );
}
