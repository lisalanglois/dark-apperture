import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PinholeCameraProps {
  apertureSize: number;
}

export const PinholeCamera: React.FC<PinholeCameraProps> = ({ apertureSize }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for viewing angle
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
  });

  // Aperture glow intensity based on slider
  const glowIntensity = apertureSize > 0.3 && apertureSize < 0.7 ? 2 : 0.5;
  const glowColor = apertureSize > 0.3 && apertureSize < 0.7 ? '#f59e0b' : '#666';

  // Realistic pinhole camera: wooden box with pinhole on front, viewing screen on back
  // Typical dimensions: ~20cm x 15cm x 20cm (scaled to 2 x 1.5 x 2 units)
  return (
    <group ref={groupRef}>
      {/* Main wooden box body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial 
          color="#4a3728"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Wood grain detail - top panel (removable lid) */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[2.05, 0.02, 2.05]} />
        <meshStandardMaterial 
          color="#3d2d1e"
          roughness={0.9}
        />
      </mesh>

      {/* Front panel with pinhole aperture */}
      <mesh position={[0, 0, 1.01]}>
        <boxGeometry args={[1.9, 1.4, 0.05]} />
        <meshStandardMaterial 
          color="#2d1f14"
          roughness={0.7}
        />
      </mesh>

      {/* Pinhole aperture - realistic size: 0.2-0.5mm actual, scaled up for visibility */}
      {/* When apertureSize is 0, pinhole is closed; optimal around 0.4-0.6 */}
      <mesh position={[0, 0, 1.05]}>
        <cylinderGeometry args={[
          Math.max(0.01, 0.01 + apertureSize * 0.08), // Min 0.01, max ~0.09
          Math.max(0.01, 0.01 + apertureSize * 0.08), 
          0.1, 
          16
        ]} />
        <meshStandardMaterial 
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>

      {/* Light cone visualization - shows light path through pinhole */}
      {apertureSize > 0.1 && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[
            0.2 + apertureSize * 0.4, // Base radius based on aperture
            1.8, // Length of box
            16, 
            1, 
            true // Open ended
          ]} />
          <meshBasicMaterial 
            color="#f59e0b"
            transparent
            opacity={0.15 * apertureSize}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Corner metal brackets (reinforcement) */}
      {[[-0.95, 0.7, 0.95], [0.95, 0.7, 0.95], [-0.95, -0.7, 0.95], [0.95, -0.7, 0.95]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Back projection screen (ground glass or paper) - where image forms */}
      <mesh position={[0, 0, -0.99]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshBasicMaterial 
          color="#1a1a1a"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export const ViewCamera: React.FC<{ tiltActive: boolean; shiftActive: boolean }> = ({ tiltActive, shiftActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lensRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for viewing angle
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  // Tilt: rotation around X axis (forward/backward tilt of lens plane)
  // In real view cameras, tilt rotates the lens board around a horizontal axis
  // Positive tilt angle (in radians) - realistic range: -15° to +15° (≈ -0.26 to +0.26 rad)
  const tiltAngle = tiltActive ? 0.15 : 0; // ~8.6 degrees when active
  
  // Shift: vertical movement of lens board (up/down shift)
  // In real view cameras, shift moves the lens board vertically
  // Realistic shift range: typically ±20-30mm, scaled to our model
  const shiftY = shiftActive ? 0.2 : 0; // Static vertical offset when active

  return (
    <group ref={groupRef}>
      {/* Rail base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front standard (lens board) - with tilt and shift */}
      <group 
        ref={lensRef} 
        position={[1.2, shiftY, 0]}
        rotation={[tiltAngle, 0, 0]}
      >
        {/* Lens board */}
        <mesh>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Lens barrel */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.3, 0.3, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glass element (front lens) */}
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 24]} />
          <meshStandardMaterial 
            color="#88ccff"
            transparent
            opacity={0.3}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Bellows (accordion) - connects front and rear standards */}
      {/* Realistic bellows: leather/black fabric, accordion folds */}
      {Array.from({ length: 8 }).map((_, i) => {
        // Bellows taper from front to back (wider at front, narrower at back)
        const bellowsY = shiftActive ? shiftY * (1 - i / 8) : 0; // Gradual shift effect
        const bellowsHeight = 0.9 - i * 0.03; // Tapering height
        const bellowsDepth = 0.6 - i * 0.02; // Tapering depth
        return (
          <mesh key={i} position={[-0.3 + i * 0.2, bellowsY, 0]}>
            <boxGeometry args={[0.02, bellowsHeight, bellowsDepth]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#1a1a1a' : '#0a0a0a'} 
              roughness={0.9}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Rear standard (film holder) - stays fixed */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.15, 1.4, 1]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ground glass (viewing screen) */}
      <mesh position={[-1.25, 0, 0]}>
        <planeGeometry args={[0.9, 0.7]} />
        <meshBasicMaterial color="#333" side={THREE.DoubleSide} />
      </mesh>

      {/* Tripod connection point */}
      <mesh position={[0, -0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

export const SLRCamera: React.FC<{ shutterSpeed: number }> = ({ shutterSpeed }) => {
  const groupRef = useRef<THREE.Group>(null);
  const shutterDialRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle rotation for viewing angle
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    // Rotate shutter speed dial based on selected speed
    if (shutterDialRef.current) {
      // Map shutterSpeed (0-3) to rotation angle
      // Each speed step = 90 degrees rotation
      const targetRotation = (shutterSpeed * Math.PI) / 2; // 0, π/2, π, 3π/2
      shutterDialRef.current.rotation.z = THREE.MathUtils.lerp(
        shutterDialRef.current.rotation.z,
        targetRotation,
        0.1
      );
    }
  });

  // Canon AE-1: Classic 1980s SLR camera
  // Realistic proportions: body ~14cm x 9cm x 5cm (scaled)
  return (
    <group ref={groupRef}>
      {/* Main body - black textured plastic */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Pentaprism housing (top hump) - houses the viewfinder prism */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Chrome top plate - characteristic of AE-1 */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.82, 0.06, 0.82]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Lens mount (FD mount for Canon AE-1) */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lens barrel - typical 50mm lens proportions */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Focus ring - textured for grip */}
      <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.03, 8, 32]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front lens element - glass with slight blue tint */}
      <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
        <meshStandardMaterial 
          color="#4488cc"
          transparent
          opacity={0.4}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* Shutter speed dial - rotates based on selected speed */}
      <mesh ref={shutterDialRef} position={[0.6, 0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 24]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Speed indicator mark - fixed position showing current selection */}
      <mesh position={[0.6, 0.65, 0.1]}>
        <boxGeometry args={[0.02, 0.02, 0.05]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
      </mesh>
      
      {/* Shutter speed labels on dial - realistic positions */}
      {['15', '60', '125', '500'].map((label, i) => {
        const angle = (i * Math.PI * 2) / 4;
        const radius = 0.18;
        return (
          <mesh
            key={label}
            position={[
              0.6 + Math.cos(angle) * radius,
              0.6 + Math.sin(angle) * radius,
              0.05
            ]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <boxGeometry args={[0.01, 0.02, 0.01]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        );
      })}

      {/* Film advance lever - characteristic of AE-1 */}
      <mesh position={[0.8, 0.55, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Viewfinder eyepiece - where photographer looks through */}
      <mesh position={[0, 0.7, -0.35]}>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Canon logo area (subtle branding) */}
      <mesh position={[-0.5, 0.3, 0.41]}>
        <boxGeometry args={[0.4, 0.1, 0.01]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Shutter release button - top right, chrome */}
      <mesh position={[0.75, 0.53, 0.25]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};
