import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface Photo {
  id: string;
  src: string;
  alt: string;
  punctumX: number;
  punctumY: number;
  punctumDescription: string;
}

const galleryPhotos: Photo[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
    alt: 'Portrait with dramatic shadows',
    punctumX: 45,
    punctumY: 35,
    punctumDescription: 'The slight tension in the hands reveals inner turmoil beneath composed exterior',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1534235826754-0a3572d1d6d5?w=800',
    alt: 'Street scene',
    punctumX: 70,
    punctumY: 60,
    punctumDescription: 'A forgotten newspaper, evidence of a moment already passed',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800',
    alt: 'Architectural detail',
    punctumX: 30,
    punctumY: 50,
    punctumDescription: 'The worn edge of the stair, thousands of footsteps crystallized in stone',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=800',
    alt: 'Abstract light and shadow',
    punctumX: 55,
    punctumY: 40,
    punctumDescription: 'Where light meets dark — the boundary of knowing and mystery',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    alt: 'Misty landscape',
    punctumX: 50,
    punctumY: 70,
    punctumDescription: 'The solitary tree, resisting the vastness of an indifferent sky',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    alt: 'Musical instrument detail',
    punctumX: 40,
    punctumY: 55,
    punctumDescription: 'Worn keys speak of countless melodies, each leaving invisible traces',
  },
];

export const PortfolioSlide: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
  const [punctumActive, setPunctumActive] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 px-8 pt-8 pb-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            Artist Portfolio
          </h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">
            Morvan & Cyanotype — Black & White Studies
          </p>
          
          {/* Punctum mode explanation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
            <Eye className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-accent">Punctum Mode:</span> Hover over the glowing points to reveal emotional focal points
            </span>
          </div>
        </div>
      </motion.div>

      {/* Gallery container */}
      <div className="flex-1 relative flex items-center">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-safe hover:bg-secondary transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 z-20 p-3 rounded-full bg-secondary/80 backdrop-blur-safe hover:bg-secondary transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>

        {/* Horizontal scroll gallery */}
        <div
          ref={scrollRef}
          className="flex gap-8 px-16 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {galleryPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-shrink-0 snap-center"
              onMouseEnter={() => setHoveredPhoto(photo.id)}
              onMouseLeave={() => {
                setHoveredPhoto(null);
                setPunctumActive(null);
              }}
            >
              {/* Photo frame */}
              <div className="relative w-80 h-[28rem] rounded-lg overflow-hidden border border-border shadow-xl">
                {/* The image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className={`
                    w-full h-full object-cover transition-all duration-500
                    ${punctumActive === photo.id ? 'brightness-50' : ''}
                  `}
                  style={{
                    filter: hoveredPhoto && hoveredPhoto !== photo.id 
                      ? 'brightness(0.6) saturate(0.5)' 
                      : punctumActive === photo.id
                        ? 'brightness(0.4)'
                        : 'none',
                  }}
                />

                {/* Punctum marker */}
                {hoveredPhoto === photo.id && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setPunctumActive(punctumActive === photo.id ? null : photo.id)}
                    style={{ 
                      left: `${photo.punctumX}%`, 
                      top: `${photo.punctumY}%` 
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <span className={`
                      block w-8 h-8 rounded-full border-2 border-accent
                      ${punctumActive === photo.id ? 'bg-accent' : 'bg-accent/20'}
                      transition-all duration-300
                    `}>
                      <span className="absolute inset-0 rounded-full border border-accent animate-ping" />
                    </span>
                  </motion.button>
                )}

                {/* Punctum highlight zone */}
                {punctumActive === photo.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {/* Spotlight effect */}
                    <div
                      className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        left: `${photo.punctumX}%`,
                        top: `${photo.punctumY}%`,
                        background: 'radial-gradient(circle, transparent 0%, transparent 50%, rgba(0,0,0,0.7) 100%)',
                        boxShadow: 'inset 0 0 50px rgba(245,158,11,0.3)',
                      }}
                    />
                  </motion.div>
                )}

                {/* Punctum description */}
                {punctumActive === photo.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent"
                  >
                    <p className="font-serif text-sm text-foreground italic leading-relaxed">
                      "{photo.punctumDescription}"
                    </p>
                    <p className="font-mono text-xs text-accent mt-2">
                      — The Punctum (Barthes)
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Photo number */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, '0')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex-shrink-0 px-8 py-6 text-center"
      >
        <blockquote className="max-w-2xl mx-auto">
          <p className="font-serif text-lg text-muted-foreground italic">
            "The punctum is that accident which pricks me, bruises me, is poignant to me."
          </p>
          <cite className="font-mono text-xs text-muted-foreground mt-2 block">
            — Roland Barthes, Camera Lucida (1980)
          </cite>
        </blockquote>
      </motion.div>

      {/* Gradient overlays for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};
