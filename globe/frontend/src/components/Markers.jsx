import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Markers({ data, selectedId, getCoordinatesFromLatLng, onMarkerClick }) {
  return (
    <group>
      {data.map((marker, idx) => (
        <Marker 
          key={marker.id || idx} 
          marker={marker} 
          isSelected={selectedId === marker.id}
          onClick={() => onMarkerClick(marker)}
          getCoordinatesFromLatLng={getCoordinatesFromLatLng}
        />
      ))}
    </group>
  );
}

function Marker({ marker, isSelected, onClick, getCoordinatesFromLatLng }) {
  const meshRef = useRef();
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  // Update target position based on 1Hz React state changes
  useEffect(() => {
    const newPos = getCoordinatesFromLatLng(marker.lat, marker.lon, 1.0);
    targetPos.copy(newPos);
    
    // Teleport immediately on mount (when position is 0,0,0)
    if (meshRef.current && meshRef.current.position.lengthSq() < 0.001) {
       meshRef.current.position.copy(targetPos);
    }
  }, [marker.lat, marker.lon, getCoordinatesFromLatLng, targetPos]);

  // Determine color based on type
  // aircraft -> cyan/blue, ship/vessel -> amber/green (per PRD)
  const isAircraft = marker.type && marker.type.toLowerCase().includes('aircraft');
  const color = isAircraft ? '#00e5ff' : '#ffaa00'; // Vibrant Cyan vs Vibrant Amber
  const emissiveColor = isAircraft ? '#00aaff' : '#ff4400';

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smoothly interpolate current position towards targetPos
      // A factor of 1.0 to 2.0 works well for 1Hz updates
      meshRef.current.position.lerp(targetPos, Math.min(1.5 * delta, 1.0));

      // Premium Pulse: Smooth sine with variation per marker
      const time = state.clock.getElapsedTime();
      const pulseSpeed = isSelected ? 4.0 : 2.5; // Faster pulse if selected
      const variation = marker.id.charCodeAt(0) * 0.1;
      
      const baseScale = isSelected ? 1.5 : 0.8;
      const pulseRange = isSelected ? 0.3 : 0.15;
      
      const scaleValue = baseScale + Math.sin(time * pulseSpeed + variation) * pulseRange;
      meshRef.current.scale.set(scaleValue, scaleValue, scaleValue);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* High-detail sphere for markers */}
      <sphereGeometry args={[0.012, 16, 16]} />
      <meshStandardMaterial 
        color={isSelected ? '#ffffff' : color} 
        emissive={isSelected ? '#ffffff' : emissiveColor}
        emissiveIntensity={isSelected ? 10 : 4}
        toneMapped={false}
      />
    </mesh>
  );
}
