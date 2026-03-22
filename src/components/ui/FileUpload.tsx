"use client";

import { useState, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isLoading?: boolean;
  multiple?: boolean;
}

export default function FileUpload({ onFileSelect, isLoading, multiple = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type === "application/pdf");
      if (multiple) {
        setFiles(prev => [...prev, ...newFiles]);
        onFileSelect([...files, ...newFiles]);
      } else {
        const singleFile = [newFiles[0]];
        setFiles(singleFile);
        onFileSelect(singleFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === "application/pdf");
      if (multiple) {
        setFiles(prev => [...prev, ...newFiles]);
        onFileSelect([...files, ...newFiles]);
      } else {
        const singleFile = [newFiles[0]];
        setFiles(singleFile);
        onFileSelect(singleFile);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`relative group glass-card min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${
          dragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-white/20 hover:border-indigo-500/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center p-12">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            <Upload className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Select PDF files</h2>
          <p className="text-gray-400 mb-8">or drag and drop them here</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="btn-primary"
          >
            Choose Files
          </button>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 space-y-4"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <File className="w-5 h-5" /> Selected Files ({files.length})
            </h3>
            {files.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <File className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-[200px] md:max-w-md">{file.name}</p>
                    <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
