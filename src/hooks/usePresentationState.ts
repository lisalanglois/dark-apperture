import { useLocalStorage } from './useLocalStorage';

export interface CameraMastery {
  pinhole: boolean;
  viewCamera: boolean;
  slr: boolean;
}

export interface PresentationProgress {
  currentSlide: number;
  cameraMastery: CameraMastery;
  slide2Unlocked: boolean;
  slide3Unlocked: boolean;
}

const initialProgress: PresentationProgress = {
  currentSlide: 0,
  cameraMastery: {
    pinhole: false,
    viewCamera: false,
    slr: false,
  },
  slide2Unlocked: true, // Always accessible from start
  slide3Unlocked: false, // Requires completing all cameras
};

export function usePresentationState() {
  const [progress, setProgress] = useLocalStorage<PresentationProgress>(
    'blackbox-presentation-progress',
    initialProgress
  );

  const setCurrentSlide = (slide: number) => {
    setProgress(prev => ({ ...prev, currentSlide: slide }));
  };

  const setCameraMastery = (camera: keyof CameraMastery, mastered: boolean) => {
    setProgress(prev => {
      const newMastery = { ...prev.cameraMastery, [camera]: mastered };
      const allMastered = newMastery.pinhole && newMastery.viewCamera && newMastery.slr;
      return {
        ...prev,
        cameraMastery: newMastery,
        slide3Unlocked: allMastered,
      };
    });
  };

  const resetProgress = () => {
    setProgress(initialProgress);
  };

  const isSlideUnlocked = (slideIndex: number): boolean => {
    if (slideIndex <= 1) return true;
    if (slideIndex === 2) return progress.slide3Unlocked;
    return progress.slide3Unlocked; // Slides 3-4 available after completing lab
  };

  const allCamerasMastered = 
    progress.cameraMastery.pinhole && 
    progress.cameraMastery.viewCamera && 
    progress.cameraMastery.slr;

  return {
    progress,
    setCurrentSlide,
    setCameraMastery,
    resetProgress,
    isSlideUnlocked,
    allCamerasMastered,
  };
}
