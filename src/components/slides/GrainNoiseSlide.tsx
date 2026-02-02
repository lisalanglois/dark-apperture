import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

const grainHotspots: Hotspot[] = [
  {
    id: 'halide',
    x: 30,
    y: 40,
    title: 'Random Silver Halide Distribution',
    description: 'Film grain is created by microscopic silver halide crystals that are randomly distributed in the emulsion. This natural randomness creates organic, pleasing texture.',
  },
  {
    id: 'iso',
    x: 70,
    y: 30,
    title: 'Film ISO Sensitivity',
    description: 'Higher ISO films have larger silver halide crystals, producing more visible grain but capturing light more efficiently in low-light conditions.',
  },
  {
    id: 'chemical',
    x: 50,
    y: 70,
    title: 'Chemical Development Process',
    description: 'The development process chemically transforms exposed silver halide into metallic silver, with each crystal developing independently.',
  },
];

const noiseHotspots: Hotspot[] = [
  {
    id: 'snr',
    x: 30,
    y: 35,
    title: 'Sensor Signal-to-Noise Ratio',
    description: 'Digital noise appears when the signal from photons is weak relative to the electronic interference in the sensor circuitry.',
  },
  {
    id: 'amplification',
    x: 65,
    y: 45,
    title: 'ISO Amplification',
    description: 'Unlike film, digital ISO amplifies the sensor signal electronically, also amplifying noise in the process.',
  },
  {
    id: 'interpolation',
    x: 50,
    y: 75,
    title: 'Pixel Interpolation',
    description: 'Bayer pattern sensors require mathematical interpolation to reconstruct color, which can introduce color noise patterns.',
  },
];

const HotspotMarker: React.FC<{
  hotspot: Hotspot;
  isActive: boolean;
  onClick: () => void;
}> = ({ hotspot, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
    className={`
      absolute -translate-x-1/2 -translate-y-1/2 z-10
      w-6 h-6 rounded-full border-2 
      transition-all duration-300
      ${isActive 
        ? 'bg-accent border-accent scale-125' 
        : 'bg-transparent border-foreground/50 hover:border-accent hover:scale-110'
      }
    `}
  >
    <span className={`
      absolute inset-0 rounded-full animate-ping
      ${isActive ? 'bg-accent/50' : 'bg-foreground/20'}
    `} />
  </button>
);

export const GrainNoiseSlide: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [activeType, setActiveType] = useState<'grain' | 'noise' | null>(null);

  const handleHotspotClick = (hotspot: Hotspot, type: 'grain' | 'noise') => {
    if (activeHotspot?.id === hotspot.id) {
      setActiveHotspot(null);
      setActiveType(null);
    } else {
      setActiveHotspot(hotspot);
      setActiveType(type);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
          Grain <span className="text-muted-foreground">vs.</span> Noise
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          Click the hotspots to explore the technical differences
        </p>
      </motion.div>

      {/* Comparison container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Analog Grain */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 relative"
        >
          <div className="absolute top-4 left-4 z-20">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Analog</span>
            <h3 className="font-serif text-2xl text-foreground">Film Grain</h3>
          </div>

          <div className="relative h-full rounded-xl overflow-hidden border border-border">
            {/* Grain image with texture */}
            <img
              src="https://images.unsplash.com/photo-1518173946687-a4c036bc8ce4?w=800"
              alt="Film grain example"
              className="w-full h-full object-cover"
              style={{
                filter: activeType === 'grain' ? 'brightness(0.7)' : 'none',
              }}
            />
            
            {/* Grain overlay texture */}
            <div 
              className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Hotspots */}
            {grainHotspots.map(hotspot => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot?.id === hotspot.id}
                onClick={() => handleHotspotClick(hotspot, 'grain')}
              />
            ))}
          </div>

          {/* Label */}
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-safe rounded-lg px-4 py-2 border border-border">
            <span className="font-mono text-xs text-accent">Texture • Organic • Random</span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-2">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>

        {/* Digital Noise */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 relative"
        >
          <div className="absolute top-4 left-4 z-20">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Digital</span>
            <h3 className="font-serif text-2xl text-foreground">Sensor Noise</h3>
          </div>

          <div className="relative h-full rounded-xl overflow-hidden border border-border">
            {/* Noise image */}
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800"
              alt="Digital noise example"
              className="w-full h-full object-cover"
              style={{
                filter: activeType === 'noise' ? 'brightness(0.7)' : 'none',
              }}
            />

            {/* Digital noise overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Hotspots */}
            {noiseHotspots.map(hotspot => (
              <HotspotMarker
                key={hotspot.id}
                hotspot={hotspot}
                isActive={activeHotspot?.id === hotspot.id}
                onClick={() => handleHotspotClick(hotspot, 'noise')}
              />
            ))}
          </div>

          {/* Label */}
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-safe rounded-lg px-4 py-2 border border-border">
            <span className="font-mono text-xs text-accent">Artifacts • Uniform • Pattern</span>
          </div>
        </motion.div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-30 px-4"
          >
            <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-xs text-accent uppercase tracking-wider">
                    {activeType === 'grain' ? 'Analog' : 'Digital'}
                  </span>
                  <h4 className="font-serif text-xl text-foreground">{activeHotspot.title}</h4>
                </div>
                <button
                  onClick={() => {
                    setActiveHotspot(null);
                    setActiveType(null);
                  }}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {activeHotspot.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
