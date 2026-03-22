"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Sparkles, CheckCircle, AlertCircle, 
  ArrowRight, Download, Image as ImageIcon, X,
  Zap, Wand2
} from "lucide-react";
import Link from "next/link";

export default function AiEnhancerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [enhancedPreview, setEnhancedPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError(null);
      } else {
        setError("Please upload a valid image file (JPG, PNG, WebP).");
      }
    }
  };

  const handleEnhance = async () => {
    if (!file) return;

    setStatus("uploading");
    setError(null);
    setProgress(10);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) return prev + Math.random() * 5;
        return prev;
      });
    }, 1000);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/convert/enhance-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Enhancement failed. Please try a different image.");
      }

      const data = await response.json();
      
      setProgress(100);
      setStatus("success");
      setDownloadUrl(data.downloadUrl);
      setEnhancedPreview(data.downloadUrl); // In this case, the download URL can also be our preview

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white overflow-hidden">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-32 pb-20 px-6 max-w-5xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI Image Enhancer
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Sharpen Your <span className="text-cyan-400">Vision</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Transform blurry or low-res photos into crisp, professional visuals 
            using advanced AI sharpening and noise reduction.
          </p>
        </motion.div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          {status === "idle" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-center min-h-[400px] ${
                  file ? "border-cyan-500/40 bg-cyan-500/5" : "border-white/10 hover:border-cyan-500/40"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {!preview ? (
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-medium text-white mb-2">Upload Original Image</p>
                    <p className="text-gray-500 italic">JPG, PNG, WebP supported</p>
                  </div>
                ) : (
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <img src={preview} alt="Upload" className="w-full h-full object-contain" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                      className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-rose-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    AI Enhancement Details
                  </h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      Smart Edge Sharpening
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      Bilateral Noise Reduction
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      Adaptive Contrast (CLAHE)
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                      Color Vibrance Correction
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-2 text-sm italic">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <button
                  disabled={!file}
                  onClick={handleEnhance}
                  className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-lg ${
                    file 
                      ? "bg-gradient-to-r from-cyan-600 to-blue-500 hover:scale-[1.02] shadow-cyan-500/20" 
                      : "bg-white/5 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  <Wand2 className="w-6 h-6" />
                  Enhance Quality Now
                </button>
              </div>
            </div>
          )}

          {(status === "uploading" || status === "processing") && (
            <div className="py-20 text-center">
              <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-cyan-500 rounded-full border-t-transparent shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="w-12 h-12 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-6 italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                AI PROCESSING...
              </h3>
              <div className="max-w-md mx-auto px-10">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs font-mono text-gray-500 tracking-tighter">
                  <span>ANALYZING PIXELS</span>
                  <span>{Math.round(progress)}% COMPLETE</span>
                  <span>UPSCALING EDGES</span>
                </div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-8 space-y-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-4xl font-bold mb-2">Enhancement Complete!</h2>
                <p className="text-gray-400">Your image has been professionally sharpened and polished.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="space-y-4">
                  <p className="text-center text-xs font-bold text-gray-500 tracking-widest uppercase">Result Preview</p>
                  <div className="aspect-square rounded-2xl overflow-hidden border border-cyan-500/30 bg-black/40 shadow-2xl shadow-cyan-500/10">
                    <img 
                      src={enhancedPreview!} 
                      className="w-full h-full object-contain" 
                      alt="Enhanced" 
                    />
                  </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h4 className="font-bold mb-2 text-cyan-400 italic">AI Improvements Applied:</h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                      We've reduced digital noise, balanced the lighting with adaptive histogram equalization, 
                      and applied an industrial-grade sharpening mask to recover lost details.
                    </p>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md w-fit">
                      Premium Quality Enabled
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <a 
                      href={downloadUrl!}
                      className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-xl font-black text-lg hover:bg-cyan-50 hover:scale-[1.02] transition-all shadow-xl"
                    >
                      <Download className="w-6 h-6" />
                      DOWNLOAD ENHANCED IMAGE
                    </a>
                    <button 
                      onClick={() => { setStatus("idle"); setFile(null); setPreview(null); setDownloadUrl(null); }}
                      className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-gray-400"
                    >
                      Process Another Image
                    </button>
                    <Link href="/dashboard" className="text-center text-sm text-gray-600 hover:text-cyan-400 transition-colors">
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-20 text-center">
              <AlertCircle className="w-20 h-20 text-rose-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4 text-rose-400 italic">AI Model Interrupted</h2>
              <p className="text-gray-400 mb-10 max-w-sm mx-auto">{error}</p>
              <button 
                onClick={() => setStatus("idle")}
                className="px-12 py-4 bg-rose-500/20 border border-rose-500/40 rounded-xl font-bold hover:bg-rose-500/30 transition-all shadow-lg shadow-rose-500/10"
              >
                TRY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="relative z-10 py-10 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          <span className="font-mono">OPEN-CV ENGINE: V4.8.0-AI-READY</span>
        </div>
        <p>&copy; 2026 AnyConv. Private & Encrypted AI Processing.</p>
      </footer>
    </main>
  );
}
