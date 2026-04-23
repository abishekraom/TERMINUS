import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * TrackLayer
 * 
 * Renders the historical path (trail) of a selected asset
 * as a glowing line on the globe's surface.
 */
export default function TrackLayer({ track, getCoordinatesFromLatLng }) {
  const points = useMemo(() => {
    if (!track || track.length < 2) return null;
    
    return track.map((p) => {
      // Return Vector3
      return getCoordinatesFromLatLng(p.lat, p.lon, 1.005);
    });
  }, [track, getCoordinatesFromLatLng]);

  const geometry = useMemo(() => {
    if (!points) return null;
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  if (!geometry) return null;

  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color="#00ffff" 
        linewidth={2} 
        transparent 
        opacity={0.6} 
        depthWrite={false}
      />
    </line>
  );
}
