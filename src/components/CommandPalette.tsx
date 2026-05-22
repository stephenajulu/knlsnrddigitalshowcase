import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { books } from '../data';
import { DisplayBook } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (book: DisplayBook) => void;
  isDark: boolean;
}

export default function CommandPalette({ isOpen, onClose, onSelect, isDark }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) { /* controlled externally */ }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(query.toLowerCase()) || 
    b.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-black/60' : 'bg-slate-900/20'}`}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className={`relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'} flex flex-col`}
          >
            <div className={`flex items-center px-4 py-4 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <Search className={isDark ? 'text-zinc-500' : 'text-slate-400'} size={20} />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Search books or authors..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none px-4 text-base ${isDark ? 'text-white placeholder-zinc-500' : 'text-slate-900 placeholder-slate-400'}`}
              />
              <button onClick={onClose} className={`p-1 rounded-md ${isDark ? 'hover:bg-zinc-800 text-zinc-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto w-full p-2">
              {filteredBooks.length === 0 ? (
                <div className={`px-4 py-8 text-center text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  No results found.
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => {
                      onSelect({ ...book, uniqueId: `${book.id}-cmd` });
                      onClose();
                    }}
                    className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                      isDark ? 'hover:bg-zinc-800/50 focus:bg-zinc-800/50' : 'hover:bg-slate-50 focus:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-14 rounded bg-gradient-to-br ${book.coverGradient} flex-shrink-0`} />
                    <div className="flex-1 overflow-hidden">
                      <h4 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{book.title}</h4>
                      <p className={`text-xs truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{book.author}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{book.genre}</span>
                  </button>
                ))
              )}
            </div>
            
            <div className={`px-4 py-2 border-t text-[10px] flex items-center justify-between font-bold uppercase tracking-widest ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-100 text-slate-400'}`}>
              <span>Use tracking to search</span>
              <span className="flex gap-1 items-center"><kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>ESC</kbd> to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
