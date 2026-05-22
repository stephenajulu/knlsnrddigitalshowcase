import { Moon, Sun, Pause, Play, Expand, Volume2, VolumeX, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
  isMotionPaused: boolean;
  toggleMotionPause: () => void;
  isCinematicMode: boolean;
  toggleCinematicMode: () => void;
  isAudioPlaying: boolean;
  toggleAudio: () => void;
  openCommandPalette: () => void;
}

export default function Nav({ isDark, toggleTheme, isMotionPaused, toggleMotionPause, isCinematicMode, toggleCinematicMode, isAudioPlaying, toggleAudio, openCommandPalette }: Props) {
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
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs ${isDark ? 'bg-white text-black' : 'bg-knls-orange text-white'}`}>
              knls
            </div>
            <span className="text-sm font-semibold tracking-wider uppercase hidden sm:block">
              National Library Services
            </span>
          </div>
          <div className={`flex items-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-medium uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <a href="#" className="hover:text-knls-orange transition-colors hidden lg:block">Vtabu E-Library</a>
            <a href="#showcase" className={`hidden md:block ${isDark ? 'text-white border-white' : 'text-knls-blue border-knls-blue'} border-b pb-1 hover:text-knls-orange transition-colors`}>2026 Showcase</a>
            
            <div className="flex items-center gap-1 ml-4 border-l pl-4 border-black/10 dark:border-white/10">
              <button onClick={openCommandPalette} className={`flex items-center gap-2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer mr-2`} title="Search (Cmd+K)">
                <Search size={16} />
                <span className="hidden sm:block opacity-50"><kbd className="font-sans px-1 rounded shadow-sm bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">⌘K</kbd></span>
              </button>
              <button onClick={toggleAudio} className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer ${isAudioPlaying ? (isDark ? 'text-[#D4AF37]' : 'text-knls-orange') : ''}`} title={isAudioPlaying ? "Mute Ambient Sound" : "Play Ambient Sound"}>
                {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={toggleCinematicMode} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer" title="Gallery Mode">
                <Expand size={16} />
              </button>
              <button onClick={toggleMotionPause} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer" title={isMotionPaused ? "Play Animations" : "Pause Animations"}>
                {isMotionPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
