import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * ThreatLayer
 * 
 * Renders tactical threat zones as pulsating red translucent circles 
 * on the surface of the earth.
 */
export default function ThreatLayer({ threats, getCoordinatesFromLatLng }) {
  const groupRef = useRef();

  const threatItems = useMemo(() => {
    return threats.map((t) => {
      const pos = getCoordinatesFromLatLng(t.lat, t.lon, 1.001); // slightly above surface
      const color = t.level === 'CRITICAL' ? '#ff0000' : (t.level === 'HIGH' ? '#ff4400' : '#ffaa00');
      // Convert radius (km) to local scale — approximation
      const scale = (t.radius || 200) / 6371; 
      
      return { ...t, pos, color, scale };
    });
  }, [threats, getCoordinatesFromLatLng]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    groupRef.current.children.forEach((mesh, i) => {
      const pulse = 1 + Math.sin(time * 2 + i) * 0.1;
      mesh.scale.set(pulse, pulse, pulse);
      // Opacity oscillation
      if (mesh.material) {
        mesh.material.opacity = 0.3 + Math.sin(time * 2 + i) * 0.1;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {threatItems.map((t) => (
        <mesh 
          key={t.id} 
          position={t.pos} 
          onUpdate={(self) => self.lookAt(0,0,0)} // Orient toward center
        >
          <circleGeometry args={[t.scale, 32]} />
          <meshBasicMaterial 
            color={t.color} 
            transparent 
            opacity={0.4} 
            side={THREE.DoubleSide} 
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
