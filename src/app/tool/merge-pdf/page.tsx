"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { FilePlus, FileText, ArrowRight, CheckCircle, AlertCircle, Loader2, Files, GripVertical, Trash2, LayoutGrid, List } from "lucide-react";
import FileUpload from "@/components/ui/FileUpload";
import * as pdfjs from "pdfjs-dist";

// Set worker path for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Status = "idle" | "uploading" | "processing" | "success" | "error";

interface PageWithThumbnail {
  id: string;
  fileIndex: number;
  pageIndex: number;
  fileName: string;
  thumbnail: string;
}

export default function MergePdfPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [orderedPages, setOrderedPages] = useState<PageWithThumbnail[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Helper to handle reordering reliably
  const handleReorder = (newOrder: PageWithThumbnail[]) => {
    setOrderedPages(newOrder);
  };

  const generateThumbnailsForAllPages = async (file: File, fileIndex: number): Promise<PageWithThumbnail[]> => {
    const pages: PageWithThumbnail[] = [];
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          pages.push({
            id: `${Math.random().toString(36).substr(2, 9)}-${fileIndex}-${i}`,
            fileIndex,
            pageIndex: i - 1,
            fileName: file.name,
            thumbnail: canvas.toDataURL()
          });
        }
      }
    } catch (e) {
      console.error("Thumbnail extraction error:", e);
    }
    return pages;
  };

  const handleFileSelect = async (files: File[]) => {
    setError(null);
    const updatedSourceFiles = [...sourceFiles, ...files];
    setSourceFiles(updatedSourceFiles);

    const allNewPages: PageWithThumbnail[] = [];
    for (let i = sourceFiles.length; i < updatedSourceFiles.length; i++) {
        const pages = await generateThumbnailsForAllPages(updatedSourceFiles[i], i);
        allNewPages.push(...pages);
    }
    
    setOrderedPages(prev => [...prev, ...allNewPages]);
  };

  const startMerge = async () => {
    if (orderedPages.length < 2) {
      setError("Please have at least 2 pages in your merged document.");
      return;
    }

    setStatus("uploading");
    setError(null);
    setProgress(10);

    const formData = new FormData();
    sourceFiles.forEach((f) => {
      formData.append("files", f);
    });

    // Send the layout as a stringified JSON of [fileIndex, pageIndex]
    const layout = orderedPages.map(p => [p.fileIndex, p.pageIndex]);
    formData.append("layout", JSON.stringify(layout));

    try {
      const response = await fetch("http://localhost:8000/convert/merge-pdfs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Merging failed. Please try again.");
      }

      const data = await response.json();
      
      setProgress(50);
      setStatus("processing");

      let p = 50;
      const interval = setInterval(() => {
        p += 5;
        if (p >= 95) clearInterval(interval);
        setProgress(p);
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setStatus("success");
        setDownloadUrl(data.downloadUrl);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const removePage = (id: string) => {
    setOrderedPages(prev => prev.filter(p => p.id !== id));
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-primary-400 text-sm font-medium mb-6"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Visual PDF Organizer</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Organize & Merge <span className="text-gradient">Every Page</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            See every page from your PDFs. Drag and drop individual pages to reorder or remove them before merging.
          </motion.p>
        </div>

        <div className="space-y-12">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                {/* Upload Section */}
                <div className={orderedPages.length > 0 ? "max-w-4xl mx-auto opacity-70 hover:opacity-100 transition-opacity" : ""}>
                   <FileUpload onFileSelect={handleFileSelect} multiple={true} />
                </div>

                {/* Reorder Section */}
                {orderedPages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-4 md:p-10"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Page Organization</h3>
                        <p className="text-gray-400">Drag pages to rearrange. {viewMode === "grid" ? "Horizontal view for quick sorting." : "List view for detailed organization."}</p>
                      </div>
                      
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button 
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-500 hover:text-white"}`}
                            title="Filmstrip View"
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-gray-500 hover:text-white"}`}
                            title="List View"
                        >
                            <List className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className={viewMode === "grid" ? "overflow-x-auto pb-8 scrollbar-hide" : ""}>
                      <Reorder.Group
                        axis={viewMode === "grid" ? "x" : "y"}
                        values={orderedPages}
                        onReorder={handleReorder}
                        className={viewMode === "grid" ? "flex gap-6 min-w-max px-4" : "space-y-3 max-w-3xl mx-auto"}
                      >
                        {orderedPages.map((page, index) => (
                          <Reorder.Item
                            key={page.id}
                            value={page}
                            className={`relative group glass-card p-2 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors flex-shrink-0 ${
                                viewMode === "list" ? "flex items-center gap-4" : "w-40"
                            }`}
                          >
                            <div className={`relative ${viewMode === "grid" ? "aspect-[3/4] w-full" : "w-16 h-20"} bg-black/20 rounded-lg overflow-hidden border border-white/5`}>
                               {page.thumbnail ? (
                                  <img src={page.thumbnail} alt={`Page ${page.pageIndex + 1}`} className="w-full h-full object-cover" />
                               ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                      <FileText className="w-6 h-6 text-gray-700" />
                                  </div>
                               )}
                               <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                                  {page.pageIndex + 1}
                               </div>
                               
                               <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                            </div>

                            <div className={viewMode === "list" ? "flex-1 min-w-0" : "mt-3 px-1"}>
                              <p className="text-[10px] text-gray-500 truncate mb-1">{page.fileName}</p>
                              <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-gray-300">Pos {index + 1}</span>
                                  <button
                                      onClick={(e) => { e.stopPropagation(); removePage(page.id); }}
                                      className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                                  >
                                      <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                              </div>
                            </div>
                            
                            {viewMode === "list" && (
                                <GripVertical className="w-5 h-5 text-gray-600 ml-auto" />
                            )}
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>

                    {error && (
                      <div className="mt-8 flex items-center gap-2 text-red-400 text-sm glass p-4 rounded-xl border border-red-500/20 max-w-md mx-auto">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="mt-16 flex justify-center">
                      <button
                        onClick={startMerge}
                        disabled={orderedPages.length < 2 || status !== "idle"}
                        className={`btn-primary px-16 py-5 flex items-center gap-4 text-lg shadow-xl shadow-primary/20 ${
                          orderedPages.length < 2 ? "opacity-30 cursor-not-allowed grayscale" : "hover:scale-105"
                        }`}
                      >
                        Merge PDF <ArrowRight className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {(status === "uploading" || status === "processing") && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card py-32 text-center"
              >
                <div className="relative inline-block mb-12">
                  <div className="w-40 h-40 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-16 h-16 text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-4xl font-bold mb-6">
                  {status === "uploading" ? "Preparing high-quality pages..." : "Assembling your document..."}
                </h3>
                <div className="max-w-lg mx-auto w-full bg-white/5 rounded-full h-4 overflow-hidden mb-8 p-1 border border-white/5">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xl font-medium">{progress}% Complete</p>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card py-24 text-center max-w-4xl mx-auto"
              >
                <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-12 border border-green-500/30">
                  <CheckCircle className="w-14 h-14 text-green-500" />
                </div>
                <h3 className="text-5xl font-bold mb-8 text-gradient">Your PDF is Ready!</h3>
                <p className="text-gray-400 text-xl mb-14 leading-relaxed px-10">
                  We've successfully assembled your document in the exact order you specified.
                  Every page has been preserved with pixel-perfect accuracy.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center">
                  <button
                    onClick={handleDownload}
                    className="btn-primary px-12 py-5 flex items-center gap-3 justify-center text-lg hover:scale-105 transition-transform"
                  >
                    Download Merged PDF
                  </button>
                  <button
                    onClick={() => { setStatus("idle"); setOrderedPages([]); setSourceFiles([]); }}
                    className="px-12 py-5 rounded-full font-semibold glass border border-white/10 hover:bg-white/5 transition-all text-lg"
                  >
                    Start New Project
                  </button>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card py-24 text-center max-w-2xl mx-auto"
              >
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/30">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Assembly Failed</h3>
                <p className="text-red-400 text-xl mb-12 px-8">{error}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-primary px-12 py-5 text-lg"
                >
                  Return to Organizer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
