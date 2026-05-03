import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [lastOp, setLastOp] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    if (display === '0') {
      setDisplay(digit);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op);
    setLastOp(op);
    setDisplay('0');
  };

  const calculate = () => {
    if (!lastOp) return;
    const [val1] = equation.split(' ');
    const num1 = parseFloat(val1);
    const num2 = parseFloat(display);
    let result = 0;
    
    switch (lastOp) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
    }
    
    setDisplay(result.toString());
    setEquation('');
    setLastOp(null);
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setLastOp(null);
  };

  const deleteLast = () => {
    setDisplay(display.slice(0, -1) || '0');
  };

  // Keyboard Support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on space/arrows if needed, but here we just want specific keys
      if (e.key >= '0' && e.key <= '9') handleDigit(e.key);
      if (e.key === '.') handleDigit('.');
      if (e.key === '+') handleOp('+');
      if (e.key === '-') handleOp('-');
      if (e.key === '*') handleOp('*');
      if (e.key === '/') handleOp('/');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clear();
      if (e.key === 'Backspace') deleteLast();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation, lastOp]);

  const buttons = [
    { label: 'C', onClick: clear, className: 'text-neon-magenta' },
    { label: '÷', onClick: () => handleOp('/'), className: 'text-neon-cyan' },
    { label: '×', onClick: () => handleOp('*'), className: 'text-neon-cyan' },
    { label: 'DEL', onClick: deleteLast, className: 'text-neon-magenta' },
    { label: '7', onClick: () => handleDigit('7') },
    { label: '8', onClick: () => handleDigit('8') },
    { label: '9', onClick: () => handleDigit('9') },
    { label: '-', onClick: () => handleOp('-'), className: 'text-neon-cyan' },
    { label: '4', onClick: () => handleDigit('4') },
    { label: '5', onClick: () => handleDigit('5') },
    { label: '6', onClick: () => handleDigit('6') },
    { label: '+', onClick: () => handleOp('+'), className: 'text-neon-cyan' },
    { label: '1', onClick: () => handleDigit('1') },
    { label: '2', onClick: () => handleDigit('2') },
    { label: '3', onClick: () => handleDigit('3') },
    { label: '=', onClick: calculate, className: 'row-span-2 bg-neon-cyan text-black hover:bg-white', isAction: true },
    { label: '0', onClick: () => handleDigit('0'), className: 'col-span-2' },
    { label: '.', onClick: () => handleDigit('.') },
  ];

  return (
    <div className="max-w-xs mx-auto p-6 glass-card neon-border-pink relative" id="basic-calc">
      <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-neon-pink select-none">STD</div>
      <h3 className="label-caps mb-4">Standard Core v2</h3>
      
      <div className="mb-6 p-4 bg-black rounded-lg border border-zinc-800 text-right min-h-[100px] flex flex-col justify-end">
        <div className="text-zinc-600 font-mono text-[10px] mb-1 uppercase tracking-widest">{equation}</div>
        <div className="text-4xl font-black font-mono tracking-tighter text-neon-pink">
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <motion.button
            key={btn.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.onClick}
            className={cn(
              "h-12 rounded font-bold flex items-center justify-center text-sm transition-all border border-zinc-800",
              btn.isAction ? "bg-neon-pink text-black text-xs font-black shadow-[0_0_15px_rgba(255,0,229,0.3)] hover:bg-white" : "bg-zinc-800 hover:bg-zinc-700",
              btn.className?.includes('text-neon-cyan') ? "text-neon-pink/60" : "",
              btn.className?.includes('text-neon-magenta') ? "text-white" : ""
            )}
          >
            {btn.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
