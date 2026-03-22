"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Settings, CheckCircle, AlertCircle, 
  ArrowRight, Download, File as FileIcon, X,
  Info
} from "lucide-react";

export default function CadToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const filename = selectedFile.name.toLowerCase();
      if (filename.endsWith(".dxf") || filename.endsWith(".dwg")) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a valid AutoCAD file (.DWG or .DXF).");
        setFile(null);
      }
    }
  };

  const handleConvert = async () => {
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
      const response = await fetch("http://localhost:8000/convert/cad-to-pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Conversion failed. Ensure the DXF file is not corrupted.");
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
      }, 1500);

    } catch (err) {
      clearInterval(progressInterval);
      let errMsg = err instanceof Error ? err.message : "Something went wrong.";
      // Clean up technical error prefix
      errMsg = errMsg.replace(/^500: CAD to PDF conversion failed: /, "");
      setError(errMsg);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white overflow-hidden">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-44 pb-20 px-6 max-w-4xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Settings className="w-4 h-4" />
            CAD to PDF
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">AutoCAD to <span className="text-amber-400">PDF</span></h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            High-precision rendering for your architectural and engineering drawings. 
            Convert DXF files natively, or DWG files with AutoCAD integration.
          </p>
        </motion.div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl">
          {status === "idle" && (
            <div className="space-y-8">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div className="text-sm text-amber-200/80 leading-relaxed">
                  <span className="font-bold text-amber-400">File Support:</span> We support both <span className="font-bold">.DWG</span> and <span className="font-bold">.DXF</span>. 
                  <br />
                  <span className="italic opacity-80 underline">Note: .DWG conversion requires AutoCAD to be installed on the server. For instant results without software, please upload .DXF files.</span>
                </div>
              </div>

              {!file ? (
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-16 text-center hover:border-amber-500/40 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <input 
                    type="file" 
                    id="fileInput" 
                    className="hidden" 
                    accept=".dxf,.dwg"
                    onChange={handleFileChange}
                  />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-amber-400" />
                    </div>
                    <p className="text-2xl font-medium text-white mb-2">Upload CAD Drawing</p>
                    <p className="text-gray-500">Fast, precise vector conversion</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <FileIcon className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{file.name}</h3>
                      <p className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="p-3 bg-white/5 rounded-full hover:bg-rose-500/20 hover:text-rose-400 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                disabled={!file}
                onClick={handleConvert}
                className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  file 
                    ? "bg-gradient-to-r from-amber-600 to-amber-400 hover:opacity-90 shadow-amber-500/20" 
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                Render to PDF
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {(status === "uploading" || status === "processing") && (
            <div className="py-20 text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-amber-500 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-amber-400 animate-spin-slow" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {status === "uploading" ? "Analyzing Layers..." : "Rendering DXF..."}
              </h3>
              <div className="max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-500 font-mono text-sm tracking-widest">{Math.round(progress)}% RENDERING</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4">CAD Render Success!</h2>
              <p className="text-gray-400 mb-8">{filename} is ready for download.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={downloadUrl!}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </a>
                <button 
                  onClick={() => { setStatus("idle"); setFile(null); setDownloadUrl(null); }}
                  className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-12 text-center text-rose-400">
              <AlertCircle className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4 italic">Rendering Interrupted</h2>
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
    </main>
  );
}
