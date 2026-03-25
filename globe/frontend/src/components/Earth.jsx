import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function Earth() {
  // Use daylight color map to match the user's vibrant physical globe mockup
  const [colorMap, bumpMap, specularMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
  ]);

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.03}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Atmosphere / Glow Effect - Fresnel-like rim lighting */}
      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary softer outer glow */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#0044ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
