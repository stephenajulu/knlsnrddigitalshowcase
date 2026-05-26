import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useAnimationFrame, useMotionValue, animate, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { books } from '../data';
import BookCard from './BookCard';
import { DisplayBook } from '../types';
import { Library, Filter } from 'lucide-react';
import GenreIcon from './GenreIcon';
import { useAudioUI } from '../hooks/useAudioUI';

interface Props {
  onBookClick: (book: DisplayBook) => void;
  onHoverBook?: (book: DisplayBook | null) => void;
  activeBookId?: string;
  isDark: boolean;
  isMotionPaused?: boolean;
  isCinematicMode?: boolean;
}

export default function Showcase({ onBookClick, onHoverBook, activeBookId, isDark, isMotionPaused, isCinematicMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [isShelfView, setIsShelfView] = useState(false);
  const { playHoverTick } = useAudioUI();

  const genres = useMemo(() => ["All", ...Array.from(new Set(books.map(b => b.genre)))], []);

  // Filter books (no longer duplicating for infinite scroll)
  const displayBooks: DisplayBook[] = useMemo(() => {
    const filteredSource = activeGenre && activeGenre !== "All" 
      ? books.filter(b => b.genre === activeGenre)
      : books;
    
    return filteredSource.map(b => ({ ...b, uniqueId: `${b.id}-1` }));
  }, [activeGenre]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [maxScroll, setMaxScroll] = useState(0);

  const x = useMotionValue(0);
  const parallaxX = useTransform(x, v => (v as number) * -0.2);
  const progressWidth = useTransform(x, v => {
    return maxScroll > 0 ? `${(Math.abs(v as number) / maxScroll) * 100}%` : "0%";
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Pause if user interacts, modal is open, or motion is paused globally
  const isPaused = hoveredId !== null || activeBookId != null || isMotionPaused || isShelfView;

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
    if (Math.abs(x.getVelocity()) > 10) return; // let momentum finish

    const speed = 0.01; // Slowed down from 0.02
    let nextX = x.get() - speed * delta;

    if (nextX < -maxScroll) {
      nextX = -maxScroll; // Stop at the end
    }

    x.set(nextX);
  });

  const handleHoverStart = (id: string, index: number) => {
    if (hoveredId !== id && id !== "drag") {
      playHoverTick();
    }
    setHoveredId(id);
    if (onHoverBook) {
      if (id === "drag") onHoverBook(null);
      else onHoverBook(displayBooks.find(b => b.uniqueId === id) || null);
    }
  };

  const handleHoverEnd = () => {
    setHoveredId(null);
    if (onHoverBook) onHoverBook(null);
  };

  const centerChild = (child: HTMLElement) => {
    const childCenter = child.offsetLeft + child.offsetWidth / 2;
    const screenCenter = window.innerWidth / 2;
    let targetX = screenCenter - childCenter;
    
    if (targetX > 0) targetX = 0;
    if (targetX < -maxScroll) targetX = -maxScroll;
    
    animate(x, targetX, { type: 'spring', stiffness: 40, damping: 25 }); // Slowed down from 60/20
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

      <AnimatePresence>
        {!isCinematicMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 md:top-32 left-0 w-full z-20 px-6 md:px-10 flex items-center justify-center"
          >
             <div className={`flex items-center gap-4 p-2 rounded-full border backdrop-blur-md overflow-x-auto no-scrollbar max-w-full ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white/50'}`}>
                <div className={`pl-2 pr-2 text-xs opacity-50 flex items-center gap-1 ${isDark ? 'text-white' : 'text-black'}`} id="filter-desc">
                  <Filter size={12} /> <span className="uppercase font-bold tracking-widest hidden md:block">Filter</span>
                </div>
                {genres.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setActiveGenre(g)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                      (activeGenre === g || (g === 'All' && !activeGenre)) 
                        ? (isDark ? 'bg-white text-black' : 'bg-knls-blue text-white') 
                        : (isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5')
                    }`}
                    aria-label={`Filter by genre: ${g}`}
                    aria-pressed={activeGenre === g || (g === 'All' && !activeGenre)}
                    aria-describedby="filter-desc"
                  >
                    {g !== 'All' && <GenreIcon genre={g} size={14} className="opacity-80" />}
                    {g}
                  </button>
                ))}
                
                <div className={`w-[1px] h-6 mx-2 ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
                
                <button
                  onClick={() => setIsShelfView(!isShelfView)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                    isShelfView 
                      ? (isDark ? 'bg-white text-black' : 'bg-knls-orange text-white') 
                      : (isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-black/60 hover:text-black hover:bg-black/5')
                  }`}
                  aria-label="Toggle Shelf View"
                  aria-pressed={isShelfView}
                >
                  <Library size={14} /> Shelf
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Perspective or Shelf View container */}
      <div className={`bay-window-container w-full h-full ${isShelfView ? '' : 'perspective-[2000px]'} z-10 flex border-y border-transparent ${isShelfView ? 'items-end' : 'items-center'} ${isCinematicMode ? 'py-0' : (isShelfView ? 'pb-24 pt-48' : 'py-20')} transition-all duration-700 relative`}
           style={{ transform: isCinematicMode ? 'scale(1.05)' : 'scale(1)' }}>
        
        {isShelfView && (
          <div className="absolute bottom-[80px] left-0 w-full z-0 pointer-events-none">
            {/* Realistic Shelf Plank */}
            <div className={`w-full h-4 ${isDark ? 'bg-zinc-800 border-t border-white/10' : 'bg-[#e2ddd8] border-t border-black/10'} shadow-[0_10px_30px_rgba(0,0,0,0.5)]`} />
            {/* Wall shadow from books */}
            <div className={`w-full h-24 blur-xl opacity-40 mix-blend-multiply ${isDark ? 'bg-black/50' : 'bg-black/10'} -translate-y-8`} />
          </div>
        )}

        <motion.div 
           ref={scrollTrackRef}
           style={isShelfView ? { scrollbarWidth: 'none', msOverflowStyle: 'none' as const } : { x }} 
           drag={isShelfView ? false : "x"}
           dragConstraints={{ left: -maxScroll, right: 0 }}
           onDragStart={() => setHoveredId("drag")} // pause auto scroll
           onDragEnd={handleHoverEnd}
           dragElastic={0.1}
           dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
           className={`flex gap-10 md:gap-20 h-full w-max ${isShelfView ? 'overflow-x-auto snap-x snap-mandatory no-scrollbar px-[10vw] pb-4 items-end z-10' : 'items-center px-[50vw]'}`}
        >
          {displayBooks.map((book, index) => (
            <div data-cursor="view" key={book.uniqueId} className={isShelfView ? "snap-center" : ""}>
              <BookCard 
                book={book} 
                isHovered={hoveredId === book.uniqueId}
                isOthersHovered={hoveredId !== null && hoveredId !== book.uniqueId && hoveredId !== "drag"}
                onHover={() => handleHoverStart(book.uniqueId, index)}
                onLeave={handleHoverEnd}
                onClick={() => onBookClick(book)}
                isActive={activeBookId === book.uniqueId}
                isDark={isDark}
                isMotionPaused={isMotionPaused}
                isShelfView={isShelfView}
              />
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Progress Bar & Indicators pinned to bottom */}
      <AnimatePresence>
        {!isCinematicMode && !isShelfView && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
