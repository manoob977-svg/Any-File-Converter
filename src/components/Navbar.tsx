"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: "Estimate", href: "/estimate" },
    { name: "Drawing", href: "/drawing" },
    { name: "Tools Catalog", href: "/dashboard" },
    { name: "Unit Converter", href: "/tool/unit-converter" },
    { name: "Material", href: "/tool/material-calculator" },
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 pointer-events-none">
      <div className="max-w-7xl mx-auto bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-500/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-gradient">Engineering Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`relative text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-white ${
                isActive(link.href) ? "text-indigo-400" : "text-white/40"
              } group`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full ${isActive(link.href) ? "w-full" : ""}`} />
            </Link>
          ))}
          
          <div className="h-4 w-px bg-white/10 mx-2" />

          <div className="flex items-center gap-4 ml-4">
            <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary scale-75 hover:scale-95 transition-all">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-white/40" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-4 right-4 glass rounded-2xl p-6 flex flex-col gap-4 z-[100]"
        >
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-lg font-medium text-white/80" onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <Link href="/login" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Login</Link>
          <Link href="/signup" className="text-center text-white/40 text-sm font-bold uppercase tracking-widest py-2" onClick={() => setIsOpen(false)}>Sign Up</Link>
        </motion.div>
      )}
    </nav>
  );
}
