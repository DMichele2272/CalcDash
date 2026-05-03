import React, { useState } from 'react';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';
import { Users, ReceiptText, Sparkles } from 'lucide-react';

export default function TipCalculator() {
  const [bill, setBill] = useState(65.50);
  const [tipPerc, setTipPerc] = useState(18);
  const [people, setPeople] = useState(2);

  const tipAmount = bill * (tipPerc / 100);
  const total = bill + tipAmount;
  const perPerson = total / people;

  return (
    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8" id="tip-calc">
      <div className="glass-card neon-border-green p-8 space-y-8">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4">Total Bill</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-green font-bold text-xl">$</span>
            <input 
              id="tip-bill"
              type="number"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pl-10 text-3xl font-black outline-none focus:border-neon-green transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4">Tip Percentage ({tipPerc}%)</label>
          <div className="grid grid-cols-3 gap-3">
            {[15, 18, 20, 25, 30].slice(0, 3).map(p => (
              <button
                key={p}
                id={`tip-p-${p}`}
                onClick={() => setTipPerc(p)}
                className={`py-3 rounded-xl font-bold border transition-all ${
                  tipPerc === p ? 'bg-neon-green text-black border-neon-green' : 'bg-white/5 border-white/10'
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={tipPerc}
            onChange={(e) => setTipPerc(Number(e.target.value))}
            className="w-full mt-6 accent-neon-green"
          />
        </div>

        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4 flex items-center gap-2">
            <Users size={14} /> Split Between
          </label>
          <div className="flex items-center gap-4">
            <button 
              id="split-minus"
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
            >-</button>
            <span className="text-3xl font-black min-w-[40px] text-center">{people}</span>
            <button 
              id="split-plus"
              onClick={() => setPeople(people + 1)}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl"
            >+</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="glass-card neon-border-cyan p-8 flex-1 flex flex-col justify-between">
          <div className="space-y-6">
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-white/40 text-xs uppercase tracking-widest font-black">Tip Amount</p>
                 <p className="text-xs text-white/20">/ total</p>
               </div>
               <p className="text-3xl font-black text-neon-cyan">{formatCurrency(tipAmount)}</p>
             </div>
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-white/40 text-xs uppercase tracking-widest font-black">Total Bill</p>
                 <p className="text-xs text-white/20">/ with tip</p>
               </div>
               <p className="text-3xl font-black text-white">{formatCurrency(total)}</p>
             </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
             <p className="text-neon-cyan text-xs uppercase tracking-widest font-black mb-1">Per Person</p>
             <p className="text-6xl font-black tracking-tighter text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
               {formatCurrency(perPerson)}
             </p>
          </div>
        </div>
        
        <div className="bg-neon-green p-6 rounded-2xl flex items-center gap-4 text-black font-black uppercase tracking-tighter">
           <Sparkles />
           <span>Optimized for fast splitting</span>
        </div>
      </div>
    </div>
  );
}
