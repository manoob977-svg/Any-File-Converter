/**
 * SHB Material Calculator Pro - Core Logic
 * Standard Engineering Constants & Formulas (South Asia Standards)
 */

export type CalculationUnit = "ft" | "m";

export interface MasonryResult {
  bricks: number;
  cementBags: number;
  sandCuFt: number;
  totalVolume: number;
}

export interface ConcreteResult {
  cementBags: number;
  sandCuFt: number;
  crushCuFt: number;
  steelKg?: number;
  volume: number;
}

export interface FinishingResult {
  totalArea: number;
  tilesCount?: number;
  boxes?: number;
  marbleSqFt?: number;
  paintLiters?: number;
  cementBags?: number;
}

const WASTAGE_FACTOR = 1.05; // 5% Extra

/**
 * Brick Work Calculation
 * @param wallL Length of wall
 * @param wallH Height of wall
 * @param wallT Thickness of wall (inches)
 * @param ratio Mortar ratio (e.g., 4 for 1:4)
 * @param unit ft or m
 * @param bL Brick Length (inches)
 * @param bW Brick Width (inches)
 * @param bH Brick Height (inches)
 */
export function calculateBricks(
  wallL: number,
  wallH: number,
  wallT: number,
  ratio: number = 4,
  unit: CalculationUnit = "ft",
  bL: number = 9,
  bW: number = 4.5,
  bH: number = 3
): MasonryResult {
  const l = unit === "m" ? wallL * 3.28084 : wallL;
  const h = unit === "m" ? wallH * 3.28084 : wallH;
  const volume = l * h * (wallT / 12);
  
  // Standard factor: 13.5 bricks per CFT for 9" x 4.5" x 3" brick
  // We scale this factor proportionally to the volume of the custom brick
  const stdBrickVol = 9 * 4.5 * 3;
  const currentBrickVol = bL * bW * bH;
  const scalingFactor = stdBrickVol / currentBrickVol;
  const bricksPerCuFt = 13.5 * scalingFactor;
  
  let bricks = Math.round(volume * bricksPerCuFt * WASTAGE_FACTOR);
  
  // Mortar calculation: standard is ~25% of total volume for 9x4.5x3
  const mortarVolume = volume * 0.25 * (currentBrickVol / stdBrickVol);
  
  const totalRatio = 1 + ratio;
  const dryMortarVolume = mortarVolume * 1.25; 
  
  const cementCuFt = dryMortarVolume / totalRatio;
  const cementBags = Math.ceil((cementCuFt / 1.25) * WASTAGE_FACTOR);
  const sandCuFt = Math.round(cementCuFt * ratio * WASTAGE_FACTOR);

  return { bricks, cementBags, sandCuFt, totalVolume: volume };
}

/**
 * Concrete (RCC) Calculation
 */
export function calculateConcrete(
  length: number,
  width: number,
  thickness: number,
  ratioC: number = 1,
  ratioS: number = 2,
  ratioCr: number = 4,
  unit: CalculationUnit = "ft"
): ConcreteResult {
  const l = unit === "m" ? length * 3.28084 : length;
  const w = unit === "m" ? width * 3.28084 : width;
  const t = unit === "m" ? thickness * 3.28084 : thickness / 12; // thickness in inches converted to feet

  const volume = l * w * t;
  const dryVolume = volume * 1.54; // Dry constant
  const sumRatio = ratioC + ratioS + ratioCr;

  const unitVol = dryVolume / sumRatio;
  const cementBags = Math.ceil(((unitVol * ratioC) / 1.25) * WASTAGE_FACTOR);
  const sandCuFt = Math.round(unitVol * ratioS * WASTAGE_FACTOR);
  const crushCuFt = Math.round(unitVol * ratioCr * WASTAGE_FACTOR);

  // Steel estimate (roughly 1% of volume for slabs, 8000kg/m3 density)
  // Converting ft3 to m3: 1 ft3 = 0.0283168 m3
  const volumeM3 = volume * 0.0283168;
  const steelKg = Math.round(volumeM3 * 80 * WASTAGE_FACTOR); // ~80kg per m3 for standard slab

  return { cementBags, sandCuFt, crushCuFt, steelKg, volume };
}

