import { useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { DisplayBook } from '../types';

interface Props {
  book: DisplayBook;
  isHovered: boolean;
  isOthersHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  isActive: boolean;
  isDark: boolean;
  isMotionPaused?: boolean;
  isShelfView?: boolean;
}

export default function BookCard({ book, isHovered, isOthersHovered, onHover, onLeave, onClick, isActive, isDark, isMotionPaused, isShelfView }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt properties - reduced sensitivity
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const tiltX = useSpring(useTransform(mouseY, [0, 1], [10, -10]), { damping: 50, stiffness: 80 });
  const tiltY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { damping: 50, stiffness: 80 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMotionPaused || isShelfView) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    onLeave();
  };

  // Compute declarative styling classes/states instead of per-frame physics
  let cardWidth = isShelfView ? 'w-[160px] md:w-[220px]' : (isHovered ? 'w-[220px] md:w-[380px]' : (isOthersHovered ? 'w-[140px] md:w-[200px]' : 'w-[200px] md:w-[280px]'));
  
  return (
    <div className={`flex items-center gap-6`} ref={containerRef}>
      <span 
        className={`writing-vertical transform rotate-180 text-[10px] font-bold tracking-[0.3em] font-sans whitespace-nowrap transition-opacity duration-300 ${isDark ? 'text-white' : 'text-knls-blue'} ${isActive ? 'opacity-0' : 'opacity-30'}`}
      >
        {book.month}
      </span>
      <motion.div
        animate={{
          scale: isActive ? 0.9 : (isHovered ? 1.05 : (isOthersHovered ? 0.95 : 1)),
          rotateY: isShelfView ? 0 : (isHovered ? 0 : 5),
          z: isShelfView ? 0 : (isHovered ? 20 : 0)
        }}
        transition={{ type: "spring", damping: 30, stiffness: 70 }}
        className={`perspective-[1500px] transform-style-3d cursor-pointer flex-shrink-0 h-[300px] md:h-[480px] transition-[width] duration-700 ease-out ${cardWidth} ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseEnter={onHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${book.title} by ${book.author}`}
        aria-describedby={`book-desc-${book.uniqueId}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
         {/* Mouse Tilt Wrapper */}
         <motion.div 
           style={{ rotateX: !isMotionPaused && !isShelfView ? tiltX : 0, rotateY: !isMotionPaused && !isShelfView ? tiltY : 0, transformStyle: 'preserve-3d' }}
           className="w-full h-full"
         >
            {/* The layout morphing container for GSAP-like Flip */}
            <motion.div 
              className={`w-full h-full rounded-r-xl rounded-l-sm flex flex-col justify-end p-6 relative overflow-visible group shadow-2xl ${
                isDark 
                  ? 'bg-zinc-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
                  : 'bg-white/90 backdrop-blur-xl shadow-[0_0_40px_rgba(45,44,142,0.15)]'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Dimming Overlay Layer */}
              <div 
                className={`absolute inset-0 rounded-r-xl rounded-l-sm bg-black pointer-events-none z-50 transition-opacity duration-500`}
                style={{ opacity: (isOthersHovered && !isShelfView) ? 0.6 : 0, transform: 'translateZ(5px)' }}
              />

              {/* Spine */}
              <div 
                className="absolute top-0 left-0 w-[40px] h-full origin-left opacity-90"
                style={{ 
                  transform: 'rotateY(-90deg)', 
                  backgroundColor: '#111', 
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`
                }}
              >
                 <div className={`w-full h-full opacity-80 bg-gradient-to-br ${book.coverGradient} shadow-inner border-r border-black/30`} />
              </div>

              {/* Pages (Right Side) */}
              <div 
                className={`absolute top-1 bottom-1 right-0 w-[38px] origin-right ${isDark ? 'bg-zinc-300' : 'bg-[#f4f1ea]'}`}
                style={{ 
                  transform: 'rotateY(90deg)',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
                }}
              />

              {/* Pages (Top) */}
              <div 
                className={`absolute top-0 left-1 right-1 h-[40px] origin-top ${isDark ? 'bg-zinc-300' : 'bg-[#f4f1ea]'}`}
                style={{ 
                  transform: 'rotateX(90deg)',
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
                }}
              />
              
              {/* Pages (Bottom) */}
              <div 
                className={`absolute bottom-0 left-1 right-1 h-[40px] origin-bottom ${isDark ? 'bg-zinc-300' : 'bg-[#f4f1ea]'}`}
                style={{ 
                  transform: 'rotateX(-90deg)',
                  backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)'
                }}
              />

              {/* Back Cover */}
              <div 
                className={`absolute inset-0 rounded-l-xl rounded-r-sm bg-gradient-to-br ${book.coverGradient} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`}
                style={{ transform: 'translateZ(-40px)' }}
              />

              {/* Front Cover Base */}
              <motion.div 
                layoutId={`book-cover-${book.uniqueId}`}
                className={`absolute inset-0 bg-gradient-to-br ${book.coverGradient} z-0 opacity-90 group-hover:opacity-100 transition-opacity duration-500 rounded-r-xl rounded-l-sm border-l-4 border-white/10 overflow-hidden`}
                style={{ transform: 'translateZ(1px)' }}
              >
                {book.coverImage && (
                  <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                )}
              </motion.div>
              
              <div className={`absolute inset-0 bg-gradient-to-t z-10 rounded-r-xl rounded-l-sm ${isDark ? 'from-black/95 via-black/40' : 'from-slate-900/95 via-slate-900/30'} to-transparent`} style={{ transform: 'translateZ(2px)' }} />

              <div id={`book-desc-${book.uniqueId}`} className={`relative z-20 layout-content transition-transform duration-500 delay-75`} style={{ transform: `translateZ(3px) translateY(${isHovered || isShelfView ? '0px' : '8px'})` }}>
                 <div className="w-10 h-[2px] bg-white/40 mb-4" />
                 <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white mb-1 line-clamp-2 leading-tight drop-shadow-md">
                    {book.title}
                 </h3>
                 <p className="text-xs md:text-sm text-zinc-300 italic font-serif transition-opacity drop-shadow opacity-90">
                    {book.author}
                 </p>
              </div>
            </motion.div>
         </motion.div>
      </motion.div>
    </div>
  );
}
