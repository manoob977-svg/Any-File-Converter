"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Minimize2, Download, CheckCircle, AlertCircle, 
  Loader2, ArrowRight, Zap, Target, Shield 
} from "lucide-react";
import FileUpload from "@/components/ui/FileUpload";

type Status = "idle" | "uploading" | "processing" | "success" | "error";
type Power = "low" | "medium" | "high";

export default function CompressPdfPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [power, setPower] = useState<Power>("medium");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFilename(file.name);
    setStatus("uploading");
    setError(null);
    setProgress(10);

    // Start a simulated progress timer to show activity
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.random() * 5;
        return prev;
      });
    }, 800);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("power", power);

    try {
      const response = await fetch("http://localhost:8000/convert/compress-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Compression failed. Please try again.");
      }

      const data = await response.json();
      
      setProgress(95);
      setStatus("processing");

      // Final completion
      setTimeout(() => {
        setProgress(100);
        setStatus("success");
        setDownloadUrl(data.downloadUrl);
        setFilename(data.filename);
      }, 1000);

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-[#020202]">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Advanced PDF Optimizer</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Compress <span className="text-gradient from-purple-500 to-indigo-600">PDF</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto font-medium"
          >
            Reduce file size significantly while maintaining perfect visual quality for sharing and storage.
          </motion.p>
        </div>

        {/* Compression Level Selector */}
        {status === "idle" && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex flex-wrap justify-center gap-4 mb-10"
           >
              {[
                { id: "low", label: "Low", desc: "Best Quality", icon: <Target className="w-4 h-4" /> },
                { id: "medium", label: "Medium", desc: "Balanced", icon: <Zap className="w-4 h-4" /> },
                { id: "high", label: "High", desc: "Max Size Redux", icon: <Minimize2 className="w-4 h-4" /> },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setPower(lvl.id as Power)}
                  className={`px-8 py-4 rounded-2xl glass border transition-all flex flex-col items-center gap-1 min-w-[140px] ${
                    power === lvl.id 
                    ? "border-purple-500 bg-purple-500/10 scale-105 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]" 
                    : "border-white/5 hover:border-white/20"
                  }`}
                >
                   <div className={`p-2 rounded-lg mb-1 ${power === lvl.id ? 'text-purple-400' : 'text-gray-500'}`}>
                      {lvl.icon}
                   </div>
                   <span className="font-bold text-sm">{lvl.label}</span>
                   <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{lvl.desc}</span>
                </button>
              ))}
           </motion.div>
        )}

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative glass-card p-1 md:p-2 rounded-[2.5rem] overflow-hidden">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 md:p-16"
                >
                  <FileUpload onFileSelect={handleFileSelect} />
                  
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: <Zap className="w-5 h-5" />, title: "Smart Shrink", desc: "Optimized object removal" },
                      { icon: <Shield className="w-5 h-5" />, title: "Lossless Streams", desc: "Deflate stream compression" },
                      { icon: <ArrowRight className="w-5 h-5" />, title: "Fast Delivery", desc: "Ready in seconds" },
                    ].map((item, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-purple-400">
                           {item.icon}
                        </div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {(status === "uploading" || status === "processing") && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-24 md:py-32 text-center"
                >
                  <div className="relative inline-block mb-10">
                    <div className="w-32 h-32 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-purple-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-4">
                    {status === "uploading" ? "Preparing File..." : "Optimizing Assets..."}
                  </h3>
                  <div className="max-w-md mx-auto w-full bg-white/5 rounded-full h-3 overflow-hidden mb-6 p-0.5 border border-white/5">
                    <motion.div
                      className="h-full bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-500 font-bold text-sm tracking-widest">{Math.round(progress)}% COMPLETE</p>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 md:py-24 text-center"
                >
                  <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-purple-500/30">
                    <CheckCircle className="w-12 h-12 text-purple-500" />
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-gradient from-purple-400 to-indigo-500">Compression Complete!</h3>
                  <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto font-medium">
                    Your PDF has been expertly optimized and is now ready for efficient sharing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="btn-primary px-10 py-4 flex items-center gap-3 justify-center text-sm font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-700 shadow-purple-900/20"
                    >
                      Download Compressed PDF
                    </button>
                    <button
                      onClick={() => setStatus("idle")}
                      className="px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest glass border border-white/10 hover:bg-white/5 transition-all"
                    >
                      New Conversion
                    </button>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 md:py-24 text-center"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Compression Interrupted</h3>
                  <p className="text-red-400 font-medium mb-10 px-8">{error}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest"
                  >
                    Try Another File
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
