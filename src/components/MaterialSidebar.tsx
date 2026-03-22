"use client";

import { useState, useEffect } from "react";
import { 
  BrickWall, Construction, PaintBucket, Layers, 
  Grid3X3, Pipette, Zap, Droplets, DoorOpen, 
  Scaling, Ruler, Calculator, ChevronDown, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type MaterialModule = 
  | "Brick Work" | "Plaster" | "PCC" | "RCC Slab" | "RCC Beam" | "RCC Column" 
  | "Floor Tiles" | "Bath Tiles" | "Paint"
  | "Steel Weight" | "Girder" | "T-Iron" | "Aluminum Windows"
  | "Electric" | "Plumbing" | "Sewerage" | "Wooden Door";

const categories = [
  {
    name: "Masonry",
    modules: ["Brick Work", "Plaster", "PCC"] as MaterialModule[],
    icon: BrickWall,
  },
  {
    name: "Concrete (RCC)",
    modules: ["RCC Slab", "RCC Beam", "RCC Column"] as MaterialModule[],
    icon: Construction,
  },
  {
    name: "Finishing",
    modules: ["Floor Tiles", "Bath Tiles", "Paint"] as MaterialModule[],
    icon: PaintBucket,
  },
  {
    name: "Metals",
    modules: ["Steel Weight", "Girder", "T-Iron", "Aluminum Windows"] as MaterialModule[],
    icon: Scaling,
  },
  {
    name: "Utilities",
    modules: ["Electric", "Plumbing", "Sewerage"] as MaterialModule[],
    icon: Zap,
  },
  {
    name: "Woodwork",
    modules: ["Wooden Door"] as MaterialModule[],
    icon: DoorOpen,
  }
];

interface Props {
  activeModule: MaterialModule;
  onModuleChange: (module: MaterialModule) => void;
}

export default function MaterialSidebar({ activeModule, onModuleChange }: Props) {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);

  // Automatically expand the category of the active module
  useEffect(() => {
    const parentCat = categories.find(cat => cat.modules.includes(activeModule));
    if (parentCat && !expandedCats.includes(parentCat.name)) {
      setExpandedCats(prev => [...prev, parentCat.name]);
    }
  }, [activeModule]);

  const toggleCat = (name: string) => {
    setExpandedCats(prev => 
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <aside className="w-72 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col hidden lg:flex shrink-0">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Estimator Pro</h2>
        <p className="text-[12px] text-gray-400 font-bold uppercase tracking-tighter">Material Suite</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isExpanded = expandedCats.includes(cat.name);
          const hasActiveChild = cat.modules.includes(activeModule);

          return (
            <div key={cat.name} className="flex flex-col">
              <button 
                onClick={() => toggleCat(cat.name)}
                className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all ${
                  isExpanded || hasActiveChild ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${hasActiveChild ? "text-indigo-400" : "text-gray-500 opacity-50"}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    hasActiveChild ? "text-white" : "text-gray-500"
                  }`}>{cat.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="py-2 pl-4 space-y-1">
                      {cat.modules.map((mod) => {
                        const isActive = activeModule === mod;
                        return (
                          <button
                            key={mod}
                            onClick={() => onModuleChange(mod)}
                            className={`w-full text-left px-4 py-2 rounded-xl transition-all group border ${
                              isActive 
                                ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-tight">{mod}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      
      <div className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="rounded-xl bg-indigo-500/10 p-3 border border-indigo-500/20">
          <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-1">Wastage Included</p>
          <p className="text-[9px] text-gray-400 leading-tight">All results include 5% extra material buffer.</p>
        </div>
      </div>
    </aside>
  );
}
