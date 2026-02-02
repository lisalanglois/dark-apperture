import React from 'react';
import { SlideContainer } from '@/components/presentation/SlideContainer';
import { TitleSlide } from '@/components/slides/TitleSlide';
import { HardwareLabSlide } from '@/components/slides/HardwareLabSlide';
import { GrainNoiseSlide } from '@/components/slides/GrainNoiseSlide';
import { BayardSlide } from '@/components/slides/BayardSlide';
import { PortfolioSlide } from '@/components/slides/PortfolioSlide';
import { usePresentationState } from '@/hooks/usePresentationState';

const Index: React.FC = () => {
  const {
    progress,
    setCurrentSlide,
    setCameraMastery,
    isSlideUnlocked,
    allCamerasMastered,
  } = usePresentationState();

  return (
    <SlideContainer
      currentSlide={progress.currentSlide}
      onSlideChange={setCurrentSlide}
      isSlideUnlocked={isSlideUnlocked}
    >
      {/* Slide 0: Title */}
      <TitleSlide />

      {/* Slide 1: Hardware Evolution Lab */}
      <HardwareLabSlide
        cameraMastery={progress.cameraMastery}
        onMasterCamera={setCameraMastery}
        allMastered={allCamerasMastered}
      />

      {/* Slide 2: Grain vs Noise */}
      <GrainNoiseSlide />

      {/* Slide 3: Bayard - Historical Glitch */}
      <BayardSlide />

      {/* Slide 4: Portfolio Gallery */}
      <PortfolioSlide />
    </SlideContainer>
  );
};

export default Index;
