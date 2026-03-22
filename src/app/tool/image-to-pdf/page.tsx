"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  ArrowRight, Download, Plus, X, Image as ImageIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => 
        ["image/jpeg", "image/png", "image/webp", "image/bmp"].includes(file.type)
      );
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setStatus("uploading");
    setError(null);
    setProgress(10);

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    // Simulated progress while waiting for backend
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + Math.random() * 10;
        return prev;
      });
    }, 800);

    try {
      const response = await fetch("http://localhost:8000/convert/image-to-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        throw new Error("Conversion failed. Please try again.");
      }

      const data = await response.json();
      
      setProgress(100);
      setStatus("success");
      setDownloadUrl(data.downloadUrl);

    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white overflow-hidden">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-32 pb-20 px-6 max-w-4xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-6">
            <ImageIcon className="w-4 h-4" />
            Image to PDF
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Convert Photos to <span className="text-rose-400">PDF</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Create high-quality PDF documents from your images in seconds. 
            Perfect for portfolios and scanning.
          </p>
        </motion.div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          {status === "idle" && (
            <div className="space-y-8">
              <div 
                className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-rose-500/40 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-rose-400" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">Click or drag images to upload</p>
                  <p className="text-gray-500">Supports JPG, PNG, WebP and BMP</p>
                </div>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt={file.name}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-[10px] truncate text-gray-300">{file.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleConvert}
                      className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 mt-8"
                    >
                      Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {(status === "uploading" || status === "processing") && (
            <div className="py-20 text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-rose-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Creating your PDF...</h3>
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    className="h-full bg-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-500 font-mono text-sm tracking-widest">{Math.round(progress)}% COMPLETE</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">PDF Created Successfully!</h2>
              <p className="text-gray-400 mb-8">Your images have been combined into a single document.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={downloadUrl!}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
                <button 
                  onClick={() => { setStatus("idle"); setFiles([]); setDownloadUrl(null); }}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Convert More
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-12 text-center text-rose-400">
              <AlertCircle className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4 italic">Conversion Interrupted</h2>
              <p className="text-gray-400 mb-8">{error}</p>
              <button 
                onClick={() => setStatus("idle")}
                className="px-8 py-4 bg-rose-500/20 border border-rose-500/40 rounded-xl font-bold hover:bg-rose-500/30 transition-all"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-10 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Server Status: Online & Optimized</span>
        </div>
        <p>&copy; 2026 AnyConv. Secure & Private conversion.</p>
      </footer>
    </main>
  );
}
