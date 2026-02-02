import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { PinholeCamera, ViewCamera, SLRCamera } from '../three/CameraModels';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Camera, Aperture, Timer, Zap } from 'lucide-react';
import { CameraMastery } from '@/hooks/usePresentationState';

interface HardwareLabSlideProps {
  cameraMastery: CameraMastery;
  onMasterCamera: (camera: keyof CameraMastery, mastered: boolean) => void;
  allMastered: boolean;
}

type CameraType = 'pinhole' | 'viewCamera' | 'slr';

const cameraInfo = {
  pinhole: {
    version: 'V0 — Alpha',
    title: 'The Pinhole',
    subtitle: 'The Code Source',
    year: '~1500s',
    quote: '"The images of illuminated objects pass through a small round hole into a very dark room. You will catch these pictures on a piece of white paper."',
    author: 'Leonardo da Vinci',
    learning: 'Light Physics 101',
    icon: Aperture,
  },
  viewCamera: {
    version: 'V1 — The Configurable',
    title: 'Sinar 4×5',
    subtitle: "The System Administrator's Tool",
    year: '~1850s',
    quote: 'Used by Atget and architects. Like modifying environment parameters — one wrong setting and the image is black.',
    author: 'Large Format Photography',
    learning: 'Advanced Configuration',
    icon: Camera,
  },
  slr: {
    version: 'V2 — The Speed',
    title: 'Canon AE-1',
    subtitle: 'The Decisive Moment',
    year: '1976',
    quote: 'The arrival of electronics. The challenge is no longer perspective, but Time itself.',
    author: 'Henri Cartier-Bresson Era',
    learning: 'Performance Optimization',
    icon: Timer,
  },
};

const CanvasLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="font-mono text-sm text-muted-foreground">Loading 3D Model...</span>
    </div>
  </div>
);

