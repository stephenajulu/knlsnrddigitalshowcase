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
    <>
     <motion.div 
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transform -translate-x-1/2 -translate-y-1/2 bg-white blur-[60px] mix-blend-overlay hidden md:block transition-opacity duration-500"
      style={{
        width: 400,
        height: 400,
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible && cursorText === 'VIEW' ? (isDark ? 0.15 : 0.3) : 0,
      }}
     />
     <motion.div 
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${isDark ? 'bg-white border border-black text-black' : 'bg-knls-orange border border-white text-white'} shadow-[0_0_10px_rgba(0,0,0,0.2)] hidden md:flex`}
      style={{
        width: cursorText ? 48 : 12,
        height: cursorText ? 48 : 12,
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
     >
       {cursorText && (
         <span className="text-[10px] font-bold tracking-widest uppercase">{cursorText}</span>
       )}
     </motion.div>
    </>
  )
}
