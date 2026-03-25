"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Ruler, Calculator, 
  Settings, Zap, ShieldCheck, User, LogOut 
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Main Command", icon: <LayoutDashboard size={20} />, href: "/" },
    { name: "Estimate Hub", icon: <Calculator size={20} />, href: "/estimate" },
    { name: "Drawing Hub", icon: <Layers size={20} />, href: "/drawing" },
    { name: "Tools Catalog", icon: <FileText size={20} />, href: "/dashboard" },
    { name: "Engineering", icon: <Ruler size={20} />, href: "/tool/unit-converter" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-black/40 border-r border-white/5 backdrop-blur-3xl px-6 py-10 z-50">
      
      {/* Brand Mini */}
      <div className="flex items-center gap-3 mb-16 px-2">
        <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tighter text-white">Engineering Hub</span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400/60">Core Suite 4.0</span>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 space-y-2">
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 mb-6 pl-2">Navigation</div>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-500 group ${
              pathname === item.href 
                ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" 
                : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className={`transition-transform duration-500 group-hover:scale-110 ${pathname === item.href ? "text-indigo-400" : "group-hover:text-indigo-400"}`}>
              {item.icon}
            </div>
            <span className="text-xs font-bold tracking-tight">{item.name}</span>
            {pathname === item.href && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}
          </Link>
        ))}
      </nav>

      {/* System Status Section */}
      <div className="mt-auto space-y-6">
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Secure Node</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full w-4/5 bg-emerald-500/50 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-6 border-t border-white/5">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-0.5">
               <User className="text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-white truncate uppercase tracking-widest leading-none">Arman.Dev</p>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1">Tier 1 Engineer</p>
          </div>
          <button className="p-2 text-gray-600 hover:text-red-400 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
