
# The First Black Box — Photography Portfolio Presentation

## Overview
A dark-themed, slide-based interactive presentation exploring photography as a QA process. Features an immersive "Hardware Evolution Lab" with three iconic camera models, interactive learning mechanics, and cinematic vertical parallax navigation.

---

## Slide 1: Title Screen
**"The First Black Box"**
- Minimalist typography with elegant serif/mono font pairing
- Subtitle: "Photography as a QA Process" with subtle fade-in animation
- Dark background with subtle ambient grain texture
- Down arrow indicator pulsing to invite navigation

---

## Slide 2: The Hardware Evolution Lab
**"The Evolution of the Machine"**

A chronological timeline showing the technical evolution of cameras, with 3 selectable devices.

### Timeline Navigation
- Horizontal timeline bar at the top showing: V0 → V1 → V2
- Visual markers for each era with years (1500s, 1850s, 1976)
- Click to switch between camera models with smooth transitions

### Camera 1: The Pinhole (V0 - Alpha)
**"The Code Source"**
- **Visual:** Low-poly wooden box with visible pinhole, rotatable 3D model
- **Context Panel:** Quote from da Vinci on light physics
- **Interaction:** Aperture Size slider
  - At 0: Complete darkness
  - Sweet spot: Sharp projected image
  - Max: Overblown and blurry
- **Learning:** "Light Physics 101"

### Camera 2: Sinar 4x5 View Camera (V1 - The Configurable)
**"The System Administrator's Tool"**
- **Visual:** Low-poly large format camera with bellows (accordion), on rail system
- **Context Panel:** "Used by Atget and architects. Like modifying environment parameters."
- **Interaction:** Shift/Tilt toggle buttons
  - Shift: Lens plane moves, corrects converging verticals (building perspective)
  - Tilt: Focus plane rotates, Scheimpflug principle demonstration
- **Visual Feedback:** Split view showing before/after of architectural correction
- **Learning:** "Advanced Configuration"

### Camera 3: Canon AE-1 (V2 - The Speed)
**"The Decisive Moment"**
- **Visual:** Low-poly chrome/black 1980s SLR, classic styling
- **Context Panel:** "The arrival of electronics. Now it's about capturing Time."
- **Interaction:** Shutter Speed dial (1/15 → 1/60 → 1/125 → 1/500)
- **Game Mechanic:** 
  - Moving subject appears on screen
  - User sets speed and clicks "SHOOT"
  - 1/15: Motion blur (failed)
  - 1/500: Frozen sharp image (success!)
- **Learning:** "Performance Optimization"

### Unlock Mechanic
- Each camera has a "mastery" indicator
- Complete all 3 interactions to unlock Slide 3
- Progress saved to local storage

---

## Slide 3: Grain vs. Noise Comparison
**Side-by-side comparison view**

- **Left: Analog Grain** - Organic texture with clickable hotspots
  - "Random Silver Halide Distribution"
  - "Film ISO sensitivity"
  - "Chemical development process"
  
- **Right: Digital Noise** - Pixelated artifacts with hotspots
  - "Sensor Signal-to-Noise Ratio"
  - "ISO amplification"
  - "Pixel interpolation"

---

## Slide 4: Historical Glitch — Bayard
**The First Fake News (1840)**

- Large display of Hippolyte Bayard's self-portrait as a drowned man
- "DEBUG" button reveals glitch overlay with the story
- First photographic manipulation as protest art

---

## Slide 5: Artist Portfolio (Morvan & Cyanotype)
**Horizontal gallery with Punctum Mode**

- Smooth horizontal scrolling gallery of B&W photos
- **Punctum Mode:** Hover on focal points dims the rest of image
- Lazy-loaded for performance

---

## Technical Implementation
- **3D Strategy:** Low-poly stylized models using React Three Fiber, optimized geometry
- **Fallback:** If 3D causes performance issues, use parallax 2D layers with depth effect
- **Animations:** Framer Motion for vertical parallax slide transitions
- **State:** Local storage for camera mastery progress
- **Styling:** Dark theme with Tailwind CSS
