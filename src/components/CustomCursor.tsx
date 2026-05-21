import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

export default function CustomCursor({ isDark }: { isDark: boolean }) {
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if it's a touch device - if so, don't show the custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      
      // Look for custom text attributes or generic clickable elements
      if (target.closest('[data-cursor="view"]')) {
        setCursorText('VIEW');
      } else if (target.closest('button') || target.closest('a')) {
         setCursorText(''); // Just normal dot but maybe scaled
      } else {
        setCursorText('');
      }
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('mouseover', handleMouseEnter);
    
    setIsVisible(true);
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('mouseover', handleMouseEnter);
    };
  }, []);
  
  if (window.matchMedia("(pointer: coarse)").matches) return null;

  return (
     <motion.div 
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:flex ${isDark ? 'bg-white' : 'bg-knls-orange'}`}
      style={{
        width: cursorText ? 48 : 12,
        height: cursorText ? 48 : 12,
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
     >
       {cursorText && (
         <span className="text-[10px] font-bold text-black tracking-widest uppercase">{cursorText}</span>
       )}
     </motion.div>
  )
}
