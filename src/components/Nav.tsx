import { Moon, Sun, Pause, Play, Expand, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
  isMotionPaused: boolean;
  toggleMotionPause: () => void;
  isCinematicMode: boolean;
  toggleCinematicMode: () => void;
  openCommandPalette: () => void;
}

export default function Nav({ isDark, toggleTheme, isMotionPaused, toggleMotionPause, isCinematicMode, toggleCinematicMode, openCommandPalette }: Props) {
  return (
    <AnimatePresence>
      {!isCinematicMode && (
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-10 z-50 transition-colors duration-200 ${isDark ? 'glass-nav text-white border-white/10' : 'bg-white/70 backdrop-blur-md text-knls-blue border-b border-black/5 shadow-sm'}`}
        >
          <div className={`flex items-center transition-colors duration-300 ${isDark ? 'bg-white/95 px-3 py-1 rounded-lg shadow-sm' : ''}`}>
            <img 
              src="https://knls.ac.ke/wp-content/uploads/2021/04/KNLS-logo.png" 
              alt="KNLS Logo" 
              className="h-8 md:h-10 object-contain"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  target.nextElementSibling.classList.remove('hidden');
                  target.nextElementSibling.classList.add('flex');
                }
              }}
            />
            <div className="fallback-logo hidden items-center h-8 md:h-10">
              <div className="flex flex-col justify-center h-full mr-2 md:mr-3">
                <div className="flex items-baseline font-bold text-[#35338A] leading-none tracking-tighter">
                  <span className="text-xl md:text-2xl">k</span>
                  <span className="text-xl md:text-2xl uppercase">n</span>
                  <span className="text-xl md:text-2xl uppercase">l</span>
                  <span className="text-xl md:text-2xl">s</span>
                </div>
                <div className="w-full bg-[#EA7B25] h-[6px] md:h-[8px] rounded-b-[50%] mt-[-1px]" />
                <div className="text-[4px] md:text-[5px] uppercase font-bold tracking-wider text-[#35338A] mt-1 text-center shrink-0">
                  Read. Know. Empower
                </div>
              </div>
              <div className="w-[2px] h-[24px] md:h-[30px] bg-[#EA7B25] mx-1 md:mx-2 hidden sm:block"></div>
              <div className="flex-col text-[#35338A] font-semibold hidden sm:flex leading-none justify-center">
                <span className="text-[12px] md:text-[14px] tracking-tight">kenya national</span>
                <span className="text-[12px] md:text-[14px] tracking-tight mt-[2px]">library service</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-medium uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <a href="https://vtabu.knls.ac.ke" target="_blank" rel="noopener noreferrer" className="hover:text-knls-orange transition-colors hidden lg:block">Vtabu E-Library</a>
            <a href="#showcase" className={`hidden md:block ${isDark ? 'text-white border-white' : 'text-knls-blue border-knls-blue'} border-b pb-1 hover:text-knls-orange transition-colors`}>2026 Showcase</a>
            
            <div className="flex items-center gap-1 ml-4 border-l pl-4 border-black/10 dark:border-white/10">
              <button onClick={openCommandPalette} className={`group relative flex items-center gap-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer mr-2`} aria-label="Search" aria-describedby="search-desc">
                <Search size={16} />
                <span className="hidden sm:block opacity-50"><kbd className="font-sans px-1 rounded shadow-sm bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">⌘K</kbd></span>
                <span id="search-desc" className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  Search
                </span>
              </button>
              <button onClick={toggleCinematicMode} className="group relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer" aria-label="Gallery Mode" aria-describedby="gallery-desc">
                <Expand size={16} />
                <span id="gallery-desc" className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  Gallery Mode
                </span>
              </button>
              <button onClick={toggleMotionPause} className="group relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer" aria-label="Toggle Animations" aria-describedby="animations-desc">
                {isMotionPaused ? <Play size={16} /> : <Pause size={16} />}
                <span id="animations-desc" className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  {isMotionPaused ? "Enable Animations" : "Disable Animations"}
                </span>
              </button>
              <button onClick={toggleTheme} className="group relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer" aria-label="Toggle Theme" aria-describedby="theme-desc">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span id="theme-desc" className="absolute -bottom-10 right-0 md:left-1/2 md:-translate-x-1/2 text-[10px] font-bold tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                  {isDark ? "Light Mode" : "Dark Mode"}
                </span>
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
