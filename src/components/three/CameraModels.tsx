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
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Aperture glow intensity based on slider
  const glowIntensity = apertureSize > 0.3 && apertureSize < 0.7 ? 2 : 0.5;
  const glowColor = apertureSize > 0.3 && apertureSize < 0.7 ? '#f59e0b' : '#666';

  return (
    <group ref={groupRef}>
      {/* Main wooden box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.5, 2]} />
        <meshStandardMaterial 
          color="#4a3728"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Wood grain detail - top panel */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[2.05, 0.02, 2.05]} />
        <meshStandardMaterial 
          color="#3d2d1e"
          roughness={0.9}
        />
      </mesh>

      {/* Front panel with pinhole */}
      <mesh position={[0, 0, 1.01]}>
        <boxGeometry args={[1.9, 1.4, 0.05]} />
        <meshStandardMaterial 
          color="#2d1f14"
          roughness={0.7}
        />
      </mesh>

      {/* Pinhole aperture */}
      <mesh position={[0, 0, 1.05]}>
        <cylinderGeometry args={[0.02 + apertureSize * 0.1, 0.02 + apertureSize * 0.1, 0.1, 16]} />
        <meshStandardMaterial 
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={glowIntensity}
        />
      </mesh>

      {/* Light cone visualization */}
      {apertureSize > 0.1 && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3 + apertureSize * 0.5, 1.8, 16, 1, true]} />
          <meshBasicMaterial 
            color="#f59e0b"
            transparent
            opacity={0.1 * apertureSize}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Corner metal brackets */}
      {[[-0.95, 0.7, 0.95], [0.95, 0.7, 0.95], [-0.95, -0.7, 0.95], [0.95, -0.7, 0.95]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Back projection screen */}
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
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (lensRef.current) {
      lensRef.current.rotation.x = tiltActive ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
      lensRef.current.position.y = shiftActive ? Math.sin(state.clock.elapsedTime * 2) * 0.15 : 0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rail base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[3.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Front standard (lens board) */}
      <group ref={lensRef} position={[1.2, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Lens */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.3, 0.3, 24]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Glass element */}
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

      {/* Bellows (accordion) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-0.3 + i * 0.2, 0, 0]}>
          <boxGeometry args={[0.02, 0.9 - i * 0.03, 0.6 - i * 0.02]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#1a1a1a' : '#0a0a0a'} />
        </mesh>
      ))}

      {/* Rear standard (film holder) */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.15, 1.4, 1]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Ground glass */}
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

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Prism housing */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.8, 0.4, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Chrome top plate */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.82, 0.06, 0.82]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Lens mount */}
      <mesh position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lens barrel */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Focus ring */}
      <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.03, 8, 32]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Front element */}
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

      {/* Shutter speed dial */}
      <mesh position={[0.6, 0.6, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 24]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Speed indicator mark */}
      <mesh position={[0.6, 0.65, 0.1]}>
        <boxGeometry args={[0.02, 0.02, 0.05]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
      </mesh>

      {/* Film advance lever */}
      <mesh position={[0.8, 0.55, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Viewfinder eyepiece */}
      <mesh position={[0, 0.7, -0.35]}>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Canon logo area (subtle) */}
      <mesh position={[-0.5, 0.3, 0.41]}>
        <boxGeometry args={[0.4, 0.1, 0.01]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Shutter button */}
      <mesh position={[0.75, 0.53, 0.25]}>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};