/**
 * Tiles Calculation
 */
export function calculateTiles(
  length: number,
  width: number,
  tileL: number, // in inches
  tileW: number, // in inches
  unit: CalculationUnit = "ft"
): FinishingResult {
  const l = unit === "m" ? length * 3.28084 : length;
  const w = unit === "m" ? width * 3.28084 : width;
  const areaSqFt = l * w;

  const tileAreaInSqFt = (tileL * tileW) / 144;
  const tilesCount = Math.ceil((areaSqFt / tileAreaInSqFt) * WASTAGE_FACTOR);
  
  // Dynamic Tiles per Box: 
  // Small tiles (up to 24x36): 10 tiles/box
  // Large tiles (48" or above): 5 tiles/box
  const tilesPerBox = (tileL >= 48 || tileW >= 48) ? 5 : 10;
  const boxes = Math.ceil(tilesCount / tilesPerBox);

  return { totalArea: areaSqFt, tilesCount, boxes };
}

/**
 * Paint Calculation
 */
export function calculatePaint(
  length: number,
  height: number,
  coats: number = 2,
  unit: CalculationUnit = "ft"
): FinishingResult {
  const l = unit === "m" ? length * 3.28084 : length;
  const h = unit === "m" ? height * 3.28084 : height;
  const areaSqFt = l * h;

  // Typical coverage: 350-400 sq.ft per gallon for 1 coat
  // Gallon = 3.785 liters
  const coveragePerGallon = 350;
  const totalGallons = (areaSqFt * coats) / coveragePerGallon;
  const paintLiters = Number((totalGallons * 3.785 * WASTAGE_FACTOR).toFixed(2));

  return { totalArea: areaSqFt, paintLiters };
}

/**
 * Plaster Calculation
 */
export function calculatePlaster(
  length: number,
  height: number,
  thickness: number = 0.5, // inches (standard 1/2")
  ratio: number = 4, // 1:4
  unit: CalculationUnit = "ft"
): MasonryResult {
  const l = unit === "m" ? length * 3.28084 : length;
  const h = unit === "m" ? height * 3.28084 : height;
  const area = l * h;
  const vol = area * (thickness / 12);
  const dryVol = vol * 1.25; // Plaster dry volume constant
  
  const sumRatio = 1 + ratio;
  const unitVol = dryVol / sumRatio;
  
  const cementBags = Math.ceil(((unitVol * 1) / 1.25) * WASTAGE_FACTOR);
  const sandCuFt = Math.round(unitVol * ratio * WASTAGE_FACTOR);

  return { bricks: 0, cementBags, sandCuFt, totalVolume: vol };
}

/**
 * Marble Flooring Calculation
 */
export function calculateMarble(
  length: number,
  width: number,
  unit: CalculationUnit = "ft"
): FinishingResult {
  const l = unit === "m" ? length * 3.28084 : length;
  const w = unit === "m" ? width * 3.28084 : width;
  const area = l * w;
  
  // High quality marble calculation often includes 10% wastage
  const marbleSqFt = Math.round(area * 1.1); 
  
  // Cement/Sand for bedding (2" thick)
  const beddingVol = area * (2 / 12);
  const dryVol = beddingVol * 1.25;
  const cementBags = Math.ceil((dryVol / 5) / 1.25); // 1:4 ratio

  return { totalArea: area, marbleSqFt, cementBags };
}

/**
 * Metal Weight (Steel Reinforcement)
 * @param diameter in mm
 * @param length in feet
 */
export function calculateSteelWeight(
  diameter: number,
  length: number,
  unit: CalculationUnit = "ft"
): number {
  const l = unit === "m" ? length * 3.28084 : length;
  // Weight (kg) = (D^2 / 533) * Length (ft)
  // or (D^2 / 162.2) * Length (m)
  const weight = ((diameter * diameter) / 533) * l;
  return Number((weight * WASTAGE_FACTOR).toFixed(2));
}
