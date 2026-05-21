import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { DisplayBook } from '../types';
import { X, Volume2, Square, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  book: DisplayBook;
  onClose: () => void;
  isDark: boolean;
}

export default function BookModal({ book, onClose, isDark }: Props) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesisInstance, setSpeechSynthesisInstance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    // Cleanup speech when modal closes
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const msg = new SpeechSynthesisUtterance(book.description);
      msg.rate = 0.9;
      msg.onend = () => setIsPlayingAudio(false);
      setSpeechSynthesisInstance(msg);
      window.speechSynthesis.speak(msg);
      setIsPlayingAudio(true);
    }
  };

  const isLongDescription = book.description.length > 180;
  const displayDescription = isExpanded || !isLongDescription 
    ? book.description 
    : book.description.substring(0, 180) + "...";

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 backdrop-blur-3xl overflow-hidden transition-colors duration-500 ${isDark ? 'bg-black/95' : 'bg-white/95'}`}
    >
      {/* Background Ambient Glow */}
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: isDark ? 0.15 : 0.05 }} exit={{ opacity: 0 }}
         transition={{ duration: 1 }}
         className={`absolute inset-0 bg-gradient-to-br ${book.coverGradient} blur-[120px] mix-blend-screen scale-150 rounded-full`}
      />

      <button 
        onClick={onClose}
        className={`absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full border flex items-center justify-center transition-all z-50 focus:outline-none ${isDark ? 'border-white/20 text-white/50 hover:text-white hover:border-white/50 hover:bg-white/5' : 'border-black/20 text-black/50 hover:text-black hover:border-black/50 hover:bg-black/5'}`}
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-7xl h-full max-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 relative z-10 overflow-y-auto overflow-x-hidden p-4 no-scrollbar">
        
        {/* Left Side: The Book Cover Morph */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end perspective-[2000px] shrink-0">
           <motion.div 
             layoutId={`book-container-${book.uniqueId}`}
             className={`w-[280px] md:w-full max-w-[400px] aspect-[2/3] rounded-2xl overflow-hidden relative border ${isDark ? 'shadow-[0_0_80px_rgba(255,255,255,0.08)] border-white/20' : 'shadow-[0_0_80px_rgba(0,0,0,0.15)] border-black/10'}`}
             transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
           >
             <motion.div 
                layoutId={`book-cover-${book.uniqueId}`}
                className={`absolute inset-0 bg-gradient-to-br ${book.coverGradient}`}
             />
             
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.2, duration: 0.3 }}
                className={`absolute inset-0 flex flex-col justify-between p-8 bg-gradient-to-t ${isDark ? 'from-black/90 via-black/20' : 'from-slate-900/90 via-slate-800/30'} to-transparent`}
             >
                <div className="flex justify-between items-start opacity-90">
                   <span className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border rounded backdrop-blur-md font-bold ${isDark ? 'border-white/20 bg-white/5 text-white' : 'border-white/40 bg-white/20 text-white'}`}>
                     Legal Deposit
                   </span>
                   <span className="text-sm font-serif italic text-white">{book.monthShort} 2026</span>
                </div>
                <div>
                   <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white mb-2 leading-none">
                     {book.title}
                   </h2>
                   <p className="text-base font-serif italic text-zinc-200">
                     {book.author}
                   </p>
                </div>
             </motion.div>
           </motion.div>
        </div>

        {/* Right Side: Metadata Injection */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
          className="w-full md:w-1/2 flex flex-col justify-center text-left"
        >
           <motion.h1 variants={itemVariants} className={`text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4 line-clamp-2 md:line-clamp-none leading-none ${isDark ? 'text-white' : 'text-knls-blue'}`}>
             {book.title}
           </motion.h1>
           
           <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
             <p className={`text-base md:text-xl font-serif italic ${isDark ? 'text-knls-orange' : 'text-knls-orange'}`}>By {book.author}</p>
             <span className={`hidden md:block w-1.5 h-1.5 rounded-full ${isDark ? 'bg-zinc-600' : 'bg-slate-300'}`}></span>
             <p className={`text-xs md:text-sm tracking-widest uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Received: {book.month} 2026
             </p>
           </motion.div>
           
           <motion.p variants={itemVariants} className={`text-sm font-serif italic mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
             "{book.authorTagline}"
           </motion.p>

           <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
             <button 
               onClick={toggleAudio}
               className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${isPlayingAudio ? (isDark ? 'bg-knls-orange text-black shadow-[0_0_15px_rgba(244,131,18,0.4)]' : 'bg-knls-orange text-white shadow-[0_0_15px_rgba(244,131,18,0.4)]') : (isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-knls-blue hover:bg-slate-300')}`}
             >
               {isPlayingAudio ? <Square size={14} className={isDark ? "fill-black" : "fill-white"} /> : <Volume2 size={14} />}
               {isPlayingAudio ? 'Stop Narration' : 'Play Synopsis'}
             </button>
           </motion.div>

           <motion.div variants={itemVariants} className={`h-[1px] w-full max-w-md bg-gradient-to-r mb-8 ${isDark ? 'from-white/20' : 'from-knls-blue/20'} to-transparent`} />

           <motion.div variants={itemVariants} className="mb-12">
             <p className={`text-base md:text-lg leading-relaxed font-serif max-w-xl ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
               {displayDescription}
             </p>
             {isLongDescription && (
               <button 
                 onClick={() => setIsExpanded(!isExpanded)}
                 className={`mt-4 flex items-center gap-1 text-xs uppercase tracking-widest font-bold transition-colors ${isDark ? 'text-knls-orange hover:text-white' : 'text-knls-orange hover:text-knls-blue'}`}
               >
                 {isExpanded ? 'Show Less' : 'Read More'}
                 {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
               </button>
             )}
           </motion.div>

           <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
             <button className={`w-full sm:w-auto px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded shadow-lg ${isDark ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10' : 'bg-knls-blue text-white hover:bg-knls-blue/90 shadow-knls-blue/20'}`}>
               Read on Vtabu
             </button>
             <button className={`w-full sm:w-auto px-8 py-4 border text-xs font-bold uppercase tracking-[0.2em] transition-colors rounded ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-knls-blue/20 text-knls-blue hover:bg-knls-blue/10'}`}>
               KNLS Digital Catalog
             </button>
           </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
