import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const TitleSlide: React.FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground mb-6"
        >
          The First
          <br />
          <span className="text-accent">Black Box</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="font-mono text-lg md:text-xl text-muted-foreground tracking-wider uppercase"
        >
          Photography as a QA Process
        </motion.p>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-12"
        />

        {/* Version tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-sm text-muted-foreground">v1.0 — Interactive Presentation</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Begin
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-pulse-soft" />
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-border/30" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-border/30" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-border/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-border/30" />
    </div>
  );
};
