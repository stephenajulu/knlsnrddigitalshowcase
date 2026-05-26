import { useEffect } from 'react';
import { motion } from 'motion/react';

interface Props {
  isDark: boolean;
  onComplete: () => void;
}

export default function Preloader({ isDark, onComplete }: Props) {
  useEffect(() => {
    Promise.all([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 2500)) // Ensure minimum show time
    ]).then(() => {
      onComplete();
    });
  }, [onComplete]);

  return (
    <motion.div
      exit={{ opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className={`fixed inset-0 z-[10000] flex items-center justify-center ${isDark ? 'bg-[#050505]' : 'bg-[#e2ddd8]'}`}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, letterSpacing: '0em', filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, letterSpacing: '0.1em', filter: 'blur(0px)' }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className={`text-3xl md:text-5xl font-serif font-light text-center px-4 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}
      >
        Our Stories, Our Future.
      </motion.div>
    </motion.div>
  );
}
