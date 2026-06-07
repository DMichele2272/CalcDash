import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(200000);
  const [rate, setRate] = useState(5.5);
  const [years, setYears] = useState(30);
  const [loanType, setLoanType] = useState<'mortgage' | 'auto' | 'personal'>('mortgage');

  // Calculate monthly payment using amortization formula
  const monthlyRate = rate / 100 / 12;
  const numberOfPayments = years * 12;
  const monthlyPayment = monthlyRate === 0
    ? principal / numberOfPayments
    : (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  const getLoanLabel = () => {
    switch (loanType) {
      case 'mortgage': return 'Mortgage';
      case 'auto': return 'Auto Loan';
      case 'personal': return 'Personal Loan';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl" id="loan-calc">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-border-lime p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-neon-lime select-none">LOAN</div>
        <h3 className="label-caps mb-8 text-neon-lime">Loan Payment Calculator</h3>

        {/* Loan Type Selection */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['mortgage', 'auto', 'personal'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setLoanType(type)}
              className={`px-6 py-3 rounded-xl font-bold border transition-all capitalize ${
                loanType === type ? 'bg-neon-lime text-black border-neon-lime' : 'bg-white/5 border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-white/40 text-xs uppercase tracking-widest font-black">Loan Amount</label>
              <span className="text-neon-lime font-bold">{formatCurrency(principal)}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-neon-lime"
            />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full mt-3 bg-black/40 border border-white/10 rounded-2xl p-3 text-lg font-black outline-none focus:border-neon-lime transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-white/40 text-xs uppercase tracking-widest font-black">Annual Interest Rate (%)</label>
              <span className="text-neon-lime font-bold">{rate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="15"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-neon-lime"
            />
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              step="0.1"
              className="w-full mt-3 bg-black/40 border border-white/10 rounded-2xl p-3 text-lg font-black outline-none focus:border-neon-lime transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-white/40 text-xs uppercase tracking-widest font-black">Loan Term (Years)</label>
              <span className="text-neon-lime font-bold">{years} years</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-neon-lime"
            />
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full mt-3 bg-black/40 border border-white/10 rounded-2xl p-3 text-lg font-black outline-none focus:border-neon-lime transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="glass-card neon-border-lime p-8">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Monthly Payment</p>
          <p className="text-4xl font-black text-neon-lime drop-shadow-[0_0_15px_rgba(0,255,0,0.3)]">{formatCurrency(monthlyPayment)}</p>
        </div>
        <div className="glass-card neon-border-cyan p-8">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Total Interest</p>
          <p className="text-4xl font-black text-neon-cyan">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="glass-card neon-border-pink p-8">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Total Payment</p>
          <p className="text-4xl font-black text-neon-pink">{formatCurrency(totalPayment)}</p>
        </div>
      </motion.div>

      {/* Amortization Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card border border-white/10 p-8"
      >
        <h4 className="label-caps mb-6 text-white">Loan Summary</h4>
        <div className="space-y-4">
          <div className="flex justify-between text-white/60">
            <span>Loan Type:</span>
            <span className="font-bold text-white capitalize">{getLoanLabel()}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Principal Amount:</span>
            <span className="font-bold text-white">{formatCurrency(principal)}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Monthly Payment:</span>
            <span className="font-bold text-neon-lime">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Total Payments:</span>
            <span className="font-bold text-white">{numberOfPayments}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Total Interest Paid:</span>
            <span className="font-bold text-neon-pink">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Total Amount Paid:</span>
            <span className="font-bold text-white">{formatCurrency(totalPayment)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
