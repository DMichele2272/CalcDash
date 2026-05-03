import React, { useState, useMemo } from 'react';
import { formatCurrency, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ChevronDown, ChevronUp, Table as TableIcon, BarChart3 } from 'lucide-react';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1500);
  const [monthlyHOA, setMonthlyHOA] = useState(0);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [showAmortization, setShowAmortization] = useState(false);

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = term * 12;
    
    const monthlyPI = 
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const monthlyTax = (homePrice * (propertyTaxRate / 100)) / 12;
    const monthlyInsurance = homeInsurance / 12;
    const downPaymentPercent = (downPayment / homePrice) * 100;
    const monthlyPMI = downPaymentPercent < 20 ? (loanAmount * (pmiRate / 100)) / 12 : 0;
    
    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA + monthlyPMI;

    // Amortization Schedule
    const schedule = [];
    let currentBalance = loanAmount;
    let totalInterestPaid = 0;
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = Math.min(monthlyPI - interestPayment, currentBalance);
      currentBalance -= principalPayment;
      totalInterestPaid += interestPayment;

      if (month % 12 === 0 || month === numberOfPayments) {
        schedule.push({
          year: Math.ceil(month / 12),
          balance: Math.max(0, Math.round(currentBalance)),
          interestPaid: Math.round(totalInterestPaid),
          principalPaid: Math.round(loanAmount - currentBalance)
        });
      }
    }

    return { 
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment: isNaN(totalMonthlyPayment) ? 0 : totalMonthlyPayment,
      totalInterest: totalInterestPaid,
      totalCost: totalInterestPaid + loanAmount + (monthlyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments) + (monthlyPMI * numberOfPayments),
      schedule,
      loanAmount
    };
  }, [homePrice, downPayment, interestRate, term, propertyTaxRate, homeInsurance, monthlyHOA, pmiRate]);

  return (
    <div className="flex flex-col gap-8" id="mortgage-calc">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card neon-border-lime p-8">
            <h3 className="text-neon-lime label-caps mb-8 tracking-[0.3em]">Purchase Details</h3>
            <div className="space-y-6">
              <InputGroup label="Home Price" value={homePrice} onChange={setHomePrice} min={50000} max={2000000} step={5000} format="currency" color="lime" />
              <InputGroup label="Down Payment" value={downPayment} onChange={setDownPayment} min={0} max={homePrice} step={1000} format="currency" color="lime" />
              <InputGroup label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} min={0.1} max={15} step={0.1} color="lime" />
              <div className="flex gap-2">
                {[15, 30].map(val => (
                  <button key={val} onClick={() => setTerm(val)} className={cn("flex-1 py-3 rounded font-black uppercase text-[10px] tracking-widest transition-all", term === val ? "bg-neon-lime text-black" : "bg-zinc-800 text-zinc-500")}>
                    {val}Y TERM
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card border border-zinc-800 p-8">
            <h3 className="text-zinc-400 label-caps mb-8">Additional Costs</h3>
            <div className="space-y-6">
              <InputGroup label="Property Tax (%)" value={propertyTaxRate} onChange={setPropertyTaxRate} min={0.1} max={5} step={0.05} color="cyan" />
              <InputGroup label="Insurance ($/yr)" value={homeInsurance} onChange={setHomeInsurance} min={0} max={10000} step={100} format="currency" color="cyan" />
              <InputGroup label="Monthly HOA" value={monthlyHOA} onChange={setMonthlyHOA} min={0} max={2000} step={10} format="currency" color="cyan" />
              { (downPayment / homePrice) < 0.2 && (
                <InputGroup label="PMI Rate (%)" value={pmiRate} onChange={setPmiRate} min={0.1} max={2} step={0.1} color="pink" />
              )}
            </div>
          </div>
        </div>

        {/* Results & Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card neon-border-cyan p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col justify-center">
              <label className="label-caps mb-4 block opacity-60">Total Monthly Payment</label>
              <div className="text-7xl font-black text-neon-cyan italic tracking-tighter drop-shadow-[0_0_20px_rgba(0,255,209,0.3)] mb-2">
                {formatCurrency(results.totalMonthlyPayment)}
              </div>
              <p className="text-xs text-zinc-500 font-mono">ESTIMATED PITI + HOA</p>
            </div>

            <div className="space-y-4 border-l border-zinc-800 pl-10">
              <BreakdownRow label="Principal & Int" value={results.monthlyPI} color="text-white" />
              <BreakdownRow label="Property Taxes" value={results.monthlyTax} color="text-neon-cyan" />
              <BreakdownRow label="Home Insurance" value={results.monthlyInsurance} color="text-neon-cyan" />
              {results.monthlyHOA > 0 && <BreakdownRow label="HOA Fees" value={results.monthlyHOA} color="text-neon-cyan" />}
              {results.monthlyPMI > 0 && <BreakdownRow label="PMI" value={results.monthlyPMI} color="text-neon-pink" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            <div className="glass-card border border-zinc-800 p-8 h-[300px]">
              <h4 className="label-caps mb-6 flex items-center gap-2"><BarChart3 size={14}/> Equity Projection</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results.schedule}>
                  <Area type="monotone" dataKey="principalPaid" stackId="1" stroke="#00FFD1" fill="#00FFD1" fillOpacity={0.4} />
                  <Area type="monotone" dataKey="interestPaid" stackId="1" stroke="#7000FF" fill="#7000FF" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid #1a1a1a', borderRadius: '8px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card border border-zinc-800 p-8 h-[300px]">
              <h4 className="label-caps mb-6">Payment Breakdown</h4>
              <div className="h-full flex items-center justify-center pb-8">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[{
                     name: 'Monthly',
                     PAndI: results.monthlyPI,
                     Taxes: results.monthlyTax,
                     Insurance: results.monthlyInsurance,
                     HOA: results.monthlyHOA,
                     PMI: results.monthlyPMI
                   }]}>
                     <Bar dataKey="PAndI" stackId="a" fill="#ffffff" />
                     <Bar dataKey="Taxes" stackId="a" fill="#00FFD1" />
                     <Bar dataKey="Insurance" stackId="a" fill="#00FFD1" opacity={0.6} />
                     <Bar dataKey="HOA" stackId="a" fill="#00FFD1" opacity={0.3} />
                     <Bar dataKey="PMI" stackId="a" fill="#FF00E5" />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#050505', border: '1px solid #1a1a1a' }} />
                   </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Table Toggle */}
      <div className="glass-card border border-zinc-800 overflow-hidden">
        <button 
          onClick={() => setShowAmortization(!showAmortization)}
          className="w-full flex items-center justify-between p-6 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <TableIcon className="text-neon-lime" size={20} />
            <span className="label-caps tracking-[0.3em] mt-1">Full Amortization Schedule</span>
          </div>
          {showAmortization ? <ChevronUp /> : <ChevronDown />}
        </button>
        
        <AnimatePresence>
          {showAmortization && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 pb-6 overflow-x-auto"
            >
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="py-4">YEAR</th>
                    <th className="py-4">INTEREST PAID</th>
                    <th className="py-4">PRINCIPAL PAID</th>
                    <th className="py-4">REMAINING BALANCE</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {results.schedule.map((row) => (
                    <tr key={row.year} className="border-b border-zinc-900 hover:bg-white/5 transition-colors">
                      <td className="py-3 text-neon-lime font-bold">YEAR {row.year}</td>
                      <td className="py-3">{formatCurrency(row.interestPaid)}</td>
                      <td className="py-3">{formatCurrency(row.principalPaid)}</td>
                      <td className="py-3 text-white">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, min, max, step, format, color }: any) {
  const accentClass = color === 'lime' ? 'accent-neon-lime' : color === 'pink' ? 'accent-neon-pink' : 'accent-neon-cyan';
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="label-caps text-[9px]">{label}</label>
        <span className="text-white font-mono font-bold text-sm">
          {format === 'currency' ? formatCurrency(value) : value + (label.includes('%') ? '%' : '')}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer", accentClass)}
      />
    </div>
  );
}

function BreakdownRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-sm font-bold">
      <span className="text-zinc-500 uppercase tracking-widest text-[10px]">{label}</span>
      <span className={cn("font-mono", color)}>{formatCurrency(value)}</span>
    </div>
  );
}

