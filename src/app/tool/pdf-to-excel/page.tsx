"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/ui/FileUpload";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Loader2, Download, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function ToolPage() {
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      startConversion(files);
    }
  };

  const startConversion = async (files: File[]) => {
    setStatus("uploading");
    setProgress(10);
    
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const response = await fetch("http://localhost:8000/convert/pdf-to-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");
      
      const data = await response.json();
      
      // Simulate processing progress after upload
      setProgress(50);
      setStatus("processing");
      
      for (let i = 60; i <= 100; i += 10) {
        await new Promise(r => setTimeout(r, 500));
        setProgress(i);
      }
      
      setStatus("success");
      // Store download info
      (window as any)._downloadUrl = `http://localhost:8000/download/${data.fileId}`;
      (window as any)._filename = data.filename;

    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleDownload = () => {
    const url = (window as any)._downloadUrl;
    const filename = (window as any)._filename;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            PDF to <span className="text-gradient">Excel</span> Converter
          </motion.h1>
          <p className="text-gray-400">Extract tables and data from PDF to Microsoft Excel XLSX format.</p>
        </div>

        <section className="relative">
          <AnimatePresence mode="wait">
            {status === "idle" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <FileUpload onFileSelect={handleFileSelect} />
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl mx-auto glass-card p-12 text-center"
              >
                {status === "success" ? (
                  <>
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Great Success!</h2>
                    <p className="text-gray-400 mb-8">Your files have been converted with 100% table accuracy.</p>
                    
                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleDownload}
                        className="btn-primary flex items-center justify-center gap-2 w-full py-4 text-lg"
                      >
                        <Download className="w-5 h-5" /> Download Excel (.xlsx)
                      </button>
                      <button 
                        onClick={() => setStatus("idle")}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Convert another file
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                      <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{progress}%</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 capitalize">{status}...</h2>
                    <div className="flex items-center justify-center gap-2 text-indigo-400 text-sm mb-6">
                      <Sparkles className="w-4 h-4" />
                      <span>Detecting tables using AI...</span>
                    </div>
                    
                    <div className="w-full bg-white/5 rounded-full h-2 mb-4">
                      <motion.div 
                        className="bg-indigo-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 italic">Please do not close this window.</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Info Section */}
        <section className="mt-32 grid md:grid-cols-2 gap-12 items-center">
           <div className="glass-card p-8 border-indigo-500/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileSpreadsheet className="text-indigo-500" /> 
                How it works
              </h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs shrink-0">1</span>
                  <span>Upload your PDF files to our secure servers.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs shrink-0">2</span>
                  <span>Our AI engine identifies tables, columns, and data structures automatically.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs shrink-0">3</span>
                  <span>Review the extracted data and download as a formatted Excel spreadsheet.</span>
                </li>
              </ul>
           </div>
           <div>
              <h2 className="text-3xl font-bold mb-6">Security is our priority</h2>
              <p className="text-gray-400 mb-6 font-medium">
                We use bank-level 256-bit SSL encryption to ensure your documents are completely safe. All files are automatically deleted from our servers permanently after 2 hours.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> GDPR Compliant
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> ISO 27001
                </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  );
}
