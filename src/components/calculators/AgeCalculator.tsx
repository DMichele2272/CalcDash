import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-15');
  const [age, setAge] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateAge = () => {
      const birth = new Date(birthDate);
      const today = new Date();

      if (birth > today) {
        setAge({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();
      let hours = today.getHours() - birth.getHours();
      let minutes = today.getMinutes() - birth.getMinutes();
      let seconds = today.getSeconds() - birth.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setAge({ years, months, days, hours, minutes, seconds });
    };

    updateAge();
    const interval = setInterval(updateAge, 1000);
    return () => clearInterval(interval);
  }, [birthDate]);

  const totalDays = Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8 max-w-4xl" id="age-calc">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card neon-border-pink p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl italic font-black text-neon-pink select-none">AGE</div>
        <h3 className="label-caps mb-8 text-neon-pink">Age Calculator</h3>

        <div>
          <label className="block text-white/40 text-xs uppercase tracking-widest font-black mb-4 flex items-center gap-2">
            <Calendar size={14} /> Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-lg font-black outline-none focus:border-neon-pink transition-all"
          />
        </div>
      </motion.div>

      {/* Age Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="glass-card neon-border-pink p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Years</p>
          <p className="text-5xl font-black text-neon-pink">{age.years}</p>
        </div>
        <div className="glass-card neon-border-pink p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Months</p>
          <p className="text-5xl font-black text-neon-pink">{age.months}</p>
        </div>
        <div className="glass-card neon-border-pink p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Days</p>
          <p className="text-5xl font-black text-neon-pink">{age.days}</p>
        </div>
      </motion.div>

      {/* Time Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="glass-card border border-white/10 p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Hours</p>
          <p className="text-3xl font-black text-white">{String(age.hours).padStart(2, '0')}</p>
        </div>
        <div className="glass-card border border-white/10 p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Minutes</p>
          <p className="text-3xl font-black text-white">{String(age.minutes).padStart(2, '0')}</p>
        </div>
        <div className="glass-card border border-white/10 p-8 text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest font-black mb-2">Seconds</p>
          <p className="text-3xl font-black text-white">{String(age.seconds).padStart(2, '0')}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card neon-border-cyan p-8"
      >
        <h4 className="label-caps mb-6 text-neon-cyan">Lifetime Statistics</h4>
        <div className="space-y-4">
          <div className="flex justify-between text-white/60">
            <span>Total Days Lived:</span>
            <span className="text-neon-cyan font-bold">{totalDays.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Total Hours:</span>
            <span className="text-neon-cyan font-bold">{(totalDays * 24).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Total Minutes:</span>
            <span className="text-neon-cyan font-bold">{(totalDays * 24 * 60).toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
