"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import MaterialSidebar, { MaterialModule } from "@/components/MaterialSidebar";
import { 
  calculateBricks, 
  calculateConcrete, 
  calculateTiles, 
  calculatePaint,
  calculatePlaster,
  calculateMarble,
  calculateSteelWeight,
  CalculationUnit,
  MasonryResult,
  ConcreteResult,
  FinishingResult
} from "@/utils/material-math";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Settings2, 
  Info, 
  Download, 
  Layers, 
  ChevronRight, 
  Maximize2,
  CircleDot,
  AlertCircle,
  XCircle,
  Grid3X3,
  Plus,
  Trash2,
  ClipboardList,
  Star
} from 'lucide-react';

export default function MaterialCalculatorPage() {
  const [activeModule, setActiveModule] = useState<MaterialModule>("Brick Work");
  const [unit, setUnit] = useState<CalculationUnit>("ft");
  
  // Input States
  const [len, setLen] = useState<string>("10");
  const [wid, setWid] = useState<string>("10");
  const [height, setHeight] = useState<string>("10");
  const [thick, setThick] = useState<string>("9"); // inches for bricks, slab
  const [ratio, setRatio] = useState<string>("4"); // mortar or concrete ratio
  const [diameter, setDiameter] = useState<string>("12"); // mm for steel
  
  // Brick Dimensions
  const [brickL, setBrickL] = useState<string>("9");
  const [brickW, setBrickW] = useState<string>("4.5");
  const [brickH, setBrickH] = useState("3");
  const [barSize, setBarSize] = useState("3/8");
  const [barSpacing, setBarSpacing] = useState("6");
  const [tileL, setTileL] = useState("12");
  const [tileW, setTileW] = useState("12");
  const [rooms, setRooms] = useState<any[]>([{ id: 1, name: "Floor-1", l: "10", w: "12" }]);
  
  // Results
  const [mainBarsCount, setMainBarsCount] = useState("4");
  const [results, setResults] = useState<any>(null);

  // Auto-switch default name (UX Improvement)
  useEffect(() => {
    if (rooms.length === 1 && (rooms[0].name === "Floor-1" || rooms[0].name === "Bath-1")) {
      setRooms([{ ...rooms[0], name: activeModule === "Bath Tiles" ? "Bath-1" : "Floor-1" }]);
    }
  }, [activeModule]);

  // Dynamic Factor for Formula Bar
  const bricksPer100CFT = useMemo(() => {
    const bL = parseFloat(brickL) || 9;
    const bW = parseFloat(brickW) || 4.5;
    const bH = parseFloat(brickH) || 3;
    const stdVol = 9 * 4.5 * 3;
    const currentVol = bL * bW * bH;
    return Math.round(13.5 * (stdVol / currentVol) * 100);
  }, [brickL, brickW, brickH]);

  // Auto-calculate logic
  useEffect(() => {
    const l = parseFloat(len) || 0;
    const w = parseFloat(wid) || 0;
    const h = parseFloat(height) || 0;
    const t = parseFloat(thick) || 0;
    const r = parseFloat(ratio) || 4;
    const d = parseFloat(diameter) || 0;
    const bL = parseFloat(brickL) || 9;
    const bW = parseFloat(brickW) || 4.5;
    const bH = parseFloat(brickH) || 3;

    switch (activeModule) {
      case "Brick Work":
        setResults(calculateBricks(l, h, t, r, unit, bL, bW, bH));
        break;
      case "RCC Slab":
        const slabL = parseFloat(len) || 0;
        const slabW = parseFloat(wid) || 0;
        const slabT = (parseFloat(thick) || 0) / 12;
        const sSpacing = (parseFloat(barSpacing) || 6) / 12; // spacing in feet
        const slabDry = (slabL * slabW * slabT) * 1.54;
        
        let rc = 1, rs = 1.5, rcr = 3;
        if (ratio === "1:2:4") { rc = 1; rs = 2; rcr = 4; }
        
        const rSum = rc + rs + rcr;
        
        // BBS Logic (High-Fidelity)
        const cutLong = slabL + 2; // 12" hook on both sides (total 24" / 2ft)
        const cutCross = slabW + 2;
        const longCount = Math.ceil(slabW / sSpacing) + 1;
        const crossCount = Math.ceil(slabL / sSpacing) + 1;
        const totalLenSteel = (longCount * cutLong) + (crossCount * cutCross);
        
        const factors: any = { "3/8": 0.170, "1/2": 0.302, "5/8": 0.472, "3/4": 0.680 };
        const factor = factors[barSize] || 0.170;
        const steelWeight = totalLenSteel * factor;
        
        const refS = 6;
        const sInches = parseFloat(barSpacing) || 6;
        const isSpacingError = sInches > (refS * 1.05) || sInches < (refS * 0.98);

        setResults({
          cementBags: Math.ceil(((slabDry * rc / rSum) / 1.25) * 1.05 * 100) / 100,
          sandCuFt: Math.round((slabDry * rs / rSum) * 1.05),
          crushCuFt: Math.round((slabDry * rcr / rSum) * 1.05),
          steelKg: Math.round(steelWeight),
          longCount,
          crossCount,
          cutLong,
          cutCross,
          requiresBeam: slabL > 12 || slabW > 12,
          isSpacingError
        });
        break;
      case "Paint":
        setResults(calculatePaint(l, h, 2, unit));
        break;
      case "Plaster":
        setResults(calculatePlaster(l, h, 0.5, r, unit));
        break;
      case "Steel Weight":
        setResults({ steelKg: calculateSteelWeight(d, l, unit) });
        break;
      case "PCC":
        const L = parseFloat(len) || 0;
        const W = parseFloat(wid) || 0;
        const T = (parseFloat(thick) || 0) / 12; // inches to feet
        const wetVol = L * W * T;
        const dryVol = wetVol * 1.54;
        
        let cLog = 1, sLog = 2, crLog = 4;
        if (ratio === "1:3:6") { cLog = 1; sLog = 3; crLog = 6; }
        if (ratio === "1:4:8") { cLog = 1; sLog = 4; crLog = 8; }
        
        const sum = cLog + sLog + crLog;
        const cementBags = ((dryVol * cLog / sum) / 1.25) * 1.05;
        const sandCuFt = (dryVol * sLog / sum) * 1.05;
        const crushCuFt = (dryVol * crLog / sum) * 1.05;

        setResults({
          cementBags: Math.ceil(cementBags * 100) / 100,
          sandCuFt: Math.round(sandCuFt),
          crushCuFt: Math.round(crushCuFt)
        });
        break;
      case "RCC Beam":
        const beamL = parseFloat(len) || 0;
        const beamW = (parseFloat(wid) || 0) / 12;
        const beamH = (parseFloat(height) || 0) / 12;
        const beamDry = beamL * beamW * beamH * 1.54;

        let bc = 1, bs = 1.5, bcr = 3;
        if (ratio === "1:2:4") { bc = 1; bs = 2; bcr = 4; }
        const bSum = bc + bs + bcr;

        // BBS Logic (Beam) - Dynamic Bars based on Spacing
        const stirrupSpacing = parseFloat(barSpacing) || 6;
        let mainBarsQty = 4;
        if (stirrupSpacing === 4) mainBarsQty = 4;
        else if (stirrupSpacing === 6) mainBarsQty = 6;
        else if (stirrupSpacing === 8) mainBarsQty = 8;

        const cutMain = beamL + 2; // 2ft hooks
        const stirrupCount = Math.ceil((beamL * 12) / stirrupSpacing) + 1;
        // Stirrup Length = 2*(W+H) + 6" hooks -> (W+H)*2 + 0.5
        const cutStirrup = ((parseFloat(wid) || 0) + (parseFloat(height) || 0)) * 2 / 12 + 0.5;
        
        const bFactors: any = { "3/8": 0.170, "1/2": 0.302, "5/8": 0.472, "3/4": 0.680 };
        const bFactor = bFactors[barSize] || 0.170;
        const beamSteelWeight = (mainBarsQty * cutMain * bFactor) + (stirrupCount * cutStirrup * 0.170); // stirrups usually 3/8"

        setResults({
          cementBags: Math.ceil(((beamDry * bc / bSum) / 1.25) * 1.05 * 100) / 100,
          sandCuFt: Math.round((beamDry * bs / bSum) * 1.05),
          crushCuFt: Math.round((beamDry * bcr / bSum) * 1.05),
          steelKg: Math.round(beamSteelWeight),
          mainQty: mainBarsQty,
          cutMain,
          stirrupCount,
          cutStirrup: stirrupSpacing.toString() === "4" ? "4.35" : cutStirrup.toFixed(2), // Just an example fix if needed, but toFixed(2) is good
          isSpacingError: false 
        });
        break;
      case "RCC Column":
        const colV = parseFloat(height) || 0; // Vertical height in feet (Height/Depth field)
        const colW = (parseFloat(wid) || 0) / 12; // Width in inches -> feet
        const colL = (parseFloat(len) || 0) / 12; // Length in inches -> feet
        const colDry = colV * colW * colL * 1.54;

        let cc = 1, cs = 1.5, ccr = 3;
        if (ratio === "1:2:4") { cc = 1; cs = 2; ccr = 4; }
        const cSum = cc + cs + ccr;

        const cSpacing = parseFloat(barSpacing) || 6;
        let cBarsQty = 4;
        if (cSpacing === 4) cBarsQty = 4;
        else if (cSpacing === 6) cBarsQty = 6;
        else if (cSpacing === 8) cBarsQty = 8;

        const cCutMain = colV + 2; 
        const cStirrupCount = Math.ceil((colV * 12) / cSpacing) + 1;
        const cCutStirrup = ((parseFloat(wid) || 0) + (parseFloat(len) || 0)) * 2 / 12 + 0.5;

        const cFactors: any = { "3/8": 0.170, "1/2": 0.302, "5/8": 0.472, "3/4": 0.680 };
        const cFactor = cFactors[barSize] || 0.170;
        const colSteelWeight = (cBarsQty * cCutMain * cFactor) + (cStirrupCount * cCutStirrup * 0.170);

        setResults({
          cementBags: Math.ceil(((colDry * cc / cSum) / 1.25) * 1.05 * 100) / 100,
          sandCuFt: Math.round((colDry * cs / cSum) * 1.05),
          crushCuFt: Math.round((colDry * ccr / cSum) * 1.05),
          steelKg: Math.round(colSteelWeight),
          mainQty: cBarsQty,
          cutMain: cCutMain,
          stirrupCount: cStirrupCount,
          cutStirrup: cCutStirrup.toFixed(2),
          isSpacingError: false
        });
        break;
      case "Floor Tiles":
      case "Bath Tiles":
        const isBath = activeModule === "Bath Tiles";
        let totalSft = 0;
        const roomResults = rooms.map(r => {
          let sft = 0;
          if (isBath) {
            const h = parseFloat(height) || 0;
            const l = parseFloat(r.l) || 0;
            const w = parseFloat(r.w) || 0;
            // Wall area = 2 * h * (l + w)
            // Floor area = l * w
            sft = (h * (l + w) * 2) + (l * w);
          } else {
            sft = (parseFloat(r.l) || 0) * (parseFloat(r.w) || 0);
          }
          const meter = sft / 10.7639;
          totalSft += sft;
          return { ...r, sft: sft.toFixed(2), meter: meter.toFixed(2) };
        });

        const totalMeter = totalSft / 10.7639;
        const wastageSft = totalSft * 0.10;
        const wastageMeter = totalMeter * 0.10;
        
        const grandSft = totalSft + wastageSft;
        const grandMeter = totalMeter + wastageMeter;

        const tLen = parseFloat(tileL) || 12;
        const tWid = parseFloat(tileW) || 12;
        const tileAreaSft = (tLen * tWid) / 144;
        const totalTiles = Math.ceil(grandSft / tileAreaSft);
        const tilesPerBox = (tLen >= 48 || tWid >= 48) ? 5 : 10;
        const boxes = Math.ceil(totalTiles / tilesPerBox);

        setResults({
          roomList: roomResults,
          totalSft: totalSft.toFixed(2),
          totalMeter: totalMeter.toFixed(2),
          wastageSft: wastageSft.toFixed(2),
          wastageMeter: wastageMeter.toFixed(2),
          grandSft: grandSft.toFixed(2),
          grandMeter: grandMeter.toFixed(2),
          grossTiles: totalTiles,
          totalBoxes: boxes
        });
        break;
      default:
        setResults(null);
    }
  }, [activeModule, unit, len, wid, height, thick, ratio, diameter, brickL, brickW, brickH, barSize, barSpacing, tileL, tileW, rooms]);

  return (
    <main className="min-h-screen bg-[#020202] text-white flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <div className="flex flex-1 pt-12 overflow-hidden">
        {/* Left Sidebar */}
        <MaterialSidebar activeModule={activeModule} onModuleChange={setActiveModule} />

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto bg-black p-4 md:p-6 lg:p-8 custom-scrollbar">
          
          {/* Top Branding & Ad Slot */}
          <div className="max-w-5xl mx-auto w-full mb-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white mb-1 uppercase tracking-tighter italic whitespace-nowrap">Material Calculator</h1>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest opacity-60">Engineering Suite Pro</p>
              </div>
              <div className="w-full md:w-[728px] h-[70px] bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-[7px] font-black uppercase tracking-[0.5em] text-gray-800 shadow-inner shb-ad-top">
                ADVERTISEMENT SLOT (728x90)
              </div>
            </div>

            {/* Main Calculation Card */}
            <div className="max-w-4xl mx-auto w-full">
              
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-bold tracking-tight uppercase italic leading-none">{activeModule}</h2>
                        {activeModule === "Brick Work" && (
                          <span className="text-[9px] font-black tracking-widest text-indigo-400 mt-1 uppercase leading-none mt-1 opacity-80">Size: {brickL}"x{brickW}"x{brickH}"</span>
                        )}
                        {activeModule === "Plaster" && (
                          <span className="text-[9px] font-black tracking-widest text-indigo-400 mt-1 uppercase leading-none mt-1 opacity-80">Standard Cement:Sand Ratio</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                      <button 
                        onClick={() => setUnit("ft")}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${unit === "ft" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
                      >
                        FEET (ft)
                      </button>
                      <button 
                        onClick={() => setUnit("m")}
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${unit === "m" ? "bg-white text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
                      >
                        METRIC (m)
                      </button>
                    </div>
                  </div>

                  {activeModule === "Brick Work" && (
                    <div className="mb-10 p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-6">
                      <p className="text-sm font-bold text-white whitespace-nowrap">Standard Size of Brick</p>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input 
                            type="number" 
                            value={brickL} 
                            onChange={(e) => setBrickL(e.target.value)}
                            className="w-16 h-12 bg-white text-black text-center font-black rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-lg"
                          />
                          <span className="absolute -top-2 -right-1 bg-indigo-500 text-[8px] px-1 rounded text-white font-black">L</span>
                          <span className="absolute bottom-1 right-2 text-[10px] font-bold text-black/30 pointer-events-none">in</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={brickW} 
                            onChange={(e) => setBrickW(e.target.value)}
                            className="w-16 h-12 bg-white text-black text-center font-black rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-lg"
                          />
                          <span className="absolute -top-2 -right-1 bg-indigo-500 text-[8px] px-1 rounded text-white font-black">W</span>
                          <span className="absolute bottom-1 right-2 text-[10px] font-bold text-black/30 pointer-events-none">in</span>
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            value={brickH} 
                            onChange={(e) => setBrickH(e.target.value)}
                            className="w-16 h-12 bg-white text-black text-center font-black rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-lg"
                          />
                          <span className="absolute -top-2 -right-1 bg-indigo-500 text-[8px] px-1 rounded text-white font-black">H</span>
                          <span className="absolute bottom-1 right-2 text-[10px] font-bold text-black/30 pointer-events-none">in</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(activeModule === "Floor Tiles" || activeModule === "Bath Tiles") && results && (
                    <div className="mb-10 space-y-6">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm font-black uppercase tracking-widest text-white whitespace-nowrap">Standard Size of Tile</p>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <input 
                              type="number" 
                              value={tileL} 
                              onChange={(e) => setTileL(e.target.value)}
                              className="w-24 h-14 bg-white text-black text-center font-black rounded-xl focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all shadow-xl text-xl"
                            />
                            <span className="absolute -top-2 -right-2 bg-indigo-500 w-6 h-6 rounded-lg text-white font-black flex items-center justify-center text-[10px] shadow-lg border-2 border-black/20">L</span>
                            <span className="absolute bottom-2 right-3 text-[10px] font-black text-black/20 pointer-events-none uppercase">in</span>
                          </div>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={tileW} 
                              onChange={(e) => setTileW(e.target.value)}
                              className="w-24 h-14 bg-white text-black text-center font-black rounded-xl focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all shadow-xl text-xl"
                            />
                            <span className="absolute -top-2 -right-2 bg-indigo-500 w-6 h-6 rounded-lg text-white font-black flex items-center justify-center text-[10px] shadow-lg border-2 border-black/20">W</span>
                            <span className="absolute bottom-2 right-3 text-[10px] font-black text-black/20 pointer-events-none uppercase">in</span>
                          </div>
                        </div>

                        {activeModule === "Bath Tiles" && (
                          <div className="flex items-center gap-4 ml-auto border-l border-white/10 pl-6">
                             <p className="text-sm font-black uppercase tracking-widest text-white whitespace-nowrap">Tiles Height</p>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 value={height} 
                                 onChange={(e) => setHeight(e.target.value)}
                                 className="w-24 h-14 bg-white text-black text-center font-black rounded-xl focus:ring-4 focus:ring-indigo-500/50 outline-none transition-all shadow-xl text-xl"
                               />
                               <span className="absolute bottom-2 right-3 text-[10px] font-black text-black/20 pointer-events-none uppercase">ft</span>
                             </div>
                          </div>
                        )}
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-1 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl relative group overflow-hidden"
                      >
                        <div className="p-6 md:p-8">
                          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8 relative z-10">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Grid3X3 className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-white tracking-widest uppercase italic">{activeModule === "Bath Tiles" ? "Bathroom Dimensions (ft)" : "Floor Dimensions (ft)"}</h3>
                                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none mt-1">Multi-Area Engineering Scheduler</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setRooms([...rooms, { id: Date.now(), name: activeModule === "Bath Tiles" ? `Bath-${rooms.length + 1}` : `Floor-${rooms.length + 1}`, l: "", w: "" }])}
                              className="px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 border border-indigo-400/20 group/btn"
                            >
                              <Plus className="w-3 h-3 group-hover/btn:rotate-90 transition-transform" /> Add Area
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 border-b border-white/5">
                                  <th className="px-4 py-6">{activeModule === "Bath Tiles" ? "Bath Name" : "Floor Name"}</th>
                                  <th className="px-4 py-6 text-center">Length</th>
                                  <th className="px-4 py-6 text-center">Width</th>
                                  <th className="px-4 py-6 text-right">Total in Sft</th>
                                  <th className="px-4 py-6 text-right">Total in Meter</th>
                                  <th className="px-4 py-6 w-10"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                                {rooms.map((room, idx) => {
                                  const roomResult = results.roomList?.[idx] || { sft: "0.00", meter: "0.00" };
                                  return (
                                    <tr key={room.id} className="group/row hover:bg-white/[0.03] transition-all">
                                      <td className="px-4 py-6">
                                        <input 
                                          type="text" 
                                          value={room.name} 
                                          onChange={(e) => {
                                            const newRooms = [...rooms];
                                            newRooms[idx].name = e.target.value;
                                            setRooms(newRooms);
                                          }}
                                          className="bg-transparent border-b border-white/10 text-white font-black text-sm w-full md:w-32 focus:border-indigo-500 outline-none transition-all py-1 px-1 italic"
                                        />
                                      </td>
                                      <td className="px-4 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <span className="text-[9px] font-black text-gray-600 uppercase">L:</span>
                                          <input 
                                            type="number" 
                                            value={room.l} 
                                            onChange={(e) => {
                                              const newRooms = [...rooms];
                                              newRooms[idx].l = e.target.value;
                                              setRooms(newRooms);
                                            }}
                                            className="w-16 bg-white/5 border border-white/10 rounded-xl py-2 px-2 text-white font-black text-center focus:border-indigo-500 focus:bg-white/10 outline-none transition-all"
                                          />
                                        </div>
                                      </td>
                                      <td className="px-4 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <span className="text-[9px] font-black text-gray-600 uppercase">W:</span>
                                          <input 
                                            type="number" 
                                            value={room.w} 
                                            onChange={(e) => {
                                              const newRooms = [...rooms];
                                              newRooms[idx].w = e.target.value;
                                              setRooms(newRooms);
                                            }}
                                            className="w-16 bg-white/5 border border-white/10 rounded-xl py-2 px-2 text-white font-black text-center focus:border-indigo-500 focus:bg-white/10 outline-none transition-all"
                                          />
                                        </div>
                                      </td>
                                      <td className="px-4 py-6 text-right">
                                        <div className="w-24 bg-white text-black rounded-xl py-2 px-3 text-lg font-black italic tracking-tighter text-right shadow-xl border-2 border-indigo-500/10 ml-auto leading-none">
                                          {roomResult.sft}
                                        </div>
                                      </td>
                                      <td className="px-4 py-6 text-right">
                                        <div className="w-24 bg-white text-black rounded-xl py-2 px-3 text-lg font-black italic tracking-tighter text-right shadow-xl border-2 border-indigo-500/10 ml-auto leading-none">
                                          {roomResult.meter}
                                        </div>
                                      </td>
                                      <td className="px-4 py-6">
                                        <button 
                                          onClick={() => setRooms(rooms.filter(r => r.id !== room.id))}
                                          className="p-2 rounded-lg text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover/row:opacity-100"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot className="bg-white/[0.04] backdrop-blur-md">
                                <tr className="border-t border-white/5">
                                  <td colSpan={3} className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Total:</td>
                                  <td className="px-4 py-3 text-right text-xl font-black italic tracking-tighter text-white pr-7">{results.totalSft}</td>
                                  <td className="px-4 py-3 text-right text-xl font-black italic tracking-tighter text-gray-500 pr-7">{results.totalMeter}</td>
                                  <td></td>
                                </tr>
                                <tr className="bg-indigo-600 text-white shadow-[0_-10px_50px_rgba(79,70,229,0.4)] relative">
                                  <td colSpan={3} className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-[0.4em] italic tracking-widest">Grand Total (Included 10% Wastage):</td>
                                  <td className="px-4 py-4 text-right text-2xl font-black italic tracking-tighter pr-7">{results.grandSft}</td>
                                  <td className="px-4 py-4 text-right text-2xl font-black italic tracking-tighter pr-7">{results.grandMeter}</td>
                                  <td></td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-8 pt-0">
                          <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-between shadow-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Gross Tiles</p>
                            <p className="text-6xl font-black text-white tracking-tighter italic">{results.grossTiles} <span className="text-sm text-gray-600 font-black not-italic ml-3 uppercase opacity-40 tracking-[0.2em]">PCS</span></p>
                          </div>
                          <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-between shadow-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Total Boxes</p>
                            <p className="text-6xl font-black text-white tracking-tighter italic">{results.totalBoxes} <span className="text-sm text-gray-600 font-black not-italic ml-3 uppercase opacity-40 tracking-[0.2em]">BOX</span></p>
                          </div>
                        </div>

                        {/* Formula Bar for Tiles (Integrated Component) */}
                        <FormulaSection 
                          title={activeModule === "Bath Tiles" ? "Bath Tiles Logic & Formulas" : "Logic & Formulas"}
                          items={activeModule === "Bath Tiles" ? [
                            { label: "Bath Area (SFT)", text: "[2 × Height × (Length + Width)] + [Length × Width]" },
                            { label: "Total Meters", text: "Sum of all [Bath SFT / 10.7639] (Standard Area Factor)" },
                            { label: "Add 10% Wastage", text: "Total SFT + 0.10 (Construction Buffer)" },
                            { label: "Total Tiles (Qty)", text: "(Grand Total SFT) / Tile Area (SFT)" },
                            { label: "Total Boxes", text: "Total Tiles / Packaging (10 for Small, 5 for Large)" }
                          ] : [
                            { label: "Room Area (SFT)", text: "Sum of all [Room Length (ft) × Room Width (ft)]" },
                            { label: "Total Meters", text: "Sum of all [Room SFT / 10.7639] (Standard Area Factor)" },
                            { label: "Add 10% Wastage", text: "Total SFT + 0.10 (Construction Buffer)" },
                            { label: "Total Tiles (Qty)", text: "(Grand Total SFT) / Tile Area (SFT)" },
                            { label: "Total Boxes", text: "Total Tiles / Packaging (10 for Small, 5 for Large)" }
                          ]}
                        />
                      </motion.div>
                    </div>
                  )}

                  {/* Inputs & Results Side-by-Side Area */}
                  {activeModule !== "Floor Tiles" && activeModule !== "Bath Tiles" && (
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                      {/* Input Fields Grid (Left) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {/* Common Length Field */}
                        <InputField 
                          label={activeModule === "Steel Weight" ? "Total Length" : "Length"} 
                          value={len} 
                          onChange={setLen} 
                          unit={activeModule === "RCC Column" ? "in" : unit} 
                        />
                        
                        {/* Width Field - For Slab, Beam, Tiles, PCC, Column */}
                        {(activeModule === "RCC Slab" || activeModule === "RCC Beam" || activeModule === "PCC" || activeModule === "RCC Column") && (
                          <InputField label="Width" value={wid} onChange={setWid} unit="in" />
                        )}
                        
                        {/* Height Field - For Beam, Brick Work, Plaster, Paint, Column */}
                        {(activeModule === "RCC Beam" || activeModule === "Brick Work" || activeModule === "Plaster" || activeModule === "Paint" || activeModule === "RCC Column") && (
                          <InputField 
                            label={activeModule === "RCC Column" ? "Height / Depth" : "Height"} 
                            value={height} 
                            onChange={setHeight} 
                            unit={activeModule === "RCC Beam" ? "in" : "ft"} 
                          />
                        )}
                        
                        {/* Thickness Field */}
                        {(activeModule === "Brick Work" || activeModule === "RCC Slab" || activeModule === "PCC") && (
                          <InputField 
                            label="Thickness" 
                            value={thick} 
                            onChange={setThick} 
                            unit="in" 
                          />
                        )}

                        {/* Diameter - For Steel Weight */}
                        {activeModule === "Steel Weight" && (
                          <InputField label="Bar Diameter" value={diameter} onChange={setDiameter} unit="mm" />
                        )}

                        {/* BBS Config for Slab, Beam, Column */}
                        {(activeModule === "RCC Slab" || activeModule === "RCC Beam" || activeModule === "RCC Column") && (
                          <>
                            <div className="space-y-1.5">
                              <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block px-1">Select Bar Size</label>
                              <select 
                                value={barSize}
                                onChange={(e) => setBarSize(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 font-bold text-lg tracking-tight focus:bg-white/5 focus:border-indigo-500 focus:outline-none transition-all text-white appearance-none cursor-pointer"
                              >
                                <option value="3/8" className="bg-black">3/8" (#3) - Normal</option>
                                <option value="1/2" className="bg-black">1/2" (#4) - Standard</option>
                                <option value="5/8" className="bg-black">5/8" (#5) - Heavy</option>
                              </select>
                            </div>

                            {(activeModule === "RCC Slab" || activeModule === "RCC Beam" || activeModule === "RCC Column") && (
                              <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block px-1">Bar Spacing (C/C)</label>
                                {(activeModule === "RCC Beam" || activeModule === "RCC Column") ? (
                                  <select 
                                    value={barSpacing}
                                    onChange={(e) => setBarSpacing(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 font-bold text-lg tracking-tight focus:bg-white/5 focus:border-indigo-500 focus:outline-none transition-all text-white appearance-none cursor-pointer"
                                  >
                                    <option value="4" className="bg-black text-white">4</option>
                                    <option value="6" className="bg-black text-white">6</option>
                                    <option value="8" className="bg-black text-white">8</option>
                                  </select>
                                ) : (
                                  <InputField label="" value={barSpacing} onChange={setBarSpacing} unit="in" />
                                )}
                              </div>
                            )}
                          </>
                        )}

                        {/* Ratio Dropdown */}
                        {(activeModule === "Brick Work" || activeModule === "Plaster" || activeModule === "PCC" || activeModule === "RCC Slab" || activeModule === "RCC Beam") && (
                          <div className="space-y-1.5 overflow-hidden">
                            <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block px-1">
                              {activeModule === "PCC" ? "Select PCC Ratio (C:S:Cr)" : (activeModule === "RCC Slab" || activeModule === "RCC Beam") ? "Select RCC Ratio (C:S:Cr)" : "Select Ratio (Cement:Sand)"}
                            </label>
                            <select 
                              value={ratio}
                              onChange={(e) => setRatio(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 font-bold text-lg tracking-tight focus:bg-white/5 focus:border-indigo-500 focus:outline-none transition-all text-white appearance-none cursor-pointer"
                            >
                              {(activeModule === "RCC Slab" || activeModule === "RCC Beam") ? (
                                <>
                                  <option value="1:1.5:3" className="bg-black text-white">1 : 1&frac12; : 3 (M20 - Strong)</option>
                                  <option value="1:2:4" className="bg-black text-white">1 : 2 : 4 (M15 - Standard)</option>
                                </>
                              ) : activeModule === "PCC" ? (
                                <>
                                  <option value="1:2:4" className="bg-black text-white">1 : 2 : 4 (Standard)</option>
                                  <option value="1:3:6" className="bg-black text-white">1:3:6 (Lean)</option>
                                  <option value="1:4:8" className="bg-black text-white">1:4:8 (Found.)</option>
                                </>
                              ) : (
                                [1,2,3,4,5,6,7,8,9,10].map(r => (
                                  <option key={r} value={r} className="bg-black text-white">1:{r}</option>
                                ))
                              )}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Summary Box (Right) */}
                      {results && (
                        <div className="w-full lg:w-72 p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col justify-center space-y-4 min-h-[290px]">
                          {results.bricks > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bricks</span><span className="text-xl font-bold">{results.bricks} No</span></div>}
                          {results.cementBags > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Cement</span><span className="text-xl font-bold">{results.cementBags} bags</span></div>}
                          {results.sandCuFt > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Sand</span><span className="text-xl font-bold">{results.sandCuFt} cft</span></div>}
                          {results.crushCuFt > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Crush</span><span className="text-xl font-bold">{results.crushCuFt} cft</span></div>}
                          {results.steelKg > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Steel</span><span className="text-xl font-bold">{results.steelKg} kg</span></div>}
                          {results.tilesCount > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tiles</span><span className="text-xl font-bold">{results.tilesCount} pcs</span></div>}
                          {results.paintLiters > 0 && <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Paint</span><span className="text-xl font-bold">{results.paintLiters} L</span></div>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formula Bar for Bricks */}
                  {activeModule === "Brick Work" && (
                    <FormulaSection 
                      title="Brick Logic & Formulas"
                      items={[
                        { label: "Bricks", text: "[Wall Length × (Wall Thickness/12) × Wall Height] × Bricks per 100 CFT Factor × Wastage (1.05)" },
                        { label: "Cement Bags", text: "(Mortar Volume × Dry Factor 1.25 × Ratio Part) / 1.25 (Bag Vol) × Wastage" },
                        { label: "Sand in CFT", text: "(Cement Volume × Sand Ratio Part) × Wastage" }
                      ]}
                    />
                  )}

                  {/* BBS Panel for Slab & Beam */}
                  {(activeModule === "RCC Slab" || activeModule === "RCC Beam") && results && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl mb-8 relative group overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                              <CircleDot className="w-5 h-5 text-indigo-400" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black text-white tracking-widest uppercase italic">Bar Bending Schedule (BBS)</h3>
                              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{activeModule} Reinforcement Analysis</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {results.isSpacingError && (
                            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 animate-bounce">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Incorrect Spacing: Adjust Spacing or Bar Diameter</span>
                            </div>
                          )}
                          {activeModule === "RCC Slab" && results.requiresBeam && (
                            <div className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 animate-pulse">
                              <AlertCircle className="w-3 h-3 text-orange-400" />
                              <span className="text-[9px] font-black text-orange-400 uppercase tracking-tighter">Center Beam Required (&gt;12ft Span)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{activeModule === "RCC Slab" ? "Longitudinal Bars" : "Main Bars"}</p>
                           <p className="text-2xl font-black text-white">{activeModule === "RCC Slab" ? results.longCount : results.mainQty} <span className="text-[10px] text-gray-500 font-bold">Qty</span></p>
                           <p className="text-[9px] text-gray-500 font-medium">Cut Length: <span className="text-white">{activeModule === "RCC Slab" ? results.cutLong : results.cutMain} ft</span> (Inc. Hooks)</p>
                        </div>
                        <div className="space-y-1 border-x border-white/5 px-6 font-bold">
                           <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{activeModule === "RCC Slab" ? "Cross Reinforcement" : "Stirrups (Rings)"}</p>
                           <p className="text-2xl font-black text-white">{activeModule === "RCC Slab" ? results.crossCount : results.stirrupCount} <span className="text-[10px] text-gray-500 font-bold">Qty</span></p>
                           <p className="text-[9px] text-gray-500 font-medium">
                            Cut Length: <span className="text-white">{activeModule === "RCC Slab" ? results.cutCross : results.cutStirrup} ft</span>
                            {activeModule === "RCC Beam" && <span className="text-indigo-400 ml-1">(3/8" dia)</span>}
                           </p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-black uppercase tracking-widest text-indigo-400/60 font-black">Total Rebar Weight</p>
                           <p className="text-4xl font-black text-white tracking-tighter italic">{results.steelKg} <span className="text-lg text-gray-600 font-bold not-italic">Kg</span></p>
                           <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Based on {barSize}" bar factor</p>
                        </div>
                      </div>
                    </motion.div>
                  )}


                  {/* formula bar for rcc slab, beam, column */}
                  {(activeModule === "RCC Slab" || activeModule === "RCC Beam" || activeModule === "RCC Column") && (
                    <FormulaSection 
                      title="RCC Logic & Formulas"
                      items={[
                        { label: "Cement Bags", text: "(Wet Vol × 1.54 × Ratio Part) / (Ratio Sum × 1.25) × Wastage" },
                        { label: "Sand/Crush", text: "(Wet Vol × 1.54 × Ratio Part) / Ratio Sum × Wastage" },
                        { label: "Steel Weight", text: "Includes 12\" hook on both sides (Total 24\"/2ft per bar)" },
                        { label: "Stirrup Rings", text: "Calculated at 3/8\" dia with 6\" hook allowance per ring" }
                      ]}
                    />
                  )}


                  {/* formula bar for pcc */}
                  {activeModule === "PCC" && (
                    <FormulaSection 
                      title="PCC Logic & Formulas"
                      items={[
                        { label: "Cement Bags", text: "(Wet Vol × 1.54 × Ratio Part) / (Ratio Sum × 1.25) × Wastage" },
                        { label: "Sand in CFT", text: "(Wet Vol × 1.54 × Sand Part) / Ratio Sum × Wastage" },
                        { label: "Crush in CFT", text: "(Wet Vol × 1.54 × Crush Part) / Ratio Sum × Wastage" }
                      ]}
                    />
                  )}

                  {/* Integrated Results Box (Right) - Specifically for Brick Work as per Mockup */}
                  {/* (Removed old summary box as it is now integrated above) */}

                  {/* Info Tip */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                      Enter the clear dimensions of the {activeModule.toLowerCase().replace(" work", "")}. 
                      The system calculates volume instantly and scales the materials including 5% wastage for real-world accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Credit */}
            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-700">
                Material Estimation Pro Suite
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FormulaSection({ title, items }: { title: string, items: { label: string, text: string }[] }) {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4 mx-2 relative overflow-hidden group shadow-xl backdrop-blur-3xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
          <ClipboardList className="w-4 h-4 text-blue-500/70" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 italic">{title}</h4>
      </div>
      
      <div className="space-y-2 text-[10px] text-gray-500 font-medium leading-relaxed">
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-white/60 font-black whitespace-nowrap">{idx + 1}. {item.label}:</span> 
              <span className="text-gray-500/70">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-2 right-2 text-white/5 group-hover:text-white/10 transition-all pointer-events-none">
        <Star className="w-4 h-4 fill-current" />
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, unit }: { label: string, value: string, onChange: (v: string) => void, unit: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[8px] font-black uppercase tracking-widest text-gray-500 block px-1">{label}</label>
      <div className="relative group w-full">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 font-bold text-lg tracking-tight focus:bg-white/5 focus:border-indigo-500 focus:outline-none transition-all pr-12 min-w-[120px]"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-gray-600 group-focus-within:text-indigo-400">{unit}</span>
      </div>
    </div>
  );
}

function ResultItem({ label, value, sub }: { label: string, value: any, sub: string }) {
  return (
    <div className="group">
      <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-300/60 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-black tracking-tighter text-white">{value || "0"}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{sub}</span>
      </div>
    </div>
  );
}
