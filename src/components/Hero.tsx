import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';

export default function Hero({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.section 
      ref={ref}
      style={{ opacity, scale }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-24 pt-16 relative z-10"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className={`text-xs font-bold tracking-[0.5em] uppercase mb-6 ${isDark ? 'text-knls-orange' : 'text-knls-orange'}`}
      >
        National Reading Day 2026
      </motion.h2>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        className={`text-5xl md:text-7xl font-light tracking-tight leading-tight mb-8 max-w-4xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-knls-blue'}`}
      >
        Our Stories, Our Future:<br/>
        <span className={`italic font-serif ${isDark ? 'text-white/90' : 'text-knls-blue/80'}`}>Empowering Minds Through Reading</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
        className={`max-w-2xl text-sm md:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}
      >
        A curated digital archive of Kenya's preserved literary heritage. Explore the newest works received through legal deposit during the first seven months of 2026. Scroll down to enter the chronological timeline.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-12 mt-12 flex flex-col items-center gap-2"
      >
        <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Scroll</span>
        <ChevronDown size={20} className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} animate-bounce`} />
      </motion.div>
    </motion.section>
  );
}
