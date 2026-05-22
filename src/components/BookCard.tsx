import { useRef, MouseEvent } from 'react';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'motion/react';
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
}

export default function BookCard({ book, isHovered, isOthersHovered, onHover, onLeave, onClick, isActive, isDark, isMotionPaused }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isHovered, isOthersHovered, isActive, isMotionPaused });
  stateRef.current = { isHovered, isOthersHovered, isActive, isMotionPaused };

  // Core properties for 3D Bay Window and Flex expansion
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(0.85);
  const translateZ = useMotionValue(0);
  const dimOpacity = useMotionValue(0.4);
  const width = useMotionValue(240);

  // Apply silky smooth physics
  const smoothRotateY = useSpring(rotateY, { damping: 40, stiffness: 60 });
  const smoothScale = useSpring(scale, { damping: 40, stiffness: 60 });
  const smoothTranslateZ = useSpring(translateZ, { damping: 40, stiffness: 60 });
  const smoothDimOpacity = useSpring(dimOpacity, { damping: 40, stiffness: 60 });
  const smoothWidth = useSpring(width, { damping: 40, stiffness: 50 });

  // Mouse tilt properties - reduced sensitivity
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const tiltX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), { damping: 50, stiffness: 80 });
  const tiltY = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), { damping: 50, stiffness: 80 });

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const { isHovered, isOthersHovered, isActive, isMotionPaused } = stateRef.current;
    
    // Calculate global positioning to skew and scale
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const screenCenterX = window.innerWidth / 2;
    const dist = centerX - screenCenterX;
    
    const maxDist = window.innerWidth * 0.7; // Tweak for curve intensity
    const normalizedDist = Math.max(-1, Math.min(1, dist / maxDist));
    
    // Rotate bounds from roughly +50 to -50 degrees
    rotateY.set(isMotionPaused ? 0 : normalizedDist * -50); 
    
    const absDist = Math.abs(normalizedDist);
    scale.set(isMotionPaused ? 0.9 : 1.15 - (absDist * 0.3));
    translateZ.set(isMotionPaused ? 0 : 100 - (absDist * 150));

    // Handle flex expanding dynamically
    let currentTargetWidth = 240;
    if (window.innerWidth < 768) currentTargetWidth = 180; // Smaller on mobile
    if (isHovered) currentTargetWidth = window.innerWidth < 768 ? 220 : 340;
    else if (isOthersHovered) currentTargetWidth = window.innerWidth < 768 ? 140 : 200;
    width.set(currentTargetWidth);

    if (isMotionPaused) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }

    // Handle seamless dimming without conflicting with `isActive` invisibility
    let targetDim = isMotionPaused ? 0 : (absDist * 0.5);
    if (isActive) targetDim = 1;
    else if (isOthersHovered) targetDim += 0.4;
    dimOpacity.set(targetDim);
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (stateRef.current.isMotionPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    onLeave();
  };

  return (
    <div className="flex items-center gap-6" ref={containerRef}>
      <span 
        className={`writing-vertical transform rotate-180 text-[10px] font-bold tracking-[0.3em] font-sans opacity-30 whitespace-nowrap transition-opacity duration-300 ${isDark ? 'text-white' : 'text-knls-blue'}`}
        style={{ opacity: isActive ? 0 : undefined }}
      >
        {book.month}
      </span>
      <motion.div
        style={{ 
          rotateY: smoothRotateY, 
          scale: smoothScale, 
          z: smoothTranslateZ, 
          width: smoothWidth,
          opacity: isActive ? 0 : 1
        }}
        className="perspective-[1500px] transform-style-3d cursor-pointer flex-shrink-0 h-[320px] md:h-[400px]"
        onMouseEnter={onHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
         {/* Mouse Tilt Wrapper */}
         <motion.div 
           style={{ rotateX: isHovered ? tiltX : 0, rotateY: isHovered ? tiltY : 0, transformStyle: 'preserve-3d' }}
           className="w-full h-full transition-transform duration-200"
         >
            {/* The layout morphing container for GSAP-like Flip */}
            <motion.div 
              layoutId={`book-container-${book.uniqueId}`}
              className={`w-full h-full rounded-r-xl rounded-l-sm flex flex-col justify-end p-6 relative overflow-visible group shadow-2xl ${
                isDark 
                  ? 'bg-zinc-900/60 backdrop-blur-xl shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
                  : 'bg-white/80 backdrop-blur-xl shadow-[0_0_40px_rgba(45,44,142,0.15)]'
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Dimming Overlay Layer */}
              <motion.div 
                className="absolute inset-0 rounded-r-xl rounded-l-sm bg-black pointer-events-none z-50 transition-opacity"
                style={{ opacity: smoothDimOpacity, transform: 'translateZ(5px)' }}
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
                className={`absolute inset-0 bg-gradient-to-br ${book.coverGradient} z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500 rounded-r-xl rounded-l-sm border-l-4 border-white/10 overflow-hidden`}
                style={{ transform: 'translateZ(1px)' }}
              >
                {book.coverImage && (
                  <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" />
                )}
              </motion.div>
              
              <div className={`absolute inset-0 bg-gradient-to-t z-10 rounded-r-xl rounded-l-sm ${isDark ? 'from-black/95 via-black/40' : 'from-slate-900/95 via-slate-900/30'} to-transparent`} style={{ transform: 'translateZ(2px)' }} />

              <div className="relative z-20 layout-content transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 delay-75" style={{ transform: 'translateZ(3px)' }}>
                 <div className="w-10 h-[2px] bg-white/40 mb-4" />
                 <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white mb-1 line-clamp-2 leading-tight drop-shadow-md">
                    {book.title}
                 </h3>
                 <p className="text-xs md:text-sm text-zinc-300 italic font-serif opacity-80 group-hover:opacity-100 transition-opacity drop-shadow">
                    {book.author}
                 </p>
              </div>
            </motion.div>
         </motion.div>
      </motion.div>
    </div>
  );
}