export const HardwareLabSlide: React.FC<HardwareLabSlideProps> = ({
  cameraMastery,
  onMasterCamera,
  allMastered,
}) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType>('pinhole');
  const [apertureSize, setApertureSize] = useState(0);
  const [tiltActive, setTiltActive] = useState(false);
  const [shiftActive, setShiftActive] = useState(false);
  const [shutterSpeed, setShutterSpeed] = useState(0);
  const [isShootingGame, setIsShootingGame] = useState(false);
  const [gameResult, setGameResult] = useState<'success' | 'blur' | null>(null);

  const info = cameraInfo[selectedCamera];
  const Icon = info.icon;

  // Pinhole sweet spot detection
  const isPinholeOptimal = apertureSize >= 0.35 && apertureSize <= 0.65;
  const pinholeBlur = apertureSize < 0.35 ? (0.35 - apertureSize) * 20 : 
                      apertureSize > 0.65 ? (apertureSize - 0.65) * 30 : 0;
  const pinholeBrightness = apertureSize < 0.2 ? 0 : Math.min(1.5, 0.5 + apertureSize);

  // Handle pinhole mastery
  React.useEffect(() => {
    if (isPinholeOptimal && !cameraMastery.pinhole) {
      const timeout = setTimeout(() => onMasterCamera('pinhole', true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isPinholeOptimal, cameraMastery.pinhole, onMasterCamera]);

  // Handle view camera mastery
  React.useEffect(() => {
    if (tiltActive && shiftActive && !cameraMastery.viewCamera) {
      const timeout = setTimeout(() => onMasterCamera('viewCamera', true), 500);
      return () => clearTimeout(timeout);
    }
  }, [tiltActive, shiftActive, cameraMastery.viewCamera, onMasterCamera]);

  const handleShoot = () => {
    setIsShootingGame(true);
    const speedValue = [15, 60, 125, 500][shutterSpeed];
    const isSuccess = speedValue >= 500;
    
    setTimeout(() => {
      setGameResult(isSuccess ? 'success' : 'blur');
      if (isSuccess && !cameraMastery.slr) {
        onMasterCamera('slr', true);
      }
    }, 300);

    setTimeout(() => {
      setIsShootingGame(false);
      setGameResult(null);
    }, 2000);
  };

  const shutterSpeedLabels = ['1/15', '1/60', '1/125', '1/500'];

  return (
    <div className="relative w-full h-full flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            The Evolution of the Machine
          </h2>
          <p className="font-mono text-sm text-muted-foreground">
            Hardware Evolution Lab — Complete all 3 cameras to continue
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {(['pinhole', 'viewCamera', 'slr'] as CameraType[]).map((cam, i) => {
            const isSelected = selectedCamera === cam;
            const isMastered = cameraMastery[cam];
            const camInfo = cameraInfo[cam];

            return (
              <React.Fragment key={cam}>
                {i > 0 && (
                  <div className={`w-16 h-0.5 ${cameraMastery[(['pinhole', 'viewCamera', 'slr'] as CameraType[])[i - 1]] ? 'bg-accent' : 'bg-border'}`} />
                )}
                <button
                  onClick={() => setSelectedCamera(cam)}
                  className={`
                    relative flex flex-col items-center gap-1 p-3 rounded-lg transition-all
                    ${isSelected ? 'bg-secondary ring-2 ring-accent' : 'hover:bg-secondary/50'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isMastered ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}
                  `}>
                    {isMastered ? <Check className="w-5 h-5" /> : <span className="font-mono text-sm">V{i}</span>}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{camInfo.year}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="timeline-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent rounded-full"
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mt-4">
          <Badge variant={allMastered ? 'default' : 'secondary'} className={allMastered ? 'bg-accent text-accent-foreground' : ''}>
            {allMastered ? (
              <>
                <Zap className="w-3 h-3 mr-1" />
                All Systems Mastered — Continue ↓
              </>
            ) : (
              `${Object.values(cameraMastery).filter(Boolean).length}/3 Cameras Mastered`
            )}
          </Badge>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 px-8 pb-8 min-h-0">
        {/* 3D Canvas */}
        <div className="flex-1 relative rounded-xl overflow-hidden bg-secondary/30 border border-border">
          <Suspense fallback={<CanvasLoader />}>
            <Canvas>
              <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={45} />
              <OrbitControls 
                enablePan={false} 
                enableZoom={true}
                minDistance={3}
                maxDistance={8}
                autoRotate
                autoRotateSpeed={0.5}
              />
              <ambientLight intensity={0.3} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#f59e0b" />
              <Environment preset="studio" />

              <AnimatePresence mode="wait">
                {selectedCamera === 'pinhole' && (
                  <PinholeCamera apertureSize={apertureSize} />
                )}
                {selectedCamera === 'viewCamera' && (
                  <ViewCamera tiltActive={tiltActive} shiftActive={shiftActive} />
                )}
                {selectedCamera === 'slr' && (
                  <SLRCamera shutterSpeed={shutterSpeed} />
                )}
              </AnimatePresence>
            </Canvas>
          </Suspense>

          {/* Camera label overlay */}
          <div className="absolute top-4 left-4">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-safe">
              <Icon className="w-3 h-3 mr-1" />
              {info.version}
            </Badge>
          </div>
        </div>

        {/* Info & Controls Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          {/* Info card */}
          <div className="bg-card rounded-xl border border-border p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCamera}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                  {info.title}
                </h3>
                <p className="font-mono text-sm text-accent mb-4">{info.subtitle}</p>
                
                <blockquote className="border-l-2 border-accent pl-4 mb-4">
                  <p className="text-sm text-muted-foreground italic">"{info.quote}"</p>
                  <cite className="text-xs text-muted-foreground mt-2 block">— {info.author}</cite>
                </blockquote>

                <Badge variant="secondary">
                  {info.learning}
                </Badge>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive controls */}
          <div className="bg-card rounded-xl border border-border p-6 flex-1">
            <h4 className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Interactive Controls
            </h4>

            <AnimatePresence mode="wait">
              {selectedCamera === 'pinhole' && (
                <motion.div
                  key="pinhole-controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-sm text-foreground mb-3 block">
                      Aperture Diameter
                    </label>
                    <Slider
                      value={[apertureSize]}
                      onValueChange={([v]) => setApertureSize(v)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="mb-2"
                    />
                    <div className="flex justify-between font-mono text-xs text-muted-foreground">
                      <span>Closed</span>
                      <span className={isPinholeOptimal ? 'text-accent' : ''}>Sweet Spot</span>
                      <span>Wide Open</span>
                    </div>
                  </div>

                  {/* Image preview */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <img
                      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                      alt="Landscape preview"
                      className="w-full h-full object-cover transition-all duration-300"
                      style={{
                        filter: `blur(${pinholeBlur}px) brightness(${pinholeBrightness})`,
                      }}
                    />
                    {isPinholeOptimal && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                      >
                        <div className="text-center">
                          <Check className="w-12 h-12 text-accent mx-auto mb-2" />
                          <span className="font-mono text-sm text-accent">Perfect Exposure!</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {selectedCamera === 'viewCamera' && (
                <motion.div
                  key="view-controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={shiftActive ? 'default' : 'outline'}
                      onClick={() => setShiftActive(!shiftActive)}
                      className={shiftActive ? 'bg-accent text-accent-foreground' : ''}
                    >
                      Shift {shiftActive && '✓'}
                    </Button>
                    <Button
                      variant={tiltActive ? 'default' : 'outline'}
                      onClick={() => setTiltActive(!tiltActive)}
                      className={tiltActive ? 'bg-accent text-accent-foreground' : ''}
                    >
                      Tilt {tiltActive && '✓'}
                    </Button>
                  </div>

                  {/* Architecture preview */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                      <img
                        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400"
                        alt="Building - before"
                        className="w-full h-full object-cover"
                        style={{
                          transform: shiftActive ? 'perspective(500px) rotateX(0deg)' : 'perspective(500px) rotateX(5deg)',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                      <span className="absolute bottom-2 left-2 font-mono text-xs bg-black/70 px-2 py-1 rounded">
                        {shiftActive ? 'Corrected' : 'Converging'}
                      </span>
                    </div>
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary">
                      <img
                        src="https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=400"
                        alt="Focus plane"
                        className="w-full h-full object-cover"
                        style={{
                          filter: tiltActive ? 'none' : 'blur(2px)',
                          transition: 'filter 0.5s ease',
                        }}
                      />
                      <span className="absolute bottom-2 left-2 font-mono text-xs bg-black/70 px-2 py-1 rounded">
                        {tiltActive ? 'Scheimpflug' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  {tiltActive && shiftActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-3 bg-accent/10 rounded-lg border border-accent/30"
                    >
                      <Check className="w-6 h-6 text-accent mx-auto mb-1" />
                      <span className="font-mono text-sm text-accent">Configuration Complete!</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {selectedCamera === 'slr' && (
                <motion.div
                  key="slr-controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="text-sm text-foreground mb-3 block">
                      Shutter Speed
                    </label>
                    <Slider
                      value={[shutterSpeed]}
                      onValueChange={([v]) => setShutterSpeed(v)}
                      min={0}
                      max={3}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between font-mono text-xs">
                      {shutterSpeedLabels.map((label, i) => (
                        <span 
                          key={label}
                          className={shutterSpeed === i ? 'text-accent' : 'text-muted-foreground'}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Moving subject game */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ x: isShootingGame ? 0 : [-100, 100] }}
                        transition={{ 
                          repeat: isShootingGame ? 0 : Infinity, 
                          repeatType: 'reverse', 
                          duration: 1 
                        }}
                        className="relative"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=200"
                          alt="Moving subject"
                          className="w-24 h-24 object-cover rounded-lg"
                          style={{
                            filter: gameResult === 'blur' ? 'blur(8px)' : 'none',
                            transition: 'filter 0.2s',
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Game result overlay */}
                    {gameResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/70"
                      >
                        {gameResult === 'success' ? (
                          <div className="text-center">
                            <Check className="w-12 h-12 text-accent mx-auto mb-2" />
                            <span className="font-mono text-accent">FROZEN! Perfect timing.</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="font-mono text-destructive text-lg">MOTION BLUR</span>
                            <p className="font-mono text-xs text-muted-foreground mt-1">Try faster shutter speed</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  <Button 
                    onClick={handleShoot}
                    disabled={isShootingGame}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isShootingGame ? 'Processing...' : '📸 SHOOT'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
