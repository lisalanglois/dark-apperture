import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Terminal, X } from 'lucide-react';

export const BayardSlide: React.FC = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-background p-8 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 z-10"
      >
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
          Historical Glitch
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          The First "Fake News" — Paris, 1840
        </p>
      </motion.div>

      {/* Main image container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`
          relative max-w-2xl w-full aspect-[3/4] rounded-xl overflow-hidden
          border-4 border-border shadow-2xl
          ${debugMode ? 'glitch-active' : ''}
        `}
      >
        {/* Frame decoration */}
        <div className="absolute inset-4 border border-foreground/10 pointer-events-none z-10" />
        
        {/* The image - Bayard's self-portrait */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/58/Hippolyte_Bayard_-_Autoportrait_en_noy%C3%A9_-_1840.jpg"
          alt="Hippolyte Bayard - Self Portrait as a Drowned Man, 1840"
          className="w-full h-full object-cover"
          style={{
            filter: debugMode ? 'sepia(0.3) contrast(1.1)' : 'sepia(0.5) contrast(0.9)',
          }}
        />

        {/* Scanlines overlay */}
        {debugMode && <div className="absolute inset-0 scanlines pointer-events-none" />}

        {/* Debug overlay */}
        <AnimatePresence>
          {debugMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 p-6 flex flex-col justify-center overflow-y-auto"
            >
              {/* Terminal-style header */}
              <div className="font-mono text-accent text-xs mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span>DEBUG_MODE // HISTORICAL_ANALYSIS</span>
              </div>

              <div className="space-y-4 text-foreground">
                <div className="border-l-2 border-accent pl-4">
                  <h3 className="font-serif text-2xl mb-2">Hippolyte Bayard</h3>
                  <p className="font-mono text-xs text-muted-foreground mb-3">
                    French inventor · Pioneer of photography · 1801-1887
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground mb-3">
                    <span className="text-accent">{'>'}</span> Loading historical context...
                  </p>
                  <p className="leading-relaxed">
                    In 1840, Bayard staged this photograph of himself as a corpse to protest the 
                    French Academy's decision to credit <span className="text-accent">Louis Daguerre</span> as 
                    the sole inventor of photography.
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm">
                  <p className="text-muted-foreground mb-3">
                    <span className="text-accent">{'>'}</span> Extracting embedded message...
                  </p>
                  <blockquote className="italic text-foreground border-l-2 border-muted-foreground pl-3">
                    "The corpse which you see here is that of M. Bayard. The Government, 
                    which has been only too generous to M. Daguerre, has said it can do nothing 
                    for M. Bayard, and the poor wretch has drowned himself."
                  </blockquote>
                  <p className="text-xs text-muted-foreground mt-2">
                    — Written on the back of the photograph by Bayard himself
                  </p>
                </div>

                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <p className="font-mono text-sm">
                    <span className="text-destructive font-bold">⚠ CLASSIFICATION:</span>{' '}
                    First documented case of photographic manipulation used as{' '}
                    <span className="text-accent">protest art</span> and{' '}
                    <span className="text-accent">political commentary</span>.
                  </p>
                </div>

                <p className="font-mono text-xs text-muted-foreground">
                  The photograph is considered one of the earliest examples of "fake news" — 
                  Bayard was very much alive and continued working for another 40+ years.
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setDebugMode(false)}
                className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caption plaque */}
        {!debugMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-safe rounded-lg p-4 border border-border"
          >
            <h3 className="font-serif text-lg text-foreground">
              Self-Portrait as a Drowned Man
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Hippolyte Bayard · Direct positive print · 1840
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* DEBUG button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 z-10"
      >
        <Button
          onClick={() => setDebugMode(!debugMode)}
          variant={debugMode ? 'default' : 'outline'}
          className={`
            font-mono gap-2
            ${debugMode ? 'bg-accent text-accent-foreground hover:bg-accent/90' : 'border-accent text-accent hover:bg-accent/10'}
          `}
        >
          <Terminal className="w-4 h-4" />
          {debugMode ? 'EXIT DEBUG MODE' : 'DEBUG'}
        </Button>
      </motion.div>

      {/* Corner frame elements */}
      <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-border/20" />
      <div className="absolute top-12 right-12 w-24 h-24 border-r-2 border-t-2 border-border/20" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-l-2 border-b-2 border-border/20" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-border/20" />
    </div>
  );
};
