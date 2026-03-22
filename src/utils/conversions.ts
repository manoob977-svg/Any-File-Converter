export type UnitCategory = 
  | "Length" | "Area" | "Volume" | "Weight/Mass" | "Pressure" 
  | "Force" | "Energy/Work" | "Power" | "Temperature" | "Torque";

export interface ConversionUnit {
  label: string;
  value: string;
  factor: number; // Factor to convert to a base unit (e.g., meters for length)
}

export const CATEGORIES: UnitCategory[] = [
  "Length", "Area", "Volume", "Weight/Mass", "Pressure", 
  "Force", "Energy/Work", "Power", "Temperature", "Torque"
];

export const UNITS: Record<UnitCategory, ConversionUnit[]> = {
  Length: [
    { label: "Millimeter (mm)", value: "mm", factor: 0.001 },
    { label: "Centimeter (cm)", value: "cm", factor: 0.01 },
    { label: "Meter (m)", value: "m", factor: 1 },
    { label: "Kilometer (km)", value: "km", factor: 1000 },
    { label: "Inch (in)", value: "in", factor: 0.0254 },
    { label: "Foot (ft)", value: "ft", factor: 0.3048 },
    { label: "Yard (yd)", value: "yd", factor: 0.9144 },
    { label: "Mile (mi)", value: "mi", factor: 1609.344 },
    { label: "Nautical Mile", value: "nmi", factor: 1852 },
    { label: "Micron (μm)", value: "um", factor: 0.000001 },
  ],
  Area: [
    { label: "Sq Millimeter (mm²)", value: "sqmm", factor: 0.000001 },
    { label: "Sq Meter (m²)", value: "sqm", factor: 1 },
    { label: "Hectare (ha)", value: "ha", factor: 10000 },
    { label: "Acre (ac)", value: "ac", factor: 4046.8564224 },
    { label: "Sq Inch (in²)", value: "sqin", factor: 0.00064516 },
    { label: "Sq Foot (ft²)", value: "sqft", factor: 0.09290304 },
  ],
  Volume: [
    { label: "Cubic Meter (m³)", value: "m3", factor: 1 },
    { label: "Liter (L)", value: "L", factor: 0.001 },
    { label: "Milliliter (mL)", value: "mL", factor: 0.000001 },
    { label: "Gallon (US)", value: "gal", factor: 0.00378541 },
    { label: "Cubic Inch (in³)", value: "in3", factor: 0.00001638706 },
    { label: "Cubic Foot (ft³)", value: "ft3", factor: 0.02831685 },
  ],
  "Weight/Mass": [
    { label: "Milligram (mg)", value: "mg", factor: 0.000001 },
    { label: "Gram (g)", value: "g", factor: 0.001 },
    { label: "Kilogram (kg)", value: "kg", factor: 1 },
    { label: "Metric Ton (t)", value: "t", factor: 1000 },
    { label: "Pound (lb)", value: "lb", factor: 0.45359237 },
    { label: "Ounce (oz)", value: "oz", factor: 0.02834952 },
  ],
  Pressure: [
    { label: "Pascal (Pa)", value: "Pa", factor: 1 },
    { label: "Bar", value: "bar", factor: 100000 },
    { label: "PSI (lb/in²)", value: "psi", factor: 6894.7572931 },
    { label: "Atmosphere (atm)", value: "atm", factor: 101325 },
    { label: "Torr", value: "torr", factor: 133.322 },
  ],
  Force: [
    { label: "Newton (N)", value: "N", factor: 1 },
    { label: "Kilo-Newton (kN)", value: "kN", factor: 1000 },
    { label: "Pound-force (lbf)", value: "lbf", factor: 4.448222 },
  ],
  "Energy/Work": [
    { label: "Joule (J)", value: "J", factor: 1 },
    { label: "Kilo-joule (kJ)", value: "kJ", factor: 1000 },
    { label: "Calorie (cal)", value: "cal", factor: 4.184 },
    { label: "BTU", value: "btu", factor: 1055.056 },
    { label: "Watt-hour (Wh)", value: "Wh", factor: 3600 },
  ],
  Power: [
    { label: "Watt (W)", value: "W", factor: 1 },
    { label: "Kilowatt (kW)", value: "kW", factor: 1000 },
    { label: "Horsepower (hp)", value: "hp", factor: 745.7 },
  ],
  Temperature: [
    { label: "Celsius (°C)", value: "C", factor: 1 },
    { label: "Fahrenheit (°F)", value: "F", factor: 1 },
    { label: "Kelvin (K)", value: "K", factor: 1 },
  ],
  Torque: [
    { label: "Newton-meter (N·m)", value: "Nm", factor: 1 },
    { label: "Foot-pound (ft·lb)", value: "ftlb", factor: 1.355818 },
  ],
};

export function convertUnits(value: number, from: string, to: string, category: UnitCategory): number {
  if (category === "Temperature") {
    // Special logic for Temp
    if (from === "C" && to === "F") return (value * 9/5) + 32;
    if (from === "C" && to === "K") return value + 273.15;
    if (from === "F" && to === "C") return (value - 32) * 5/9;
    if (from === "F" && to === "K") return (value - 32) * 5/9 + 273.15;
    if (from === "K" && to === "C") return value - 273.15;
    if (from === "K" && to === "F") return (value - 273.15) * 9/5 + 32;
    return value; // Same unit
  }

  const categoryUnits = UNITS[category];
  const fromUnit = categoryUnits.find(u => u.value === from);
  const toUnit = categoryUnits.find(u => u.value === to);

  if (!fromUnit || !toUnit) return value;

  // Convert to base unit then to target unit
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}

export function getConversionFormula(from: string, to: string, category: UnitCategory): string {
  const categoryUnits = UNITS[category];
  const fromUnit = categoryUnits.find(u => u.value === from);
  const toUnit = categoryUnits.find(u => u.value === to);

  if (!fromUnit || !toUnit) return "Real-time results are calculated with high precision.";
  if (from === to) return `1 ${fromUnit.label} = 1 ${toUnit.label}`;

  if (category === "Temperature") {
    if (from === "C" && to === "F") return "(°C × 9/5) + 32 = °F";
    if (from === "F" && to === "C") return "(°F - 32) × 5/9 = °C";
    if (from === "C" && to === "K") return "°C + 273.15 = K";
    if (from === "K" && to === "C") return "K - 273.15 = °C";
    if (from === "F" && to === "K") return "(°F - 32) × 5/9 + 273.15 = K";
    if (from === "K" && to === "F") return "(K - 273.15) × 9/5 + 32 = °F";
    return "Temperature conversion formula applied.";
  }

  const factor = fromUnit.factor / toUnit.factor;
  return `1 ${fromUnit.label} = ${factor.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit.label}`;
}
