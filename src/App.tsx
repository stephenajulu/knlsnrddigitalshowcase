/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import FeaturedAuthor from './components/FeaturedAuthor';
import Showcase from './components/Showcase';
import BookModal from './components/BookModal';
import { DisplayBook } from './types';

export default function App() {
  const [activeBook, setActiveBook] = useState<DisplayBook | null>(null);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`transition-colors duration-500 font-sans min-h-screen relative overflow-hidden ${isDark ? 'text-white selection:bg-knls-orange/30 selection:text-white' : 'text-slate-900 selection:bg-knls-blue/30 selection:text-white'}`}>
      
      {/* Base Background */}
      <div className={`fixed inset-0 pointer-events-none z-[-2] transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`} />
      
      {/* Frosted Glass + Sun Layout */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* The "Sun" */}
        <div className={`absolute top-0 right-1/4 w-[60vw] max-w-[800px] aspect-square rounded-full blur-[100px] transition-colors duration-1000 transform -translate-y-1/3 ${isDark ? 'bg-knls-orange/30' : 'bg-knls-orange/15'}`} />
        
        {/* Secondary Glow */}
        <div className={`absolute bottom-0 left-1/4 w-[60vw] max-w-[800px] aspect-square rounded-full blur-[120px] transition-colors duration-1000 transform translate-y-1/3 ${isDark ? 'bg-knls-blue/50' : 'bg-knls-blue/10'}`} />

        {/* Frosted glass overlay */}
        <div className={`absolute inset-0 backdrop-blur-[60px] transition-colors duration-500 ${isDark ? 'bg-[#050505]/40' : 'bg-slate-50/40'}`} />
      </div>

      <LayoutGroup>
        <Nav isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
        <Hero isDark={isDark} />
        <FeaturedAuthor onBookClick={setActiveBook} isDark={isDark} />
        <Showcase onBookClick={setActiveBook} activeBookId={activeBook?.uniqueId} isDark={isDark} />
        
        <AnimatePresence>
          {activeBook && (
            <BookModal book={activeBook} onClose={() => setActiveBook(null)} isDark={isDark} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
