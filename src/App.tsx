/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { books } from './data';
import Nav from './components/Nav';
import Hero from './components/Hero';
import FeaturedAuthor from './components/FeaturedAuthor';
import Showcase from './components/Showcase';
import BookModal from './components/BookModal';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import { DisplayBook } from './types';
import { Expand } from 'lucide-react';

export default function App() {
  const systemReducedMotion = useReducedMotion();
  const [activeBook, setActiveBook] = useState<DisplayBook | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [userMotionPaused, setUserMotionPaused] = useState<boolean | null>(null);
  const [isCinematicMode, setIsCinematicMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const isMotionPaused = userMotionPaused ?? systemReducedMotion ?? false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Revert from cinematic mode
      if (e.key === 'Escape' && isCinematicMode && !activeBook && !isCommandPaletteOpen) {
        setIsCinematicMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinematicMode, activeBook, isCommandPaletteOpen]);

  return (
    <div className={`transition-colors duration-500 font-sans min-h-screen relative overflow-hidden ${isDark ? 'text-white selection:bg-knls-orange/30 selection:text-white' : 'text-slate-900 selection:bg-knls-blue/30 selection:text-white'}`}>
      
      <CustomCursor isDark={isDark} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onSelect={setActiveBook} isDark={isDark} />

      {/* Cinematic Mode Exit Hint overlay */}
      <AnimatePresence>
        {isCinematicMode && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[200] group"
           >
             <button onClick={() => setIsCinematicMode(false)} className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border text-[10px] font-bold uppercase tracking-[0.2em] transition-all opacity-20 hover:opacity-100 ${isDark ? 'border-white/20 bg-black/50 text-white' : 'border-black/20 bg-white/50 text-black'}`}>
                <Expand size={14} className="rotate-180" />
                Exit Gallery Mode
             </button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Grain Overlay */}
      <div className={`fixed inset-0 z-[100] ${isDark ? 'opacity-[0.06]' : 'opacity-[0.08]'} pointer-events-none`} style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Base Background */}
      <div className={`fixed inset-0 pointer-events-none z-[-2] transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`} />
      
      {/* Frosted Glass + Sun Layout */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* The "Sun" */}
        <div className={`absolute top-0 right-1/4 w-[60vw] max-w-[800px] aspect-square rounded-full blur-[100px] transition-colors duration-1000 transform -translate-y-1/3 ${isDark ? 'bg-knls-orange/30' : 'bg-knls-orange/15'}`} />
        
        {/* Secondary Glow */}
        <div className={`absolute bottom-0 left-1/4 w-[60vw] max-w-[800px] aspect-square rounded-full blur-[120px] transition-colors duration-1000 transform translate-y-1/3 ${isDark ? 'bg-knls-blue/50' : 'bg-knls-blue/10'}`} />

        {/* Frosted glass overlay */}
        <div className={`absolute inset-0 backdrop-blur-[60px] transition-colors duration-500 ${isDark ? 'bg-[#050505]/40' : 'bg-slate-50/40'}`} />
      </div>

      <LayoutGroup>
        <Nav 
          isDark={isDark} 
          toggleTheme={() => setIsDark(!isDark)} 
          isMotionPaused={isMotionPaused} 
          toggleMotionPause={() => setUserMotionPaused(isMotionPaused ? false : true)}
          isCinematicMode={isCinematicMode}
          toggleCinematicMode={() => setIsCinematicMode(!isCinematicMode)}
          openCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
        <Hero isDark={isDark} />
        <FeaturedAuthor onBookClick={setActiveBook} isDark={isDark} />
        <Showcase 
          onBookClick={setActiveBook} 
          activeBookId={activeBook?.uniqueId} 
          isDark={isDark} 
          isMotionPaused={isMotionPaused} 
          isCinematicMode={isCinematicMode}
        />
        
        <AnimatePresence>
          {activeBook && (
            <BookModal book={activeBook} onClose={() => setActiveBook(null)} isDark={isDark} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
