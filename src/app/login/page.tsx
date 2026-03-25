"use client";

import Navbar from "@/components/Navbar";
import { FileText, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email === "admin" && formData.password === "admin") {
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Use 'admin' / 'admin'.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-white font-sans overflow-hidden">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[160px] animate-pulse delay-700" />
      </div>

      <div className="relative pt-24 pb-12 px-4 flex items-center justify-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="glass-card w-full max-w-md p-8 border-white/5 relative overflow-hidden"
        >
          <div className="text-center mb-10 relative z-10">
            <div className="inline-flex p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 group transition-all">
               <ShieldCheck className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Authorize</h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide">Enter the Engineering Hub terminal.</p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Identity / Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="text" 
                        required
                        placeholder="admin"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 hover:bg-white/[0.07] transition-all font-medium text-sm"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Access Key</label>
                    <Link href="#" className="text-[8px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">Forgot?</Link>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 hover:bg-white/[0.07] transition-all font-medium text-sm"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
            </div>

            {error && (
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full py-5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-500/20">
               Confirm Identity <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              New Engineer? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">Request Access</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
