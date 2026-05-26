import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { heroContent } from '../data';

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } }
      }}
      className="inline-block"
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={{
                hidden: { opacity: 0, y: 5 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.span>
  );
};

export default function Hero({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "20vh"]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(12px)"]);

  return (
    <motion.section 
      ref={ref}
      style={{ opacity, scale, y, filter }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-24 pt-16 relative z-10"
    >
      <motion.h2 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className={`text-xs font-bold tracking-[0.5em] uppercase mb-6 ${isDark ? 'text-knls-orange' : 'text-knls-orange'}`}
      >
        {heroContent.badge}
      </motion.h2>
      
      <h1 
        className={`text-5xl md:text-7xl font-light tracking-tight leading-tight mb-8 max-w-4xl transition-colors duration-500 ${isDark ? 'text-white' : 'text-knls-blue'}`}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {heroContent.titleLine1}
        </motion.span><br/>
        <span className={`italic font-serif ${isDark ? 'text-white/90' : 'text-knls-blue/80'}`}><TypewriterText text={heroContent.titleLine2} delay={0.8} /></span>
      </h1>
      
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
        className={`max-w-2xl text-sm md:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}
      >
        {heroContent.description}
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
