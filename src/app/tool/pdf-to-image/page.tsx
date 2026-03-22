"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertCircle, 
  ArrowRight, Download, Image, X,
  FileImage, Archive
} from "lucide-react";
import Link from "next/link";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultFilename, setResultFilename] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a valid PDF file.");
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
    }, 800);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/convert/pdf-to-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Conversion failed.");
      }

      const data = await response.json();
      
      setProgress(100);
      setStatus("success");
      setDownloadUrl(data.downloadUrl);
      setResultFilename(data.filename);

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
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative pt-44 pb-20 px-6 max-w-5xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Image className="w-4 h-4" />
            PDF to Image Converter
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Convert PDF to <span className="text-emerald-400">High-Res Images</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Extract every page of your PDF as a crisp PNG image. All pages are bundled 
            into a secure, high-quality ZIP archive for easy sharing.
          </p>
        </motion.div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 shadow-2xl">
          {status === "idle" && (
            <div className="space-y-8">
              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group relative overflow-hidden ${
                  file ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10 hover:border-emerald-500/40"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                {!file ? (
                  <>
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-medium text-white mb-2">Upload your PDF</p>
                    <p className="text-gray-500">or drag and drop it here</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                      <FileText className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-xl font-bold text-white mb-1">{file.name}</p>
                    <p className="text-gray-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-4 px-4 py-2 bg-white/5 rounded-lg text-xs hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                disabled={!file}
                onClick={handleConvert}
                className={`w-full py-5 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-lg ${
                  file 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:scale-[1.02] shadow-emerald-500/20" 
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                {status === "idle" ? "Start Extraction" : "Processing..."}
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-3 gap-4 pt-4 text-center text-xs text-gray-500">
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>100% Secure</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>High Resolution</p>
                </div>
                <div className="space-y-2">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p>Page to PNG</p>
                </div>
              </div>
            </div>
          )}

          {(status === "uploading" || status === "processing") && (
            <div className="py-20 text-center">
              <div className="relative w-28 h-28 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                <motion.div 
                  className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <h3 className="text-3xl font-bold mb-4">Extracting Pages...</h3>
              <p className="text-gray-400 mb-10">Generating high-quality images from your PDF.</p>
              
              <div className="max-w-md mx-auto">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-emerald-400 font-mono text-sm">{Math.round(progress)}% Complete</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-10 text-center space-y-8">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-2">Success!</h2>
                <p className="text-gray-400">Your images are ready to download in a single archive.</p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 max-w-md mx-auto transition-all hover:bg-white/10">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <Archive className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-center w-full overflow-hidden">
                   <p className="font-bold text-lg truncate px-4">{resultFilename}</p>
                   <p className="text-sm text-gray-500 lowercase tracking-widest">Image Bundle Archive (ZIP)</p>
                </div>
                
                <a 
                  href={downloadUrl!}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-emerald-50 hover:scale-[1.02] transition-all shadow-xl"
                >
                  <Download className="w-6 h-6" />
                  Download ZIP Archive
                </a>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={() => { setStatus("idle"); setFile(null); setDownloadUrl(null); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Convert another file
                </button>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-rose-400">Rendering Interrupted</h2>
              <p className="text-gray-400 mb-10 max-w-md mx-auto">
                We encountered an issue during PDF extraction. {error}
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="px-12 py-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
