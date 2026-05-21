import { Moon, Sun, Pause, Play } from 'lucide-react';

export default function Nav({ isDark, toggleTheme, isMotionPaused, toggleMotionPause }: { isDark: boolean, toggleTheme: () => void, isMotionPaused: boolean, toggleMotionPause: () => void }) {
  return (
    <nav className={`fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-10 z-50 transition-colors duration-200 ${isDark ? 'glass-nav text-white border-white/10' : 'bg-white/70 backdrop-blur-md text-knls-blue border-b border-black/5 shadow-sm'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs ${isDark ? 'bg-white text-black' : 'bg-knls-orange text-white'}`}>
          knls
        </div>
        <span className="text-sm font-semibold tracking-wider uppercase hidden sm:block">
          National Library Services
        </span>
      </div>
      <div className={`flex items-center gap-6 md:gap-8 text-[10px] sm:text-xs font-medium uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
        <a href="#" className="hover:text-knls-orange transition-colors hidden md:block">KNLS Website</a>
        <a href="#" className="hover:text-knls-orange transition-colors">Vtabu E-Library</a>
        <a href="#showcase" className={`${isDark ? 'text-white border-white' : 'text-knls-blue border-knls-blue'} border-b pb-1 hover:text-knls-orange transition-colors`}>2026 Showcase</a>
        <button onClick={toggleMotionPause} className="p-2 rounded-full hover:bg-black/5 hover:bg-white/10 transition-colors cursor-pointer" title={isMotionPaused ? "Play Animations" : "Pause Animations"}>
          {isMotionPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 hover:bg-white/10 transition-colors cursor-pointer">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </nav>
  );
}
