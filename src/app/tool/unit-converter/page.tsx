"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { 
  ArrowRightLeft, Copy, RotateCcw, Search, 
  Ruler, Maximize, Database, Weight, Gauge, 
  Zap, Sun, Wind, Activity, HardDrive, 
  ExternalLink, ChevronRight, LayoutTemplate
} from "lucide-react";
import { 
  CATEGORIES, UNITS, UnitCategory, convertUnits, getConversionFormula 
} from "@/utils/conversions";

const categoryIcons: Record<UnitCategory, any> = {
  Length: Ruler,
  Area: Maximize,
  Volume: Database,
  "Weight/Mass": Weight,
  Pressure: Gauge,
  Force: Wind,
  "Energy/Work": Activity,
  Power: Zap,
  Temperature: Sun,
  Torque: RotateCcw
};

function UnitConverterContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  const initialCategory = useMemo(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam as UnitCategory)) {
      return categoryParam as UnitCategory;
    }
    return "Length";
  }, [categoryParam]);

  const [activeCategory, setActiveCategory] = useState<UnitCategory>(initialCategory);
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  // Sync category if URL param changes
  useEffect(() => {
    if (categoryParam && CATEGORIES.includes(categoryParam as UnitCategory)) {
      setActiveCategory(categoryParam as UnitCategory);
    }
  }, [categoryParam]);

  // Initialize units when category changes
  useEffect(() => {
    const categoryUnits = UNITS[activeCategory];
    if (categoryUnits && categoryUnits.length > 0) {
      setFromUnit(categoryUnits[0].value);
      setToUnit(categoryUnits[1]?.value || categoryUnits[0].value);
      setResult(null);
    }
  }, [activeCategory]);


  const categoryUnits = useMemo(() => UNITS[activeCategory] || [], [activeCategory]);
  
  const filteredFromUnits = useMemo(() => 
    categoryUnits.filter(u => u.label.toLowerCase().includes(searchFrom.toLowerCase())),
    [categoryUnits, searchFrom]
  );
  
  const filteredToUnits = useMemo(() => 
    categoryUnits.filter(u => u.label.toLowerCase().includes(searchTo.toLowerCase())),
    [categoryUnits, searchTo]
  );

  // Auto-calculate logic
  useEffect(() => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      const res = convertUnits(val, fromUnit, toUnit, activeCategory);
      setResult(res);
    } else {
      setResult(0);
    }
  }, [inputValue, fromUnit, toUnit, activeCategory]);

  const handleReverse = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#020202] text-white overflow-hidden flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Sidebar Navigation - More Compact */}
        <aside className="w-60 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col hidden lg:flex shrink-0">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                    isActive 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "group-hover:text-indigo-400"}`} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{cat}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-hidden p-4 md:p-6 bg-black flex flex-col">
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col gap-6 justify-center">
            
            {/* Category Selector - Top Like Image */}
            <div className="shrink-0 space-y-2">
               <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 block px-1">Unit Category</label>
               <select 
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value as UnitCategory)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm font-bold focus:border-indigo-500 focus:outline-none cursor-pointer appearance-none"
               >
                 {CATEGORIES.map(cat => (
                   <option key={cat} value={cat} className="bg-black">{cat}</option>
                 ))}
               </select>
            </div>

            {/* Converter Card - Matching Picture Layout */}
            <div className="bg-[#080808] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative">
               <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 blur-[100px] rounded-full -mr-30 -mt-30" />
               
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
                  
                  {/* LEFT BLOCK: Input Value & From Unit */}
                  <div className="flex-1 w-full space-y-2">
                      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden shadow-inner">
                         <input 
                            type="number"
                            min="1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full bg-transparent p-6 text-center text-5xl font-black tracking-tighter focus:bg-white/5 focus:outline-none transition-all"
                         />
                         <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                            <select 
                              value={fromUnit}
                              onChange={(e) => setFromUnit(e.target.value)}
                              className="w-full bg-transparent text-center font-bold text-[11px] uppercase tracking-widest focus:outline-none appearance-none cursor-pointer text-gray-400"
                            >
                              {categoryUnits.map(u => (
                                <option key={u.value} value={u.value} className="bg-[#0A0A0A]">{u.label}</option>
                              ))}
                            </select>
                         </div>
                      </div>
                  </div>

                  {/* EQUALS SIGN */}
                  <div className="shrink-0 flex items-center justify-center">
                     <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full border border-white/10 text-gray-500 shadow-xl">
                        <span className="text-2xl font-light">=</span>
                     </div>
                  </div>

                  {/* RIGHT BLOCK: Result Value & To Unit */}
                  <div className="flex-1 w-full space-y-2">
                      <div className="bg-indigo-500/[0.03] border border-indigo-500/10 rounded-xl overflow-hidden relative group cursor-pointer" onClick={handleCopy}>
                         <div className="w-full p-6 text-center text-5xl font-black tracking-tighter text-indigo-100 flex items-center justify-center min-h-[1.5em] group-hover:text-indigo-400 transition-colors">
                            {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 3 }) : "0"}
                         </div>
                         <div className="border-t border-indigo-500/10 p-4 bg-indigo-500/[0.05]">
                            <select 
                              value={toUnit}
                              onChange={(e) => setToUnit(e.target.value)}
                              className="w-full bg-transparent text-center font-bold text-[11px] uppercase tracking-widest focus:outline-none appearance-none cursor-pointer text-indigo-400/60"
                            >
                              {categoryUnits.map(u => (
                                <option key={u.value} value={u.value} className="bg-[#0A0A0A]">{u.label}</option>
                              ))}
                            </select>
                         </div>
                      </div>
                  </div>
               </div>

               {/* Formula / Hint Bar */}
               <div className="mt-8 flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-[9px] font-black uppercase tracking-widest leading-loose">Formula</span>
                  <p className="text-[10px] text-gray-500 font-medium tracking-tight">
                    {getConversionFormula(fromUnit, toUnit, activeCategory)}
                  </p>
               </div>
            </div>

            {/* Side-by-Side Ad Placeholder - Very Small */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
               <div className="h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[8px] font-black uppercase tracking-[0.5em] text-gray-800">
                  TOP AD SPACE
               </div>
               <div className="h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-[8px] font-black uppercase tracking-[0.5em] text-gray-800">
                  BOTTOM AD SPACE
               </div>
            </div>

          </div>
        </section>
      </div>

      {/* Mobile Sidebar (Fixed bottom/modal) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl border-t border-white/10 p-4 flex justify-around items-center z-50">
        {CATEGORIES.slice(0, 5).map(cat => {
          const Icon = categoryIcons[cat];
          return (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`p-3 rounded-xl ${activeCategory === cat ? "bg-indigo-500 text-white" : "text-gray-500"}`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </main>
  );
}

export default function UnitConverterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <UnitConverterContent />
    </Suspense>
  );
}
