import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  excerpt: string[];
  title: string;
  onClose: () => void;
  isDark: boolean;
}

export default function ExcerptReader({ excerpt, title, onClose, isDark }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  const nextPage = () => {
    if (currentPage < excerpt.length - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm ${isDark ? 'bg-black/80' : 'bg-slate-900/60'}`}
    >
      <div className="absolute inset-0 z-0" onClick={onClose} />
      
      <button 
        onClick={onClose}
        className={`absolute top-6 right-6 md:top-10 md:right-10 z-50 p-3 rounded-full border transition-all ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-white/40 text-white hover:bg-white/20'}`}
      >
        <X size={20} />
      </button>

      {/* The 3D Book Container */}
      <div className="relative z-10 perspective-[2000px] w-full max-w-4xl h-[70vh] max-h-[800px] flex items-center justify-center pointer-events-none">
        
        {/* The open book layout */}
        <div className={`relative w-full h-full max-w-[800px] flex shadow-2xl rounded-sm ${isDark ? 'bg-[#1a1814]' : 'bg-[#f4f1ea]'}`}>
           
           {/* Center binding */}
           <div className={`absolute top-0 bottom-0 left-1/2 w-10 -ml-5 bg-gradient-to-r ${isDark ? 'from-[#1a1814] via-[#111] to-[#1a1814]' : 'from-[#f4f1ea] via-[#e5dfd3] to-[#f4f1ea]'} shadow-inner z-0 pointer-events-none`}></div>

           {/* Left Page (Fixed) */}
           <div className="w-1/2 h-full p-8 md:p-12 border-r border-black/5 opacity-40 pointer-events-none hidden md:flex flex-col justify-between" style={{ transformStyle: 'preserve-3d' }}>
              <div className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/30' : 'text-black/30'}`}>{title}</div>
              <div className={`text-xs font-serif ${isDark ? 'text-white/30' : 'text-black/30'} flex-1 mt-10`}>
                 {currentPage > 0 ? excerpt[currentPage - 1].substring(0, 300) + '...' : ''}
              </div>
              <div className={`text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>{currentPage > 0 ? currentPage : ''}</div>
           </div>

           {/* Right Page (Active) */}
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentPage}
               initial={{ rotateY: 90, opacity: 0, transformOrigin: "left" }}
               animate={{ rotateY: 0, opacity: 1 }}
               exit={{ rotateY: -90, opacity: 0 }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
               className={`w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-between z-10 pointer-events-auto ${isDark ? 'bg-[#1a1814] text-zinc-300' : 'bg-[#f4f1ea] text-slate-800'}`}
               style={{ transformStyle: 'preserve-3d' }}
               drag="x"
               dragConstraints={{ left: 0, right: 0 }}
               dragElastic={0.2}
               onDragEnd={(e, { offset, velocity }) => {
                 const swipe = offset.x;
                 if (swipe < -50) nextPage();
                 else if (swipe > 50) prevPage();
               }}
             >
                <div className={`text-[10px] uppercase tracking-widest font-bold text-right ${isDark ? 'text-[#D4AF37]' : 'text-knls-orange'}`}>Excerpt</div>
                
                <div className="flex-1 mt-10 overflow-auto no-scrollbar font-serif text-sm md:text-base leading-loose whitespace-pre-wrap">
                  {excerpt[currentPage]}
                </div>
                
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-black/5">
                   <button 
                     onClick={prevPage}
                     disabled={currentPage === 0}
                     className={`p-2 rounded-full transition-colors ${currentPage === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5'}`}
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <div className="text-[10px] font-mono opacity-50">{currentPage + 1} / {excerpt.length}</div>
                   <button 
                     onClick={nextPage}
                     disabled={currentPage === excerpt.length - 1}
                     className={`p-2 rounded-full transition-colors ${currentPage === excerpt.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/5'}`}
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
             </motion.div>
           </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}
