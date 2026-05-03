import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function PercentageCalculator() {
  const [valA, setValA] = useState('20');
  const [valB, setValB] = useState('150');
  
  const [valC, setValC] = useState('50');
  const [valD, setValD] = useState('200');

  const result1 = (Number(valA) / 100) * Number(valB);
  const result2 = (Number(valC) / Number(valD)) * 100;

  return (
    <div className="space-y-8" id="perc-calc">
      <div className="glass-card neon-border-purple p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-neon-purple select-none">PCT</div>
        <h3 className="label-caps mb-8 text-neon-purple">Ratio Analysis v1</h3>
        <div className="flex flex-wrap items-center gap-4 text-3xl font-black italic tracking-tighter">
          <span>WHAT IS</span>
          <input 
            type="number" 
            value={valA} 
            onChange={e => setValA(e.target.value)}
            className="w-24 bg-black border border-zinc-800 rounded p-2 text-center text-neon-purple outline-none focus:border-neon-purple transition-all not-italic font-mono text-xl"
          />
          <span>% OF</span>
          <input 
            type="number" 
            value={valB} 
            onChange={e => setValB(e.target.value)}
            className="w-32 bg-black border border-zinc-800 rounded p-2 text-center text-white outline-none focus:border-white transition-all not-italic font-mono text-xl"
          />
          <span className="text-zinc-700 not-italic">=</span>
          <span className="text-neon-purple drop-shadow-[0_0_15px_rgba(112,0,255,0.4)]">
            {isNaN(result1) ? '0' : result1.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="glass-card border border-zinc-800 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-white select-none">SHR</div>
        <h3 className="label-caps mb-8 text-zinc-500">Distribution Model</h3>
        <div className="flex flex-wrap items-center gap-4 text-3xl font-black italic tracking-tighter">
          <input 
            type="number" 
            value={valC} 
            onChange={e => setValC(e.target.value)}
            className="w-24 bg-black border border-zinc-800 rounded p-2 text-center text-white outline-none focus:border-white transition-all not-italic font-mono text-xl"
          />
          <span>IS WHAT % OF</span>
          <input 
            type="number" 
            value={valD} 
            onChange={e => setValD(e.target.value)}
            className="w-32 bg-black border border-zinc-800 rounded p-2 text-center text-white outline-none focus:border-white transition-all not-italic font-mono text-xl"
          />
          <span className="text-zinc-700 not-italic">=</span>
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {isNaN(result2) ? '0' : result2.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
