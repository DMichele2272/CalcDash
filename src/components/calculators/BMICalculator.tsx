import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export default function BMICalculator() {
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Calculate BMI
  let heightInMeters = height / 100;
  let weightInKg = weight;

  if (unit === 'imperial') {
    // Convert inches to meters and pounds to kg
    heightInMeters = (height * 0.0254);
    weightInKg = weight * 0.453592;
  }

  const bmi = weightInKg / (heightInMeters * heightInMeters);

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-neon-cyan', bgColor: 'bg-neon-cyan/10' };
    if (bmiValue < 25) return { category: 'Normal Weight', color: 'text-neon-lime', bgColor: 'bg-neon-lime/10' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-neon-pink', bgColor: 'bg-neon-pink/10' };
    return { category: 'Obese', color: 'text-red-500', bgColor: 'bg-red-500/10' };
  };

  const bmiInfo = getBMICategory(bmi);
  const idealWeightMin = 18.5 * heightInMeters * heightInMeters;
  const idealWeightMax = 24.9 * heightInMeters * heightInMeters;

  return (
    <div className="space-y-8 max-w-4xl" id="bmi-calc">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-border-cyan p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-neon-cyan select-none">BMI</div>
        <h3 className="label-caps mb-8 text-neon-cyan">Body Mass Index Calculator</h3>

        {/* Unit Toggle */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setUnit('metric')}
            className={`px-6 py-3 rounded-xl font-bold border transition-all ${
              unit === 'metric' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 border-white/10'
            }`}
          >
            Metric (cm, kg)
          </button>
          <button
            onClick={() => setUnit('imperial')}
            className={`px-6 py-3 rounded-xl font-bold border transition-all ${
              unit === 'imperial' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-white/5 border-white/10'
            }`}
          >
            Imperial (in, lbs)
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4">Height {unit === 'metric' ? '(cm)' : '(inches)'}</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-2xl font-black outline-none focus:border-neon-cyan transition-all text-center"
            />
            <input
              type="range"
              min={unit === 'metric' ? 100 : 40}
              max={unit === 'metric' ? 250 : 100}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full mt-4 accent-neon-cyan"
            />
          </div>
          <div>
            <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4">Weight {unit === 'metric' ? '(kg)' : '(lbs)'}</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-2xl font-black outline-none focus:border-neon-cyan transition-all text-center"
            />
            <input
              type="range"
              min={unit === 'metric' ? 30 : 65}
              max={unit === 'metric' ? 200 : 440}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full mt-4 accent-neon-cyan"
            />
          </div>
        </div>
      </motion.div>

      {/* Result */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`glass-card p-8 relative overflow-hidden border border-white/10 ${bmiInfo.bgColor}`}
      >
        <div className="flex items-center gap-4 mb-8">
          <Activity className={bmiInfo.color} size={32} />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest font-black">Your BMI</p>
            <p className={`text-5xl font-black ${bmiInfo.color}`}>{bmi.toFixed(1)}</p>
          </div>
        </div>
        <div className={`text-2xl font-black ${bmiInfo.color} mb-8`}>{bmiInfo.category}</div>
        <div className="space-y-4">
          <div className="flex justify-between text-white/60">
            <span>Healthy BMI Range:</span>
            <span className="text-neon-lime font-bold">18.5 - 24.9</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Ideal Weight Range:</span>
            <span className="text-neon-lime font-bold">{idealWeightMin.toFixed(1)} - {idealWeightMax.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
