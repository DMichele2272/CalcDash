import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { Scale, Ruler, Thermometer, Zap, Layers, Beaker, Gauge, ArrowLeftRight } from 'lucide-react';

const units: any = {
  length: {
    label: 'Length',
    icon: Ruler,
    color: 'neon-cyan',
    conversions: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254 }
  },
  weight: {
    label: 'Weight',
    icon: Scale,
    color: 'neon-pink',
    conversions: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 }
  },
  area: {
    label: 'Area',
    icon: Layers,
    color: 'neon-lime',
    conversions: { sqm: 1, sqft: 0.092903, acre: 4046.86, hectare: 10000, sqmi: 2589988, sqin: 0.00064516 }
  },
  volume: {
    label: 'Volume',
    icon: Beaker,
    color: 'neon-purple',
    conversions: { liter: 1, ml: 0.001, gall: 3.78541, cup: 0.236588, floz: 0.0295735, pint: 0.473176, quart: 0.946353 }
  },
  speed: {
    label: 'Speed',
    icon: Gauge,
    color: 'neon-cyan',
    conversions: { mps: 1, kph: 0.277778, mph: 0.44704, knot: 0.514444 }
  },
  storage: {
    label: 'Data',
    icon: Zap,
    color: 'neon-pink',
    conversions: { MB: 1, KB: 0.001, GB: 1000, TB: 1000000, bit: 0.000000125, byte: 0.000001 }
  },
  temp: {
    label: 'Temp',
    icon: Thermometer,
    color: 'neon-lime',
    isSpecial: true
  }
};

export default function UnitConverter() {
  const [activeCategory, setActiveCategory] = useState('length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const convertValue = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    
    if (activeCategory === 'temp') {
      if (fromUnit === toUnit) return num;
      if (fromUnit === 'C' && toUnit === 'F') return (num * 9/5) + 32;
      if (fromUnit === 'F' && toUnit === 'C') return (num - 32) * 5/9;
      return num;
    }

    const cat = units[activeCategory];
    const inBase = num * cat.conversions[fromUnit];
    return inBase / cat.conversions[toUnit];
  };

  const result = convertValue();

  return (
    <div className="max-w-xl mx-auto" id="unit-converter">
      <div className="flex gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
        {Object.entries(units).map(([key, cat]: any) => (
          <button
            key={key}
            onClick={() => {
              setActiveCategory(key);
              if (key === 'temp') {
                setFromUnit('C');
                setToUnit('F');
              } else {
                const keys = Object.keys(cat.conversions);
                setFromUnit(keys[0]);
                setToUnit(keys[keys.length-1]);
              }
            }}
            className={cn(
              "flex flex-col items-center gap-3 p-5 rounded-xl bg-zinc-900/50 border transition-all min-w-[100px]",
              activeCategory === key 
                ? `border-${cat.color} bg-${cat.color}/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                : "border-zinc-800 opacity-40 hover:opacity-100"
            )}
          >
            <cat.icon className={cn("w-5 h-5", activeCategory === key ? `text-${cat.color}` : "text-white")} />
            <span className="label-caps !text-[9px] truncate w-full">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="glass-card neon-border-cyan p-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-8">
          <div className="space-y-6">
             <div>
                <label className="label-caps mb-2 block">Source Value</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-4 text-2xl font-black text-white focus:border-neon-cyan outline-none transition-all"
                />
             </div>
             <select 
               value={fromUnit}
               onChange={(e) => setFromUnit(e.target.value)}
               className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 label-caps text-white"
             >
               {activeCategory === 'temp' ? (
                 <>
                   <option value="C">Celsius</option>
                   <option value="F">Fahrenheit</option>
                 </>
               ) : (
                 Object.keys(units[activeCategory].conversions).map(u => <option key={u} value={u}>{u}</option>)
               )}
             </select>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="opacity-20">
              <Zap className="text-neon-cyan" size={24} />
            </div>
            <motion.button
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={swapUnits}
              className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(0,255,209,0.2)] hover:border-neon-cyan transition-colors"
            >
              <ArrowLeftRight size={18} />
            </motion.button>
          </div>

          <div className="space-y-6">
             <div>
                <label className="label-caps mb-2 block">Calculated Result</label>
                <div className="w-full bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg p-4 text-2xl font-black text-neon-cyan min-h-[66px] flex items-center">
                   {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
             </div>
             <select 
               value={toUnit}
               onChange={(e) => setToUnit(e.target.value)}
               className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 label-caps text-white"
             >
               {activeCategory === 'temp' ? (
                 <>
                   <option value="C">Celsius</option>
                   <option value="F">Fahrenheit</option>
                 </>
               ) : (
                 Object.keys(units[activeCategory].conversions).map(u => <option key={u} value={u}>{u}</option>)
               )}
             </select>
          </div>
        </div>
      </div>
    </div>
  );
}
