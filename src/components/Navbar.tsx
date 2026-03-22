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
    { name: "Dashboard", href: "/dashboard" },
    { name: "Estimate", href: "#" },
    { name: "Drawings", href: "#" },
  ];

  const toolsLinks = [
    { name: "Tools Catalog", href: "/dashboard" },
    { name: "Unit Converter", href: "/tool/unit-converter" },
    { name: "Material Calculator", href: "/tool/material-calculator" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto bg-black/40 border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:rotate-12 transition-transform">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">Engineering Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`text-[11px] font-bold uppercase tracking-widest transition-all ${
                isActive(link.href) ? "text-indigo-400" : "text-white/60 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-12" /> {/* Spacer */}

          {toolsLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`text-[11px] font-bold uppercase tracking-widest transition-all ${
                isActive(link.href) && link.href !== "#" ? "text-indigo-400" : "text-white/60 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-4" />

          <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
            Sign In
          </Link>
          <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all">
            Sign Up
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-4 right-4 glass rounded-2xl p-6 flex flex-col gap-4"
        >
          <Link href="/tool/pdf-to-excel" className="text-lg font-medium">PDF to Excel</Link>
          <Link href="/tool/pdf-to-word" className="text-lg font-medium">PDF to Word</Link>
          <Link href="/tool/merge-pdf" className="text-lg font-medium">Merge PDF</Link>
          <Link href="/tool/compress-pdf" className="text-lg font-medium">Compress PDF</Link>
          <Link href="/login" className="btn-primary text-center">Get Started</Link>
        </motion.div>
      )}
    </nav>
  );
}
