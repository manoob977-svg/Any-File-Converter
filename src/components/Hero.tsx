"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-400 text-sm font-medium mb-6 inline-block">
            <Sparkles className="w-4 h-4 inline mr-2" />
            AI-Powered Conversion Engine
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Convert or Merge <span className="text-gradient">PDFs</span> <br />
            with Perfect Precision.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Extract tables to Excel or merge multiple documents in seconds. 
            Secure, fast, and remarkably accurate tool for your documents.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tool/pdf-to-excel" className="btn-primary flex items-center gap-2">
              Start Converting <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/tool/merge-pdf" className="px-8 py-4 rounded-full font-semibold glass border border-white/10 hover:bg-white/5 transition-all">
              Merge PDFs
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="glass-card max-w-4xl mx-auto p-1 border-indigo-500/20 shadow-2xl overflow-hidden group">
            <div className="bg-gray-900/50 rounded-xl aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 group-hover:opacity-100 transition-opacity opacity-0" />
              <FileSpreadsheet className="w-20 h-20 text-indigo-500 opacity-50" />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, title: "Lightning Fast", desc: "Batch process hundreds of pages in seconds." },
            { icon: <Shield className="w-6 h-6 text-green-400" />, title: "Secure & Private", desc: "Enterprise-grade encryption and auto-deletion." },
            { icon: <FileSpreadsheet className="w-6 h-6 text-blue-400" />, title: "Precision Table extraction", desc: "AI-based detection for complex structures." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card text-left"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
