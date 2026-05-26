import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { featuredAuthor, books } from '../data';
import { DisplayBook } from '../types';

interface Props {
  onBookClick: (book: DisplayBook) => void;
  isDark: boolean;
}

export default function FeaturedAuthor({ onBookClick, isDark }: Props) {
  const authorBooks = books.filter(b => featuredAuthor.bookIds.includes(b.id));
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["20vh", "0vh", "0vh", "-20vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.9]);
  const filter = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity, y, scale, filter }}
      className="py-32 px-6 md:px-24 relative z-20 flex flex-col items-center justify-center min-h-[70vh]"
    >
      <div className="w-full max-w-5xl">
        <div className="mb-12">
          <h2 className={`text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase mb-2 ${isDark ? 'text-knls-orange' : 'text-knls-orange'}`}>
            Featured Author Spotlight
          </h2>
          <h3 className={`text-4xl md:text-5xl font-light tracking-tight mb-6 ${isDark ? 'text-white' : 'text-knls-blue'}`}>
            {featuredAuthor.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <div className="flex flex-col justify-center">
            <p className={`font-serif text-lg leading-relaxed mb-8 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              "{featuredAuthor.quote}"
            </p>
            <div className={`w-12 h-[1px] mb-8 ${isDark ? 'bg-white/20' : 'bg-knls-blue/20'}`} />
            <p className={`text-sm leading-relaxed mb-8 font-sans ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              {featuredAuthor.bio}
            </p>
            <a href="#" className={`inline-block text-xs uppercase tracking-[0.2em] font-bold border-b pb-1 w-max transition-colors ${isDark ? 'text-white border-white/30 hover:border-white' : 'text-knls-blue border-knls-blue/30 hover:border-knls-blue'}`}>
              Read Full Interview
            </a>
          </div>

          <div className="flex flex-col justify-center">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-6 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
              Featured Works in Showcase
            </h4>
            <div className="flex flex-col gap-4">
              {authorBooks.map(book => (
                <div 
                  key={book.id} 
                  onClick={() => onBookClick({ ...book, uniqueId: `${book.id}-feat` })}
                  className={`group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    isDark 
                      ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]' 
                      : 'border-knls-blue/10 bg-white hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className={`w-16 h-24 rounded bg-gradient-to-br ${book.coverGradient} flex-shrink-0 shadow-lg`} />
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-knls-orange' : 'text-knls-orange'}`}>{book.month} 2026</p>
                    <h5 className={`text-base font-bold uppercase tracking-tight transition-colors ${isDark ? 'text-white group-hover:text-zinc-300' : 'text-knls-blue group-hover:text-knls-blue/80'}`}>{book.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
