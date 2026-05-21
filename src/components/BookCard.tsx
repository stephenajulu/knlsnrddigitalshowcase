import { useRef } from 'react';
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
}

export default function BookCard({ book, isHovered, isOthersHovered, onHover, onLeave, onClick, isActive, isDark }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isHovered, isOthersHovered, isActive });
  stateRef.current = { isHovered, isOthersHovered, isActive };

  // Core properties for 3D Bay Window and Flex expansion
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(0.85);
  const translateZ = useMotionValue(0);
  const opacity = useMotionValue(0.6);
  const width = useMotionValue(240);

  // Apply silky smooth physics
  const smoothRotateY = useSpring(rotateY, { damping: 25, stiffness: 120 });
  const smoothScale = useSpring(scale, { damping: 25, stiffness: 120 });
  const smoothTranslateZ = useSpring(translateZ, { damping: 25, stiffness: 120 });
  const smoothOpacity = useSpring(opacity, { damping: 25, stiffness: 120 });
  const smoothWidth = useSpring(width, { damping: 20, stiffness: 100 });

  // Mouse tilt properties - reduced sensitivity
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const tiltX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { damping: 40, stiffness: 150 });
  const tiltY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { damping: 40, stiffness: 150 });

  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const { isHovered, isOthersHovered, isActive } = stateRef.current;
    
    // Calculate global positioning to skew and scale
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const screenCenterX = window.innerWidth / 2;
    const dist = centerX - screenCenterX;
    
    const maxDist = window.innerWidth * 0.7; // Tweak for curve intensity
    const normalizedDist = Math.max(-1, Math.min(1, dist / maxDist));
    
    // Rotate bounds from roughly +50 to -50 degrees
    rotateY.set(normalizedDist * -50); 
    
    const absDist = Math.abs(normalizedDist);
    scale.set(1.15 - (absDist * 0.3));
    translateZ.set(100 - (absDist * 150));

    // Handle flex expanding dynamically
    let currentTargetWidth = 240;
    if (window.innerWidth < 768) currentTargetWidth = 200; // Smaller on mobile
    if (isHovered) currentTargetWidth = window.innerWidth < 768 ? 260 : 340;
    else if (isOthersHovered) currentTargetWidth = window.innerWidth < 768 ? 160 : 200;
    width.set(currentTargetWidth);

    // Handle seamless dimming without conflicting with `isActive` invisibility
    let targetOpacity = 1 - (absDist * 0.5);
    if (isActive) targetOpacity = 0;
    else if (isOthersHovered) targetOpacity *= 0.4;
    opacity.set(targetOpacity);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
          opacity: smoothOpacity,
          width: smoothWidth
        }}
        className="perspective-[1500px] transform-style-3d cursor-pointer flex-shrink-0 h-[320px] md:h-[400px]"
        onMouseEnter={onHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
         {/* Mouse Tilt Wrapper */}
         <motion.div 
           style={{ rotateX: isHovered ? tiltX : 0, rotateY: isHovered ? tiltY : 0 }}
           className="w-full h-full transform-style-3d transition-transform duration-200"
         >
            {/* The layout morphing container for GSAP-like Flip */}
            <motion.div 
              layoutId={`book-container-${book.uniqueId}`}
              className={`w-full h-full rounded-2xl flex flex-col justify-end p-6 relative overflow-hidden group border shadow-2xl ${
                isDark 
                  ? 'bg-zinc-900/60 backdrop-blur-xl border-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
                  : 'bg-white/80 backdrop-blur-xl border-knls-blue/20 shadow-[0_0_40px_rgba(45,44,142,0.15)]'
              }`}
            >
              {/* Cover Gradient Image Morph */}
              <motion.div 
                layoutId={`book-cover-${book.uniqueId}`}
                className={`absolute inset-0 bg-gradient-to-br ${book.coverGradient} z-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500`}
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t z-10 ${isDark ? 'from-black/95 via-black/40' : 'from-slate-900/95 via-slate-900/30'} to-transparent`} />

              <div className="relative z-20 layout-content transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 delay-75">
                 <div className="w-10 h-[2px] bg-white/40 mb-4" />
                 <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider text-white mb-1 line-clamp-2 leading-tight">
                    {book.title}
                 </h3>
                 <p className="text-xs md:text-sm text-zinc-300 italic font-serif opacity-80 group-hover:opacity-100 transition-opacity">
                    {book.author}
                 </p>
              </div>
            </motion.div>
         </motion.div>
      </motion.div>
    </div>
  );
}
