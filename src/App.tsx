import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Home, 
  TrendingUp, 
  RefreshCw, 
  Grid,
  Menu,
  X,
  Github,
  Twitter,
  ExternalLink,
  ReceiptText
} from 'lucide-react';
import { cn } from './lib/utils';
import BasicCalculator from './components/calculators/BasicCalculator';
import MortgageCalculator from './components/calculators/MortgageCalculator';
import UnitConverter from './components/calculators/UnitConverter';
import PercentageCalculator from './components/calculators/PercentageCalculator';
import TipCalculator from './components/calculators/TipCalculator';

const tabs = [
  { id: 'basic', label: 'Basic', icon: Calculator, color: 'text-neon-pink', border: 'neon-border-pink', bg: 'bg-neon-pink' },
  { id: 'mortgage', label: 'Lending', icon: Home, color: 'text-neon-lime', border: 'neon-border-lime', bg: 'bg-neon-lime' },
  { id: 'units', label: 'Units', icon: RefreshCw, color: 'text-neon-cyan', border: 'neon-border-cyan', bg: 'bg-neon-cyan' },
  { id: 'percentage', label: 'Stats', icon: TrendingUp, color: 'text-neon-purple', border: 'neon-border-purple', bg: 'bg-neon-purple' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-cyber-black overflow-hidden selection:bg-neon-cyan selection:text-black font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="relative z-20 bg-zinc-900/80 backdrop-blur-3xl border-r border-zinc-800 flex flex-col pt-8"
      >
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="flex flex-col">
             <span className="text-neon-cyan label-caps mb-1 leading-none">Universal Network</span>
             {isSidebarOpen && (
               <h1 className="text-3xl font-black tracking-tighter italic">
                 CALC<span className="text-neon-purple">DASH</span>
               </h1>
             )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative",
                activeTab === tab.id 
                  ? "bg-zinc-800/50 text-white border border-zinc-700 shadow-xl" 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              <div className={cn(
                "absolute left-0 w-1 h-6 rounded-r-full transition-all",
                activeTab === tab.id ? tab.bg : "bg-transparent"
              )} />
              <tab.icon className={cn("w-5 h-5 shrink-0 transition-colors", activeTab === tab.id ? tab.color : "group-hover:text-white")} />
              {isSidebarOpen && (
                <span className="font-bold tracking-widest uppercase text-[10px] mt-0.5">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-lg flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_8px_#FF00E5] animate-pulse"></div>
            <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">v4.2.0-STABLE</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center text-zinc-500"
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-y-auto">
        <div className="max-w-6xl w-full mx-auto p-12 flex-1 flex flex-col">
          <header className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-8">
            <div>
              <span className={cn("label-caps mb-2 block", tabs.find(t => t.id === activeTab)?.color)}>
                {activeTab} module activated
              </span>
              <h2 className="text-6xl font-black tracking-tighter italic uppercase">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            <div className="hidden lg:flex gap-2">
              {['CYAN', 'PURPLE', 'LIME', 'PINK'].map((color, i) => (
                <div key={color} className={cn("w-8 h-1", [
                  'bg-neon-cyan', 'bg-neon-purple', 'bg-neon-lime', 'bg-neon-pink'
                ][i])} />
              ))}
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {activeTab === 'basic' && <BasicCalculator />}
              {activeTab === 'mortgage' && <MortgageCalculator />}
              {activeTab === 'units' && <UnitConverter />}
              {activeTab === 'percentage' && <PercentageCalculator />}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-20 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
            <div className="flex gap-8">
              <span>© 2026 CALCULATOR DASH NETWORKS</span>
              <span className="hidden md:inline">SYSTEM_STATUS: NOMINAL</span>
            </div>
            <div className="flex gap-6">
              <span>Terms.cfg</span>
              <span>Privacy.log</span>
              <span className="text-zinc-400">LATENCY: 12MS</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
