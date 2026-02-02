import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface SlideContainerProps {
  children: React.ReactNode[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isSlideUnlocked: (index: number) => boolean;
}

const slideVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    y: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.95,
    zIndex: 0,
  }),
};

const slideTransition = {
  y: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.4 },
  scale: { duration: 0.4 },
};

export const SlideContainer: React.FC<SlideContainerProps> = ({
  children,
  currentSlide,
  onSlideChange,
  isSlideUnlocked,
}) => {
  const [direction, setDirection] = useState(0);
  const totalSlides = children.length;

  const goToSlide = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= totalSlides) return;
    if (!isSlideUnlocked(newIndex)) return;
    
    setDirection(newIndex > currentSlide ? 1 : -1);
    onSlideChange(newIndex);
  }, [currentSlide, totalSlides, onSlideChange, isSlideUnlocked]);

  const goNext = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const canGoNext = currentSlide < totalSlides - 1 && isSlideUnlocked(currentSlide + 1);
  const canGoPrev = currentSlide > 0;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Slide content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0 flex items-center justify-center"
        >
          {children[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation controls */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={!isSlideUnlocked(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === currentSlide 
                ? 'bg-accent w-2 h-6' 
                : isSlideUnlocked(index)
                  ? 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  : 'bg-muted-foreground/10 cursor-not-allowed'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow navigation */}
      {canGoPrev && (
        <button
          onClick={goPrev}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full bg-secondary/50 backdrop-blur-safe hover:bg-secondary transition-colors"
          aria-label="Previous slide"
        >
          <ChevronUp className="w-5 h-5 text-foreground" />
        </button>
      )}

      {canGoNext && (
        <button
          onClick={goNext}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full bg-secondary/50 backdrop-blur-safe hover:bg-secondary transition-colors animate-pulse-soft"
          aria-label="Next slide"
        >
          <ChevronDown className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Slide counter */}
      <div className="fixed bottom-8 right-8 z-50 font-mono text-sm text-muted-foreground">
        <span className="text-foreground">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(totalSlides).padStart(2, '0')}</span>
      </div>
    </div>
  );
};
