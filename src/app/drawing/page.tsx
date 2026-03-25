"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import FooterV2 from "@/components/FooterV2";
import { motion } from "framer-motion";
import { 
  Layers, Settings, Box, Database, 
  ArrowRight, ShieldCheck, Cpu, LayoutTemplate,
  FileCode, PenTool
} from "lucide-react";
import Link from "next/link";

const drawingTools = [
  {
    title: "CAD to PDF",
    description: "Professional DXF/DWG document conversion.",
    icon: <Settings className="w-8 h-8 text-amber-500" />,
    href: "/tool/cad-to-pdf",
    glow: "bg-amber-500/10",
    badge: "Precision",
    colSpan: "md:col-span-2"
  },
  {
    title: "Layer Manager",
    description: "Extract and manage CAD drawings layers.",
    icon: <Layers className="w-8 h-8 text-blue-400" />,
    href: "#",
    glow: "bg-blue-500/10",
  },
  {
    title: "Blueprint OCR",
    description: "AI-based text extraction from diagrams.",
    icon: <Database className="w-8 h-8 text-cyan-400" />,
    href: "#",
    glow: "bg-cyan-500/10",
    badge: "Neural"
  },
  {
    title: "3D Visualizer",
    description: "Convert 2D plans into interactive 3D models.",
    icon: <Box className="w-8 h-8 text-indigo-400" />,
    href: "#",
    glow: "bg-indigo-500/20",
    colSpan: "md:col-span-2"
  }
];

export default function DrawingDashboard() {
  return (
    <main className="h-screen bg-[#020202] text-white flex overflow-hidden font-sans">
      <DashboardSidebar />
      
      <div className="flex-1 h-full overflow-hidden relative">
        <Navbar />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[160px] animate-pulse" />
        </div>

        <div className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto z-10 w-full h-full flex flex-col justify-between">
            
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <PenTool className="w-4 h-4 text-blue-400" />
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-500">Drawing.Terminal.v1.0</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-2 uppercase">
                Drawing <br />
                <span className="text-gradient">Console.</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-medium tracking-wide max-w-xs uppercase">
                High-fidelity blueprint management and CAD workflow.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex glass-card !p-4 border-blue-500/20 bg-blue-500/5"
            >
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <FileCode size={20} />
                  </div>
                  <div>
                    <h3 className="text-[8px] font-black uppercase tracking-widest text-blue-400 mb-0.5">Graphics Load</h3>
                    <p className="text-lg font-black tracking-tighter">0.02ms</p>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-y-auto custom-scrollbar pr-2">
            {drawingTools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={tool.colSpan || "col-span-1"}
              >
                <Link 
                  href={tool.href}
                  className="group relative block p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-10 transition-opacity ${tool.glow} blur-2xl`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all">
                        {tool.icon}
                      </div>
                      {tool.badge && (
                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500 group-hover:text-blue-400 transition-colors">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-blue-400 transition-colors uppercase">{tool.title}</h3>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight group-hover:text-gray-400 transition-colors">{tool.description}</p>
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
