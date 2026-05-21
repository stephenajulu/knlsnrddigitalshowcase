import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue, animate } from 'motion/react';
import { books } from '../data';
import BookCard from './BookCard';
import { DisplayBook } from '../types';

interface Props {
  onBookClick: (book: DisplayBook) => void;
  activeBookId?: string;
  isDark: boolean;
}

export default function Showcase({ onBookClick, activeBookId, isDark }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Create infinite scrolling effect by duplicating books
  const displayBooks: DisplayBook[] = useMemo(() => [
    ...books.map(b => ({ ...b, uniqueId: `${b.id}-1` })),
    ...books.map(b => ({ ...b, uniqueId: `${b.id}-2` })),
    ...books.map(b => ({ ...b, uniqueId: `${b.id}-3` })),
    ...books.map(b => ({ ...b, uniqueId: `${b.id}-4` })),
  ], []);

  const x = useMotionValue(0);
  const parallaxX = useMotionValue(0);
  const progressWidth = useMotionValue("0%");
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  // Is mouse over the entire container? (pause auto-scroll entirely if we are hovering a book or modal is open)
  const isPaused = hoveredId !== null || activeBookId != null;

  useEffect(() => {
    const measure = () => {
      if (scrollTrackRef.current && scrollTrackRef.current.children.length > books.length) {
        const firstBook = scrollTrackRef.current.children[0] as HTMLElement;
        const identicalBook = scrollTrackRef.current.children[books.length] as HTMLElement;
        setSingleSetWidth(identicalBook.offsetLeft - firstBook.offsetLeft);
      }
    };
    measure();
    // Run after a short delay to ensure layout is applied
    setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useAnimationFrame((time, delta) => {
    if (isPaused || singleSetWidth <= 0) return;

    const speed = 0.08; // Adjust speed as needed
    let nextX = x.get() - speed * delta;

    // Loop logic for infinite scroll
    // Once we travel exactly singleSetWidth to the left, we wrap back to 0
    if (nextX <= -singleSetWidth) {
      nextX += singleSetWidth;
    }

    x.set(nextX);
    parallaxX.set(nextX * -0.2);
    
    // Update progress bar
    if (singleSetWidth > 0) {
       const p = Math.abs(nextX) / singleSetWidth;
       progressWidth.set(`${p * 100}%`);
    }
  });

  const handleHoverStart = (id: string, index: number) => {
    setHoveredId(id);
    if (!scrollTrackRef.current) return;
    
    const child = scrollTrackRef.current.children[index] as HTMLElement;
    if (child) {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const screenCenter = window.innerWidth / 2;
      let targetX = screenCenter - childCenter;
      
      // If targetX forces a wrap past bounds, we clamp it or just let it be since it's an infinite track
      // With 4 sets, we have plenty of room to center any hovered item without running out of bounds
      // We will just animate it to the centered position!
      
      animate(x, targetX, { type: 'spring', stiffness: 60, damping: 20 });
      animate(parallaxX, targetX * -0.2, { type: 'spring', stiffness: 60, damping: 20 });
      
      if (singleSetWidth > 0) {
        // wrap targetX for progress width between 0 and singleSetWidth
        let modX = Math.abs(targetX) % singleSetWidth;
        const p = modX / singleSetWidth;
        animate(progressWidth, `${p * 100}%`, { duration: 0.3 });
      }
    }
  };

  return (
    <section 
      id="showcase" 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden z-10"
    >
      {/* Background CHRONICLES Text - huge watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
         <motion.div 
           style={{ x: parallaxX }}
           className={`text-[10rem] md:text-[18rem] font-bold opacity-20 select-none tracking-tighter whitespace-nowrap overflow-hidden flex justify-center w-[150vw] ${isDark ? 'text-zinc-900 mix-blend-screen' : 'text-black/5 mix-blend-multiply'}`}
         >
           CHRONICLES
         </motion.div>
      </div>

      {/* The 3D Perspective container */}
      <div className="bay-window-container w-full h-full perspective-[2000px] z-10 flex border-y border-transparent items-center py-20">
        <motion.div 
           ref={scrollTrackRef}
           style={{ x }} 
           className="flex items-center gap-10 md:gap-20 h-full w-max px-[50vw]"
        >
          {displayBooks.map((book, index) => (
            <BookCard 
              key={book.uniqueId} 
              book={book} 
              isHovered={hoveredId === book.uniqueId}
              isOthersHovered={hoveredId !== null && hoveredId !== book.uniqueId}
              onHover={() => handleHoverStart(book.uniqueId, index)}
              onLeave={() => setHoveredId(null)}
              onClick={() => onBookClick(book)}
              isActive={activeBookId === book.uniqueId}
              isDark={isDark}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Progress Bar & Indicators pinned to bottom */}
      <div className={`absolute bottom-8 left-6 md:left-10 text-[8px] md:text-[10px] tracking-[0.3em] uppercase z-10 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
        Chronological Archive Timeline
      </div>
      <div className={`absolute bottom-8 right-6 md:right-10 flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase font-bold z-10 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
        <span>START</span>
        <div className={`w-16 h-[1px] relative ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
           <motion.div 
             className={`absolute top-0 left-0 h-full ${isDark ? 'bg-knls-orange' : 'bg-knls-orange'}`} 
             style={{ width: progressWidth }}
           />
        </div>
        <span>END</span>
      </div>
    </section>
  )
}
