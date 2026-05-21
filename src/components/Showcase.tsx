import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue, animate, useScroll, useTransform } from 'motion/react';
import { books } from '../data';
import BookCard from './BookCard';
import { DisplayBook } from '../types';
import { Filter } from 'lucide-react';

interface Props {
  onBookClick: (book: DisplayBook) => void;
  activeBookId?: string;
  isDark: boolean;
  isMotionPaused?: boolean;
}

export default function Showcase({ onBookClick, activeBookId, isDark, isMotionPaused }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const genres = useMemo(() => ["All", ...Array.from(new Set(books.map(b => b.genre)))], []);

  // Filter books (no longer duplicating for infinite scroll)
  const displayBooks: DisplayBook[] = useMemo(() => {
    const filteredSource = activeGenre && activeGenre !== "All" 
      ? books.filter(b => b.genre === activeGenre)
      : books;
    
    return filteredSource.map(b => ({ ...b, uniqueId: `${b.id}-1` }));
  }, [activeGenre]);

  const x = useMotionValue(0);
  const parallaxX = useMotionValue(0);
  const progressWidth = useMotionValue("0%");
  
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Pause if user interacts, modal is open, or motion is paused globally
  const isPaused = hoveredId !== null || activeBookId != null || isMotionPaused;

  useEffect(() => {
    const measure = () => {
      if (scrollTrackRef.current && scrollTrackRef.current.children.length > 0) {
        const firstBook = scrollTrackRef.current.children[0] as HTMLElement;
        const lastBook = scrollTrackRef.current.lastElementChild as HTMLElement;
        if (firstBook && lastBook) {
           setMaxScroll(lastBook.offsetLeft - firstBook.offsetLeft);
        }
      } else {
        setMaxScroll(0);
      }
    };
    measure();
    setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeGenre]);

  useAnimationFrame((time, delta) => {
    if (isPaused || maxScroll <= 0) return;

    const speed = 0.02; // Slowed down
    let nextX = x.get() - speed * delta;

    if (nextX < -maxScroll) {
      nextX = -maxScroll; // Stop at the end
    }

    x.set(nextX);
    parallaxX.set(nextX * -0.2);
    
    if (maxScroll > 0) {
       const p = Math.abs(nextX) / maxScroll;
       progressWidth.set(`${p * 100}%`);
    }
  });

  const handleHoverStart = (id: string, index: number) => {
    setHoveredId(id);
    if (!scrollTrackRef.current) return;
    
    const child = scrollTrackRef.current.children[index] as HTMLElement;
    if (child) {
      centerChild(child);
    }
  };

  const centerChild = (child: HTMLElement) => {
    const childCenter = child.offsetLeft + child.offsetWidth / 2;
    const screenCenter = window.innerWidth / 2;
    let targetX = screenCenter - childCenter;
    
    if (targetX > 0) targetX = 0;
    if (targetX < -maxScroll) targetX = -maxScroll;
    
    animate(x, targetX, { type: 'spring', stiffness: 60, damping: 20 });
    animate(parallaxX, targetX * -0.2, { type: 'spring', stiffness: 60, damping: 20 });
    
    if (maxScroll > 0) {
      const p = Math.abs(targetX) / maxScroll;
      animate(progressWidth, `${p * 100}%`, { duration: 0.3 });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollTrackRef.current) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        
        let currentIndex = displayBooks.findIndex(b => b.uniqueId === hoveredId);
        if (currentIndex === -1) currentIndex = 0; // Default to first if none hovered

        let nextIndex = currentIndex;
        if (e.key === 'ArrowRight') nextIndex = Math.min(currentIndex + 1, displayBooks.length - 1);
        if (e.key === 'ArrowLeft') nextIndex = Math.max(currentIndex - 1, 0);

        setHoveredId(displayBooks[nextIndex].uniqueId);
        const child = scrollTrackRef.current.children[nextIndex] as HTMLElement;
        if (child) centerChild(child);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredId, displayBooks, maxScroll]);

  return (
    <motion.section 
      id="showcase" 
      ref={containerRef} 
      style={{ opacity }}
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

      {/* Filter Bar */}
      <div className="absolute top-24 md:top-32 left-0 w-full z-20 px-6 md:px-10 flex items-center justify-center">
         <div className={`flex items-center gap-4 p-2 rounded-full border backdrop-blur-md overflow-x-auto no-scrollbar max-w-full ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/50'}`}>
            <div className={`pl-2 pr-2 text-xs opacity-50 flex items-center gap-1 ${isDark ? 'text-white' : 'text-black'}`}>
              <Filter size={12} /> <span className="uppercase font-bold tracking-widest hidden md:block">Filter</span>
            </div>
            {genres.map(g => (
              <button 
                key={g} 
                onClick={() => setActiveGenre(g)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                  (activeGenre === g || (g === 'All' && !activeGenre)) 
                    ? (isDark ? 'bg-white text-black' : 'bg-knls-blue text-white') 
                    : (isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5')
                }`}
              >
                {g}
              </button>
            ))}
         </div>
      </div>

      {/* The 3D Perspective container */}
      <div className="bay-window-container w-full h-full perspective-[2000px] z-10 flex border-y border-transparent items-center py-20 cursor-grab active:cursor-grabbing">
        <motion.div 
           ref={scrollTrackRef}
           style={{ x }} 
           drag="x"
           dragConstraints={{ left: -maxScroll, right: 0 }}
           onDragStart={() => setHoveredId("drag")} // pause auto scroll
           onDragEnd={() => setHoveredId(null)}
           dragElastic={0.1}
           dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
           className="flex items-center gap-10 md:gap-20 h-full w-max px-[50vw]"
        >
          {displayBooks.map((book, index) => (
            <div data-cursor="view" key={book.uniqueId}>
              <BookCard 
                book={book} 
                isHovered={hoveredId === book.uniqueId}
                isOthersHovered={hoveredId !== null && hoveredId !== book.uniqueId && hoveredId !== "drag"}
                onHover={() => handleHoverStart(book.uniqueId, index)}
                onLeave={() => setHoveredId(null)}
                onClick={() => onBookClick(book)}
                isActive={activeBookId === book.uniqueId}
                isDark={isDark}
              />
            </div>
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
    </motion.section>
  )
}
